import { useMemo, useContext } from 'react'
import { createContext } from 'react'
import io from 'socket.io-client'

export const getSocket=()=>useContext(SocketContext)

const SocketContext=createContext()
export const SocketProvider=({children})=>{
    // prevent rerender
    const socket=useMemo(()=>io('http://localhost:3000',{withCredentials:true}),[])
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}