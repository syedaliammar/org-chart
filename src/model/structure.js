import { DataItem } from "./dataitem";

export class DataStructure {
    /**
     *
     * @param {DataItem[]} items List of items
     */
    constructor(items) {
        this.items = items;
        this.length = items.length;
    }

    /**
     * Search for item in list of all items.
     * Implemented to be performant by searching on ordered list
     * and aborting search early.
     * @param {number} id Unique id of item to look for.
     * @returns {DataItem|null} Item from list or null if item is not in list.
     */
    getItemWithID(id) {
        if (id < this.items[0].itemID || id > this.items[this.length - 1]) {
            return null;
        }
        for (let i = 0; i < this.length; ++i) {
            const currentItem = this.items[i];

            if (currentItem.itemID < id) {
                continue;
            } else if (currentItem.itemID === id) {
                return currentItem;
            } else if (currentItem.itemID > id) {
                return null;
            }
        }
    }

    /**
     * Checks if list contains item.
     * @param {number} id Unique id of item to look for.
     * @returns true if item is in list, otherwise false.
     */
    hasItemWithID(id) {
        return this.getItemWithID(id) !== null;
    }

    /**
     * Calculate tree structure of DataItems.
     */
    calculateChildren() {
        for (let i = 0; i < this.length; ++i) {
            const currentItem = this.items[i];
            if (currentItem.parentID) {
                const parentItem = this.getItemWithID(currentItem.parentID);
                if (parentItem) {
                    parentItem.addChild(currentItem);
                }
            }
        }
    }

    /**
     *
     * @returns Root nodes of the org tree
     */
    getTopLevelNodes() {
        const res = [];
        // for (let i = 0; i < this.length; ++i) {
        //     const currentItem = this.items[i];

        //     if (currentItem.parentID === 0 || currentItem.parentID === undefined || currentItem.parentID === null) {
        //         res.push(currentItem);
        //     }
        // }

        this.items.filter(currentItem => {
            //Items where parent is undefined
            if (currentItem.parentID === undefined || currentItem.parentID === null) res.push(currentItem);
            //Items whose parents are not in the data
            else if (this.getItemWithID(currentItem.parentID) === null) res.push(currentItem);
        });

        return res;
    }
}

/**
 *
 * @param {[]} data List of Mendix datasource items
 * @param {*} getID Function to read unique id from data item.
 * @param {*} getParentID Function to read parent's unique id from data item.
 * @param {*} searchAttribute Function to read search attribute from data item.
 * @returns
 */
export function createDataStructure(data, getID, getParentID, searchAttribute) {
    const itemArray = new Array(data.length);
    for (let i = 0; i < data.length; ++i) {
        const currentItem = data[i];
        const id = parseInt(getID(currentItem).displayValue);
        const parentID = parseInt(getParentID(currentItem).displayValue);
        const searchAttr = searchAttribute(currentItem).displayValue;
        itemArray[i] = new DataItem(currentItem, !isNaN(id) ? id : 0, !isNaN(parentID) ? parentID : 0, searchAttr);
    }

    const sortedItemArray = itemArray.sort((a, b) => a.itemID - b.itemID);

    const res = new DataStructure(sortedItemArray);
    res.calculateChildren();

    return res;
}
