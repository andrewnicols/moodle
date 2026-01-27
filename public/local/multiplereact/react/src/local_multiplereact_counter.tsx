import * as React from "react";

type Props = {
    initial: number;
};

export default function Counter({ initial }: Props) {
    const [count, setCount] = React.useState(initial);

    return (
        <div>
            <strong>Counter</strong>
            <div>Count: {count}</div>
            <button type="button" onClick={() => setCount((c) => c + 1)}>
                +
            </button>
        </div>
    );
}
