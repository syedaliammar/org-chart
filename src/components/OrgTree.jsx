import { Component, createElement, useState } from "react";
import { Node } from "./Node";
import { Tree } from "react-organizational-chart";

export const OrgTree = props => {
    const { topLevelNodes, onDrop, onDrag, template, folding, isSearchActivated } = props;
    const pageSize = 50;
    const [visiblePages, setVisiblePages] = useState(1);

    const showPaginationButtons = () => pageSize * visiblePages < topLevelNodes.length;

    return (
        <div>
            <Tree label={null}>
                {topLevelNodes?.slice(0, Math.min(pageSize * visiblePages, topLevelNodes.length)).map(dataItem => (
                    <Node
                        key={dataItem.itemID}
                        dataItem={dataItem}
                        onDrag={onDrag}
                        onDrop={onDrop}
                        template={template}
                        folding={folding}
                        isSearchActivated={isSearchActivated}
                    />
                ))}
            </Tree>

            {showPaginationButtons() ? (
                <div>
                    <button
                        onClick={() => {
                            setVisiblePages(visiblePages + 1);
                        }}
                    >
                        50 More
                    </button>
                    <button
                        onClick={() => {
                            setVisiblePages(visiblePages + 2);
                        }}
                    >
                        100 More
                    </button>
                    <button
                        onClick={() => {
                            setVisiblePages(visiblePages + 10);
                        }}
                    >
                        500 More
                    </button>
                </div>
            ) : null}
        </div>
    );
};
