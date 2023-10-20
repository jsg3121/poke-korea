export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type FormStats = {
  __typename?: 'FormStats';
  attack: Scalars['Int']['output'];
  defense: Scalars['Int']['output'];
  hp: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  specialAttack: Scalars['Int']['output'];
  specialDefense: Scalars['Int']['output'];
  speed: Scalars['Int']['output'];
  statCode: Scalars['String']['output'];
  total: Scalars['Int']['output'];
};

export type MegaStats = {
  __typename?: 'MegaStats';
  attack: Scalars['Int']['output'];
  defense: Scalars['Int']['output'];
  hp: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  specialAttack: Scalars['Int']['output'];
  specialDefense: Scalars['Int']['output'];
  speed: Scalars['Int']['output'];
  statCode: Scalars['String']['output'];
  total: Scalars['Int']['output'];
};

export type NormalStats = {
  __typename?: 'NormalStats';
  attack: Scalars['Int']['output'];
  defense: Scalars['Int']['output'];
  hp: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  pokemonId: Scalars['Int']['output'];
  specialAttack: Scalars['Int']['output'];
  specialDefense: Scalars['Int']['output'];
  speed: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type Pokemon = {
  __typename?: 'Pokemon';
  _count?: Maybe<PokemonCount>;
  evolutionId: Array<Scalars['Int']['output']>;
  generation: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isEvolution: Scalars['Boolean']['output'];
  isForm: Scalars['Boolean']['output'];
  isMega?: Maybe<Scalars['Boolean']['output']>;
  isRegion?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  number: Scalars['Int']['output'];
  /** pokemonList fieldResover */
  stats: NormalStats;
  type: Array<Scalars['String']['output']>;
  typeSingle1: Scalars['String']['output'];
  typeSingle2?: Maybe<Scalars['String']['output']>;
};

export type PokemonCount = {
  __typename?: 'PokemonCount';
  PokemonMega: Scalars['Int']['output'];
  PokemonNormalForm: Scalars['Int']['output'];
  PokemonRegion: Scalars['Int']['output'];
};

export type PokemonMega = {
  __typename?: 'PokemonMega';
  _count?: Maybe<PokemonMegaCount>;
  id: Scalars['Int']['output'];
  /** 메가진화 상태 종족값 */
  megaStats?: Maybe<MegaStats>;
  pokemonId: Scalars['Int']['output'];
  pokemonNumber: Scalars['Int']['output'];
  statCode: Scalars['String']['output'];
  type: Array<Scalars['String']['output']>;
  typeSingle1: Scalars['String']['output'];
  typeSingle2?: Maybe<Scalars['String']['output']>;
};

export type PokemonMegaCount = {
  __typename?: 'PokemonMegaCount';
  MegaStats: Scalars['Int']['output'];
};

export type PokemonNormalForm = {
  __typename?: 'PokemonNormalForm';
  _count?: Maybe<PokemonNormalFormCount>;
  /** 노말폼 변경시 종족값 */
  formStats?: Maybe<FormStats>;
  id: Scalars['Int']['output'];
  imagePath: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pokemonId: Scalars['Int']['output'];
  statCode: Scalars['String']['output'];
  type: Array<Scalars['String']['output']>;
  typeSingle1: Scalars['String']['output'];
  typeSingle2?: Maybe<Scalars['String']['output']>;
};

export type PokemonNormalFormCount = {
  __typename?: 'PokemonNormalFormCount';
  FormStats: Scalars['Int']['output'];
};

export type PokemonRegion = {
  __typename?: 'PokemonRegion';
  _count?: Maybe<PokemonRegionCount>;
  id: Scalars['Int']['output'];
  pokemonId: Scalars['Int']['output'];
  pokemonNumber: Scalars['Int']['output'];
  region: Scalars['String']['output'];
  /** 리전폼 포켓몬 종족값 */
  regionStats?: Maybe<RegionStats>;
  statCode: Scalars['String']['output'];
  type: Array<Scalars['String']['output']>;
  typeSingle1: Scalars['String']['output'];
  typeSingle2?: Maybe<Scalars['String']['output']>;
};

export type PokemonRegionCount = {
  __typename?: 'PokemonRegionCount';
  RegionStats: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  getList: Array<Pokemon>;
  getMegaEvolution: Array<PokemonMega>;
  getNormalForm: Array<PokemonNormalForm>;
  getNormalStats: Array<NormalStats>;
  getPokemonFilter?: Maybe<Array<Pokemon>>;
  getPokemonStats: FormStats;
  getRegionForm: Array<PokemonRegion>;
  getSingleNormalStats: NormalStats;
  getSinglePokemon: Pokemon;
};


export type QueryGetMegaEvolutionArgs = {
  number: Scalars['Float']['input'];
};


export type QueryGetNormalFormArgs = {
  number: Scalars['Float']['input'];
};


export type QueryGetPokemonFilterArgs = {
  generation?: InputMaybe<Array<Scalars['String']['input']>>;
  isEvolution?: InputMaybe<Scalars['Boolean']['input']>;
  isMega?: InputMaybe<Scalars['Boolean']['input']>;
  isRegion?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pokemonNumber?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryGetPokemonStatsArgs = {
  statCode: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type QueryGetRegionFormArgs = {
  number: Scalars['Float']['input'];
};


export type QueryGetSingleNormalStatsArgs = {
  id: Scalars['Float']['input'];
};


export type QueryGetSinglePokemonArgs = {
  number: Scalars['Float']['input'];
};

export type RegionStats = {
  __typename?: 'RegionStats';
  attack: Scalars['Int']['output'];
  defense: Scalars['Int']['output'];
  hp: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  specialAttack: Scalars['Int']['output'];
  specialDefense: Scalars['Int']['output'];
  speed: Scalars['Int']['output'];
  statCode: Scalars['String']['output'];
  total: Scalars['Int']['output'];
};
