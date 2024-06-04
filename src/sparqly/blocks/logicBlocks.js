import Blockly from 'blockly';
import { block } from '../core/blocks.js';

block('sparql_and', {
    init: function() {
      this.appendValueInput("OPERAND1")
          .setCheck(["Boolean", "Variable"])
      this.appendValueInput("OPERAND2")
          .setCheck(["Boolean", "Variable"])
          .appendField("AND");
      this.setOutput(true, "Boolean");
      this.setColour(900);
      this.setTooltip("Logical AND operation.");
      this.setHelpUrl("");
      this.setInputsInline(true);
    }
  });


block('sparql_or', {
    init: function() {
      this.appendValueInput("OPERAND1")
          .setCheck(["Boolean", "Variable"])
      this.appendValueInput("OPERAND2")
          .setCheck(["Boolean", "Variable"])
          .appendField("OR");
      this.setOutput(true, "Boolean");
      this.setColour(900);
      this.setTooltip("Logical OR operation.");
      this.setInputsInline(true);
      this.setHelpUrl("");
    }
  });
  
block('sparql_not', {
    init: function() {
      this.appendValueInput("OPERAND")
          .setCheck(["Boolean", "Variable"])
          .appendField("NOT");
      this.setOutput(true, "Boolean");
      this.setColour(900);
      this.setTooltip("Logical NOT operation.");
      this.setInputsInline(true);
      this.setHelpUrl("");
    }
  });
  

block('sparql_if', {
  init: function() {
    this.appendValueInput('CONDITION')
        .setCheck('Boolean')
        .appendField('IF');
    this.appendValueInput('TRUE_VALUE')
        .setCheck('String')
        .appendField('True');
    this.appendValueInput('FALSE_VALUE')
        .setCheck('String')
        .appendField('False');
    this.setOutput(true, 'String');
    this.setColour(210);
    this.setTooltip('Returns the true value if the condition is true, otherwise returns the false value.');
    this.setHelpUrl('');
  }
});

block('sparql_coalesce', {
  init: function() {
    this.appendValueInput('ARG1')
        .setCheck('String')
        .appendField('COALESCE');
    this.appendValueInput('ARG2')
        .setCheck('String')
        .appendField(',');
    this.setOutput(true, 'String');
    this.setColour(230);
    this.setTooltip('Returns the first non-error argument.');
    this.setHelpUrl('');
  }
});