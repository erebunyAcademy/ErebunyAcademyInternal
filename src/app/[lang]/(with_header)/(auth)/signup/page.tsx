'use client';
import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { UserRoleEnum } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { SelectLabel } from '@/components/atoms';
import { AuthBox } from '@/components/molecules';
import { TeacherSignUp } from '@/components/organisms';
import StudentSignUp from '@/components/organisms/StudentSignup';
import { Locale } from '@/i18n';
import { authBoxProps } from '@/utils/helpers/auth';

const Signup = ({ params }: { params: { lang: Locale } }) => {
  const [userType, setUserType] = useState<UserRoleEnum>(UserRoleEnum.STUDENT);
  const t = useTranslations();

  return (
    <AuthBox data={authBoxProps(params.lang).data} boxProps={authBoxProps(params.lang).boxProps}>
      <Box pb={{ base: '20px', sm: '32px' }}>
        <SelectLabel
          isRequired
          name={'userType'}
          options={[{ name: UserRoleEnum.STUDENT }, { name: UserRoleEnum.TEACHER }]}
          labelName={t('userType')}
          valueLabel="name"
          nameLabel="name"
          onChange={e => setUserType(e.target.value as UserRoleEnum)}
          value={userType}
        />
      </Box>
      {userType === 'TEACHER' ? <TeacherSignUp lang={params.lang} /> : null}
      {userType === 'STUDENT' ? <StudentSignUp lang={params.lang} /> : null}
    </AuthBox>
  );
};

export default Signup;
