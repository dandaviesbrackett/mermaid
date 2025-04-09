import type { Tubemap } from '@mermaid-js/parser';
import type { TubemapDiagramConfig } from '../../config.type.js';
import type { DiagramDBBase } from '../../diagram-api/types.js';
import type { ArrayElement } from '../../types.js';

export type TubemapStop = ArrayElement<Tubemap['stops']>;
export type TubemapLine = ArrayElement<Tubemap['lines']>;

export interface TubemapDB extends DiagramDBBase<TubemapDiagramConfig> {
  setStops: (stops: TubemapStop[]) => void;
  setLines: (stops: TubemapLine[]) => void;
  getStops: () => TubemapStop[];
  getLines: () => TubemapLine[];
}

export interface TubemapStyleOptions {
  labelColor?: string;
  labelFontSize?: string;
  blockStrokeColor?: string;
  blockStrokeWidth?: string;
  blockFillColor?: string;
  titleColor?: string;
  titleFontSize?: string;
}

export interface TubemapData {
  stops: TubemapStop[];
  lines: TubemapLine[];
}
