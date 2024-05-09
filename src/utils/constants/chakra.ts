import { ComponentStyleConfig, UseToastOptions } from '@chakra-ui/react';

const Button: ComponentStyleConfig = {
  defaultProps: {
    colorScheme: 'teal',
    size: 'lg',
  },
};

const Checkbox: ComponentStyleConfig = {
  baseStyle: {
    control: {
      borderRadius: '5px',
      borderWidth: '0.83px',
      bg: '#fff',
      borderColor: '#36A1CE',

      _checked: {
        borderRadius: '5px',
        bg: '#36A1CE',
        borderColor: '#36A1CE',

        _hover: {
          bg: '#3CB3E5',
          borderColor: '#3CB3E5',
        },
      },
      _hover: {
        borderColor: '#3CB3E5',
        color: '#fff',
      },

      _disabled: {
        bg: '#3CB3E5',
        borderColor: '#3CB3E5',
      },
    },
  },
};

export const components = {
  Button,
  Checkbox,
};

export const breakpoints = {
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
  '2xl': '96em',
};

export const space = {
  4: '4px',
  8: '8px',
  16: '16px',
  24: '24px',
  32: '32px',
  40: '40px',
  48: '48px',
  56: '56px',
  64: '64px',
  80: '80px',
  96: '96px',
  148: '148px',
};

export const colors = {
  blue: {
    50: '#F6FCFF',
    100: '#E2F4FB',
    200: '#C3E7F7',
    300: '#3CB3E5',
    400: '#36A1CE',
    500: '#308FB7',
    600: '#2D86AC',
    700: '#246B89',
    800: '#1B5167',
    900: '#153F50',
  },
  violet: {
    50: '#E9E8ED',
    100: '#DDDCE3',
    200: '#BAB7C6',
    300: '#1F1646',
    400: '#1C143F',
    500: '#191238',
    600: '#171135',
    700: '#130D2A',
    800: '#0E0A1F',
    900: '#0B0819',
  },
  orange: {
    50: '#FFEFEA',
    100: '#FFE7E0',
    200: '#FFCEBF',
    300: '#FF6131',
    400: '#E6572C',
    500: '#CC4E27',
    600: '#BF4925',
    700: '#993A1D',
    800: '#732C16',
    900: '#592211',
  },
  grey: {
    50: '#E9E9E9',
    100: '#DEDEDE',
    200: '#BABABA',
    300: '#222',
    400: '#1F1F1F',
    500: '#1B1B1B',
    600: '#1A1A1A',
    700: '#141414',
    800: '#0F0F0F',
    900: '#0C0C0C',
  },
  green: {
    50: '#E6F5F0',
    100: '#99D4C2',
    200: '#6EC2A8',
    300: '#30A883',
    400: '#059669',
    500: '#04694A',
    600: '#035C40',
  },
};

export const toastDefaultOptions: UseToastOptions = {
  position: 'bottom-right',
  isClosable: true,
};
