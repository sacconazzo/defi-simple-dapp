import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: '#E6F6FF',
    100: '#BAE3FF',
    200: '#7CC4FA',
    300: '#47A3F3',
    400: '#2186EB',
    500: '#0967D2',
    600: '#0552B5',
    700: '#03449E',
    800: '#01337D',
    900: '#002159',
  },
  success: {
    50: '#F0FFF4',
    100: '#C6F6D5',
    200: '#9AE6B4',
    300: '#68D391',
    400: '#48BB78',
    500: '#38A169',
    600: '#2F855A',
    700: '#276749',
    800: '#22543D',
    900: '#1C4532',
  },
  gradient: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    dark: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  },
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'bold',
      borderRadius: 'xl',
      _focus: {
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.6)',
      },
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        _active: {
          bg: 'brand.700',
          transform: 'translateY(0)',
        },
      },
      gradient: {
        bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        _hover: {
          bgGradient: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          transform: 'translateY(-2px)',
          boxShadow: 'xl',
        },
      },
      success: {
        bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: 'white',
        _hover: {
          bgGradient: 'linear-gradient(135deg, #45a1f0 0%, #00e6f0 100%)',
          transform: 'translateY(-2px)',
          boxShadow: 'xl',
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: 'white',
        borderRadius: '2xl',
        boxShadow: 'xl',
        border: '1px solid',
        borderColor: 'gray.100',
        _dark: {
          bg: 'gray.800',
          borderColor: 'gray.700',
        },
      },
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: 'xl',
        border: '2px solid',
        borderColor: 'gray.200',
        _focus: {
          borderColor: 'brand.500',
          boxShadow: '0 0 0 1px rgba(102, 126, 234, 0.6)',
        },
        _dark: {
          borderColor: 'gray.600',
          _focus: {
            borderColor: 'brand.400',
          },
        },
      },
    },
  },
};

const styles = {
  global: {
    body: {
      bg: 'gray.50',
      color: 'gray.900',
      _dark: {
        bg: 'gray.900',
        color: 'gray.100',
      },
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  components,
  styles,
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
});

export default theme;
