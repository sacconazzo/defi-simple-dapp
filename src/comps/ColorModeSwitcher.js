import React from 'react';
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  keyframes,
} from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

// const rotate = keyframes`
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// `;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

export const ColorModeSwitcher = props => {
  // All hooks must be called at the top level
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.600');
  const iconColor = useColorModeValue('gray.700', 'yellow.400');

  return (
    <IconButton
      size={{ base: 'sm', md: 'md' }}
      fontSize={{ base: 'md', md: 'lg' }}
      aria-label={`Switch to ${text} mode`}
      variant="ghost"
      color={iconColor}
      bg={bgColor}
      borderRadius="xl"
      marginLeft="2"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      _hover={{
        bg: hoverBgColor,
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      }}
      _active={{
        transform: 'translateY(0)',
      }}
      transition="all 0.3s ease"
      animation={`${pulse} 2s ease-in-out infinite`}
      _focus={{
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.6)',
      }}
      {...props}
    />
  );
};
