import React from "react";
import { FlatList } from "react-native";

import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
} from './styles';

import { categories } from "../../utils/categories";
import { Button } from "../../components/Form/Button";

interface Category {
  key: string;
  name: string;
}

interface Props {
  category: Category;
  setCategory: (category: Category) => void;
  closeSelectCategory: () => void;
}

export function SelectCategory({category, setCategory, closeSelectCategory} : Props) {

  function handleCategorySelect(category: Category) {
    setCategory(category);
  }

  return(
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList 
        data={categories}
        style={{flex: 1, height: '100%'}}
        keyExtractor={(item) => item.key}
        renderItem={({item}) => (
          <Category onPress={() => handleCategorySelect(item)} isActive={category.key === item.key}>
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />

      <Footer>
        <Button onPress={closeSelectCategory} title="Selecionar" />
      </Footer>
    </Container>
  );
}