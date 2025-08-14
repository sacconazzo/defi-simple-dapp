import {
  Flex,
  Box,
  Stack,
  HStack,
  Menu,
  Center,
  Button,
  MenuButton,
  Avatar,
  Tooltip,
  Image,
  Link,
  Text,
  AvatarBadge,
  MenuList,
  MenuItem,
  useColorModeValue,
  Badge,
  keyframes,
  VStack,
} from '@chakra-ui/react';
// import Blockies from 'react-blockies';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { ColorModeSwitcher } from './ColorModeSwitcher';

import Logo from '../assets/logo.png';
import MetaLogo from '../assets/metamask.svg';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideDown = keyframes`
  0% { transform: translateY(-100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

export default function TitleBar(props) {
  // All hooks must be called at the top level
  const currentChain = props.chain;
  const explorer =
    (currentChain &&
      currentChain.blockExplorerUrls &&
      currentChain.blockExplorerUrls[0]) ||
    'https://etherscan.io/';
  const getChainIcon = chain => {
    return chain.icon;
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const shadowColor = useColorModeValue(
    'rgba(0, 0, 0, 0.1)',
    'rgba(0, 0, 0, 0.3)'
  );
  const bgGradientLight = useColorModeValue(
    'linear-gradient(135deg, white 0%, gray.50 100%)',
    'linear-gradient(135deg, gray.800 0%, gray.900 100%)'
  );
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box>
      <Flex
        h={16}
        shadow={`0 4px 20px ${shadowColor}`}
        px={6}
        py={3}
        w={'100vw'}
        pos="fixed"
        zIndex={'popover'}
        alignItems={'center'}
        justifyContent={'space-between'}
        bg={bgColor}
        borderBottom="2px solid"
        borderColor={borderColor}
        animation={`${slideDown} 0.5s ease-out`}
        backdropFilter="blur(10px)"
        bgGradient={bgGradientLight}
      >
        <HStack spacing={4}>
          <Box
            position="relative"
            _hover={{
              transform: 'scale(1.1)',
              transition: 'all 0.3s ease',
            }}
          >
            <Image w={40} src={Logo} alt="DeFi Logo" />
            <Box
              position="absolute"
              top={-2}
              left={-2}
              right={-2}
              bottom={-2}
              bgGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              filter="blur(8px)"
              opacity={0.3}
              zIndex={-1}
              borderRadius="full"
            />
          </Box>
          <VStack align="start" spacing={0}>
            <Text
              p={1}
              fontWeight="extrabold"
              fontSize="xl"
              bgGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              bgClip="text"
            >
              DeFi Simple dApp
            </Text>
            <Text fontSize="xs" color="gray.500" fontWeight="medium">
              Stake • Earn • Grow
            </Text>
          </VStack>
        </HStack>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={4}>
            <ColorModeSwitcher />

            {/* Chain Selector */}
            <Menu autoSelect={false}>
              <MenuButton
                as={Button}
                variant={'outline'}
                size="sm"
                leftIcon={
                  <Avatar size={'xs'} src={getChainIcon(currentChain)} />
                }
                rightIcon={
                  <Box
                    w={2}
                    h={2}
                    borderRadius="full"
                    bg={props.userInfo.account ? 'green.500' : 'red.500'}
                    animation={
                      props.userInfo.account
                        ? `${pulse} 2s ease-in-out infinite`
                        : 'none'
                    }
                  />
                }
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'md',
                }}
                transition="all 0.3s ease"
              >
                {currentChain?.chainName || 'Ethereum'}
              </MenuButton>
              <MenuList p={4} alignItems={'center'} minW="200px">
                <Center p={2}>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    Select Network
                  </Text>
                </Center>
                <Stack pt={3} spacing={2}>
                  {props.chains
                    ?.filter(c => !!c.contractAddress)
                    ?.map(chain => (
                      <MenuItem
                        key={chain.id}
                        onClick={() => props.onSelectChain?.(chain.id)}
                        _hover={{
                          bg: hoverBg,
                        }}
                      >
                        <HStack spacing={3} w="100%">
                          <Avatar size={'sm'} src={getChainIcon(chain)} />
                          <VStack align="start" spacing={0} flex={1}>
                            <Text fontWeight="medium">{chain.chainName}</Text>
                            <Text fontSize="xs" color="gray.500">
                              {chain.nativeCurrency?.symbol}
                            </Text>
                          </VStack>
                          {chain.id === currentChain.id && (
                            <Badge colorScheme="green" size="sm">
                              Active
                            </Badge>
                          )}
                        </HStack>
                      </MenuItem>
                    ))}
                </Stack>
              </MenuList>
            </Menu>

            {/* Wallet Connection */}
            <Menu autoSelect={false}>
              <MenuButton
                as={Button}
                variant={'solid'}
                colorScheme={props.userInfo.account ? 'green' : 'blue'}
                size="md"
                onClick={props.onConnect}
                cursor={'pointer'}
                leftIcon={
                  props.userInfo.account ? (
                    <Box
                      w={3}
                      h={3}
                      borderRadius="full"
                      bg="white"
                      animation={`${pulse} 2s ease-in-out infinite`}
                    />
                  ) : (
                    <Box w={3} h={3} borderRadius="full" bg="white" />
                  )
                }
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                transition="all 0.3s ease"
              >
                {props.userInfo.account ? 'Connected' : 'Connect Wallet'}
              </MenuButton>
              <MenuList p={4} alignItems={'center'} minW="300px">
                <Center p={2}>
                  {!props.userInfo.account && (
                    <VStack spacing={3}>
                      <Tooltip label="Please open & connect MetaMask">
                        <Image
                          size={'2xl'}
                          src={MetaLogo}
                          onClick={() => window.open('https://metamask.io/')}
                          cursor="pointer"
                          _hover={{
                            transform: 'scale(1.05)',
                          }}
                          transition="all 0.3s ease"
                        />
                      </Tooltip>
                      <Text fontSize="sm" color="gray.600" textAlign="center">
                        Connect your Web3 wallet to start staking
                      </Text>
                    </VStack>
                  )}
                  {props.userInfo.account && (
                    <VStack spacing={3}>
                      <Jazzicon
                        diameter={120}
                        seed={jsNumberForAddress(props.userInfo.account)}
                      />
                      <VStack spacing={1}>
                        <Text fontSize="sm" fontWeight="bold" color="gray.700">
                          Wallet Connected
                        </Text>
                        <Text
                          fontSize="xs"
                          color="green.500"
                          fontWeight="medium"
                        >
                          ✓ Ready to stake
                        </Text>
                      </VStack>
                    </VStack>
                  )}
                </Center>

                {props.userInfo.account && (
                  <>
                    <Center pt={3}>
                      <VStack spacing={1}>
                        <Text
                          fontSize="xs"
                          color="gray.500"
                          fontWeight="medium"
                        >
                          Current Network
                        </Text>
                        <Badge colorScheme="blue" size="sm">
                          {currentChain?.chainName || 'Ethereum Mainnet'}
                        </Badge>
                      </VStack>
                    </Center>

                    <Center pt={3}>
                      <Link
                        isExternal
                        href={`${explorer}address/${props.userInfo.account}`}
                        color="brand.500"
                        fontSize="xs"
                        fontWeight="medium"
                        _hover={{
                          textDecoration: 'underline',
                        }}
                      >
                        View on Explorer
                      </Link>
                    </Center>

                    <Center pt={2}>
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        fontFamily="mono"
                        maxW="200px"
                        isTruncated
                      >
                        {props.userInfo.account}
                      </Text>
                    </Center>
                  </>
                )}
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
