import Blockly from 'blockly';
import { block } from '../core/blocks.js';

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
    this.appendStatementInput("PROPERTIES")
        .setCheck("Class Property")
    this.setColour(160);
    this.setTooltip("Class with property block, connected by properties.");
    this.setPreviousStatement(true, "VARIABLE");
    this.setNextStatement(true, "VARIABLE");
  }
});
