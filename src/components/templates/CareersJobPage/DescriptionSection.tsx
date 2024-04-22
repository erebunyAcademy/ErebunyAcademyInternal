import React, { FC } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { Job } from '@/models/careers.model';
import { segoe } from '@/utils/constants/fonts';

type DescriptionSectionProps = {
  job: Job;
};

const DescriptionSection: FC<DescriptionSectionProps> = ({ job }) => {
  return (
    <Box maxW="895px" color="#222222">
      <Box mb={{ base: '16px', lg: ' 64px' }}>
        <Heading
          className={segoe.className}
          m={{ base: ' 0 0 16px 0', lg: ' 0 0 24px 0' }}
          fontSize={{ base: '24px', lg: ' 32px' }}
          lineHeight={{ base: '31.92px', lg: ' 42.56px' }}
          fontWeight="700">
          Job Description
        </Heading>
        <Box
          lineHeight="22px"
          fontSize="16px"
          fontWeight="400"
          fontStyle="normal"
          dangerouslySetInnerHTML={{ __html: job.description }}
        />
      </Box>

      <Box mb={{ base: '16px', lg: ' 64px' }}>
        <Heading
          className={segoe.className}
          m={{ base: ' 0 0 16px 0', lg: ' 0 0 24px 0' }}
          fontSize={{ base: '24px', lg: ' 32px' }}
          lineHeight={{ base: '31.92px', lg: ' 42.56px' }}
          fontWeight="700">
          Job Responsibilities
        </Heading>
        <Box
          lineHeight="22px"
          fontSize="16px"
          fontWeight="400"
          fontStyle="normal"
          dangerouslySetInnerHTML={{ __html: job.responsibilities }}
        />
      </Box>

      <Box>
        <Heading
          className={segoe.className}
          m={{ base: ' 0 0 16px 0', lg: ' 0 0 24px 0' }}
          fontSize={{ base: '24px', lg: ' 32px' }}
          lineHeight={{ base: '31.92px', lg: ' 42.56px' }}
          fontWeight="700">
          Requirement & Skills
        </Heading>
        <Box
          lineHeight="22px"
          fontSize="16px"
          fontWeight="400"
          fontStyle="normal"
          marginBottom={{ base: '36px', lg: '148px' }}
          dangerouslySetInnerHTML={{ __html: job.requirements }}
        />
      </Box>
    </Box>
  );
};

export default DescriptionSection;
