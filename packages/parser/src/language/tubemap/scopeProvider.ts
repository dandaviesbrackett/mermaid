import type {
  ReferenceInfo,
  Scope,
  ScopeProvider,
  LangiumCoreServices,
  AstNodeDescriptionProvider,
} from 'langium';
import { AstUtils, MapScope, EMPTY_SCOPE } from 'langium';
import { isStopDef, isTubemap } from '../generated/ast.js';

export class TubemapScopeProvider implements ScopeProvider {
  private astNodeDescriptionProvider: AstNodeDescriptionProvider;
  constructor(services: LangiumCoreServices) {
    //get some helper services
    this.astNodeDescriptionProvider = services.workspace.AstNodeDescriptionProvider;
  }
  getScope(context: ReferenceInfo): Scope {
    //only StopDef cross references are allowed
    if (isStopDef(context.container) && context.property === 'stop') {
      //Success! We are handling the cross-reference of a greeting to a person!

      //get the root node of the document
      const model = AstUtils.getContainerOfType(context.container, isTubemap)!;
      //select all stops from this document
      const stops = model.stops;
      //transform them into node descriptions
      const descriptions = stops.map((s) =>
        this.astNodeDescriptionProvider.createDescription(s, s.name)
      );
      //create the scope
      return new MapScope(descriptions);
    }
    return EMPTY_SCOPE;
  }
}
