import { css, styled } from 'styled-components'

const AppMenuContainer = styled.div<{ $show: boolean }>`
    position: fixed;
    top: 50px;
    left: 60px;
    z-index: 1035;
    visibility: hidden;
    min-width: 150px;
    max-height: 234px;
    overflow-y: auto;
    border-radius: 0.25rem;
    transform: translateY(15px);
    opacity: 0;
    box-shadow: 0 5px 14px 5px rgba(0, 0, 0, 0.35);
    transition: transform .125s ease-in-out,
                opacity .125s ease-in-out,
                visibility .01s .125s;

    ${(props) => props.$show && css`
        visibility: visible;
        transform: translateY(0px);
        opacity: 1;
        transition: transform .125s ease-in-out,
                    opacity .125s ease-in-out,
                    visibility .01s;
    `}
`

export default AppMenuContainer
