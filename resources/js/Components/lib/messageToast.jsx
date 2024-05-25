import { useEventBus } from "@/eventBus";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

const MessageToast = ({ message }) => {
    const [toastMsgs, setToastMsgs] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on("toast.show", (message) => {
            const uuid = uuidV4();
            setToastMsgs((prev) => [...prev, { message, uuid }]);
            setTimeout(() => {
                setToastMsgs(toastMsgs.filter((toast) => toast.uuid !== uuid));
            }, 3000);
        });
    }, [on]);
    return (
        <div className="toast z-50 min-w-[240px]">
            {toastMsgs?.length > 0 &&
                toastMsgs?.map((toast) => (
                    <div
                        key={toast.uuid}
                        className="alert alert-success py-2 px-3  text-gray-200 rounded-md"
                    >
                        <span>{toast.message}</span>
                    </div>
                ))}
        </div>
    );
};

export default MessageToast;
