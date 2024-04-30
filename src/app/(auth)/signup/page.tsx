'use client';
import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { UserRoleEnum } from '@prisma/client';
import { Button, SelectLabel } from '@/components/atoms';
import { AuthBox } from '@/components/molecules';
import { TeacherSignUp } from '@/components/organisms';
import StudentSignUp from '@/components/organisms/StudentSignup';
import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '@/utils/constants/routes';
import CheckIcon from '/public/icons/check.svg';

const authBoxProps = {
  data: [
    { href: SIGN_UP_ROUTE, title: 'Sign up' },
    { href: SIGN_IN_ROUTE, title: 'Sign In' },
  ],
  boxProps: { marginTop: { base: 64, md: 37 } },
};

const Signup = () => {
  const [userType, setUserType] = useState<UserRoleEnum>(UserRoleEnum.STUDENT);

  return (
    <>
      {false ? (
        <Flex flexDirection="column" marginTop="137px" padding="32px" gap="12px">
          <Flex justifyContent="center" mb="12px">
            <CheckIcon />
          </Flex>
          <Text fontSize="24px" fontWeight={700} textAlign="center" color="#222">
            Check your email
          </Text>
          <Text fontSize="16px" fontWeight={400} textAlign="center" color="#222">
            Confirmation is sent to your email
          </Text>
          <Button
            mt="12px"
            p="12px 16px"
            fontSize="16px"
            fontWeight={400}
            mx="auto"
            onClick={() => {}}>
            Send again
          </Button>
        </Flex>
      ) : (
        <AuthBox data={authBoxProps.data} boxProps={authBoxProps.boxProps}>
          <Box pb={{ base: '20px', sm: '32px' }}>
            <SelectLabel
              name={'userType'}
              options={[{ name: UserRoleEnum.STUDENT }, { name: UserRoleEnum.TEACHER }]}
              labelName="User Type"
              valueLabel="name"
              nameLabel="name"
              onChange={e => setUserType(e.target.value as UserRoleEnum)}
              value={userType}
            />
          </Box>
          {userType === 'TEACHER' ? <TeacherSignUp /> : null}
          {userType === 'STUDENT' ? <StudentSignUp /> : null}
        </AuthBox>
      )}
    </>
  );
};

export default Signup;
