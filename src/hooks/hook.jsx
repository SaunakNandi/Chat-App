import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NEW_MESSAGE } from "../constants/events";

// custom Hook
export const useErrors=(errors=[])=>{
    useEffect(()=>{
        errors.forEach(({isError,error,fallback})=>{
            if(isError)
            {
                if(fallback) fallback()
                else toast.error(error?.data?.message || 'Something went wrong')
            }
        })
    },[errors]);
}

export const useAsyncMutation=(mutationHook)=>{
    const [isLoading,setIsLoading]=useState(false)
    const [data,setData]=useState(null)
    const [mutate]=mutationHook()
    const executeMutation=async(toastMessage,...args)=>{
        setIsLoading(true)
        const toastId=toast.loading(toastMessage || "Updating data...")
        try {
              const res= await mutate(...args)
              if(res.data)
              {
                // {id:toastId} this will remove the loading toast
                toast.success(res.data.message || `${toastMessage} successfully`,{id:toastId})
                // console.log(res.data)
                setData(res.data)
              }
              else{
                toast.error(res.error?.data?.message || "No data found",{id:toastId})
              }
            } catch (error) {
              console.log(error)
              toast.error("Something went wrong",{id:toastId})
            }
        finally{
            setIsLoading(false)
            // toast.dismiss(toastId)
        }
    }
    return [executeMutation,isLoading,data] // can be imported with any name
}
export const useSocketEvents=(socket,handlers)=>{
    useEffect(()=>{
        Object.entries(handlers).forEach(([event,handler])=>{
            // console.log(event,handler)
            socket.on(event,handler)
        })

        return ()=>{
            Object.entries(handlers).forEach(([event,handler])=>{
                socket.off(event,handler)
            })
        }
    },[socket,handlers])
}
