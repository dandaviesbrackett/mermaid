import type { ParseResult } from 'langium';
import { DocumentState, URI } from 'langium';
import type { Tubemap } from '../generated/ast.js';
import type { TubemapServices } from './module.js';
import { createTubemapServices } from './module.js';

export class TubemapDocumentWrangler {
  private tubeMapServices: TubemapServices = createTubemapServices().Tubemap;
  private fakedURI: URI = URI.from({ scheme: 'mermaid', fragment: '#' });
  public async parse(input: string): Promise<ParseResult<Tubemap>> {
    //create a document from the input string. document begins in the Parsed state.
    const doc = this.tubeMapServices.shared.workspace.LangiumDocumentFactory.fromString<Tubemap>(
      input,
      this.fakedURI
    );
    //push the document through the LangiumDocument state cycle
    const references = this.tubeMapServices.references;
    const indexManager = this.tubeMapServices.shared.workspace.IndexManager;

    await indexManager.updateContent(doc);
    doc.state = DocumentState.IndexedContent;

    doc.precomputedScopes = await references.ScopeComputation.computeLocalScopes(doc);
    doc.state = DocumentState.ComputedScopes;

    await references.Linker.link(doc);
    doc.state = DocumentState.Linked;

    await indexManager.updateReferences(doc);
    doc.state = DocumentState.IndexedReferences;

    //Validation could be done here, but since Mermaid doesn't interact with the validation errors it's not done

    return doc.parseResult;
  }
}
