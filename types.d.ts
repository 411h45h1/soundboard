import React from 'react';
import 'react-native';
import { ImageSourcePropType } from 'react-native';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: React.ComponentProps<React.ComponentType>;
    }
  }
}

declare module '*.png' {
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.jpeg' {
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.gif' {
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.svg' {
  const value: ImageSourcePropType;
  export default value;
}
