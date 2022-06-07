import React, { Component, createElement, useState } from "react";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { newFoldAll, newExpandAll } from "../model/folding";

export class ActionBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            exportFileName: "OrgChart" //Todo: parameterize exportFileName
        };
    }

    async _exportToPNG(domNodeToExport, exportFileName) {
        htmlToImage
            .toPng(domNodeToExport)
            .then(function(dataUrl) {
                saveAs(dataUrl, exportFileName + ".png");
            })
            .catch(function(error) {
                console.error("Something went wrong while generating the PNG", error);
            });
    }

    async _exportToSVG(domNodeToExport, exportFileName) {
        htmlToImage
            .toSvg(domNodeToExport, { preferredFontFormat: "exportFont" })
            .then(function(dataUrl) {
                logger.info(dataUrl);
                saveAs(dataUrl, exportFileName + ".svg");
            })
            .catch(function(error) {
                console.error("Something went wrong while generating the SVG", error);
            });
    }

    async _expandAll() {
        this.props.setFolding(newExpandAll());
    }

    _foldAll() {
        this.props.setFolding(newFoldAll());
    }

    _onSearchHandler = (string, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
    };

    _onSelectHandler = item => {
        //Set the selected item as the top-level node and activate search
        this.props.setTopLevelNodes([item]);
        this.props.setIsSearchActivated(true);
    };

    _onClearHandler = () => {
        //Use all data items to determine top level nodes and set them for the chart
        this.props.setTopLevelNodes(this.props.allDataItems.getTopLevelNodes());
        this.props.setIsSearchActivated(false);
    };

    _onFocusHandler = () => {
        console.log("Focusing...");
    };

    getSearchThreshold = () => {
        return !isNaN(this.props.searchMatchThreshold) &&
            this.props.searchMatchThreshold >= 0 &&
            this.props.searchMatchThreshold <= 1
            ? this.props.searchMatchThreshold
            : 0.6;
    };

    getMaxSearchResults = () => {
        return !isNaN(this.props.maxSearchResults) ? this.props.maxSearchResults : 10;
    };

    render() {
        return (
            <div id="action-bar" className="header">
                <div id="action-buttons">
                    {this.props.allowExport ? (
                        <React.Fragment>
                            <button
                                id="export-org-png"
                                title="Download chart as PNG"
                                onClick={() =>
                                    this._exportToPNG(document.getElementById("org-chart"), this.state.exportFileName)
                                }
                            >
                                PNG
                            </button>
                            <button
                                id="export-org-svg"
                                title="Download chart as SVG"
                                onClick={() =>
                                    this._exportToSVG(document.getElementById("org-chart"), this.state.exportFileName)
                                }
                            >
                                SVG
                            </button>
                        </React.Fragment>
                    ) : null}
                    {this.props.allowExpandAll ? (
                        <React.Fragment>
                            <button id="expand-all" title="Expand all nodes" onClick={() => this._expandAll()}>
                                Expand all
                            </button>
                        </React.Fragment>
                    ) : null}
                    {this.props.allowFoldAll ? (
                        <React.Fragment>
                            <button id="fold-all" title="Fold all nodes" onClick={() => this._foldAll()}>
                                Fold all
                            </button>
                        </React.Fragment>
                    ) : null}
                </div>
                {this.props.allowSearch ? (
                    <div id="search-box">
                        <ReactSearchAutocomplete
                            items={this.props.allDataItems.items}
                            onSearch={this._onSearchHandler}
                            onSelect={this._onSelectHandler}
                            onFocus={this._onFocusHandler}
                            onClear={this._onClearHandler}
                            fuseOptions={{ keys: ["searchAttribute"], threshold: this.getSearchThreshold() }}
                            resultStringKeyName="searchAttribute"
                            maxResults={this.getMaxSearchResults()}
                            placeholder={this.props.searchBoxPlaceholder}
                            styling={{
                                zIndex: 1,
                                height: "35px",
                                fontSize: "14px",
                                searchIconMargin: "0 0 0 7px",
                                clearIconMargin: "3px 8px 0 0"
                            }}
                            autoFocus
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}
