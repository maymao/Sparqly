import Blockly from 'blockly';
import { block } from '../core/blocks.js';

block('sparql_count', {
    init: function() {
      this.appendValueInput("VARIABLE")
          .setCheck(["Variable", "Math"])
          .appendField("COUNT");
      this.setOutput(true, "Number");
      this.setColour(0);
      this.setTooltip("Count the number of results.");
      this.setHelpUrl("");
    }
  });
block('sparql_sum',{
    init: function() {
      this.appendValueInput("VARIABLE")
          .setCheck(["Variable", "Math"])
          .appendField("SUM");
      this.setOutput(true, "Number");
      this.setColour(0);
      this.setTooltip("Sum the values of the specified variable.");
      this.setHelpUrl("");
    }
  });
block('sparql_avg', {
    init: function() {
      this.appendValueInput("VARIABLE")
          .setCheck(["Variable", "Math"])
          .appendField("AVG");
      this.setOutput(true, "Number");
      this.setColour(0);
      this.setTooltip("Calculate the average of the values of the specified variable.");
      this.setHelpUrl("");
    }
  });

block('sparql_min', {
    init: function() {
      this.appendValueInput("VARIABLE")
          .setCheck(["Variable", "Math"])
          .appendField("MIN");
      this.setOutput(true, "Number");
      this.setColour(0);
      this.setTooltip("Find the minimum value of the specified variable.");
      this.setHelpUrl("");
    }
  });

block('sparql_max', {
    init: function() {
      this.appendValueInput("VARIABLE")
          .setCheck(["Variable", "Math"])
          .appendField("MAX");
      this.setOutput(true, "Number");
      this.setColour(0);
      this.setTooltip("Find the maximum value of the specified variable.");
      this.setHelpUrl("");
    }
  });
          