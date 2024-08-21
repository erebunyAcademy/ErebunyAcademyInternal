'use client';
import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { AcademicRegisterService } from '@/api/services/academic-register.service';
import SimpleTable from '@/components/organisms/SimpleTable';
import { Locale } from '@/i18n';
import { ROUTE_ACADEMIC_REGISTER } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { GetScheduleDataType } from '@/utils/models/academic-register';

const AcademicRegister = ({ params }: { params: { lang: Locale } }) => {
  const t = useTranslations();

  const { data: academicRegisterList } = useQuery({
    queryFn: AcademicRegisterService.list,
    queryKey: ['academic-register-cyclic-list'],
    initialData: [],
  });

  const cyclicColumnHelper = createColumnHelper<GetScheduleDataType>();

  const notCyclicScheduleColumns = [
    cyclicColumnHelper.accessor('id', {
      id: uuidv4(),
      header: t('openRegister'),
      cell: info => (
        <Button
          as={Link}
          href={`${languagePathHelper(params.lang || 'en', `${ROUTE_ACADEMIC_REGISTER}/${info.getValue()}`)}`}
          variant="link">
          {t('openRegister')}
        </Button>
      ),
    }),
    cyclicColumnHelper.accessor('courseGroup.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('courseGroup'),
    }),
    cyclicColumnHelper.accessor('courseGroup.course.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('course'),
    }),
    cyclicColumnHelper.accessor('subject.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('subject'),
    }),
    cyclicColumnHelper.accessor('title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('title'),
    }),
    cyclicColumnHelper.accessor('description', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('description'),
    }),
  ];

  return (
    <Box width="100%" m="40px auto 0 auto">
      <SimpleTable
        columns={notCyclicScheduleColumns as any}
        title="register"
        data={academicRegisterList}
      />
    </Box>
  );
};

export default AcademicRegister;
