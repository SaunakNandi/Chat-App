import { Tooltip,IconButton, Badge } from "@mui/material"
export const IconBtn=({title,icon,func,value})=>{
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={func}>
                {
                    value? <Badge badgeContent={value} color="error">icon</Badge>:icon
                }
                
            </IconButton>
        </Tooltip>
    )
}