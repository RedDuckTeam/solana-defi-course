import { defineMermaidSetup } from '@slidev/types'

// Mermaid on the course palette. Use at most one Mermaid diagram per slide;
// bespoke diagrams are Vue + SVG components in components/.
export default defineMermaidSetup(() => ({
  theme: 'base',
  themeVariables: {
    fontFamily: 'Archivo, ui-sans-serif, system-ui, sans-serif',
    fontSize: '15px',
    primaryColor: '#ffffff',
    primaryBorderColor: '#16223d',
    primaryTextColor: '#16223d',
    lineColor: '#3c4a63',
    secondaryColor: '#e9e2ff',
    tertiaryColor: '#e6ede2',
    edgeLabelBackground: '#f3f6f1',
    clusterBkg: '#e6ede2',
    clusterBorder: '#c5d8bf',
  },
}))
