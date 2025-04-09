import type {
  DiagramDetector,
  DiagramLoader,
  ExternalDiagramDefinition,
} from '../../diagram-api/types.js';

const id = 'tubemap';

const detector: DiagramDetector = (txt) => {
  return /^\s*tubemap-beta/.test(txt);
};

const loader: DiagramLoader = async () => {
  const { diagram } = await import('./diagram.js');
  return { id, diagram };
};

export const tubemap: ExternalDiagramDefinition = {
  id,
  detector,
  loader,
};
