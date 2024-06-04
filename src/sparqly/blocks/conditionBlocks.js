import Blockly from 'blockly';
import { block } from '../core/blocks.js';

block('sparql_condition', {
    init: function() {
        this.appendStatementInput("CONDITIONS")
            .setCheck(["Modifier", "Condition"])
            .appendField("CONDITIONS");
        this.setPreviousStatement(true, "Condition");
        this.setColour(360);
        this.setTooltip("Define a filter condition.");
        this.setHelpUrl("");
    }
});

block('sparql_orderby', {
    init: function() {
    this.appendDummyInput()
        .appendField("ORDER BY")
        .appendField(new Blockly.FieldDropdown([["ASC", "ASC"], ["DESC", "DESC"]]), "ORDER")
        .appendField(new Blockly.FieldTextInput("variable"), "VARIABLE");
    this.setPreviousStatement(true, "Modifier");
    this.setNextStatement(true, "Modifier");
    this.setColour(340);
    this.setTooltip("Order results by a specified variable.");
    this.setHelpUrl("");
    }
});


block('sparql_groupby', {
    init: function() {
      this.appendDummyInput()
        .appendField("GROUP BY")
        .appendField(new Blockly.FieldTextInput("variable"), "VARIABLE");
      this.setPreviousStatement(true, "Modifier");
      this.setNextStatement(true, "Modifier");
      this.setColour(160);
      this.setTooltip("Group results by specified variables.");
      this.setHelpUrl("");
    }
  });
  

block('sparql_having', {
    init: function() {
      this.appendValueInput("HAVING_CONDITION")
          .setCheck(["Condition", "Number"])
          .appendField("HAVING");
      this.setPreviousStatement(true, "Modifier");
      this.setNextStatement(true, "Modifier");
      this.setColour(160);
      this.setTooltip("Apply a condition to groups defined by GROUP BY.");
      this.setHelpUrl("");
    }
  });
  
  
block('sparql_limit', {
    init: function() {
        this.appendValueInput("LIMIT")
            .setCheck(["Number", "Variable", "Math"])
            .appendField("LIMIT");
        this.setPreviousStatement(true, "Modifier");
        this.setNextStatement(true, "Modifier");
        this.setColour(340);
        this.setTooltip("Limit the number of results.");
        this.setHelpUrl("");
    }
});

block('sparql_offset', {
    init: function() {
      this.appendValueInput("OFFSET")
          .setCheck(["Number", "Variable", "Math"])
          .appendField("OFFSET");
      this.setPreviousStatement(true, "Modifier");
      this.setColour(340);
      this.setTooltip("Offset the results.");
      this.setHelpUrl("");
    }
});
  