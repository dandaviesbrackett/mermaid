import { describe, expect, it } from 'vitest';

import { Tubemap } from '../src/language/index.js';
import { expectNoErrorsOrAlternatives, tubeMapParse as parse } from './test-util.js';

describe('tubemap', () => {
  it.each([
    `tubemap-beta`,
    `  tubemap-beta  `,
    `\ttubemap-beta\t`,
    `
    \ttubemap-beta
    `,
  ])('should handle empty tubemap with various whitespace', (context: string) => {
    const result = parse(context);
    expectNoErrorsOrAlternatives(result);
    expect(result.value.$type).toBe(Tubemap);
  });
});
