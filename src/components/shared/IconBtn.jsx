import { Tooltip,IconButton } from "@mui/material"
export const IconBtn=({title,icon,func})=>{
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={func}>
                {icon}
            </IconButton>
        </Tooltip>
    )
}