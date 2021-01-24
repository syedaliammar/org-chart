import { Component, createElement } from "react";
import { useDrag, useDrop } from "react-dnd";

export const DraggableItem = props => {
    const [, drag] = useDrag({
        item: { type: "node" },
        begin: props.onDrag.execute
    });
    const [, drop] = useDrop({
        accept: "node",
        drop: props.onDrop.execute
    });
    return (
        <div ref={drag}>
            <div ref={drop}>{props.children}</div>
        </div>
    );
};
