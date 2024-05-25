import AttachmentPreviewModal from "@/Components/lib/attachmentPreviewModal";
import ConversationHeader from "@/Components/lib/conversationHeader";
import MessageInput from "@/Components/lib/messageInput";
import MessageItem from "@/Components/lib/messageItem";
import { useEventBus } from "@/eventBus";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ChatLayout from "@/Layouts/ChatLayout";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useCallback } from "react";
import { useEffect, useState, useRef } from "react";

export default function Home({ selectedConversation = null, messages = null }) {
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});
    const msgContainerRef = useRef(null);
    const loadMoreIntersect = useRef(null);
    const { on } = useEventBus();
    const messageCreated = (message) => {
        // for group message
        if (
            selectedConversation &&
            message &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group.id
        ) {
            setLocalMessages((prev) => [...prev, message]);
        }
        // for private message
        if (
            (selectedConversation &&
                message &&
                selectedConversation.is_user &&
                selectedConversation.id == message.sender_id) ||
            selectedConversation.id == message.receiver_id
        ) {
            setLocalMessages((prev) => [...prev, message]);
        }
    };

    const messageDeleted = ({ message }) => {
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group.id
        ) {
            setLocalMessages((prev) =>
                prev.filter((msg) => msg.id !== message.id)
            );
        }
        // for private message
        if (
            (selectedConversation &&
                selectedConversation.is_user &&
                selectedConversation.id == message.sender_id) ||
            selectedConversation.id == message.receiver_id
        ) {
            setLocalMessages((prev) =>
                prev.filter((msg) => msg.id !== message.id)
            );
        }
    };

    const loadMoreMessages = useCallback(() => {
        const firstMessage = localMessages[0];
        axios
            .get(route("message.loadOlder", firstMessage.id))
            .then(({ data }) => {
                if (data.data?.length === 0) {
                    setNoMoreMessages(true);
                    return;
                }
                const scrollHeight = msgContainerRef.current.scrollHeight;
                const scrollTop = msgContainerRef.current.scrollTop;
                const clientHeight = msgContainerRef.current.clientHeight;
                const scrollFromBottomTemp =
                    scrollHeight - scrollTop - clientHeight;
                setScrollFromBottom(scrollFromBottomTemp);
                if (data.data.length > 0) {
                    const msgDataReversed = data?.data?.reverse();
                    setLocalMessages((prev) => {
                        return [...msgDataReversed, ...prev];
                    });
                }
            });
    }, [localMessages, noMoreMessages]);

    useEffect(() => {
        setTimeout(() => {
            if (msgContainerRef.current) {
                msgContainerRef.current.scrollTop =
                    msgContainerRef.current.scrollHeight;
            }
        }, 100);
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);
        setScrollFromBottom(0);
        setNoMoreMessages(false);
        return () => {
            offCreated();
            offDeleted();
        };
    }, [selectedConversation]);

    useEffect(() => {
        if (messages && messages?.data?.length > 0) {
            const msgDataReversed = messages?.data?.reverse();
            setLocalMessages((prev) => [...prev, ...msgDataReversed]);
        } else {
            setLocalMessages([]);
        }
    }, [messages]);
    useEffect(() => {
        if (msgContainerRef.current && scrollFromBottom !== null) {
            msgContainerRef.current.scrollTop =
                msgContainerRef.current.scrollHeight -
                msgContainerRef.current.offsetHeight -
                scrollFromBottom;
        }
        if (noMoreMessages) {
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.boundingClientRect.top >= -25) {
                    observer.disconnect();
                    if (entry.isIntersecting) {
                        loadMoreMessages();
                    }
                }
            }),
                {
                    rootMargin: "0px 0px 50px 0px",
                };
        });
        if (loadMoreIntersect.current) {
            setTimeout(() => {
                observer.observe(loadMoreIntersect.current);
            }, 1000);
        }
        return () => {
            observer.disconnect();
        };
    }, [localMessages]);

    const onAttachmentClick = (attachments, index) => {
        setPreviewAttachment((prev) => ({ ...prev, attachments, index }));
        setShowAttachmentPreview(true);
    };

    return (
        <>
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                    <div className="text-2xl md:text-4xl p-16 text-slate-200">
                        Please select conversation to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block" />
                </div>
            )}
            {messages && messages?.data && messages.data.length >= 0 && (
                <div className="flex flex-1 flex-col">
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />
                    <div
                        className="flex-1 overflow-y-auto p-5"
                        ref={msgContainerRef}
                    >
                        {localMessages && localMessages.length === 0 && (
                            <div className="text-slate-200 text-lg">
                                No Messages Available
                            </div>
                        )}
                        {localMessages && localMessages.length > 0 && (
                            <div className="flex-1 flex flex-col">
                                <div ref={loadMoreIntersect} />
                                {localMessages.map((message, index) => (
                                    <MessageItem
                                        key={message.id + "-" + index}
                                        message={message}
                                        attachmentClick={onAttachmentClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </div>
            )}
            {previewAttachment?.attachments && (
                <>
                    <AttachmentPreviewModal
                        attachments={previewAttachment?.attachments}
                        index={previewAttachment?.index}
                        show={showAttachmentPreview}
                        onClose={() => setShowAttachmentPreview(false)}
                    />
                </>
            )}
        </>
    );
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout user={page.props.auth.user}>
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    );
};
