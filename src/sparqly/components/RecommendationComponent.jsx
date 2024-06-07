import React, { useContext, useEffect, useState } from 'react';
import { SparqlContext } from '../SparqlContext';
import { sendSPARQLquery } from '../../pages/services/api';
import {
    getClasses,
    getDatatypeProperties,
    getDomainMapping,
    getFunctionalProperties,
    getKeyFunctionalProperties,
    getObjectPropertiesList,
    getObjectPropertyMapping,
    getRangeMapping,
    queryResultToData,
  } from '../../pages/SparqlPage/ConceptualModel/service';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    PaperProps,
    Toolbar,
    Typography,
  } from '@mui/material';
import {
    ChartType_mapping,
    DATA_DIMENTION_TYPE,
    countryListAlpha2,
    prefix_mapping,
    ranges_type_mapping,
  } from '../../utils';

const RecommendationComponent = ({ repo_graphDB, db_prefix_URL }) => {
    const { 
        sparqlCode, sparqlResult, recommendations, 
        setSparqlResult, setRecommendations, setExcludedRecommendations, setSparqlOriginalResult 
    } = useContext(SparqlContext);
    const [ConceptualModelInfo, setConceptualModelInfo] = useState({});
    const [columns, setColumns] = useState([]);
    const [fullLoading, setFullLoading] = useState(false);
    const [showMissingKeyWarning, setShowMissingKeyWarning] = useState(false);
    const [showTooMuchDataWarning, setShowTooMuchDataWarning] = useState(false);
    const [showManyManyRelationWarning, setShowManyManyRelationWarning] = useState(false);
    const [showManyManyRelationInfo, setShowManyManyRelationInfo] = useState(false);
    const [manyManyRInfo, setManyManyRInfo] = useState('');
    const [showOneManyRelationInfo, setShowOneManyRelationInfo] = useState(false);
    const [oneManyRInfo, setOneManyRInfo] = useState('');
    const [relationshipInfoDataAnalysis, setRelationshipInfoDataAnalysis] = useState('');
    const [showResult, setShowResult] = useState(false);

    const [recommendationConfig, setRecommendationConfig] = useState({
        column: 100,
        bar: 100,
        pie: 100,
        wordClouds: 1000,
        treemap: 300,
        hierarchyTree: 100,
        sunburst: 40,
        circlePacking: 40,
        // multiLine: 20,
        spider: 20,
        stackedColumn: 100,
        groupedColumn: 40,
        stackedBar: 100,
        groupedBar: 40,
        sankey: 100,
        chord: 100,
        network: 1000,
        heatmap: 100,
      });

  
  async function initConceptualModelInfo(repo_graphDB, db_prefix_URL) {
    try {
      const conceptualModelInfo = {};
      setFullLoading(true);
      const DP_Range_mapping = await getRangeMapping(repo_graphDB, db_prefix_URL);
      const classesList = await getClasses(repo_graphDB, db_prefix_URL);
      const FunctionalPropsList = await getFunctionalProperties(repo_graphDB, db_prefix_URL);
      const DatatypePropsList = await getDatatypeProperties(repo_graphDB, db_prefix_URL);
      const ObjectPropsList = await getObjectPropertiesList(repo_graphDB, db_prefix_URL);
      const ObjectPropsMapping = await getObjectPropertyMapping(repo_graphDB, db_prefix_URL);
      const DP_domain_mapping = await getDomainMapping(repo_graphDB, db_prefix_URL);
      const DPKList = await getKeyFunctionalProperties(repo_graphDB, db_prefix_URL);

      conceptualModelInfo['DP_Range_mapping'] = DP_Range_mapping;
      conceptualModelInfo['classesList'] = classesList;
      conceptualModelInfo['FunctionalPropsList'] = FunctionalPropsList;
      conceptualModelInfo['DatatypePropsList'] = DatatypePropsList;
      conceptualModelInfo['ObjectPropsList'] = ObjectPropsList;
      conceptualModelInfo['ObjectPropsMapping'] = ObjectPropsMapping;
      conceptualModelInfo['DP_domain_mapping'] = DP_domain_mapping;
      conceptualModelInfo['DPKList'] = DPKList;
      console.log('conceptualModelInfo: ', conceptualModelInfo);

      setConceptualModelInfo(conceptualModelInfo);
    } catch (error) {
      console.log(error);
    } finally {
      setFullLoading(false);
    }
  }

  async function generateVisRecommendation(user_query, dataResults = []) {
    const messages = [];
    const CLASSES = [];
    const DP_RANGE_LOCAL = {};
    const var_to_class = {}; // for variables in the query SELECT header
    const all_var_to_class = {}; // for all variables including the ones in the query body
    const var_to_range_mapping = {};
    const keyVar_cardinality_mapping = {};
    const potential_key_var_DP_map = {};
  
    // ratings dictionary:
    const ratings_recommendation = {};

    const user_query_normalised = user_query.replace(/[\n\t]/g, '');
    let user_query_split = user_query_normalised.split('where').length === 2 
      ? user_query_normalised.split('where') 
      : user_query_normalised.split('WHERE');
  
    if (user_query_split.length === 2) {
      const user_query_head = user_query_split[0];
      const user_query_body = user_query_split[1];
      // === STEP 1 analysis to the query head, to find the variables. ===
  
      // regex to match variables in the query. old version, not supported by
      // Safari so replaced for now.
      // const regex_vars = /(?<!rdf)(?:\?)[a-zA-Z_][a-zA-Z0-9_]*/gm;
  
      // regex to match variables in the query.
      const regex_vars = /\?[a-zA-Z_][a-zA-Z0-9_]*/gm;
      // match variables in the query head (text before 'WHERE').
      const vars_head = [];
      let m_head;
      while ((m_head = regex_vars.exec(user_query_head)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m_head.index === regex_vars.lastIndex) {
          regex_vars.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        m_head.forEach(match => {
          vars_head.push(match.split('?')[1]);
        });
      }
      console.log('step1 matches head', vars_head);
  
      // split the query body by '.' (parent statements) and ';'(children statements)
      const parent_statements = user_query_body.split('.');
  
      const PAB_LIST = {};
      const CA_DPA_mapping = {};
      const CA_PAB_mapping = {};
      for (const stmt of parent_statements) {
        const children_stmt = stmt.split(';');
        let class_type = '';
        for (const sub_stmt of children_stmt) {
          const sub_stmt_trim = sub_stmt.trim();
  
          // === STEP 2 analysis to the query body, to find the classes ===
          // console.log('statements, ', sub_stmt_trim);
          if (sub_stmt_trim.includes('rdf:type')) {
            const type_split = sub_stmt_trim.split('rdf:type');
            const variable = type_split[0].split('?')[1].trim();
            if (variable && variable.length > 0) {
              class_type = type_split[1].trim();
              var_to_class[variable] = class_type;
              all_var_to_class[variable] = class_type;
              CLASSES.push(class_type);
              CA_DPA_mapping[class_type] = [];
              CA_PAB_mapping[class_type] = [];
            }
          }
  
          // === STEP 3 analysis to the query body, to find the
          // dataProperty and ranges, and map them to the variables. ===
          // get DP and range
          let DP = '';
          if (
            ConceptualModelInfo.DatatypePropsList?.some(dp => {
              DP = dp;
              return sub_stmt_trim.includes(dp);
            }) ||
            ConceptualModelInfo.FunctionalPropsList?.some(dp => {
              DP = dp;
              return sub_stmt_trim.includes(dp);
            }) ||
            ConceptualModelInfo.DPKList?.some(dp => {
              DP = dp;
              return sub_stmt_trim.includes(dp);
            })
          ) {
            const DP_split = sub_stmt_trim.split(DP);
            const var_in_stmt = DP_split[1].split('?')[1];
            if (var_in_stmt && var_in_stmt.length > 0) {
              // var_to_DPA_mapping[var_in_stmt] = DP;
              const range = ConceptualModelInfo.DP_Range_mapping[DP];
              var_to_range_mapping[var_in_stmt] = range;
              DP_RANGE_LOCAL[DP] = range;
              all_var_to_class[var_in_stmt] = class_type;
              CA_DPA_mapping[class_type]?.push(DP);
              if (
                ranges_type_mapping(range) === DATA_DIMENTION_TYPE.LEXICAL ||
                ranges_type_mapping(range) === DATA_DIMENTION_TYPE.DISCRETE
              ) {
                if (vars_head.includes(var_in_stmt)) {
                  potential_key_var_DP_map[var_in_stmt] = DP;
                }
              }
            }
          }
  
          // === STEP 4 get PAB and its domain&range (2 linked classes) ===
          let PAB = '';
          if (
            ConceptualModelInfo.ObjectPropsList?.some(pab => {
              PAB = pab;
              // ! the space after the PAB below
              // ! is important to avoid matching PABs that are substrings of other PABs
              return sub_stmt_trim.includes(`${pab} `);
            })
          ) {
            // const PAB_split = sub_stmt_trim.split(PAB);
            const PAB_obj = ConceptualModelInfo.ObjectPropsMapping[PAB];
            // implicitly verifies PAB and its related classes are in the query
            const c1 = PAB_obj?.domain;
            const c2 = PAB_obj?.range;
            // TODO: this relationship bt PAB and classes should be checked,
            // but currently no effective way, leave it for future work
  
            // if (CLASSES.includes(c1) && CLASSES.includes(c2)) {
            PAB_LIST[PAB] = {
              domain: c1,
              range: c2,
            };
            // }
            CA_PAB_mapping[class_type]?.push(PAB);
          }
        }
      }
  
      const noKeyWarning =
        !vars_head.some(v => Object.keys(var_to_class).includes(v)) && 
        Object.keys(potential_key_var_DP_map).length === 0;
      setShowMissingKeyWarning(noKeyWarning);
  
      console.log('step2 Classes CA found: ', CLASSES);
      console.log('step2 var_to_class: ', var_to_class);
  
      console.log('step3 var_range mapping: ', var_to_range_mapping);
      console.log('DP and its Range TA found: ', DP_RANGE_LOCAL);  
      console.log('step3 CA_DPA mapping found: ', CA_DPA_mapping);
      console.log('step3 potential key DP found: ', potential_key_var_DP_map);
  
      console.log('step4 PAB found: ', PAB_LIST);
      console.log('step4 CA_PAB mapping found: ', CA_PAB_mapping);
  
      // !Recommendation rating algorithm here this one is based on analysing 
      // the query head and link to query content and data results.
  
      const total_class_num = CLASSES.length;
      const total_PAB_num = Object.keys(PAB_LIST).length;
      const query_head_count = vars_head.length;
      let nonKey_var_count = query_head_count;
      let key_var_count = 0;
  
      // key variables are the variables who is classes, or whose ranges are lexical 
      // ! constains variables in query body !
      const key_var_list = [
        ...Object.keys(potential_key_var_DP_map),
        ...Object.keys(var_to_class),
      ];
      const nonKey_var_list = vars_head.filter(v =>
        !key_var_list.includes(v) && !Object.keys(var_to_class).includes(v)
      );
      console.log('key_var_list: ', key_var_list);
      console.log('nonKey_var_list: ', nonKey_var_list);
  
      // ! cannot use the length of key_var_list to determine the number of key variables
      // ! because that includes vars in query body.
      // this means the query head contains variables whose ranges are lexical (so potential keys)
      if (Object.keys(potential_key_var_DP_map).length > 0) {
        nonKey_var_count -= Object.keys(potential_key_var_DP_map).length;
        key_var_count += Object.keys(potential_key_var_DP_map).length;
      }
      // this means the query head contains variables whose type are classes
      if (vars_head.some(v => Object.keys(var_to_class).includes(v))) {
        nonKey_var_count -= Object.keys(var_to_class).length; 
        key_var_count += Object.keys(var_to_class).length;
      }
      console.log('nonKey_var_count: ', nonKey_var_count);
      console.log('key_var_count: ', key_var_count);
  
      const ratings_1_class =
        total_class_num === 1
          ? generateRatingsFor1C(
              dataResults,
              key_var_count,
              nonKey_var_count,
              nonKey_var_list,
              var_to_range_mapping,
              key_var_list,
              messages,
            )
          : {};
  
      const hasKeyFunctionalProperty = Object.keys(DP_RANGE_LOCAL).some(
        dp => ConceptualModelInfo.DPKList?.includes(dp)
      );
  
      const ratings_2_class_1PAB =
        total_class_num === 2 &&
        total_PAB_num === 1 &&
        !hasKeyFunctionalProperty
          ? await generateRatingsFor2C1PAB(
              dataResults,
              key_var_count,
              nonKey_var_count,
              nonKey_var_list,
              var_to_range_mapping,
              vars_head,
              CLASSES,
              all_var_to_class,
              messages,
            )
          : {};
      const ratings_multi_class_layer_relation =
        total_class_num > 2 && total_PAB_num >= 1
          ? await generateRatingsForMCMPAB(
              dataResults,
              key_var_count,
              nonKey_var_count,
              var_to_range_mapping,
              vars_head,
              CLASSES,
              PAB_LIST,
              all_var_to_class,
              messages,
            )
          : {};
      // console.log(
      //   'ratings_multi_class_layer_relation: ',
      //   ratings_multi_class_layer_relation,
      // );
  
      const ratings_2_class_1DP =
        total_class_num === 2 && hasKeyFunctionalProperty
          ? await generateRatingsFor2C1DP(
              dataResults,
              key_var_count,
              nonKey_var_count,
              key_var_list,
              nonKey_var_list,
              var_to_range_mapping,
              vars_head,
              CLASSES,
              all_var_to_class,
              messages,
            )
          : {};
  
      const ratings_3_class =
        total_class_num === 3
          ? generateRatingsFor3C(
              dataResults,
              key_var_count,
              nonKey_var_count,
              key_var_list,
              nonKey_var_list,
              var_to_range_mapping,
              CLASSES,
              messages,
            )
          : {};
  
      // alternatively, level-2 recommendation can be generated by checking
      // the variables in header:
      let ratings_1_class_l2 = {};
      const var_total = vars_head.length;
      const var_class = Object.keys(var_to_class).length;
      if (
        var_total == 2 &&
        (var_class == 1 ||
          Object.values(var_to_range_mapping).some(v => 
            ranges_type_mapping(v) == DATA_DIMENTION_TYPE.LEXICAL
          )) &&
        Object.values(var_to_range_mapping).some(v => 
          ranges_type_mapping(v) == DATA_DIMENTION_TYPE.SCALAR
        )
      ) {
        ratings_1_class_l2 = generateRatingsFor1C(
          dataResults,
          key_var_count,
          nonKey_var_count,
          nonKey_var_list,
          var_to_range_mapping,
          key_var_list,
          messages,
        );
      }
  
      let total_class_num_l2 = total_class_num;
      let key_var_count_l2 = key_var_count;
      let nonKey_var_count_l2 = nonKey_var_count;
      // level-2 recommendations for 2class 1PAB:  
      if (Object.keys(PAB_LIST).length === 1 && total_class_num !== 2) {
        const c1 = CLASSES[0];
        if (PAB_LIST[Object.keys(PAB_LIST)[0]].domain === c1) {
          let difference_true_class = 2 - total_class_num;
          total_class_num_l2 += difference_true_class;
          key_var_count_l2 += difference_true_class;
          nonKey_var_count_l2 -= difference_true_class;
        }
      }
      const ratings_2_class_1PAB_l2 =
        total_class_num_l2 === 2 &&
        total_PAB_num === 1 &&
        !hasKeyFunctionalProperty
          ? await generateRatingsFor2C1PAB(
              dataResults,
              key_var_count_l2,
              nonKey_var_count_l2,
              nonKey_var_list,
              var_to_range_mapping,
              vars_head,
              CLASSES,
              all_var_to_class,
              messages,
            )
          : {};
      Object.assign(ratings_recommendation, 
        ratings_1_class,
        ratings_2_class_1PAB,
        ratings_2_class_1DP,
        ratings_3_class,
        ratings_1_class_l2,
        ratings_2_class_1PAB_l2
      );
  
      // when recommendation dict has intersected keys with ratings_recommendation:
      for (const [key, value] of Object.entries(ratings_multi_class_layer_relation)) {
        if (Object.keys(ratings_recommendation).includes(key)) {
          ratings_recommendation[key] += value;
        } else {
          ratings_recommendation[key] = value;
        }
      }
  
      // if rating valid in 3-class pattern, cancel the relation warning.
      const valuesOf3C = Object.values(ratings_3_class);
      const maxRating = Math.max(...(valuesOf3C || [0])); 
      if (maxRating > 0) {
        setShowManyManyRelationWarning(false);
      }
  
      if (dataResults.length > 0) {
        const keyColumns = Object.keys(potential_key_var_DP_map);
  
        const counts_instances = {};
        for (const key of keyColumns) {
            const subcounts = {};
            dataResults.forEach(row => {
            const value = row[key];
            subcounts[value] = (subcounts[value] || 0) + 1;
            counts_instances[key] = subcounts;
            });
            const cardinalityKey = Object.keys(counts_instances[key]).length;
            keyVar_cardinality_mapping[key] = cardinalityKey;
        }
      }
    }

  // Start to filter out the recommendations with threshold in
  // recommendation configuration:
  for (const r of Object.keys(ratings_recommendation)) {
    const rating = ratings_recommendation[r];
    if (rating === 0) {
      delete ratings_recommendation[r];
    }
  }
  console.log('final ratings_recommendation: ', ratings_recommendation);

  const excludedRatings = {};

  let exceedThreshold = false;

  console.log('keyVar_cardinality_mapping: ', keyVar_cardinality_mapping);
  let thresholdKey = 'unknown';
  for (const r of Object.keys(ratings_recommendation)) {
    // @ts-ignore
    const threshold = recommendationConfig[r];
    const actuallSize = Math.max(...Object.values(keyVar_cardinality_mapping));

    for (const key of Object.keys(keyVar_cardinality_mapping)) {
      if (keyVar_cardinality_mapping[key] === actuallSize) {
        thresholdKey = key;
        break;
      }
    }

    if (threshold && actuallSize > threshold) {
      exceedThreshold = true;
      excludedRatings[r] = { ...ratings_recommendation[r] };
      delete ratings_recommendation[r];
    }
  }
  setShowTooMuchDataWarning(exceedThreshold);

  const recommendations = [];
  const excludedRecommendations = [];
  // TODO: complete recommendations to all catogories
  for (const r of Object.keys(ratings_recommendation)) {
    const rating = ratings_recommendation[r];
    if (rating > 0) {
      recommendations.push({ chart: ChartType_mapping[r], rating });
    }
  }
  for (const r of Object.keys(excludedRatings)) {
    const rating = excludedRatings[r];
    if (rating > 0) {
      excludedRecommendations.push({
        chart: ChartType_mapping[r],
        rating,
        threshold: recommendationConfig[r],
        keyToCardinalityMapping: keyVar_cardinality_mapping,
        thresholdKey,
      });
    }
  }

  // Final recommendation results:
  const result = {
    recommendations: recommendations.sort((a, b) => b.rating - a.rating),
    excludedRecommendations: excludedRecommendations.sort(
      (a, b) => b.rating - a.rating
    ),
  };

  console.log('recommended vis: ', result);
  return result;
}

  function checkForManyManyRDataAnalysis(
    vars_head,
    var_to_range_mapping,
    dataResults,
    all_var_to_class,
    classPairsToBeChecked,
  ) {
    // check for posibble many-many relations:
    // by counting the number of unique values in the inferred key variables (lexical range)
    let key_var_head_atleast2instances = [];
    for (const ClassPair of classPairsToBeChecked) {
      const { class1, class2 } = ClassPair;
      // console.log('class1: ', class1);
      // console.log('class2: ', class2);

      const key_var_head = vars_head
        .filter((v) => {
          const range = var_to_range_mapping[v];
          return ranges_type_mapping(range) === DATA_DIMENTION_TYPE.LEXICAL;
        })
        .filter((v) => {
          return (
            all_var_to_class[v] === class1 || all_var_to_class[v] === class2
          );
        });

      const instance_stats = {};
      key_var_head.forEach((column) => {
        instance_stats[column] = {};
      });

      dataResults.forEach((row, index) => {
        key_var_head.forEach((column) => {
          const data = row[column];
          if (instance_stats[column][data]) {
            instance_stats[column][data] += 1;
          } else {
            instance_stats[column][data] = 1;
          }
        });
      });
      key_var_head_atleast2instances = key_var_head.filter((column) => {
        const instances_counts_dict = instance_stats[column];
        return Object.values(instances_counts_dict).some(
          (count) => count > 1,
        );
      });
      console.log(
        '[Data Analysis] checking for many-many relations:',
        instance_stats,
      );
    }

    if (key_var_head_atleast2instances.length > 1) {
      setShowManyManyRelationWarning(true);
      setRelationshipInfoDataAnalysis(
        `Many-Many Relationships detected in the Data Results`,
      );
      return true;
    } else if (key_var_head_atleast2instances.length === 1) {
      setShowManyManyRelationWarning(true);
      setRelationshipInfoDataAnalysis(
        'One-Many Relationships detected in the Data Results',
      );
    }
    return false;
  }

  function generateRatingsFor1C(
    dataResults,
    key_var_count,
    nonKey_var_count,
    nonKey_var_list,
    var_to_range_mapping,
    key_var_list,
    messages
  ) {
    const ratings = {
      scatter: 0,
      bubble: 0,
      bar: 0,
      column: 0,
      line: 0,
      wordClouds: 0,
      calendar: 0,
      pie: 0,
      choroplethMap: 0,
    };
  
    let findCountryNames = false;
    for (const row of dataResults) {
      const values = Object.values(row);
      if (
        Object.keys(countryListAlpha2).some(code => values.includes(code)) ||
        Object.values(countryListAlpha2).some(code => values.includes(code))
      ) {
        findCountryNames = true;
        console.log('Found geographical values in the data');
      }
    }
  
    if (key_var_count >= 1 && nonKey_var_count === 1) {
      const nonKey_var = nonKey_var_list[0];
      const nonKey_var_range = var_to_range_mapping[nonKey_var];
      if (ranges_type_mapping(nonKey_var_range) === DATA_DIMENTION_TYPE.SCALAR) {
        if (findCountryNames) {
          ratings.choroplethMap += 110;
        }
  
        ratings.bar += 100;
        ratings.column += 100;
        ratings.pie += 100;
        ratings.wordClouds = 100;
      }
  
      if (
        ranges_type_mapping(nonKey_var_range) === DATA_DIMENTION_TYPE.SCALAR &&
        key_var_list.some(
          v => ranges_type_mapping(var_to_range_mapping[v]) === DATA_DIMENTION_TYPE.LEXICAL
        )
      ) {
        if (findCountryNames) {
          ratings.choroplethMap += 110;
        }
  
        ratings.bar += 200;
        ratings.column += 100;
        ratings.pie += 100;
        ratings.wordClouds = 100;
      }
    }
  
    // for calendar chart, one of the variables must have a temporal range
    if (nonKey_var_count >= 1 && key_var_count <= 1) {
      if (
        nonKey_var_list.some(v => {
          const range = var_to_range_mapping[v];
          const range_type = ranges_type_mapping(range);
          return range_type === DATA_DIMENTION_TYPE.TEMPORAL;
        })
      ) {
        ratings.calendar += 80;
      }
    }
  
    if (nonKey_var_count === 2) {
      let allScalar = true;
  
      if (
        nonKey_var_list.some(v => {
          const range = var_to_range_mapping[v];
          if (ranges_type_mapping(range) !== DATA_DIMENTION_TYPE.SCALAR) {
            return true;
          }
        })
      ) {
        allScalar = false;
      }
      ratings.scatter += allScalar ? 100 : 0;
    }
  
    if (nonKey_var_count === 3) {
      let allScalar = true;
  
      if (
        nonKey_var_list.some(v => {
          const range = var_to_range_mapping[v];
          if (ranges_type_mapping(range) !== DATA_DIMENTION_TYPE.SCALAR) {
            return true;
          }
        })
      ) {
        allScalar = false;
      }
      ratings.scatter += allScalar ? 50 : 0;
      ratings.bubble += allScalar ? 100 : 0;
    }
    return ratings;
  }
  
  async function generateRatingsFor2C1PAB(
    dataResults,
    key_var_count,
    nonKey_var_count,
    nonKey_var_list,
    var_to_range_mapping,
    vars_head,
    CLASSES,
    all_var_to_class,
    messages
  ) {
    const ratings = {
      treemap: 0,
      hierarchyTree: 0,
      sunburst: 0,
      circlePacking: 0,
  
      // many-many relationships
      chord: 0,
      sankey: 0,
      network: 0,
      heatmap: 0,
    };
    // if key var is explicitly specified as classes or lexical value
    if (key_var_count === 2 && nonKey_var_count === 1) {
      if (
        nonKey_var_list.some(v => {
          const range = var_to_range_mapping[v];
          return ranges_type_mapping(range) === DATA_DIMENTION_TYPE.SCALAR;
        })
      ) {
        ratings.treemap += 100;
        ratings.sunburst += 100;
        ratings.circlePacking += 80;
      }
    }
  
    if (key_var_count == 2) {
      ratings.hierarchyTree += 100;
    }
  
    const relationshipCheck = await checkRelationshipsSchemaAnalysis(CLASSES);
    if (relationshipCheck.manyManyRelationships.length > 0) {
      let message = 'Many-Many Relationships detected between Classes: \n';
      for (const r of relationshipCheck.manyManyRelationships) {
        message += `[${r.class1} - ${r.class2}] \n`;
      }
      setManyManyRInfo(message);
      setShowManyManyRelationInfo(true);
    }
    if (relationshipCheck.oneManyRelationships.length > 0) {
      let message = 'One-Many Relationships detected between Classes: \n';
      for (const r of relationshipCheck.oneManyRelationships) {
        message += `[${r.class1} - ${r.class2}] \n`;
      }
      setOneManyRInfo(message);
      setShowOneManyRelationInfo(true);
    }
  
    const MMClasses = relationshipCheck.manyManyRelationships;
  
    const manyManyRInDataResult = checkForManyManyRDataAnalysis(
      vars_head,
      var_to_range_mapping,
      dataResults,
      all_var_to_class,
      MMClasses
    );
    if (manyManyRInDataResult) {
      // one-many R vis
      ratings.treemap = 0;
      ratings.sunburst = 0;
      ratings.circlePacking = 0;
      ratings.hierarchyTree = 0;
  
      // many-many R vis
      ratings.chord += 190;
      ratings.sankey += 200;
      ratings.heatmap += 190;
      ratings.network += 150;
    }
  
    return ratings;
  }
  
  async function checkRelationshipsSchemaAnalysis(CLASSES) {
    const classes_involved = CLASSES;
    console.log('[Schema Analysis] Classes involved in relation checks', classes_involved);
  
    const oneManyRelationships = [];
    const manyManyRelationships = [];
  
    for (let i = 0; i < classes_involved.length - 1; i++) {
      for (let j = i + 1; j < classes_involved.length; j++) {
        const class1 = classes_involved[i];
        const class2 = classes_involved[j];
  
        const query = sparql_find_relationships_2C(class1, class2);
        const querySwapped = sparql_find_relationships_2C(class2, class1);
        try {
          const queryRes = await sendSPARQLquery(repo_graphDB, query, true);
          const queryResSwapped = await sendSPARQLquery(repo_graphDB, querySwapped, true);
          const data = queryResultToData(queryRes);
          // console.log(`Permute class ${class1} and ${class2}`, data);
          const dataswapped = queryResultToData(queryResSwapped);
          // console.log(`Permute class ${class2} and ${class1}`, dataswapped);
  
          const prop_instance_mapping = {};
          let foundOneMany = false;
          if (data.length > 0) {
            for (const row of data) {
              const instance1 = row['c1'];
              const instance2 = row['c2'];
              const prop = row['interProp'];
              if (prop_instance_mapping[prop]) {
                if (prop_instance_mapping[prop][instance1]) {
                  prop_instance_mapping[prop][instance1].push(instance2);
                  foundOneMany = true;
                } else {
                  prop_instance_mapping[prop][instance1] = [instance2];
                }
              } else {
                prop_instance_mapping[prop] = {};
                prop_instance_mapping[prop][instance1] = [instance2];
              }
            }
          }
          console.log(`[Schema Analysis] props ${class1} - ${class2}  `, prop_instance_mapping);
  
          const prop_instance_mapping_swapped = {};
          let foundOneManySwapped = false;
          if (dataswapped.length > 0) {
            for (const row of dataswapped) {
              const instance1 = row['c1'];
              const instance2 = row['c2'];
              const prop = row['interProp'];
              if (prop_instance_mapping_swapped[prop]) {
                if (prop_instance_mapping_swapped[prop][instance1]) {
                  prop_instance_mapping_swapped[prop][instance1].push(instance2);
                  foundOneManySwapped = true;
                } else {
                  prop_instance_mapping_swapped[prop][instance1] = [instance2];
                }
              } else {
                prop_instance_mapping_swapped[prop] = {};
                prop_instance_mapping_swapped[prop][instance1] = [instance2];
              }
            }
            console.log(`[Schema Analysis] props ${class2} - ${class1}  `, prop_instance_mapping_swapped);
          }
          console.log(`[Schema Analysis] found one-many bwtween ${class1} - ${class2}?`, foundOneMany);
          console.log(`[Schema Analysis] found one-many bwtween ${class2} - ${class1}?`, foundOneManySwapped);
  
          if (foundOneMany && foundOneManySwapped) {
            // remove repeated class pairs
            const found = manyManyRelationships.find(r => r.class1 === class1 && r.class2 === class2);
  
            if (!found) {
              manyManyRelationships.push({
                class1,
                class2,
              });
            }
          } else if (foundOneMany) {
            oneManyRelationships.push({
              class1,
              class2,
            });
          } else if (foundOneManySwapped) {
            oneManyRelationships.push({
              class2,
              class1,
            });
          }
        } catch (e) {
          console.log('Error', e);
        }
      }
    }
  
    return { oneManyRelationships, manyManyRelationships };
  }
  
  const sparql_find_linking_PAB = (class1, class2) => {
    return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX : <${db_prefix_URL}>
  SELECT DISTINCT ?PAB
  WHERE {
      ?c1 rdf:type ${class1} .
      ?c2 rdf:type ${class2} .
      ?c1 ?PAB ?c2 . 
  }`;
  };
  
  const sparql_find_relationships_2C = (class1, class2) => {
    return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX : <${db_prefix_URL}>
    SELECT  ?c1 ?interProp ?c2
    WHERE {
        ?c1 rdf:type ${class1} ;
               ?interProp ?c2 .
        ?c2 rdf:type ${class2} ;
    }`;
  };
  
  async function generateRatingsForMCMPAB(
    dataResults,
    key_var_count,
    nonKey_var_count,
    var_to_range_mapping,
    vars_head,
    CLASSES,
    PAB_list,
    all_var_to_class,
    messages
  ) {
    const ratings = {
      // one-many R vis:
      treemap: 0,
      hierarchyTree: 0,
      sunburst: 0,
      circlePacking: 0,
  
      // many-many R vis:
      chord: 0,
      sankey: 0,
      heatmap: 0,
      network: 0,
    };
  
    const PABs = Object.keys(PAB_list);
    const PABs_classes = Object.values(PAB_list)
      .map(v => [v.domain, v.range])
      .flat()
      .filter(v => v !== 'unknown');
  
    const classes_involved = [...new Set([...PABs_classes, ...CLASSES])];
    if (key_var_count >= 3 && nonKey_var_count === 1) {
      // permute all possible 1-1 combinations of classes
      const allPABsFound = [];
      for (let i = 0; i < classes_involved.length - 1; i++) {
        for (let j = i + 1; j < classes_involved.length; j++) {
          const class1 = classes_involved[i];
          const class2 = classes_involved[j];
          const query = sparql_find_linking_PAB(class1, class2);
          const querySwapped = sparql_find_linking_PAB(class2, class1);
          try {
            const queryRes = await sendSPARQLquery(repo_graphDB, query, true);
            const queryResSwapped = await sendSPARQLquery(repo_graphDB, querySwapped, true);
            const data = queryResultToData(queryRes);
            // console.log(`Permute class ${class1} and ${class2}`, data);
            const dataswapped = queryResultToData(queryResSwapped);
            // console.log(`Permute class ${class2} and ${class1}`, dataswapped);
  
            const PABsFound = data.map(v => v.PAB).concat(dataswapped.map(v => v.PAB));
            allPABsFound.push(...PABsFound);
          } catch (e) {
            console.log('Error', e);
            break;
          }
        }
      }
      // console.log('allPABsFound', allPABsFound);
  
      let PABLinked = true;
      for (const pab of PABs) {
        if (!allPABsFound.includes(pab)) {
          PABLinked = false;
          break;
        }
      }
  
      if (PABLinked) {
        ratings.treemap += 100;
        ratings.sunburst += 90;
        ratings.circlePacking += 80;
        ratings.hierarchyTree += 20;
      }
    }
  
    const relationshipCheck = await checkRelationshipsSchemaAnalysis(CLASSES);
    if (relationshipCheck.manyManyRelationships.length > 0) {
      let message = 'Many-Many Relationships detected: \n';
      for (const r of relationshipCheck.manyManyRelationships) {
        message += `[${r.class1} - ${r.class2}] \n`;
      }
  
      setManyManyRInfo(message);
      setShowManyManyRelationInfo(true);
    }
    if (relationshipCheck.oneManyRelationships.length > 0) {
      let message = 'One-Many Relationships detected: \n';
    for (const r of relationshipCheck.oneManyRelationships) {
      message += `[${r.class1} - ${r.class2}] \n`;
    }

    setOneManyRInfo(message);
    setShowOneManyRelationInfo(true);
  }

  const MMClasses = relationshipCheck.oneManyRelationships;
  const manyManyRInDataResult = checkForManyManyRDataAnalysis(
    vars_head,
    var_to_range_mapping,
    dataResults,
    all_var_to_class,
    MMClasses
  );
  if (manyManyRInDataResult) {
    // one-many R vis:
    ratings.treemap = 0;
    ratings.sunburst = 0;  
    ratings.circlePacking = 0;
    ratings.hierarchyTree = 0;

    // many-many R vis: 
    ratings.chord += 190;
    ratings.sankey += 200;
    ratings.heatmap += 190;
    ratings.network += 150;
  }

  return ratings;
  }

  async function generateRatingsFor2C1DP(
    dataResults,
    key_var_count,
    nonKey_var_count, 
    key_var_list,
    nonKey_var_list,
    var_to_range_mapping,
    vars_head,
    CLASSES,
    all_var_to_class,
    messages
) {
  const ratings = {
    multiLine: 0,
    spider: 0,
    stackedBar: 0,
    groupedBar: 0,
    stackedColumn: 0,
    groupedColumn: 0,
  };
  if (key_var_count == 2 && nonKey_var_count === 1) {
    if (
      // scalar exists in the key variables and non-key variables
      nonKey_var_list.some(v => {
        const range = var_to_range_mapping[v];
        return ranges_type_mapping(range) === DATA_DIMENTION_TYPE.SCALAR;
      }) &&
      key_var_list.some(v => {
        const range = var_to_range_mapping[v];
        return (
          ranges_type_mapping(range) === DATA_DIMENTION_TYPE.SCALAR ||
          ranges_type_mapping(range) === DATA_DIMENTION_TYPE.DISCRETE
        );
      })
    ) {
      ratings.multiLine += 200;
      ratings.stackedBar += 100;  
      ratings.groupedBar += 100;
      ratings.stackedColumn += 110;
      ratings.groupedColumn += 110;
    }

    if (
      // scalar exists in the key variables and non-key variables
      nonKey_var_list.some(v => {
        const range = var_to_range_mapping[v];
        return ranges_type_mapping(range) === DATA_DIMENTION_TYPE.SCALAR;
      })
    ) {
      ratings.spider += 100;
      ratings.stackedBar += 50;
      ratings.groupedBar += 50;
      ratings.stackedColumn += 50;
      ratings.groupedColumn += 50;
    }

    ratings.multiLine += 20;
    ratings.stackedBar += 10;
    ratings.groupedBar += 10;  
    ratings.stackedColumn += 15;
    ratings.groupedColumn += 15;
  }

  return ratings;
  }

  function generateRatingsFor3C(
    dataResults,
    key_var_count,
    nonKey_var_count,
    key_var_list,
    nonKey_var_list,
    var_to_range_mapping, 
    CLASSES,
    messages
) {
  const ratings = {
    chord: 0,
    sankey: 0,
    network: 0,
    heatmap: 0,
  };
  if (key_var_count == 2 && nonKey_var_count === 1) {
    if (
      // scalar exists in the key variables and non-key variables
      nonKey_var_list.some(v => {
        const range = var_to_range_mapping[v];
        return ranges_type_mapping(range) === DATA_DIMENTION_TYPE.SCALAR;
      })
    ) {
      ratings.sankey += 100;
      ratings.chord += 100;
      ratings.heatmap += 100;
      ratings.network += 100;
    }
  }

  if (key_var_count == 2 && nonKey_var_count === 0) {
    if (
      // scalar exists in the key variables and non-key variables 
      nonKey_var_list.some(v => {
        const range = var_to_range_mapping[v];
        return ranges_type_mapping(range) === DATA_DIMENTION_TYPE.SCALAR;
      })
    ) {
      ratings.chord += 100;
      ratings.network += 100;
    }
  }
  return ratings;
  } 

  const executeQuery = async () => {
    if (sparqlCode && repo_graphDB && db_prefix_URL) {
      try {
        const query = await sendSPARQLquery(repo_graphDB, sparqlCode, true);
        setSparqlOriginalResult(query);
        const head = query.head.vars;
        const results_bindings = query.results.bindings;
  
        const columns = head.map((h) => ({
          field: h,
          headerName: h,
          minWidth: 300,
          maxWidth: 600,
        }));
        setColumns(columns);
  
        const colKeys = columns.map((col) => col.field);
  
        const data = results_bindings.map((data_binding, index) => {
          const obj = {};
          for (const key of colKeys) {
            const value = data_binding[key].value;
            const value_split = value.split('#');
            if (value_split.length > 1) {
              obj[key] = `${prefix_mapping[value_split[0]]}:${value_split[1]}`;
            } else {
              obj[key] = value;
            }
          }
          return {
            id: index,
            ...obj,
          };
        });
        setSparqlResult(data);
        // Generate Recommendations
        const recom = await generateVisRecommendation(sparqlCode, data);
        setRecommendations(recom.recommendations);
        setExcludedRecommendations(recom.excludedRecommendations);
      } catch (error) {
        console.error('Error executing SPARQL query:', error);
      }
    }
  };

  const handleShowResult = () => {
    setShowResult(!showResult);
  };

  useEffect(() => {
    if (sparqlCode && repo_graphDB && db_prefix_URL) {
      executeQuery();
    }
  }, [sparqlCode]);

  useEffect(() => {
    if (repo_graphDB && db_prefix_URL) {
      setFullLoading(true);
      initConceptualModelInfo(repo_graphDB, db_prefix_URL);
    }
  }, [repo_graphDB, db_prefix_URL]);

  return (
    <div>
      <pre>{`SPARQL Code:\n${sparqlCode}\n\nRepository Graph DB: ${repo_graphDB}\nDB Prefix URL: ${db_prefix_URL}`}
      </pre>
      <Button variant="contained" color="primary" onClick={executeQuery}>
          Execute Query
      </Button>
      <Button variant="contained" color="primary" onClick={handleShowResult}>
        {showResult ? 'Hide Result' : 'Show Result'}
      </Button>
      {showResult && sparqlResult && (
        <pre>{JSON.stringify(sparqlResult, null, 2)}</pre>
      )}
       <h2>Recommendations</h2>
      {recommendations && recommendations.length > 0 ? (
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>{rec.chart} - Rating: {rec.rating}</li>
          ))}
        </ul>
      ) : (
        <p>No recommendations available.</p>
      )}
    </div>
  );
};

export default RecommendationComponent;
