import React, { useContext, useEffect, useState, useRef } from 'react';
import { SparqlContext } from '../SparqlContext';
import { Button, Dialog, DialogActions, DialogContent, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import BarChart from '../../pages/graphs/GoogleCharts/BarChart';
import PieChart from '../../pages/graphs/GoogleCharts/PieChart';
import BarChartAntV from '@/pages/graphs/ANTVCharts/BarChartAntV';
import BubbleChartAntV from '@/pages/graphs/ANTVCharts/BubbleChartAntV';
import CalendarChart from '@/pages/graphs/ANTVCharts/CalendarAntV';
import ChordAntV from '@/pages/graphs/ANTVCharts/ChordAntV';
import CirclePackingAntV from '@/pages/graphs/ANTVCharts/CirclePackingAntV';
import ColumnChartAntV from '@/pages/graphs/ANTVCharts/ColumnChartAntV';
import GroupedBarChart from '@/pages/graphs/ANTVCharts/GroupedBarAntV';
import GroupedColumnChart from '@/pages/graphs/ANTVCharts/GroupedColumnAntV';
import HeatmapAntV from '@/pages/graphs/ANTVCharts/HeatmapAntv';
import LineChartAntV from '@/pages/graphs/ANTVCharts/LineChartAntV';
import NetworkChart from '@/pages/graphs/ANTVCharts/NetworkAntV';
import PieChartAntV from '@/pages/graphs/ANTVCharts/PieChartAntV';
import SankeyAntV from '@/pages/graphs/ANTVCharts/SankeyAntV';
import ScatterPlotAntV from '@/pages/graphs/ANTVCharts/ScatterPlotAntV';
import SpiderChart from '@/pages/graphs/ANTVCharts/SpiderAntV';
import StackedBarChart from '@/pages/graphs/ANTVCharts/StackedBarAntV';
import StackedColumnChart from '@/pages/graphs/ANTVCharts/StackedColumnAntV';
import SunBurst from '@/pages/graphs/ANTVCharts/SunBurstAntV';
import TreeAntV from '@/pages/graphs/ANTVCharts/TreeAntV';
import TreeMapAntV from '@/pages/graphs/ANTVCharts/TreeMapAntV';
import WordCloudAntV from '@/pages/graphs/ANTVCharts/WordCloudAntV';
import MultipleLineChart from '@/pages/graphs/ANTVCharts/multipleLineChart';
import GeoMap from '@/pages/graphs/GoogleCharts/GeoMap';
import LineChart from '@/pages/graphs/GoogleCharts/LineChart';
import ScatterPlot from '@/pages/graphs/GoogleCharts/ScatterPlot';
import TreeMap from '@/pages/graphs/GoogleCharts/TreeMap';
import html2canvas from 'html2canvas';
import { ChartType } from '../../pages/SparqlPage/VisOptions';

const VisualComponent = () => {
  const { sparqlResult, recommendations, excludedRecommendations } = useContext(SparqlContext);
  const [openVis, setOpenVis] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState(null);
  const [openMoreDialog, setOpenMoreDialog] = useState(false);
  const [thumbnails, setThumbnails] = useState({});
  const chartRefs = useRef({});
  const hiddenContainerRef = useRef();

  const handleVisOpen = (ChartType) => {
    setSelectedChartType(ChartType);
    setOpenVis(true);
  };

  const handleVisClose = () => {
    setOpenVis(false);
  };

  const handleMoreOpen = () => {
    setOpenMoreDialog(true);
  };

  const handleMoreClose = () => {
    setOpenMoreDialog(false);
  };

  const separateHeader_Data = (dataSource) => {
    if (!dataSource || dataSource.length === 0) {
      return { headers: [], data: [] };
    }
    const headers = [];
    const firstRow = dataSource[0];
    const keys = Object.keys(firstRow);
    for (const key of keys) {
      headers.push(key);
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
          typeof value === 'string' &&
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

    return { headers, data };
  };

  const { headers, data } = separateHeader_Data(sparqlResult);

  const renderChart = (chartType, data) => {
    switch (chartType) {
      case ChartType.BAR_CHART:
        return <BarChart headers={headers} data={data} />;
      case ChartType.PIE_CHART:
        return <PieChart headers={headers} data={data} />;
      case ChartType.SCATTER_PLOT:
        return <ScatterPlot headers={headers} data={data} />;
      case ChartType.LINE_CHART:
        return <LineChart headers={headers} data={data} />;
      case ChartType.TREE_MAP:
        return <TreeMap headers={headers} data={data} />;
      case ChartType.BAR_CHART_ANTV:
        return <BarChartAntV headers={headers} data={sparqlResult} />;
      case ChartType.PIE_CHART_ANTV:
        return <PieChartAntV headers={headers} data={sparqlResult} />;
      case ChartType.COLUMN_CHART_ANTV:
        return <ColumnChartAntV headers={headers} data={sparqlResult} />;
      case ChartType.LINE_CHART_ANTV:
        return <LineChartAntV headers={headers} data={sparqlResult} />;
      case ChartType.MULTI_LINE_CHART:
        return <MultipleLineChart headers={headers} data={sparqlResult} />;
      case ChartType.STACKED_COLUMN_CHART_ANTV:
        return <StackedColumnChart headers={headers} data={sparqlResult} />;
      case ChartType.GROUPED_COLUMN_CHART_ANTV:
        return <GroupedColumnChart headers={headers} data={sparqlResult} />;
      case ChartType.STACKED_BAR_CHART_ANTV:
        return <StackedBarChart headers={headers} data={sparqlResult} />;
      case ChartType.GROUPED_BAR_CHART_ANTV:
        return <GroupedBarChart headers={headers} data={sparqlResult} />;
      case ChartType.SCATTER_PLOT_ANTV:
        return <ScatterPlotAntV headers={headers} data={sparqlResult} />;
      case ChartType.TREE_MAP_ANTV:
        return <TreeMapAntV headers={headers} data={sparqlResult} />;
      case ChartType.CHORD_DIAGRAM_ANTV:
        return <ChordAntV headers={headers} data={sparqlResult} />;
      case ChartType.BUBBLE_CHART_ANTV:
        return <BubbleChartAntV headers={headers} data={sparqlResult} />;
      case ChartType.WORD_CLOUDS_ANTV:
        return <WordCloudAntV headers={headers} data={sparqlResult} />;
      case ChartType.TREE_ANTV:
        return <TreeAntV headers={headers} data={sparqlResult} />;
      case ChartType.CIRCLE_PACKING_ANTV:
        return <CirclePackingAntV headers={headers} data={sparqlResult} />;
      case ChartType.SUNBURST_ANTV:
        return <SunBurst headers={headers} data={sparqlResult} />;
      case ChartType.SANKEY_ANTV:
        return <SankeyAntV headers={headers} data={sparqlResult} />;
      case ChartType.CALENDAR_ANTV:
        return <CalendarChart headers={headers} data={sparqlResult} />;
      case ChartType.SPIDER_CHART_ANTV:
        return <SpiderChart headers={headers} data={sparqlResult} />;
      case ChartType.HEATMAP_ANTV:
        return <HeatmapAntV headers={headers} data={sparqlResult} />;
      case ChartType.NETWORK_ANTV:
        return <NetworkChart headers={headers} data={sparqlResult} />;
      case ChartType.CHOROPLETH_MAP:
        return <GeoMap headers={headers} data={data} />;
      default:
        return <Typography>No chart available for the selected type.</Typography>;
    }
  };

  const captureThumbnails = async () => {
    const allRecommendations = [...recommendations, ...excludedRecommendations];
    for (const rec of allRecommendations) {
      const chartType = rec.chart;
      const chartElement = chartRefs.current[chartType];
      if (chartElement) {
        const canvas = await html2canvas(chartElement, {
          width: 400,  // 设置你想要的宽度
          height: 300, // 设置你想要的高度
          scale: 1,    // 设置比例
          windowWidth: chartElement.scrollWidth,
          windowHeight: chartElement.scrollHeight
        });
        const dataUrl = canvas.toDataURL();
        setThumbnails((prev) => ({ ...prev, [chartType]: dataUrl }));
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      captureThumbnails();
    }, 1000); // 延迟1秒，确保图表完全渲染
  }, [recommendations, excludedRecommendations]);

  const renderChartPreview = (chartType, index) => {
    return (
      <Grid item key={index} xs={12} sm={6} md={4}>
        {thumbnails[chartType] ? (
          <Button
            onClick={() => handleVisOpen(chartType)}
            style={{
              width: '100%',
              height: '100%',
              padding: 0,
              border: 'none',
              background: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <img
              src={thumbnails[chartType]}
              alt={`${chartType} thumbnail`}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </Button>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Grid>
    );
  };

  return (
    <div>
      <div ref={hiddenContainerRef} style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        {[...recommendations, ...excludedRecommendations].map((rec, index) => (
          <div key={index} ref={(el) => (chartRefs.current[rec.chart] = el)}>
            {renderChart(rec.chart, data)}
          </div>
        ))}
      </div>

      <Grid container spacing={2}>
        {recommendations.slice(0, 3).map((rec, index) =>
          renderChartPreview(rec.chart, index)
        )}
      </Grid>
      {recommendations.length + excludedRecommendations.length > 3 && (
        <Button variant="contained" color="primary" onClick={handleMoreOpen}>
          More
        </Button>
      )}
      <Dialog open={openVis} onClose={handleVisClose} maxWidth="lg" fullWidth>
        <DialogContent>
          {selectedChartType && renderChart(selectedChartType, data)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVisClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openMoreDialog} onClose={handleMoreClose} maxWidth="lg" fullWidth>
        <DialogContent>
          <List>
            {[...recommendations.slice(3), ...excludedRecommendations].map((rec, index) => (
              <ListItem button key={index} onClick={() => handleVisOpen(rec.chart)}>
                <ListItemText primary={rec.chart} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMoreClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {data.length === 0 && (
        <Typography variant="h6" color="textSecondary" align="center">
          No data available to display.
        </Typography>
      )}

      {/* 显示推荐和排除的推荐 */}
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

      <h2>Excluded Recommendations</h2>
      {excludedRecommendations && excludedRecommendations.length > 0 ? (
        <ul>
          {excludedRecommendations.map((rec, index) => (
            <li key={index}>{rec.chart} - Rating: {rec.rating}</li>
          ))}
        </ul>
      ) : (
        <p>No excluded recommendations available.</p>
      )}
    </div>
  );
};

export default VisualComponent;
