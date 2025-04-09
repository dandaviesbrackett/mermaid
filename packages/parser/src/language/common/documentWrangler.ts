import type { LangiumCoreServices, ParseResult } from 'langium';
import { DocumentState, URI } from 'langium';
import type { DiagramAST } from '../../parse.js';

export class CommonDocumentWrangler {
  private fakedURI: URI = URI.from({ scheme: 'mermaid', fragment: '#' });
  public async parse<T extends DiagramAST>(
    input: string,
    services: LangiumCoreServices
  ): Promise<ParseResult<T>> {
    //create a document from the input string. document begins in the Parsed state.
    const doc = services.shared.workspace.LangiumDocumentFactory.fromString<T>(
      input,
      this.fakedURI
    );
    //push the document through the LangiumDocument state cycle
    const references = services.references;
    const indexManager = services.shared.workspace.IndexManager;

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
