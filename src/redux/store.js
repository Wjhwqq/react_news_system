import {createStore,combineReducers} from 'redux'
import { LoadingReducer } from './reducers/LoadingReducer'

const reducer=combineReducers({
  LoadingReducer
})
const store=createStore(reducer)
export default store