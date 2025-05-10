import { lazy, Suspense, useEffect } from 'react' 
import { Route, Routes } from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute'
import {Loader} from './components/layout/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists,userExists } from './redux/reducers/auth'
import axios from 'axios'
import {Toaster} from 'react-hot-toast'
import { SocketProvider } from './socket'
import UpdateProfile from './pages/UpdateProfile'
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))
const Groups = lazy(() => import('./pages/Groups'))
const NotFound = lazy(() => import('./pages/NotFound'))


function App() {
  const server=import.meta.env.VITE_SERVER
  const dispatch = useDispatch()
  const {user,loader}=useSelector(state=>state.auth)
  console.log(loader)
  async function fetchUser(){
    try {
      const res=await axios.get(`${server}/api/v1/user/me`,{
        withCredentials:true,
      })
      console.log(res.data)
      dispatch(userExists(res.data.user))
    } catch (error) {
      console.error(error)
      dispatch(userNotExists())
    }
  }
  console.log(user)
  useEffect(()=>{
    fetchUser()
  },[dispatch])
  return loader? <Loader/> : (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* These will be under outlet */}
          <Route element={
            <SocketProvider>
              <ProtectRoute user={user} />
            </SocketProvider>
          }>
            {/* Now sockets can be accessed by this route */}
            <Route path='/' element={<Home />} />
            <Route path='/update' element={<UpdateProfile/>}/>
            <Route path='/chat/:chatId' element={<Chat />} />
            <Route path='/groups' element={<Groups />} />
          </Route>
          <Route path='/login' element={
            <ProtectRoute user={!user} redirect='/'>
              <Login />
            </ProtectRoute>
          } />
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Suspense>
      <Toaster position='bottom-center'/>
    </>
  )
}

export default App
