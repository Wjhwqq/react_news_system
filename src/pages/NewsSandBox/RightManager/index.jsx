import React from 'react'
// import RoleList from './RoleList'
// import RightList from './RightList'
import { Outlet } from "react-router-dom";
export default function RightManager() {
  return (
    <div>
      <Outlet></Outlet>
    </div>
  )
}
