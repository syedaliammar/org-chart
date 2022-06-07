export const FoldingCommand = {
    FoldAll: Symbol("FoldAll"),
    ExpandAll: Symbol("ExpandAll"),
};

export class Folding {
    /**
     * Folding command to be passed to Node components.
     * @param {Symbol} command 
     */
    constructor(command) {
        this.command = command;
    }
}

export function newFoldAll() {
    return new Folding(FoldingCommand.FoldAll);
}

export function newExpandAll() {
    return new Folding(FoldingCommand.ExpandAll);
}