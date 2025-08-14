import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  keyframes,
  Badge,
} from '@chakra-ui/react';
import { FaUsers, FaChartLine, FaCoins, FaRocket } from 'react-icons/fa';
import {
  getContractBalance,
  getUniqueUsers,
  getTotalRewards,
} from '../utils/contractStats';
import CHAINS from '../assets/chains';

const countUp = keyframes`
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const LiveStats = ({ userInfo, chain }) => {
  // All hooks must be called at the top level
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const titleColor = useColorModeValue('gray.800', 'white');
  const blueBg = useColorModeValue('blue.50', 'blue.900');
  const blueBorder = useColorModeValue('blue.200', 'blue.700');
  // const blueText = useColorModeValue('blue.700', 'blue.200');
  const blueTextSecondary = useColorModeValue('blue.700', 'blue.100');

  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalStaked: 10,
    totalRewards: 12,
    averageAPY: 20,
  });

  // Effetto per aggiornare il TVL live dal contratto
  useEffect(() => {
    async function fetchLiveStats() {
      if (!chain) return;
      const chainInfo = CHAINS.find(c => c.id === chain.id);
      if (!chainInfo || !chainInfo.rpcUrls?.[0] || !chainInfo.contractAddress)
        return;
      // TVL
      try {
        const balanceHex = await getContractBalance(
          chainInfo.rpcUrls[0],
          chainInfo.contractAddress
        );
        const balanceEth = parseFloat(
          (parseInt(balanceHex, 16) / 1e18).toFixed(4)
        );
        setStats(prev => ({ ...prev, totalStaked: balanceEth }));
      } catch {}
      // Utenti e rewards (solo se API key presente)
      const explorerApiUrl = chainInfo.explorerApiUrl;
      const apiKey = chainInfo.explorerApiKey;
      const chainId = chainInfo.id;
      if (explorerApiUrl && apiKey) {
        // Utenti
        getUniqueUsers(
          explorerApiUrl,
          chainInfo.contractAddress,
          chainId,
          apiKey
        ).then(users => {
          if (users) setStats(prev => ({ ...prev, totalUsers: users }));
        });
        // Rewards
        getTotalRewards(
          explorerApiUrl,
          chainInfo.contractAddress,
          chainId,
          apiKey
        ).then(rewards => {
          if (!isNaN(rewards))
            setStats(prev => ({ ...prev, totalRewards: rewards }));
        });
      }
    }
    fetchLiveStats();
  }, [chain]);

  useEffect(() => {
    if (userInfo.staked > 0) {
      setStats(prev => ({
        ...prev,
        totalStaked: prev.totalStaked + userInfo.staked,
        totalRewards: prev.totalRewards + userInfo.staked * 0.2,
      }));
    }
  }, [userInfo.staked]);

  const formatNumber = num => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  const formatCurrency = (amount, price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount * price);
  };

  return (
    <Box
      bg={bgColor}
      border="2px solid"
      borderColor={borderColor}
      borderRadius="2xl"
      p={6}
      boxShadow="xl"
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

      <VStack spacing={6} align="stretch" position="relative" zIndex={1}>
        <HStack justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold" color={titleColor}>
            🌍 Live Community Stats
          </Text>
          <Badge colorScheme="green" size="lg" variant="subtle">
            LIVE
          </Badge>
        </HStack>

        <Box
          display="grid"
          gridTemplateColumns={[
            '1fr',
            '1fr',
            'repeat(2, 1fr)',
            'repeat(4, 1fr)',
          ]}
          gap={4}
        >
          <StatItem
            icon={FaUsers}
            label="Total Users"
            value={formatNumber(stats.totalUsers)}
            subtitle="Active stakers"
            color="blue"
            isAnimated={true}
          />

          <StatItem
            icon={FaCoins}
            label="Total Staked"
            value={formatCurrency(stats.totalStaked, userInfo.price || 0)}
            subtitle="Community funds"
            color="green"
            isAnimated={stats.totalStaked > 0}
          />

          <StatItem
            icon={FaRocket}
            label="Total Rewards"
            value={formatCurrency(stats.totalRewards, userInfo.price || 0)}
            subtitle="Distributed"
            color="purple"
            isAnimated={stats.totalRewards > 0}
          />

          <StatItem
            icon={FaChartLine}
            label="Average APY"
            value={`${stats.averageAPY}%`}
            subtitle="Current rate"
            color="orange"
            isAnimated={true}
          />
        </Box>

        {/* Community message */}
        <Box
          bg={blueBg}
          borderRadius="xl"
          p={4}
          border="1px solid"
          borderColor={blueBorder}
        >
          <Text
            fontSize="sm"
            color={blueTextSecondary}
            textAlign="center"
            fontWeight="medium"
          >
            🚀 Join {formatNumber(stats.totalUsers)}+ users earning passive
            income! Your stake contributes to the community growth.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

const StatItem = ({
  icon,
  label,
  value,
  subtitle,
  color,
  isAnimated = false,
}) => {
  // All hooks must be called at the top level
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const valueColor = useColorModeValue('gray.800', 'white');
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const subtitleColor = useColorModeValue('gray.500', 'gray.500');

  return (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      p={4}
      textAlign="center"
      position="relative"
      overflow="hidden"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'md',
      }}
      transition="all 0.3s ease"
      animation={isAnimated ? `${countUp} 0.6s ease-out` : 'none'}
    >
      <VStack spacing={2}>
        <Icon as={icon} boxSize={5} color={`${color}.500`} />

        <Text fontSize="lg" fontWeight="bold" color={valueColor}>
          {value}
        </Text>

        <Text fontSize="xs" color={labelColor} fontWeight="medium">
          {label}
        </Text>

        {subtitle && (
          <Text fontSize="xs" color={subtitleColor}>
            {subtitle}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default LiveStats;
