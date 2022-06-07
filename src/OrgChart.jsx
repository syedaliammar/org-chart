import "./ui/OrgChart.css";
import { Component, createElement, useState } from "react";
import { createDataStructure, DataItem } from "./model";
import { DndProvider } from "react-dnd";
import { hot } from "react-hot-loader/root";
import { HTML5Backend } from "react-dnd-html5-backend";
import { OrgTree } from "./components/OrgTree";
import { ActionBar } from "./components/ActionBar";

class OrgChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSearchActivated: false, //Used to determine if search mode is activated. This renders children only one level deeper than the searched node/item
            isParentExpanded: false,
            loaded: false,
            topLevelNodes: [],
            folding: undefined,
            allDataItems: []
        };

        this.setTopLevelNodes = this.setTopLevelNodes.bind(this);
        this.setIsSearchActivated = this.setIsSearchActivated.bind(this);
        this.setFolding = this.setFolding.bind(this);
    }

    setTopLevelNodes(topLevelNodes) {
        this.setState({
            ...this.state,
            topLevelNodes: topLevelNodes
        });
    }

    setFolding(folding) {
        this.setState({
            ...this.state,
            folding: folding
        });
    }

    setIsSearchActivated(newBoolValue) {
        this.setState({
            isSearchActivated: newBoolValue
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.datasource !== this.props.datasource) {
            if (this.props.datasource?.status === "available") {
                this.startTime = performance.now();
                const dataStructure = createDataStructure(
                    this.props.datasource.items,
                    this.props.childkey,
                    this.props.parent,
                    //If no search attribute has been selected, enable search on the childKey by default
                    this.props.searchAttribute == null ? this.props.childkey : this.props.searchAttribute
                );
                const topLevelNodes = dataStructure.getTopLevelNodes();

                this.setState({
                    ...this.state,
                    loaded: true,
                    topLevelNodes,
                    allDataItems: dataStructure
                });

                const endTime = performance.now();
                logger.info(`Elapsed Time: ${endTime - this.startTime}`);
            }
        }
    }

    toggleIsParentExpanded = isParentExpanded => {
        this.setState({
            ...this.state,
            isParentExpanded: isParentExpanded
        });
    };

    setTopLevelNodeById = id => {
        this.toggleIsParentExpanded(!this.state.isParentExpanded);
        const node = this.state.allDataItems.getItemWithID(id);

        this.setTopLevelNodes([node]);
    };

    showParentNavigation = () => {
        if (this.state.isSearchActivated) {
            const parentID = this.state.topLevelNodes[0]._parentID;
            return (
                parentID !== undefined && parentID !== null && this.state.allDataItems.getItemWithID(parentID) !== null
            );
        }
    };

    render() {
        return (
            <div>
                {this.state.loaded ? (
                    <DndProvider backend={HTML5Backend}>
                        <ActionBar
                            {...this.props}
                            allDataItems={this.state.allDataItems}
                            setTopLevelNodes={this.setTopLevelNodes}
                            setIsSearchActivated={this.setIsSearchActivated}
                            setFolding={this.setFolding}
                        ></ActionBar>
                        <div id="org-chart">
                            {this.showParentNavigation() ? (
                                <div
                                    id="parentnav"
                                    className="center"
                                    onClick={() => this.setTopLevelNodeById(this.state.topLevelNodes[0]._parentID)}
                                >
                                    {this.state.isParentExpanded ? "-" : "+"}
                                </div>
                            ) : null}
                            <OrgTree
                                topLevelNodes={this.state.topLevelNodes}
                                onDrop={this.props.onDragEnd}
                                onDrag={this.props.onDragStart}
                                template={this.props.content}
                                folding={this.state.folding}
                                isSearchActivated={this.state.isSearchActivated}
                            />
                        </div>
                    </DndProvider>
                ) : (
                    <div class="mx-progress">
                        <div class="mx-progress-indicator"></div>
                    </div>
                )}
            </div>
        );
    }
}

export default hot(OrgChart);
