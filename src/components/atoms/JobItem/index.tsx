import React, { FC } from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { Job } from '@/models/careers.model';
import { CAREERS_ROUTE } from '@/utils/constants/routes';
import ButtonArrowRight from '/public/icons/arrow_right_careers.svg';
import Button from '../Button';

type JobItemProps = {
  job: Job;
};

const JobItem: FC<JobItemProps> = ({ job }) => {
  return (
    <Flex
      key={job.id}
      justifyContent={{ base: 'center', sm: 'space-between' }}
      as={Link}
      href={`${CAREERS_ROUTE}/job/${job.id}`}
      flexBasis="590px"
      py="24px">
      <Flex
        flexDirection="column"
        gap={{ base: '8px', md: '16px' }}
        textAlign={{ base: 'center', sm: 'left' }}>
        <Flex alignItems="center" gap="13.5px">
          <Heading
            fontSize={{ base: '24px', md: '28px' }}
            fontWeight={700}
            color="#222"
            lineHeight={{ base: '32px', sm: '36px' }}
            fontStyle="normal">
            {job.title}
          </Heading>
          <Text
            as="span"
            display={{
              base: 'block',
              sm: 'none',
            }}>
            <ButtonArrowRight />
          </Text>
        </Flex>
        <Text fontSize="16px" lineHeight="22px" fontStyle="normal" fontWeight={400} color="#5B5B5B">
          {job.contractType}
        </Text>
      </Flex>
      <Button
        alignSelf="flex-start"
        width="127px"
        height="53px"
        padding="16px 32px"
        display={{ base: 'none', sm: 'block' }}>
        Join now
      </Button>
    </Flex>
  );
};

export default JobItem;
