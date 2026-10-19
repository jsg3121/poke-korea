export type FormTypeParam =
  | 'default'
  | 'mega'
  | 'form'
  | 'region'
  | 'gigantamax'

export interface AnalyticsEventMap {
  use_name_search: {
    source: 'type_calc'
    query: string
    pokemon_number: number
    form_type: Exclude<FormTypeParam, 'gigantamax'>
    is_first_search: 'true' | 'false'
  }
  use_type_calc: {
    input_method: 'chip' | 'name'
    types: string
  }
  stats_tab_status: {
    tab: 'base' | 'real'
    form_type: FormTypeParam
    pokemon_number: number
  }
}
