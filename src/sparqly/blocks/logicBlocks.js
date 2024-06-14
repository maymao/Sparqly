import Blockly from 'blockly';
import { block } from '../core/blocks.js';
import { Sparql } from '../generator/sparqlGenerator.js';

block('sparql_and', {
    init: function() {
      this.appendValueInput("OPERAND1")
          .setCheck(Sparql.TYPE_BOOLEAN)
          // .setCheck(["Boolean", "Variable"])
      this.appendValueInput("OPERAND2")
          .setCheck(Sparql.TYPE_BOOLEAN)
          .appendField("AND");
      this.setOutput(true, Sparql.TYPE_BOOLEAN);
      this.setColour(900);
      this.setTooltip("Name: And\nLogical AND operation.\nCan be connected by: Boolean.");
      this.setHelpUrl("");
      this.setInputsInline(true);
    }
  });


block('sparql_or', {
    init: function() {
      this.appendValueInput("OPERAND1")
          .setCheck(Sparql.TYPE_BOOLEAN)
      this.appendValueInput("OPERAND2")
          .setCheck(Sparql.TYPE_BOOLEAN)
          .appendField("OR");
      this.setOutput(true, Sparql.TYPE_BOOLEAN);
      this.setColour(900);
      this.setTooltip("Name: Or\nLogical OR operation.\nCan be connected by: Boolean.");
      this.setInputsInline(true);
      this.setHelpUrl("");
    }
  });
  
block('sparql_not', {
    init: function() {
      this.appendValueInput("OPERAND")
          .setCheck(Sparql.TYPE_BOOLEAN)
          .appendField("NOT");
      this.setOutput(true, Sparql.TYPE_BOOLEAN);
      this.setColour(900);
      this.setTooltip("Name: Not\nLogical NOT operation.\nCan be connected by: Boolean.");
      this.setInputsInline(true);
      this.setHelpUrl("");
    }
  });
  

block('sparql_if', {
  init: function() {
    this.appendValueInput('CONDITION')
        .setCheck(Sparql.TYPE_BOOLEAN)
        .appendField('IF');
    this.appendValueInput('TRUE_VALUE')
        .setCheck([Sparql.TYPE_BOOLEAN, Sparql.TYPE_VARIABLE, Sparql.TYPE_NUMBER, Sparql.TYPE_STRING, Sparql.TYPE_FUNCTIONCALL, Sparql.TYPE_ARITHMETIC])
        .appendField('True');
    this.appendValueInput('FALSE_VALUE')
        .setCheck([Sparql.TYPE_BOOLEAN, Sparql.TYPE_VARIABLE, Sparql.TYPE_NUMBER, Sparql.TYPE_STRING, Sparql.TYPE_FUNCTIONCALL, Sparql.TYPE_ARITHMETIC])
        .appendField('False');
    this.setOutput(true, Sparql.TYPE_BOOLEAN);
    this.setColour(210);
    this.setTooltip("Name: If\nReturns the true value if the condition is true, otherwise returns the false value.\nCan be connected by: Boolean.");
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