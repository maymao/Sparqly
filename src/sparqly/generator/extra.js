const extendSparqlWithIsURI = (Sparql) => {
    Sparql.sparql_isURI = function(block) {
      const variable = Sparql.valueToCode(block, 'VAR', Sparql.ORDER_ATOMIC) || '?var';
      const code = `isURI(${variable})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };
  
const extendSparqlWithIsBlank = (Sparql) => {
    Sparql.sparql_isBlank = function(block) {
      const variable = Sparql.valueToCode(block, 'VAR', Sparql.ORDER_ATOMIC) || '?var';
      const code = `isBlank(${variable})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };
  
const extendSparqlWithIsLiteral = (Sparql) => {
    Sparql.sparql_isLiteral = function(block) {
      const variable = Sparql.valueToCode(block, 'VAR', Sparql.ORDER_ATOMIC) || '?var';
      const code = `isLiteral(${variable})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };
  
const extendSparqlWithBound = (Sparql) => {
    Sparql.sparql_bound = function(block) {
      const variable = Sparql.valueToCode(block, 'VAR', Sparql.ORDER_ATOMIC) || '?var';
      const code = `bound(${variable})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };


const extendSparqlWithStr = (Sparql) => {
    Sparql.sparql_str = function(block) {
      const variable = Sparql.valueToCode(block, 'VAR', Sparql.ORDER_ATOMIC) || '?var';
      const code = `str(${variable})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };
  
const extendSparqlWithLang = (Sparql) => {
    Sparql.sparql_lang = function(block) {
      const variable = Sparql.valueToCode(block, 'VAR', Sparql.ORDER_ATOMIC) || '?var';
      const code = `lang(${variable})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };
  
const extendSparqlWithDatatype = (Sparql) => {
    Sparql.sparql_datatype = function(block) {
      const variable = Sparql.valueToCode(block, 'VAR', Sparql.ORDER_ATOMIC) || '?var';
      const code = `datatype(${variable})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };

const extendSparqlWithSameTerm = (Sparql) => {
    Sparql.sparql_sameTerm = function(block) {
      const var1 = Sparql.valueToCode(block, 'VAR1', Sparql.ORDER_ATOMIC) || '?var1';
      const var2 = Sparql.valueToCode(block, 'VAR2', Sparql.ORDER_ATOMIC) || '?var2';
      const code = `sameTerm(${var1}, ${var2})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };
  
const extendSparqlWithLangMatches = (Sparql) => {
    Sparql.sparql_langMatches = function(block) {
      const langTag = Sparql.valueToCode(block, 'LANGTAG', Sparql.ORDER_ATOMIC) || '""';
      const pattern = Sparql.valueToCode(block, 'PATTERN', Sparql.ORDER_ATOMIC) || '""';
      const code = `langMatches(${langTag}, ${pattern})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };
  
const extendSparqlWithRegex = (Sparql) => {
    Sparql.sparql_regex = function(block) {
      const text = Sparql.valueToCode(block, 'TEXT', Sparql.ORDER_ATOMIC) || '""';
      const pattern = Sparql.valueToCode(block, 'PATTERN', Sparql.ORDER_ATOMIC) || '""';
      const code = `regex(${text}, ${pattern})`;
      return [code, Sparql.ORDER_ATOMIC];
    };
  };
  
  export { extendSparqlWithIsURI, extendSparqlWithIsBlank, extendSparqlWithIsLiteral,
    extendSparqlWithBound, extendSparqlWithStr, extendSparqlWithLang,
    extendSparqlWithDatatype, extendSparqlWithSameTerm, extendSparqlWithLangMatches,
    extendSparqlWithRegex };