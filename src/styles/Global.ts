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
    img, svg {
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
        min-width: 845px;
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

    .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }
    
    @media screen and (min-width: 960px){
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

    .type-color-normal {
        color:#A8A878;
    }
    .type-color-fire {
        color:#F08030;
    }
    .type-color-water {
        color:#6890F0;
    }
    .type-color-grass {
        color:#78C850;
    }
    .type-color-electric {
        color:#F8D030;
    }
    .type-color-ice {
        color:#98D8D8;
    }
    .type-color-fighting {
        color:#C03028;
    }
    .type-color-poison {
        color:#A040A0;
    }
    .type-color-ground {
        color:#E0C068;
    }
    .type-color-flying {
        color:#A890F0;
    }
    .type-color-psychic {
        color:#F85888;
    }
    .type-color-bug {
        color:#A8B820;
    }
    .type-color-rock {
        color:#a0783f;
    }
    .type-color-ghost {
        color:#705898;
    }
    .type-color-dragon {
        color:#7038F8;
    }
    .type-color-dark {
        color:#656160;
    }
    .type-color-steel {
        color:#B8B8D0;
    }
    .type-color-fairy {
        color:#EE99AC;
    }
`
