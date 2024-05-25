import React from "react";
import { Menu, Transition } from "@headlessui/react";
import {
    UserIcon,
    EllipsisVerticalIcon,
    LockClosedIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEventBus } from "@/eventBus";
import { TrashIcon } from "@heroicons/react/24/solid";

const MessageOptionsDropDown = ({ message }) => {
    const { emit } = useEventBus();
    const onMessageDelete = async () => {
        if (message?.id) {
            console.log({ deleteMsg: message });
            await axios
                .delete(route("message.destroy", message.id))
                .then((res) => {
                    console.log(res.data);
                    emit("message.deleted", {
                        message,
                        prevMessage: res.data.message,
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };
    return (
        <div>
            <Menu as="div" className={"relative inline-block text-left"}>
                <div>
                    <Menu.Button
                        className={
                            "flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40"
                        }
                    >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                        <Transition
                            enter="transition ease-out duration-75"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-gray-800 shadow-md z-50">
                                <div className="py-1 px-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <div
                                                onClick={onMessageDelete}
                                                className={`${
                                                    active
                                                        ? "bg-black/30 text-white"
                                                        : "text-gray-100"
                                                } 
                                group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            >
                                                {message && (
                                                    <>
                                                        <TrashIcon className="w-4 h-4 mr-2" />
                                                        Delete Message
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu.Button>
                </div>
            </Menu>
        </div>
    );
};

export default MessageOptionsDropDown;
