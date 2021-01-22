import { Component, createElement, useState } from "react";
import { TreeNode } from "react-organizational-chart";
import { DraggableItem } from "./DraggableItem";

//Defining the custom Node here

export const Node = props => {
    //Multiple props of the custom Node
    const { onDrag, onDrop, node, item, toggleOpen, isOpen } = props;

    //Method to render children of a node. Receives children as param
    const _renderChildrenTreeNodes = children =>
        children.map(item => (
            //Make a Node out of every child passed to this method
            <Node onDrag={onDrag} onDrop={onDrop} node={node} item={item} toggleOpen={toggleOpen} isOpen={isOpen} />
        ));

    //Define hasChildren
    const hasChildren = item.children && item.children.length > 0;

    //Return content to be rendered.
    return hasChildren ? (
        //A react org chart lib TreeNode
        <TreeNode
            label={
                //Make the label of the TreeNode a DraggableItem, show option (-/+) to toggle open the node and render children if isOpen
                <div>
                    <DraggableItem onDrop={onDrop(item)} onDrag={onDrag(item)}>
                        {node(item)}
                    </DraggableItem>
                    <div onClick={() => toggleOpen(item)}>{isOpen(item) ? `-` : `+`}</div>
                </div>
            }
        >
            {isOpen(item) ? _renderChildrenTreeNodes(item.children) : null}
        </TreeNode>
    ) : (
        <TreeNode
            label={
                <DraggableItem onDrop={onDrop(item)} onDrag={onDrag(item)}>
                    {node(item)}
                </DraggableItem>
            }
        />
    );
};
