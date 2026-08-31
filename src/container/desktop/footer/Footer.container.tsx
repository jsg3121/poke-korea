import Link from 'next/link'

const FooterContainer = () => {
  return (
    <footer className="w-full max-w-[1280px] mx-auto pt-16 pb-4">
      <p className="w-full h-6 leading-5 text-center text-primary-3">
        Pokémon and Pokémon character names are trademarks of Nintendo.
      </p>
      <p className="w-full h-6 leading-5 text-center text-primary-3">
        Pokémon content and materials are trademarks and copyrights of Nintendo
        or its licensors. All rights reserved.
      </p>
      <nav className="w-full mt-2 text-center">
        <Link
          href="/privacy"
          className="text-primary-3 underline underline-offset-2"
        >
          개인정보처리방침
        </Link>
      </nav>
    </footer>
  )
}

export default FooterContainer
