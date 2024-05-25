export const formatMessageDateLong = (date) => {
    const nowDate = new Date();
    const inputDate = new Date(date);
    if (isToday(inputDate)) {
        return inputDate.toLocaleDateString([], {
            hour: "2-digit",
            minute: '2-digit'
        })
    } else if (isYesterDay(inputDate)) {
        return "Yesterday " + inputDate.toLocaleDateString([], {
            hour: "2-digit",
            minute: '2-digit'
        })
    } else if (inputDate.getFullYear() === nowDate.getFullYear()) {
        return inputDate.toLocaleDateString([], {
            day: "2-digit",
            month: 'short'
        })
    } else {
        return inputDate.toLocaleDateString();
    }
}

export const formatMessageDateShort = (date) => {
    const nowDate = new Date();
    const inputDate = new Date(date);
    if (isToday(inputDate)) {
        return inputDate.toLocaleDateString([], {
            hour: "2-digit",
            minute: '2-digit'
        })
    } else if (isYesterDay(inputDate)) {
        return "Yesterday"
    } else if (inputDate.getFullYear() === nowDate.getFullYear()) {
        return inputDate.toLocaleDateString([], {
            day: "2-digit",
            month: 'short'
        })
    } else {
        return inputDate.toLocaleDateString();
    }
}

export const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear() ? today : null
}

export const isYesterDay = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
        date.getDate() === yesterday.getDate &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
    )
}


export const isImage = (attachment) => {
    let mimeOrType = attachment?.type || attachment?.mime
    return mimeOrType?.split('/')[0]?.toLowerCase() === 'image';
}

export const isVideo = (attachment) => {
    let mimeOrType = attachment?.type || attachment?.mime
    return mimeOrType?.split('/')[0]?.toLowerCase() === 'video';
}

export const isAudio = (attachment) => {
    let mimeOrType = attachment?.type || attachment?.mime
    return mimeOrType?.split('/')[0]?.toLowerCase() === 'audio';
}

export const isPDF = (attachment) => {
    let mimeOrType = attachment?.type || attachment?.mime
    return mimeOrType === 'application/pdf'
}

export const isPreviewable = (attachment) => {
    return (
        isImage(attachment) ||
        isVideo(attachment) ||
        isAudio(attachment) ||
        isPDF(attachment)
    )
}

export const formatFileBytes = (bytes, decimals = 2) => {
    if (bytes === 0) {
        return "0 Bytes"
    }
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB"]

    let i = 0
    let size = bytes
    while (size >= k) {
        size /= k;
        i++;
    }
    return parseFloat(size.toFixed(dm) + " " + sizes[i])
}