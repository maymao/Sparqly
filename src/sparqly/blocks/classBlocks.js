import Blockly from 'blockly';
import { block } from '../core/blocks.js';
import { Sparql } from '../generator/sparqlGenerator.js';

// 弃用
block('sparql_class', {
  init: function() {
    this.appendDummyInput()
        .appendField("Class Properties")
    this.appendStatementInput("PROPERTIES")
        .setCheck("Property")
    this.setPreviousStatement(true, "Class");
    this.setNextStatement(true, "Class");
    this.setColour(120);
    this.setTooltip("Select a class.");
  }
});
  
// block('sparql_property', {
//   init: function() {
//     this.appendValueInput("PROPERTY")
//         .appendField("Property")
//         .setCheck(["VARIABLE", "Variable"]);
//     this.setPreviousStatement(true, "Property");
//     this.setNextStatement(true, "Property");
//     this.setColour(120);
//     this.setTooltip("Enter a property name.");
//   }
// });


block('sparql_class_with_property', {
  init: function() {
    this.appendValueInput("CLASS_NAME")
        .appendField("Class name")
        .setCheck(Sparql.TYPE_VARIABLE);
    this.appendStatementInput("PROPERTIES")
        .setCheck(Sparql.TYPE_CLASSPROPERTY)
    this.setColour(160);
    this.setTooltip("Name: Triple Pattern\nA triple pattern.\nCan be connected by: SubTriple.");
    this.setPreviousStatement(true, Sparql.TYPE_PATTERN);
    this.setNextStatement(true, Sparql.TYPE_PATTERN);
  }
});
