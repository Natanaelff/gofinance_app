import React, {createContext, ReactNode, useContext, useState, useEffect} from "react";
import * as Google from 'expo-google-app-auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signout(): Promise<void>;
  loading: boolean;
}

const AuthContext = createContext({} as IAuthContextData)

function AuthProvider({children} : AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);

  const userStorageKey = '@goFinance:user';

  async function signInWithGoogle() {
    try {
      const result = await Google.logInAsync({
        iosClientId: '1062480910237-15851rt8q6ta6orb3kvqn50q4l5ug7nq.apps.googleusercontent.com',
        androidClientId: '1062480910237-kg6a68mva6lt8c5rs5g0ldbb2qkuftlv.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if(result.type === 'success'){
        const userLogged = {
          id: String(result.user.id),
          email: result.user.email!,
          name: result.user.name!,
          photo: result.user.photoUrl!
        };
        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }

    }catch(error){
      throw new Error();
    }
  }

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      });

      if(credential){
        const name = credential.fullName?.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}&lenght=1`;
        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name,
          photo,
        };

        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
      
    } catch (error) {
      throw new Error();
    }
  }

  async function signout() {
    setUser({} as User);

    await AsyncStorage.removeItem(userStorageKey);
  }

  useEffect(() => {
    async function loadStorage() {
      const userStorage = await AsyncStorage.getItem(userStorageKey);

      if(userStorage){
        const userLogged = JSON.parse(userStorage) as User;
        setUser(userLogged)
      }

      setLoading(false);
    }

    loadStorage();
  },[]);

  return(
  <AuthContext.Provider value={{user, signInWithGoogle, signInWithApple, signout, loading}}>
    {children}
  </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext)

  return context;
}

export {AuthProvider, useAuth}