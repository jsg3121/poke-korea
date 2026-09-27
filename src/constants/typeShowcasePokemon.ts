import { PokemonType } from '~/graphql/typeGenerated'

export interface TypeShowcasePokemon {
  id: number
  name: string
}

export const TYPE_SHOWCASE_POKEMON: Record<
  PokemonType,
  ReadonlyArray<TypeShowcasePokemon>
> = {
  [PokemonType.NORMAL]: [
    { id: 143, name: '잠만보' },
    { id: 133, name: '이브이' },
    { id: 113, name: '럭키' },
    { id: 289, name: '게을킹' },
    { id: 463, name: '내룸벨트' },
    { id: 241, name: '밀탱크' },
  ],
  [PokemonType.FIRE]: [
    { id: 6, name: '리자몽' }, // FIRE/FLYING
    { id: 59, name: '윈디' },
    { id: 38, name: '나인테일' },
    { id: 257, name: '번치코' }, // FIRE/FIGHTING
    { id: 392, name: '초염몽' }, // FIRE/FIGHTING
    { id: 815, name: '에이스번' },
  ],
  [PokemonType.WATER]: [
    { id: 658, name: '개굴닌자' }, // WATER/DARK
    { id: 130, name: '갸라도스' }, // WATER/FLYING
    { id: 9, name: '거북왕' },
    { id: 131, name: '라프라스' }, // WATER/ICE
    { id: 260, name: '대짱이' }, // WATER/GROUND
    { id: 818, name: '인텔리레온' },
  ],
  [PokemonType.GRASS]: [
    { id: 3, name: '이상해꽃' }, // GRASS/POISON
    { id: 254, name: '나무킹' },
    { id: 724, name: '모크나이퍼' }, // GRASS/GHOST
    { id: 470, name: '리피아' },
    { id: 497, name: '샤로다' },
    { id: 908, name: '마스카나' }, // GRASS/DARK
  ],
  [PokemonType.ELECTRIC]: [
    { id: 25, name: '피카츄' },
    { id: 405, name: '렌트라' },
    { id: 135, name: '쥬피썬더' },
    { id: 181, name: '전룡' },
    { id: 145, name: '썬더' }, // ELECTRIC/FLYING
    { id: 849, name: '스트린더' }, // ELECTRIC/POISON
  ],
  [PokemonType.ICE]: [
    { id: 144, name: '프리져' }, // ICE/FLYING
    { id: 471, name: '글레이시아' },
    { id: 473, name: '맘모꾸리' }, // ICE/GROUND
    { id: 478, name: '눈여아' }, // ICE/GHOST
    { id: 614, name: '툰베어' },
    { id: 875, name: '빙큐보' },
  ],
  [PokemonType.FIGHTING]: [
    { id: 448, name: '루카리오' }, // FIGHTING/STEEL
    { id: 68, name: '괴력몬' },
    { id: 620, name: '비조도' },
    { id: 534, name: '노보청' },
    { id: 979, name: '저승갓숭' }, // FIGHTING/GHOST
    { id: 297, name: '하리뭉' },
  ],
  [PokemonType.POISON]: [
    { id: 169, name: '크로뱃' }, // POISON/FLYING
    { id: 34, name: '니드킹' }, // POISON/GROUND
    { id: 24, name: '아보크' },
    { id: 89, name: '질뻐기' },
    { id: 110, name: '또도가스' },
    { id: 454, name: '독개굴' }, // POISON/FIGHTING
  ],
  [PokemonType.GROUND]: [
    { id: 383, name: '그란돈' },
    { id: 330, name: '플라이곤' }, // GROUND/DRAGON
    { id: 105, name: '텅구리' },
    { id: 530, name: '몰드류' }, // GROUND/STEEL
    { id: 464, name: '거대코뿌리' }, // GROUND/ROCK
    { id: 450, name: '하마돈' },
  ],
  [PokemonType.FLYING]: [
    { id: 823, name: '아머까오' }, // FLYING/STEEL
    { id: 715, name: '음번' }, // FLYING/DRAGON
    { id: 641, name: '토네로스' },
    { id: 845, name: '윽우지' }, // FLYING/WATER
    { id: 18, name: '피죤투' }, // NORMAL/FLYING
    { id: 398, name: '찌르호크' }, // NORMAL/FLYING
  ],
  [PokemonType.PSYCHIC]: [
    { id: 282, name: '가디안' }, // PSYCHIC/FAIRY
    { id: 150, name: '뮤츠' },
    { id: 196, name: '에브이' },
    { id: 65, name: '후딘' },
    { id: 576, name: '고디모아젤' },
    { id: 678, name: '냐오닉스' },
  ],
  [PokemonType.BUG]: [
    { id: 212, name: '핫삼' }, // BUG/STEEL
    { id: 214, name: '헤라크로스' }, // BUG/FIGHTING
    { id: 637, name: '불카모스' }, // BUG/FIRE
    { id: 12, name: '버터플' }, // BUG/FLYING
    { id: 123, name: '스라크' }, // BUG/FLYING
    { id: 127, name: '쁘사이저' },
  ],
  [PokemonType.ROCK]: [
    { id: 142, name: '프테라' }, // ROCK/FLYING
    { id: 248, name: '마기라스' }, // ROCK/DARK
    { id: 95, name: '롱스톤' }, // ROCK/GROUND
    { id: 745, name: '루가루암' },
    { id: 76, name: '딱구리' }, // ROCK/GROUND
    { id: 934, name: '콜로솔트' },
  ],
  [PokemonType.GHOST]: [
    { id: 94, name: '팬텀' }, // GHOST/POISON
    { id: 778, name: '따라큐' }, // GHOST/FAIRY
    { id: 609, name: '샹델라' }, // GHOST/FIRE
    { id: 354, name: '다크펫' },
    { id: 477, name: '야느와르몽' },
    { id: 563, name: '데스니칸' },
  ],
  [PokemonType.DRAGON]: [
    { id: 149, name: '망나뇽' }, // DRAGON/FLYING
    { id: 445, name: '한카리아스' }, // DRAGON/GROUND
    { id: 887, name: '드래펄트' }, // DRAGON/GHOST
    { id: 384, name: '레쿠쟈' }, // DRAGON/FLYING
    { id: 373, name: '보만다' }, // DRAGON/FLYING
    { id: 998, name: '드닐레이브' }, // DRAGON/ICE
  ],
  [PokemonType.DARK]: [
    { id: 197, name: '블래키' },
    { id: 635, name: '삼삼드래' }, // DARK/DRAGON
    { id: 571, name: '조로아크' },
    { id: 359, name: '앱솔' },
    { id: 461, name: '포푸니라' }, // DARK/ICE
    { id: 229, name: '헬가' }, // DARK/FIRE
  ],
  [PokemonType.STEEL]: [
    { id: 681, name: '킬가르도' }, // STEEL/GHOST
    { id: 376, name: '메타그로스' }, // STEEL/PSYCHIC
    { id: 208, name: '강철톤' }, // STEEL/GROUND
    { id: 306, name: '보스로라' }, // STEEL/ROCK
    { id: 1000, name: '타부자고' }, // STEEL/GHOST
    { id: 601, name: '기기기어르' },
  ],
  [PokemonType.FAIRY]: [
    { id: 700, name: '님피아' },
    { id: 468, name: '토게키스' }, // FAIRY/FLYING
    { id: 35, name: '삐삐' },
    { id: 36, name: '픽시' },
    { id: 671, name: '플라제스' },
    { id: 869, name: '마휘핑' },
  ],
}

export const TYPE_SHOWCASE_COUNT = 6
