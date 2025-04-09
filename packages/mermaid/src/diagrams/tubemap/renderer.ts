import type { Diagram } from '../../Diagram.js';
//import type { TubemapDiagramConfig } from '../../config.type.js';
import type { DiagramRenderer, DrawDefinition, SVG } from '../../diagram-api/types.js';
import { selectSvgElement } from '../../rendering-util/selectSvgElement.js';
import { configureSvgSize } from '../../setupGraphViewbox.js';
import type { TubemapDB, TubemapStop, TubemapLine } from './types.js';

const draw: DrawDefinition = (_text, id, _version, diagram: Diagram) => {
  const db = diagram.db as TubemapDB;
  const config = db.getConfig();
  const stops: TubemapStop[] = db.getStops();
  const lines: TubemapLine[] = db.getLines();
  const title = db.getDiagramTitle();
  const svgHeight = 100; //TODO
  const svgWidth = 100; //TODO
  const svg: SVG = selectSvgElement(id);

  let stopCount = 0;
  let lineCount = 0;
  svg.attr('viewbox', `0 0 ${svgWidth} ${svgHeight}`);
  configureSvgSize(svg, svgHeight, svgWidth, config.useMaxWidth);

  for (const [_stop, _Tubemap] of stops.entries()) {
    stopCount += 1;
  }

  for (const [_line, _Tubemap] of lines.entries()) {
    lineCount += 1;
  }

  svg
    .append('text')
    .text(title)
    .attr('x', svgWidth / 2)
    .attr('y', svgHeight - 15)
    .attr('dominant-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .attr('class', 'TubemapTitle');

  svg
    .append('text')
    .text(`number of stops: ${stopCount}; number of lines: ${lineCount}`)
    .attr('x', svgWidth / 2)
    .attr('y', svgHeight - 85)
    .attr('dominant-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .attr('class', 'TubemapTitle');
};

export const renderer: DiagramRenderer = { draw };
