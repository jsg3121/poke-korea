import { createGlobalStyle } from 'styled-components'
import { reset } from 'styled-reset'

export const GlobalStyle = createGlobalStyle`
    ${reset}
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
        background: linear-gradient(
          0deg,
          #142129 3rem,
          #1c303d 5rem,
          #45545e 10rem,
          #85929a 20rem
        );
        scroll-behavior: smooth;
        overflow-x: hidden;
    }
    
    body {
        position: relative;
    }

    button {
        background: none;
        padding: 0;
        border: none;
        cursor: pointer;
        box-sizing: border-box;
        &:disabled {
            cursor: default;
            fill: #f2f3f4;
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
        -webkit-tap-highlight-color: transparent !important;
         box-sizing: border-box;
    }

    h1,h2,h3,h4,h5,h6,p,span,textarea {
        color: #333333;
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
