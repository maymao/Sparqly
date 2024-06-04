const extendSparqlWithCount = (Sparql) => {
    Sparql.sparql_count = function(block) {
      const variable = Sparql.valueToCode(block, 'VARIABLE', Sparql.ORDER_ATOMIC) || '?var';
      const code = `COUNT(${variable})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };
    
const extendSparqlWithSum = (Sparql) => {
    Sparql.sparql_sum = function(block) {
      const variable = Sparql.valueToCode(block, 'VARIABLE', Sparql.ORDER_ATOMIC) || '?var';
      const code = `SUM(${variable})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };

const extendSparqlWithAvg = (Sparql) => {
    Sparql.sparql_avg = function(block) {
      const variable = Sparql.valueToCode(block, 'VARIABLE', Sparql.ORDER_ATOMIC) || '?var';
      const code = `AVG(${variable})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };
  
const extendSparqlWithMin = (Sparql) => {
    Sparql.sparql_min = function(block) {
      const variable = Sparql.valueToCode(block, 'VARIABLE', Sparql.ORDER_ATOMIC) || '?var';
      const code = `MIN(${variable})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };

const extendSparqlWithMax = (Sparql) => {
    Sparql.sparql_max = function(block) {
      const variable = Sparql.valueToCode(block, 'VARIABLE', Sparql.ORDER_ATOMIC) || '?var';
      const code = `MAX(${variable})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };
  
  export { extendSparqlWithCount, extendSparqlWithMin, extendSparqlWithSum,
        extendSparqlWithAvg,extendSparqlWithMax };
  
      