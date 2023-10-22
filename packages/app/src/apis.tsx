import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
} from '@backstage/core-plugin-api';
import {ApiEntity } from '@backstage/catalog-model';
import {
apiDocsConfigRef,
defaultDefinitionWidgets
} from '@backstage/plugin-api-docs';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  ScmAuth.createDefaultApiFactory(),
  createApiFactory({
      api: apiDocsConfigRef,
      deps: {},
      factory: () => {
        // load the default widgets
        const definitionWidgets = defaultDefinitionWidgets();
        return {
          getApiDefinitionWidget: (apiEntity: ApiEntity) => {
            // custom rendering for sql
            if (apiEntity.spec.type === 'cors-openapi') {
              let regex = /"servers":\[{"url":"([a-z]+:\/\/[a-zA-Z-.:0-9]+)"/g;
//               let regex = /"servers":\[{"url":"([a-z]+:\/\/[a-zA-Z-.]+):([0-9]+)"/g;
              let matches = regex.exec(apiEntity.spec.definition);
              console.log(matches);
              let targetString = matches ? matches[1] : "";
              console.log(targetString);

              apiEntity.spec.definition = apiEntity.spec.definition.replaceAll(
               regex,
               "\"servers\":[{\"url\":\"http://localhost:7007/api/proxy/" + targetString + "\"");

               apiEntity.spec.type='openapi';
            }
            // fallback to the defaults
            return definitionWidgets.find(d => d.type === apiEntity.spec.type);
          },
        };
      },
    }),
];
