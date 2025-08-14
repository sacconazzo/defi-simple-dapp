import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Progress,
  useColorModeValue,
  keyframes,
  Icon,
} from '@chakra-ui/react';
import { FaFire, FaTrophy, FaHourglassHalf } from 'react-icons/fa';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0, -30px, 0); }
  70% { transform: translate3d(0, -15px, 0); }
  90% { transform: translate3d(0, -4px, 0); }
`;

const PoolProgress = ({ rate, isFilled, staked, chain }) => {
  // All hooks must be called at the top level
  const nativeSymbol = chain?.nativeCurrency?.symbol || 'ETH';

  // Funzione per formattare i reward con più precisione per valori piccoli
  const formatReward = reward => {
    if (reward === 0) return '0.0000';
    if (reward < 0.0001) return reward.toFixed(8);
    if (reward < 0.001) return reward.toFixed(6);
    if (reward < 0.01) return reward.toFixed(5);
    if (reward < 0.1) return reward.toFixed(4);
    return reward.toFixed(3);
  };
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const progressBg = useColorModeValue('gray.200', 'gray.700');
  const stakedBg = useColorModeValue('gray.50', 'gray.700');
  const stakedBorder = useColorModeValue('gray.200', 'gray.600');
  const stakedText = useColorModeValue('gray.600', 'gray.400');
  const stakedTextSecondary = useColorModeValue('gray.500', 'gray.500');
  const greenBg = useColorModeValue('green.100', 'green.900');
  const greenText = useColorModeValue('green.800', 'green.100');

  const getProgressColor = rate => {
    if (rate >= 80) return 'green';
    if (rate >= 60) return 'yellow';
    if (rate >= 40) return 'orange';
    return 'red';
  };

  const getStatusIcon = () => {
    if (isFilled) return FaTrophy;
    if (rate >= 80) return FaFire;
    return FaHourglassHalf;
  };

  const getStatusText = () => {
    if (isFilled) return '🎉 Pool Complete! Ready to Redeem';
    if (rate >= 80) return '🔥 Almost There! Pool Nearly Full';
    if (rate >= 60) return '⚡ Great Progress! Keep Going';
    if (rate >= 40) return '📈 Building Momentum';
    return '🚀 Pool Building - Early Stage';
  };

  const getStatusColor = () => {
    if (isFilled) return 'green.500';
    if (rate >= 80) return 'orange.500';
    if (rate >= 60) return 'yellow.500';
    if (rate >= 40) return 'blue.500';
    return 'gray.500';
  };

  return (
    <Box
      bg={bgColor}
      border="2px solid"
      borderColor={borderColor}
      borderRadius="2xl"
      p={6}
      boxShadow="lg"
      position="relative"
      overflow="hidden"
      mb={6}
    >
      {/* Background pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.05}
        bgGradient="linear-gradient(45deg, transparent 30%, rgba(102, 126, 234, 0.1) 50%, transparent 70%)"
        animation={`${shimmer} 3s ease-in-out infinite`}
      />

      <VStack spacing={4} align="stretch" position="relative" zIndex={1}>
        <HStack justify="space-between" align="center">
          <HStack spacing={3}>
            <Icon
              as={getStatusIcon()}
              boxSize={6}
              color={getStatusColor()}
              animation={
                isFilled ? `${bounce} 1s ease-in-out infinite` : 'none'
              }
            />
            <Text
              fontSize="lg"
              fontWeight="bold"
              color={useColorModeValue('gray.800', 'white')}
            >
              Pool Status
            </Text>
          </HStack>

          <Box
            px={3}
            py={1}
            borderRadius="full"
            bg={getStatusColor()}
            color="white"
            fontSize="sm"
            fontWeight="bold"
          >
            {rate.toFixed(1)}%
          </Box>
        </HStack>

        <Text
          fontSize="md"
          color={getStatusColor()}
          fontWeight="medium"
          textAlign="center"
          py={2}
        >
          {getStatusText()}
        </Text>

        <Box>
          <Progress
            value={rate}
            size="lg"
            borderRadius="full"
            bg={progressBg}
            sx={{
              '& > div': {
                background: `linear-gradient(90deg, ${getProgressColor(
                  rate
                )}.400 0%, ${getProgressColor(rate)}.600 100%)`,
                borderRadius: 'full',
                transition: 'all 0.5s ease',
              },
            }}
            mb={3}
          />

          <HStack justify="space-between" fontSize="sm" color="gray.600">
            <Text>0%</Text>
            <Text>50%</Text>
            <Text>100%</Text>
          </HStack>
        </Box>

        {staked > 0 && (
          <Box
            bg={stakedBg}
            borderRadius="xl"
            p={4}
            border="1px solid"
            borderColor={stakedBorder}
          >
            <VStack spacing={2}>
              <Text fontSize="sm" color={stakedText} fontWeight="medium">
                Your Stake: {staked} {nativeSymbol}
              </Text>

              <Text fontSize="sm" color={stakedTextSecondary}>
                Reward: +{formatReward(staked * 0.2)} {nativeSymbol}
              </Text>

              {isFilled && (
                <Box
                  bg={greenBg}
                  color={greenText}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  fontSize="sm"
                  fontWeight="bold"
                  textAlign="center"
                  _dark={{
                    bg: 'green.900',
                    color: 'green.100',
                  }}
                >
                  🎯 Ready to Redeem! Click the Redeem button below
                </Box>
              )}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default PoolProgress;
