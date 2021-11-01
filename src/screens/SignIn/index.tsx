import React, {useState} from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from './styles';
import {RFValue} from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

import Apple from '../../assets/apple.svg';
import Google from '../../assets/google.svg';
import Logo from '../../assets/logo.svg';

import {useAuth} from '../../hooks/auth';

import { SignInSocialButton } from '../../components/SignInSocialButton';

export default function SignIn() {
  const theme = useTheme();
  const [isLoaging, setIsLoading] = useState(false);
  const {signInWithGoogle, signInWithApple} = useAuth();

  async function handleSignInGoogle() {
    try {
      setIsLoading(true);
      return await signInWithGoogle();
    } catch (error) {
        Alert.alert('Não foi possível conectar a conta Google');
        setIsLoading(false);
    }
  }
  
  async function handleSignInApple() {
    try {
      setIsLoading(true);
      return await signInWithApple();
    } catch (error) {
        Alert.alert('Não foi possível conectar a conta Apple');
        setIsLoading(false);
    }
  }

  return(
    <Container>
      <Header>
        <TitleWrapper>
          <Logo 
            width={RFValue(120)}
            height={RFValue(68)}
          />

          <Title>
            Controle suas{'\n'}
            finanças de forma{'\n'}
            muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com{'\n'}
          uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton title="Entrar com Google" svg={Google} onPress={handleSignInGoogle} />
          { Platform.OS === 'ios' &&
            <SignInSocialButton title="Entrar com Apple" svg={Apple} onPress={handleSignInApple} />
          }
        </FooterWrapper>

        {
          isLoaging && <ActivityIndicator color={theme.colors.shape} style={{marginTop: 18}} />
        }
      </Footer>
    </Container>
  );
}