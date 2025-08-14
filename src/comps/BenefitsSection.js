import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  keyframes,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FaHeart,
  FaUsers,
  FaShieldAlt,
  FaChartLine,
  FaGlobe,
  FaLightbulb,
  FaRocket,
  FaStar,
} from 'react-icons/fa';

const fadeInUp = keyframes`
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const BenefitsSection = () => {
  // All hooks must be called at the top level
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');
  const blueBg = useColorModeValue('blue.50', 'blue.900');
  const blueBorder = useColorModeValue('blue.200', 'blue.700');
  const blueText = useColorModeValue('blue.800', 'blue.100');
  const blueTextSecondary = useColorModeValue('blue.700', 'blue.200');

  const benefits = [
    {
      icon: FaHeart,
      title: 'Community First',
      description:
        'Join a global community of like-minded individuals building the future of finance together.',
      color: 'red',
      delay: '0.1s',
    },
    {
      icon: FaShieldAlt,
      title: 'Trust & Security',
      description:
        'Smart contracts ensure transparency and security. Your funds are always under your control.',
      color: 'blue',
      delay: '0.2s',
    },
    {
      icon: FaChartLine,
      title: 'Financial Growth',
      description:
        'Earn passive income with competitive APY rates while contributing to DeFi innovation.',
      color: 'green',
      delay: '0.3s',
    },
    {
      icon: FaGlobe,
      title: 'Global Access',
      description:
        'Access financial services from anywhere in the world, 24/7, without intermediaries.',
      color: 'purple',
      delay: '0.4s',
    },
    {
      icon: FaLightbulb,
      title: 'Innovation',
      description:
        "Be part of the cutting-edge technology that's revolutionizing traditional finance.",
      color: 'yellow',
      delay: '0.5s',
    },
    {
      icon: FaRocket,
      title: 'Future Ready',
      description:
        'Position yourself for the future of money with early adoption of DeFi protocols.',
      color: 'orange',
      delay: '0.6s',
    },
  ];

  return (
    <Box
      bg={bgColor}
      border="2px solid"
      borderColor={borderColor}
      borderRadius="2xl"
      p={8}
      boxShadow="xl"
      position="relative"
      overflow="hidden"
      mb={6}
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top={-40}
        right={-40}
        w={80}
        h={80}
        bgGradient="linear-gradient(135deg, purple.100 0%, blue.100 100%)"
        borderRadius="full"
        opacity={0.1}
        _dark={{ opacity: 0.05 }}
      />

      <VStack spacing={8} align="stretch" position="relative" zIndex={1}>
        <VStack spacing={4} textAlign="center">
          <HStack spacing={3}>
            <Icon as={FaStar} color="yellow.500" boxSize={6} />
            <Text
              fontSize="2xl"
              fontWeight="bold"
              bgGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              bgClip="text"
            >
              Why Choose DeFi Staking?
            </Text>
            <Icon as={FaStar} color="yellow.500" boxSize={6} />
          </HStack>

          <Text
            fontSize="lg"
            color={descriptionColor}
            maxW="600px"
            lineHeight="tall"
          >
            Discover the psychological and social benefits that make DeFi
            staking more than just a financial decision
          </Text>
        </VStack>

        <SimpleGrid columns={[1, 1, 2, 3]} spacing={6}>
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              {...benefit}
              animation={`${fadeInUp} 0.6s ease-out ${benefit.delay} both`}
            />
          ))}
        </SimpleGrid>

        {/* Call to action */}
        <Box
          bg={blueBg}
          borderRadius="xl"
          p={6}
          border="2px solid"
          borderColor={blueBorder}
          textAlign="center"
        >
          <VStack spacing={4}>
            <Icon as={FaUsers} color="blue.500" boxSize={8} />
            <Text fontSize="lg" fontWeight="bold" color={blueText}>
              Ready to Join the Future?
            </Text>
            <Text fontSize="md" color={blueTextSecondary} maxW="500px">
              Connect your wallet and start your DeFi journey today. Join
              thousands of users who are already earning passive income while
              building the future of finance.
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

const BenefitCard = ({ icon, title, description, color, animation }) => {
  // All hooks must be called at the top level
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      p={6}
      textAlign="center"
      position="relative"
      overflow="hidden"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'lg',
        borderColor: `${color}.300`,
      }}
      transition="all 0.3s ease"
      animation={animation}
    >
      <VStack spacing={4}>
        <Box
          p={3}
          borderRadius="full"
          bgGradient={`linear-gradient(135deg, ${color}.400 0%, ${color}.600 100%)`}
          color="white"
        >
          <Icon as={icon} boxSize={6} />
        </Box>

        <Text
          fontSize="lg"
          fontWeight="bold"
          color={useColorModeValue('gray.800', 'white')}
        >
          {title}
        </Text>

        <Text
          fontSize="sm"
          color={useColorModeValue('gray.600', 'gray.400')}
          lineHeight="tall"
        >
          {description}
        </Text>
      </VStack>
    </Box>
  );
};

export default BenefitsSection;
