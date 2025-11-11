import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import PokemonCardComponent from '~/container/desktop/List/list.pokemonCard/PokemonCard.component'
import { PokemonCardFragment } from '~/graphql/typeGenerated'

interface BannerComponentProps {
  dailyPokemon: Array<PokemonCardFragment>
}

const BannerComponent = ({ dailyPokemon }: BannerComponentProps) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={24}
      slidesPerView={1}
      navigation
      loop
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
    >
      {dailyPokemon.map((pokemon) => (
        <SwiperSlide key={pokemon.id} className="flex justify-center">
          <PokemonCardComponent pokemonData={pokemon} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default BannerComponent
