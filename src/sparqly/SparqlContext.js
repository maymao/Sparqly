import { createContext } from 'react';

export const SparqlContext = createContext({
  sparqlCode: '',
  setSparqlCode: () => {},
  sparqlResult: null, 
  setSparqlResult: () => {}, 
  sparqlOriginalResult: null, 
  setSparqlOriginalResult: () => {}, 

  // recommendations: [],
  // setRecommendations: () => {},
  // excludedRecommendations: [],
  // setExcludedRecommendations: () => {},
});