import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CompletionContext, autocompletion } from '@codemirror/autocomplete';
import { StreamLanguage } from '@codemirror/language';
import { sparql } from '@codemirror/legacy-modes/mode/sparql';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  AppBar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popover,
  Skeleton,
  Snackbar,
  Switch,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DataGridPro } from '@mui/x-data-grid-pro';
import CodeMirror from '@uiw/react-codemirror';
import { forwardRef, useEffect, useState, useContext, useRef } from 'react';
import {
  ChartType_mapping,
  DATA_DIMENTION_TYPE,
  countryListAlpha2,
  prefix_mapping,
  ranges_type_mapping,
} from '../../utils';
import { sendSPARQLquery } from '../services/api';
import VisOptions, { ChartType } from './VisOptions';

import LoadingButton from '@mui/lab/LoadingButton';
import { deepClone } from '@mui/x-data-grid/utils/utils';
import { useSearchParams } from 'umi';
import { conceptualModelFunctions } from './ConceptualModel/function';
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
} from './ConceptualModel/service';
import { customIconsTheme, defaultAutocompletions } from './codeMirrorConfigs';
import BlocklyComponent from '../../sparqly/components/BlocklyComponent';
import { SparqlContext } from '../../sparqly/SparqlContext';
import Sparqly from '../../sparqly'
import * as Blockly from 'blockly';
import { Sparql } from '../../sparqly/generator/index.js';
import myTheme from '../../sparqly/core/theme.js';
import { Add, ChevronLeft, ChevronRight, Remove } from '@mui/icons-material';
import { Log } from '@antv/g2/lib/data';
import React from 'react';
import { clear } from 'console';
import { variables } from 'blockly/blocks';


export interface VisDataProps {
  headers: string[];
  data: (number | string)[][];
}

