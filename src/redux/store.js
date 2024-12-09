import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counter/Slice.js'

export default configureStore({
  reducer: {
    counter: counterReducer
  },
})