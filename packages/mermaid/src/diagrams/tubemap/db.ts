import { getConfig as commonGetConfig } from '../../config.js';
import type { TubemapDiagramConfig } from '../../config.type.js';
import DEFAULT_CONFIG from '../../defaultConfig.js';
import { cleanAndMerge } from '../../utils.js';
import {
  clear as commonClear,
  getAccDescription,
  getAccTitle,
  getDiagramTitle,
  setAccDescription,
  setAccTitle,
  setDiagramTitle,
} from '../common/commonDb.js';
import type { TubemapDB, TubemapData, TubemapStop, TubemapLine } from './types.ts';

const defaultTubemapData: TubemapData = {
  stops: [],
  lines: [],
};

let data: TubemapData = structuredClone(defaultTubemapData);

const DEFAULT_TUBEMAP_CONFIG: Required<TubemapDiagramConfig> = DEFAULT_CONFIG.tubemap;

const getConfig = (): Required<TubemapDiagramConfig> => {
  const config = cleanAndMerge({
    ...DEFAULT_TUBEMAP_CONFIG,
    ...commonGetConfig().tubemap,
  });

  return config;
};

const getStops = (): TubemapStop[] => data.stops;
const getLines = (): TubemapLine[] => data.lines;

const setStops = (stops: TubemapStop[]) => (data.stops = stops);
const setLines = (lines: TubemapLine[]) => (data.lines = lines);

const clear = () => {
  commonClear();
  data = structuredClone(defaultTubemapData);
};

export const db: TubemapDB = {
  setStops,
  setLines,
  getStops,
  getLines,
  getConfig,
  clear,
  setAccTitle,
  getAccTitle,
  setDiagramTitle,
  getDiagramTitle,
  getAccDescription,
  setAccDescription,
};
