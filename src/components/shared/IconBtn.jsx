import { Tooltip,IconButton, Badge } from "@mui/material"
import { forwardRef } from "react"
export const IconBtn=forwardRef(({title,icon,func,value},ref)=>{
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={func} ref={ref}>
                {
                    value? <Badge badgeContent={value} color="error">{icon}</Badge>:icon
                }
                
            </IconButton>
        </Tooltip>
    )
})