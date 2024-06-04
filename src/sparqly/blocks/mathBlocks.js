import Blockly from 'blockly';
import { block } from '../core/blocks.js';


block('sparql_add', {
    init: function() {
      this.appendValueInput("ADDEND1")
          .setCheck(["Number", "Variable", "Math", "String", "VARIABLE"])
      this.appendValueInput("ADDEND2")
          .setCheck(["Number", "Variable", "Math", "String", "VARIABLE"])
          .appendField("+");
      this.setOutput(true, "Math");
      this.setColour(100);
      this.setTooltip("Adds two numbers or variables.");
      this.setHelpUrl("");
      this.setInputsInline(true);
    }
  });

block('sparql_subtract', {
    init: function() {
      this.appendValueInput("MINUEND")
          .setCheck(["Number", "Variable", "Math", "String", "VARIABLE"])
      this.appendValueInput("SUBTRAHEND")
          .setCheck(["Number", "Variable", "Math", "String", "VARIABLE"])
          .appendField("-");
      this.setOutput(true, "Math");
      this.setColour(100);
      this.setTooltip("Subtracts one number or variable from another.");
      this.setInputsInline(true);
      this.setHelpUrl("");
    }
  });

block('sparql_multiply', {
    init: function() {
      this.appendValueInput("FACTOR1")
          .setCheck(["Number", "Variable", "Math", "String", "VARIABLE"])
      this.appendValueInput("FACTOR2")
          .setCheck(["Number", "Variable", "Math", "String", "VARIABLE"])
          .appendField("*");
      this.setOutput(true, "Math");
      this.setColour(50);
      this.setTooltip("Multiplies two numbers or variables.");
      this.setInputsInline(true);
      this.setHelpUrl("");
    }
  });

  
block('sparql_divide', {
    init: function() {
      this.appendValueInput("DIVIDEND")
          .setCheck(["Number", "Variable", "Math", "String", "VARIABLE"])
      this.appendValueInput("DIVISOR")
          .setCheck(["Number", "Variable", "Math", "String", "VARIABLE"])
          .appendField("/");
      this.setOutput(true, "Math");
      this.setColour(50);
      this.setTooltip("Divides one number or variable by another.");
      this.setInputsInline(true);
      this.setHelpUrl("");
    }
  });

block('sparql_comparison', {
    init: function() {
      this.appendValueInput("OPERAND1")
          .setCheck(["Number", "Variable", "Math", "String", "VARIABLE"]);
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
          .setCheck(["Number", "Variable", "Math", "String", "VARIABLE"]);
      this.setOutput(true, "Boolean");
      this.setColour(210);
      this.setTooltip("Comparison operations: =, !=, >, <, >=, <=.");
      this.setHelpUrl("");
    }
  });

  
  
  
