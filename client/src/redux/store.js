import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducer as reduxForm } from 'redux-form';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import blogsReducer from './reducers/blogsReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  form: reduxForm,
  blogs: blogsReducer
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk]
})