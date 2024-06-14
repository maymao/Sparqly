import Blockly from 'blockly';
import { block } from '../core/blocks.js';
import { Sparql } from '../generator/sparqlGenerator.js';


block('sparql_add', {
    init: function() {
      this.appendValueInput("ADDEND1")
          .setCheck([Sparql.TYPE_NUMBER, Sparql.TYPE_VARIABLE, Sparql.TYPE_ARITHMETIC])
      this.appendValueInput("ADDEND2")
          .setCheck([Sparql.TYPE_NUMBER, Sparql.TYPE_VARIABLE, Sparql.TYPE_ARITHMETIC])
          .appendField("+");
      this.setOutput(true, Sparql.TYPE_ARITHMETIC);
      this.setColour(100);
      this.setTooltip("Name: Add\nAdds two numbers or variables.\nCan be connected by: Arithmetic, Variable, Number.");
      this.setHelpUrl("");
      this.setInputsInline(true);
    }
  });

block('sparql_subtract', {
    init: function() {
      this.appendValueInput("MINUEND")
          .setCheck([Sparql.TYPE_NUMBER, Sparql.TYPE_VARIABLE, Sparql.TYPE_ARITHMETIC])
      this.appendValueInput("SUBTRAHEND")
          .setCheck([Sparql.TYPE_NUMBER, Sparql.TYPE_VARIABLE, Sparql.TYPE_ARITHMETIC])
          .appendField("-");
      this.setOutput(true, Sparql.TYPE_ARITHMETIC);
      this.setColour(100);
      this.setTooltip("Name: Subtract\nSubtracts one number or variable from another.\nCan be connected by: Arithmetic, Variable, Number.");
      this.setInputsInline(true);
      this.setHelpUrl("");
    }
  });

block('sparql_multiply', {
    init: function() {
      this.appendValueInput("FACTOR1")
          .setCheck([Sparql.TYPE_NUMBER, Sparql.TYPE_VARIABLE, Sparql.TYPE_ARITHMETIC])
      this.appendValueInput("FACTOR2")
          .setCheck([Sparql.TYPE_NUMBER, Sparql.TYPE_VARIABLE, Sparql.TYPE_ARITHMETIC])
          .appendField("*");
      this.setOutput(true, Sparql.TYPE_ARITHMETIC);
      this.setColour(50);
      this.setTooltip("Name: Multiply\nMultiplies two numbers or variables.\nCan be connected by: Arithmetic, Variable, Number.");
      this.setInputsInline(true);
      this.setHelpUrl("");
    }
  });
  
block('sparql_divide', {
    init: function() {
      this.appendValueInput("DIVIDEND")
          .setCheck([Sparql.TYPE_NUMBER, Sparql.TYPE_VARIABLE, Sparql.TYPE_ARITHMETIC])
      this.appendValueInput("DIVISOR")
          .setCheck([Sparql.TYPE_NUMBER, Sparql.TYPE_VARIABLE, Sparql.TYPE_ARITHMETIC])
          .appendField("/");
      this.setOutput(true, Sparql.TYPE_ARITHMETIC);
      this.setColour(50);
      this.setTooltip("Name: Divide\nDivides one number or variable by another.\nCan be connected by: Arithmetic, Variable, Number.");
      this.setInputsInline(true);
      this.setHelpUrl("");
    }
  });

block('sparql_comparison', {
    init: function() {
      this.appendValueInput("OPERAND1")
          .setCheck([Sparql.TYPE_NUMBER, Sparql.TYPE_VARIABLE, Sparql.TYPE_ARITHMETIC, Sparql.TYPE_STRING])
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ["=", "="], 
            ["!=", "!="], 
            [">", ">"], 
            ["<", "<"], 
            [">=", ">="], 
            ["<= ", "<="]
          ]), "OPERATOR");
      this.appendValueInput("OPERAND2")
          .setCheck([Sparql.TYPE_NUMBER, Sparql.TYPE_VARIABLE, Sparql.TYPE_ARITHMETIC, Sparql.TYPE_STRING])
      this.setOutput(true, Sparql.TYPE_BOOLEAN);
      this.setColour(210);
      this.setTooltip("Name: Comparison\nComparison operations: =, !=, >, <, >=, <=.\nCan be connected by: Arithmetic, Variable, Number, String, Aggregate.");
      this.setHelpUrl("");
    }
  });
