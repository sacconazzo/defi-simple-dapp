import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { HelmetProvider } from 'react-helmet-async';
import Core from './comps/Core';
import theme from './theme';

function App() {
  return (
    <HelmetProvider>
      <ChakraProvider theme={theme}>
        <Core />
      </ChakraProvider>
    </HelmetProvider>
  );
}

export default App;
