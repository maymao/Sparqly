import Blockly from 'blockly';
import { block } from '../core/blocks.js';

// not in use
block('sparql_*', {
  init: function() {
    this.appendDummyInput("SYMBOL")
        .appendField("*")
    this.setColour(260);
    this.setOutput(true, "Variable");
  }
});

block('sparql_properties_in_class', {
  init: function() {
    this.appendValueInput("INPUT")
        .setCheck("Label")
    this.setPreviousStatement(true, "Class Property");
    this.setNextStatement(true, "Class Property");
    this.setColour(160);
    this.setTooltip("Connector. Use for Class with Property block.");
  }
});

block('sparql_variable_type', {
  init: function() {
    this.appendValueInput("TYPE1")
        .setCheck("Prefix list")
    this.appendValueInput("TYPE2")
        .appendField(":")
        .appendField(new Blockly.FieldTextInput(" "), "VARIABLE2");
    this.setColour(160);
    this.setTooltip("Type variable block, :_. Use for Class Property block.");
    this.setOutput(true, "Label");
    this.setInputsInline(true);
  }
});

block('sparql_variable_select', {
  init: function() {
    this.appendValueInput("NEXT_VARIABLE")
        .appendField("?")
        .appendField(new Blockly.FieldTextInput("var"), "VARIABLE");
    this.setColour(100);
    this.setOutput(true, "VARIABLE");
    this.setTooltip("Use for select/class block, indicate properties selected. ?_");
  }
});

block('sparql_variable_typename', {
  init: function() {
    this.appendDummyInput()
        .appendField(":")
        .appendField(new Blockly.FieldTextInput("Typename"), "VARIABLE");
    this.setColour(360);
    this.setOutput(true, "VARIABLE");
    this.setTooltip("Type name in property block.");
    this.setHelpUrl(""); 
    this.setInputsInline(true);
  }
});

class FieldDropdownSelectVariable extends Blockly.FieldDropdown {
  constructor() {
    super(() => FieldDropdownSelectVariable.dropdownGenerator());
  }

  static dropdownGenerator() {
    let selectVars = JSON.parse(localStorage.getItem('selectVars')) || {};
    let classNames = JSON.parse(localStorage.getItem('classNames')) || {};
    let variables = { ...selectVars, ...classNames };

    const options = Object.keys(variables).map(variable => [variable, variable]);
    return options.length ? options : [['default', 'default']];
  }
}

block('sparql_variable_varname', {
  init: function() {
    this.appendDummyInput()
        .appendField("")
        .appendField(new FieldDropdownSelectVariable(), "VARIABLE");
    this.setColour(70);
    this.setOutput(true, "VARIABLE");
    this.setTooltip("Variable name in property block.");
  }
});

block('sparql_variable_confirmed', {
  init: function() {
    this.appendDummyInput()
        .appendField("?")
        .appendField(new Blockly.FieldTextInput("custom var"), "VARIABLE");
    this.setColour(460);
    this.setOutput(true, "VARIABLE");
    this.setTooltip("Variable name in property block.");
  }
});

block('sparql_bind', {
  init: function() {
    this.appendValueInput("EXPRESSION")
        .setCheck(null)
        .appendField("BIND");
    this.appendDummyInput()
        .appendField("AS")
        .appendField(new Blockly.FieldTextInput("newVar"), "VARIABLE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
  }
});

block('sparql_as', {
  init: function() {
    this.appendValueInput('VARIABLE1')
        .setCheck(['VARIABLE', 'Math']);
    this.appendDummyInput()
        .appendField("AS")
        .appendField(new Blockly.FieldTextInput("newVar"), "VARIABLE2");
    this.appendValueInput("NEXT_VARIABLE")
        .setCheck(null);
    this.setOutput(true, "VARIABLE");
    this.setColour(160);
    this.setInputsInline(true);
  }
});