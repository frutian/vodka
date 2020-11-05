import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import tokensReducer from '../components/tokensSlice';



export default configureStore({
  reducer: {
    counter: counterReducer,
    tokens: tokensReducer
  },
});
