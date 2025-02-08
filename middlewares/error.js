import { envMode } from "../app.js"

const errorMiddleware=(err,req,res,next)=>{
    err.message=err.message || 'Internal Server Error'
    err.statusCode=err.statusCode || 500

    console.log("Error in middlewares",err)
    if(err.code===1000)
    {
        const error=Object.values(err.keyValue)[0]
        err.message=`Duplicate field - ${error}`
        err.statusCode=409
    }

    if(err.name==='CastError')  // we got this error when chatId is not available for get chat details
    {
        const errorPath=err.path
        err.message=`Invalid Format of path ${errorPath}`
        err.statusCode=400
    }
    return res.status(err.statusCode).json({
        success:false,
        message:envMode === 'DEVELOPMENT' ? err:err.message,
    })
}

export {errorMiddleware}