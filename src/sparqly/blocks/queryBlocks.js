import Blockly from 'blockly';
import { block } from '../core/blocks.js';
import { Sparql } from '../generator/sparqlGenerator.js';
  
block('sparql_select', {
    init: function() {
      this.appendValueInput("VARIABLES")
          .setCheck([Sparql.TYPE_VARIABLE, Sparql.TYPE_KEYWORD])
          .appendField("Explore all");
      this.appendStatementInput("WHERE")
          .setCheck(Sparql.TYPE_PATTERN)
          .appendField("That meet the following pattern");
      this.setPreviousStatement(true, Sparql.TYPE_KEYWORD);
      this.setNextStatement(true, Sparql.TYPE_KEYWORD);
      this.setColour(230);
      this.setTooltip("Name: Select\nPerform a SPARQL select query.\nFirst input can be connected by: Variable;\nSecond input can be connected by: Pattern.");
      this.setHelpUrl(""); 
    }
  });

  
block('sparql_distinct_reduced', {
    init: function() {
        this.appendValueInput("VARIABLE")
            .setCheck(Sparql.TYPE_VARIABLE)
            .appendField(new Blockly.FieldDropdown([["DISTINCT", "DISTINCT"], ["REDUCED", "REDUCED"]]), "DISTINCT");
        this.setOutput(true, Sparql.TYPE_KEYWORD);
        this.setColour(230);
        this.setTooltip("Name: Distinct/Reduced\nDISTINCT/REDUCED keyword selection block connects to Select variables option.\nCan be connected by: Variable.");
    }
});

// block('sparql_condition', {
//     init: function() {
//       this.appendStatementInput("CONDITIONS")
//           .setCheck(["Modifier", "Condition"])
//           .appendField("CONDITION");
//       this.setPreviousStatement(true, "Condition");
//       this.setColour(210);
//       this.setTooltip("Define classes and conditions for a SPARQL WHERE clause.");
//     }
//   });