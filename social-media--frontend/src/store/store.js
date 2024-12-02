import { configureStore } from '@reduxjs/toolkit'
import dpslice from '../store/features/dpslice'
import userSlice from '../store/features/userSlice'
export const store = configureStore({
    reducer: {
        dp: dpslice,
        user:userSlice
      }
    })