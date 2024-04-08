import { createGlobalStyle } from 'styled-components'
import { reset } from 'styled-reset'

export const GlobalStyle = createGlobalStyle`
    ${reset}
    :root {
        --color-primary-1 :#27374D;
        --color-primary-2 :#526D82;
        --color-primary-3 :#9DB2BF;
        --color-primary-4 :#DDE6ED;
        --color-white-1: #ffffff;
        --color-white-2: #dddddd;
        --color-white-3: #f2f3f4;
        --color-black-1: #000000;
        --color-black-2: #333333;
        --color-shadow-1: #eeeeee;
        --color-shadow-2: #dddddd;
        --color-shadow-3: #838383;
    }
    :focus {
        outline: none;
        border: none;
    }
    ::-webkit-scrollbar {
        display: none;
    }
    img, svg{
        pointer-events : none;
    }
    img, svg, body {
        -webkit-user-select:none;
        -webkit-user-drag: none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none
    }
    html,body{
        font-size: 18px;
        -webkit-text-size-adjust: none;
        font-display: fallback;
        -ms-overflow-style: none;
        scrollbar-width: none;
        width: 100%;
        height: 100%;
        background-color: var(--color-primary-1);
        scroll-behavior: smooth;
    }
    
    body {
        position: relative;
        width: 100%;
        height: 100%;
    }

    button {
        background: none;
        padding: 0;
        border: none;
        cursor: pointer;
        box-sizing: border-box;
        &:disabled {
            cursor: default;
            fill: var(--color-white-3);
        }
    }
    a {
        text-decoration: none;
    }

    figure {
        width: 100%;
        height:100%;
        position: relative;
    }

    html.project__detail--show{
        overflow: hidden !important;
    }

    * {
         font-family: 'GmarketSans' !important;
        -webkit-tap-highlight-color: transparent !important;
         box-sizing: border-box;
    }

    @media screen and (min-width: 1281px) {
        html,
        body {
            font-size: 18px;
        }
    }
    @media screen and (min-width: 960px) and (max-width: 1280px) {
        html,
        body {
            font-size: 16px;
        }
    }
    @media screen and (min-width: 680px) and (max-width: 959px) {
        html,
        body {
            font-size: 14px;
        }
    }
    @media screen and (max-width: 679px) {
        html,
        body {
            font-size: 12px;
        }
    }
    /* @media screen and (max-width: 479px) {
        html, body {
            font-size : 11px;
        }
    } */
`
