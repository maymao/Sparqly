import Blockly from 'blockly';
import { block } from '../core/blocks.js';
import { Sparql } from '../generator/sparqlGenerator.js';

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
        .setCheck(Sparql.TYPE_SUBTRIPLE)
    this.setPreviousStatement(true, Sparql.TYPE_CLASSPROPERTY);
    this.setNextStatement(true, Sparql.TYPE_CLASSPROPERTY);
    this.setColour(160);
    this.setTooltip("Name: Connector\nUsed as a connector, conected by predicate-onject pair and connect to Triple Pattern. \nCan be connected by: Predicate-Object Pair.");
  }
});


block('sparql_variable_type', {
  init: function() {
    this.appendValueInput("TYPE1")
        .setCheck("Prefix list")
    this.appendValueInput("TYPE2")
        .setCheck(Sparql.TYPE_VARIABLE)
        .appendField(":")
        .appendField(new Blockly.FieldTextInput(" "), "VARIABLE2");
    this.setColour(160);
    this.setTooltip("Name: SubTriple\nThis is a predicate-object pair that can be connected to Triple Pattern with a connector. \nFirst input can be connected by: Prefix List.\nSecond input can be connected by: Variable");
    this.setOutput(true, Sparql.TYPE_SUBTRIPLE);
    this.setInputsInline(true);
  }
});

block('sparql_variable_select', {
  init: function() {
    this.appendValueInput("NEXT_VARIABLE")
        .setCheck(Sparql.TYPE_VARIABLE)
        .appendField(new FieldDropdownSelectVariable(), "VARIABLE");
    this.setColour(100);
    this.setOutput(true, Sparql.TYPE_VARIABLE);
    this.setTooltip("Name: Variable list\nUse for select block, indicate properties selected, only use when classes are constructed so that options are loaded. \nCan be connected by: Variable.");
  }
});

block('sparql_variable_select_demo', {
  init: function() {
    this.appendValueInput("NEXT_VARIABLE")
        .setCheck(Sparql.TYPE_VARIABLE)
        .appendField(new Blockly.FieldTextInput(" "), "VARIABLE");
    this.setColour(100);
    this.setOutput(true, Sparql.TYPE_VARIABLE);
    this.setTooltip("Name: Variable\nUse for Pattern match block groups as a place holder, when constructing a query yourself, please replace this with variable block with options. \nCan be connected by: Variable.");
  }
});

block('sparql_variable_typename', {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(" "), "LABEL")
        .appendField(":")
        .appendField(new Blockly.FieldTextInput("Typename"), "VARIABLE");
    this.setColour(360);
    this.setOutput(true, Sparql.TYPE_VARIABLE);
    this.setTooltip("Name: Type name\nType name in property block.\nCan be connected to: SubTriple.");
    this.setHelpUrl(""); 
    this.setInputsInline(true);
  }
});

class FieldDropdownSelectVariable extends Blockly.FieldDropdown {
  constructor() {
    super(() => FieldDropdownSelectVariable.dropdownGenerator());
  }

  static dropdownGenerator() {
    let classNames = JSON.parse(localStorage.getItem('classNames')) || {};
    let varNames = JSON.parse(localStorage.getItem('varNames')) || {};
    let variables = {...classNames, ...varNames};

    const options = Object.keys(variables).map(variable => [variable, variable]);
    return options.length ? options : [['default', 'default']];
  }
}

block('sparql_variable_varname', {
  init: function() {
    this.appendDummyInput()
        .appendField("")
        .appendField(new Blockly.FieldTextInput("var"), "VARIABLE");
    this.setColour(70);
    this.setOutput(true, Sparql.TYPE_VARIABLE);
    this.setTooltip("Name: Variable name\nVariable name in property block.\nCan be connected to: SubTriple.");
  }
});

block('sparql_variable_confirmed', {
  init: function() {
    this.appendDummyInput()
        .appendField("?")
        .appendField(new Blockly.FieldTextInput("custom var"), "VARIABLE");
    this.setColour(460);
    this.setOutput(true, Sparql.TYPE_VARIABLE);
    this.setTooltip("Name: Subject\nUsed in Triple Pattern block, indicate the subject name(class name).\nCan be connected to: Pattern(Triple Pattern).");
  }
});

block('sparql_bind', {
  init: function() {
    this.appendValueInput("EXPRESSION")
        .setCheck([Sparql.TYPE_VARIABLE, Sparql.TYPE_ARITHMRETIC])
        .appendField("BIND");
    this.appendDummyInput()
        .appendField("AS")
        .appendField(new Blockly.FieldTextInput("newVar"), "VARIABLE");
    this.setPreviousStatement(true, Sparql.TYPE_PATTERN);
    this.setNextStatement(true, Sparql.TYPE_PATTERN);
    this.setColour(160);
    this.setTooltip("Name: Bind\nBind a value to a variable.\nCan connect to: Pattern.\nCan be connected by: Aggregate, Arithmetic, Variable.");
  }
});

block('sparql_as', {
  init: function() {
    this.appendValueInput('VARIABLE1')
        .setCheck([Sparql.TYPE_VARIABLE, Sparql.TYPE_ARITHMRETIC, Sparql.TYPE_AGGREGATE]);
    this.appendDummyInput()
        .appendField("AS")
        .appendField(new Blockly.FieldTextInput("newVar"), "VARIABLE2");
    this.appendValueInput("NEXT_VARIABLE")
        .setCheck(Sparql.TYPE_VARIABLE);
    this.setOutput(true, Sparql.TYPE_VARIABLE);
    this.setColour(160);
    this.setInputsInline(true);
    this.setTooltip("Name: As\nRename a variable.\nCan be connected by: Aggregate, Arithmetic, Variable.");
  }
});