export interface ConceptialModelInfoProps {
  DP_Range_mapping?: any;
  classesList?: string[];
  FunctionalPropsList?: string[];
  DatatypePropsList?: string[];
  ObjectPropsList?: string[];
  ObjectPropsMapping?: any;
  DP_domain_mapping?: any;
  DPKList?: string[];
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface RecommendationProps {
  chart: ChartType;
  rating: number;
  threshold?: number;
  keyToCardinalityMapping?: any;
  thresholdKey?: string;
}

function isJson(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function SparqlyPage(props: any) {
  const { repo_graphDB, db_prefix_URL } = props;

  const initialString = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX : <http://www.semwebtech.org/mondial/10/meta#>
      
SELECT ?name ?population
WHERE {
  ?country rdf:type :Country ;
           :name ?name ;
           :population ?population .
} ORDER BY DESC(?population)`;

  const blocklyRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storedBlocks, setStoredBlocks] = useState<string[]>([]);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [sparqlCode, setSparqlCode] = useState<string>(initialString);
  const [logMessage, setLogMessage] = useState<string[]>([]);

  const [query, setQuery] = useState<string>(initialString);
  const [searchParams, setSearchParams] = useSearchParams();
  const [ConceptualModelInfo, setConceptualModelInfo] =
    useState<ConceptialModelInfoProps>({});
  const [fullLoading, setFullLoading] = useState(false);

  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openVis, setOpenVisOption] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState<boolean>(false);
  const [showCopyUnderUnsafeOrigin, setShowCopyUnderUnsafeOrigin] =
    useState<boolean>(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('');

  const [inferredDataQuery, setInferredDataQuery] = useState<boolean>(true);

  const [recommendations, setRecommendations] = useState<RecommendationProps[]>(
    [],
  );
  const [excludedRecommendations, setExcludedRecommendations] = useState<
    RecommendationProps[]
  >([]);

  // states for recommendation configs
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

  // function clearLogs() {
  //   localStorage.removeItem('blocklyLogs');
  //   setLogMessage([]);
  // }
  
  // const displayLogs = () => {
  //   const storedLogs = localStorage.getItem('blocklyLogs');
  //   if (storedLogs) {
  //     const parsedLogs = JSON.parse(storedLogs);
  //     if (JSON.stringify(parsedLogs) !== JSON.stringify(logMessage)) {
  //       setLogMessage(parsedLogs);
  //     }
  //   } else {
  //     if (logMessage.length !== 0) {
  //       setLogMessage([]);
  //     }
  //   }
  // };
  
  // useEffect(() => {
  //   displayLogs();
  // }, []);

  // useEffect(() => {
  //   clearLogs();
  // }, []);

  const increaseFontSize = () => {
    setFontSize((prevSize) => Math.min(prevSize + 2, 24)); // Increase font size, max 24px
  };
  
  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(prevSize - 2, 8)); // Decrease font size, min 8px
  };
  
  const getToolboxXML = () => {
    return `
<xml xmlns="https://developers.google.com/blockly/xml">
  
<category name="Examples" categorystyle="examples_category"></category>

<category name="Pattern1" categorystyle="patterns_category">
  <block type="sparql_variable_select">
    <field name="VARIABLE">?name</field>
    <value name="NEXT_VARIABLE">
      <block type="sparql_variable_select">
        <field name="VARIABLE">?population</field>
      </block>
    </value>
  </block>

  <block type="sparql_prefix">
    <mutation prefixes="4"></mutation>
    <field name="PREFIX_LABEL0">rdf</field>
    <field name="URI0">http://www.w3.org/1999/02/22-rdf-syntax-ns#</field>
    <field name="PREFIX_LABEL1">rdfs</field>
    <field name="URI1">http://www.w3.org/2000/01/rdf-schema#</field>
    <field name="PREFIX_LABEL2">owl</field>
    <field name="URI2">http://www.w3.org/2002/07/owl#</field>
    <field name="PREFIX_LABEL3"> </field>
    <field name="URI3">http://www.semwebtech.org/mondial/10/meta#</field>
    <next>
      <block type="sparql_select">
        <value name="VARIABLES">
          <block type="sparql_variable_select_demo">
            <field name="VARIABLE">name</field>
            <value name="NEXT_VARIABLE">
              <block type="sparql_variable_select_demo">
                <field name="VARIABLE">population</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="WHERE">
          <block type="sparql_class_with_property">
            <value name="CLASS_NAME">
              <block type="sparql_variable_confirmed">
                <field name="VARIABLE">country</field>
              </block>
            </value>
            <statement name="PROPERTIES">
              <block type="sparql_properties_in_class">
                <value name="INPUT">
                  <block type="sparql_variable_type">
                    <field name="VARIABLE2">type</field>
                    <value name="TYPE1">
                      <block type="sparql_prefix_list">
                        <field name="PREFIX">prefix_0</field>
                      </block>
                    </value>
                    <value name="TYPE2">
                      <block type="sparql_variable_typename">
                        <field name="LABEL"> </field>
                        <field name="VARIABLE">Country</field>
                      </block>
                    </value>
                  </block>
                </value>
                <next>
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">name</field>
                        <value name="TYPE2">
                          <block type="sparql_variable_varname">
                            <field name="VARIABLE">name</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">population</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">population</field>
                              </block>
                            </value>
                          </block>
                        </value>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </statement>
        <next>
          <block type="sparql_condition">
            <statement name="CONDITIONS">
              <block type="sparql_orderby">
                <field name="ORDER">DESC</field>
                <field name="VARIABLE">population</field>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </next>
  </block>

</category>
<category name="Pattern2" categorystyle="patterns_category">
  <block type="sparql_variable_select">
    <field name="VARIABLE">?inflation</field>
    <value name="NEXT_VARIABLE">
      <block type="sparql_variable_select">
        <field name="VARIABLE">?unemployment</field>
      </block>
    </value>
  </block>

  <block type="sparql_prefix">
    <mutation prefixes="2"></mutation>
    <field name="PREFIX_LABEL0">rdf</field>
    <field name="URI0">http://www.w3.org/1999/02/22-rdf-syntax-ns#</field>
    <field name="PREFIX_LABEL1"></field>
    <field name="URI1">http://www.semwebtech.org/mondial/10/meta#</field>
    <next>
      <block type="sparql_select">
        <value name="VARIABLES">
          <block type="sparql_variable_select_demo">
            <field name="VARIABLE">inflation</field>
            <value name="NEXT_VARIABLE">
              <block type="sparql_variable_select_demo">
                <field name="VARIABLE">unemployment</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="WHERE">
          <block type="sparql_class_with_property">
            <value name="CLASS_NAME">
              <block type="sparql_variable_confirmed">
                <field name="VARIABLE">c</field>
              </block>
            </value>
            <statement name="PROPERTIES">
              <block type="sparql_properties_in_class">
                <value name="INPUT">
                  <block type="sparql_variable_type">
                    <field name="VARIABLE2">type</field>
                    <value name="TYPE1">
                      <block type="sparql_prefix_list">
                        <field name="PREFIX">prefix_0</field>
                      </block>
                    </value>
                    <value name="TYPE2">
                      <block type="sparql_variable_typename">
                        <field name="LABEL"> </field>
                        <field name="VARIABLE">Country</field>
                      </block>
                    </value>
                  </block>
                </value>
                <next>
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">inflation</field>
                        <value name="TYPE2">
                          <block type="sparql_variable_varname">
                            <field name="VARIABLE">inflation</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">unemployment</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">unemployment</field>
                              </block>
                            </value>
                          </block>
                        </value>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </statement>
        <next>
          <block type="sparql_condition">
            <statement name="CONDITIONS">
              <block type="sparql_orderby">
                <field name="ORDER">DESC</field>
                <field name="VARIABLE">population</field>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </next>
  </block>
</category>

<category name="Pattern3" categorystyle="patterns_category">         
    <block type="sparql_variable_select">
      <field name="VARIABLE">?continent</field>
      <value name="NEXT_VARIABLE">
        <block type="sparql_variable_select">
          <field name="VARIABLE">?country</field>
          <value name="NEXT_VARIABLE">
            <block type="sparql_variable_select">
              <field name="VARIABLE">?population</field>
            </block>
          </value>
        </block>
      </value>
    </block>

  <block type="sparql_prefix" x="110" y="10">
    <mutation prefixes="2"></mutation>
    <field name="PREFIX_LABEL0">rdf</field>
    <field name="URI0">http://www.w3.org/1999/02/22-rdf-syntax-ns#</field>
    <field name="PREFIX_LABEL1"> </field>
    <field name="URI1">http://www.semwebtech.org/mondial/10/meta#</field>
    <next>
      <block type="sparql_select">
        <value name="VARIABLES">
          <block type="sparql_variable_select_demo">
            <field name="VARIABLE">continent</field>
            <value name="NEXT_VARIABLE">
              <block type="sparql_variable_select_demo">
                <field name="VARIABLE">country</field>
                <value name="NEXT_VARIABLE">
                  <block type="sparql_variable_select_demo">
                    <field name="VARIABLE">population</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </value>
        <statement name="WHERE">
          <block type="sparql_class_with_property">
            <value name="CLASS_NAME">
              <block type="sparql_variable_confirmed">
                <field name="VARIABLE">c</field>
              </block>
            </value>
            <statement name="PROPERTIES">
              <block type="sparql_properties_in_class">
                <value name="INPUT">
                  <block type="sparql_variable_type">
                    <field name="VARIABLE2">type</field>
                    <value name="TYPE1">
                      <block type="sparql_prefix_list">
                        <field name="PREFIX">prefix_0</field>
                      </block>
                    </value>
                    <value name="TYPE2">
                      <block type="sparql_variable_typename">
                        <field name="LABEL"> </field>
                        <field name="VARIABLE">Country</field>
                      </block>
                    </value>
                  </block>
                </value>
                <next>
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">name</field>
                        <value name="TYPE2">
                          <block type="sparql_variable_varname">
                            <field name="VARIABLE">country</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">population</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">population</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">encompassedByInfo</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">en</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
            <next>
              <block type="sparql_class_with_property">
                <value name="CLASS_NAME">
                  <block type="sparql_variable_confirmed">
                    <field name="VARIABLE">en</field>
                  </block>
                </value>
                <statement name="PROPERTIES">
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">encompassedBy</field>
                        <value name="TYPE1">
                          <block type="sparql_prefix_list">
                            <field name="PREFIX">prefix_1</field>
                          </block>
                        </value>
                        <value name="TYPE2">
                          <block type="sparql_variable_varname">
                            <field name="VARIABLE">con</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">percent</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">percent</field>
                              </block>
                            </value>
                          </block>
                        </value>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="sparql_class_with_property">
                    <value name="CLASS_NAME">
                      <block type="sparql_variable_confirmed">
                        <field name="VARIABLE">con</field>
                      </block>
                    </value>
                    <statement name="PROPERTIES">
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">type</field>
                            <value name="TYPE1">
                              <block type="sparql_prefix_list">
                                <field name="PREFIX">prefix_0</field>
                              </block>
                            </value>
                            <value name="TYPE2">
                              <block type="sparql_variable_typename">
                                <field name="LABEL"> </field>
                                <field name="VARIABLE">Continent</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">name</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">continent</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </next>
  </block>

</category>


<category name="Pattern4" categorystyle="patterns_category">
    <block type="sparql_variable_select">
      <field name="VARIABLE">?year</field>
      <value name="NEXT_VARIABLE">
        <block type="sparql_variable_select">
          <field name="VARIABLE">?population</field>
          <value name="NEXT_VARIABLE">
            <block type="sparql_variable_select">
              <field name="VARIABLE">?country</field>
            </block>
          </value>
        </block>
      </value>
    </block>

  <block type="sparql_prefix">
    <mutation prefixes="2"></mutation>
    <field name="PREFIX_LABEL0">rdf</field>
    <field name="URI0">http://www.w3.org/1999/02/22-rdf-syntax-ns#</field>
    <field name="PREFIX_LABEL1"></field>
    <field name="URI1">http://www.semwebtech.org/mondial/10/meta#</field>
    <next>
      <block type="sparql_select">
        <value name="VARIABLES">
          <block type="sparql_variable_select_demo">
            <field name="VARIABLE">year</field>
            <value name="NEXT_VARIABLE">
              <block type="sparql_variable_select_demo">
                <field name="VARIABLE">population</field>
                <value name="NEXT_VARIABLE">
                  <block type="sparql_variable_select_demo">
                    <field name="VARIABLE">country</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </value>
        <statement name="WHERE">
          <block type="sparql_class_with_property">
            <value name="CLASS_NAME">
              <block type="sparql_variable_confirmed">
                <field name="VARIABLE">c</field>
              </block>
            </value>
            <statement name="PROPERTIES">
              <block type="sparql_properties_in_class">
                <value name="INPUT">
                  <block type="sparql_variable_type">
                    <field name="VARIABLE2">type</field>
                    <value name="TYPE1">
                      <block type="sparql_prefix_list">
                        <field name="PREFIX">prefix_0</field>
                      </block>
                    </value>
                    <value name="TYPE2">
                      <block type="sparql_variable_typename">
                        <field name="LABEL"> </field>
                        <field name="VARIABLE">Country</field>
                      </block>
                    </value>
                  </block>
                </value>
                <next>
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">name</field>
                        <value name="TYPE2">
                          <block type="sparql_variable_varname">
                            <field name="VARIABLE">country</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">encompassed</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">conclass</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">hadPopulation</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">py</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
            <next>
              <block type="sparql_class_with_property">
                <value name="CLASS_NAME">
                  <block type="sparql_variable_confirmed">
                    <field name="VARIABLE">conclass</field>
                  </block>
                </value>
                <statement name="PROPERTIES">
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">name</field>
                        <value name="TYPE2">
                          <block type="sparql_variable_varname">
                            <field name="VARIABLE">continent</field>
                          </block>
                        </value>
                      </block>
                    </value>
                  </block>
                </statement>
                <next>
                  <block type="sparql_class_with_property">
                    <value name="CLASS_NAME">
                      <block type="sparql_variable_confirmed">
                        <field name="VARIABLE">py</field>
                      </block>
                    </value>
                    <statement name="PROPERTIES">
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">type</field>
                            <value name="TYPE1">
                              <block type="sparql_prefix_list">
                                <field name="PREFIX">prefix_0</field>
                              </block>
                            </value>
                            <value name="TYPE2">
                              <block type="sparql_variable_typename">
                                <field name="LABEL"> </field>
                                <field name="VARIABLE">PopulationCount</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">year</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">year</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                            <next>
                              <block type="sparql_properties_in_class">
                                <value name="INPUT">
                                  <block type="sparql_variable_type">
                                    <field name="VARIABLE2">value</field>
                                    <value name="TYPE2">
                                      <block type="sparql_variable_varname">
                                        <field name="VARIABLE">population</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </statement>
                    <next>
                      <block type="sparql_filter">
                        <value name="FILTER_CONDITION">
                          <block type="sparql_comparison">
                            <field name="OPERATOR">=</field>
                            <value name="OPERAND1">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">continent</field>
                              </block>
                            </value>
                            <value name="OPERAND2">
                              <block type="sparql_string">
                                <field name="STRING">Europe</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_filter">
                            <value name="FILTER_CONDITION">
                              <block type="sparql_existence">
                                <field name="EXISTS">EXISTS</field>
                                <value name="Variables">
                                  <block type="sparql_braces">
                                    <statement name="PATTERN">
                                      <block type="sparql_class_with_property">
                                        <value name="CLASS_NAME">
                                          <block type="sparql_variable_confirmed">
                                            <field name="VARIABLE">c</field>
                                          </block>
                                        </value>
                                        <statement name="PROPERTIES">
                                          <block type="sparql_properties_in_class">
                                            <value name="INPUT">
                                              <block type="sparql_variable_type">
                                                <field name="VARIABLE2">hadPopulation</field>
                                                <value name="TYPE2">
                                                  <block type="sparql_variable_varname">
                                                    <field name="VARIABLE">hp</field>
                                                  </block>
                                                </value>
                                              </block>
                                            </value>
                                          </block>
                                        </statement>
                                        <next>
                                          <block type="sparql_class_with_property">
                                            <value name="CLASS_NAME">
                                              <block type="sparql_variable_confirmed">
                                                <field name="VARIABLE">hp</field>
                                              </block>
                                            </value>
                                            <statement name="PROPERTIES">
                                              <block type="sparql_properties_in_class">
                                                <value name="INPUT">
                                                  <block type="sparql_variable_type">
                                                    <field name="VARIABLE2">value</field>
                                                    <value name="TYPE2">
                                                      <block type="sparql_variable_varname">
                                                        <field name="VARIABLE">hpv</field>
                                                      </block>
                                                    </value>
                                                  </block>
                                                </value>
                                              </block>
                                            </statement>
                                            <next>
                                              <block type="sparql_filter">
                                                <value name="FILTER_CONDITION">
                                                  <block type="sparql_comparison">
                                                    <field name="OPERATOR">&gt;</field>
                                                    <value name="OPERAND1">
                                                      <block type="sparql_variable_varname">
                                                        <field name="VARIABLE">hpv</field>
                                                      </block>
                                                    </value>
                                                    <value name="OPERAND2">
                                                      <block type="sparql_number">
                                                        <field name="NUMBER">20000000</field>
                                                      </block>
                                                    </value>
                                                  </block>
                                                </value>
                                              </block>
                                            </next>
                                          </block>
                                        </next>
                                      </block>
                                    </statement>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
        <next>
          <block type="sparql_condition">
            <statement name="CONDITIONS">
              <block type="sparql_orderby">
                <field name="ORDER"></field>
                <field name="VARIABLE">year</field>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </next>
  </block>
</category>
<category name="Pattern5" categorystyle="patterns_category">

    <block type="sparql_variable_select">
      <field name="VARIABLE">?country1</field>
      <value name="NEXT_VARIABLE">
        <block type="sparql_variable_select">
          <field name="VARIABLE">?country2</field>
          <value name="NEXT_VARIABLE">
            <block type="sparql_variable_select">
              <field name="VARIABLE">?length</field>
            </block>
          </value>
        </block>
      </value>
    </block>

  <block type="sparql_prefix">
    <mutation prefixes="4"></mutation>
    <field name="PREFIX_LABEL0">rdf</field>
    <field name="URI0">http://www.w3.org/1999/02/22-rdf-syntax-ns#</field>
    <field name="PREFIX_LABEL1">rdfs</field>
    <field name="URI1">http://www.w3.org/2000/01/rdf-schema#</field>
    <field name="PREFIX_LABEL2">owl</field>
    <field name="URI2">http://www.w3.org/2002/07/owl#</field>
    <field name="PREFIX_LABEL3"> </field>
    <field name="URI3">http://www.semwebtech.org/mondial/10/meta#</field>
    <next>
      <block type="sparql_select">
        <value name="VARIABLES">
          <block type="sparql_variable_select_demo">
            <field name="VARIABLE">country1</field>
            <value name="NEXT_VARIABLE">
              <block type="sparql_variable_select_demo">
                <field name="VARIABLE">country2</field>
                <value name="NEXT_VARIABLE">
                  <block type="sparql_variable_select_demo">
                    <field name="VARIABLE">length</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </value>
        <statement name="WHERE">
          <block type="sparql_class_with_property">
            <value name="CLASS_NAME">
              <block type="sparql_variable_confirmed">
                <field name="VARIABLE">b</field>
              </block>
            </value>
            <statement name="PROPERTIES">
              <block type="sparql_properties_in_class">
                <value name="INPUT">
                  <block type="sparql_variable_type">
                    <field name="VARIABLE2">type</field>
                    <value name="TYPE1">
                      <block type="sparql_prefix_list">
                        <field name="PREFIX">prefix_0</field>
                      </block>
                    </value>
                    <value name="TYPE2">
                      <block type="sparql_variable_typename">
                        <field name="LABEL"> </field>
                        <field name="VARIABLE">Border</field>
                      </block>
                    </value>
                  </block>
                </value>
                <next>
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">isBorderOf</field>
                        <value name="TYPE2">
                          <block type="sparql_variable_varname">
                            <field name="VARIABLE">c1</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">isBorderOf</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">c2</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">length</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">length</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
            <next>
              <block type="sparql_class_with_property">
                <value name="CLASS_NAME">
                  <block type="sparql_variable_confirmed">
                    <field name="VARIABLE">c1</field>
                  </block>
                </value>
                <statement name="PROPERTIES">
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">type</field>
                        <value name="TYPE1">
                          <block type="sparql_prefix_list">
                            <field name="PREFIX">prefix_0</field>
                          </block>
                        </value>
                        <value name="TYPE2">
                          <block type="sparql_variable_typename">
                            <field name="LABEL"> </field>
                            <field name="VARIABLE">Country</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">carCode</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">cc1</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">name</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">country1</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="sparql_class_with_property">
                    <value name="CLASS_NAME">
                      <block type="sparql_variable_confirmed">
                        <field name="VARIABLE">c2</field>
                      </block>
                    </value>
                    <statement name="PROPERTIES">
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">type</field>
                            <value name="TYPE1">
                              <block type="sparql_prefix_list">
                                <field name="PREFIX">prefix_0</field>
                              </block>
                            </value>
                            <value name="TYPE2">
                              <block type="sparql_variable_typename">
                                <field name="LABEL"> </field>
                                <field name="VARIABLE">Country</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">carCode</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">cc2</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                            <next>
                              <block type="sparql_properties_in_class">
                                <value name="INPUT">
                                  <block type="sparql_variable_type">
                                    <field name="VARIABLE2">name</field>
                                    <value name="TYPE2">
                                      <block type="sparql_variable_varname">
                                        <field name="VARIABLE">country2</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                                <next>
                                  <block type="sparql_properties_in_class">
                                    <value name="INPUT">
                                      <block type="sparql_variable_type">
                                        <field name="VARIABLE2">encompassed</field>
                                        <value name="TYPE2">
                                          <block type="sparql_variable_varname">
                                            <field name="VARIABLE">conclass</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </statement>
                    <next>
                      <block type="sparql_class_with_property">
                        <value name="CLASS_NAME">
                          <block type="sparql_variable_confirmed">
                            <field name="VARIABLE">conclass</field>
                          </block>
                        </value>
                        <statement name="PROPERTIES">
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">name</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">continent</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </statement>
                        <next>
                          <block type="sparql_filter">
                            <value name="FILTER_CONDITION">
                              <block type="sparql_comparison">
                                <field name="OPERATOR">&lt;</field>
                                <value name="OPERAND1">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">country1</field>
                                  </block>
                                </value>
                                <value name="OPERAND2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">country2</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                            <next>
                              <block type="sparql_filter">
                                <value name="FILTER_CONDITION">
                                  <block type="sparql_comparison">
                                    <field name="OPERATOR">=</field>
                                    <value name="OPERAND1">
                                      <block type="sparql_variable_varname">
                                        <field name="VARIABLE">continent</field>
                                      </block>
                                    </value>
                                    <value name="OPERAND2">
                                      <block type="sparql_string">
                                        <field name="STRING">South America</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </next>
  </block>
</category>

<category name="One-Many" categorystyle="patterns_category">
    <block type="sparql_variable_select">
      <field name="VARIABLE">?country</field>
      <value name="NEXT_VARIABLE">
        <block type="sparql_variable_select">
          <field name="VARIABLE">?city</field>
          <value name="NEXT_VARIABLE">
            <block type="sparql_variable_select">
              <field name="VARIABLE">?cityPop</field>
            </block>
          </value>
        </block>
      </value>
    </block>

    <block type="sparql_variable_select">
      <field name="VARIABLE">?cityPop</field>
    </block>

    <block type="sparql_variable_select">
      <field name="VARIABLE">?countryPop</field>
    </block>

  <block type="sparql_prefix">
    <mutation prefixes="4"></mutation>
    <field name="PREFIX_LABEL0">rdf</field>
    <field name="URI0">http://www.w3.org/1999/02/22-rdf-syntax-ns#</field>
    <field name="PREFIX_LABEL1">rdfs</field>
    <field name="URI1">http://www.w3.org/2000/01/rdf-schema#</field>
    <field name="PREFIX_LABEL2">owl</field>
    <field name="URI2">http://www.w3.org/2002/07/owl#</field>
    <field name="PREFIX_LABEL3"> </field>
    <field name="URI3">http://www.semwebtech.org/mondial/10/meta#</field>
    <next>
      <block type="sparql_select">
        <value name="VARIABLES">
          <block type="sparql_variable_select_demo">
            <field name="VARIABLE">country</field>
            <value name="NEXT_VARIABLE">
              <block type="sparql_variable_select_demo">
                <field name="VARIABLE">city</field>
                <value name="NEXT_VARIABLE">
                  <block type="sparql_variable_select_demo">
                    <field name="VARIABLE">cityPop</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </value>
        <statement name="WHERE">
          <block type="sparql_class_with_property">
            <value name="CLASS_NAME">
              <block type="sparql_variable_confirmed">
                <field name="VARIABLE">ct</field>
              </block>
            </value>
            <statement name="PROPERTIES">
              <block type="sparql_properties_in_class">
                <value name="INPUT">
                  <block type="sparql_variable_type">
                    <field name="VARIABLE2">type</field>
                    <value name="TYPE1">
                      <block type="sparql_prefix_list">
                        <field name="PREFIX">prefix_0</field>
                      </block>
                    </value>
                    <value name="TYPE2">
                      <block type="sparql_variable_typename">
                        <field name="LABEL"> </field>
                        <field name="VARIABLE">City</field>
                      </block>
                    </value>
                  </block>
                </value>
                <next>
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">name</field>
                        <value name="TYPE2">
                          <block type="sparql_variable_varname">
                            <field name="VARIABLE">city</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">cityIn</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">c</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">population</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">cityPop</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
            <next>
              <block type="sparql_class_with_property">
                <value name="CLASS_NAME">
                  <block type="sparql_variable_confirmed">
                    <field name="VARIABLE">c</field>
                  </block>
                </value>
                <statement name="PROPERTIES">
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">type</field>
                        <value name="TYPE1">
                          <block type="sparql_prefix_list">
                            <field name="PREFIX">prefix_0</field>
                          </block>
                        </value>
                        <value name="TYPE2">
                          <block type="sparql_variable_typename">
                            <field name="LABEL"> </field>
                            <field name="VARIABLE">Country</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">name</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">country</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">population</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">countryPop</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="sparql_filter">
                    <value name="FILTER_CONDITION">
                      <block type="sparql_comparison">
                        <field name="OPERATOR">&gt;</field>
                        <value name="OPERAND1">
                          <block type="sparql_variable_varname">
                            <field name="VARIABLE">cityPop</field>
                          </block>
                        </value>
                        <value name="OPERAND2">
                          <block type="sparql_number">
                            <field name="NUMBER">5000000</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_filter">
                        <value name="FILTER_CONDITION">
                          <block type="sparql_comparison">
                            <field name="OPERATOR">&gt;</field>
                            <value name="OPERAND1">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">countryPop</field>
                              </block>
                            </value>
                            <value name="OPERAND2">
                              <block type="sparql_number">
                                <field name="NUMBER">20000000</field>
                              </block>
                            </value>
                          </block>
                        </value>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </next>
  </block>
</category>

<category name="Many-Many" categorystyle="patterns_category">

  <block type="sparql_variable_select" x="10" y="50">
    <field name="VARIABLE">?continent</field>
    <value name="NEXT_VARIABLE">
      <block type="sparql_variable_select">
        <field name="VARIABLE">?country</field>
        <value name="NEXT_VARIABLE">
          <block type="sparql_variable_select">
            <field name="VARIABLE">?city</field>
            <value name="NEXT_VARIABLE">
              <block type="sparql_variable_select">
                <field name="VARIABLE">?cityPop</field>
              </block>
            </value>
          </block>
        </value>
      </block>
    </value>
  </block>

    <block type="sparql_variable_select">
      <field name="VARIABLE">?cityPop</field>
    </block>

    <block type="sparql_variable_select">
      <field name="VARIABLE">?percent</field>
    </block>

  <block type="sparql_prefix">
    <mutation prefixes="4"></mutation>
    <field name="PREFIX_LABEL0">rdf</field>
    <field name="URI0">http://www.w3.org/1999/02/22-rdf-syntax-ns#</field>
    <field name="PREFIX_LABEL1">rdfs</field>
    <field name="URI1">http://www.w3.org/2000/01/rdf-schema#</field>
    <field name="PREFIX_LABEL2">owl</field>
    <field name="URI2">http://www.w3.org/2002/07/owl#</field>
    <field name="PREFIX_LABEL3"> </field>
    <field name="URI3">http://www.semwebtech.org/mondial/10/meta#</field>
    <next>
      <block type="sparql_select">
        <value name="VARIABLES">
          <block type="sparql_variable_select_demo">
            <field name="VARIABLE">continent</field>
            <value name="NEXT_VARIABLE">
              <block type="sparql_variable_select_demo">
                <field name="VARIABLE">country</field>
                <value name="NEXT_VARIABLE">
                  <block type="sparql_variable_select_demo">
                    <field name="VARIABLE">city</field>
                    <value name="NEXT_VARIABLE">
                      <block type="sparql_variable_select_demo">
                        <field name="VARIABLE">cityPop</field>
                      </block>
                    </value>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </value>
        <statement name="WHERE">
          <block type="sparql_class_with_property">
            <value name="CLASS_NAME">
              <block type="sparql_variable_confirmed">
                <field name="VARIABLE">ct</field>
              </block>
            </value>
            <statement name="PROPERTIES">
              <block type="sparql_properties_in_class">
                <value name="INPUT">
                  <block type="sparql_variable_type">
                    <field name="VARIABLE2">type</field>
                    <value name="TYPE1">
                      <block type="sparql_prefix_list">
                        <field name="PREFIX">prefix_0</field>
                      </block>
                    </value>
                    <value name="TYPE2">
                      <block type="sparql_variable_typename">
                        <field name="LABEL"> </field>
                        <field name="VARIABLE">City</field>
                      </block>
                    </value>
                  </block>
                </value>
                <next>
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">name</field>
                        <value name="TYPE2">
                          <block type="sparql_variable_varname">
                            <field name="VARIABLE">city</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">cityIn</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">c</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">population</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">cityPop</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
            <next>
              <block type="sparql_class_with_property">
                <value name="CLASS_NAME">
                  <block type="sparql_variable_confirmed">
                    <field name="VARIABLE">c</field>
                  </block>
                </value>
                <statement name="PROPERTIES">
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">type</field>
                        <value name="TYPE1">
                          <block type="sparql_prefix_list">
                            <field name="PREFIX">prefix_0</field>
                          </block>
                        </value>
                        <value name="TYPE2">
                          <block type="sparql_variable_typename">
                            <field name="LABEL"> </field>
                            <field name="VARIABLE">Country</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">name</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">country</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">population</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">countryPop</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                            <next>
                              <block type="sparql_properties_in_class">
                                <value name="INPUT">
                                  <block type="sparql_variable_type">
                                    <field name="VARIABLE2">encompassedByInfo</field>
                                    <value name="TYPE2">
                                      <block type="sparql_variable_varname">
                                        <field name="VARIABLE">en</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="sparql_class_with_property">
                    <value name="CLASS_NAME">
                      <block type="sparql_variable_confirmed">
                        <field name="VARIABLE">en</field>
                      </block>
                    </value>
                    <statement name="PROPERTIES">
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">encompassedBy</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">con</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">percent</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">percent</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </statement>
                    <next>
                      <block type="sparql_class_with_property">
                        <value name="CLASS_NAME">
                          <block type="sparql_variable_confirmed">
                            <field name="VARIABLE">con</field>
                          </block>
                        </value>
                        <statement name="PROPERTIES">
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">type</field>
                                <value name="TYPE1">
                                  <block type="sparql_prefix_list">
                                    <field name="PREFIX">prefix_0</field>
                                  </block>
                                </value>
                                <value name="TYPE2">
                                  <block type="sparql_variable_typename">
                                    <field name="LABEL"> </field>
                                    <field name="VARIABLE">Continent</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                            <next>
                              <block type="sparql_properties_in_class">
                                <value name="INPUT">
                                  <block type="sparql_variable_type">
                                    <field name="VARIABLE2">name</field>
                                    <value name="TYPE2">
                                      <block type="sparql_variable_varname">
                                        <field name="VARIABLE">continent</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </statement>
                        <next>
                          <block type="sparql_filter">
                            <value name="FILTER_CONDITION">
                              <block type="sparql_comparison">
                                <field name="OPERATOR">&gt;=</field>
                                <value name="OPERAND1">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">percent</field>
                                  </block>
                                </value>
                                <value name="OPERAND2">
                                  <block type="sparql_number">
                                    <field name="NUMBER">50</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                            <next>
                              <block type="sparql_filter">
                                <value name="FILTER_CONDITION">
                                  <block type="sparql_comparison">
                                    <field name="OPERATOR">&gt;</field>
                                    <value name="OPERAND1">
                                      <block type="sparql_variable_varname">
                                        <field name="VARIABLE">cityPop</field>
                                      </block>
                                    </value>
                                    <value name="OPERAND2">
                                      <block type="sparql_number">
                                        <field name="NUMBER">5000000</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </next>
  </block>
</category>

<category name="Pattern Skeletons" categorystyle="examples_category"></category>

<category name="1C1K" categorystyle="patterns_category">
  <block type="sparql_prefix">
    <mutation prefixes="4"></mutation>
    <field name="PREFIX_LABEL0">rdf</field>
    <field name="URI0">http://www.w3.org/1999/02/22-rdf-syntax-ns#</field>
    <field name="PREFIX_LABEL1">rdfs</field>
    <field name="URI1">http://www.w3.org/2000/01/rdf-schema#</field>
    <field name="PREFIX_LABEL2">owl</field>
    <field name="URI2">http://www.w3.org/2002/07/owl#</field>
    <field name="PREFIX_LABEL3"> </field>
    <field name="URI3">http://www.semwebtech.org/mondial/10/meta#</field>
    <next>
      <block type="sparql_select">
        <value name="VARIABLES">
          <block type="sparql_variable_select_demo">
            <field name="VARIABLE">TAK</field>
            <value name="NEXT_VARIABLE">
              <block type="sparql_variable_select_demo">
                <field name="VARIABLE">TA1</field>
                <value name="NEXT_VARIABLE">
                  <block type="sparql_variable_select_demo">
                    <field name="VARIABLE">TAn</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </value>
        <statement name="WHERE">
          <block type="sparql_class_with_property">
            <value name="CLASS_NAME">
              <block type="sparql_variable_confirmed">
                <field name="VARIABLE">classA</field>
              </block>
            </value>
            <statement name="PROPERTIES">
              <block type="sparql_properties_in_class">
                <value name="INPUT">
                  <block type="sparql_variable_type">
                    <field name="VARIABLE2">type</field>
                    <value name="TYPE1">
                      <block type="sparql_prefix_list">
                        <field name="PREFIX">prefix_0</field>
                      </block>
                    </value>
                    <value name="TYPE2">
                      <block type="sparql_variable_typename">
                        <field name="LABEL"> </field>
                        <field name="VARIABLE">CA</field>
                      </block>
                    </value>
                  </block>
                </value>
                <next>
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">key property</field>
                        <value name="TYPE2">
                          <block type="sparql_variable_varname">
                            <field name="VARIABLE">TAK</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">first property</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">TA1</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">nth property</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">TAn</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </statement>
      </block>
    </next>
  </block>
</category>


<category name="2C1DP" categorystyle="patterns_category">
  <block type="sparql_prefix">
    <mutation prefixes="4"></mutation>
    <field name="PREFIX_LABEL0">rdf</field>
    <field name="URI0">http://www.w3.org/1999/02/22-rdf-syntax-ns#</field>
    <field name="PREFIX_LABEL1">rdfs</field>
    <field name="URI1">http://www.w3.org/2000/01/rdf-schema#</field>
    <field name="PREFIX_LABEL2">owl</field>
    <field name="URI2">http://www.w3.org/2002/07/owl#</field>
    <field name="PREFIX_LABEL3"> </field>
    <field name="URI3">http://www.semwebtech.org/mondial/10/meta#</field>
    <next>
      <block type="sparql_select">
        <value name="VARIABLES">
          <block type="sparql_variable_select_demo">
            <field name="VARIABLE">TAK</field>
            <value name="NEXT_VARIABLE">
              <block type="sparql_variable_select_demo">
                <field name="VARIABLE">TA1</field>
                <value name="NEXT_VARIABLE">
                  <block type="sparql_variable_select_demo">
                    <field name="VARIABLE">TBK</field>
                    <value name="NEXT_VARIABLE">
                      <block type="sparql_variable_select_demo">
                        <field name="VARIABLE">TB1</field>
                      </block>
                    </value>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </value>
        <statement name="WHERE">
          <block type="sparql_class_with_property">
            <value name="CLASS_NAME">
              <block type="sparql_variable_confirmed">
                <field name="VARIABLE">classA</field>
              </block>
            </value>
            <statement name="PROPERTIES">
              <block type="sparql_properties_in_class">
                <value name="INPUT">
                  <block type="sparql_variable_type">
                    <field name="VARIABLE2">type</field>
                    <value name="TYPE1">
                      <block type="sparql_prefix_list">
                        <field name="PREFIX">prefix_0</field>
                      </block>
                    </value>
                    <value name="TYPE2">
                      <block type="sparql_variable_typename">
                        <field name="LABEL"> </field>
                        <field name="VARIABLE">CA</field>
                      </block>
                    </value>
                  </block>
                </value>
                <next>
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">key property</field>
                        <value name="TYPE2">
                          <block type="sparql_variable_varname">
                            <field name="VARIABLE">TAK</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">first property</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">TA1</field>
                              </block>
                            </value>
                          </block>
                        </value>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
            <next>
              <block type="sparql_class_with_property">
                <value name="CLASS_NAME">
                  <block type="sparql_variable_confirmed">
                    <field name="VARIABLE">classB</field>
                  </block>
                </value>
                <statement name="PROPERTIES">
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">type</field>
                        <value name="TYPE1">
                          <block type="sparql_prefix_list">
                            <field name="PREFIX">prefix_0</field>
                          </block>
                        </value>
                        <value name="TYPE2">
                          <block type="sparql_variable_typename">
                            <field name="LABEL"> </field>
                            <field name="VARIABLE">CB</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">key property</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">TBK</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">first property</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">TB1</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="sparql_class_with_property">
                    <value name="CLASS_NAME">
                      <block type="sparql_variable_confirmed">
                        <field name="VARIABLE">classA</field>
                      </block>
                    </value>
                    <statement name="PROPERTIES">
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">PAB</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_confirmed">
                                <field name="VARIABLE">classB</field>
                              </block>
                            </value>
                          </block>
                        </value>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </next>
  </block>
</category>

<category name="3C" categorystyle="patterns_category">

  <block type="sparql_prefix">
    <mutation prefixes="4"></mutation>
    <field name="PREFIX_LABEL0">rdf</field>
    <field name="URI0">http://www.w3.org/1999/02/22-rdf-syntax-ns#</field>
    <field name="PREFIX_LABEL1">rdfs</field>
    <field name="URI1">http://www.w3.org/2000/01/rdf-schema#</field>
    <field name="PREFIX_LABEL2">owl</field>
    <field name="URI2">http://www.w3.org/2002/07/owl#</field>
    <field name="PREFIX_LABEL3"> </field>
    <field name="URI3">http://www.semwebtech.org/mondial/10/meta#</field>
    <next>
      <block type="sparql_select">
        <value name="VARIABLES">
          <block type="sparql_variable_select_demo">
            <field name="VARIABLE">TBK</field>
            <value name="NEXT_VARIABLE">
              <block type="sparql_variable_select_demo">
                <field name="VARIABLE">TCK</field>
                <value name="NEXT_VARIABLE">
                  <block type="sparql_variable_select_demo">
                    <field name="VARIABLE">TA1</field>
                  </block>
                </value>
              </block>
            </value>
          </block>
        </value>
        <statement name="WHERE">
          <block type="sparql_class_with_property">
            <value name="CLASS_NAME">
              <block type="sparql_variable_confirmed">
                <field name="VARIABLE">CA</field>
              </block>
            </value>
            <statement name="PROPERTIES">
              <block type="sparql_properties_in_class">
                <value name="INPUT">
                  <block type="sparql_variable_type">
                    <field name="VARIABLE2">type</field>
                    <value name="TYPE1">
                      <block type="sparql_prefix_list">
                        <field name="PREFIX">prefix_0</field>
                      </block>
                    </value>
                    <value name="TYPE2">
                      <block type="sparql_variable_typename">
                        <field name="LABEL"> </field>
                        <field name="VARIABLE">CA</field>
                      </block>
                    </value>
                  </block>
                </value>
                <next>
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">reationship AB</field>
                        <value name="TYPE2">
                          <block type="sparql_variable_varname">
                            <field name="VARIABLE">CB</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">relationship AC</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">CC</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">first property</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">TA1</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
            <next>
              <block type="sparql_class_with_property">
                <value name="CLASS_NAME">
                  <block type="sparql_variable_confirmed">
                    <field name="VARIABLE">CB</field>
                  </block>
                </value>
                <statement name="PROPERTIES">
                  <block type="sparql_properties_in_class">
                    <value name="INPUT">
                      <block type="sparql_variable_type">
                        <field name="VARIABLE2">type</field>
                        <value name="TYPE1">
                          <block type="sparql_prefix_list">
                            <field name="PREFIX">prefix_0</field>
                          </block>
                        </value>
                        <value name="TYPE2">
                          <block type="sparql_variable_typename">
                            <field name="LABEL"> </field>
                            <field name="VARIABLE">CB</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">key property</field>
                            <value name="TYPE2">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">TBK</field>
                              </block>
                            </value>
                          </block>
                        </value>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="sparql_class_with_property">
                    <value name="CLASS_NAME">
                      <block type="sparql_variable_confirmed">
                        <field name="VARIABLE">CC</field>
                      </block>
                    </value>
                    <statement name="PROPERTIES">
                      <block type="sparql_properties_in_class">
                        <value name="INPUT">
                          <block type="sparql_variable_type">
                            <field name="VARIABLE2">type</field>
                            <value name="TYPE1">
                              <block type="sparql_prefix_list">
                                <field name="PREFIX">prefix_0</field>
                              </block>
                            </value>
                            <value name="TYPE2">
                              <block type="sparql_variable_typename">
                                <field name="LABEL"> </field>
                                <field name="VARIABLE">CC</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="sparql_properties_in_class">
                            <value name="INPUT">
                              <block type="sparql_variable_type">
                                <field name="VARIABLE2">key property</field>
                                <value name="TYPE2">
                                  <block type="sparql_variable_varname">
                                    <field name="VARIABLE">TCK</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </next>
  </block>

</category>

  
        <category name="Constant" categorystyle="basics_category">
          <block type="sparql_string"></block>
          <block type="sparql_number"></block>
        </category>
        <category name="Math" categorystyle="math_category">
          <block type="sparql_add"></block>
          <block type="sparql_subtract"></block>
          <block type="sparql_multiply"></block>
          <block type="sparql_divide"></block>
        </category>
        <category name="Logic" categorystyle="logic_category">
          <block type="sparql_comparison"></block>
          <block type="sparql_if"></block>
          <block type="sparql_and"></block>
          <block type="sparql_or"></block>
          <block type="sparql_not"></block>
        </category>
        <category name="Query" categorystyle="query_category">
          <block type="sparql_prefix" >
          <mutation prefixes="0"></mutation>
          <next>
            <block type="sparql_select" ></block>
          </next>
          </block>
          <block type="sparql_condition">
          <statement name="CONDITIONS">
            <block type="sparql_groupby">
              <field name="VARIABLE">variable</field>
              <next>
                <block type="sparql_having">
                  <value name="HAVING_CONDITION">
                    <block type="sparql_count">
                      <value name="VARIABLE">
                        <block type="sparql_multiply">
                          <value name="FACTOR1">
                            <block type="sparql_variable_varname">
                              <field name="VARIABLE">default</field>
                            </block>
                          </value>
                          <value name="FACTOR2">
                            <block type="sparql_number">
                              <field name="NUMBER">1</field>
                            </block>
                          </value>
                        </block>
                      </value>
                    </block>
                  </value>
                  <next>
                    <block type="sparql_orderby">
                      <field name="ORDER">ASC</field>
                      <field name="VARIABLE">variable</field>
                      <next>
                        <block type="sparql_limit">
                          <value name="LIMIT">
                            <block type="sparql_number">
                              <field name="NUMBER">0</field>
                            </block>
                          </value>
                          <next>
                            <block type="sparql_offset">
                              <value name="OFFSET">
                                <block type="sparql_number">
                                  <field name="NUMBER">0</field>
                                </block>
                              </value>
                            </block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
        </block>
          
          <block type="sparql_prefix"></block>
          <block type="sparql_select"></block>
          <block type="sparql_condition"></block>
          <block type="sparql_distinct_reduced"></block>
        </category>
        <category name="Condition" categorystyle="condition_category">
          <block type="sparql_orderby"></block>
          <block type="sparql_groupby"></block>
          <block type="sparql_having"></block>
          <block type="sparql_limit"></block>
          <block type="sparql_offset"></block>
        </category>

        <category name="Pattern" categorystyle="variable_category">
          <block type="sparql_properties_in_class">
            <value name="INPUT">
              <block type="sparql_variable_type">
                <field name="VARIABLE2">gender</field>
                <value name="TYPE2">
                  <block type="sparql_variable_varname">
                    <field name="VARIABLE">?name</field>
                  </block>
                </value>
              </block>
            </value>
          </block>

          <block type="sparql_properties_in_class">
            <value name="INPUT">
              <block type="sparql_variable_type" >
                <field name="VARIABLE2">type</field>
                <value name="TYPE1">
                  <block type="sparql_prefix_list">
                    <field name="PREFIX">default</field>
                  </block>
                </value>
                <value name="TYPE2">
                  <block type="sparql_variable_typename">
                    <field name="VARIABLE">Person</field>
                  </block>
                </value>
              </block>
            </value>
          </block>

          <block type="sparql_class_with_property">
            <value name="CLASS_NAME">
              <block type="sparql_variable_confirmed">
                <field name="VARIABLE">custom</field>
              </block>
            </value>
          </block>

          <block type="sparql_union"></block>
          <block type="sparql_bind"></block>
          <block type="sparql_optional"></block>
          <block type="sparql_filter"></block>
          <block type="sparql_filter">
            <value name="FILTER_CONDITION">
              <block type="sparql_existence">
                <field name="EXISTS">EXISTS</field>
                <value name="Variables">
                  <block type="sparql_braces"></block>
                </value>
              </block>
            </value>
          </block>
          <block type="sparql_braces"></block>
        </category>

        <category name="Variable" categorystyle="variable_category">
          <block type="sparql_variable_confirmed"></block>
          <block type="sparql_variable_varname"></block>
          <block type="sparql_variable_select"></block>
          <block type="sparql_variable_select_demo"></block>
          <block type="sparql_variable_typename"></block>
          <block type="sparql_as"></block>
          <block type="sparql_variable_type"></block>
          <block type="sparql_prefix_list"></block>
        </category>
        <category name="Aggregate" categorystyle="aggregate_category">
          <block type="sparql_avg"></block>
          <block type="sparql_count"></block>
          <block type="sparql_max"></block>
          <block type="sparql_min"></block>
          <block type="sparql_sum"></block>
        </category>
  
        <category name="Stored Blocks" categorystyle="stored_blocks_category">
          ${storedBlocks.map((blockXml) => blockXml.replace(/<\/?xml[^>]*>/g, '')).join('')}
      </category>
    </xml>`;
  };
  
  
  useEffect(() => {
    if (repo_graphDB && db_prefix_URL) {
      setFullLoading(true);
      initConceptualModelInfo(repo_graphDB, db_prefix_URL);
    }
  }, [repo_graphDB, db_prefix_URL]);

  useEffect(() => {
    // console.log('searchParams: ', searchParams);
    if (searchParams.get('query')) {
      console.log('searchParams.get(query): ', searchParams.get('query'));
      setQuery(searchParams.get('query') || initialString);
       
      const repo = searchParams.get('repo_graphDB') || '';
      const prefix = searchParams.get('db_prefix_URL') || '';
      
      console.log('repo: ', repo);
      console.log('prefix: ', prefix);
      
      setFullLoading(true);
      initConceptualModelInfo(repo, prefix);
    }
  }, [searchParams]);

  async function initConceptualModelInfo(
    repo_graphDB: string,
    db_prefix_URL: string,
  ) {
    try {
      const conceptualModelInfo: any = {};
      setFullLoading(true);
      const DP_Range_mapping = await getRangeMapping(
        repo_graphDB,
        db_prefix_URL,
      );
      const classesList = await getClasses(repo_graphDB, db_prefix_URL);
      const FunctionalPropsList = await getFunctionalProperties(
        repo_graphDB,
        db_prefix_URL,
      );
      const DatatypePropsList = await getDatatypeProperties(
        repo_graphDB,
        db_prefix_URL,
      );
      const ObjectPropsList = await getObjectPropertiesList(
        repo_graphDB,
        db_prefix_URL,
      );
      const ObjectPropsMapping = await getObjectPropertyMapping(
        repo_graphDB,
        db_prefix_URL,
      );
      const DP_domain_mapping = await getDomainMapping(
        repo_graphDB,
        db_prefix_URL,
      );
      const DPKList = await getKeyFunctionalProperties(
        repo_graphDB,
        db_prefix_URL,
      );

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

  const functions_conceptualModel =
    conceptualModelFunctions(ConceptualModelInfo);

  const handleVisOpen = () => {
    setOpenVisOption(true);
  };

  const handleVisClose = () => {
    setOpenVisOption(false);
  };

  async function generateVisRecommendation(
    user_query: string,
    dataResults: any[] = [],
  ): Promise<{
    recommendations: RecommendationProps[];
    excludedRecommendations: RecommendationProps[];
  }> {
    const messages: string[] = [];
    const CLASSES: string[] = [];
    const DP_RANGE_LOCAL: any = {};
    const var_to_class: any = {}; // for variables in the query SELECT header
    const all_var_to_class: any = {}; // for all variables including the ones in the query body
    const var_to_range_mapping: any = {};
    const keyVar_cardinality_mapping: any = {};
    const potential_key_var_DP_map: any = {};

    // ratings dictionary:
    let ratings_recommendation: any = {};

    const user_query_normalised = user_query.replace(/[\n\t]/g, '');
    let user_query_split;
    if (user_query_normalised.split('where').length === 2) {
      user_query_split = user_query_normalised.split('where');
    } else {
      user_query_split = user_query_normalised.split('WHERE');
    }

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
      const vars_head: string[] = [];
      let m_head;
      while ((m_head = regex_vars.exec(user_query_head)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m_head.index === regex_vars.lastIndex) {
          regex_vars.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        m_head.forEach((match, groupIndex) => {
          vars_head.push(match.split('?')[1]);
        });
      }
      console.log('step1 matches head', vars_head);

      // split the query body by '.' (parent statements) and ';'(children statements)
      const parent_statements = user_query_body.split('.');

      const PAB_LIST: any = {};
      const CA_DPA_mapping: any = {};
      const CA_PAB_mapping: any = {};
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
          let DP: string = '';
          if (
            ConceptualModelInfo.DatatypePropsList?.some((dp: string) => {
              DP = dp;
              return sub_stmt_trim.includes(dp);
            }) ||
            ConceptualModelInfo.FunctionalPropsList?.some((dp: string) => {
              DP = dp;
              return sub_stmt_trim.includes(dp);
            }) ||
            ConceptualModelInfo.DPKList?.some((dp: string) => {
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
          let PAB: string = '';
          if (
            ConceptualModelInfo.ObjectPropsList?.some((pab: string) => {
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
        !vars_head.some((v: string) => {
          return Object.keys(var_to_class).includes(v);
        }) && Object.keys(potential_key_var_DP_map).length === 0;
      setShowMissingKeyWarning(noKeyWarning);

      console.log('step2 Classes CA found: ', CLASSES);
      console.log('step2 var_to_class: ', var_to_class);

      console.log('step3 var_range mapping: ', var_to_range_mapping);
      console.log(`DP and its Range TA found: `, DP_RANGE_LOCAL);
      console.log('step3 CA_DPA mapping found: ', CA_DPA_mapping);
      console.log('step3 potential key DP found: ', potential_key_var_DP_map);

      console.log('step4 PAB found: ', PAB_LIST);
      console.log('step4 CA_PAB mapping found: ', CA_PAB_mapping);

      // !Recommendation rating algorithm here this one is based on analysing
      // the query head and link to query content and data results.

      let total_class_num = CLASSES.length;
      const total_PAB_num = Object.keys(PAB_LIST).length;
      const query_head_count = vars_head.length;
      let nonKey_var_count = query_head_count;
      let key_var_count = 0;

      // key variables are the variables who is classes, or whose ranges are lexical
      // ! constains variables in query body !
      const key_var_list: string[] = [
        ...Object.keys(potential_key_var_DP_map),
        ...Object.keys(var_to_class),
      ];
      const nonKey_var_list: string[] = vars_head.filter((v) => {
        return (
          !key_var_list.includes(v) && !Object.keys(var_to_class).includes(v)
        );
      });
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
      if (
        vars_head.some((v: string) => {
          return Object.keys(var_to_class).includes(v);
        })
      ) {
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
        (dp) => {
          return ConceptualModelInfo.DPKList?.includes(dp);
        },
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
          Object.values(var_to_range_mapping).some((v: any) => {
            return ranges_type_mapping(v) == DATA_DIMENTION_TYPE.LEXICAL;
          })) &&
        Object.values(var_to_range_mapping).some((v: any) => {
          return ranges_type_mapping(v) == DATA_DIMENTION_TYPE.SCALAR;
        })
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
      ratings_recommendation = {
        ...ratings_recommendation,
        ...ratings_1_class,
        ...ratings_2_class_1PAB,
        ...ratings_2_class_1DP,
        ...ratings_3_class,
        ...ratings_1_class_l2,
        ...ratings_2_class_1PAB_l2,
      };

      // when recommendation dict has intersected keys with ratings_recommendation:
      for (const [key, value] of Object.entries(
        ratings_multi_class_layer_relation,
      )) {
        if (Object.keys(ratings_recommendation).includes(key)) {
          ratings_recommendation[key] += value;
        } else {
          ratings_recommendation[key] = value;
        }
      }

      // if rating valid in 3-class pattern, cancel the relation warning.
      const valuesOf3C = Object.values(ratings_3_class) as number[];
      const maxRating = Math.max(...(valuesOf3C || [0]));
      if (maxRating > 0) {
        setShowManyManyRelationWarning(false);
      }

      if (dataResults.length > 0) {
        const row = dataResults[0];
        const keyColumns = Object.keys(potential_key_var_DP_map);

        const counts_instances = {};
        for (const key of keyColumns) {
          const subcounts = {};
          dataResults.forEach(function (row) {
            const value = row[key];
            // @ts-ignore
            subcounts[value] = (subcounts[value] || 0) + 1;
            // @ts-ignore
            counts_instances[key] = subcounts;
          });
          // @ts-ignore
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

    const excludedRatings: any = {};

    let exceedThreshold = false;

    console.log('keyVar_cardinality_mapping: ', keyVar_cardinality_mapping);
    let thresholdKey = 'unknown';
    for (const r of Object.keys(ratings_recommendation)) {
      // @ts-ignore
      const threshold = recommendationConfig[r];
      const actuallSize = Math.max(
        // @ts-ignore
        ...Object.values(keyVar_cardinality_mapping),
      );

      for (const key of Object.keys(keyVar_cardinality_mapping)) {
        if (keyVar_cardinality_mapping[key] === actuallSize) {
          thresholdKey = key;
          break;
        }
      }

      if (threshold && actuallSize > threshold) {
        exceedThreshold = true;
        excludedRatings[r] = deepClone(ratings_recommendation[r]);
        delete ratings_recommendation[r];
      }
    }
    setShowTooMuchDataWarning(exceedThreshold);

    const recommendations: RecommendationProps[] = [];
    const excludedRecommendations: RecommendationProps[] = [];
    // TODO: complete recommendations to all catogories
    for (const r of Object.keys(ratings_recommendation)) {
      const rating = ratings_recommendation[r];
      if (rating > 0) {
        // @ts-ignore
        recommendations.push({ chart: ChartType_mapping[r], rating });
      }
    }
    for (const r of Object.keys(excludedRatings)) {
      const rating = excludedRatings[r];
      if (rating > 0) {
        excludedRecommendations.push({
          // @ts-ignore
          chart: ChartType_mapping[r],
          rating,
          // @ts-ignore
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
        (a, b) => b.rating - a.rating,
      ),
    };

    console.log('recommended vis: ', result);
    return result;
  }

  function checkForManyManyRDataAnalysis(
    vars_head: string[],
    var_to_range_mapping: any,
    dataResults: any[],
    all_var_to_class: any,
    classPairsToBeChecked: any[],
  ) {
    // check for posibble many-many relations:
    // by counting the number of unique values in the inferred key variables (lexical range)
    let key_var_head_atleast2instances = [];
    for (const ClassPair of classPairsToBeChecked) {
      const { class1, class2 } = ClassPair;
      // console.log('class1: ', class1);
      // console.log('class2: ', class2);

      const key_var_head: string[] = vars_head
        .filter((v) => {
          const range = var_to_range_mapping[v];
          return ranges_type_mapping(range) === DATA_DIMENTION_TYPE.LEXICAL;
        })
        .filter((v) => {
          return (
            all_var_to_class[v] === class1 || all_var_to_class[v] === class2
          );
        });

      const instance_stats: any = {};
      key_var_head.forEach((column: string) => {
        instance_stats[column] = {};
      });

      dataResults.forEach((row: any, index) => {
        key_var_head.forEach((column: string) => {
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
          (count: any) => count > 1,
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
    dataResults: any[],
    key_var_count: number,
    nonKey_var_count: number,
    nonKey_var_list: string[],
    var_to_range_mapping: any,
    key_var_list: string[],
    messages: string[],
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
        Object.keys(countryListAlpha2).some((code) => values.includes(code)) ||
        Object.values(countryListAlpha2).some((code) => values.includes(code))
      ) {
        findCountryNames = true;
        console.log('Found geographical values in the data');
      }
    }

    if (key_var_count >= 1 && nonKey_var_count === 1) {
      const nonKey_var = nonKey_var_list[0];
      const nonKey_var_range = var_to_range_mapping[nonKey_var];
      if (
        ranges_type_mapping(nonKey_var_range) === DATA_DIMENTION_TYPE.SCALAR
      ) {
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
          (v: string) =>
            ranges_type_mapping(var_to_range_mapping[v]) ===
            DATA_DIMENTION_TYPE.LEXICAL,
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
        nonKey_var_list.some((v: any) => {
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
        nonKey_var_list.some((v: string) => {
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
        nonKey_var_list.some((v: string) => {
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
    dataResults: any[],
    key_var_count: number,
    nonKey_var_count: number,
    nonKey_var_list: string[],
    var_to_range_mapping: any,
    vars_head: string[],
    CLASSES: string[],
    all_var_to_class: any,
    messages: string[],
  ) {
    const ratings: any = {
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
        nonKey_var_list.some((v: string) => {
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
      MMClasses,
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

  async function checkRelationshipsSchemaAnalysis(CLASSES: string[]) {
    const classes_involved = CLASSES;
    console.log(
      '[Schema Analysis] Classes involved in relation checks',
      classes_involved,
    );

    const oneManyRelationships: any[] = [];
    const manyManyRelationships: any[] = [];

    for (let i = 0; i < classes_involved.length - 1; i++) {
      for (let j = i + 1; j < classes_involved.length; j++) {
        const class1 = classes_involved[i];
        const class2 = classes_involved[j];

        const query = sparql_find_relationships_2C(class1, class2);
        const querySwapped = sparql_find_relationships_2C(class2, class1);
        try {
          const queryRes = await sendSPARQLquery(repo_graphDB, query, true);
          const queryResSwapped = await sendSPARQLquery(
            repo_graphDB,
            querySwapped,
            true,
          );
          const data = queryResultToData(queryRes);
          // console.log(`Permute class ${class1} and ${class2}`, data);
          const dataswapped = queryResultToData(queryResSwapped);
          // console.log(`Permute class ${class2} and ${class1}`, dataswapped);

          const prop_instance_mapping: any = {};
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
          console.log(
            `[Schema Analysis] props ${class1} - ${class2}  `,
            prop_instance_mapping,
          );

          const prop_instance_mapping_swapped: any = {};
          let foundOneManySwapped = false;
          if (dataswapped.length > 0) {
            for (const row of dataswapped) {
              const instance1 = row['c1'];
              const instance2 = row['c2'];
              const prop = row['interProp'];
              if (prop_instance_mapping_swapped[prop]) {
                if (prop_instance_mapping_swapped[prop][instance1]) {
                  prop_instance_mapping_swapped[prop][instance1].push(
                    instance2,
                  );
                  foundOneManySwapped = true;
                } else {
                  prop_instance_mapping_swapped[prop][instance1] = [instance2];
                }
              } else {
                prop_instance_mapping_swapped[prop] = {};
                prop_instance_mapping_swapped[prop][instance1] = [instance2];
              }
            }
            console.log(
              `[Schema Analysis] props ${class2} - ${class1}  `,
              prop_instance_mapping_swapped,
            );
          }
          console.log(
            `[Schema Analysis] found one-many bwtween ${class1} - ${class2}?`,
            foundOneMany,
          );
          console.log(
            `[Schema Analysis] found one-many bwtween ${class2} - ${class1}?`,
            foundOneManySwapped,
          );

          if (foundOneMany && foundOneManySwapped) {
            // remove repeated class pairs
            const found = manyManyRelationships.find((r) => {
              return r.class1 === class1 && r.class2 === class2;
            });

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

  const sparql_find_linking_PAB = (class1: string, class2: string) => {
    return `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX : <${db_prefix_URL}>
  SELECT DISTINCT ?PAB
  WHERE {
      ?c1 rdf:type ${class1} .
      ?c2 rdf:type ${class2} .
      ?c1 ?PAB ?c2 . 
  }`;
  };

  const sparql_find_relationships_2C = (class1: string, class2: string) => {
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
    dataResults: any[],
    key_var_count: number,
    nonKey_var_count: number,
    var_to_range_mapping: any,
    vars_head: string[],
    CLASSES: string[],
    PAB_list: any,
    all_var_to_class: any,
    messages: string[],
  ) {
    const ratings: any = {
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
      .map((v: any) => [v.domain, v.range])
      .flat()
      .filter((v: any) => v !== 'unknown');

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
            const queryResSwapped = await sendSPARQLquery(
              repo_graphDB,
              querySwapped,
              true,
            );
            const data = queryResultToData(queryRes);
            // console.log(`Permute class ${class1} and ${class2}`, data);
            const dataswapped = queryResultToData(queryResSwapped);
            // console.log(`Permute class ${class2} and ${class1}`, dataswapped);

            const PABsFound = data
              .map((v: any) => v.PAB)
              .concat(dataswapped.map((v: any) => v.PAB));
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
      MMClasses,
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
    dataResults: any[],
    key_var_count: number,
    nonKey_var_count: number,
    key_var_list: string[],
    nonKey_var_list: string[],
    var_to_range_mapping: any,
    vars_head: string[],
    CLASSES: string[],
    all_var_to_class: any,
    messages: string[],
  ) {
    const ratings: any = {
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
        nonKey_var_list.some((v: string) => {
          const range = var_to_range_mapping[v];
          return ranges_type_mapping(range) === DATA_DIMENTION_TYPE.SCALAR;
        }) &&
        key_var_list.some((v: string) => {
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
        nonKey_var_list.some((v: string) => {
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
    dataResults: any[],
    key_var_count: number,
    nonKey_var_count: number,
    key_var_list: string[],
    nonKey_var_list: string[],
    var_to_range_mapping: any,
    CLASSES: string[],
    messages: string[],
  ) {
    const ratings: any = {
      chord: 0,
      sankey: 0,
      network: 0,
      heatmap: 0,
    };
    if (key_var_count == 2 && nonKey_var_count === 1) {
      if (
        // scalar exists in the key variables and non-key variables
        nonKey_var_list.some((v: string) => {
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
        nonKey_var_list.some((v: string) => {
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

  const [showMissingKeyWarning, setShowMissingKeyWarning] = useState(false);
  const [showTooMuchDataWarning, setShowTooMuchDataWarning] = useState(false);
  const [showManyManyRelationWarning, setShowManyManyRelationWarning] =
    useState(false);
  const [showManyManyRelationInfo, setShowManyManyRelationInfo] =
    useState(false);
  const [manyManyRInfo, setManyManyRInfo] = useState('');
  const [showOneManyRelationInfo, setShowOneManyRelationInfo] = useState(false);
  const [oneManyRInfo, setOneManyRInfo] = useState('');
  const [relationshipInfoDataAnalysis, setRelationshipInfoDataAnalysis] =
    useState('');

  function closeAllWarnings() {
    setShowAlert(false);
    setShowMissingKeyWarning(false);
    setShowTooMuchDataWarning(false);
    setShowManyManyRelationWarning(false);
    setShowManyManyRelationInfo(false);
    setShowOneManyRelationInfo(false);
  }

  function toggleInferredDataQuery() {
    setInferredDataQuery(!inferredDataQuery);
  }

  const handleQuery = async (query: string) => {
    const repositoryID = repo_graphDB || searchParams.get('repo_graphDB');

    closeAllWarnings();
    try {
      setLoading(true);
      const queryRes = await sendSPARQLquery(
        repositoryID,
        query,
        inferredDataQuery,
      );

      const head = queryRes.head.vars;
      const results_bindings = queryRes.results.bindings;

      const columns = head.map((h: any) => ({
        field: h,
        headerName: h,
        minWidth: 300,
        maxWidth: 600,
      }));
      setColumns(columns);

      const colKeys = columns.map((col: any) => col.field);

      const data = results_bindings.map((data_binding: any, index: number) => {
        const obj: any = {};
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

      // console.log('remapped data', data);
      const recommendations = await generateVisRecommendation(query, data);
              
      console.log('Generated Recommendations:', recommendations.recommendations);
      console.log('Generated Excluded Recommendations:', recommendations.excludedRecommendations);
      setRecommendations(recommendations.recommendations);
      setExcludedRecommendations(recommendations.excludedRecommendations);
      setDataSource(data);
      setShowAlert(false);
      return recommendations;
    } catch (e: any) {
      console.error('Error', e.response?.data);
      setShowAlert(true);
      setAlertText(
        e.response?.data ||
          'Error: either missing content in the query or unknown syntax error, please check your query and try again.',
      );
    } finally {
      setLoading(false);
    }
    return null;
  };

  function separateHeader_Data(dataSource: any[]): VisDataProps {
    const headers: string[] = [];
    if (dataSource.length > 0) {
      const firstRow = dataSource[0];
      const keys = Object.keys(firstRow);
      for (const key of keys) {
        headers.push(key);
      }
    }

    if (headers.includes('id')) {
      const spliceIndex = headers.indexOf('id');
      headers.splice(spliceIndex, 1);
    }

    const data = dataSource.map((row) => {
      const dataRow = [];
      for (const key of headers) {
        const value = row[key];
        if (
          typeof value == 'string' &&
          value.match(/http:\/\/www\.semwebtech\.org\/mondial\/10\/(.*)/)
        ) {
          const newValue = value.split('/').reverse()[1];
          dataRow.push(newValue);
        } else if (!isNaN(value)) {
          dataRow.push(Number(value));
        } else {
          dataRow.push(row[key]);
        }
      }
      return dataRow;
    });
    // console.log('preprocessed data for Google Charts: ', { headers, data });
    return { headers, data };
  }

  // below are code for the auto-completion feature
  const [completionsContent, setCompletionsContent] = useState<any[]>(
    defaultAutocompletions,
  );

  // side effects for generating autocompletions content
  useEffect(() => {
    // generate completions for Functional Data Properties
    const completions = [];
    if (
      ConceptualModelInfo.FunctionalPropsList &&
      ConceptualModelInfo.DP_domain_mapping
    ) {
      // Functional Data Properties
      const DP_list = ConceptualModelInfo.FunctionalPropsList;
      const completions_DP = DP_list.map((dp: string) => {
        // !this handles the case when DP's domain is a collection (unhandled limitation in SPARQL handling collections)
        const domains = ConceptualModelInfo.DP_domain_mapping[dp]
          ? ConceptualModelInfo.DP_domain_mapping[dp]
          : 'unknown';
        return {
          label: dp,
          type: 'property',
          info: `owl:FunctionalProperty of domain ${domains}`,
        };
      });

      // Object Properties
      const PAB_list = ConceptualModelInfo.ObjectPropsList as string[];
      const completions_PAB = PAB_list.map((pab: string) => {
        return {
          label: pab,
          type: 'property',
          info: 'owl:ObjectProperty',
        };
      });

      completions.push(...completions_DP, ...completions_PAB);
    }

    // generate completions for Classes
    if (ConceptualModelInfo.classesList) {
      const classList = ConceptualModelInfo.classesList;

      const completions_Class = classList.map((c: string) => {
        return {
          label: c,
          type: 'class',
          detail: 'owl:Class',
        };
      });
      completions.push(...completions_Class);
    }

    setCompletionsContent([...completionsContent, ...completions]);
  }, [ConceptualModelInfo, sparqlCode]); // changed here

  const handleCopyPrefixesReference = () => {
    const prefixes = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX : <${db_prefix_URL}>`;
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard
        .writeText(prefixes)
        .then(() => {
          setShowCopySuccess(true);
        })
        .finally(() => {
          setTimeout(() => {
            setShowCopySuccess(false);
          }, 2000);
        });
    } else {
      try {
        setShowCopyUnderUnsafeOrigin(true);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          setShowCopyUnderUnsafeOrigin(false);
        }, 2000);
      }
    }
  };

  function PrefixReference() {
    return (
      <Grid sx={{ marginBottom: 3, maxWidth: 500 }}>
        <Button
          variant="outlined"
          color="success"
          aria-describedby={id_prefixRef}
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
            setShowPrefixReference(!showPrefixReference);
          }}
          sx={{
            textTransform: 'none',
            '&:hover': {
              color: '#fff',
              backgroundColor: '#2e7d32',
            },
          }}
        >
          {showPrefixReference
            ? 'Close Prefix Reference'
            : 'Open Prefix Reference'}
        </Button>
        <Popover
          id={id_prefixRef}
          open={showPrefixReference}
          anchorEl={anchorEl}
          onClose={() => {
            setAnchorEl(null);
            setShowPrefixReference(false);
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" component="div">
              Quick Reference to Prefixes
            </Typography>
            <Grid
              sx={{
                padding: 1,
                borderRadius: 2,
                ':hover': { backgroundColor: '#1976d233' },
                ':active': { backgroundColor: '#1976d266' },
                cursor: 'pointer',
              }}
              onClick={handleCopyPrefixesReference}
            >
              <Typography variant="subtitle2" component="div">
                {`PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>`}
              </Typography>
              <Typography variant="subtitle2" component="div">
                {`PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>`}
              </Typography>
              <Typography variant="subtitle2" component="div">
                {`PREFIX owl: <http://www.w3.org/2002/07/owl#>`}
              </Typography>
              <Typography variant="subtitle2" component="div" color={'#22cc22'}>
                {`PREFIX : <${db_prefix_URL}>`}
              </Typography>
            </Grid>

            <Button
              variant="text"
              size="small"
              endIcon={<ContentCopyIcon />}
              onClick={handleCopyPrefixesReference}
              aria-describedby={'copySuccess'}
              style={{
                textTransform: 'none',
              }}
            >
              Click to copy
            </Button>
          </Paper>
        </Popover>
      </Grid>
    );
  }

  const keyboardShortcutList = [
    {
      key: '[Ctrl|Cmd]-z',
      description: 'Undo',
    },
    {
      key: '[Ctrl|Cmd]-shift-z',
      description: 'Redo',
    },
    {
      key: 'delete',
      description: 'Delete current/selected block(s)',
    },
    {
      key: '[Ctrl|Cmd]-x',
      description: 'Cut current/selected block(s)',
    },
    {
      key: '[Ctrl|Cmd]-c',
      description: 'Copy current/selected block(s)',
    },
    {
      key: '[Ctrl|Cmd]-v',
      description: 'Paste',
    },
  ];
  // const keyboardShortcutList = [
  //   {
  //     key: '[Ctrl|Cmd]-z',
  //     description: 'Undo',
  //   },
  //   {
  //     key: '[Ctrl|Cmd]-shift-z',
  //     description: 'Redo',
  //   },
  //   {
  //     key: '[Ctrl|Cmd]-u',
  //     description: 'Undo',
  //   },
  //   {
  //     key: '[Ctrl|Cmd]-f',
  //     description: 'Find/Relpace',
  //   },
  //   {
  //     key: '[Ctrl|Cmd]-d',
  //     description: 'Delete current/selected line(s)',
  //   },
  //   {
  //     key: '[Ctrl|Cmd]-x',
  //     description: 'Cut current/selected line(s)',
  //   },
  //   {
  //     key: '[Ctrl|Cmd]-c',
  //     description: 'Copy current/selected line(s)',
  //   },
  //   {
  //     key: '[Ctrl|Cmd]-v',
  //     description: 'Paste',
  //   },
  // ];

  function KeyboardShortcut() {
    return (
      <Grid sx={{ marginBottom: 3, marginLeft: 3, maxWidth: 500 }}>
        <Button
          variant="outlined"
          color="success"
          aria-describedby={id_sc}
          onClick={(event) => {
            setAnchorElSc(event.currentTarget);
            setShowShortcut(!showShortcut);
          }}
          sx={{
            textTransform: 'none',
            '&:hover': {
              color: '#fff',
              backgroundColor: '#2e7d32',
            },
          }}
        >
          {showShortcut ? 'Close Keyboard Shortcut' : 'Open Keyboard Shortcut'}
        </Button>
        <Popover
          id={id_sc}
          open={showShortcut}
          anchorEl={anchorElSc}
          onClose={() => {
            setAnchorElSc(null);
            setShowShortcut(false);
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" component="div">
              Keyboard Shortcut
            </Typography>
            <Grid
              sx={{
                padding: 1,
              }}
            >
              {keyboardShortcutList.map((item) => {
                return (
                  <Grid container style={{ padding: 5 }}>
                    <Grid
                      style={{
                        fontFamily: 'monospace',
                        borderRadius: 4,
                        color: '#fff',
                        backgroundColor: '#333',
                        padding: '0 6px 0 6px',
                      }}
                    >
                      {item.key}
                    </Grid>
                    <Grid style={{ padding: '0 6px 0 6px' }}>
                      {item.description}
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Popover>
      </Grid>
    );
  }

  function missingKeyWarning() {
    return (
      <Alert
        sx={{
          display: showMissingKeyWarning ? 'flex' : 'none',
          width: '100%',
          border: '1px solid #ff9800',
        }}
        severity="warning"
        onClose={() => setShowMissingKeyWarning(false)}
      >
        <Grid style={{ fontWeight: 'bold' }}>{`[Query Analysis] `}</Grid>
        Key is missing in your query, this may affect your data visualisation
        please consider adding one
      </Alert>
    );
  }

  function tooMuchDataForVisWarning() {
    return (
      <Alert
        sx={{
          display: showTooMuchDataWarning ? 'flex' : 'none',
          width: '100%',
          border: '1px solid #ff9800',
        }}
        severity="warning"
        onClose={() => setShowTooMuchDataWarning(false)}
      >
        <Grid style={{ fontWeight: 'bold' }}>{`[Data Analysis] `}</Grid>
        The cardinality of your result seems to exceed the configured threshold,
        some affected visualisation have been removed from recommendation.
        Please consider applying a FILTER or LIMIT after your query.
      </Alert>
    );
  }
  function manyManyRelationshipWarningDataAnalysis() {
    return (
      <Alert
        sx={{
          display: showManyManyRelationWarning ? 'flex' : 'none',
          width: '100%',
          border: '1px solid #2196f3',
        }}
        severity="info"
        onClose={() => setShowManyManyRelationWarning(false)}
      >
        <Grid style={{ fontWeight: 'bold' }}>{`[Data Analysis] `}</Grid>
        {relationshipInfoDataAnalysis}
      </Alert>
    );
  }

  function manyManyRelationshipInfo() {
    return (
      <Alert
        sx={{
          display: showManyManyRelationInfo ? 'flex' : 'none',
          width: '100%',
          border: '1px solid #2196f3',
        }}
        severity="info"
        onClose={() => setShowManyManyRelationInfo(false)}
      >
        <Grid style={{ fontWeight: 'bold' }}>{`[Schema Analysis] `}</Grid>
        {manyManyRInfo}
      </Alert>
    );
  }

  function oneManyRelationshipInfo() {
    return (
      <Alert
        sx={{
          display: showOneManyRelationInfo ? 'flex' : 'none',
          width: '100%',
          border: '1px solid #2196f3',
        }}
        severity="info"
        onClose={() => setShowOneManyRelationInfo(false)}
      >
        <Grid style={{ fontWeight: 'bold' }}>{`[Schema Analysis] `}</Grid>
        {oneManyRInfo}
      </Alert>
    );
  }

  function visOptionPanel() {
    return (
      <Grid item>
        <LoadingButton
          variant="contained"
          color={
            recommendations.length > 0 || excludedRecommendations.length > 0
              ? 'success'
              : 'primary'
          }
          disabled={dataSource.length == 0}
          loading={loading}
          loadingPosition="end"
          onClick={handleVisOpen}
          endIcon={<AutoGraphIcon />}
          style={{
            textTransform: 'none',
          }}
        >
          {recommendations.length > 0 || excludedRecommendations.length > 0
            ? `Visualisation Options (${
                recommendations.length + excludedRecommendations.length
              } Recommendations)`
            : `Visualisation Options`}
        </LoadingButton>
        <Dialog
          open={openVis}
          onClose={handleVisClose}
          fullScreen
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleVisClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Choose your visualisation
              </Typography>
              <Button autoFocus color="inherit" onClick={handleVisClose}>
                close
              </Button>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <VisOptions
              data={separateHeader_Data(dataSource)}
              originalData={dataSource}
              recommendations={recommendations}
              excludedRecommendations={excludedRecommendations}
            />
          </DialogContent>
        </Dialog>
      </Grid>
    );
  }

  const [showConfigPanel, setShowConfigPanel] = useState(false);

  function handleCloseConfigPanel() {
    handleQuery(sparqlCode);
    setShowConfigPanel(false);
  }

  function RecommendatoinConfigPanel() {
    return (
      <Grid item>
        <Button
          variant="outlined"
          sx={{ textTransform: 'none' }}
          onClick={() => setShowConfigPanel(true)}
        >
          Recommendation Config
        </Button>
        <Dialog
          open={showConfigPanel}
          TransitionComponent={Transition}
          onClose={handleCloseConfigPanel}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {'Configure the Threshold of instance cardinalities'}
          </DialogTitle>
          <DialogContent>
            <Grid container flexDirection="column" spacing={2}>
              {Object.keys(recommendationConfig).map((config) => {
                return (
                  <Grid
                    item
                    container
                    flexDirection="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      {
                        // @ts-ignore
                        ChartType_mapping[config]
                      }
                    </Grid>
                    <Grid item>
                      <TextField
                        id="outlined-basic"
                        type="number"
                        // @ts-ignore
                        // value={recommendationConfig[config]}
                        defaultValue={recommendationConfig[config]}
                        size="small"
                        variant="outlined"
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          const newConfig = recommendationConfig;
                          // @ts-ignore
                          newConfig[config] = value;
                          setRecommendationConfig(newConfig);
                        }}
                        style={{
                          margin: 3,
                          backgroundColor: 'white',
                          width: '100%',
                        }}
                      />
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfigPanel}>Close</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }

  function DocSideBar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
      setIsOpen(!isOpen);
    };

    type BlockTypes = keyof typeof blockTypes;
    
    const blockTypes = {
      'String': ['String'],
      'Number': ['Number'],
      'Boolean': ['Not', 'And', 'Or', 'Comparison'],
      'Modifier': ['Having', 'Limit', 'Offset', 'Order By', 'Group By'],
      'Aggregate': ['Count', 'Sum', 'Average', 'Minimum', 'Maximum'],
      'Pattern': ['Triple Pattern', 'Filter', 'Optional', 'Union', 'Bind'],
      'Variable': ['Variable list', 'Variable', 'Type Name', 'Variable Name', 'As'],
      'Arithmetic': ['Add', 'Subtract', 'Multiply', 'Divide'],
      'Keyword': ['Prefix', 'Select', 'Distinct/Reduced', 'Modifier Connector', 'Existence'],
      'SubTriple': ['Predicate-Object Pair'],
      'ClassProperty': ['Connector'],
      '':['']
    };

    return (
      <>
        <IconButton onClick={toggleDrawer} style={{ position: 'fixed', right: 0, top: '50%', zIndex: 1300 }}>
          {isOpen ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
        <Drawer 
          variant="persistent" 
          anchor="right" 
          open={isOpen} 
          PaperProps={{ style: { marginTop: '64px' } }} 
        >
          <Paper style={{ padding: '10px', backgroundColor: '#4285F4', color: '#fff', fontWeight: 'bold' }}>
            <Typography variant="h6">Tips: </Typography>
            <div> - Block names corresponding to each type</div>
            <div>- Hover over the blocks to see NAME</div>
          </Paper>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ width: '100%' }}>
              {Object.keys(blockTypes).map((type) => (
                <React.Fragment key={type}>
                  <Typography variant="h6" style={{ margin: '16px 16px 8px' }}>
                    {type}
                  </Typography>
                  <List>
                    {blockTypes[type as BlockTypes].map((block) => (
                    <Box
                      key={block}
                      border={1}
                      borderColor="grey.300"
                      borderRadius={1}
                      margin={1}
                      bgcolor="grey.100"
                    >
                      <ListItem>
                        <ListItemText primary={block} />
                      </ListItem>
                    </Box>
                    ))}
                  </List>
                  <Divider />
                </React.Fragment>
              ))}
            </div>
          </div>
        </Drawer>
      </>
    );
  };
  
  const [showPrefixReference, setShowPrefixReference] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const canBeOpen_prefixRef = showPrefixReference && Boolean(anchorEl);
  const id_prefixRef = canBeOpen_prefixRef ? 'simple-popover' : undefined;

  const [showShortcut, setShowShortcut] = useState(false);
  const [anchorElSc, setAnchorElSc] = useState<null | HTMLElement>(null);
  const canBeOpen_sc = showShortcut && Boolean(anchorElSc);
  const id_sc = canBeOpen_sc ? 'simple-popover' : undefined;


  // =================================== =================================== ===================================



  const saveWorkspaceToLocalStorage = () => {
    if (workspaceRef.current) {
      const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
      const xmlText = Blockly.Xml.domToPrettyText(xml);
      localStorage.setItem('currentWorkspace', xmlText);
    }
  };

  const loadWorkspaceFromLocalStorage = () => {
    const savedWorkspace = localStorage.getItem('currentWorkspace');
    if (savedWorkspace && workspaceRef.current) {
      const xml = Blockly.utils.xml.textToDom(savedWorkspace);
      Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
    }
  };

  useEffect(() => {
    const storedBlocksStr = localStorage.getItem('storedBlocks');
    const savedBlocks = storedBlocksStr ? JSON.parse(storedBlocksStr) : [];
    setStoredBlocks(savedBlocks);
  }, []);




  function validateBlock(block: Blockly.Block): string | null {
    switch (block.type) {
      case 'sparql_prefix':
        if (block.previousConnection !== null) {
            return 'Prefix block should not have a previous connection.';
        }
        var nextBlock = block.getNextBlock();
        if (nextBlock && nextBlock.type !== 'sparql_select') {
            return 'Prefix block must be followed by a Select block.';
        }
        break;

      case 'sparql_select':
        if (block.previousConnection !== null) {
          const precedingBlock = block.previousConnection.targetBlock();
          if (precedingBlock !== null && precedingBlock.type !== 'sparql_prefix') {
              return 'Select block must be preceded by a Prefix block.';
          }
        }

        const variablesInput = block.getInputTargetBlock('VARIABLES');
        if (variablesInput === null) {
            return 'Select block must have variables you would like to explore connected at the 1st input.';
        } else {
          // var nextVarBlock : Blockly.Block | null = variablesInput;
          // console.log('!!@@###@!!!@#$$' + nextVarBlock);

          // while (nextVarBlock !== null) {
          //     if (nextVarBlock.type !== 'sparql_variable_select' && nextVarBlock.type !== 'sparql_variable_select_demo') {
          //         return 'The 1st input of Select block must only have Variable or Variable list blocks.';
          //     }
          //     nextVarBlock = nextVarBlock.getNextBlock();
          // }
          if (variablesInput.type !== 'sparql_variable_select' && variablesInput.type !== 'sparql_variable_select_demo') {
            return 'The 1st input of Select block must only have Variable or Variable list blocks.';
          }
        }
        const whereInput = block.getInputTargetBlock('WHERE');
        if (whereInput === null) {
            return 'Here must have a Pattern connected.';
        }

        if (whereInput.type !== 'sparql_class_with_property' 
          && whereInput.type !== 'sparql_filter' && whereInput.type !== 'sparql_optional'
          && whereInput.type !== 'sparql_union' && whereInput.type !== 'sparql_bind') {
            return 'The 2nd input must be of Class, filter, optional, bind, or union.';
        }
        break;

      case 'sparql_distinct_reduced':
        if (block.outputConnection === null || block.outputConnection.targetBlock() === null) {
            return 'Distinct block must be connected to a Select block.';
        }

        const variableInput = block.getInputTargetBlock('VARIABLE');
        if (variableInput && variableInput.type !== 'sparql_variable_select' && variableInput.type !== 'sparql_variable_select_demo') {
            return 'The input of Distinct block must only have Variable or Variable list blocks.';
        }
        break;

      case 'sparql_orderby':
        const orderbyVariable = block.getFieldValue('VARIABLE');
        if (!orderbyVariable || orderbyVariable.trim() === '') {
            return 'ORDER BY block must have a variable specified.';
        }
        break;

      case 'sparql_groupby':
        const groupbyVariable = block.getFieldValue('VARIABLE');
        if (!groupbyVariable || groupbyVariable.trim() === '') {
            return 'GROUP BY block must have a variable specified.';
        }
        break;

      case 'sparql_having':
        const havingCondition = block.getInputTargetBlock('HAVING_CONDITION');
        if (havingCondition !== null) {
            if (havingCondition.type !== 'sparql_comparison' 
              && havingCondition.type !== 'sparql_and' 
              && havingCondition.type !== 'sparql_or' 
              && havingCondition.type !== 'sparql_not') {
                return 'HAVING block must have a boolean blocks such as And, Or, Not and Comparison connected.';
            }
        }
        break;

      case 'sparql_limit':
        const limitValue = block.getInputTargetBlock('LIMIT');
        if (limitValue !== null) {
            if (limitValue.type !== 'sparql_number') {
                return 'LIMIT block must have a numeric value connected.';
            }
        }
        break;

      case 'sparql_offset':
        const offsetValue = block.getInputTargetBlock('OFFSET');
        if (offsetValue !== null) {
          if (offsetValue.type !== 'sparql_number') {
              return 'OFFSET block must have a numeric value connected.';
          }
        }
        break;

      case 'sparql_class_with_property':
        const classNameInput = block.getInputTargetBlock('CLASS_NAME');
        if (classNameInput !== null) {
          if (classNameInput.type !== 'sparql_variable_confirmed') {
              return 'The class name input of Triple Pattern block must be Subject block.';
          }
        }
        break;

      case 'sparql_variable_type':
        const varType = block.getInputTargetBlock('TYPE2');
        if (varType !== null) {
            if (varType.type !== 'sparql_variable_typename' && varType.type !== 'sparql_variable_varname') {
                return 'The variable input must be Variable name or Type name blocks.';
            }
        }
        break;

      case 'sparql_variable_select':
        const nextVarBlock = block.getInputTargetBlock('NEXT_VARIABLE');
        if (nextVarBlock !== null) {
          if (nextVarBlock.type !== 'sparql_variable_select' && nextVarBlock.type !== 'sparql_variable_select_demo') {
              return 'Variable list block must be followed by another Variable or Variable list block.';
          }
        }
        break;

      case 'sparql_variable_select_demo':
        const nextVar = block.getInputTargetBlock('NEXT_VARIABLE');
        if (nextVar !== null) {
          if (nextVar.type !== 'sparql_variable_select' && nextVar.type !== 'sparql_variable_select_demo') {
              return 'Variable block must be followed by another Variable or Variable list block.';
          }
        }
        break;
      }

    return null;
  }


  function validateBlockAndChildren(block: Blockly.Block): Array<{ block: Blockly.Block, message: string }> {
    const errors: Array<{ block: Blockly.Block, message: string }> = [];
    const errorMessage = validateBlock(block);
    if (errorMessage) {
        errors.push({ block, message: errorMessage });
    }

    block.getChildren(true).forEach((childBlock) => {
        const childErrors = validateBlockAndChildren(childBlock);
        if (childErrors.length > 0) {
            errors.push(...childErrors);
        }
    });

    return errors;
  }

  function validateWorkspace(workspace: Blockly.WorkspaceSvg): void {
    // clean up previous errors
    clearAllErrors(workspace); 

    const topBlocks = workspace.getTopBlocks(true); 
    const errors: Array<{ block: Blockly.Block, message: string }> = [];

    topBlocks.forEach((block) => {
        const result = validateBlockAndChildren(block);
        if (result.length > 0) {
            errors.push(...result);
        }
    });

    if (errors.length > 0) {
        console.log('Validation errors:', errors);
        errors.forEach((error) => {
            console.error('Block ID:', error.block.id, 'Error:', error.message);
            (error.block as Blockly.BlockSvg).select();
            (error.block as Blockly.BlockSvg).setHighlighted(true);
            setTimeout(() => {
                (error.block as Blockly.BlockSvg).setHighlighted(false);
                (error.block as Blockly.BlockSvg).unselect();
            }, 2000);
            showErrorOnBlock(error.block, error.message); 
        });
    } else {
        console.log('No validation errors found.');
    }
  }

  function showErrorOnBlock(block: Blockly.Block, message: string): void {
    const workspaceSvg = (block.workspace as Blockly.WorkspaceSvg).getParentSvg();
    const blockSvg = (block as Blockly.BlockSvg).getSvgRoot(); 

    const blockPosition = blockSvg.getBoundingClientRect();


    const backgroundRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    backgroundRect.setAttribute("x", (blockPosition.x - 305).toString());
    backgroundRect.setAttribute("y", (blockPosition.y - 25).toString()); 
    backgroundRect.setAttribute("width", (1000).toString());
    backgroundRect.setAttribute("height", "20");
    backgroundRect.setAttribute("fill", "tomato");    
    backgroundRect.setAttribute("stroke", "orangered"); 
    backgroundRect.setAttribute("stroke-width", "1"); 
    backgroundRect.setAttribute("rx", "5");
    backgroundRect.setAttribute("ry", "5");
    backgroundRect.setAttribute("error-message", "true"); 
    backgroundRect.style.filter = 'drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5))';

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", (blockPosition.x - 300).toString());
    text.setAttribute("y", (blockPosition.y - 10).toString()); 
    text.setAttribute("fill", "white");
    text.setAttribute("font-size", "14"); 
    text.setAttribute("font-weight", "bold");
    text.setAttribute("font-family", "Courier New, monospace");
    text.setAttribute("text-anchor", "start"); 
    text.setAttribute("error-message", "true"); 
    text.textContent = message;

    workspaceSvg.appendChild(backgroundRect);
    workspaceSvg.appendChild(text);
  }

  function clearAllErrors(workspace: Blockly.WorkspaceSvg): void {
    const workspaceSvg = workspace.getParentSvg();
    const errorElements = workspaceSvg.querySelectorAll('[error-message="true"]');
    errorElements.forEach(element => element.remove());
}

  useEffect(() => {
    if (blocklyRef.current && !workspaceRef.current) {
      workspaceRef.current = Blockly.inject(blocklyRef.current, {
        toolbox: getToolboxXML(),
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        move: {
          scrollbars: true,
          drag: true,
          wheel: true
        },
        theme: myTheme
      }) as Blockly.WorkspaceSvg;

      loadWorkspaceFromLocalStorage();
      workspaceRef.current.addChangeListener(() => {
        saveWorkspaceToLocalStorage();
        generateSparqlCode(); 
        if (workspaceRef.current) {
          validateWorkspace(workspaceRef.current);
        }
      });
    }
    if (workspaceRef.current) {
      workspaceRef.current.updateToolbox(getToolboxXML());
    }
    generateSparqlCode();

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [storedBlocks]);

  const saveWorkspaceToStoredBlocks = () => {
    if (workspaceRef.current) {
      const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
      const xmlText = Blockly.Xml.domToPrettyText(xml);
      const updatedBlocks = [...storedBlocks, xmlText];
      setStoredBlocks(updatedBlocks);
      localStorage.setItem('storedBlocks', JSON.stringify(updatedBlocks));
      console.log('Workspace saved to Stored Blocks:', xmlText);
    }
  };

  const clearStoredBlocks = () => {
    setStoredBlocks([]);
    localStorage.setItem('storedBlocks', JSON.stringify([]));
  };

  const generateSparqlCode = () => {
    if (workspaceRef.current) {
      localStorage.setItem('varNames', JSON.stringify({}));
      localStorage.setItem('classNames', JSON.stringify({}));
      const topBlocks = workspaceRef.current.getTopBlocks(true);
      let code = '';
      topBlocks.forEach(block => {
        let currentBlock: Blockly.BlockSvg | null = block;
        while (currentBlock) {
          const blockCode = Sparql.blockToCode(currentBlock);
          code += Array.isArray(blockCode) ? blockCode[0] : blockCode;
          const nextBlock: Blockly.BlockSvg | null = currentBlock.nextConnection 
            ? currentBlock.nextConnection.targetBlock() as Blockly.BlockSvg | null 
            : null;
          currentBlock = nextBlock;
        }
      });
      setSparqlCode(code);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sparqlCode).then(() => {
      setShowCopyMessage(true);
      setTimeout(() => {
        setShowCopyMessage(false);
      }, 1000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleRefresh = () => {
    if (workspaceRef.current) {
      const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, workspaceRef.current);
    }
  };

  Blockly.utils.colour.setHsvSaturation(0.25);
  Blockly.utils.colour.setHsvValue(0.75);


  return (

      <Grid style={{ margin: 10 }}>
        {DocSideBar()}
      <Grid container>
        {PrefixReference()}
        {KeyboardShortcut()}
      </Grid>
      <div style={{ display: 'flex', height: '80vh', position: 'relative' }}>
        <div ref={blocklyRef} style={{ flex: 2, minWidth: '100%' }} />
        <button onClick={handleRefresh} style={{
        position: 'absolute',
        top: '160px',
        right: '20px',
        width: '50px',
        height: '50px',
        backgroundColor: '#6FBF8E',
        borderRadius: '50%',
        border: 'none',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        Refresh
    </button>
        <button onClick={saveWorkspaceToStoredBlocks} style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        backgroundColor: '#6FBF8E',
        borderRadius: '50%',
        border: 'none',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
        }}>
        Save
        </button>
        <button onClick={clearStoredBlocks} style={{
        position: 'absolute',
        top: '90px',
        right: '20px',
        width: '50px',
        height: '50px',
        backgroundColor: '#ff4d4d',
        borderRadius: '50%',
        border: 'none',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
        }}>
        Clear
        </button>
    </div>

    <div style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderLeft: '2px solid #ccc',
        padding: '10px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        borderRadius: '10px'
    }}>
        {showCopyMessage && (
        <div style={{
            position: 'absolute',
            bottom: '80px',
            right: '20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
            Copied to clipboard!
        </div>
        )}
        <button onClick={copyToClipboard} style={{
        padding: '10px',
        position: 'absolute',
        bottom: '15px',
        right: '20px',
        backgroundColor: '#6FBF8E',
        border: 'none',
        borderRadius: '10px',
        color: 'white',
        fontWeight: 'bold',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer'
        }}>
        Copy to Clipboard
        </button>
        <pre style={{
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        marginTop: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.25)',
        borderRadius: '10px',
        padding: '10px',
        textAlign: 'left', 
        whiteSpace: 'pre-wrap',
        maxHeight: '400px',
        overflowY: 'auto'
        }}>
        {sparqlCode}
        </pre>
    </div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {oneManyRelationshipInfo()}
          {manyManyRelationshipInfo()}
          {manyManyRelationshipWarningDataAnalysis()}
          {missingKeyWarning()}
          {tooMuchDataForVisWarning()}
        </Grid>
        <Grid
          item
          container
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <LoadingButton
            variant="contained"
            onClick={() => {
              handleQuery(sparqlCode); 
            }}
            loading={loading}
            loadingPosition="end"
            // disabled={loading}
            endIcon={<SendIcon />}
            style={{ textTransform: 'none' }}
            sx={{
              maxHeight: '40px',
            }}
          >
            Execute Query
          </LoadingButton>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked
                  value={inferredDataQuery}
                  onClick={() => {
                    toggleInferredDataQuery();
                    handleQuery(sparqlCode);
                  }}
                />
              }
              label="Use inferred data?"
              labelPlacement="start"
            />
          </FormGroup>
        </Grid>

        <Grid item xs={12}></Grid>

        <Grid
          item
          container
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
        >
          {visOptionPanel()}
          {RecommendatoinConfigPanel()}
        </Grid>
      </Grid>

      {columns.length > 0 && (
        <Grid container spacing={3} style={{ paddingTop: 20 }}>
          {/* Chart */}
          <Grid item xs={12}>
            <Paper
              sx={{
                height: '100vh',
              }}
            >
              {showAlert ? (
                <Alert severity="error" style={{ height: '100%' }}>
                  {alertText}
                </Alert>
              ) : loading ? (
                <Skeleton variant="rounded" width="100%" height="100%" />
              ) : dataSource.length === 0 ? (
                <Alert
                  severity="info"
                  style={{ height: '100%', justifyContent: 'center' }}
                >
                  {`Empty result`}
                </Alert>
              ) : (
                <DataGridPro
                  key={Date.now()}
                  rows={dataSource}
                  columns={columns}
                  pagination
                  rowSpacingType="border"
                  showCellRightBorder
                  rowsPerPageOptions={[100, 200, 1000]}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {fullLoading && (
        <Backdrop
          sx={{
            marginLeft: `${
              document.getElementById('DashBoardDrawer')?.offsetWidth
            }px`,
            marginTop: `${
              document.getElementById('DashBoardToolbar')?.offsetHeight
            }px`,
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            backgroundColor: '#1976d2',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={fullLoading}
        >
          <CircularProgress color="inherit" />
          <div style={{ marginLeft: 20 }}>
            {' '}
            Collecting info for Conceptual Model ...{' '}
          </div>
        </Backdrop>
      )}

      {/* Copied successful notification */}
      <Snackbar
        open={showCopySuccess}
        autoHideDuration={2000}
        onClose={() => setShowCopySuccess(false)}
      >
        <Alert
          severity="success"
          sx={{ width: '100%' }}
          onClose={() => setShowCopySuccess(false)}
        >
          The Prefixes reference has been copied to clipboard!
        </Alert>
      </Snackbar>

      {/* Copy failed  Clipboard not available in unsafe origin */}
      <Snackbar
        open={showCopyUnderUnsafeOrigin}
        autoHideDuration={2000}
        onClose={() => setShowCopyUnderUnsafeOrigin(false)}
      >
        <Alert
          severity="error"
          sx={{ width: '100%' }}
          onClose={() => setShowCopyUnderUnsafeOrigin(false)}
        >
          Copy failed: Clipboard is not available under unsafe (non-https)
          origin!
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default SparqlyPage;
