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
import { ROUTE_ACADEMIC_REGISTER } from '@/utils/constants/routes';
import { CyclicAcademicRegisterList } from '@/utils/models/academic-register';

const AcademicRegister = () => {
  const t = useTranslations();

  const { data: academicRegisterList } = useQuery({
    queryFn: AcademicRegisterService.getCyclicRegisterList,
    queryKey: ['academic-register-cyclic-list'],
    initialData: [],
  });

  const cyclicyclicColumnHelper = createColumnHelper<CyclicAcademicRegisterList>();

  const notCyclicScheduleColumns = [
    cyclicyclicColumnHelper.accessor('id', {
      id: uuidv4(),
      header: t('seeDetails'),
      cell: info => (
        <Button as={Link} href={`${ROUTE_ACADEMIC_REGISTER}/${info.getValue()}`} variant="link">
          {t('seeDetails')}
        </Button>
      ),
    }),
    cyclicyclicColumnHelper.accessor('courseGroup.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('courseGroup'),
    }),
    cyclicyclicColumnHelper.accessor('subject.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('subject'),
    }),
    cyclicyclicColumnHelper.accessor('startDayDate', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('courseGroup'),
    }),
    cyclicyclicColumnHelper.accessor('endDayDate', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('courseGroup'),
    }),
  ];

  return (
    <Box>
      <SimpleTable
        columns={notCyclicScheduleColumns as any}
        title="students"
        data={academicRegisterList}
      />
    </Box>
  );
};

export default AcademicRegister;
