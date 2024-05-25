import { useEventBus } from "@/eventBus";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import UserAvatar from "./userAvatar";
import { Link } from "@inertiajs/react";

const MessageNotification = () => {
    const [toastMsgs, setToastMsgs] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on("newMessageNotification", ({ message, group_id, user }) => {
            const uuid = uuidV4();
            setToastMsgs((prev) => [...prev, { message, uuid, user }]);
            setTimeout(() => {
                setToastMsgs(toastMsgs.filter((toast) => toast.uuid !== uuid));
            }, 3000);
        });
    }, [on]);
    return (
        <div className="toast toast-top toast-center z-50 min-w-[240px]">
            {toastMsgs?.length > 0 &&
                toastMsgs?.map((toast) => (
                    <div
                        key={toast.uuid}
                        className="alert alert-success py-2 px-3  text-gray-200 rounded-md"
                    >
                        <Link
                            href={
                                toast.group_id
                                    ? route("chat.group", toast?.group_id)
                                    : route("chat.user", toast?.user?.id)
                            }
                            className="flex items-center gap-2"
                        >
                            <UserAvatar user={toast.user} />
                            <span className="line-clamp-1">
                                {toast.message}
                            </span>
                        </Link>
                    </div>
                ))}
        </div>
    );
};

export default MessageNotification;
