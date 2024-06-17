import Blockly from 'blockly';
import { block } from '../core/blocks.js';
import { Sparql } from '../generator/sparqlGenerator.js';

block('sparql_condition', {
    init: function() {
        this.appendStatementInput("CONDITIONS")
            .setCheck(Sparql.TYPE_MODIFIER)
            .appendField("MODIFIERS");
        this.setPreviousStatement(true, Sparql.TYPE_KEYWORD);
        this.setColour(360);
        this.setTooltip("Name: Modifier\nDefine a filter condition.\nCan be connected by: Modifier.");
        this.setHelpUrl("");
    }
});

block('sparql_orderby', {
    init: function() {
    this.appendDummyInput()
        .appendField("ORDER BY")
        .appendField(new Blockly.FieldDropdown([["ASC", "ASC"], ["DESC", "DESC"],["", ""]]), "ORDER")
        .appendField(new Blockly.FieldTextInput("variable"), "VARIABLE");
    this.setPreviousStatement(true, Sparql.TYPE_MODIFIER);
    this.setNextStatement(true, Sparql.TYPE_MODIFIER);
    this.setColour(340);
    this.setTooltip("Name: Order by\nOrder results by a specified variable.\nCan be connected by: Modifier.");
    this.setHelpUrl("");
    }
});


block('sparql_groupby', {
    init: function() {
      this.appendDummyInput()
        .appendField("GROUP BY")
        .appendField(new Blockly.FieldTextInput("variable"), "VARIABLE");
      this.setPreviousStatement(true, Sparql.TYPE_MODIFIER);
      this.setNextStatement(true, Sparql.TYPE_MODIFIER);
      this.setColour(160);
      this.setTooltip("Name:Group by\nGroup results by specified variables.\nCan be connected by: Modifier.");
      this.setHelpUrl("");
    }
  });
  

block('sparql_having', {
    init: function() {
      this.appendValueInput("HAVING_CONDITION")
          // .setCheck(["Condition", "Number"])
          .setCheck(Sparql.TYPE_BOOLEAN)
          .appendField("HAVING");
      this.setPreviousStatement(true, Sparql.TYPE_MODIFIER);
      this.setNextStatement(true, Sparql.TYPE_MODIFIER);
      this.setColour(160);
      this.setTooltip("Name: Having\nApply a condition to groups defined by GROUP BY, must be used with GROUP BY.\nCan be connected by: Modifier.");
      this.setHelpUrl("");
    }
  });
  
  
block('sparql_limit', {
    init: function() {
        this.appendValueInput("LIMIT")
            .setCheck(Sparql.TYPE_NUMBER)
            .appendField("LIMIT");
        this.setPreviousStatement(true, Sparql.TYPE_MODIFIER);
        this.setNextStatement(true, Sparql.TYPE_MODIFIER);
        this.setColour(340);
        this.setTooltip("Name: Limit\nLimit the number of results.\nCan be connected by: Modifier.");
        this.setHelpUrl("");
    }
});

block('sparql_offset', {
    init: function() {
      this.appendValueInput("OFFSET")
          .setCheck(Sparql.TYPE_NUMBER)
          .appendField("OFFSET");
      this.setPreviousStatement(true, Sparql.TYPE_MODIFIER);
      this.setColour(340);
      this.setTooltip("Name: Offset\nOffset the results.\nCan be connected by: Modifier.");
      this.setHelpUrl("");
    }
});
  