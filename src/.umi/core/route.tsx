// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
import routeProps from './routeProps';

if (process.env.NODE_ENV === 'development') {
  Object.entries(routeProps).forEach(([key, value]) => {
    const internalProps = ['path', 'id', 'parentId', 'isLayout', 'isWrapper', 'layout', 'clientLoader'];
    Object.keys(value).forEach((prop) => {
      if (internalProps.includes(prop)) {
        throw new Error(
          `[UmiJS] route '${key}' should not have '${prop}' prop, please remove this property in 'routeProps'.`
        )
      }
    })
  })
}

import React from 'react';

export async function getRoutes() {
  const routes = {"404":{"path":"*","id":"404","parentId":"@@/global-layout"},"SparqlPage/ConceptualModel/function":{"path":"SparqlPage/ConceptualModel/function","id":"SparqlPage/ConceptualModel/function","parentId":"@@/global-layout"},"graphs/ANTVCharts/ChoroplethMapAntV":{"path":"graphs/ANTVCharts/ChoroplethMapAntV","id":"graphs/ANTVCharts/ChoroplethMapAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/CirclePackingAntV":{"path":"graphs/ANTVCharts/CirclePackingAntV","id":"graphs/ANTVCharts/CirclePackingAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/GroupedColumnAntV":{"path":"graphs/ANTVCharts/GroupedColumnAntV","id":"graphs/ANTVCharts/GroupedColumnAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/StackedColumnAntV":{"path":"graphs/ANTVCharts/StackedColumnAntV","id":"graphs/ANTVCharts/StackedColumnAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/multipleLineChart":{"path":"graphs/ANTVCharts/multipleLineChart","id":"graphs/ANTVCharts/multipleLineChart","parentId":"@@/global-layout"},"SparqlPage/ConceptualModel/service":{"path":"SparqlPage/ConceptualModel/service","id":"SparqlPage/ConceptualModel/service","parentId":"@@/global-layout"},"components/DashBoardUtilComponents":{"path":"components/DashBoardUtilComponents","id":"components/DashBoardUtilComponents","parentId":"@@/global-layout"},"graphs/ANTVCharts/BubbleChartAntV":{"path":"graphs/ANTVCharts/BubbleChartAntV","id":"graphs/ANTVCharts/BubbleChartAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/ColumnChartAntV":{"path":"graphs/ANTVCharts/ColumnChartAntV","id":"graphs/ANTVCharts/ColumnChartAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/ScatterPlotAntV":{"path":"graphs/ANTVCharts/ScatterPlotAntV","id":"graphs/ANTVCharts/ScatterPlotAntV","parentId":"@@/global-layout"},"SparqlPage/ConceptualModel/regex":{"path":"SparqlPage/ConceptualModel/regex","id":"SparqlPage/ConceptualModel/regex","parentId":"@@/global-layout"},"graphs/ANTVCharts/GroupedBarAntV":{"path":"graphs/ANTVCharts/GroupedBarAntV","id":"graphs/ANTVCharts/GroupedBarAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/StackedBarAntV":{"path":"graphs/ANTVCharts/StackedBarAntV","id":"graphs/ANTVCharts/StackedBarAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/LineChartAntV":{"path":"graphs/ANTVCharts/LineChartAntV","id":"graphs/ANTVCharts/LineChartAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/WordCloudAntV":{"path":"graphs/ANTVCharts/WordCloudAntV","id":"graphs/ANTVCharts/WordCloudAntV","parentId":"@@/global-layout"},"graphs/GoogleCharts/ScatterPlot":{"path":"graphs/GoogleCharts/ScatterPlot","id":"graphs/GoogleCharts/ScatterPlot","parentId":"@@/global-layout"},"graphs/ANTVCharts/BarChartAntV":{"path":"graphs/ANTVCharts/BarChartAntV","id":"graphs/ANTVCharts/BarChartAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/CalendarAntV":{"path":"graphs/ANTVCharts/CalendarAntV","id":"graphs/ANTVCharts/CalendarAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/PieChartAntV":{"path":"graphs/ANTVCharts/PieChartAntV","id":"graphs/ANTVCharts/PieChartAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/SunBurstAntV":{"path":"graphs/ANTVCharts/SunBurstAntV","id":"graphs/ANTVCharts/SunBurstAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/HeatmapAntv":{"path":"graphs/ANTVCharts/HeatmapAntv","id":"graphs/ANTVCharts/HeatmapAntv","parentId":"@@/global-layout"},"graphs/ANTVCharts/NetworkAntV":{"path":"graphs/ANTVCharts/NetworkAntV","id":"graphs/ANTVCharts/NetworkAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/TreeMapAntV":{"path":"graphs/ANTVCharts/TreeMapAntV","id":"graphs/ANTVCharts/TreeMapAntV","parentId":"@@/global-layout"},"graphs/GoogleCharts/LineChart":{"path":"graphs/GoogleCharts/LineChart","id":"graphs/GoogleCharts/LineChart","parentId":"@@/global-layout"},"schemaPage/queryFactory/index":{"path":"schemaPage/queryFactory","id":"schemaPage/queryFactory/index","parentId":"@@/global-layout"},"SparqlPage/codeMirrorConfigs":{"path":"SparqlPage/codeMirrorConfigs","id":"SparqlPage/codeMirrorConfigs","parentId":"@@/global-layout"},"graphs/ANTVCharts/SankeyAntV":{"path":"graphs/ANTVCharts/SankeyAntV","id":"graphs/ANTVCharts/SankeyAntV","parentId":"@@/global-layout"},"graphs/ANTVCharts/SpiderAntV":{"path":"graphs/ANTVCharts/SpiderAntV","id":"graphs/ANTVCharts/SpiderAntV","parentId":"@@/global-layout"},"graphs/GoogleCharts/BarChart":{"path":"graphs/GoogleCharts/BarChart","id":"graphs/GoogleCharts/BarChart","parentId":"@@/global-layout"},"graphs/GoogleCharts/PieChart":{"path":"graphs/GoogleCharts/PieChart","id":"graphs/GoogleCharts/PieChart","parentId":"@@/global-layout"},"schemaPage/schemaGraph/Chord":{"path":"schemaPage/schemaGraph/Chord","id":"schemaPage/schemaGraph/Chord","parentId":"@@/global-layout"},"SparqlPage/VisOptions/index":{"path":"SparqlPage/VisOptions","id":"SparqlPage/VisOptions/index","parentId":"@@/global-layout"},"graphs/ANTVCharts/ChordAntV":{"path":"graphs/ANTVCharts/ChordAntV","id":"graphs/ANTVCharts/ChordAntV","parentId":"@@/global-layout"},"graphs/GoogleCharts/TreeMap":{"path":"graphs/GoogleCharts/TreeMap","id":"graphs/GoogleCharts/TreeMap","parentId":"@@/global-layout"},"graphs/ANTVCharts/TreeAntV":{"path":"graphs/ANTVCharts/TreeAntV","id":"graphs/ANTVCharts/TreeAntV","parentId":"@@/global-layout"},"graphs/GoogleCharts/GeoMap":{"path":"graphs/GoogleCharts/GeoMap","id":"graphs/GoogleCharts/GeoMap","parentId":"@@/global-layout"},"graphs/ANTVCharts/utils":{"path":"graphs/ANTVCharts/utils","id":"graphs/ANTVCharts/utils","parentId":"@@/global-layout"},"reducer/databaseReducer":{"path":"reducer/databaseReducer","id":"reducer/databaseReducer","parentId":"@@/global-layout"},"Repositories/index":{"path":"Repositories","id":"Repositories/index","parentId":"@@/global-layout"},"SparqlPage/sparqly":{"path":"SparqlPage/sparqly","id":"SparqlPage/sparqly","parentId":"@@/global-layout"},"graphs/CirclePack":{"path":"graphs/CirclePack","id":"graphs/CirclePack","parentId":"@@/global-layout"},"graphs/LinkedNode":{"path":"graphs/LinkedNode","id":"graphs/LinkedNode","parentId":"@@/global-layout"},"SparqlPage/index":{"path":"SparqlPage","id":"SparqlPage/index","parentId":"@@/global-layout"},"schemaPage/index":{"path":"schemaPage","id":"schemaPage/index","parentId":"@@/global-layout"},"graphs/PackGPT":{"path":"graphs/PackGPT","id":"graphs/PackGPT","parentId":"@@/global-layout"},"graphs/index":{"path":"graphs","id":"graphs/index","parentId":"@@/global-layout"},"graphs/types":{"path":"graphs/types","id":"graphs/types","parentId":"@@/global-layout"},"services/api":{"path":"services/api","id":"services/api","parentId":"@@/global-layout"},"dashBoard":{"path":"dashBoard","id":"dashBoard","parentId":"@@/global-layout"},"service":{"path":"service","id":"service","parentId":"@@/global-layout"},"index":{"path":"/","id":"index","parentId":"@@/global-layout"},"docs":{"path":"docs","id":"docs","parentId":"@@/global-layout"},"rdf":{"path":"rdf","id":"rdf","parentId":"@@/global-layout"},"@@/global-layout":{"id":"@@/global-layout","path":"/","isLayout":true}} as const;
  return {
    routes,
    routeComponents: {
'404': React.lazy(() => import(/* webpackChunkName: "src__pages__404" */'../../../src/pages/404.tsx')),
'SparqlPage/ConceptualModel/function': React.lazy(() => import(/* webpackChunkName: "src__pages__SparqlPage__ConceptualModel__function" */'../../../src/pages/SparqlPage/ConceptualModel/function.ts')),
'graphs/ANTVCharts/ChoroplethMapAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__ChoroplethMapAntV" */'../../../src/pages/graphs/ANTVCharts/ChoroplethMapAntV.tsx')),
'graphs/ANTVCharts/CirclePackingAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__CirclePackingAntV" */'../../../src/pages/graphs/ANTVCharts/CirclePackingAntV.tsx')),
'graphs/ANTVCharts/GroupedColumnAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__GroupedColumnAntV" */'../../../src/pages/graphs/ANTVCharts/GroupedColumnAntV.tsx')),
'graphs/ANTVCharts/StackedColumnAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__StackedColumnAntV" */'../../../src/pages/graphs/ANTVCharts/StackedColumnAntV.tsx')),
'graphs/ANTVCharts/multipleLineChart': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__multipleLineChart" */'../../../src/pages/graphs/ANTVCharts/multipleLineChart.tsx')),
'SparqlPage/ConceptualModel/service': React.lazy(() => import(/* webpackChunkName: "src__pages__SparqlPage__ConceptualModel__service" */'../../../src/pages/SparqlPage/ConceptualModel/service.ts')),
'components/DashBoardUtilComponents': React.lazy(() => import(/* webpackChunkName: "src__pages__components__DashBoardUtilComponents" */'../../../src/pages/components/DashBoardUtilComponents.tsx')),
'graphs/ANTVCharts/BubbleChartAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__BubbleChartAntV" */'../../../src/pages/graphs/ANTVCharts/BubbleChartAntV.tsx')),
'graphs/ANTVCharts/ColumnChartAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__ColumnChartAntV" */'../../../src/pages/graphs/ANTVCharts/ColumnChartAntV.tsx')),
'graphs/ANTVCharts/ScatterPlotAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__ScatterPlotAntV" */'../../../src/pages/graphs/ANTVCharts/ScatterPlotAntV.tsx')),
'SparqlPage/ConceptualModel/regex': React.lazy(() => import(/* webpackChunkName: "src__pages__SparqlPage__ConceptualModel__regex" */'../../../src/pages/SparqlPage/ConceptualModel/regex.js')),
'graphs/ANTVCharts/GroupedBarAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__GroupedBarAntV" */'../../../src/pages/graphs/ANTVCharts/GroupedBarAntV.tsx')),
'graphs/ANTVCharts/StackedBarAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__StackedBarAntV" */'../../../src/pages/graphs/ANTVCharts/StackedBarAntV.tsx')),
'graphs/ANTVCharts/LineChartAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__LineChartAntV" */'../../../src/pages/graphs/ANTVCharts/LineChartAntV.tsx')),
'graphs/ANTVCharts/WordCloudAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__WordCloudAntV" */'../../../src/pages/graphs/ANTVCharts/WordCloudAntV.tsx')),
'graphs/GoogleCharts/ScatterPlot': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__GoogleCharts__ScatterPlot" */'../../../src/pages/graphs/GoogleCharts/ScatterPlot.tsx')),
'graphs/ANTVCharts/BarChartAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__BarChartAntV" */'../../../src/pages/graphs/ANTVCharts/BarChartAntV.tsx')),
'graphs/ANTVCharts/CalendarAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__CalendarAntV" */'../../../src/pages/graphs/ANTVCharts/CalendarAntV.tsx')),
'graphs/ANTVCharts/PieChartAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__PieChartAntV" */'../../../src/pages/graphs/ANTVCharts/PieChartAntV.tsx')),
'graphs/ANTVCharts/SunBurstAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__SunBurstAntV" */'../../../src/pages/graphs/ANTVCharts/SunBurstAntV.tsx')),
'graphs/ANTVCharts/HeatmapAntv': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__HeatmapAntv" */'../../../src/pages/graphs/ANTVCharts/HeatmapAntv.tsx')),
'graphs/ANTVCharts/NetworkAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__NetworkAntV" */'../../../src/pages/graphs/ANTVCharts/NetworkAntV.tsx')),
'graphs/ANTVCharts/TreeMapAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__TreeMapAntV" */'../../../src/pages/graphs/ANTVCharts/TreeMapAntV.tsx')),
'graphs/GoogleCharts/LineChart': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__GoogleCharts__LineChart" */'../../../src/pages/graphs/GoogleCharts/LineChart.tsx')),
'schemaPage/queryFactory/index': React.lazy(() => import(/* webpackChunkName: "src__pages__schemaPage__queryFactory__index" */'../../../src/pages/schemaPage/queryFactory/index.tsx')),
'SparqlPage/codeMirrorConfigs': React.lazy(() => import(/* webpackChunkName: "src__pages__SparqlPage__codeMirrorConfigs" */'../../../src/pages/SparqlPage/codeMirrorConfigs.ts')),
'graphs/ANTVCharts/SankeyAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__SankeyAntV" */'../../../src/pages/graphs/ANTVCharts/SankeyAntV.tsx')),
'graphs/ANTVCharts/SpiderAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__SpiderAntV" */'../../../src/pages/graphs/ANTVCharts/SpiderAntV.tsx')),
'graphs/GoogleCharts/BarChart': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__GoogleCharts__BarChart" */'../../../src/pages/graphs/GoogleCharts/BarChart.tsx')),
'graphs/GoogleCharts/PieChart': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__GoogleCharts__PieChart" */'../../../src/pages/graphs/GoogleCharts/PieChart.tsx')),
'schemaPage/schemaGraph/Chord': React.lazy(() => import(/* webpackChunkName: "src__pages__schemaPage__schemaGraph__Chord" */'../../../src/pages/schemaPage/schemaGraph/Chord.tsx')),
'SparqlPage/VisOptions/index': React.lazy(() => import(/* webpackChunkName: "src__pages__SparqlPage__VisOptions__index" */'../../../src/pages/SparqlPage/VisOptions/index.tsx')),
'graphs/ANTVCharts/ChordAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__ChordAntV" */'../../../src/pages/graphs/ANTVCharts/ChordAntV.tsx')),
'graphs/GoogleCharts/TreeMap': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__GoogleCharts__TreeMap" */'../../../src/pages/graphs/GoogleCharts/TreeMap.tsx')),
'graphs/ANTVCharts/TreeAntV': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__TreeAntV" */'../../../src/pages/graphs/ANTVCharts/TreeAntV.tsx')),
'graphs/GoogleCharts/GeoMap': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__GoogleCharts__GeoMap" */'../../../src/pages/graphs/GoogleCharts/GeoMap.tsx')),
'graphs/ANTVCharts/utils': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__ANTVCharts__utils" */'../../../src/pages/graphs/ANTVCharts/utils.tsx')),
'reducer/databaseReducer': React.lazy(() => import(/* webpackChunkName: "src__pages__reducer__databaseReducer" */'../../../src/pages/reducer/databaseReducer.ts')),
'Repositories/index': React.lazy(() => import(/* webpackChunkName: "src__pages__Repositories__index" */'../../../src/pages/Repositories/index.tsx')),
'SparqlPage/sparqly': React.lazy(() => import(/* webpackChunkName: "src__pages__SparqlPage__sparqly" */'../../../src/pages/SparqlPage/sparqly.tsx')),
'graphs/CirclePack': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__CirclePack" */'../../../src/pages/graphs/CirclePack.tsx')),
'graphs/LinkedNode': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__LinkedNode" */'../../../src/pages/graphs/LinkedNode.tsx')),
'SparqlPage/index': React.lazy(() => import(/* webpackChunkName: "src__pages__SparqlPage__index" */'../../../src/pages/SparqlPage/index.tsx')),
'schemaPage/index': React.lazy(() => import(/* webpackChunkName: "src__pages__schemaPage__index" */'../../../src/pages/schemaPage/index.tsx')),
'graphs/PackGPT': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__PackGPT" */'../../../src/pages/graphs/PackGPT.tsx')),
'graphs/index': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__index" */'../../../src/pages/graphs/index.tsx')),
'graphs/types': React.lazy(() => import(/* webpackChunkName: "src__pages__graphs__types" */'../../../src/pages/graphs/types.ts')),
'services/api': React.lazy(() => import(/* webpackChunkName: "src__pages__services__api" */'../../../src/pages/services/api.ts')),
'dashBoard': React.lazy(() => import(/* webpackChunkName: "src__pages__dashBoard" */'../../../src/pages/dashBoard.tsx')),
'service': React.lazy(() => import(/* webpackChunkName: "src__pages__service" */'../../../src/pages/service.ts')),
'index': React.lazy(() => import(/* webpackChunkName: "src__pages__index" */'../../../src/pages/index.tsx')),
'docs': React.lazy(() => import(/* webpackChunkName: "src__pages__docs" */'../../../src/pages/docs.tsx')),
'rdf': React.lazy(() => import(/* webpackChunkName: "src__pages__rdf" */'../../../src/pages/rdf.tsx')),
'@@/global-layout': React.lazy(() => import(/* webpackChunkName: "layouts__index" */'/Users/may3131/Files/FYP/Sparqly/src/layouts/index.tsx')),
},
  };
}
