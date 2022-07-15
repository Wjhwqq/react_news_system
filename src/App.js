import React from 'react'
import {useRoutes} from 'react-router-dom'
import routes from './routes'
import './App.css'
import { Provider } from 'react-redux'
import store from './redux/store'
// import axios from 'axios'
export default function App() {
  const element=useRoutes(routes)
  return (
    <Provider store={store}>
      <div>
        {element}
      </div>
    </Provider>
  )
}
