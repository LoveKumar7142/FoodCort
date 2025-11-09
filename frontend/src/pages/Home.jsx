import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DelieveryBoy from '../components/DelieveryBoy'

const Home = () => {
    const {userData} = useSelector(state=>state.user)
  return (
    <div>
      {userData.role=="user" && <UserDashboard />}
      {userData.role=="owner" && <OwnerDashboard />}
      {userData.role=="delieveryBoy" && <DelieveryBoy />}
    </div>
  )
}

export default Home
