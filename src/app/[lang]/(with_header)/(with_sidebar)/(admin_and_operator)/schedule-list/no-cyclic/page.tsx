'use client';
import React, { Fragment, useState } from 'react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  IconButton,
  MenuItem,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { ScheduleTypeEnum } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ScheduleService } from '@/api/services/schedule.service';
import ActionButtons from '@/components/molecules/ActionButtons';
import { Locale } from '@/i18n';
import { languagePathHelper } from '@/utils/helpers/language';
import { Maybe } from '@/utils/models/common';
import { ScheduleSingleDataModel } from '@/utils/models/schedule';
import AddEditThematicPlan from './_components/modals/AddEditThematicPlan';

const DeleteModal = dynamic(() => import('./_components/modals/DeleteModal'));
const CreateEditModal = dynamic(() => import('./_components/modals/CreateEditModal'));

export default function Schedule({ params }: { params: { lang: Locale } }) {
  const [selectedExpandableCourseGroup, setSelectedExpandableCourseGroup] =
    useState<Maybe<string>>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Maybe<ScheduleSingleDataModel>>(null);
  const t = useTranslations();

  const { data, refetch } = useQuery({
    queryKey: ['non_cyclic_list'],
    queryFn: () => ScheduleService.list(ScheduleTypeEnum.NON_CYCLIC),
    initialData: [],
  });

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure({
    onClose() {
      setSelectedSchedule(null);
    },
  });

  const {
    isOpen: isCreateEditModalOpen,
    onOpen: openCreateEditModal,
    onClose: closeCreateEditModal,
  } = useDisclosure({
    onClose() {
      setSelectedSchedule(null);
    },
  });

  const {
    isOpen: isCreateEditThematicPlanModalIsOpen,
    onOpen: openAddEditThematicPlanModal,
    onClose: closeCreateEditThematicPlanModal,
  } = useDisclosure({
    onClose() {
      setSelectedSchedule(null);
    },
  });

  const { mutate: deleteScheduleMutation } = useMutation({
    mutationFn: ScheduleService.deleteScheduleById,
    onSuccess() {
      closeDeleteModal();
      refetch();
    },
  });

  return (
    <>
      <Text as="h2" fontSize={24} textAlign="center">
        {t('cyclicScheduleList')}
      </Text>
      <Flex justifyContent="flex-end">
        <Button
          px="12px"
          py="8px"
          onClick={openCreateEditModal}
          overflowWrap="break-word"
          whiteSpace="normal">
          {t('addNew')}
        </Button>
      </Flex>

      <Table>
        <Thead>
          <Tr>
            <Td>{t('courseGroup')}</Td>
            <Td>{t('course')}</Td>
            <Td colSpan={1}>{t('faculty')}</Td>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(courseGroup => {
            const isExpandedRow = selectedExpandableCourseGroup === courseGroup.id;
            return (
              <Fragment key={courseGroup.id}>
                <Tr>
                  <Td>
                    <Flex alignItems="center" gap={4}>
                      <IconButton
                        aria-label="expand"
                        icon={isExpandedRow ? <MinusIcon /> : <AddIcon />}
                        onClick={() =>
                          setSelectedExpandableCourseGroup(isExpandedRow ? null : courseGroup.id)
                        }
                      />{' '}
                      {courseGroup.title}
                    </Flex>
                  </Td>
                  <Td>{courseGroup.course.title}</Td>
                  <Td>{courseGroup.course.faculty?.title}</Td>
                </Tr>

                {isExpandedRow && (
                  <Tr>
                    <Td colSpan={3} overflowX="auto">
                      <Box bg="gray.100" width="180%" p={16}>
                        <Table size="sm" variant="simple">
                          <Thead>
                            <Tr>
                              <Td>{t('actions')}</Td>
                              <Td>{t('details')}</Td>
                              <Td>{t('subject')}</Td>
                              <Td>{t('title')}</Td>
                              <Td>{t('description')}</Td>
                              <Td>{t('totalHours')}</Td>
                              <Td>{t('examType')}</Td>
                              <Td>{t('lecturer')}</Td>
                              <Td>{t('academicYear')}</Td>
                              <Td>{t('createdAt')}</Td>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {courseGroup.schedules.length ? (
                              courseGroup.schedules.map(schedule => (
                                <Tr key={schedule.id}>
                                  <Td>
                                    <ActionButtons>
                                      <MenuItem
                                        color="green"
                                        onClick={() => {
                                          setSelectedSchedule(schedule);
                                          openAddEditThematicPlanModal();
                                        }}>
                                        {t('addThematicPlan')}
                                      </MenuItem>
                                      <MenuItem
                                        color="green"
                                        onClick={() => {
                                          setSelectedSchedule(schedule);
                                          openCreateEditModal();
                                        }}>
                                        {t('edit')}
                                      </MenuItem>
                                      <MenuItem
                                        color="red"
                                        onClick={() => {
                                          setSelectedSchedule(schedule);
                                          openDeleteModal();
                                        }}>
                                        {t('delete')}
                                      </MenuItem>
                                    </ActionButtons>
                                  </Td>
                                  <Td>
                                    <Button
                                      as={Link}
                                      href={`${languagePathHelper(params.lang, `/schedules/${schedule.id}`)}`}
                                      variant="link">
                                      {t('seeDetails')}
                                    </Button>
                                  </Td>
                                  <Td>{schedule.title}</Td>
                                  <Td>{schedule.subject.title}</Td>
                                  <Td>{schedule.description}</Td>
                                  <Td>{schedule.totalHours}</Td>
                                  <Td>{schedule.examType}</Td>
                                  <Td>
                                    {schedule.scheduleTeachers[0].teacher.user.firstName}{' '}
                                    {schedule.scheduleTeachers[0].teacher.user.lastName}
                                  </Td>
                                  <Td>{schedule.academicYear}</Td>
                                  <Td>{dayjs(schedule.createdAt).format('YYYY-MM-DD')}</Td>
                                </Tr>
                              ))
                            ) : (
                              <Tr>
                                <Td colSpan={8} textAlign="center" verticalAlign="middle">
                                  No Schedules
                                </Td>
                              </Tr>
                            )}
                          </Tbody>
                        </Table>
                      </Box>
                    </Td>
                  </Tr>
                )}
              </Fragment>
            );
          })}
        </Tbody>
      </Table>

      {isCreateEditModalOpen && (
        <CreateEditModal
          isModalOpen={isCreateEditModalOpen}
          closeModal={closeCreateEditModal}
          selectedSchedule={selectedSchedule}
        />
      )}

      {isCreateEditThematicPlanModalIsOpen && selectedSchedule && (
        <AddEditThematicPlan
          isModalOpen={isCreateEditThematicPlanModalIsOpen}
          closeModal={closeCreateEditThematicPlanModal}
          selectedSchedule={selectedSchedule}
          refetch={refetch}
        />
      )}

      {isDeleteModalOpen && selectedSchedule && (
        <DeleteModal
          selectedSchedule={selectedSchedule}
          isDeleteModalOpen={isDeleteModalOpen}
          closeDeleteModal={closeDeleteModal}
          actionHandler={deleteScheduleMutation}
        />
      )}
    </>
  );
}
