import * as Blockly from 'blockly/core';

export default Blockly.Theme.defineTheme('myTheme', {
  base: Blockly.Themes.Classic,
  blockStyles: {
    logic__blocks: {
      colourPrimary: '#a5745b',
      colourSecondary: '#dbc7bd',
      colourTertiary: '#845d49',
    },
    query_blocks: {
      colourPrimary: '#ff0000',
      colourSecondary: '#db0000',
      colourTertiary: '#a40000',
    },
    math_blocks: {
        colourPrimary: '#5C68A6',
        colourSecondary: '#5C68A6',
        colourTertiary: '#5C68A6',
      },
  },
  categoryStyles: {
    examples_category: {
      colour: '#D98B83',
    },
    basics_category: {
      colour: '#E5AA70',
    },
    math_category: {
      colour: '#F0D799',
    },
    logic_category: {
      colour: '#B2C9B0',
    },
    query_category: {
      colour: '#A7D0C1',
    },
    condition_category: {
      colour: '#A3B3D4',
    },
    variable_category: {
      colour: '#C8A7C9',
    },
    aggregate_category: {
      colour: '#E45555',
    },
    stored_blocks_category: {
      colour: '#FF6680',
    },
  },
  componentStyles: {
    'workspaceBackgroundColour': '#F9F9F9',
    'toolboxBackgroundColour': '#f9f9f9',
    'toolboxForegroundColour': '#000000',
    'flyoutBackgroundColour': '#00000f',
    'flyoutForegroundColour': '#000fff',
    'scrollbarColour': '#cccccc',
    'scrollbarOpacity': 0.5,
    'insertionMarkerColour': '#00408f',
    'insertionMarkerOpacity': 0.4,
    'markerColour': '#00ff00',
    'cursorColour': '#00ff00'
  },
  fontStyle: {
    'family': 'Arial, sans-serif',
    'weight': 'bold',
    'size': 10
  },
  startHats: true,
});
