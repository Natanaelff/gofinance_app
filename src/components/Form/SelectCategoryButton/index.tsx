import React from "react";
import {
  Container,
  CategoryName,
  Icon,
} from './styles';

interface Props {
  title: string;
  onPress: () => void;
}

export function SelectCategoryButton({title, onPress} : Props) {
  return(
    <Container onPress={onPress}>
      <CategoryName>{title}</CategoryName>

      <Icon name="chevron-down" />
    </Container>
  );
}