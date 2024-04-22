import React, { FC } from 'react';
import { Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { Job } from '@prisma/client';
import JobItem from '@/components/atoms/JobItem';
import { segoe } from '@/utils/constants/fonts';

type OpenPositionsProps = {
  jobs: Job[];
};

const OpenPositions: FC<OpenPositionsProps> = ({ jobs }) => {
  return (
    <Flex as="section" flexDirection="column" my={{ base: '36px', md: '80px', xl: '148px' }}>
      <Flex
        flexDirection="column"
        maxWidth={794}
        textAlign="center"
        m="0 auto"
        gap={{ base: '16px', md: '20px' }}>
        <Heading
          className={segoe.className}
          fontSize={{ base: '28px', sm: '32px' }}
          fontWeight={{ base: 600, xl: 700 }}
          color="#222"
          lineHeight="normal"
          fontStyle="normal">
          Open Positions
        </Heading>
        <Text
          fontSize={16}
          fontWeight={400}
          color="#5B5B5B"
          lineHeight="24px"
          fontStyle="normal"
          textAlign={{ base: 'left', md: 'center' }}>
          Unlock your potential: Join us on a journey of innovation and growth. Explore open
          positions and be part of a team where your talents are valued and Ideas Are
          celebrated.Your next opportunity awaits – apply today and elevate your career with Persona
          Business Academy.
        </Text>
      </Flex>

      <Flex
        rowGap={{ base: '0', md: '24px' }}
        flexDirection="column"
        mt={{ base: '20px', md: '40px' }}>
        <Grid gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }} columnGap="20px">
          {jobs.map((job: Job) => (
            <JobItem job={job} key={job.id} />
          ))}
        </Grid>
      </Flex>
    </Flex>
  );
};

export default OpenPositions;
