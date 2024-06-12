import React, { useEffect, useRef, useState, useContext } from 'react';
import * as Blockly from 'blockly';
import '../blocks/index.js';
import { Sparql } from '../generator/index.js';
import myTheme from '../core/theme.js';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { SparqlContext } from '../SparqlContext.js';
import { Box, Button, Grid, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const BlocklyComponent = () => {
  const blocklyRef = useRef(null);
  const workspaceRef = useRef(null);
  // const [sparqlCode, setSparqlCode]= useState(''); 
  const { sparqlCode, setSparqlCode } = useContext(SparqlContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storedBlocks, setStoredBlocks] = useState([]);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  Blockly.utils.colour.setHsvSaturation(0.25);
  Blockly.utils.colour.setHsvValue(0.75);

  const increaseFontSize = () => {
    setFontSize((prevSize) => Math.min(prevSize + 2, 24)); // Increase font size, max 24px
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(prevSize - 2, 8)); // Decrease font size, min 8px
  };

  const oneMany = `
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
          <block type="sparql_variable_select">
            <field name="VARIABLE">country</field>
            <value name="NEXT_VARIABLE">
              <block type="sparql_variable_select">
                <field name="VARIABLE">city</field>
                <value name="NEXT_VARIABLE">
                  <block type="sparql_variable_select">
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
                        <field name="PREFIX">rdf</field>
                      </block>
                    </value>
                    <value name="TYPE2">
                      <block type="sparql_variable_typename">
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
                            <field name="VARIABLE">?city</field>
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
                                <field name="VARIABLE">?c</field>
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
                                    <field name="VARIABLE">?cityPop</field>
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
                            <field name="PREFIX">rdf</field>
                          </block>
                        </value>
                        <value name="TYPE2">
                          <block type="sparql_variable_typename">
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
                                <field name="VARIABLE">?country</field>
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
                                  <block type="sparql_variable_confirmed">
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
                          <block type="sparql_variable_confirmed">
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
                    <next>
                      <block type="sparql_filter">
                        <value name="FILTER_CONDITION">
                          <block type="sparql_comparison">
                            <field name="OPERATOR">&gt;</field>
                            <value name="OPERAND1">
                              <block type="sparql_variable_varname">
                                <field name="VARIABLE">?cityPop</field>
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
        </statement>
      </block>
    </next>
  </block>
  `;
  const pattern1 = `
  <block type="sparql_prefix" x="10" y="10">
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
          <block type="sparql_variable_select">
            <field name="VARIABLE">name</field>
            <value name="NEXT_VARIABLE">
              <block type="sparql_variable_select">
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
                            <field name="VARIABLE">?name</field>
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
                                <field name="VARIABLE">?population</field>
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
                <field name="ORDER">ASC</field>
                <field name="VARIABLE">population</field>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </next>
  </block>
`;

  const patterns = [];

  const getToolboxXML = () => {
    return `
      <xml xmlns="https://developers.google.com/blockly/xml">

        <category name="Examples" categorystyle="examples_category">
          ${pattern1}
          ${oneMany}
        </category>

        <category name="Basics" categorystyle="basics_category">
          <block type="sparql_string"></block>
          <block type="sparql_number"></block>
        </category>
        <category name="Math" categorystyle="math_category">
          <block type="sparql_add"></block>
          <block type="sparql_subtract"></block>
          <block type="sparql_multiply"></block>
          <block type="sparql_divide"></block>
          <block type="sparql_comparison"></block>
        </category>
        <category name="Logic" categorystyle="logic_category">
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
          <block type="sparql_filter"></block>
          <block type="sparql_existence"></block>
          <block type="sparql_optional"></block>
        </category>
        <category name="Condition" categorystyle="condition_category">
          <block type="sparql_orderby"></block>
          <block type="sparql_groupby"></block>
          <block type="sparql_having"></block>
          <block type="sparql_limit"></block>
          <block type="sparql_offset"></block>
          <block type="sparql_union"></block>
        </category>
        <category name="Variable" categorystyle="variable_category">
        // used in classname block, properties
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
          
          // used in classname block, types
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

        // classname block with a custom name
        <block type="sparql_class_with_property">
          <value name="CLASS_NAME">
            <block type="sparql_variable_confirmed">
              <field name="VARIABLE">custom</field>
            </block>
          </value>
        </block>
          <block type="sparql_class_with_property"></block>
          <block type="sparql_properties_in_class"></block>
          <block type="sparql_prefix_list"></block>
          <block type="sparql_variable_type"></block>
          <block type="sparql_variable_select"></block>
          <block type="sparql_variable_typename"></block>
          <block type="sparql_variable_varname"></block>
          <block type="sparql_variable_confirmed"></block>
          <block type="sparql_bind"></block>
          <block type="sparql_as"></block>
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

{/* <category name="Extra" colour="#5CB763">
<block type="sparql_isURI"></block>
<block type="sparql_isBlank"></block>
<block type="sparql_isLiteral"></block>
<block type="sparql_bound"></block>
<block type="sparql_str"></block>
<block type="sparql_lang"></block>
<block type="sparql_datatype"></block>
<block type="sparql_sameTerm"></block>
<block type="sparql_langMatches"></block>
<block type="sparql_regex"></block>
</category> */}

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
    const savedBlocks = JSON.parse(localStorage.getItem('storedBlocks')) || [];
    setStoredBlocks(savedBlocks);
  }, []);

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
      });

      loadWorkspaceFromLocalStorage();
      workspaceRef.current.addChangeListener(() => {
        saveWorkspaceToLocalStorage();
        generateSparqlCode(); 
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

  useEffect(() => {
    console.log('Current sparqlCode:', sparqlCode);
  }, [sparqlCode]);

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
      localStorage.setItem('classNames', JSON.stringify({}));
      localStorage.setItem('varNames', JSON.stringify({}));
      const topBlocks = workspaceRef.current.getTopBlocks(true);
      let code = '';
      topBlocks.forEach(block => {
        var currentBlock = block;
        while (currentBlock) {
          const blockCode = Sparql.blockToCode(currentBlock);
          code += Array.isArray(blockCode) ? blockCode[0] : blockCode;
          currentBlock = currentBlock.nextConnection && currentBlock.nextConnection.targetBlock();
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

  return (
  //   <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
  //   <Grid container sx={{ flex: 1 }}>
  //     <Grid item xs={12} sx={{ position: 'relative' }}>
  //       <Box ref={blocklyRef} sx={{ height: '80vh', width: '100%' }} />
  //       <Button 
  //         onClick={handleRefresh} 
  //         sx={{
  //           position: 'absolute',
  //           top: '160px',
  //           right: '20px',
  //           width: '50px',
  //           height: '50px',
  //           backgroundColor: '#6FBF8E',
  //           borderRadius: '50%',
  //           boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  //           display: 'flex',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           minWidth: '50px',
  //           '&:hover': {
  //             backgroundColor: '#57a07e',
  //           }
  //         }}
  //       >
  //         Refresh
  //       </Button>
  //       <Button 
  //         onClick={saveWorkspaceToStoredBlocks} 
  //         sx={{
  //           position: 'absolute',
  //           top: '20px',
  //           right: '20px',
  //           width: '50px',
  //           height: '50px',
  //           backgroundColor: '#6FBF8E',
  //           borderRadius: '50%',
  //           boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  //           display: 'flex',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           minWidth: '50px',
  //           '&:hover': {
  //             backgroundColor: '#57a07e',
  //           }
  //         }}
  //       >
  //         Save
  //       </Button>
  //       <Button 
  //         onClick={clearStoredBlocks} 
  //         sx={{
  //           position: 'absolute',
  //           top: '90px',
  //           right: '20px',
  //           width: '50px',
  //           height: '50px',
  //           backgroundColor: '#ff4d4d',
  //           borderRadius: '50%',
  //           boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  //           display: 'flex',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           minWidth: '50px',
  //           '&:hover': {
  //             backgroundColor: '#e04444',
  //           }
  //         }}
  //       >
  //         Clear
  //       </Button>
  //     </Grid>
  //   </Grid>
  //   <Grid container sx={{ height: '20vh', position: 'relative', padding: '10px', boxSizing: 'border-box' }}>
  //     <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
      
  //       {showCopyMessage && (
  //         <Box sx={{
  //           position: 'absolute',
  //           bottom: '80px',
  //           right: '20px',
  //           backgroundColor: '#4CAF50',
  //           color: 'white',
  //           padding: '10px',
  //           borderRadius: '5px',
  //           boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  //         }}>
  //           Copied to clipboard!
  //         </Box>
  //       )}
  //       <Button 
  //         onClick={copyToClipboard} 
  //         sx={{
  //           padding: '10px',
  //           position: 'absolute',
  //           bottom: '15px',
  //           right: '20px',
  //           backgroundColor: '#6FBF8E',
  //           borderRadius: '10px',
  //           color: 'white',
  //           fontWeight: 'bold',
  //           boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  //           '&:hover': {
  //             backgroundColor: '#57a07e',
  //           }
  //         }}
  //       >
  //         Copy to Clipboard
  //       </Button>
  //       <Box component="pre" sx={{
  //         flex: 1,
  //         overflow: 'auto',
  //         backgroundColor: '#f0f0f0',
  //         border: '1px solid #ccc',
  //         marginTop: '10px',
  //         boxShadow: '0 4px 8px rgba(0,0,0,0.25)',
  //         borderRadius: '10px',
  //         padding: '10px',
  //         textAlign: 'left',
  //         whiteSpace: 'pre-wrap',
  //         fontSize: `${fontSize}px`
  //       }}>
  //         {sparqlCode}
  //       </Box>
  //       <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
  //         <IconButton onClick={decreaseFontSize}>
  //           <Remove />
  //         </IconButton>
  //         <IconButton onClick={increaseFontSize}>
  //           <Add />
  //         </IconButton>
  //       </Box>

  //     </Grid>
  //   </Grid>
  // </Box>
    <div>
    {/* <Grid container spacing={2}>
      <Grid item xs={12} md={8}> */}

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

      {/* </Grid>
      <Grid item xs={12} md={4}> */}

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

      {/* </Grid> */}
     {/* </Grid> */}
  </div>
  );
}


export default BlocklyComponent;
