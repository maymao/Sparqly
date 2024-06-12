import React, { useState} from 'react';
import { SparqlContext } from './SparqlContext';
import BlocklyComponent from './components/BlocklyComponent';
import VisualComponent from './components/VisualComponent';
import RecommendationComponent from './components/RecommendationComponent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { Box, Grid } from '@mui/material';

const Sparqly = ({ repo_graphDB, db_prefix_URL }) => {
    const [sparqlCode, setSparqlCode] = useState('');
    const [sparqlOriginalResult, setSparqlOriginalResult] = useState(null);
    const [sparqlResult, setSparqlResult] = useState(null);
    // const [recommendations, setRecommendations] = useState([]);
    // const [excludedRecommendations, setExcludedRecommendations] = useState([]);
    console.log('!!!!!!sparqlCode', sparqlCode);

//   return (
//     <SparqlContext.Provider value={
//       {
//       sparqlCode, setSparqlCode, 
//       sparqlResult, setSparqlResult, 
//       sparqlOriginalResult, setSparqlOriginalResult,
//       recommendations, setRecommendations,
//       excludedRecommendations, setExcludedRecommendations
//       }}>
//       <Accordion>
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="blockly-content"
//           id="blockly-header"
//         >
//           <Typography>Blockly Workspace</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <BlocklyComponent />
//         </AccordionDetails>
//       </Accordion>

      
//       <Accordion>
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="another-content"
//           id="another-header"
//         >
//           <Typography>Result</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <RecommendationComponent repo_graphDB={repo_graphDB} db_prefix_URL={db_prefix_URL}/>
//         </AccordionDetails>

//       </Accordion>


//       <Accordion>
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="another-content"
//           id="another-header"
//         >
//           <Typography>Vision</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <VisualComponent />
//         </AccordionDetails>
//       </Accordion>

//     </SparqlContext.Provider>
//   );
// };

return (
  <div></div>
  // <SparqlContext.Provider value={{
  //   sparqlCode, setSparqlCode,
  //   sparqlResult, setSparqlResult,
  //   sparqlOriginalResult, setSparqlOriginalResult,
  //   // recommendations, setRecommendations,
  //   // excludedRecommendations, setExcludedRecommendations
  // }}>
  //   {/* <Grid container sx={{ height: '100vh' }}> */}
  //       {/* <Grid item xs={12} key="blockly-component"> */}
  //         <BlocklyComponent />
  //       {/* </Grid> */}
  //     {/* </Grid> */}
  // </SparqlContext.Provider>
  );
};

export default Sparqly;
