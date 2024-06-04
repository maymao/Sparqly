import { block } from '../core/blocks.js';
import Blockly from 'blockly';

// Self-defined infinite dropdown
class FieldDropdownDynamic extends Blockly.FieldDropdown {
    constructor() {
        // Give a empty list to avoid error
        super(() => FieldDropdownDynamic.dropdownGenerator());
    }

    static dropdownGenerator() {
        const storedPrefixes = JSON.parse(localStorage.getItem('prefixes')) || {};
        const options = Object.keys(storedPrefixes).map(prefix => [prefix, prefix]);
        return options.length ? options : [['default', 'default']];
    }
}

// Dropdown block
block('sparql_prefix_list', {
    init: function() {
      this.appendDummyInput()
          .appendField("Prefixes:")
          .appendField(new FieldDropdownDynamic(), "PREFIX");
      this.setOutput(true, "Prefix list");
      this.setColour(290);
      this.setTooltip('');
      this.setHelpUrl('');
      window.addEventListener('prefixesChanged', () => {
        this.updateShape_();
    });
    },
    updateShape_: function() {
      const field = this.getField('PREFIX');
      if (field) {
        field.menuGenerator_ = this.dynamicOptions.bind(this);
      }
    },
    dynamicOptions: function() {
       return Object.keys(JSON.parse(localStorage.getItem('prefixes')) || {}).map(prefix => [prefix, prefix]);
    },
  });

block('sparql_prefix', {
    init: function() {
      this.appendDummyInput()
          .appendField("PREFIXES");
      this.setNextStatement(true, null);
      this.setColour(290);
      this.setTooltip("Define PREFIXES for SPARQL queries.");
      this.setHelpUrl('');
      this.setMutator(new Blockly.icons.MutatorIcon(['prefix_field'], this));
      this.prefixCount_ = 0;
      this.updateShape_();
    },
  
    mutationToDom: function() {
      const container = Blockly.utils.xml.createElement('mutation');
      container.setAttribute('prefixes', this.prefixCount_);
      return container;
    },
  
    domToMutation: function(xmlElement) {
      this.prefixCount_ = parseInt(xmlElement.getAttribute('prefixes'), 10);
      this.updateShape_();
    },
  
    decompose: function(workspace) {
      const containerBlock = workspace.newBlock('prefix_container');
      containerBlock.initSvg();
  
      let connection = containerBlock.getInput('STACK').connection;
      for (let i = 0; i < this.prefixCount_; i++) {
        const prefixBlock = workspace.newBlock('prefix_field');
        prefixBlock.initSvg();
        connection.connect(prefixBlock.previousConnection);
        connection = prefixBlock.nextConnection;
      }
  
      return containerBlock;
    },
  
    compose: function(containerBlock) {
      let itemBlock = containerBlock.getInputTargetBlock('STACK');
      const connections = [];
  
      // Collect all the connections from the container block
      while (itemBlock) {
        connections.push(itemBlock.valueConnection_);
        itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
      }
  
      // Update the shape of the main block
      const newPrefixCount = connections.length;
      this.updateShape_(newPrefixCount);
  
      // Reconnect any child blocks if connections[i] is defined
      for (let i = 0; i < newPrefixCount; i++) {
        if (connections[i]) {
          this.getInput('PREFIX' + i).connection.connect(connections[i]);
        }
      }
    },
  
    saveConnections: function(containerBlock) {
      let itemBlock = containerBlock.getInputTargetBlock('STACK');
      let i = 0;
      while (itemBlock) {
        const input = this.getInput('PREFIX' + i);
        if (input && input.connection) {
          itemBlock.valueConnection_ = input.connection.targetConnection;
        }
        i++;
        itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
      }
    },
  
    updateShape_: function(newPrefixCount) {
      if (typeof newPrefixCount === 'undefined') {
        newPrefixCount = this.prefixCount_;
      }
  
      // Delete everything.
      for (let i = 0; this.getInput('PREFIX' + i); i++) {
        this.removeInput('PREFIX' + i);
      }
  
      // Rebuild block.
      for (let i = 0; i < newPrefixCount; i++) {
        const input = this.appendDummyInput('PREFIX' + i)
                          .appendField('Prefix Label:')
                          .appendField(new Blockly.FieldTextInput(''), 'PREFIX_LABEL' + i)
                          .appendField('URI:')
                          .appendField(new Blockly.FieldTextInput(''), 'URI' + i);
      }
  
      this.prefixCount_ = newPrefixCount;
    }
  });
  
  
block('prefix_container', {
  init: function() {
    this.appendDummyInput().appendField('Add or remove prefixes');
    this.appendStatementInput('STACK');
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('');
  }
});

block('prefix_field', {
  init: function() {
    this.appendDummyInput()
        .appendField('Prefix Label:')
        .appendField(new Blockly.FieldTextInput(''), 'PREFIX_LABEL')
        .appendField('URI:')
        .appendField(new Blockly.FieldTextInput(''), 'URI');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('');
  }
});
