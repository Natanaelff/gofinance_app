import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React from 'react';
import {Routes} from '../src/routes';
import {StatusBar} from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import {ThemeProvider} from 'styled-components';

import {AuthProvider, useAuth} from './hooks/auth';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import theme from '../src/global/styles/theme';

export default function index() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const {loading} = useAuth();

  if(!fontsLoaded || loading) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
        <StatusBar style='light' />
        <AuthProvider>
          <Routes />
        </AuthProvider>
    </ThemeProvider>
  )
}
