import { Sparql } from "./sparqlGenerator.js";
import { extendSparqlWithPrefix, extendSparqlWithPrefixList } from "./prefix";
import { extendSparqlWithAdd, extendSparqlWithDivide, extendSparqlWithMultiply, extendSparqlWithSubtract } from "./maths.js";
import { extendSparqlWithComparison } from "./maths.js";
import { extendSparqlWithAnd, extendSparqlWithOr, extendSparqlWithNot, extendSparqlWithIf, extendSparqlWithCoalesce } from "./logics.js";
import { extendSparqlWithString, extendSparqlWithNumber, extendSparqlWithVariableConfirmed } from "./variables.js";
import { extendSparqlWithFilter, extendSparqlWithExistence } from "./condition.js";
import { extendSparqlWithGroupBy, extendSparqlWithHaving, extendSparqlWithLimit, extendSparqlWithOffset } from "./condition.js";
import { extendSparqlWithOptional, extendSparqlWithUnion, extendSparqlWithOrderBy} from "./condition.js";
import { extendSparqlWithSum, extendSparqlWithAvg, extendSparqlWithCount, extendSparqlWithMax, extendSparqlWithMin } from "./aggregates.js";
import { extendSparqlWithVariableSelect } from "./variables.js";
import { extendSparqlWithDistinctReduced, extendSparqlWithSelect, extendSparqlWithCondition, extendSparqlWithProperty } from "./query.js";
import { extendSparqlWithClassWithProperty } from "./query.js";
import { extendSparqlWithVariableVarname, extendSparqlWithVariableTypename, extendSparqlWithVariableType } from "./variables.js";
import { extendSparqlWithPropertiesInClass } from "./query.js";
import { extendSparqlWithBind, extendSparqlWithAs } from "./variables.js";
import { extendSparqlWithIsURI, extendSparqlWithIsBlank, extendSparqlWithIsLiteral,
    extendSparqlWithBound, extendSparqlWithStr, extendSparqlWithLang,
    extendSparqlWithDatatype, extendSparqlWithSameTerm, extendSparqlWithLangMatches,
    extendSparqlWithRegex } from "./extra.js";

extendSparqlWithPrefix(Sparql);
extendSparqlWithPrefixList(Sparql);
extendSparqlWithAdd(Sparql);
extendSparqlWithSubtract(Sparql);
extendSparqlWithMultiply(Sparql);
extendSparqlWithDivide(Sparql);
extendSparqlWithAnd(Sparql);
extendSparqlWithOr(Sparql);
extendSparqlWithNot(Sparql);
extendSparqlWithString(Sparql);
extendSparqlWithNumber(Sparql);
extendSparqlWithComparison(Sparql);
extendSparqlWithFilter(Sparql);
extendSparqlWithExistence(Sparql);
extendSparqlWithGroupBy(Sparql);
extendSparqlWithHaving(Sparql);
extendSparqlWithLimit(Sparql);
extendSparqlWithOffset(Sparql);
extendSparqlWithUnion(Sparql);
extendSparqlWithOptional(Sparql);
extendSparqlWithOrderBy(Sparql);
extendSparqlWithSum(Sparql);
extendSparqlWithAvg(Sparql);
extendSparqlWithCount(Sparql);
extendSparqlWithMax(Sparql);
extendSparqlWithMin(Sparql);
extendSparqlWithVariableSelect(Sparql);
extendSparqlWithDistinctReduced(Sparql);
extendSparqlWithSelect(Sparql);
extendSparqlWithCondition(Sparql);
extendSparqlWithProperty(Sparql);
extendSparqlWithClassWithProperty(Sparql);
extendSparqlWithVariableVarname(Sparql);
extendSparqlWithVariableTypename(Sparql);
extendSparqlWithVariableType(Sparql);
extendSparqlWithVariableConfirmed(Sparql);
extendSparqlWithPropertiesInClass(Sparql);
extendSparqlWithBind(Sparql);
extendSparqlWithAs(Sparql);
extendSparqlWithIsURI(Sparql);
extendSparqlWithIsBlank(Sparql);
extendSparqlWithIsLiteral(Sparql);
extendSparqlWithBound(Sparql);
extendSparqlWithStr(Sparql);
extendSparqlWithLang(Sparql);
extendSparqlWithDatatype(Sparql);
extendSparqlWithSameTerm(Sparql);
extendSparqlWithLangMatches(Sparql);
extendSparqlWithRegex(Sparql);
extendSparqlWithIf(Sparql);
extendSparqlWithCoalesce(Sparql);

export { Sparql };