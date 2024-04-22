import React, { FC } from 'react';
import { Box, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import Image from 'next/image';

type StudentFeedbackProps = {
  feedbackText: string;
  studentAvatarSrc?: string;
  firstName: string;
  lastName: string;
  profession: string;
  bg: string;
  icon: string;
};

const StudentFeedback: FC<StudentFeedbackProps> = ({
  feedbackText,
  firstName,
  lastName,
  profession,
  bg,
  icon,
  studentAvatarSrc = '/icons/students_feed.png',
}) => {
  return (
    <Box width="387px">
      <Box
        position="relative"
        bg={bg}
        textAlign="center"
        padding="48px"
        display="flex"
        gap="16px"
        flexDirection="column"
        alignItems="center"
        borderRadius="12px">
        <Text as="span" width="24.5px" height="20px">
          <Image src="/icons/icon_dots.png" alt="Dots" width={24.5} height={20} />
        </Text>
        <Text m="0" lineHeight="21.28px" fontWeight="400" fontSize="16px">
          {feedbackText}
        </Text>

        <span
          style={{
            position: 'absolute',
            bottom: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}>
          <Image src={icon} alt="Arrow" width={22.5} height={15.7} />
        </span>
      </Box>

      <Box
        paddingTop="36px"
        textAlign="center"
        display="flex"
        gap="8px"
        flexDirection="column"
        alignItems="center">
        <Box width="64px" height="64px" position="relative" borderRadius="50px" overflow="hidden">
          <Image
            src={studentAvatarSrc}
            fill
            alt={firstName}
            style={{
              objectFit: 'cover',
            }}
          />
        </Box>

        <UnorderedList lineHeight="21.28px" fontSize="16px" margin="0" listStyleType="none">
          <ListItem fontWeight="700">
            {firstName} {lastName}
          </ListItem>
          <ListItem fontWeight="400">{profession}</ListItem>
        </UnorderedList>
      </Box>
    </Box>
  );
};

export default StudentFeedback;
