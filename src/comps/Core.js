import {
  Flex,
  Box,
  Stack,
  Link,
  Heading,
  Text,
  useColorModeValue,
  Grid,
  useDisclosure,
  VStack,
  HStack,
  Icon,
  keyframes,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
// import ReactDOMServer from 'react-dom/server';
import Web3 from 'web3';
import { Helmet } from 'react-helmet-async';
import { FaRocket, FaChartLine, FaCoins, FaGlobe } from 'react-icons/fa';

import TitleBar from './TitleBar';
import Stake from './Stake';
import Info from './Info';
// import StatsGrid from './StatsCard';
import PoolProgress from './PoolProgress';
import LiveStats from './LiveStats';
import BenefitsSection from './BenefitsSection';

import Contract from '../assets/contract-info';
import CHAINS from '../assets/chains';

let contract;
let refresh;

// export function encodeSvg(reactElement) {
//   return (
//     'data:image/svg+xml,' +
//     escape(ReactDOMServer.renderToStaticMarkup(reactElement))
//   );
// }

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
  50% { box-shadow: 0 0 30px rgba(102, 126, 234, 0.6); }
  100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
`;

export default function Core() {
  const [refreshCounter, setRefresh] = useState(0);
  const {
    isOpen: isInfo,
    onOpen: onInfo,
    onClose: onInfoClose,
  } = useDisclosure();
  const [isConnected, setIsConnected] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState(
    Number(localStorage.getItem('selectedChainId') || 1)
  );
  const [userInfo, setUserInfo] = useState({
    balance: 0,
    account: undefined,
    chainId: undefined,
    price: 0,
    staked: 0,
    isFilled: false,
    rate: 0,
  });
  const [value, setValue] = useState(0);

  // Hooks for color mode values
  const featureBgColor = useColorModeValue('white', 'gray.800');
  const featureBorderColor = useColorModeValue('gray.200', 'gray.700');

  const formatVal = val => Math.trunc(val * 100000) / 100000;

  useEffect(() => {
    function checkConnectedWallet() {
      const connected = JSON.parse(localStorage.getItem('isConnected'));
      if (connected) {
        setIsConnected(true);
        onConnect();
      }
    }
    checkConnectedWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isConnected) onConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCounter]);

  useEffect(() => {
    // Quando cambia la chain selezionata, ricollega
    if (isConnected) onConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChainId]);

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    return provider;
  };

  const getPrice = async priceSymbol => {
    try {
      const data = await fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${priceSymbol}&tsyms=USD`
      );
      const price = await data.json();
      return price.USD;
    } catch (e) {
      return 0;
    }
  };

  const currentChain =
    CHAINS.find(c => c.id === Number(selectedChainId)) || CHAINS[0];

  const changeChain = async (web3, targetChain) => {
    const hexChainId = web3.utils.toHex(targetChain.id);
    try {
      // prova a switchare se già presente
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
    } catch (switchError) {
      // 4902: catena non presente, aggiungila
      if (switchError && switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: hexChainId,
              chainName: targetChain.chainName,
              nativeCurrency: targetChain.nativeCurrency,
              rpcUrls: targetChain.rpcUrls,
              blockExplorerUrls: targetChain.blockExplorerUrls,
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  };

  const onConnect = async () => {
    clearTimeout(refresh);
    const ethTimeout = setTimeout(() => {
      window.location.reload(false);
    }, 25000);
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          );
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        if (currentChain.id !== chainId) await changeChain(web3, currentChain);
        const account = userAccount[0];
        const ethBalance = web3.utils.fromWei(
          await web3.eth.getBalance(account),
          'ether'
        );

        const contractAddress = currentChain.contractAddress || Contract.cnt;
        contract = new web3.eth.Contract(Contract.abi, contractAddress);
        const status = await contract.methods.status().call({ from: account });
        const staked = formatVal(
          Number(web3.utils.fromWei(status.original_, 'ether'))
        );
        const rate =
          (Number(status.balance_) / Number(status.original_) / 1.2) * 100;
        const isFilled = status.filled_;

        const price = await getPrice(currentChain.priceSymbol);

        saveUserInfo(
          ethBalance,
          account,
          currentChain.id,
          price,
          staked,
          isFilled,
          rate
        );
        if (userAccount.length === 0) {
          console.log('Please connect to meta mask');
        }
      }
    } catch (err) {
      console.log(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
      );
    }
    clearTimeout(ethTimeout);
    if (JSON.parse(localStorage.getItem('isConnected')))
      refresh = setTimeout(() => setRefresh(refreshCounter + 1), 5000);
  };

  const saveUserInfo = (
    ethBalance,
    account,
    chainId,
    price,
    staked,
    isFilled,
    rate
  ) => {
    window.localStorage.setItem('isConnected', true); //user persisted data
    const balance = formatVal(ethBalance);
    if (account !== userInfo.account) setValue(balance);
    setUserInfo({
      balance,
      account,
      chainId,
      price,
      staked,
      isFilled,
      rate,
    });
    setIsConnected(true);
  };

  const onSelectChain = async chainId => {
    localStorage.setItem('selectedChainId', String(chainId));
    setSelectedChainId(Number(chainId));
  };

  return (
    <Flex
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.900')}
      minH="100vh"
    >
      <Box textAlign="center" minW={'100vw'} overflowY="auto">
        <Grid h="100vh">
          <Helmet>
            <title>DeFi Simple dApp — Simple • Fast • Profitable</title>
            <meta
              name="description"
              content="Simple staking dApp. Stake native tokens and redeem with +20% when the pool fills. Multichain, minimal UI."
            />
            <link rel="canonical" href="https://20percent.giona.tech/" />
            <meta
              property="og:title"
              content="DeFi Simple dApp — Simple / Fast / Profitable"
            />
            <meta
              property="og:description"
              content="Simple staking dApp. Stake native tokens and redeem with +20%."
            />
            <meta property="og:url" content="https://20percent.giona.tech/" />
            <meta
              property="og:image"
              content={process.env.PUBLIC_URL + '/logo512.png'}
            />
            <meta name="twitter:card" content="summary_large_image" />
          </Helmet>
          <TitleBar
            userInfo={userInfo}
            onConnect={onConnect}
            chain={currentChain}
            chains={CHAINS}
            onSelectChain={onSelectChain}
          />

          <Stack spacing={8} mx={'auto'} w={['95vw', 600, 800]} py={12} px={6}>
            {/* Hero Section */}
            <VStack spacing={6} pt={50} align={'center'}>
              <Box
                position="relative"
                animation={`${float} 3s ease-in-out infinite`}
              >
                <Heading
                  fontSize={['3xl', '4xl', '5xl']}
                  bgGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  bgClip="text"
                  fontWeight="extrabold"
                  textAlign="center"
                >
                  DeFi Simple dApp
                </Heading>
                <Box
                  position="absolute"
                  top={-2}
                  left={-2}
                  right={-2}
                  bottom={-2}
                  bgGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  filter="blur(20px)"
                  opacity={0.3}
                  zIndex={-1}
                  animation={`${glow} 2s ease-in-out infinite`}
                />
              </Box>

              <Text
                fontSize={['lg', 'xl']}
                color={useColorModeValue('gray.600', 'gray.400')}
                textAlign="center"
                maxW="600px"
                lineHeight="tall"
              >
                <Link onClick={onInfo} color="brand.500" fontWeight="semibold">
                  ✨ Simple • ⚡ Fast • 🚀 Profitable
                </Link>{' '}
                <Link onClick={onInfo} color="brand.500">
                  <InfoIcon />
                </Link>
              </Text>

              {/* Feature highlights */}
              <Wrap spacing={4} justify="center" pt={4}>
                {[
                  { icon: FaRocket, text: '20% APY', color: 'green.500' },
                  { icon: FaGlobe, text: 'Multi-chain', color: 'blue.500' },
                  {
                    icon: FaCoins,
                    text: 'Instant Rewards',
                    color: 'purple.500',
                  },
                  {
                    icon: FaChartLine,
                    text: 'No Lock Period',
                    color: 'orange.500',
                  },
                ].map((feature, index) => (
                  <WrapItem key={index}>
                    <HStack
                      spacing={2}
                      px={4}
                      py={2}
                      bg={featureBgColor}
                      borderRadius="full"
                      boxShadow="md"
                      border="1px solid"
                      borderColor={featureBorderColor}
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                      transition="all 0.3s ease"
                    >
                      <Icon
                        as={feature.icon}
                        color={feature.color}
                        boxSize={4}
                      />
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.700"
                        _dark={{ color: 'gray.300' }}
                      >
                        {feature.text}
                      </Text>
                    </HStack>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>

            {/* Stats Grid - Only show when connected */}
            {/* {isConnected && (
              <StatsGrid userInfo={userInfo} chain={currentChain} />
            )} */}

            {/* Pool Progress - Only show when connected */}
            {isConnected && userInfo.staked > 0 && (
              <PoolProgress
                rate={userInfo.rate}
                isFilled={userInfo.isFilled}
                staked={userInfo.staked}
                chain={currentChain}
              />
            )}

            {/* Main Staking Interface */}
            <Stake
              isConnected={isConnected}
              userInfo={userInfo}
              formatVal={formatVal}
              value={value}
              setValue={setValue}
              contract={contract}
              detectCurrentProvider={detectCurrentProvider}
              onConnect={onConnect}
              chain={currentChain}
            />

            {/* Benefits Section - Always visible */}
            <BenefitsSection />

            {/* Live Community Stats - Always visible */}
            <LiveStats userInfo={userInfo} chain={currentChain} />

            {/* Footer */}
            <VStack spacing={4} align={'center'} pt={8}>
              <Text fontSize={'lg'} color={'gray.600'} textAlign="center">
                🔍 See the{' '}
                <Link
                  href={`${
                    (currentChain.blockExplorerUrls &&
                      currentChain.blockExplorerUrls[0]) ||
                    'https://etherscan.io/'
                  }address/${currentChain.contractAddress || Contract.cnt}`}
                  isExternal
                  color={'brand.500'}
                  fontWeight="semibold"
                  _hover={{
                    textDecoration: 'underline',
                  }}
                >
                  smart contract
                </Link>{' '}
                on chain ✌️
              </Text>

              <Text
                fontSize="sm"
                color="gray.500"
                textAlign="center"
                maxW="500px"
              >
                Built with ❤️ for the global DeFi community. Secure and
                transparent.
              </Text>
            </VStack>
          </Stack>
        </Grid>
      </Box>
      <Info onClose={onInfoClose} isOpen={isInfo} />
    </Flex>
  );
}
