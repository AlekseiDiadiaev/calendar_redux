import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer'


const store = configureStore({
    reducer: reducer,
    middleware: defaultMiddleware => defaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
})

export default store;