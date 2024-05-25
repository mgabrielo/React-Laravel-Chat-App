import { MicrophoneIcon, StopCircleIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useState } from "react";

const AudioRecorder = ({ fileReady }) => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recording, setRecording] = useState(false);

    const onMicrophoneClick = async () => {
        if (recording) {
            setRecording(false);
            if (mediaRecorder) {
                mediaRecorder.stop();
                setMediaRecorder(null);
            }
            return;
        } else {
            setRecording(true);
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                const newMediaRecorder = new MediaRecorder(stream);
                const chunks = [];
                newMediaRecorder.addEventListener("dataavailable", (event) => {
                    chunks.push(event.data);
                });
                newMediaRecorder.addEventListener("stop", () => {
                    let audioBlob = new Blob(chunks, {
                        type: "audio/ogg; codecs=opus",
                    });
                    let audioFile = new File(
                        [audioBlob],
                        "recorded_audio.ogg",
                        {
                            type: "audio/ogg; codecs=opus",
                        }
                    );
                    const url = URL.createObjectURL(audioFile);
                    fileReady(audioFile, url);
                });
                newMediaRecorder.start();
                setMediaRecorder(newMediaRecorder);
            } catch (error) {
                setRecording(false);
                console.error("Error Recording Audio:", error);
            }
        }
    };
    return (
        <button
            onClick={onMicrophoneClick}
            className="p-1 text-gray-400 hover:text-gray-200"
        >
            {recording ? (
                <StopCircleIcon className="size-6 text-red-600" />
            ) : (
                <MicrophoneIcon className="size-6" />
            )}
        </button>
    );
};

export default AudioRecorder;
