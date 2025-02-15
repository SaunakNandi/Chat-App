import {keyframes, Skeleton, styled} from '@mui/material';
import {Link as LinkComponent} from 'react-router-dom'
import { gray } from '../../constants/Color';
export const VisuallyHiddenInput=styled("input")({
    border:0,
    clip:"react(0,0,0,0)",
    height:1,
    margin:-1,
    overflow:"hidden",
    padding:0,
    position:"absolute",
    whiteSpace:"nowrap",
    width:1,
})

export const Link=styled(LinkComponent)`
text-decoration: none;
color: #black;
padding: 1rem;
&:hover{
    background-color: rgba(0,0,0,0.1)
}`

export const InputBox=styled('input')`
    width:100%;
    height:100%;
    border:1px solid slategray;
    outline:none;
    padding: 0 3rem;
    border-radius: 1.5rem;
    background-color: ${gray};
`

const BounceAnimation=keyframes`
0% {transform:scale(1);}
50% {transform:scale(1.5);}
100% {transform:scale(1);}
`;
export const BouncingSkeleton=styled(Skeleton)(()=>(
    {
        animation:`${BounceAnimation} is infinite`
    }
))