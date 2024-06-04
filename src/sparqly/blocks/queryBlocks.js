import Blockly from 'blockly';
import { block } from '../core/blocks.js';
  
block('sparql_select', {
    init: function() {
      this.appendValueInput("VARIABLES")
          .setCheck(["VARIABLE", "DISTINCT", "SYMBOL"])
          .appendField("SELECT");
      this.appendStatementInput("WHERE")
          .setCheck(["VARIABLE", "Variable", "Property"])
          .appendField("WHERE");
      this.setPreviousStatement(true, 'Prefix');
      this.setNextStatement(true, 'Condition');
      this.setColour(230);
      this.setTooltip("Perform a SPARQL select query.");
      this.setHelpUrl(""); 
    }
  });

  
block('sparql_distinct_reduced', {
    init: function() {
        this.appendValueInput("VARIABLE")
            .appendField(new Blockly.FieldDropdown([["DISTINCT", "DISTINCT"], ["REDUCED", "REDUCED"]]), "DISTINCT");
        this.setOutput(true);
        this.setColour(230);
        this.setTooltip("DISTINCT/REDUCED keyword seletion block connects to Select variables option.");
    }
});

block('sparql_condition', {
    init: function() {
      this.appendStatementInput("CONDITIONS")
          .setCheck(["Modifier", "Condition"])
          .appendField("CONDITION");
      this.setPreviousStatement(true, "Condition");
      this.setColour(210);
      this.setTooltip("Define classes and conditions for a SPARQL WHERE clause.");
    }
  });