import type { ParseResult } from 'langium';

import type { Info, Packet, Pie, Architecture, GitGraph, Radar, Tubemap } from './index.js';

export type DiagramAST = Info | Packet | Pie | Architecture | GitGraph | Radar | Tubemap;

interface DoesAsyncParsing {
  parse<T extends DiagramAST>(input: string): Promise<ParseResult<T>>;
}

const parsers: Record<string, DoesAsyncParsing> = {};
const initializers = {
  info: async () => {
    const { createInfoServices } = await import('./language/info/index.js');
    const parser = createInfoServices().Info.parser.LangiumParser;
    parsers.info = { parse: (input: string) => Promise.resolve(parser.parse(input)) };
  },
  packet: async () => {
    const { createPacketServices } = await import('./language/packet/index.js');
    const parser = createPacketServices().Packet.parser.LangiumParser;
    parsers.packet = { parse: (input: string) => Promise.resolve(parser.parse(input)) };
  },
  pie: async () => {
    const { createPieServices } = await import('./language/pie/index.js');
    const parser = createPieServices().Pie.parser.LangiumParser;
    parsers.pie = { parse: (input: string) => Promise.resolve(parser.parse(input)) };
  },
  architecture: async () => {
    const { createArchitectureServices } = await import('./language/architecture/index.js');
    const parser = createArchitectureServices().Architecture.parser.LangiumParser;
    parsers.architecture = { parse: (input: string) => Promise.resolve(parser.parse(input)) };
  },
  gitGraph: async () => {
    const { createGitGraphServices } = await import('./language/gitGraph/index.js');
    const parser = createGitGraphServices().GitGraph.parser.LangiumParser;
    parsers.gitGraph = { parse: (input: string) => Promise.resolve(parser.parse(input)) };
  },
  radar: async () => {
    const { createRadarServices } = await import('./language/radar/index.js');
    const parser = createRadarServices().Radar.parser.LangiumParser;
    parsers.radar = { parse: (input: string) => Promise.resolve(parser.parse(input)) };
  },
  tubemap: async () => {
    const { createTubemapServices } = await import('./language/tubemap/index.js');
    const services = createTubemapServices().Tubemap;
    const parser = services.wrangler.DocumentWrangler;
    parsers.tubemap = { parse: (input: string) => parser.parse(input, services) };
  },
} as const;

export async function parse(diagramType: 'info', text: string): Promise<Info>;
export async function parse(diagramType: 'packet', text: string): Promise<Packet>;
export async function parse(diagramType: 'pie', text: string): Promise<Pie>;
export async function parse(diagramType: 'architecture', text: string): Promise<Architecture>;
export async function parse(diagramType: 'gitGraph', text: string): Promise<GitGraph>;
export async function parse(diagramType: 'radar', text: string): Promise<Radar>;
export async function parse(diagramType: 'tubemap', text: string): Promise<Tubemap>;

export async function parse<T extends DiagramAST>(
  diagramType: keyof typeof initializers,
  text: string
): Promise<T> {
  const initializer = initializers[diagramType];
  if (!initializer) {
    throw new Error(`Unknown diagram type: ${diagramType}`);
  }
  if (!parsers[diagramType]) {
    await initializer();
  }
  const asyncParser: DoesAsyncParsing = parsers[diagramType];

  const result: ParseResult<T> = await asyncParser.parse(text);
  if (result.lexerErrors.length > 0 || result.parserErrors.length > 0) {
    throw new MermaidParseError(result);
  }
  return result.value;
}

export class MermaidParseError extends Error {
  constructor(public result: ParseResult<DiagramAST>) {
    const lexerErrors: string = result.lexerErrors.map((err) => err.message).join('\n');
    const parserErrors: string = result.parserErrors.map((err) => err.message).join('\n');
    super(`Parsing failed: ${lexerErrors} ${parserErrors}`);
  }
}
