import Blockly from 'blockly';
import { block } from '../core/blocks.js';
import { Sparql } from '../generator/sparqlGenerator.js';
import { Spa } from '@mui/icons-material';

block('sparql_braces', {
    init: function() {
        this.appendDummyInput()
            .appendField("{");
        this.appendStatementInput("PATTERN")
            .setCheck(Sparql.TYPE_PATTERN);
        this.appendDummyInput()
            .appendField("}");
        // this.setPreviousStatement(true, Sparql.TYPE_PATTERN);
        // this.setNextStatement(true, Sparql.TYPE_PATTERN);
        this.setOutput(true, Sparql.TYPE_PATTERN);
        this.setColour(120);
        this.setTooltip("Name: Braces\nGroup a set of triple patterns.\nCan be connected by: Pattern.");
    }
    });
  
block('sparql_parentheses', {
    init: function() {
      this.appendValueInput("EXPRESSION")
          .setCheck(null)
          .appendField("(");
      this.appendDummyInput()
          .appendField(")");
      this.setOutput(true, null);
      this.setColour(230);
      this.setTooltip("Group an expression.");
    }
  });
  
block('sparql_number', {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldNumber(0), "NUMBER");
      // this.setOutput(true, ["Number", "Variable", "Math"]);
      this.setOutput(true, Sparql.TYPE_NUMBER);
      this.setColour(180);
      this.setTooltip("Name: Number\nA number.");
    }
  });

block('sparql_string', {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldTextInput("text"), "STRING");
      this.setOutput(true, Sparql.TYPE_STRING);
      // this.setOutput(true, ["String", "Variable", "Math"]);
      this.setColour(180);
      this.setTooltip("Name: String\nA string.");
    }
  });



