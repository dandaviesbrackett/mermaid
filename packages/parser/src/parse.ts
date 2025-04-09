import type { ParseResult } from 'langium';

import type { Info, Packet, Pie, Architecture, GitGraph, Radar, Tubemap } from './index.js';

export type DiagramAST = Info | Packet | Pie | Architecture | GitGraph | Radar | Tubemap;

interface DoesAsyncParsing {
  parse<T extends DiagramAST>(input: string): Promise<ParseResult<T>>;
}

const parsers: Record<string, DoesAsyncParsing> = {};
const initializers = {
  info: async () => {
    const services = (await import('./language/info/index.js')).createInfoServices().Info;
    const parser = services.wrangler.DocumentWrangler;
    parsers.info = { parse: (input: string) => parser.parse(input, services) };
  },
  packet: async () => {
    const services = (await import('./language/packet/index.js')).createPacketServices().Packet;
    const parser = services.wrangler.DocumentWrangler;
    parsers.packet = { parse: (input: string) => parser.parse(input, services) };
  },
  pie: async () => {
    const services = (await import('./language/pie/index.js')).createPieServices().Pie;
    const parser = services.wrangler.DocumentWrangler;
    parsers.pie = { parse: (input: string) => parser.parse(input, services) };
  },
  architecture: async () => {
    const services = (await import('./language/architecture/index.js')).createArchitectureServices()
      .Architecture;
    const parser = services.wrangler.DocumentWrangler;
    parsers.architecture = { parse: (input: string) => parser.parse(input, services) };
  },
  gitGraph: async () => {
    const services = (await import('./language/gitGraph/index.js')).createGitGraphServices()
      .GitGraph;
    const parser = services.wrangler.DocumentWrangler;
    parsers.gitGraph = { parse: (input: string) => parser.parse(input, services) };
  },
  radar: async () => {
    const services = (await import('./language/radar/index.js')).createRadarServices().Radar;
    const parser = services.wrangler.DocumentWrangler;
    parsers.radar = { parse: (input: string) => parser.parse(input, services) };
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
