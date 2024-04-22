import React, { FC } from 'react';
import { Box, Flex, Heading, ListItem, UnorderedList } from '@chakra-ui/react';
import Link from 'next/link';
import { Button } from '@/components/atoms';
import { Job } from '@/models/careers.model';
import { segoe } from '@/utils/constants/fonts';

type IntroForJobProps = {
  job: Job;
};

const IntroForJob: FC<IntroForJobProps> = ({ job }) => {
  return (
    <>
      <Flex
        color="#222222"
        margin={{ base: '36px 0 36px', lg: '148px 0 36px' }}
        flexWrap="wrap"
        justifyContent="space-between"
        gap="24px">
        <Box>
          <Heading
            className={segoe.className}
            noOfLines={1}
            margin="0"
            fontWeight={{ base: 600, md: 700 }}
            lineHeight="42.56px"
            fontSize={{ base: '28px', md: '32px' }}>
            {job.title}
          </Heading>
        </Box>
        <Box>
          <Button
            as={Link}
            href="#apply-for-course"
            padding={{ base: '8px 14px', md: '16px 32px' }}
            height="53px"
            width="140px"
            lineHeight="21.28px"
            fontWeight="400"
            fontSize="16px">
            Apply now
          </Button>
        </Box>
      </Flex>

      <Box
        color="#222222"
        display={{ base: 'block', sm: 'flex' }}
        gap={{ base: '20px', sm: '40px' }}
        borderBottom="1px solid #BDBDBD"
        paddingBottom="24px">
        <UnorderedList
          margin={{ base: '0 0 20px 0', sm: '0' }}
          listStyleType="none"
          fontSize="16px"
          lineHeight="normal">
          <ListItem fontWeight="700">Salary:</ListItem>
          <ListItem fontWeight="400">{job.salary}</ListItem>
        </UnorderedList>

        <UnorderedList
          margin={{ base: '0 0 20px 0', sm: '0' }}
          listStyleType="none"
          fontSize="16px"
          lineHeight="normal">
          <ListItem fontWeight="700">Working hours:</ListItem>
          <ListItem fontWeight="400">{job.workingHours}</ListItem>
        </UnorderedList>

        <UnorderedList margin="0" listStyleType="none" fontSize="16px" lineHeight="normal">
          <ListItem fontWeight="700">Contract type:</ListItem>
          <ListItem fontWeight="400">{job.contractType}, Permanent</ListItem>
        </UnorderedList>
      </Box>

      <Box m={{ base: '24px 0 20px', md: '24px 0 40px' }}>
        <UnorderedList
          listStyleType="none"
          margin="0"
          fontSize="16px"
          fontWeight="400"
          lineHeight="22px"
          color="#5B5B5B">
          <ListItem marginBottom="8px">Opportunity for HR Manager to build the Team</ListItem>
          <ListItem>Opportunity to work with global counterparts</ListItem>
        </UnorderedList>
      </Box>
    </>
  );
};

export default IntroForJob;
