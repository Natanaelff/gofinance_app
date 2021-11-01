declare module "*.svg" {
  import React from "react";
  import {StopProps, SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}