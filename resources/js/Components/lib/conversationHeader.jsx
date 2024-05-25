import React from "react";
import UserAvatar from "./userAvatar";
import GroupAvatar from "./groupAvatar";
import { Link, usePage } from "@inertiajs/react";
import {
    ArrowLeftIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import { useEventBus } from "@/eventBus";
import axios from "axios";
import GroupUserPopover from "./groupUserPopover";
import GroupDescriptionPopOver from "./groupDescriptionPopOver";

const ConversationHeader = ({ selectedConversation }) => {
    const authUser = usePage().props.auth.user;
    const { emit } = useEventBus();
    const onDeleteGroup = async () => {
        if (!window.confirm("Are you sure you want to delete this group?")) {
            return;
        }
        await axios
            .delete(route("group.destroy", selectedConversation?.id))
            .then((res) => {
                console.log(res.data);
                emit("group.deleted", selectedConversation);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    return (
        <>
            {selectedConversation && (
                <div className="p-3 flex justify-between items-center border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("dashboard")}
                            className="inline-block"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        {selectedConversation.is_user && (
                            <UserAvatar user={selectedConversation} />
                        )}
                        {selectedConversation.is_group && <GroupAvatar />}
                        <div>
                            <h3>{selectedConversation.name}</h3>
                            {selectedConversation.is_group && (
                                <p className="text-xs text-gray-500">
                                    {selectedConversation.users.length} members
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        {selectedConversation.is_group && (
                            <div className="flex gap-3">
                                <GroupDescriptionPopOver
                                    description={
                                        selectedConversation?.description
                                    }
                                />
                                <GroupUserPopover
                                    users={selectedConversation?.users}
                                />

                                {selectedConversation.owner_id ===
                                    authUser.id && (
                                    <>
                                        <div
                                            className="tooltip tooltip-left"
                                            data-tip="Edit Group"
                                        >
                                            <button
                                                onClick={() =>
                                                    emit(
                                                        "GroupModal.show",
                                                        selectedConversation
                                                    )
                                                }
                                                className="text-gray-400 hover:text-gray-300"
                                            >
                                                <PencilSquareIcon className="size-5" />
                                            </button>
                                        </div>
                                        <div
                                            className="tooltip tooltip-left"
                                            data-tip="Delete Group"
                                        >
                                            <button
                                                onClick={onDeleteGroup}
                                                className="text-gray-400 hover:text-gray-300"
                                            >
                                                <TrashIcon className="size-5" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ConversationHeader;
