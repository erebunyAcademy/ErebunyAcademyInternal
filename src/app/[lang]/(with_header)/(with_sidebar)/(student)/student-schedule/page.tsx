'use client';
import React, { Fragment, useState } from 'react';
import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { StudentService } from '@/api/services/student.service';
import SimpleTable from '@/components/organisms/SimpleTable';
import { Locale } from '@/i18n';
import { languagePathHelper } from '@/utils/helpers/language';
import { StudentScheduleListSingleType } from '@/utils/models/schedule';
const DescriptionModal = dynamic(() => import('./modals/descriptionModal'));

const StudentSchedule = ({ params }: { params: { lang: Locale } }) => {
  const t = useTranslations();
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
  const {
    isOpen: isDescriptionModalOpen,
    onOpen: openDescriptionModal,
    onClose: closeDescriptionModal,
  } = useDisclosure();

  const { data: cyclicData } = useQuery({
    queryFn: StudentService.getStudentSchedules,
    queryKey: ['student-cyclic-schedule-list'],
    initialData: [],
  });

  const cyclicColumnHelper = createColumnHelper<StudentScheduleListSingleType>();

  const cyclicScheduleColumns = [
    cyclicColumnHelper.accessor('id', {
      id: uuidv4(),
      header: t('seeDetails'),
      cell: info => (
        <Button
          as={Link}
          href={`${languagePathHelper(params.lang || 'en', `/schedules/${info.getValue()}`)}`}
          variant="link">
          {t('seeDetails')}
        </Button>
      ),
    }),
    cyclicColumnHelper.accessor('title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('title'),
    }),
    cyclicColumnHelper.accessor('description', {
      id: uuidv4(),
      cell: info => (
        <Button
          variant="link"
          onClick={() => {
            setSelectedDescription(info.getValue());
            openDescriptionModal();
          }}>
          {t('seeDescription')}
        </Button>
      ),
      header: t('description'),
    }),
    cyclicColumnHelper.accessor('totalHours', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('totalHours'),
    }),
    cyclicColumnHelper.accessor('createdAt', {
      id: uuidv4(),
      cell: info => {
        const currentDate = dayjs(info.getValue());
        return currentDate.format('YYYY-MM-DD');
      },
      header: t('createdAt'),
    }),
  ];

  return (
    <Fragment>
      <Flex flexDirection="column" gap="100px" width="100%" mt="50px">
        <SimpleTable columns={cyclicScheduleColumns} data={cyclicData} title="schedule" />
      </Flex>
      <DescriptionModal
        selectedDescription={selectedDescription}
        isDescriptionModalOpen={isDescriptionModalOpen}
        closeDescriptionModal={closeDescriptionModal}
      />
    </Fragment>
  );
};

export default StudentSchedule;
