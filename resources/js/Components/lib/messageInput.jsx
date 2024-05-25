import { useState, Fragment } from "react";
import {
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    XCircleIcon,
} from "@heroicons/react/24/solid";
import NewMessageInput from "./newMessageInput";
import axios from "axios";
import { Popover, Transition } from "@headlessui/react";
import EmojiPicker from "emoji-picker-react";
import { isAudio, isImage } from "@/helpers";
import AttachmentPreview from "./attachmentPreview";
import CustomAudioPlayer from "./customAudioPlayer";
import AudioRecorder from "./audioRecorder";
import { useEventBus } from "@/eventBus";

const MessageInput = ({ conversation = null }) => {
    const [newMessage, setNewMessage] = useState("");
    const [chosenFiles, setChosenFiles] = useState([]);
    const [inputErrorMsg, setInputErrorMsg] = useState("");
    const [uploadProgress, setUploadProgress] = useState(null);
    const [messageSending, setMessageSending] = useState(false);
    const { emit } = useEventBus();
    const onFileChange = (e) => {
        const files = e.target.files;
        const updatedFiles = [...files].map((file) => {
            return {
                file: file,
                url: URL.createObjectURL(file),
            };
        });
        setChosenFiles((prev) => {
            return [...prev, ...updatedFiles];
        });
    };

    const onSendClick = async () => {
        if (newMessage.trim() === "" && chosenFiles.length === 0) {
            setInputErrorMsg("Message or Attachement required");
            setTimeout(() => {
                setInputErrorMsg("");
            }, 3000);
            return;
        }
        const formData = new FormData();

        formData.append("message", newMessage);
        if (conversation.is_user) {
            formData.append("receiver_id", conversation.id);
        } else if (conversation.is_group) {
            formData.append("group_id", conversation.id);
        }

        chosenFiles.forEach((chosenFile) => {
            formData.append("attachments[]", chosenFile.file);
        });

        setMessageSending(true);

        await axios
            .post(route("message.store"), formData, {
                onUploadProgress: (progressEvent) => {
                    const progress =
                        Math.round(progressEvent.loaded / progressEvent.total) *
                        100;
                    setUploadProgress(progress);
                },
            })
            .then((res) => {
                setNewMessage("");
                setUploadProgress(0);
                setChosenFiles([]);
                emit("toast.show", "Message Sent Successfully");
            })
            .catch((err) => {
                setChosenFiles([]);
                const errMessage = err?.response?.data?.message;
                setInputErrorMsg(errMessage || "Error Occured Sending Message");
            })
            .finally(() => {
                setMessageSending(false);
            });
    };

    const onLikeClick = async () => {
        if (messageSending) {
            return;
        }

        const data = {
            message: "👍",
        };
        setMessageSending(true);
        if (conversation.is_user) {
            data["receiver_id"] = conversation.id;
        } else if (conversation.is_group) {
            data["group_id"] = conversation.id;
        }
        await axios
            .post(route("message.store", data))
            .then((res) => {
                setNewMessage("");
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setMessageSending(false);
            });
    };

    const recordedAudioReady = (file, url) => {
        setChosenFiles((prev) => {
            return [
                ...prev,
                {
                    file: file,
                    url: url,
                },
            ];
        });
    };

    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="h-5 w-5" />
                    <input
                        type="file"
                        onChange={onFileChange}
                        multiple
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="h-5 w-5" />
                    <input
                        type="file"
                        onChange={onFileChange}
                        multiple
                        accept="image/*"
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                {/* microphone audio recorder */}
                <AudioRecorder fileReady={recordedAudioReady} />
            </div>
            <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex">
                    <NewMessageInput
                        value={newMessage}
                        onSend={onSendClick}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={messageSending}
                    />
                    <button
                        className="btn btn-info rounded-l-none"
                        onClick={onSendClick}
                    >
                        {messageSending && (
                            <span className="loading loading-spinner loading-xs"></span>
                        )}
                        <PaperAirplaneIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
                {!!uploadProgress && (
                    <progress
                        className="progress progress-info w-full"
                        value={uploadProgress}
                        max={100}
                    ></progress>
                )}
                {inputErrorMsg && (
                    <p className="text-xs text-red-400">{inputErrorMsg}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                    {chosenFiles.length > 0 &&
                        chosenFiles.map((chosenFile, idx) => {
                            if (chosenFile) {
                                return (
                                    <div
                                        key={idx}
                                        className={`relative flex justify-between cursor-pointer 
                                        ${
                                            !isImage(chosenFile?.file)
                                                ? "w-[240px]"
                                                : ""
                                        }`}
                                    >
                                        {isImage(chosenFile?.file) && (
                                            <img
                                                src={chosenFile?.url}
                                                alt={chosenFile?.url}
                                                className="w-16 h-16 object-cover"
                                            />
                                        )}
                                        {isAudio(chosenFile?.file) && (
                                            <CustomAudioPlayer
                                                file={chosenFile}
                                                showVolume={false}
                                            />
                                        )}
                                        {!isAudio(chosenFile?.file) &&
                                            !isImage(chosenFile.file) && (
                                                <AttachmentPreview
                                                    file={chosenFile}
                                                />
                                            )}
                                        <button
                                            onClick={() =>
                                                setChosenFiles(
                                                    chosenFiles.filter(
                                                        (clikcedFile) => {
                                                            return (
                                                                clikcedFile.file
                                                                    .name !==
                                                                chosenFile.file
                                                                    .name
                                                            );
                                                        }
                                                    )
                                                )
                                            }
                                            className="absolute w-6 h-6 rounded-full bg-gray-800 -right-2 -top-2 text-gray-300 hover:text-gray-100 z-10"
                                        >
                                            <XCircleIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                );
                            }
                            return null;
                        })}
                </div>
            </div>
            <div className="order-3 xs:order-3 p-2 flex">
                <Popover className={"relative"}>
                    <Popover.Button
                        className={"p-1 text-gray-400 hover:text-gray-300"}
                    >
                        <FaceSmileIcon className="w-5 h-5" />
                    </Popover.Button>
                    <Popover.Panel
                        className={`absolute z-10 right-0 bottom-full`}
                    >
                        <EmojiPicker
                            theme="dark"
                            onEmojiClick={(e) =>
                                setNewMessage(newMessage + e.emoji)
                            }
                        ></EmojiPicker>
                    </Popover.Panel>
                </Popover>
                <button
                    onClick={onLikeClick}
                    className="p-1 text-gray-400 hover:text-gray-300"
                >
                    <HandThumbUpIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
