import React from "react";
import { UserGroupIcon } from "@heroicons/react/16/solid";

const GroupAvatar = () => {
    return (
        <>
            <div className="avatar-placeholder">
                <div className="bg-gray-400 text-gray-800 rounded-full size-8">
                    <span>
                        <UserGroupIcon />
                    </span>
                </div>
            </div>
        </>
    );
};

export default GroupAvatar;
