import React from "react";
import { usePage } from "@inertiajs/react";
import ReactMarkDown from "react-markdown";
import UserAvatar from "./userAvatar";
import { formatMessageDateLong } from "@/helpers";
import MessageAttachments from "./messageAttachments";
import MessageOptionsDropDown from "./messageOptionDropDown";

const MessageItem = ({ message, attachmentClick }) => {
    const currentUser = usePage().props.auth.user;

    return (
        <div
            className={`chat ${
                message.sender_id === currentUser.id ? "chat-end" : "chat-start"
            }`}
        >
            {<UserAvatar user={message.sender} />}
            <div className="chat-header">
                {message.sender_id !== currentUser.id
                    ? message.sender.name
                    : ""}
                <time className="text-xs opacity-50 ml-2">
                    {formatMessageDateLong(message.created_at)}
                </time>
            </div>
            <div
                className={`chat-bubble relative flex  ${
                    message.sender_id === currentUser.id
                        ? "chat-bubble-info"
                        : ""
                }`}
            >
                <div className="chat-mesaage">
                    <div className="chat-message-content">
                        <ReactMarkDown className="mt-1">
                            {message?.message}
                        </ReactMarkDown>
                        {message?.attachments?.length > 0 && (
                            <MessageAttachments
                                attachments={message?.attachments}
                                attachmentClick={attachmentClick}
                            />
                        )}
                    </div>
                </div>
                {message?.sender_id == currentUser?.id && (
                    <MessageOptionsDropDown message={message} />
                )}
            </div>
        </div>
    );
};

export default MessageItem;
