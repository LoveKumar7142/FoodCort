import React, { useEffect } from 'react'
import { serverUrl } from '../src/App'
import axios from "axios"
import { useDispatch } from 'react-redux'
import { setUserData } from '../src/redux/userSlice'

const useGetCurrentUser = () => {
    const dispatch = useDispatch()
    useEffect(()=>{
        const fatchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
                // console.log(result)
                dispatch(setUserData(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        fatchUser()
    },[])
  return (
    <div>
      
    </div>
  )
}

export default useGetCurrentUser
