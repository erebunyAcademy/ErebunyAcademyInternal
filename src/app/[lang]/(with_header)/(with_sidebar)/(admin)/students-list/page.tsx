'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Avatar, Button, MenuItem, useDisclosure } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { AttachmentTypeEnum } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { StudentService } from '@/api/services/student.service';
import { UserService } from '@/api/services/user.service';
import ActionButtons from '@/components/molecules/ActionButtons';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { StudentModel } from '@/utils/models/student';
import { SelectStudentCourseGroupValidation } from '@/utils/validation/courseGroup';
import EditStudentModal from './_components/modals/EditStudentModal';
import RejectMessageModal from './_components/modals/RejectMessageModal';
import StudentAttachmentModal from './_components/modals/StudentAttachmentModal';

const resolver = classValidatorResolver(SelectStudentCourseGroupValidation);

export default function StudentList() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [attachmentKey, setAttachmentKey] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Maybe<StudentModel>>(null);
  const t = useTranslations();

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

      <RejectMessageModal
        closeStudentRejectModal={closeStudentRejectModal}
        isRejectStudentModalIsOpen={isRejectStudentModalIsOpen}
        selectedStudent={selectedStudent}
      />

      <StudentAttachmentModal
        isAttachmentModalOpen={isAttachmentModalOpen}
        closeAttachmentModal={closeAttachmentModal}
        attachmentKey={attachmentKey}
      />

      <EditStudentModal
        isStudentEditModalOpen={isStudentEditModalOpen}
        closeStudentEditModal={closeStudentEditModal}
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
        isValid={isValid}
        selectedStudent={selectedStudent}
        refetch={refetch}
      />
    </>
  );
}
