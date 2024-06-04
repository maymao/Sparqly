import Blockly from 'blockly';
import { block } from '../core/blocks.js';

block('sparql_union', {
    init: function() {
      this.appendStatementInput("PATTERN1")
          .setCheck(null)
          .appendField("UNION");
      this.appendStatementInput("PATTERN2")
          .setCheck(null)
      this.setPreviousStatement(true, "VARIABLE");
      this.setNextStatement(true, "VARIABLE");
      this.setColour(120);
      this.setTooltip("Union of patterns.");
    }
  });

block('sparql_filter', {
    init: function() {
      this.appendValueInput("FILTER_CONDITION")
          .setCheck("Condition")
          .appendField("FILTER");
      this.setPreviousStatement(true, "VARIABLE");
      this.setNextStatement(true, "VARIABLE");
      this.setColour(180);
      this.setTooltip("Apply a filter condition to the query.");
      this.setHelpUrl("");
    }
  });

block('sparql_existence', {
    init: function() {
        this.appendValueInput("Variables")
            .appendField(new Blockly.FieldDropdown([["EXISTS", "EXISTS"], ["NOT EXISTS", "NOT EXISTS"]]), "EXISTS");
        this.setOutput(true, "Condition");
        this.setColour(180);
        this.setTooltip("EXISTS/NOT EXISTS keyword seletion block connects to Filter block (optional).");
    }
});

block('sparql_optional', {
    init: function() {
      this.appendStatementInput("PATTERN")
          .setCheck(null)
          .appendField("OPTIONAL");
      this.setPreviousStatement(true, "VARIABLE");
      this.setNextStatement(true, "VARIABLE");
      this.setColour(120);
      this.setTooltip("Optional pattern.");
      this.setHelpUrl("");
    }
  });