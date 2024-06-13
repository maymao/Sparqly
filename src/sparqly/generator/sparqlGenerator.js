import Blockly from 'blockly/core';


const Sparql = new Blockly.Generator('Sparql');

Sparql.addReservedWords('');
// Sparql.STMNT_BRK = "###\n";
// Sparql.STMNT_BRK_RE = /###\n/;
// Priority
Sparql.ORDER_ATOMIC = 0;
Sparql.ORDER_ADDITION = 6;
Sparql.ORDER_SUBTRACTION = 6;
Sparql.ORDER_MULTIPLICATION = 5;
Sparql.ORDER_DIVISION = 5;
Sparql.ORDER_RELATIONAL = 8;
Sparql.ORDER_LOGICAL_AND = 13;
Sparql.ORDER_LOGICAL_OR = 14;
Sparql.ORDER_LOGICAL_NOT = 4;
Sparql.ORDER_NONE = 99;


// types
Sparql.TYPE_STRING = 'String';
Sparql.TYPE_NUMBER = 'Number';
Sparql.TYPE_BOOLEAN = 'Boolean';
Sparql.TYPE_NULL = 'Null';
Sparql.TYPE_PATTERN = 'Pattern';
Sparql.TYPE_VARIABLE = 'Variable';
Sparql.TYPE_ARITHMETIC = 'Arithmetic';
Sparql.TYPE_AGGREGATE = 'Aggregate';
Sparql.TYPE_BRACE = 'Brace';
Sparql.TYPE_MODIFIER = 'Modifier';
Sparql.TYPE_KEYWORD = 'Keyword';
Sparql.TYPE_CLASSPROPERTY = 'ClassProperty';
Sparql.TYPE_SUBTRIPLE = 'SubTriple';
Sparql.TYPE_FUNCTIONCALL = 'FunctionCall';


// Sparql.statementJoin = function(statements, joinStr) {
//   const arr = statements.split(Sparql.STMNT_BRK_RE);
//   arr.pop();
//   return arr.join(joinStr);
// };

// Sparql.graphToCode = function(block, inputName) {
//   return Sparql.statementJoin(
//     Sparql.statementToCode(block, inputName),'.\n');
// };

export { Sparql };