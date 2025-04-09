import type { Tubemap } from '@mermaid-js/parser';
import { parse } from '@mermaid-js/parser';
import type { ParserDefinition } from '../../diagram-api/types.js';
import { log } from '../../logger.js';
import { populateCommonDb } from '../common/populateCommonDb.js';
import { db } from './db.js';

const populate = (ast: Tubemap) => {
  populateCommonDb(ast, db);
  const { stops, lines } = ast;

  db.setStops(stops);
  db.setLines(lines);
};

export const parser: ParserDefinition = {
  parse: async (input: string): Promise<void> => {
    const ast: Tubemap = await parse('tubemap', input);
    log.debug(ast);
    populate(ast);
  },
};
