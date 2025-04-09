import { describe, expect, it } from 'vitest';

import { Tubemap, StopDef, isStopDef } from '../src/language/generated/ast.js';
import { expectNoErrorsOrAlternatives, tubeMapParse as parse } from './test-util.js';

describe('tubemap', () => {
  it.each([
    `tubemap-beta`,
    `  tubemap-beta  `,
    `\ttubemap-beta\t`,
    `
    \ttubemap-beta
    `,
  ])('should handle empty tubemap with various whitespace', async (context: string) => {
    const result = await parse(context);
    expectNoErrorsOrAlternatives(result);
    expect(result.value.$type).toBe(Tubemap);
  });
  describe('should handle stops', () => {
    it.each([`stop one`, `stop one as "Stop One"`, `stop one as 'Stop One'`])(
      'should handle a single stop',
      async (context: string) => {
        const result = await parse(`tubemap-beta\n${context}`);
        expectNoErrorsOrAlternatives(result);
        expect(result.value.$type).toBe(Tubemap);

        const { stops } = result.value;
        expect(stops).toHaveLength(1);
        expect(stops[0].$type).toBe(StopDef);
        expect(stops[0].name).toBe('one');
      }
    );
    it.each([
      `stop one
        stop two`,
      `stop one as "Stop One"
        stop two`,
      `stop one as 'Stop One'
        stop two as 'Stop Two'`,
    ])('should handle multiple stops with and without labels', async (context: string) => {
      const result = await parse(`tubemap-beta\n${context}`);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(Tubemap);

      const { stops } = result.value;
      expect(stops).toHaveLength(2);
      expect(stops.every((stop) => stop.$type === StopDef)).toBe(true);
      expect(stops[0].name).toBe('one');
      expect(stops[1].name).toBe('two');
    });
  });
  describe('should handle lines', () => {
    it.each([
      { line: `line one [stop l1s1]`, len: 1 },
      { line: `line one as "line one" [stop l1s1]`, len: 1 },
      { line: `line one [stop l1s1], [stop l1s2]`, len: 2 },
      { line: `line one [stop l1s1], [stop l1s2 as "line one stop two"]`, len: 2 },
    ])('should handle a single line with inline stops', async ({ line, len }) => {
      const result = await parse(`tubemap-beta\n${line}`);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(Tubemap);

      const { lines } = result.value;
      expect(lines).toHaveLength(1);
      const lineStops = lines[0].stops;
      expect(lineStops).toHaveLength(len);
    });
    it.each([
      { line: `line one [stop l1s1]`, len: 1 },
      { line: `line one as "line one" [stop l1s1]`, len: 1 },
      { line: `line one [stop l1s1], [stop l1s2]`, len: 2 },
      { line: `line one [stop l1s1], [stop l1s2 as "line one stop two"]`, len: 2 },
      /*{ TODO uncomment when the grammar supports newlines in line stop-lists
        line: `line one
        [stop l1s1],
        [stop l1s2 as "line one stop two"]`,
        len: 2,
      },*/
    ])('should handle a single line with inline stops', async ({ line, len }) => {
      const result = await parse(`tubemap-beta\n${line}`);
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(Tubemap);

      const { lines } = result.value;
      expect(lines).toHaveLength(1);
      const lineStops = lines[0].stops;
      expect(lineStops).toHaveLength(len);
      const lineStop = lineStops[0];
      if (isStopDef(lineStop)) {
        expect(lineStop.name).toBe('l1s1');
      } else {
        assert.fail('unexpected reference in line');
      }
    });
    it('should handle a line with a stop reference', async () => {
      const result = await parse(
        `tubemap-beta
        stop one
        line one one`
      );
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(Tubemap);
      const { stops, lines } = result.value;
      expect(stops).toHaveLength(1);
      expect(lines).toHaveLength(1);
      const lineStops = lines[0].stops;
      expect(lineStops).toHaveLength(1);
      if (isStopDef(lineStops[0])) {
        assert.fail('should have been a reference');
      } else {
        expect(lineStops[0].ref).toBe(stops[0]);
      }
    });
    it('should handle a line with both a stop reference and an inline stop', async () => {
      const result = await parse(
        `tubemap-beta
        stop one as "s1common"
        line one [stop "l1s1i"], one`
      );
      expectNoErrorsOrAlternatives(result);
      expect(result.value.$type).toBe(Tubemap);
      const { stops, lines } = result.value;
      expect(stops).toHaveLength(1);
      expect(lines).toHaveLength(1);
      const lineStops = lines[0].stops;
      expect(lineStops).toHaveLength(2);
      for (const ls of lineStops) {
        if (isStopDef(ls)) {
          expect(ls.name).toBe('l1s1i');
        } else {
          expect(ls.ref).toBe(stops[0]);
        }
      }
    });
  });
});
