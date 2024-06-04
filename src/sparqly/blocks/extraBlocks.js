import Blockly from 'blockly';
import { block } from '../core/blocks.js';

block('sparql_isURI', {
  init: function() {
    this.appendValueInput("VAR")
        .setCheck("Variable")
        .appendField("isURI");
    this.setOutput(true, "Boolean");
    this.setColour(160);
    this.setTooltip("Checks if a variable is a URI.");
    this.setHelpUrl("");
  }
});

block('sparql_isBlank', {
  init: function() {
    this.appendValueInput("VAR")
        .setCheck("Variable")
        .appendField("isBlank");
    this.setOutput(true, "Boolean");
    this.setColour(160);
    this.setTooltip("Checks if a variable is blank.");
    this.setHelpUrl("");
  }
});

block('sparql_isLiteral', {
  init: function() {
    this.appendValueInput("VAR")
        .setCheck("Variable")
        .appendField("isLiteral");
    this.setOutput(true, "Boolean");
    this.setColour(160);
    this.setTooltip("Checks if a variable is a literal.");
    this.setHelpUrl("");
  }
});

block('sparql_bound', {
  init: function() {
    this.appendValueInput("VAR")
        .setCheck("Variable")
        .appendField("bound");
    this.setOutput(true, "Boolean");
    this.setColour(160);
    this.setTooltip("Checks if a variable is bound.");
    this.setHelpUrl("");
  }
});

block('sparql_str', {
  init: function() {
    this.appendValueInput("VAR")
        .setCheck("Variable")
        .appendField("str");
    this.setOutput(true, "String");
    this.setColour(160);
    this.setTooltip("Returns the string representation of a variable.");
    this.setHelpUrl("");
  }
});

block('sparql_lang', {
  init: function() {
    this.appendValueInput("VAR")
        .setCheck("Variable")
        .appendField("lang");
    this.setOutput(true, "String");
    this.setColour(160);
    this.setTooltip("Returns the language tag of a literal.");
    this.setHelpUrl("");
  }
});

block('sparql_datatype', {
  init: function() {
    this.appendValueInput("VAR")
        .setCheck("Variable")
        .appendField("datatype");
    this.setOutput(true, "String");
    this.setColour(160);
    this.setTooltip("Returns the datatype of a literal.");
    this.setHelpUrl("");
  }
});

block('sparql_sameTerm', {
  init: function() {
    this.appendValueInput("VAR1")
        .setCheck("Variable")
        .appendField("sameTerm");
    this.appendValueInput("VAR2")
        .setCheck("Variable")
        .appendField(",");
    this.setOutput(true, "Boolean");
    this.setColour(160);
    this.setTooltip("Checks if two terms are the same.");
    this.setHelpUrl("");
  }
});

block('sparql_langMatches', {
  init: function() {
    this.appendValueInput("LANGTAG")
        .setCheck("String")
        .appendField("langMatches");
    this.appendValueInput("PATTERN")
        .setCheck("String")
        .appendField(",");
    this.setOutput(true, "Boolean");
    this.setColour(160);
    this.setTooltip("Checks if a language tag matches a pattern.");
    this.setHelpUrl("");
  }
});

block('sparql_regex', {
  init: function() {
    this.appendValueInput("TEXT")
        .setCheck("String")
        .appendField("regex");
    this.appendValueInput("PATTERN")
        .setCheck("String")
        .appendField(",");
    this.setOutput(true, "Boolean");
    this.setColour(160);
    this.setTooltip("Checks if a text matches a pattern.");
    this.setHelpUrl("");
  }
});


