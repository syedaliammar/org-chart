import { Component, createElement, useState } from "react";
import { TreeNode } from "react-organizational-chart";
import { DraggableItem } from "./DraggableItem";
import { FoldingCommand } from "../model/folding";

//Defining the custom Node here

export class Node extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: props.initiallyOpen === true,
            openNewChildren: props.initiallyOpen === true
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.folding !== this.props.folding) {
            this.handleNewFolding();
        }
    }

    /**
     * @param {boolean} isOpen
     */
    setIsOpen(isOpen, openNewChildren) {
        this.setState({
            ...this.state,
            isOpen: isOpen,
            openNewChildren: !!openNewChildren
        });
    }

    toggleIsOpen() {
        this.setIsOpen(!this.state.isOpen, false);
    }

    handleNewFolding() {
        const command = this.props.folding.command;
        if (command === FoldingCommand.FoldAll) {
            this.setIsOpen(false);
        } else if (command === FoldingCommand.ExpandAll) {
            this.setIsOpen(true, true);
        } else {
            logger.warn("Unknown folding command", command);
        }
    }

    renderChildrenTreeNodes() {
        const { dataItem, template, onDrag, onDrop, folding } = this.props;
        return dataItem._children.map(item => (
            //Make a Node out of every child passed to this method
            <Node
                key={item.itemID}
                dataItem={item}
                onDrag={onDrag}
                onDrop={onDrop}
                template={template}
                folding={folding}
                initiallyOpen={this.state.openNewChildren}
            />
        ));
    }

    render() {
        const { dataItem, template, onDrag, onDrop, isSearchActivated } = this.props;
        const originalItem = dataItem._originalItem;

        //If search is activated and folding is not FoldAll, show the first level children of the node selected in search. Otherwise, use the value from state
        const isOpen =
            isSearchActivated && this.props.folding.command !== FoldingCommand.FoldAll ? true : this.state.isOpen;

        const hasChildren = dataItem?._children?.length > 0;

        return hasChildren ? (
            //A react org chart lib TreeNode
            <TreeNode
                label={
                    //Make the label of the TreeNode a DraggableItem, show option (-/+) to toggle open the node and render children if isOpen
                    <div>
                        <DraggableItem onDrop={onDrop(originalItem)} onDrag={onDrag(originalItem)}>
                            {template(originalItem)}
                        </DraggableItem>
                        <div onClick={() => this.toggleIsOpen()}>{isOpen ? `-` : `+`}</div>
                    </div>
                }
            >
                {isOpen ? this.renderChildrenTreeNodes() : null}
            </TreeNode>
        ) : (
            <TreeNode
                label={
                    <DraggableItem onDrop={onDrop(originalItem)} onDrag={onDrag(originalItem)}>
                        {template(originalItem)}
                    </DraggableItem>
                }
            />
        );
    }
}
