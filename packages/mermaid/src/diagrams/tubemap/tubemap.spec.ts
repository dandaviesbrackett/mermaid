import { it, describe, expect } from 'vitest';
import { db } from './db.js';
import { parser } from './parser.js';

import type { Tubemap } from '@mermaid-js/parser';
import type { ArrayElement } from '../../types.js';

const { clear, getLines, getStops, getDiagramTitle, getAccTitle, getAccDescription } = db;

type Stop = ArrayElement<ArrayElement<Tubemap['lines']>['stops']>;

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

  it('should handle a diagram with data and title', async () => {
    const str = `tubemap-beta 
  title Tubemap diagram
  accTitle: Tubemap accTitle
  accDescr: Tubemap accDescription
  stop one 
    `;
    await expect(parser.parse(str)).resolves.not.toThrow();
    expect(getLines()).toMatchInlineSnapshot('[]');
    expect(getDiagramTitle()).toMatchInlineSnapshot('"Tubemap diagram"');
    expect(getAccTitle()).toMatchInlineSnapshot('"Tubemap accTitle"');
    expect(getAccDescription()).toMatchInlineSnapshot('"Tubemap accDescription"');
    expect(getStops()).toHaveLength(1);
    expect(getStops()[0]).toMatchObject({ name: 'one' });
  });

  it('should handle a diagram with multiple stops', async () => {
    const str = `tubemap-beta
    stop one
    stop two
    stop three
    `;
    await expect(parser.parse(str)).resolves.not.toThrow();
    expect(getLines()).toMatchInlineSnapshot('[]');

    expect(getStops()).toHaveLength(3);
    expect(getStops()[0]).toMatchObject({ name: 'one' });
    expect(getStops()[1]).toMatchObject({ name: 'two' });
    expect(getStops()[2]).toMatchObject({ name: 'three' });
  });

  it('should handle a diagram with stops with labels', async () => {
    const str = `tubemap-beta
    stop one as 'stop one with single quotes'
    stop two as "stop two with double quotes"
    stop three as "第三站"
    stop four as "stop numéro quatre"
    `;
    await expect(parser.parse(str)).resolves.not.toThrow();
    expect(getLines()).toMatchInlineSnapshot('[]');

    const stops = getStops();
    expect(stops).toHaveLength(4);
    expect(stops[0]).toMatchObject({ name: 'one', label: 'stop one with single quotes' });
    expect(stops[1]).toMatchObject({ name: 'two', label: 'stop two with double quotes' });
    expect(stops[2]).toMatchObject({ name: 'three', label: '第三站' });
    expect(stops[3]).toMatchObject({ name: 'four', label: 'stop numéro quatre' });
  });

  it('should handle a diagram with a line with an inline stop', async () => {
    const str = `tubemap-beta
    line one [stop one]
    `;
    await expect(parser.parse(str)).resolves.not.toThrow();
    expect(getStops()).toMatchInlineSnapshot('[]');

    const lines = getLines();
    expect(lines).toHaveLength(1);
    const line = lines[0];
    expect(line.name).toMatch('one');
    expect(line.label).toBeUndefined();
    expect(line.stops).toHaveLength(1);
    const stop: any = line.stops[0];
    expect(stop.name).toMatch('one');
  });

  it('should handle a diagram with a line with inline stops', async () => {
    const str = `tubemap-beta
    line one [stop one], [stop two]
    `;
    await expect(parser.parse(str)).resolves.not.toThrow();
    expect(getStops()).toMatchInlineSnapshot('[]');

    const lines = getLines();
    expect(lines).toHaveLength(1);
    const line = lines[0];
    expect(line.name).toMatch('one');
    expect(line.label).toBeUndefined();
    expect(line.stops).toHaveLength(2);
    const stop1: any = line.stops[0];
    expect(stop1.name).toMatch('one');
    const stop2: any = line.stops[1];
    expect(stop2.name).toMatch('two');
  });

  it('should handle a diagram with lines with inline stops', async () => {
    const str = `tubemap-beta
    line one [stop one], [stop two]
    line two [stop one], [stop two]
    `;
    await expect(parser.parse(str)).resolves.not.toThrow();
    expect(getStops()).toMatchInlineSnapshot('[]');

    const lines = getLines();
    expect(lines).toHaveLength(2);
    for (const expected of [
      { pos: 0, name: 'one' },
      { pos: 1, name: 'two' },
    ]) {
      const line = lines[expected.pos];
      expect(line.name).toMatch(expected.name);
      expect(line.label).toBeUndefined();

      //stop verification: note that it's a "coincidence" that the two lines have stops that have the same names
      expect(line.stops).toHaveLength(2);
      expect(line.stops[0].name).toMatch('one');
      expect(line.stops[1].name).toMatch('two');
    }
  });

  it('should handle a diagram with both stops and lines', async () => {
    const str = `tubemap-beta
    stop one
    stop two as "Stop Two"

    line one [stop one], [stop two]
    line two [stop one], [stop two]
    `;
    await expect(parser.parse(str)).resolves.not.toThrow();
    const stops = getStops();
    const lines = getLines();
    expect(stops).toHaveLength(2);
    expect(lines).toHaveLength(2);
  });

  it('should handle a diagram with a line that references stops', async () => {
    const str = `tubemap-beta
    stop s1

    line l1 s1
    `;
    await expect(parser.parse(str)).resolves.not.toThrow();
    const stops = getStops();
    const lines = getLines();
    expect(stops).toHaveLength(1);
    expect(lines).toHaveLength(1);
    expect(lines[0].stops[0]).toMatchObject(stops[0]);
  });
});
