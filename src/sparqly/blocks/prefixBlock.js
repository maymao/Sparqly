import { block } from '../core/blocks.js';
import Blockly from 'blockly';
import { Sparql } from '../generator/sparqlGenerator.js';

// Self-defined infinite dropdown
class FieldDropdownDynamic extends Blockly.FieldDropdown {
    constructor() {
        // Give a empty list to avoid error
        super(() => FieldDropdownDynamic.dropdownGenerator());
    }

    static dropdownGenerator() {
      const storedPrefixes = JSON.parse(localStorage.getItem('prefixes')) || {};
      // console.log('Stored Prefixes:', storedPrefixes); 
      const options = Object.entries(storedPrefixes).map(([key, label]) => {
          // console.log('Key:', key, 'Label:', label); 
          return [label, key];
      });
      // console.log('Options:', options);
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
      this.setTooltip("Name: Prefix list\nPrefixes for SPARQL queries.");
      this.setHelpUrl('');
      window.addEventListener('prefixesChanged', () => {
        console.log('prefixesChanged event detected');
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
      const storedPrefixes = JSON.parse(localStorage.getItem('prefixes')) || {};
      // console.log('Stored Prefixes in dynamicOptions:', storedPrefixes);

      const options = Object.entries(storedPrefixes).map(([key, label]) => {
          // console.log('Key:', key, 'Label:', label); 
          return [label, key];
      });

      // console.log('Updated Dropdown Options in dynamicOptions:', options);
      return options.length ? options : [['default', 'default']];
    },
  });

block('sparql_prefix', {
    init: function() {
      this.appendDummyInput()
          .appendField("PREFIXES");
      // this.setPreviousStatement(true, Sparql.TYPE_KEYWORD);
      this.setNextStatement(true, Sparql.TYPE_KEYWORD);
      this.setColour(290);
      this.setTooltip("Name: Prefix\nDefine PREFIXES for SPARQL queries. \nCan be connected by: Keyword(Select).");
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
        const uniqueKey = 'prefix_' + i;
        const input = this.appendDummyInput('PREFIX' + i)
                          .appendField('Prefix Label:')
                          // .appendField(new Blockly.FieldTextInput('', this.updatePrefix.bind(this, uniqueKey)), 'PREFIX_LABEL' + i)
                          .appendField(new Blockly.FieldTextInput('', (newLabel) => {
                            console.log(`Updating ${uniqueKey} to ${newLabel}`);
                            this.updatePrefix(uniqueKey, newLabel);
                        }), 'PREFIX_LABEL' + i)
                          .appendField('URI:')
                          .appendField(new Blockly.FieldTextInput(''), 'URI' + i);
      }
  
      this.prefixCount_ = newPrefixCount;
    },

    updatePrefix: function(uniqueKey, newLabel) {
      const storedPrefixes = JSON.parse(localStorage.getItem('prefixes')) || {};
      storedPrefixes[uniqueKey] = newLabel;
      localStorage.setItem('prefixes', JSON.stringify(storedPrefixes));

      console.log('After update: ', storedPrefixes);

      const event = new Event('prefixesChanged');
      window.dispatchEvent(event);
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
