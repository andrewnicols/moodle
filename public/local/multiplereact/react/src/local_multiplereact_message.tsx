import * as React from "react";

type Props = {
    message: string;
};

export default function Message({ message }: Props) {
    return (
        <div>
            <strong>Message</strong>
            <div>{message}</div>
        </div>
    );
}
