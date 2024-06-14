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
Sparql.TYPE_PATTERN = 'Modifier';
Sparql.TYPE_KEYWORD = 'Keyword';
Sparql.TYPE_CLASSPROPERTY = 'ClassProperty';
Sparql.TYPE_SUBTRIPLE = 'SubTriple';
Sparql.TYPE_FUNCTIONCALL = 'FunctionCall';


const blockToName = {
    'sparql_count': 'Count',
    'sparql_sum': 'Sum',
    'sparql_avg': 'Average',
    'sparql_min': 'Minimum',
    'sparql_max': 'Maximum',
    'sparql_string': 'String',
    'sparql_number': 'Number',
    'sparql_braces': 'Braces',
    'sparql_class_with_property': 'Triple Pattern',
    'sparql_filter': 'Filter',
    'sparql_groupby': 'Group By',
    'sparql_having': 'Having',
    'sparql_if': 'If',
    'sparql_limit': 'Limit',
    'sparql_not': 'Not',
    'sparql_offset': 'Offset',
    'sparql_optional': 'Optional',
    'sparql_or': 'Or',
    'sparql_orderby': 'Order By',
    'sparql_conditon': 'Modifier Connector',
    'sparql_parentheses': 'Parentheses',
    'sparql_select': 'Select',
    'sparql_and': 'And',
    'sparql_coalesce': 'Coalesce',
    'sparql_comparison': 'Comparison',
    'sparql_add': 'Add',
    'sparql_subtract': 'Subtract',
    'sparql_multiply': 'Multiply',
    'sparql_divide': 'Divide',
    'sparql_prefix': 'Prefix',
    'sparql_prefix_list': 'Prefix List',
    'sparql_union': 'Union',
    'sparql_existence': 'Existence',
    'sparql_distinct_reduced': 'Distinct/Reduced',
    'sparql_as': 'As',
    'sparql_bind': 'Bind',
    'sparql_variable_type': 'Predicate-Object Pair',
    'sparql_variable_select': 'Variable list',
    'sparql_variable_select_demo': 'Variable',
    'sparql_variable_typename': 'Type Name',
    'sparql_variable_varname': 'Variable Name',
    'sparql_variable_confirmed': 'Subject',
    'sparql_properties_in_class': 'Connector',
  };

  const typeToBlock = {
    'String' : ['sparql_string'],
    'Number' : ['sparql_number'],
    'Boolean' : ['sparql_not', 'sparql_and', 'sparql_or', 'sparql_comparison'],
    'Modifier': ['sparql_having', 'sparql_limit', 'sparql_offset', 'sparql_orderby', 'sparql_groupby'],
    'Aggregate': ['sparql_count', 'sparql_sum', 'sparql_avg', 'sparql_min', 'sparql_max'],
    'Pattern': ['sparql_class_with_property', 'sparql_filter', 'sparql_optional', 'sparql_union', 'sparql_bind'],
    'Variable': ['sparql_variable_select', 'sparql_variable_select_demo', 'sparql_variable_typename', 'sparql_variable_varname', 'sparql_as'],
    'Arithmetic': ['sparql_add', 'sparql_subtract', 'sparql_multiply', 'sparql_divide'],
    'Keyword': ['sparql_prefix', 'sparql_select', 'sparql_distinct_reduced', 'sparql_condition', 'sparql_existence'],
    'SubTriple': ['sparql_variable_type'],
    'ClassProperty': ['sparql_properties_in_class'],
  }

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