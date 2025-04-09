import type { DiagramStylesProvider } from '../../diagram-api/types.js';
import { cleanAndMerge } from '../../utils.js';
import type { TubemapStyleOptions } from './types.js';

const defaultTubemapStyleOptions: TubemapStyleOptions = {
  labelColor: 'black',
  labelFontSize: '12px',
  titleColor: 'black',
  titleFontSize: '14px',
  blockStrokeColor: 'black',
  blockStrokeWidth: '1',
  blockFillColor: '#efefef',
};

export const styles: DiagramStylesProvider = ({
  Tubemap,
}: { Tubemap?: TubemapStyleOptions } = {}) => {
  const options = cleanAndMerge(defaultTubemapStyleOptions, Tubemap);

  return `
	.TubemapLabel {
		fill: ${options.labelColor};
		font-size: ${options.labelFontSize};
	}
	.TubemapTitle {
		fill: ${options.titleColor};
		font-size: ${options.titleFontSize};
	}
	.TubemapBlock {
		stroke: ${options.blockStrokeColor};
		stroke-width: ${options.blockStrokeWidth};
		fill: ${options.blockFillColor};
	}
	`;
};

export default styles;
