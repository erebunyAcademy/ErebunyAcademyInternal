'use client';
import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { UserRoleEnum } from '@prisma/client';
import { SelectLabel } from '@/components/atoms';
import { AuthBox } from '@/components/molecules';
import { TeacherSignUp } from '@/components/organisms';
import StudentSignUp from '@/components/organisms/StudentSignup';
import { Locale } from '@/i18n';
import { authBoxProps } from '@/utils/helpers/auth';

const Signup = ({ params }: { params: { lang: Locale } }) => {
  const [userType, setUserType] = useState<UserRoleEnum>(UserRoleEnum.STUDENT);
  return (
    <AuthBox data={authBoxProps(params.lang).data} boxProps={authBoxProps(params.lang).boxProps}>
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
