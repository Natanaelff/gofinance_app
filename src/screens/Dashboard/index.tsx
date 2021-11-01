import React, {useEffect, useState, useCallback} from 'react';
import {ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LoaderContainer,
} from './styles';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import {useTheme} from 'styled-components';

import { useAuth } from '../../hooks/auth';

export interface DateListProps extends TransactionCardProps {
  id: string;
}

interface HighlightDateProps {
  total: string;
  lestTransactions: string;
}

interface HighlightDate {
  entries: HighlightDateProps;
  expensives: HighlightDateProps;
  amountTotal: HighlightDateProps;
}

export default function Dashboard() {
  const theme = useTheme();
  const {signout, user} = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransaction] = useState<DateListProps[]>([]);
  const [highlightDate, setHighlightDate] = useState<HighlightDate>({} as HighlightDate);
  const [greeting, setGreeting] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadTransaction();
    },[])
  )

  useEffect(() => {
    const currentHor = new Date().getHours()
    if(currentHor < 12) {
      setGreeting('Bom dia')
    } else if (currentHor >= 12 && currentHor < 18) {
      setGreeting('Boa tarde')
    } else {
      setGreeting('Boa noite')
    }
  },[]);

  function getLastTransactionDate(
    colletion: DateListProps[],
    type: 'positive' | 'negative',
  ){

    const collectionFiltered = colletion.filter(transactions => transactions.type === type);

    if (collectionFiltered.length === 0)
    return 0;
  

    const lestTransactions = new Date(
    Math.max.apply(Math, collectionFiltered
    .map(transactions => new Date(transactions.date).getTime())))

    return `${lestTransactions.getDate()} de ${lestTransactions.toLocaleString('pt-BR', {month: 'long'})}`
  }

  async function loadTransaction() {
    const dataKey = `@goFinance:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transacionsFormatted: DateListProps[] = transactions.map((item: DateListProps) => {

      if (item.type === 'positive') {
        entriesTotal += Number(item.amount);
      } else {
        expensiveTotal += Number(item.amount);
      }

      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      };
    });

    setTransaction(transacionsFormatted);

    const lestTransactionsEntries = getLastTransactionDate(transactions, 'positive');
    const lestTransactionsExpensives = getLastTransactionDate(transactions, 'negative');
    
    const totalInterval = lestTransactionsExpensives === 0 ? 'Não há transações' : `01 à ${lestTransactionsExpensives}`

    const total = entriesTotal - expensiveTotal;

    setHighlightDate({
      entries: {
        total: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lestTransactions: lestTransactionsEntries === 0 ? 'Não há transações' : `Última entrada dia ${lestTransactionsEntries}`
      },
      expensives: {
        total: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lestTransactions: lestTransactionsExpensives === 0 ? 'Não há transações' : `Última saída dia ${lestTransactionsExpensives}`
      },
      amountTotal: {
        total: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lestTransactions: totalInterval,
      }
    })

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransaction();
  },[])

  return (
    <Container>
      {
        isLoading ? 
        <LoaderContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoaderContainer>
       :
      <>
        <Header>
          <UserWrapper>
            <UserInfo>
              <Photo source={{uri: user.photo}} />

              <User>
                <UserGreeting>{greeting},</UserGreeting>
                <UserName>{user.name}</UserName>
              </User>
            </UserInfo>

            <LogoutButton onPress={signout}>
              <Icon name="power" />
            </LogoutButton>
          </UserWrapper>
        </Header>

        <HighlightCards>
          <HighlightCard
            type="up"
            title="Entradas"
            amount={highlightDate.entries.total}
            lastTransaction={highlightDate.entries.lestTransactions}
          />
          <HighlightCard
            type="down"
            title="Saídas"
            amount={highlightDate.expensives.total}
            lastTransaction={highlightDate.expensives.lestTransactions}
          />
          <HighlightCard
            type="total"
            title="Total"
            amount={highlightDate.amountTotal.total}
            lastTransaction={highlightDate.amountTotal.lestTransactions}
          />
        </HighlightCards>

        <Transactions>
          <Title>Listagem</Title>

          <TransactionList 
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TransactionCard data={item} />
            )}
          />
        </Transactions>
      </>
      }
    </Container>
  );
}

