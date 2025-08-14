import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  keyframes,
} from '@chakra-ui/react';
import { FaCoins, FaChartLine, FaRocket, FaWallet } from 'react-icons/fa';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const StatCard = ({
  icon,
  label,
  value,
  subtitle,
  color,
  isAnimated = false,
}) => {
  // All hooks must be called at the top level
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const valueColor = useColorModeValue('gray.800', 'white');
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const subtitleColor = useColorModeValue('gray.500', 'gray.500');

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
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
        transition: 'all 0.3s ease',
      }}
      animation={isAnimated ? `${float} 3s ease-in-out infinite` : 'none'}
    >
      {/* Background gradient overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient={`linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`}
        opacity={0.1}
      />

      <VStack spacing={3} align="center" position="relative" zIndex={1}>
        <Box
          p={3}
          borderRadius="full"
          bgGradient={`linear-gradient(135deg, ${color}400 0%, ${color}600 100%)`}
          color="white"
          animation={isAnimated ? `${pulse} 2s ease-in-out infinite` : 'none'}
        >
          <Icon as={icon} boxSize={6} />
        </Box>

        <Text fontSize="2xl" fontWeight="bold" color={valueColor}>
          {value}
        </Text>

        <Text
          fontSize="sm"
          color={labelColor}
          textAlign="center"
          fontWeight="medium"
        >
          {label}
        </Text>

        {subtitle && (
          <Text fontSize="xs" color={subtitleColor} textAlign="center">
            {subtitle}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export const StatsGrid = ({ userInfo, chain }) => {
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
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const titleColor = useColorModeValue('gray.700', 'gray.300');

  return (
    <Box bg={bgColor} borderRadius="2xl" p={6} mb={6}>
      <Text
        fontSize="lg"
        fontWeight="bold"
        color={titleColor}
        mb={4}
        textAlign="center"
      >
        📊 Portfolio Overview
      </Text>

      <Box
        display="grid"
        gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(4, 1fr)']}
        gap={4}
      >
        <StatCard
          icon={FaWallet}
          label="Balance"
          value={`${userInfo.balance || 0} ${nativeSymbol}`}
          subtitle="Available to stake"
          color="blue"
          isAnimated={true}
        />

        <StatCard
          icon={FaCoins}
          label="Staked"
          value={`${userInfo.staked || 0} ${nativeSymbol}`}
          subtitle="Currently staked"
          color="green"
          isAnimated={userInfo.staked > 0}
        />

        <StatCard
          icon={FaRocket}
          label="Rewards"
          value={`${formatReward(
            (userInfo.staked || 0) * 0.2
          )} ${nativeSymbol}`}
          subtitle="+20% APY"
          color="purple"
          isAnimated={userInfo.staked > 0}
        />

        <StatCard
          icon={FaChartLine}
          label="Total Value"
          value={`$${(
            (userInfo.balance || 0) * (userInfo.price || 0)
          ).toLocaleString()}`}
          subtitle="USD equivalent"
          color="teal"
          isAnimated={true}
        />
      </Box>
    </Box>
  );
};

export default StatCard;
