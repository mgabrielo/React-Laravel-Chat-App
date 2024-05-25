import TextInput from "@/Components/TextInput";
import ConversationItem from "@/Components/lib/conversationItem";
import GroupModal from "@/Components/lib/groupModal";
import { useEventBus } from "@/eventBus";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

const ChatLayout = ({ children }) => {
    const page = usePage();
    // const authUser= page.props.auth.user
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [onlineUsers, setOnlineUsers] = useState({});
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const { on, emit } = useEventBus();
    const isUserOnline = (userId) => {
        return onlineUsers[userId];
    };
    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);
    useEffect(() => {
        setSortedConversations(() => {
            return localConversations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }

                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            });
        });
    }, [localConversations]);

    useEffect(() => {
        Echo.join("online")
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => user && [user?.id, user])
                );
                setOnlineUsers((prev) => ({ ...prev, ...onlineUsersObj }));
            })
            .joining((user) => {
                // console.log("joining : ", user);
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedOnlineUsers = { ...prevOnlineUsers };
                    if (user) {
                        updatedOnlineUsers[user?.id] = user;
                    }
                    return updatedOnlineUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedOnlineUsers = { ...prevOnlineUsers };
                    if (user) {
                        delete updatedOnlineUsers[user.id];
                    }
                    return updatedOnlineUsers;
                });
            })
            .error((err) => {
                console.log("err: ", err);
            });
        return () => {
            Echo.leave("online");
        };
    }, []);
    const onSearch = (e) => {
        const search = e.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) =>
                conversation.name.toLowerCase().includes(search)
            )
        );
    };

    const messageCreated = (message) => {
        setLocalConversations((oldusers) => {
            return oldusers.map((olduser) => {
                if (
                    message.receiver_id &&
                    !olduser.is_group &&
                    (olduser.id == message.sender_id ||
                        olduser.id == message.receiver_id)
                ) {
                    olduser.last_message = message.message;
                    olduser.last_message_date = message.created_at;
                    return olduser;
                }

                if (
                    message.group_id &&
                    olduser.is_group &&
                    olduser.id == message.group_id
                ) {
                    olduser.last_message = message.message;
                    olduser.last_message_date = message.created_at;
                    return olduser;
                }
                return olduser;
            });
        });
    };

    const messageDeleted = ({ prevMessage }) => {
        if (!prevMessage) {
            return;
        }
        messageCreated(prevMessage);
    };

    useEffect(() => {
        const offMsgCreated = on("message.created", messageCreated);
        const offMsgDeleted = on("message.deleted", messageDeleted);
        const offModalShow = on("GroupModal.show", () => {
            setShowGroupModal(true);
        });
        const offGroupDelete = on("group.deleted", ({ id, name }) => {
            setLocalConversations((oldConversations) => {
                return oldConversations.filter(
                    (userConv) => userConv.id !== id
                );
            });
            emit("toast.show", `Group ${name} is currently being deleted`);
            if (
                !selectedConversation ||
                (selectedConversation.is_group && selectedConversation.id == id)
            ) {
                router.visit(route("dashboard"));
            }
        });

        return () => {
            offMsgCreated();
            offMsgDeleted();
            offModalShow();
            offGroupDelete();
        };
    }, [on]);
    return (
        <>
            <div className="flex-1 w-full flex overflow-hidden">
                <div
                    className={` w-full sm:w-[220px] md:w-[330px]
                 bg-slate-800 flex flex-col overflow-hidden
                 transition-all ${
                     selectedConversation ? "-ml-[100%] sm:ml-0" : ""
                 }
                 `}
                >
                    <div className="flex items-center text-white justify-between py-2 px-3 text-xl font-medium">
                        My Conversations
                        <div
                            className="tooltip tooltip-left"
                            data-tip="Create New Group"
                        >
                            <button
                                onClick={() => setShowGroupModal(true)}
                                className="text-gray-400 hover:text-gray-200"
                            >
                                <PencilSquareIcon className="w-4 h-4 inline-block" />
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder={"Filter Users and Groups"}
                            className={"w-full"}
                        />
                    </div>
                    <div className="flex-1 overflow-auto py-2 px-0">
                        {sortedConversations?.length > 0 &&
                            sortedConversations?.map((conversation, index) => {
                                if ("id" in conversation) {
                                    return (
                                        <ConversationItem
                                            key={`${conversation?.id}-${index}`}
                                            conversation={conversation}
                                            online={
                                                !!isUserOnline(conversation?.id)
                                            }
                                            selectedConversation={
                                                selectedConversation
                                            }
                                        />
                                    );
                                }
                                return null;
                            })}
                    </div>
                </div>
                <div className="flex-1 w-full flex overflow-hidden">
                    {children}
                </div>
            </div>
            <GroupModal
                show={showGroupModal}
                onClose={() => setShowGroupModal(false)}
            />
        </>
    );
};

export default ChatLayout;
