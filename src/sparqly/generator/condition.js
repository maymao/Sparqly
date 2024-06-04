const extendSparqlWithFilter = (Sparql) => {
    Sparql.sparql_filter = function(block) {
      const filterCondition = Sparql.valueToCode(block, 'FILTER_CONDITION', Sparql.ORDER_NONE) || 'FALSE';
      if (filterCondition.startsWith('EXISTS')) {
        const code = `FILTER ${filterCondition} \n`;
        return code;
      } else {
        const code = `FILTER(${filterCondition}) \n`;
        return code;
      }
    };
  };
  
const extendSparqlWithExistence = (Sparql) => {
    Sparql.sparql_existence = function(block) {
      const dropdownExists = block.getFieldValue('EXISTS');
      const variables = Sparql.valueToCode(block, 'Variables', Sparql.ORDER_NONE) || '';
      const code = `${dropdownExists} { ${variables} }`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };

const extendSparqlWithGroupBy = (Sparql) => {
    Sparql.sparql_groupby = function(block) {
      const variable = block.getFieldValue('VARIABLE') || '';
      const code = `GROUP BY ?${variable} \n`;
      return code;
    };
  };

const extendSparqlWithHaving = (Sparql) => {
    Sparql.sparql_having = function(block) {
      const havingCondition = Sparql.valueToCode(block, 'HAVING_CONDITION', Sparql.ORDER_NONE) || 'FALSE';
      const code = `HAVING(${havingCondition}) \n`;
      return code;
    };
  };

const extendSparqlWithLimit = (Sparql) => {
    Sparql.sparql_limit = function(block) {
      const limit = Sparql.valueToCode(block, 'LIMIT', Sparql.ORDER_ATOMIC) || '0';
      const code = `LIMIT ${limit} \n`;
      return code;
    };
  };

const extendSparqlWithOffset = (Sparql) => {
    Sparql.sparql_offset = function(block) {
      const offset = Sparql.valueToCode(block, 'OFFSET', Sparql.ORDER_ATOMIC) || '0';
      const code = `OFFSET ${offset} \n`;
      return code;
    };
  };

const extendSparqlWithOptional = (Sparql) => {
    Sparql.sparql_optional = function(block) {
      const pattern = Sparql.statementToCode(block, 'PATTERN') || '';
      const code = `OPTIONAL { ${pattern} } \n`;
      return code;
    };
  };
  
const extendSparqlWithUnion = (Sparql) => {
    Sparql.sparql_union = function(block) {
      const pattern1 = Sparql.statementToCode(block, 'PATTERN1') || '';
      const pattern2 = Sparql.statementToCode(block, 'PATTERN2') || '';
      const code = ` { ${pattern1} } \n UNION \n { ${pattern2} } \n`;
      return code;
    };
  };
  
const extendSparqlWithOrderBy = (Sparql) => {
    Sparql.sparql_orderby = function(block) {
      const order = block.getFieldValue('ORDER') || 'ASC';
      const variable = block.getFieldValue('VARIABLE') || '';
      const code = `ORDER BY ${order === 'DESC' ? 'DESC' : 'ASC'}(?${variable}) \n`;
      return code;
    };
  };

  
export { 
  extendSparqlWithFilter, 
  extendSparqlWithExistence, 
  extendSparqlWithGroupBy,
  extendSparqlWithHaving, 
  extendSparqlWithLimit,
  extendSparqlWithOffset,
  extendSparqlWithOptional, 
  extendSparqlWithUnion, 
  extendSparqlWithOrderBy 
};
  