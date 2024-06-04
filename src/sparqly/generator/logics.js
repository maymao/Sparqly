const extendSparqlWithNot = (Sparql) => {
    Sparql.sparql_not = function(block) {
      const operand = Sparql.valueToCode(block, 'OPERAND', Sparql.ORDER_ATOMIC) || 'false';
      const code = `!${operand}`;
      return [code, Sparql.ORDER_LOGICAL_NOT];
    };
};

const extendSparqlWithOr = (Sparql) => {
    Sparql.sparql_or = function(block) {
      const operand1 = Sparql.valueToCode(block, 'OPERAND1', Sparql.ORDER_ATOMIC) || 'false';
      const operand2 = Sparql.valueToCode(block, 'OPERAND2', Sparql.ORDER_ATOMIC) || 'false';
      const code = `${operand1} || ${operand2}`;
      return [code, Sparql.ORDER_LOGICAL_OR];
    };
};

const extendSparqlWithAnd = (Sparql) => {
    Sparql.sparql_and = function(block) {
      const operand1 = Sparql.valueToCode(block, 'OPERAND1', Sparql.ORDER_ATOMIC) || 'false';
      const operand2 = Sparql.valueToCode(block, 'OPERAND2', Sparql.ORDER_ATOMIC) || 'false';
      const code = `${operand1} && ${operand2}`;
      return [code, Sparql.ORDER_LOGICAL_AND];
    };
};
  

const extendSparqlWithIf = (Sparql) => {
  Sparql.sparql_if = function(block) {
    const condition = Sparql.valueToCode(block, 'CONDITION', Sparql.ORDER_NONE) || 'false';
    const trueValue = Sparql.valueToCode(block, 'TRUE_VALUE', Sparql.ORDER_ATOMIC) || '""';
    const falseValue = Sparql.valueToCode(block, 'FALSE_VALUE', Sparql.ORDER_ATOMIC) || '""';
    const code = `IF(${condition}, ${trueValue}, ${falseValue})`;
    return [code, Sparql.ORDER_FUNCTION_CALL];
  };
};

const extendSparqlWithCoalesce = (Sparql) => {
  Sparql.sparql_coalesce = function(block) {
    const arg1 = Sparql.valueToCode(block, 'ARG1', Sparql.ORDER_ATOMIC) || '""';
    const arg2 = Sparql.valueToCode(block, 'ARG2', Sparql.ORDER_ATOMIC) || '""';
    const code = `COALESCE(${arg1}, ${arg2})`;
    return [code, Sparql.ORDER_FUNCTION_CALL];
  };
};

export { extendSparqlWithNot, extendSparqlWithOr, extendSparqlWithAnd, extendSparqlWithIf, extendSparqlWithCoalesce };