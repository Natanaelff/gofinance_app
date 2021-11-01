import React from "react";
import {
  Container,
  ImageContainer,
  Title,
} from './styles';
import {RectButtonProps} from "react-native-gesture-handler";
import {SvgProps} from "react-native-svg";

interface Props extends RectButtonProps {
  title: string;
  svg: React.FC<SvgProps>;
}

export function SignInSocialButton({title, svg: Svg, ...rest} : Props) {
  return(
    <Container {...rest}>
      <ImageContainer>
        <Svg />
      </ImageContainer>
      <Title>{title}</Title>
    </Container>
  );
}