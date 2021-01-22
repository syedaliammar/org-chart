import { Component, createElement, useState } from "react";
import { Tree } from "react-organizational-chart";
import { Node } from "./Node";

export const OrgTree = props => {
    const { onDrag, onDrop, node, data, openNodes, toggleOpen } = props;
    /**
     * checks to see if the give item is open
     * @param {ds item} item - the item to check
     * @returns {boolean} - true if the item is open; false if not;
     */
    const isNodeOpen = item => !!openNodes.find(n => n.id === item.id);

    const _renderTreeNodes = map =>
        map != null
            ? map.map(item => (
                  <Node
                      onDrag={onDrag}
                      onDrop={onDrop}
                      node={node}
                      item={item}
                      isOpen={isNodeOpen}
                      toggleOpen={toggleOpen}
                  />
              ))
            : null;
    return <Tree label={null}>{_renderTreeNodes(data)}</Tree>;
};
