const extendSparqlWithPrefix = (Sparql) => {
    Sparql.sparql_prefix = function(block) {
        var code = '';
        let prefixes = {};
        for (let i = 0; i < block.prefixCount_; i++) {
            const prefixLabel = block.getFieldValue('PREFIX_LABEL' + i) || '';
            const uri = block.getFieldValue('URI' + i) || '';
            // if (prefixLabel && uri) {
            //     const uniqueKey = 'prefix_' + i;
            //     prefixes[uniqueKey] = prefixLabel;
            //     code += `PREFIX ${prefixLabel}: <${uri}>\n`;
            // }             
            const uniqueKey = 'prefix_' + i;
            prefixes[uniqueKey] = prefixLabel;
            code += `PREFIX ${prefixLabel}: <${uri}>\n`;

        }
        localStorage.setItem('prefixes', JSON.stringify(prefixes));
        return code;
    };
};
  
const extendSparqlWithPrefixList = (Sparql) => {
    Sparql.sparql_prefix_list = function(block) {
        var prefix_key = block.getFieldValue('PREFIX');
        const prefixes = JSON.parse(localStorage.getItem('prefixes')) || {};
        const prefix = prefixes ? prefixes[prefix_key] : '';
        return [prefix, Sparql.ORDER_ATOMIC];
    };
};

export { extendSparqlWithPrefix, extendSparqlWithPrefixList };
  