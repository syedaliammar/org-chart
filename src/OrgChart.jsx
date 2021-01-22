import { Component, createElement, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { hot } from "react-hot-loader/root";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";

import "./ui/OrgChart.css";
import { OrgTree } from "./components/OrgTree";

const OrgChart = props => {
    const { onDragEnd, onDragStart, content, parent, childkey: key, datasource: ds, allowExport } = props;
    const [openNodes, setOpenNodes] = useState([]);
    const exportFileName = "OrgChart";

    /**
     * toggles an item open/closed (so that its children are shown or hidden)
     * @param {ds item} item - the item to toggle open/closed
     */
    const toggleOpen = item => {
        const isOpen = openNodes.find(openNode => {
            return openNode.id === item.id;
        });
        if (isOpen) {
            // close
            setOpenNodes(
                openNodes.filter(openNode => {
                    return openNode.id !== item.id;
                })
            );
        } else {
            setOpenNodes([...openNodes, item]);
        }
    };
    /**
     * removes any found items from the universe so they are not checked again.
     * @param {[ds item]} targets - the ds items that we want to remove from the unviverse
     * @param {[ds item]} universe - the current universe
     *
     */
    const _removeFromUniverse = (targets, universe) => {
        return universe.filter(u => {
            return !targets.find(t => {
                return t.id === u.id;
            });
        });
    };
    /**
     * for each item in `currentLevelArray`, find and attach children from `universe`, recursively
     * @param {[ds item]} currentLevelArray - set of siblings
     * @param {[ds item]} universe - unattached set of ds items
     */
    const _recursivelyBuildTree = (currentLevelArray, universe) => {
        // find all the children of this parent
        currentLevelArray.forEach(item => {
            item.children = universe.filter(candidateChild => {
                return key(item).displayValue === parent(candidateChild).displayValue;
                // ... remove from universe
            });
            if (item.children) {
                universe = _removeFromUniverse(item.children, universe);
                if (universe.length > 0) {
                    _recursivelyBuildTree(item.children, universe);
                }
            }
        });
    };
    /**
     * Identify the top level nodes (those without parents), and begin building the tree
     * @param {mx:datasource} data - the datasource from mendix
     * @returns {[tree structure]} - the converted tree structure ([{id: 1, children:[{id: 2}, {id: 3}]}])
     */
    const _getDataMap = data => {
        if (!data) return null;
        let universe = data,
            ret = [];

        //Get items without parents and items whose parents are not in the data
        ret = data.filter(dataRow => {
            //Items where parent is undefined
            if (parent(dataRow).value === undefined) return true;
            //Items whose parents are not in the data
            else
                return !data.some(potentialParent => {
                    return key(potentialParent).displayValue === parent(dataRow).displayValue;
                });
        });

        // remove first level...
        universe = _removeFromUniverse(ret, universe);
        // for each top level node, recursively build the tree
        _recursivelyBuildTree(ret, universe);
        return ret;
    };

    const _exportToPNG = domNodeToExport => {
        htmlToImage
            .toPng(domNodeToExport)
            .then(function(dataUrl) {
                saveAs(dataUrl, exportFileName + ".png");
            })
            .catch(function(error) {
                console.error("Something went wrong while generating the PNG", error);
            });
    };

    const _exportToSVG = domNodeToExport => {
        htmlToImage
            .toSvg(domNodeToExport)
            .then(function(dataUrl) {
                saveAs(dataUrl, exportFileName + ".svg");
            })
            .catch(function(error) {
                console.error("Something went wrong while generating the SVG", error);
            });
    };

    return (
        <DndProvider backend={HTML5Backend}>
            {allowExport ? (
                <div id="modebar">
                    <button
                        id="export_org_png"
                        title="Download chart as PNG"
                        onClick={() => _exportToPNG(document.getElementById("org_chart"))}
                    >
                        PNG
                    </button>
                    <button
                        id="export_org_svg"
                        title="Download chart as SVG"
                        onClick={() => _exportToSVG(document.getElementById("org_chart"))}
                    >
                        SVG
                    </button>
                </div>
            ) : null}
            <div id="org_chart">
                <OrgTree
                    data={_getDataMap(ds.items)}
                    onDrop={onDragEnd}
                    onDrag={onDragStart}
                    node={content}
                    openNodes={openNodes}
                    toggleOpen={toggleOpen}
                />
            </div>
        </DndProvider>
    );
};
export default hot(OrgChart);
