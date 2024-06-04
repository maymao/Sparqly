const extendSparqlWithNumber = (Sparql) => {
    Sparql.sparql_number = function(block) {
      const number = block.getFieldValue('NUMBER');
      const code = `${number}`;
      return [code, Sparql.ORDER_ATOMIC];
    };
};

const extendSparqlWithString = (Sparql) => {
    Sparql.sparql_string = function(block) {
        const string = block.getFieldValue('STRING');
        const code = `"${string}"`;
        return [code, Sparql.ORDER_ATOMIC];
    };
};

const extendSparqlWithVariableSelect = (Sparql) => {
    Sparql.sparql_variable_select = function(block) {
      const variable = block.getFieldValue('VARIABLE') || '';
      let code = `?${variable}`;
      var nextBlock = block.getInputTargetBlock('NEXT_VARIABLE');
      
      while (nextBlock) {
        var nextCode = nextBlock.getFieldValue('VARIABLE');
        if (nextCode) {
          code += ` ?${nextCode}`;
        }
        nextBlock = nextBlock.getInputTargetBlock('NEXT_VARIABLE');
      }
      
      return [code, Sparql.ORDER_ATOMIC];
  };
};

const extendSparqlWithVariableVarname = (Sparql) => {
  Sparql.sparql_variable_varname = function(block) {
    const varName = block.getFieldValue('VARIABLE') || 'unknownVar';
    var code = varName;
    return [code, Sparql.ORDER_ATOMIC];
  };
}

const extendSparqlWithVariableConfirmed = (Sparql) => {
  Sparql.sparql_variable_confirmed = function(block) {
    const varName = block.getFieldValue('VARIABLE') || 'unknownVar';
    var code = '?' + varName;
    return [code, Sparql.ORDER_ATOMIC];
  };
}

const extendSparqlWithVariableTypename = (Sparql) => {
  Sparql.sparql_variable_typename = function(block) {
    const varName = block.getFieldValue('VARIABLE') || 'unknownType';
    const code = ':' + varName;
    return [code, Sparql.ORDER_ATOMIC];
  };
}

// const extendSparqlWithVariableType = (Sparql) => {
//   Sparql.sparql_variable_type = function(block) {
//     const variable1 = block.getFieldValue('VARIABLE1') || 'unknownVar';
//     const variable2 = block.getFieldValue('VARIABLE2') || 'unknownVar';
//     const nextBlock = block.getInputTargetBlock('TYPE2');

//     var nameCode = '';
//     if (nextBlock) {
//       nameCode = nextBlock.type == 'sparql_variable_typename' ? ' :' + nextBlock.getFieldValue('VARIABLE') : ' ?' + nextBlock.getFieldValue('VARIABLE');
//     }
//     let code = variable1 + ':' + variable2;  // variable1:variable2
//     if (nameCode) {
//       code += nameCode;  
//     }

//     return [code, Sparql.ORDER_ATOMIC];
//   };
// }

const extendSparqlWithVariableType = (Sparql) => {
  Sparql.sparql_variable_type = function(block) {
    const variable1 = Sparql.valueToCode(block, 'TYPE1', Sparql.ORDER_ATOMIC) || '';
    const variable2 = block.getFieldValue('VARIABLE2') || 'unknownVar';
    const nextBlock = block.getInputTargetBlock('TYPE2');

    var nameCode = nextBlock ? Sparql.blockToCode(nextBlock)[0] : '';
    
    let code = variable1 + ':' + variable2;  // variable1:variable2
    if (nameCode) {
      code += nameCode;  
    }

    return [code, Sparql.ORDER_ATOMIC];
  };
}

const extendSparqlWithBind = (Sparql) => {
  Sparql.sparql_bind = function(block) {
    const expression = Sparql.valueToCode(block, 'EXPRESSION', Sparql.ORDER_ATOMIC) || '""';
    const variable = block.getFieldValue('VARIABLE') || 'newVar';
    const code = `BIND(${expression} AS ?${variable}) .\n`;
    return code;
  };
};
  
const extendSparqlWithAs = (Sparql) => {
  Sparql.sparql_as = function(block) {
    const expression = Sparql.valueToCode(block, 'VARIABLE1', Sparql.ORDER_ATOMIC) || '""';
    const variable = block.getFieldValue('VARIABLE2') || 'newVar';
    const code = `(${expression} AS ?${variable})`;
    return [code, Sparql.ORDER_ATOMIC];
  };
};

export { 
  extendSparqlWithNumber, 
  extendSparqlWithString, 
  extendSparqlWithVariableSelect,
  extendSparqlWithVariableTypename,
  extendSparqlWithVariableVarname,
  extendSparqlWithVariableType,
  extendSparqlWithBind,
  extendSparqlWithAs,
  extendSparqlWithVariableConfirmed 
 };
  