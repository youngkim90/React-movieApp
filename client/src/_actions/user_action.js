import axios from 'axios';
import { LOGIN_USER } from './types';
import { REGISTER_USER } from './types';
import { AUTH_USER } from './types';

export function loginUser(dataTosubmit) {
     const request = axios.post('/api/login',dataTosubmit)
         .then (response => response.data)

     return {
         type: LOGIN_USER,
         payload: request
     }
};

export function registerUser(dataTosubmit) {
    const request = axios.post('/api/join',dataTosubmit)
        .then (response => response.data)

    return {
        type: REGISTER_USER,
        payload: request
    }
};
export function auth(dataTosubmit) {
    const request = axios.get('/api/auth')
        .then (response => response.data)

    return {
        type: AUTH_USER,
        payload: request
    }
};