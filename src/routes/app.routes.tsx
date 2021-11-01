import React from "react";
import {Platform} from 'react-native';
import { useTheme } from "styled-components";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Feather} from '@expo/vector-icons';

import Dashboard from "../screens/Dashboard";
import Register from "../screens/Register";
import Resume from "../screens/Resume";

const {Navigator, Screen} = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();

  return(
    <Navigator
      screenOptions={() => ({
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text,
          tabBarLabelPosition: 'beside-icon',
          tabBarStyle: {
            paddingVertical: Platform.OS === 'ios' ? 18 : 0,
            marginBottom: 18,
          }
      })}
    >
      <Screen
        name="Listagem"
        component={Dashboard}
        options={{
          headerShown: false,
          tabBarIcon: (({size, color}) => (
            <Feather name="list" size={size} color={color} />
          ))
        }}
      />

      <Screen
        name="Cadastrar"
        component={Register}
        options={{
          headerShown: false,
          tabBarIcon: (({size, color}) => (
            <Feather name="dollar-sign" size={size} color={color} />
          ))
        }}
      />

      <Screen
        name="Resumo"
        component={Resume}
        options={{
          headerShown: false,
          tabBarIcon: (({size, color}) => (
            <Feather name="pie-chart" size={size} color={color} />
          ))
        }}
      />
    </Navigator>
  );
}