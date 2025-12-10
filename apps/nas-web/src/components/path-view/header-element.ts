import { styled } from 'styled-components'

const HeaderElement = styled('div')`
    display: inline-flex;
    flex-direction: column;

    > small {
        opacity: 0.75;
        user-select: none;
        text-align: center;
        font-size: .75em;
        font-weight: 300;
    }
`

export default HeaderElement
