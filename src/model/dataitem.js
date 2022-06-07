/**
 * Wrapper around the actual mendix object.
 * Holds item and parent id as well as the the item's children.
 */
export class DataItem {
    /**
     * Constructor
     * @param {*} item Original object from Mendix datasource
     * @param {number} itemID Unique identifier of this object
     * @param {number|null} parentID Unique identifier of parent object.
     */
    constructor(item, itemID, parentID, searchAttribute) {
        this._itemID = itemID;
        this._parentID = parentID;
        this.searchAttribute = searchAttribute;

        /** @type DataItem[] */
        this._children = [];

        this._originalItem = item;
    }

    /**
     * Unique identifier of this item.
     */
    get itemID() {
        return this._itemID;
    }

    /**
     * Unique identifier of parent item.
     */
    get parentID() {
        return this._parentID;
    }

    /**
     * Array of children.
     */
    get children() {
        return this._children;
    }

    /**
     * Original Mendix datasource item.
     */
    get originalItem() {
        return this._originalItem;
    }

    /**
     * Add a child item to this item's children list.
     * @param {DataItem} child Child do be added
     */
    addChild(child) {
        this._children.push(child);
    }
}
