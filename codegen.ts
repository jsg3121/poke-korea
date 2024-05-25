import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql',
  documents: ['src/**/*.tsx'],
  generates: {
    'src/graphql/schema.graphql': {
      overwrite: true,
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
        commentDescriptions: true,
      },
    },
    'src/graphql/gqlGenerated.ts': {
      overwrite: true,
      documents: ['src/**/*.tsx'],
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
      overwrite: true,
      documents: ['src/**/*.tsx'],
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
