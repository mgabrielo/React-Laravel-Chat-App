import React from "react";
import { Menu, Transition } from "@headlessui/react";
import {
    UserIcon,
    EllipsisVerticalIcon,
    LockClosedIcon,
    LockOpenIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEventBus } from "@/eventBus";

const UserOptionsDropDown = ({ conversation }) => {
    const { emit } = useEventBus();

    const changeUserRole = () => {
        if (!conversation.is_user) {
            return;
        }
        axios
            .post(route("user.changeRole", conversation.id))
            .then((res) => {
                emit(
                    "toast.show",
                    `The User Role of "${res.data.message}" was changed`
                );
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const onBlockUser = () => {
        if (!conversation.is_user) {
            return;
        }
        axios
            .post(route("user.blockUnblock", conversation.id))
            .then((res) => {
                emit(
                    "toast.show",
                    `The User Permission of "${res.data.message}" was changed`
                );
            })
            .catch((err) => {
                console.error(err);
            });
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
                                                onClick={onBlockUser}
                                                className={`${
                                                    active
                                                        ? "bg-black/30 text-white"
                                                        : "text-gray-100"
                                                } 
                                group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            >
                                                {conversation.blocked_at && (
                                                    <>
                                                        <LockOpenIcon className="w-4 h-4 mr-2" />
                                                        Unblock user
                                                    </>
                                                )}
                                                {!conversation.blocked_at && (
                                                    <>
                                                        <LockClosedIcon className="w-4 h-4 mr-2" />
                                                        Block user
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </Menu.Item>
                                </div>
                                <div className="py-1 px-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <div
                                                onClick={changeUserRole}
                                                className={`${
                                                    active
                                                        ? "bg-black/30 text-white"
                                                        : "text-gray-100"
                                                } 
                                group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            >
                                                {conversation.is_admin && (
                                                    <>
                                                        <UserIcon className="w-4 h-4 mr-2" />
                                                        Remove Admin Status
                                                    </>
                                                )}
                                                {!conversation.is_admin && (
                                                    <>
                                                        <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                                        Grant Admin Status
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

export default UserOptionsDropDown;
