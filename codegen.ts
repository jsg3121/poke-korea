import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql',
  documents: ['src/**/*.graphql'],
  generates: {
    'src/graphql/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
        commentDescriptions: true,
      },
    },
    'src/graphql/gqlGenerated.ts': {
      documents: ['src/**/*.graphql'],
      preset: 'import-types',
      presetConfig: {
        typesPath: './typeGenerated',
      },
      plugins: ['typescript-react-apollo'],
      config: {
        withHooks: 'true',
        namingConvention: {
          enumValues: 'change-case#constantCase',
        },
        scalars: {
          Date: 'number',
        },
      },
    },
    'src/graphql/typeGenerated.ts': {
      documents: ['src/**/*.graphql'],
      plugins: ['typescript', 'typescript-operations'],
      config: {
        namingConvention: {
          enumValues: 'change-case#constantCase',
        },
        scalars: {
          Date: 'number',
        },
      },
    },
  },
}

export default config
