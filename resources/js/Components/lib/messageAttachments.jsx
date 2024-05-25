import React from "react";
import {
    PaperClipIcon,
    ArrowDownTrayIcon,
    PlayCircleIcon,
} from "@heroicons/react/24/solid";
import { isPDF, isAudio, isPreviewable, isVideo, isImage } from "@/helpers";
const MessageAttachments = ({ attachments = [], attachmentClick }) => {
    return (
        <>
            {attachments && attachments.length >= 0 && (
                <div className="mt-2 flex flex-wrap justify-end gap-1">
                    {attachments?.map((attachment, index) => {
                        if (attachment) {
                            return (
                                <div
                                    key={attachment.id}
                                    className={`
                            group flex flex-col items-center justify-center text-gray-100 relative cursor-pointer
                            ${
                                isAudio(attachment)
                                    ? "w-84"
                                    : "w-32 aspect-square bg-blue-800"
                            }`}
                                    onClick={() =>
                                        attachmentClick(attachments, index)
                                    }
                                >
                                    {!isAudio(attachment) && attachment.url && (
                                        <a
                                            href={attachment.url}
                                            className={` h-8 w-8 z-20 opacity-20 items-center justify-center group-hover:opacity-100 
                                                    text-gray-100 bg-gray-700 absolute right-0 p-2 rounded-md
                                                    top-0 cursor-pointer hover:bg-gray-800 transition-all`}
                                            download
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ArrowDownTrayIcon className="size-4" />
                                        </a>
                                    )}
                                    {isImage(attachment) && attachment.url && (
                                        <img
                                            src={attachment.url}
                                            alt={attachment.id + "-" + index}
                                            className="object-contain aspect-square"
                                        />
                                    )}
                                    {isVideo(attachment) && attachment.url && (
                                        <div className="relative flex justify-center items-center">
                                            <PlayCircleIcon
                                                className={`z-20 absolute size-16 text-white opacity-70`}
                                            />
                                            <div className="absolute left-0 top-0 size-full bg-black/50 z-10">
                                                <video
                                                    src={attachment.url}
                                                ></video>
                                            </div>
                                        </div>
                                    )}
                                    {isAudio(attachment) && attachment.url && (
                                        <div className="relative flex justify-center items-center">
                                            <audio
                                                src={attachment.url}
                                                controls
                                            ></audio>
                                        </div>
                                    )}
                                    {isPDF(attachment) && attachment.url && (
                                        <div className="relative flex justify-center items-center">
                                            <div className="absolute left-0 top-0 bottom-0 right-0">
                                                <iframe
                                                    src={attachment.url}
                                                    className="size-full"
                                                ></iframe>
                                            </div>
                                        </div>
                                    )}
                                    {!isPreviewable(attachment) &&
                                        attachment.url &&
                                        attachment.name && (
                                            <a
                                                href={attachment.url}
                                                className={`flex flex-col justify-center items-center`}
                                                download
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <PaperClipIcon className="w-10 h-10 mb-3" />
                                                <small className="text-center">
                                                    {attachment.name}
                                                </small>
                                            </a>
                                        )}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            )}
        </>
    );
};

export default MessageAttachments;
