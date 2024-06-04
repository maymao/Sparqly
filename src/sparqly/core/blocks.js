import Blockly from 'blockly';

// hooks used to create a custom block

const initBlock = (callback) => {
    return function() {
        callback.call(this);
    };
};

export const block = (blockName, block) => {
    block.init = initBlock(block.init);
    Blockly.Blocks[blockName] = block;
};