import { FC, useReducer, useEffect } from 'react';
import { AuthContext, authReducer } from './';
import { IUser } from '../../interfaces/user';
import tesloApi from '../../api/tesloApi';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';

export interface AuthState {
   isLoggedIn: boolean;
   user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
   isLoggedIn: false,
   user: undefined
}


type Props = {
   children?: React.ReactNode
};

export const AuthProvider: FC<Props> = ({ children }) => {

   const router = useRouter();
   const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);


   useEffect(() => {
      checkToken();
   }, [])

   const checkToken = async () => {

      const token = Cookies.get('token');
      if (!token) { return; }

      try {
         const { data } = await tesloApi.get('/user/validate-token');
         const { token, user } = data;
         Cookies.set('token', token)
         dispatch({ type: '[Auth] - Login', payload: user})

      } catch (error) {
         Cookies.remove('token');
      }

   }


   const loginUser = async (email: string, password: string): Promise<boolean> => {
      try {
         const { data } = await tesloApi.post('/user/login', { email, password });
         const { token, user } = data;
         Cookies.set('token', token);
         dispatch({ type: '[Auth] - Login', payload: user });
         return true;
      } catch (error) {
         return false;
      }
   }

   const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean; message?: string; }> => {

      try {
         const { data } = await tesloApi.post('/user/register', { name, email, password });
         const { token, user } = data;
         Cookies.set('token', token);
         dispatch({ type: '[Auth] - Login', payload: user });
         return {
            hasError: false
         }
      } catch (error) {
         if (axios.isAxiosError(error)) {
            return {
               hasError: true,
               message: error.response?.data.message
            }
         }

         return {
            hasError: true,
            message: 'No se pudo crear el usuario - intente de nuevo'
         }
      }
   }

   const logout = () => {
      Cookies.remove('token');
      Cookies.remove('cart');
      router.reload(); //hace un refresh de la app, como ctrl r

   }

   return (
      <AuthContext.Provider value={{
         ...state,

         //Methods
         loginUser,
         registerUser,
         logout

      }}>
         {children}
      </AuthContext.Provider>
   )
}