import React, { FC } from 'react';
import { Box, Flex, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { Instructor } from '@prisma/client';
import Image from 'next/image';
import { generateAWSUrl } from '@/utils/helpers/common';

type OfflineCourseInstructorProps = {
  instructor: Instructor;
};

const OfflineCourseInstructor: FC<OfflineCourseInstructorProps> = ({ instructor }) => {
  return (
    <Box flexBasis="420px">
      <Flex
        mb="24px"
        borderRadius="12px"
        flexDirection="column"
        gap="16px"
        alignItems="center"
        bg="#ECF7FC"
        padding="48px">
        <Box>
          <Image src="/icons/quote.svg" alt="comma" width={24.5} height={19.9} />
        </Box>
        <Text
          textAlign="center"
          margin="0"
          as="span"
          lineHeight={{
            base: '18.75px ',
            lg: '21.28px',
          }}
          fontSize="16px">
          {instructor.about}
        </Text>
      </Flex>

      <Flex flexDirection="column" alignItems="center" gap="8px">
        <Box width={74} height={74} position="relative" borderRadius="50%" overflow="auto">
          <Image
            src={generateAWSUrl(instructor.avatar)}
            alt={[instructor.firstName, instructor.lastName].join(' ')}
            fill
            style={{
              objectFit: 'cover',
            }}
          />
        </Box>

        <UnorderedList
          borderBottom="1px solid #E9E8ED"
          margin="0"
          display="flex"
          fontSize="16px"
          flexDirection="column"
          alignItems="center">
          <ListItem mb="8px" lineHeight="16px" fontWeight="600" as="span">
            {instructor.firstName} {instructor.lastName}
          </ListItem>
          <ListItem mb="8px" as="span" color="#5B5B5B" lineHeight="21.28px" fontWeight="400">
            {instructor.profession}
          </ListItem>
        </UnorderedList>

        <UnorderedList margin="0" display="flex" flexDirection="column" alignItems="center">
          <ListItem as="span" fontSize="16px" lineHeight="21.28px" fontWeight="400">
            Enrolled:
            <Text as="span" fontWeight="700">
              {instructor.enrolledStudentsCount}
            </Text>
          </ListItem>
          <ListItem as="span" fontSize="16px" lineHeight="21.28px" fontWeight="400">
            Graduated:
            <Text as="span" fontWeight="700">
              {instructor.graduatedStudentsCount}
            </Text>
          </ListItem>
        </UnorderedList>
      </Flex>
    </Box>
  );
};

export default OfflineCourseInstructor;
