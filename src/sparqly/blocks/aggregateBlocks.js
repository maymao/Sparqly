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

// const originalConnect = Blockly.Connection.prototype.connect;
// Blockly.Connection.prototype.connect = function(otherConnection) {
//     const sourceBlock = this.getSourceBlock();
//     const targetBlock = otherConnection.getSourceBlock();
//     const sourceCheck = this.getCheck();
//     const targetCheck = otherConnection.getCheck();
//     const sourceType = sourceCheck ? sourceCheck.join(', ') : 'Any type';
//     const targetType = targetCheck ? targetCheck.join(', ') : 'Any type';

//     // const typeSet = new Set();
//     // typeSet.add(sourceType);
//     // typeSet.add(targetType);

//     const blockToName = {
//       'sparql_count': 'Count',
//       'sparql_sum': 'Sum',
//       'sparql_avg': 'Average',
//       'sparql_min': 'Minimum',
//       'sparql_max': 'Maximum',
//       'sparql_string': 'String',
//       'sparql_number': 'Number',
//       'sparql_braces': 'Braces',
//       'sparql_class_with_property': 'Triple Pattern',
//       'sparql_filter': 'Filter',
//       'sparql_groupby': 'Group By',
//       'sparql_having': 'Having',
//       'sparql_if': 'If',
//       'sparql_limit': 'Limit',
//       'sparql_not': 'Not',
//       'sparql_offset': 'Offset',
//       'sparql_optional': 'Optional',
//       'sparql_or': 'Or',
//       'sparql_orderby': 'Order By',
//       'sparql_conditon': 'Modifier Connector',
//       'sparql_parentheses': 'Parentheses',
//       'sparql_select': 'Select',
//       'sparql_and': 'And',
//       'sparql_coalesce': 'Coalesce',
//       'sparql_comparison': 'Comparison',
//       'sparql_add': 'Add',
//       'sparql_subtract': 'Subtract',
//       'sparql_multiply': 'Multiply',
//       'sparql_divide': 'Divide',
//       'sparql_prefix': 'Prefix',
//       'sparql_prefix_list': 'Prefix List',
//       'sparql_union': 'Union',
//       'sparql_existence': 'Existence',
//       'sparql_distinct_reduced': 'Distinct/Reduced',
//       'sparql_as': 'As',
//       'sparql_bind': 'Bind',
//       'sparql_variable_type': 'Predicate-Object Pair',
//       'sparql_variable_select': 'Variable list',
//       'sparql_variable_select_demo': 'Variable',
//       'sparql_variable_typename': 'Type Name',
//       'sparql_variable_varname': 'Variable Name',
//       'sparql_variable_confirmed': 'Subject',
//       'sparql_properties_in_class': 'Connector',
//     };

//     const typeToBlock = {
//       'String' : ['sparql_string'],
//       'Number' : ['sparql_number'],
//       'Boolean' : ['sparql_not', 'sparql_and', 'sparql_or', 'sparql_comparison'],
//       'Modifier': ['sparql_having', 'sparql_limit', 'sparql_offset', 'sparql_orderby', 'sparql_groupby'],
//       'Aggregate': ['sparql_count', 'sparql_sum', 'sparql_avg', 'sparql_min', 'sparql_max'],
//       'Pattern': ['sparql_class_with_property', 'sparql_filter', 'sparql_optional', 'sparql_union', 'sparql_bind'],
//       'Variable': ['sparql_variable_select', 'sparql_variable_select_demo', 'sparql_variable_typename', 'sparql_variable_varname', 'sparql_as'],
//       'Arithmetic': ['sparql_add', 'sparql_subtract', 'sparql_multiply', 'sparql_divide'],
//       'Keyword': ['sparql_prefix', 'sparql_select', 'sparql_distinct_reduced', 'sparql_condition', 'sparql_existence'],
//       'SubTriple': ['sparql_variable_type'],
//       'ClassProperty': ['sparql_properties_in_class'],
//     }

//     console.log(`Attempting to connect block "${sourceBlock.type}" to block "${targetBlock.type}".`);
//     console.log(`${sourceBlock.type} can connect to types: ${sourceType}`);
//     console.log(`${targetBlock.type} can connect to types: ${targetType}`);
//     // var source = blockToName[sourceBlock.type];
//     // var target = blockToName[targetBlock.type];

//     // var logMessage = `<${source}> can connect to types: ${sourceType}\n\n<${target}> can connect to types: ${targetType}\n\n========================\n\n`;
    
//     // const allTypeMessage = Array.from(typeSet).map(type => {
//     //   const blocks = typeToBlock[type] || [];
//     //   const blockNames = blocks.map(block => blockToName[block]).join('\n');
//     //   return `${type} can connect to blocks:\n ${blockNames}`;
//     // }).join('\n');

//     // logMessage += allTypeMessage;
    
//     // const messageArray = JSON.parse(localStorage.getItem('blocklyLogs')) || [];
//     // messageArray.push(logMessage);
//     // localStorage.setItem('blocklyLogs', JSON.stringify(messageArray));

//     try {
//       console.log('Before original connect call:');
//       console.log('Source block:', sourceBlock);
//       console.log('Target block:', targetBlock);
//       console.log('This connection:', this);
//       console.log('Other connection:', otherConnection);
      
//       originalConnect.call(this, otherConnection);

//       console.log('After original connect call:');
//       console.log(`Successfully connected block "${sourceBlock.type}" to block "${targetBlock.type}".`);
//   } catch (e) {
//       console.error(`Connection error: block "${sourceBlock.type}" cannot connect to block "${targetBlock.type}".\nRequired types: ${sourceType}, but target block provides types: ${targetType}`);
//       console.error('Error:', e);
//       throw e; 
//   }
// };