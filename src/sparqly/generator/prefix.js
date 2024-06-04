const extendSparqlWithPrefix = (Sparql) => {
    Sparql.sparql_prefix = function(block) {
        var code = '';
        let prefixes = {};
        for (let i = 0; i < block.prefixCount_; i++) {
            const prefixLabel = block.getFieldValue('PREFIX_LABEL' + i);
            const uri = block.getFieldValue('URI' + i);
            if (prefixLabel && uri) {
                prefixes[prefixLabel] = uri;
                code += `PREFIX ${prefixLabel}: <${uri}>\n`;
            }
        }
        localStorage.setItem('prefixes', JSON.stringify(prefixes));
        return code;
    };
};
  
const extendSparqlWithPrefixList = (Sparql) => {
    Sparql.sparql_prefix_list = function(block) {
        var prefix = block.getFieldValue('PREFIX');
        
        return [prefix, Sparql.ORDER_ATOMIC];
    };
};
export { extendSparqlWithPrefix, extendSparqlWithPrefixList };
  