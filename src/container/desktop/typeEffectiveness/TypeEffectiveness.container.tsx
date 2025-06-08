import { TypeEffectivenessProvider } from '~/context/TypeEffectiveness.context'
import TypeEffectivenessCaculatorComponent from './typeEffectiveness.calculator/TypeEffectivenessCaculator.component'
import TypeEffectivenessResultComponent from './typeEffectiveness.result/TypeEffectivenessResult.component'
import TypeEffectivenessTableComponent from './typeEffectiveness.table/TypeEffectivenessTable.component'
import TypeEffectivenessDescription from './typeEffectiveness.description/TypeEffectivenessDescription'

const TypeEffectivenessContainer = () => {
  return (
    <div className="w-full h-full">
      <TypeEffectivenessProvider>
        <div className="w-full mb-12">
          <TypeEffectivenessCaculatorComponent />
          <TypeEffectivenessResultComponent />
        </div>
      </TypeEffectivenessProvider>
      <TypeEffectivenessTableComponent />
      <TypeEffectivenessDescription />
    </div>
  )
}

export default TypeEffectivenessContainer

