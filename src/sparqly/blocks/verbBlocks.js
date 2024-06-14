import Blockly from 'blockly';
import { block } from '../core/blocks.js';
import { Sparql } from '../generator/sparqlGenerator.js';

block('sparql_union', {
  init: function() {
    this.appendStatementInput("PATTERN1")
        .setCheck(Sparql.TYPE_PATTERN)
        .appendField("UNION");
    this.appendStatementInput("PATTERN2")
        .setCheck(Sparql.TYPE_PATTERN)
    this.setPreviousStatement(true, Sparql.TYPE_PATTERN);
    this.setNextStatement(true, Sparql.TYPE_PATTERN);
    this.setColour(120);
    this.setTooltip("Name: Union\nUnion of patterns.\nCan be connected by: Pattern.");
  }
});

block('sparql_filter', {
  init: function() {
    this.appendValueInput("FILTER_CONDITION")
        .setCheck([Sparql.TYPE_BOOLEAN, Sparql.TYPE_KEYWORD])
        .appendField("FILTER");
    this.setPreviousStatement(true, Sparql.TYPE_PATTERN);
    this.setNextStatement(true, Sparql.TYPE_PATTERN);
    this.setColour(180);
    this.setTooltip("Name: Filter\nApply a filter condition to the query.\nCan be connected by: Pattern.");
    this.setHelpUrl("");
  }
});

block('sparql_existence', {
  init: function() {
      this.appendValueInput("Variables")
          .setCheck([Sparql.TYPE_PATTERN])
          .appendField(new Blockly.FieldDropdown([["EXISTS", "EXISTS"], ["NOT EXISTS", "NOT EXISTS"]]), "EXISTS");
      this.setOutput(true, Sparql.TYPE_KEYWORD);
      this.setColour(180);
      this.setTooltip("Name: Existence\nEXISTS/NOT EXISTS keyword selection block connects to Filter block (optional).\nCan be connected by: Pattern.");
  }
});

block('sparql_optional', {
  init: function() {
    this.appendStatementInput("PATTERN")
        .setCheck(Sparql.TYPE_PATTERN)
        .appendField("OPTIONAL");
    this.setPreviousStatement(true, Sparql.TYPE_PATTERN);
    this.setNextStatement(true, Sparql.TYPE_PATTERN);
    this.setColour(120);
    this.setTooltip("Name: Optional\nOptional pattern.\nCan be connected by: Pattern.");
    this.setHelpUrl("");
  }
});