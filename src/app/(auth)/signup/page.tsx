'use client';
import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { UserRoleEnum } from '@prisma/client';
import { SelectLabel } from '@/components/atoms';
import { AuthBox } from '@/components/molecules';
import { TeacherSignUp } from '@/components/organisms';
import StudentSignUp from '@/components/organisms/StudentSignup';
import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '@/utils/constants/routes';

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
  );
};

export default Signup;
