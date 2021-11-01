import styled, {css} from "styled-components/native";
import {RectButton} from 'react-native-gesture-handler';
import {Feather} from '@expo/vector-icons';
import { RFValue } from "react-native-responsive-fontsize";

interface IconProps {
  type: 'up' | 'down';
}

interface ButtonProps {
  isActive: boolean;
  type: 'up' | 'down';
}

export const Container = styled.View<ButtonProps>`
  width: 48%;
  border-width: ${({isActive}) => isActive ? 0 : 1.5}px;
  border-style: solid;
  border-color: ${({theme}) => theme.colors.text};
  border-radius: 5px;
  
  ${({isActive, type}) => isActive && type === 'up' && css`
  background-color: 1.5px solid ${({theme}) => theme.colors.success_light};
  `};
  
  ${({isActive, type}) => isActive && type === 'down' && css`
  background-color: 1.5px solid ${({theme}) => theme.colors.attention_light};
  `};
`;

export const Button = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const Icon = styled(Feather)<IconProps>`
  font-size: ${RFValue(24)}px;
  margin-right: 12px;

  color: ${({theme, type}) => type === 'up' ? theme.colors.success : theme.colors.attention};
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.title};
  font-size: ${RFValue(14)}px;
`;