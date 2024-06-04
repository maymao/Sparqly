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

Sparql.statementJoin = function(statements, joinStr) {
  const arr = statements.split(Sparql.STMNT_BRK_RE);
  arr.pop();
  return arr.join(joinStr);
};

Sparql.graphToCode = function(block, inputName) {
  return Sparql.statementJoin(
    Sparql.statementToCode(block, inputName),'.\n');
};

export { Sparql };