import { useMemo, useContext } from 'react'
import { createContext } from 'react'
import io from 'socket.io-client'
import { server } from './constants/config.js'

export const getSocket=()=>useContext(SocketContext)

const SocketContext=createContext()
export const SocketProvider=({children})=>{
    // prevent rerender
    const socket=useMemo(()=>io(server,{withCredentials:true}),[])  // This triggers the 'connection' event on the server.
    console.log(socket)
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}