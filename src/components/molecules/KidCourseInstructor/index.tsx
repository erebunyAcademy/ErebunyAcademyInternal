import React, { FC } from 'react';
import { Box, Container, Text } from '@chakra-ui/react';
import { Instructor } from '@prisma/client';
import Image from 'next/image';
import { generateAWSUrl } from '@/utils/helpers/common';

type KidCourseInstructorProps = {
  instructor: Instructor;
};

const KidCourseInstructor: FC<KidCourseInstructorProps> = ({ instructor }) => {
  return (
    <Container maxWidth={590} p={0}>
      <Box p="38px" borderRadius="12px" backgroundColor="#F6FCFF" height="272px">
        <Text fontSize="16px" fontStyle="normal" fontWeight={400} lineHeight="22px">
          {instructor.about}
        </Text>
      </Box>
      <Box display={{ base: 'none', sm: 'block' }}>
        <Box
          borderRadius="50%"
          overflow="hidden"
          display="flex"
          justifyContent="center"
          marginTop="-88px"
          height="177px">
          <Image
            src={generateAWSUrl(instructor.avatar)}
            alt="Kids courses instructor"
            width={177}
            height={177}
            style={{ border: '14px solid #fff', objectFit: 'cover', borderRadius: '50%' }}
          />
        </Box>
      </Box>
      <Box display={{ base: 'block', sm: 'none' }} mt="8px">
        <Box
          borderRadius="80.846px"
          overflow="hidden"
          display="flex"
          justifyContent="center"
          marginTop="-24px"
          height="48px">
          <Image
            src={generateAWSUrl(instructor.avatar)}
            alt="Kids courses instructor"
            width={48.5}
            height={48.5}
            style={{ borderRadius: '64px', border: '3.87px solid #fff', objectFit: 'cover' }}
          />
        </Box>
      </Box>
      <Text
        color="#3D3D3D"
        textAlign="center"
        fontSize="16px"
        fontStyle="normal"
        fontWeight={600}
        lineHeight="16px"
        m={{ base: '8px 0 8px 0', sm: '32px 0 8px 0' }}>
        {instructor.firstName} {instructor.lastName}
      </Text>
      <Text
        color="#727272"
        textAlign="center"
        fontSize="16px"
        fontStyle="normal"
        fontWeight={400}
        lineHeight="normal"
        p="0 0 8px 0">
        Digital Creator & Educator
      </Text>
      <hr
        style={{
          borderBottom: '1px solid #DEDEDE',
          width: '196.5px',
          textAlign: 'center',
          margin: '0 auto',
        }}
      />
      <Text
        m="8px 0 0 0"
        color="#222"
        textAlign="center"
        fontSize="16px"
        fontStyle="normal"
        fontWeight={400}
        lineHeight="22px">
        Enrolled: <span style={{ fontWeight: '700' }}>100</span>
      </Text>
      <Text
        color="#222"
        textAlign="center"
        fontSize="16px"
        fontStyle="normal"
        fontWeight={400}
        lineHeight="22px">
        Graduated: <span style={{ fontWeight: '700' }}>100</span>
      </Text>
    </Container>
  );
};

export default KidCourseInstructor;
