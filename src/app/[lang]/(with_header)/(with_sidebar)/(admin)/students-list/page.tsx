'use client';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Avatar, Button, Flex, MenuItem, useDisclosure } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { AttachmentTypeEnum } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { CourseGroupService } from '@/api/services/course-group.service';
import { StudentService } from '@/api/services/student.service';
import { UserService } from '@/api/services/user.service';
import { SelectLabel } from '@/components/atoms';
import FormTextarea from '@/components/atoms/FormTextarea';
import ActionButtons from '@/components/molecules/ActionButtons';
import Modal from '@/components/molecules/Modal';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { StudentModel } from '@/utils/models/student';
import { SelectStudentCourseGroupValidation } from '@/utils/validation/courseGroup';
import { UpdateStudentValidation } from '@/utils/validation/student';

const resolver = classValidatorResolver(SelectStudentCourseGroupValidation);

export default function StudentList() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [attachmentKey, setAttachmentKey] = useState('');
  const [rejectionText, setRejectionText] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Maybe<StudentModel>>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<SelectStudentCourseGroupValidation>({
    resolver,
    defaultValues: {
      courseGroupId: '',
    },
  });

  const { data: courseGroupData } = useQuery({
    queryFn: CourseGroupService.list.bind(null),
    queryKey: [''],
  });

  const t = useTranslations();

  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: QUERY_KEY.allStudents(debouncedSearch, page),
    queryFn: () =>
      StudentService.list({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch,
      }),
  });

  const {
    isOpen: isAttachmentModalOpen,
    onOpen: openAttachmentModal,
    onClose: closeAttachmentModal,
  } = useDisclosure();

  const {
    isOpen: isRejectStudentModalIsOpen,
    onOpen: openStudentRejectModal,
    onClose: closeStudentRejectModal,
  } = useDisclosure();

  const {
    isOpen: isStudentEditModalOpen,
    onOpen: openStudentEditModal,
    onClose: closeStudentEditModal,
  } = useDisclosure();

  const { mutate: confirmUserById } = useMutation({
    mutationFn: UserService.confirmUserVerificationById,
    onSuccess() {
      refetch();
    },
  });

  const { mutate: updateStudentData } = useMutation({
    mutationFn: (data: UpdateStudentValidation) =>
      StudentService.updateStudentData(data, selectedStudent?.student?.id!),
    onSuccess() {
      refetch();
      closeStudentEditModal();
    },
  });

  const { mutate: rejectUser, isPending } = useMutation({
    mutationFn: UserService.rejectUserEmail,
    onSuccess() {
      closeStudentRejectModal();
    },
  });

  const pageCount = useMemo(() => {
    if (data?.count) {
      return Math.ceil(data.count / ITEMS_PER_PAGE);
    }
  }, [data?.count]);

  const setSearchValue = useCallback(
    (value: string) => {
      if (!!value && page !== 1) {
        setPage(1);
      }
      setSearch(value);
    },
    [page],
  );

  const columnHelper = createColumnHelper<StudentModel>();

  const columns = [
    columnHelper.accessor('attachment', {
      id: uuidv4(),
      cell: info => {
        const existingAvatar = info
          .getValue()
          .find(attachment => attachment.type === AttachmentTypeEnum.AVATAR);
        return (
          <Avatar
            bg="#319795"
            color="#fff"
            name={`${info.row.original.firstName} ${info.row.original.lastName}`}
            src={existingAvatar?.key ? `/api/readfile?path=uploads/${existingAvatar.key}` : ''}
          />
        );
      },
      header: t('avatar'),
    }),
    columnHelper.accessor('firstName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('firstName'),
    }),
    columnHelper.accessor('lastName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('lastName'),
    }),
    columnHelper.accessor('email', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('email'),
    }),
    columnHelper.accessor('attachment', {
      id: uuidv4(),
      cell: info => {
        return (
          <>
            {info.getValue().map((item, index) => (
              <React.Fragment key={index}>
                {item.type === AttachmentTypeEnum.FILE ? (
                  <Button
                    variant="link"
                    onClick={() => {
                      setAttachmentKey(item.key);
                      openAttachmentModal();
                    }}>
                    {t('studentAttachmentButton')}
                  </Button>
                ) : null}
              </React.Fragment>
            ))}
          </>
        );
      },
      header: t('attachment'),
    }),
    columnHelper.accessor('student.faculty.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('faculty'),
    }),
    columnHelper.accessor('student.course.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('course'),
    }),
    columnHelper.accessor('student.courseGroup.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('courseGroup'),
    }),
    columnHelper.accessor('createdAt', {
      id: uuidv4(),
      cell: info => {
        const currentDate = dayjs(info.getValue());
        return currentDate.format('YYYY-MM-DD');
      },
      header: t('createdAt'),
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: ({ row }) => (
        <ActionButtons>
          {!row.original.isAdminVerified && (
            <>
              <MenuItem
                color="green"
                disabled={row.original.isAdminVerified}
                onClick={() => {
                  confirmUserById(row.original.id);
                }}>
                {t('confirm')}
              </MenuItem>
              <MenuItem
                color="red"
                onClick={() => {
                  openStudentRejectModal();
                  setSelectedStudent(row.original);
                }}>
                {t('reject')}
              </MenuItem>
            </>
          )}
          <MenuItem
            color="green"
            onClick={() => {
              openStudentEditModal();
              setSelectedStudent(row.original);
              if (row.original.student?.courseGroup?.id) {
                setValue('courseGroupId', row.original.student.courseGroup.id);
              }
            }}>
            {t('edit')}
          </MenuItem>
        </ActionButtons>
      ),
      header: t('actions'),
    }),
  ];

  const valueChangeHandler = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setRejectionText(e.target.value);
  }, []);

  const updateStudentSubmitHandler = (data: UpdateStudentValidation) => {
    updateStudentData(data);
  };

  return (
    <>
      <SearchTable
        title="studentsList"
        isLoading={isLoading}
        data={data?.users || []}
        count={data?.count || 0}
        // @ts-ignore
        columns={columns}
        sorting={sorting}
        search={search}
        setSorting={setSorting}
        setSearch={setSearchValue}
        hasNextPage={useMemo(
          () => !(!pageCount || page === pageCount || isPlaceholderData),
          [isPlaceholderData, page, pageCount],
        )}
        hasPreviousPage={useMemo(
          () => !(page === 1 || isPlaceholderData),
          [isPlaceholderData, page],
        )}
        fetchNextPage={useCallback(() => setPage(prev => ++prev), [])}
        fetchPreviousPage={useCallback(() => setPage(prev => --prev), [])}
        rowCondition="isAdminVerified"
      />

      <Modal
        isOpen={isRejectStudentModalIsOpen}
        onClose={closeStudentRejectModal}
        title="rejectionMessage">
        <FormTextarea
          handleInputChange={valueChangeHandler}
          value={rejectionText}
          name="reject-message"
        />
        <Button
          isLoading={isPending}
          onClick={() => {
            if (selectedStudent) {
              rejectUser({ userId: selectedStudent.id, message: rejectionText });
            }
          }}>
          {t('send')}
        </Button>
      </Modal>

      <Modal
        isOpen={isAttachmentModalOpen}
        onClose={closeAttachmentModal}
        title="studentAttachment">
        <Image
          src={`/api/readfile?path=uploads/${attachmentKey}`}
          width={400}
          height={400}
          alt="student attachment"
        />
      </Modal>

      <Modal isOpen={isStudentEditModalOpen} onClose={closeStudentEditModal} title="editStudent">
        <Flex
          width={{ base: '100%' }}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap="50px">
          <Controller
            name="courseGroupId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                isRequired
                name={name}
                options={courseGroupData || []}
                labelName="studentCourseGroup"
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value}
                isInvalid={!!errors.courseGroupId?.message}
                formErrorMessage={errors.courseGroupId?.message}
              />
            )}
          />
          <Button
            onClick={handleSubmit(updateStudentSubmitHandler)}
            isDisabled={!isValid}
            width="100%">
            {t('update')}
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
