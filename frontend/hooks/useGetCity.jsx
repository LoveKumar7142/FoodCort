import React, { useEffect } from 'react'
import { serverUrl } from '../src/App'
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux'
import { setCity } from '../src/redux/userSlice'

const useGetCity = () => {
    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user);
    const apiKey = import.meta.env.VITE_GEOAPIKEY
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(async (position) => {
            console.log(position)
            const {latitude,longitude} = position.coords


            // gioapify api 

            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)

            // console.log(result.data.results[0].city);
            dispatch(setCity(result?.data?.results[0].city))
        })
    },[userData])
}
    
export default useGetCity
