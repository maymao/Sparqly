import prefixToIri from 'data/prefix.cc.json';

const iriToPrefix = {};
Object.keys(prefixToIri).forEach(prefix => {
    const iri = prefixToIri[prefix];
    if (!iriToPrefix[iri]) {
        iriToPrefix[iri] = prefix;
    }
});

// Lookup prefix, return IRI
export const lookupIri = (prefix) => {
    return prefixToIri[prefix];
};

// Lookup IRI, return prefix
export const lookupPrefix = (iri) => {
    let prefix = iriToPrefix[iri];
    if (prefix) {
        return {prefix, local:''};
    }
    let new_iri = null; // new IRI(shorter than the original one)
    const searchStr = iri.substr(0, iri.length - 1); // search string initialisation
    let separation = searchStr.lastIndexOf('#'); // cut the iri at last #
    if (separation > -1) {
        new_iri = iri.substr(0, separation + 1);
    } else {
        separation = searchStr.lastIndexOf('/');
        if (separation > -1) {
            new_iri = iri.substr(0, separation + 1);
        }
    }
    if (new_iri) {
        new_prefix = lookupPrefix(new_iri);
        if (new_prefix) {
            return {
                prefix: new_prefix.prefix, 
                local: new_prefix.local + iri.substr(separation + 1)
            };
        }
    }
    return null;
};
