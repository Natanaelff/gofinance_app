import React, {useState, useCallback} from "react";
import {ActivityIndicator} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthButton,
  SelectIcon,
  Month,
  LoaderContainer,
} from './styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {VictoryPie} from 'victory-native';
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {addMonths, subMonths, format} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import { useFocusEffect } from "@react-navigation/native";

import {HistoryCard} from '../../components/HistoryCard';
import { categories } from "../../utils/categories";
import { useAuth } from "../../hooks/auth";

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percentFormatted: string;
  percent: number;
}

export default function Resume() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [selectDate, setSelectDate] = useState(new Date()); 
  const [totalCategories, setTotalCategories] = useState<CategoryData[]>([]);

  const {user} = useAuth();

  function handleDateChange(action: 'next' | 'prev'){
    if(action === 'next'){
      setSelectDate(addMonths(selectDate, 1));
    } else {
      setSelectDate(subMonths(selectDate, 1));
    }
  }

  async function loadDate(){
    setIsLoading(true);
    const dataKey = `@goFinance:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensive = responseFormatted.filter((expensive: TransactionData) => 
      expensive.type === 'negative' &&
      new Date(expensive.date).getMonth() === selectDate.getMonth() &&
      new Date(expensive.date).getFullYear() === selectDate.getFullYear()
    );

    const expensiveTotal = expensive.reduce((accumulator: number, expensive: TransactionData) => {
      return accumulator + Number(expensive.amount);
    },0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensive.forEach((expensive: TransactionData) => {
        if(expensive.category === category.key){
          categorySum += Number(expensive.amount);
        }
      });

      if(categorySum > 0){
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const percent = (categorySum / expensiveTotal * 100);
        const percentFormatted = `${percent.toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent,
          percentFormatted,
        });
      }
    })

    setTotalCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadDate()
    },[selectDate])
  );

  return(
    <Container>
        <Header>
          <Title>Resumo por categoria</Title>
        </Header>

      {
        isLoading ? 
          <LoaderContainer>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </LoaderContainer>
        :

        <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight()
            }}
        >

          <MonthSelect>
            <MonthButton onPress={() => handleDateChange('prev')}>
              <SelectIcon name="chevron-left" />
            </MonthButton>

            <Month>{format(selectDate, 'MMMM, yyyy', {locale: ptBR})}</Month>

            <MonthButton onPress={() => handleDateChange('next')}>
              <SelectIcon name="chevron-right" />
            </MonthButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie 
              data={totalCategories}
              colorScale={totalCategories.map(category => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: theme.colors.shape,
                }
              }}
              labelRadius={65}
              x="percentFormatted"
              y="total"
            />
          </ChartContainer>

          {
            totalCategories.map(item => (
              <HistoryCard key={item.key} title={item.name} amount={item.totalFormatted} color={item.color} />
            ))
          }
        </Content>
      }
    </Container>
  );
}
