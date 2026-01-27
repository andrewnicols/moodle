import * as React from "react";

type Props = {
    label: string;
    message?: string;
};

function requireAmd(mod: string) {
    return new Promise<any>((resolve, reject) => {
        // Use any to avoid TypeScript errors with require.
        (require as any)([mod], resolve, reject);
    });
}

async function showMoodlePopup(message: string) {
    const Notification = await requireAmd("core/notification");
    // Moodle notification popup.
    Notification.alert(message);
}

export default function Button({
    label,
    message = "Hello from local_multiplereact!",
}: Props) {
    const handleClick = () => {
        showMoodlePopup(message).catch((e) => {
            window.console.error("Failed to show Moodle popup", e);
            window.alert(message); // fallback
        });
    };

    return (
        <button type="button" onClick={handleClick}>
            {label}
        </button>
    );
}
