import Link from 'next/link'

const FooterContainer = () => {
  return (
    <footer className="w-full min-h-32 max-w-[1280px] mx-auto pt-8 px-5 pb-24">
      <p className="w-full leading-5 text-center text-[10px] text-primary-3 last:mb-0 mb-2">
        Pokémon and Pokémon character names are trademarks of Nintendo.
      </p>
      <p className="w-full leading-5 text-center text-[10px] text-primary-3 last:mb-0 mb-2">
        Pokémon content and materials are trademarks and copyrights of Nintendo
        or its licensors. All rights reserved.
      </p>
      <nav className="w-full text-center">
        <Link
          href="/privacy"
          className="leading-5 text-[10px] text-primary-3 underline underline-offset-2"
        >
          개인정보처리방침
        </Link>
      </nav>
    </footer>
  )
}

export default FooterContainer
