import { createContext } from 'react';
import { IUser } from '../../interfaces/user';

interface ContextProps {
    isLoggedIn: boolean;
    user?: IUser;
}

export const AuthContext = createContext({} as ContextProps);