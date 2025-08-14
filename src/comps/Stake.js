import {
  Box,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  // Stack,
  Button,
  Text,
  useColorModeValue,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  VStack,
  HStack,
  Icon,
  useToast,
  keyframes,
} from '@chakra-ui/react';
import { FaCoins, FaRocket, FaWallet, FaChartLine } from 'react-icons/fa';
import Web3 from 'web3';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

export default function Stake(props) {
  // All hooks must be called at the top level
  const col1 = useColorModeValue('gray.700', 'gray.300');
  const col2 = useColorModeValue('gray.900', 'gray.100');
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const valueBg = useColorModeValue('gray.50', 'gray.700');
  const valueBorder = useColorModeValue('gray.200', 'gray.600');
  const stakedBg = useColorModeValue('blue.50', 'blue.900');
  const stakedBorder = useColorModeValue('blue.200', 'blue.700');
  const stakedText = useColorModeValue('blue.700', 'blue.200');
  // const stakedTextSecondary = useColorModeValue('blue.700', 'blue.200');
  const greenBg = useColorModeValue('green.100', 'green.900');
  const greenText = useColorModeValue('green.800', 'green.100');
  const titleColor = useColorModeValue('gray.800', 'white');
  const subtitleColor = useColorModeValue('gray.700', 'gray.300');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');

  const info = props.userInfo;
  const formatVal = props.formatVal;
  const nativeSymbol = props.chain?.nativeCurrency?.symbol || 'ETH';

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
    fontWeight: 'bold',
  };

  const handleChange = event =>
    props.setValue(
      isNaN(event.target.value) ? info.balance : event.target.value
    );

  const handleSlider = slide => {
    const balance = (info.balance * slide) / 100;
    props.setValue(formatVal(balance));
  };

  const onStake = async () => {
    try {
      const currentProvider = props.detectCurrentProvider();
      const web3 = new Web3(currentProvider);
      const val = web3.utils.toWei(String(props.value), 'ether');

      toast({
        title: 'Staking in progress...',
        description: `Staking ${props.value} ${nativeSymbol}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      await props.contract.methods.stake().send({
        from: info.account,
        value: val,
      });

      toast({
        title: '🎉 Staking successful!',
        description: `Successfully staked ${props.value} ${nativeSymbol}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      toast({
        title: '❌ Staking failed',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const onRedeem = async () => {
    try {
      toast({
        title: 'Redeeming...',
        description: 'Processing your rewards',
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      await props.contract.methods.redeem().send({
        from: info.account,
      });

      toast({
        title: '💰 Rewards claimed!',
        description:
          'Your staked tokens and rewards have been sent to your wallet',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      toast({
        title: '❌ Redemption failed',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  return (
    <Box
      rounded={'2xl'}
      bg={bgColor}
      boxShadow={'xl'}
      p={8}
      border="2px solid"
      borderColor={borderColor}
      position="relative"
      overflow="hidden"
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top={-20}
        right={-20}
        w={40}
        h={40}
        bgGradient="linear-gradient(135deg, blue.100 0%, purple.100 100%)"
        borderRadius="full"
        opacity={0.1}
        _dark={{ opacity: 0.05 }}
      />

      <VStack spacing={6} align="stretch" position="relative" zIndex={1}>
        {props.isConnected ? (
          <>
            {/* Input Section */}
            <Box>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={titleColor}
                mb={4}
                textAlign="center"
              >
                🚀 Stake Your {nativeSymbol}
              </Text>

              <FormControl>
                <InputGroup size="lg">
                  <InputLeftElement
                    pointerEvents="none"
                    color={col1}
                    children={<Icon as={FaWallet} boxSize={5} />}
                  />
                  <Input
                    textAlign={'right'}
                    value={props.value}
                    onChange={handleChange}
                    placeholder={`Enter amount in ${nativeSymbol}`}
                    fontSize="lg"
                    fontWeight="bold"
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px rgba(102, 126, 234, 0.6)',
                    }}
                  />
                </InputGroup>

                <Box mt={4}>
                  <Slider
                    aria-label="stake-percentage"
                    focusThumbOnChange={false}
                    onChange={handleSlider}
                    value={
                      (Number(props.value || 0) / info.balance || 0) * 100 || 0
                    }
                    colorScheme="brand"
                    size="lg"
                  >
                    <SliderMark value={25} {...labelStyles}>
                      25%
                    </SliderMark>
                    <SliderMark value={50} {...labelStyles}>
                      50%
                    </SliderMark>
                    <SliderMark value={75} {...labelStyles}>
                      75%
                    </SliderMark>
                    <SliderTrack>
                      <SliderFilledTrack bgGradient="linear-gradient(90deg, brand.400 0%, brand.600 100%)" />
                    </SliderTrack>
                    <SliderThumb
                      boxSize={6}
                      bgGradient="linear-gradient(135deg, brand.500 0%, brand.700 100%)"
                      border="2px solid white"
                    />
                  </Slider>
                </Box>
              </FormControl>
            </Box>

            {/* Quick Actions */}
            <HStack spacing={3} justify="center">
              {[25, 50, 75, 100].map(percentage => (
                <Button
                  key={percentage}
                  size="sm"
                  variant="outline"
                  colorScheme="brand"
                  onClick={() => {
                    const amount = (info.balance * percentage) / 100;
                    props.setValue(formatVal(amount));
                  }}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md',
                  }}
                >
                  {percentage}%
                </Button>
              ))}
            </HStack>

            {/* Stake Button */}
            <Button
              isLoading={false}
              isDisabled={
                !props.isConnected ||
                Number(props.value) > info.balance ||
                Number(props.value) === 0
              }
              onClick={onStake}
              size="lg"
              variant="gradient"
              leftIcon={<Icon as={FaCoins} />}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'xl',
              }}
              _active={{
                transform: 'translateY(0)',
              }}
            >
              Stake {props.value} {nativeSymbol}
            </Button>

            {/* Value Display */}
            <Box
              bg={valueBg}
              borderRadius="xl"
              p={4}
              border="1px solid"
              borderColor={valueBorder}
            >
              <VStack spacing={2}>
                <HStack justify="space-between" w="100%">
                  <Text color="gray.600" fontSize="sm">
                    <Icon as={FaWallet} mr={2} />
                    Stake Value:
                  </Text>
                  <Text fontWeight="bold" color={col2}>
                    {(props.value * info.price).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </Text>
                </HStack>

                <HStack justify="space-between" w="100%">
                  <Text color="gray.600" fontSize="sm">
                    <Icon as={FaRocket} mr={2} />
                    Return:
                  </Text>
                  <Text fontWeight="bold" color="green.500">
                    {(props.value * 1.2 * info.price).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </Text>
                </HStack>

                <HStack justify="space-between" w="100%">
                  <Text color="gray.600" fontSize="sm">
                    <Icon as={FaChartLine} mr={2} />
                    Profit:
                  </Text>
                  <Text fontWeight="bold" color="purple.500">
                    +
                    {(props.value * 0.2 * info.price).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </>
        ) : (
          <VStack spacing={6}>
            <Icon as={FaWallet} boxSize={16} color="gray.400" />
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={subtitleColor}
              textAlign="center"
            >
              Connect Your Wallet to Start Staking
            </Text>
            <Text fontSize="md" color={descriptionColor} textAlign="center">
              Join thousands of users earning passive income through DeFi
              staking
            </Text>
            <Button
              size="lg"
              variant="gradient"
              leftIcon={<Icon as={FaWallet} />}
              onClick={props.onConnect}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'xl',
              }}
              animation={`${pulse} 2s ease-in-out infinite`}
            >
              Connect Wallet
            </Button>
          </VStack>
        )}

        {/* Staked Info Section */}
        {info.staked > 0 && (
          <Box
            bg={stakedBg}
            borderRadius="xl"
            p={6}
            border="2px solid"
            borderColor={stakedBorder}
            animation={`${slideIn} 0.5s ease-out`}
          >
            <VStack spacing={4}>
              <HStack spacing={3}>
                <Icon as={FaCoins} boxSize={6} color="blue.500" />
                <Text fontSize="lg" fontWeight="bold" color={stakedText}>
                  Your Staked Position
                </Text>
              </HStack>

              <VStack spacing={2} w="100%">
                <HStack justify="space-between" w="100%">
                  <Text color={stakedText} fontSize="sm">
                    Staked Amount:
                  </Text>
                  <Text fontWeight="bold" color={col2}>
                    {formatVal(info.staked)} {nativeSymbol}
                  </Text>
                </HStack>

                <HStack justify="space-between" w="100%">
                  <Text color={stakedText} fontSize="sm">
                    Current Value:
                  </Text>
                  <Text fontWeight="bold" color={col2}>
                    {(info.staked * info.price).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </Text>
                </HStack>

                <HStack justify="space-between" w="100%">
                  <Text color={stakedText} fontSize="sm">
                    Rewards Earned:
                  </Text>
                  <Text fontWeight="bold" color="green.500">
                    +{formatVal(info.staked * 0.2)} {nativeSymbol}
                  </Text>
                </HStack>

                <HStack justify="space-between" w="100%">
                  <Text color={stakedText} fontSize="sm">
                    Total to Redeem:
                  </Text>
                  <Text fontWeight="bold" color="purple.500">
                    {formatVal(info.staked * 1.2)} {nativeSymbol}
                  </Text>
                </HStack>
              </VStack>

              {info.isFilled && (
                <Box
                  bg={greenBg}
                  color={greenText}
                  px={4}
                  py={3}
                  borderRadius="lg"
                  fontSize="md"
                  fontWeight="bold"
                  textAlign="center"
                  w="100%"
                  _dark={{
                    bg: 'green.900',
                    color: 'green.100',
                  }}
                  animation={`${pulse} 2s ease-in-out infinite`}
                >
                  🎯 Pool Complete! Ready to Redeem
                </Box>
              )}

              <Button
                isLoading={info.staked > 0 && !info.isFilled}
                isDisabled={!info.isFilled}
                size="lg"
                variant="success"
                leftIcon={<Icon as={FaRocket} />}
                onClick={onRedeem}
                w="100%"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl',
                }}
              >
                {info.isFilled ? 'Redeem Rewards' : 'Pool Filling...'}
              </Button>
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
