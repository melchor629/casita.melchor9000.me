import { styled } from 'styled-components'

const HeaderElementsContainer = styled('div')`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
    column-gap: 0.75rem;
    row-gap: 0.25rem;

    > small {
        flex-grow: 1;
        width: 100%;
        margin-bottom: 0.25rem;

        > a {
            text-decoration: none;
        }
    }
`

export default HeaderElementsContainer
