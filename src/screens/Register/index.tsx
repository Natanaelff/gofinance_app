import React, {useState} from "react";
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {useNavigation} from '@react-navigation/native';
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from './styles';
import { useAuth } from "../../hooks/auth";

import {InputForm} from '../../components/Form/InputForm';
import {Button} from '../../components/Form/Button';
import {TypeButton} from '../../components/Form/TypeButton';
import {SelectCategoryButton} from '../../components/Form/SelectCategoryButton';
import {SelectCategory} from "../SelectCategory";

interface FormDate {
  name: string;
  amount: string;
}

interface PropsError {
  name: string;
  amount: number;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup.number().typeError('informe um valor numérico').positive('O valor não pode ser negativo').required('Preço é obrigatório'),
});

export default function Register() {
  const navigation = useNavigation();
  const [buttonType, setButtonType] = useState('');
  const [category, setCategory] = useState({
    key: 'category',
    name: 'categoria',
  });
  const [visible, setVisible] = useState(false);

  const {user} = useAuth();


  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema)
  });

  async function handleRegister(form: FormDate) {
    if (!buttonType) {
      return Alert.alert('Selecione o tipo da transação')
    };

    if (category.key === 'category') {
      return Alert.alert('Selecione a categoria')
    };

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: buttonType,
      category: category.key,
      date: new Date(),
    }

    try {
      const dataKey = `@goFinance:transactions_user:${user.id}`;

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dateFormated = [
        ...currentData,
        newTransaction,
      ];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dateFormated));

      reset();
      setButtonType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });

      navigation.navigate('Listagem');

    } catch (error) {
      Alert.alert('Não foi possível salvar');
    }
  }

  function handleButtonFocused(type: 'positive' | 'negative') {
    setButtonType(type);
  }

  function handleOpenModal() {
    setVisible(true);
  }

  function handleCloseModal() {
    setVisible(false);
  }

  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
          <Header>
            <Title>Cadastro</Title>
          </Header>

          <Form>
            <Fields>
              <InputForm error={errors.name && errors.name.message} name="name" control={control} placeholder="Nome" autoCapitalize="sentences" autoCorrect={false} />

              <InputForm error={errors.amount && errors.amount.message} name="amount" control={control} placeholder="Preço" keyboardType="numeric" />

              <TransactionTypes>
                <TypeButton type="up" title="Entrada" onPress={() => handleButtonFocused('positive')} isActive={buttonType === 'positive'} />
                <TypeButton type="down" title="Saída" onPress={() => handleButtonFocused('negative')} isActive={buttonType === 'negative'} />
              </TransactionTypes>

              <SelectCategoryButton  title={category.name} onPress={handleOpenModal} />
            </Fields>

            <Button onPress={handleSubmit(handleRegister)} title="Enviar" />
          </Form>

          <Modal visible={visible}>
            <SelectCategory 
              category={category}
              setCategory={setCategory}
              closeSelectCategory={handleCloseModal}
              />
          </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}