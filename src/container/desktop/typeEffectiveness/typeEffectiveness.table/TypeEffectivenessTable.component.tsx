'use client'
import { useState } from 'react'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import TableActivePointerComponent, {
  ActivePointerType,
} from './table.activePointer/TableActivePointer.component'

const TypeEffectivenessTableComponent = () => {
  const [activeType, setActiveType] = useState<ActivePointerType>(undefined)

  const handleClickActiveEffective = (effectiveType: ActivePointerType) => {
    if (effectiveType === activeType) {
      setActiveType(() => undefined)
    } else {
      setActiveType(() => effectiveType)
    }
  }

  const handleClickResetActiveEffective = () => {
    setActiveType(() => undefined)
  }

  return (
    <div className="w-full h-full mb-4" aria-label="포켓몬 타입 상성표">
      <table
        className="w-full h-full bg-primary-4 table-fixed border-hidden"
        aria-labelledby="pokemon-type-effectiveness-table"
      >
        <caption className="w-full h-8 caption-top mb-2">
          <h2
            id="pokemon-type-effectiveness-table"
            className="h-8 text-[2rem] font-semibold leading-[calc(2rem+2px)] float-left text-primary-4"
          >
            타입별 상성 표
          </h2>
          <TableActivePointerComponent
            activeType={activeType}
            onClickPointer={handleClickActiveEffective}
            onClickResetEffective={handleClickResetActiveEffective}
          />
        </caption>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          {Object.keys(PokemonTypes).map((typeKey) => (
            <col key={`col-${typeKey}`} width="5%" />
          ))}
        </colgroup>
        <thead className="h-28 border-b border-solid border-gray-200">
          <tr className="w-full h-14 bg-primary-3">
            <th
              colSpan={2}
              rowSpan={2}
              className="w-[5%] h-28 text-base leading-none text-center tracking-wide text-black align-middle border-t border-solid border-primary-2 relative"
            ></th>
            <th
              colSpan={18}
              className="w-[5%] h-14 text-base leading-none text-center tracking-wide text-black align-middle border-l border-t border-solid border-primary-2"
            >
              공격 받는 포켓몬
            </th>
          </tr>
          <tr className="w-full h-14 bg-primary-3">
            {Object.entries(PokemonTypes).map(([key, value]) => {
              return (
                <th
                  key={`type-effective-table-key-${key}`}
                  scope="col"
                  className="w-[5%] h-14 text-base text-center leading-none tracking-wide text-black align-middle border-l border-t border-solid border-primary-2"
                >
                  {value}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="w-full">
          <tr className="h-12">
            <th
              rowSpan={19}
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              공격
              <br />
              하는
              <br />
              포켓몬
            </th>
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-t border-r border-solid border-primary-3"
            >
              {PokemonTypes.NORMAL}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-gray-500 ${activeType === 'zero' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'half' ? 'opacity-30' : ''}`}
            >
              0배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.FIRE}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.WATER}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.GRASS}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.ELECTRIC}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-gray-500 ${activeType === 'zero' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'half' ? 'opacity-30' : ''}`}
            >
              0배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.ICE}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.FIGHTING}
            </th>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-gray-500 ${activeType === 'zero' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'half' ? 'opacity-30' : ''}`}
            >
              0배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.POISON}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-gray-500 ${activeType === 'zero' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'half' ? 'opacity-30' : ''}`}
            >
              0배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.GROUND}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-gray-500 ${activeType === 'zero' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'half' ? 'opacity-30' : ''}`}
            >
              0배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.FLYING}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.PSYCHIC}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-gray-500 ${activeType === 'zero' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'half' ? 'opacity-30' : ''}`}
            >
              0배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.BUG}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.ROCK}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.GHOST}
            </th>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-gray-500 ${activeType === 'zero' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'half' ? 'opacity-30' : ''}`}
            >
              0배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.DRAGON}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-gray-500 ${activeType === 'zero' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'half' ? 'opacity-30' : ''}`}
            >
              0배
            </td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.DARK}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.STEEL}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
          </tr>
          <tr className="h-12">
            <th
              scope="row"
              className="w-[5%] align-middle text-center text-base leading-[1.1rem] tracking-wide text-white bg-primary-2 border-solid border-t border-r border-primary-3"
            >
              {PokemonTypes.FAIRY}
            </th>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-green-600 ${activeType === 'double' ? 'text-lg font-semibold' : ''} ${activeType === 'half' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              2배
            </td>
            <td
              className={`w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3 text-yellow-600 ${activeType === 'half' ? 'text-lg font-semibold' : ''} ${activeType === 'double' || activeType === 'zero' ? 'opacity-30' : ''}`}
            >
              0.5배
            </td>
            <td className="w-[5%] align-middle text-center text-base leading-[1.1rem] border border-solid border-primary-3"></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default TypeEffectivenessTableComponent
