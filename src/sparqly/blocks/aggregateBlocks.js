import Blockly from 'blockly';
import { block } from '../core/blocks.js';
import { Sparql } from '../generator/sparqlGenerator.js';

block('sparql_count', {
  init: function() {
    this.appendValueInput("VARIABLE")
        .setCheck([Sparql.TYPE_VARIABLE, Sparql.TYPE_FUNCTIONCALL])
        .appendField("COUNT");
    this.setOutput(true, Sparql.TYPE_AGGREGATE);
    this.setColour(0);
    this.setTooltip("Name: Count\nCount the number of results.\nCan be connected by blocks: Variable.");
    this.setHelpUrl("");
  }
});

block('sparql_sum', {
  init: function() {
    this.appendValueInput("VARIABLE")
        .setCheck([Sparql.TYPE_VARIABLE, Sparql.TYPE_FUNCTIONCALL])
        .appendField("SUM");
    this.setOutput(true, Sparql.TYPE_AGGREGATE);
    this.setColour(0);
    this.setTooltip("Name: Sum\nSum the values of the specified variable.\nCan be connected by blocks: Variable");
    this.setHelpUrl("");
  }
});

block('sparql_avg', {
  init: function() {
    this.appendValueInput("VARIABLE")
        .setCheck([Sparql.TYPE_VARIABLE, Sparql.TYPE_FUNCTIONCALL])
        .appendField("AVG");
    this.setOutput(true, Sparql.TYPE_AGGREGATE);
    this.setColour(0);
    this.setTooltip("Name:Avg\nCalculate the average of the values of the specified variable.\nCan be connected by blocks: Variable.");
    this.setHelpUrl("");
  }
});

block('sparql_min', {
  init: function() {
    this.appendValueInput("VARIABLE")
        .setCheck([Sparql.TYPE_VARIABLE, Sparql.TYPE_FUNCTIONCALL])
        .appendField("MIN");
    this.setOutput(true, Sparql.TYPE_AGGREGATE);
    this.setColour(0);
    this.setTooltip("Name: Min\nFind the minimum value of the specified variable.\nCan be connected by blocks: Variable.");
    this.setHelpUrl("");
  }
});

block('sparql_max', {
  init: function() {
    this.appendValueInput("VARIABLE")
        .setCheck([Sparql.TYPE_VARIABLE, Sparql.TYPE_FUNCTIONCALL])
        .appendField("MAX");
    this.setOutput(true, Sparql.TYPE_AGGREGATE);
    this.setColour(0);
    this.setTooltip("Name: Max\nFind the maximum value of the specified variable.\nCan be connected by blocks: Variable.");
    this.setHelpUrl("");
  }
});