import * as React from "react";

type Props = { who: string };

export default function LocalMultipleReactTest({ who }: Props) {
    return (
        <div>
            <strong>Hello from local_multiplereact 👋</strong>
            <div>User: {who}</div>
        </div>
    );
}
