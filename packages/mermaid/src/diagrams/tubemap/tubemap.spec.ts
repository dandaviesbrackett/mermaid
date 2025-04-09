import { it, describe, expect } from 'vitest';
import { db } from './db.js';
import { parser } from './parser.js';

import type { Tubemap } from '@mermaid-js/parser';
import type { ArrayElement } from '../../types.js';

const { clear, getLines, getStops, getDiagramTitle, getAccTitle, getAccDescription } = db;

describe('tubemap diagrams', () => {
  beforeEach(() => {
    clear();
  });

  it('should handle a tubemap-beta definition', async () => {
    const str = `tubemap-beta`;
    await expect(parser.parse(str)).resolves.not.toThrow();
    expect(getLines()).toMatchInlineSnapshot('[]');
    expect(getStops()).toMatchInlineSnapshot('[]');
  });
});
