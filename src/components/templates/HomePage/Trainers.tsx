import React, { FC } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import MovableButton from '@/components/atoms/MovableButton';
import { homePageTrainersData } from '@/types/member';
import { LEADERSHIP_ROUTE } from '@/utils/constants/routes';

const TrainerCard = dynamic(() => import('@/components/molecules/TrainerCard'));

type TrainersProps = {};

const Trainers: FC<TrainersProps> = () => {
  return (
    <Box mb={{ base: '36px', lg: '148px' }}>
      <Box textAlign="center" maxW="419px" m="0 auto" mb="20px">
        <Heading lineHeight="42.56px" fontWeight="700" fontSize="30" margin="0 0 16px 0">
          Top Trainers
        </Heading>
      </Box>

      <Box
        margin={{
          base: '0',
          xl: '40px 0 0 0',
        }}
        display="flex"
        gap="20px"
        flexWrap="wrap"
        justifyContent="center">
        {homePageTrainersData.map(trainer => (
          <TrainerCard key={trainer.id} trainer={trainer} />
        ))}
      </Box>
      <Flex justifyContent="center" marginTop="30px">
        <Text as={Link} href={LEADERSHIP_ROUTE}>
          <MovableButton btnText="View More" fill="#000000" fillHover="#5B5B5B" />
        </Text>
      </Flex>
    </Box>
  );
};

export default Trainers;
