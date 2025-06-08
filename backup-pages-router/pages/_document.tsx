import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
    }
  }

  render() {
    return (
      <Html lang="ko">
        <Head>
          {process.env.NODE_ENV === 'production' && (
            <>
              {/* <!-- Google tag (gtag.js) --> */}
              <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-28P8TKSR5M"
              ></script>
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', 'G-28P8TKSR5M');
                `,
                }}
              />
              <script
                type="text/javascript"
                src="//wcs.naver.net/wcslog.js"
              ></script>
              <script
                type="text/javascript"
                dangerouslySetInnerHTML={{
                  __html: `
                    if(!wcs_add) var wcs_add = {};
                    wcs_add["wa"] = "7c0a94c9c2ab1c";
                    if(window.wcs) {
                      wcs_do();
                    }
                  `,
                }}
              ></script>
              {/* Google AdSence */}
              <meta
                name="naver-site-verification"
                content="28fbf8b85e4e80ff37d5a2338991716ae74de83f"
              />
              <meta
                name="google-adsense-account"
                content="ca-pub-6481622724376761"
              ></meta>
              <script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6481622724376761"
              ></script>
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
