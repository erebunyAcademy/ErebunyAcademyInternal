'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Avatar, Button, MenuItem, useDisclosure } from '@chakra-ui/react';
import { AttachmentTypeEnum } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import Image from 'next/image';
import { User } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { StudentService } from '@/api/services/student.service';
import { UserService } from '@/api/services/user.service';
import ActionButtons from '@/components/molecules/ActionButtons';
import Modal from '@/components/molecules/Modal';
import SharedAlertDialog from '@/components/molecules/Modals/SharedAlertDialog';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { generateAWSUrl } from '@/utils/helpers/aws';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { StudentModel } from '@/utils/models/student';

export default function Users() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [selectedStudent, setSelectedStudent] = useState<Maybe<User>>(null);
  const [attachmentKey, setAttachmentKey] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose() {
      setSelectedStudent(null);
    },
  });

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: QUERY_KEY.allStudents(debouncedSearch, page),
    queryFn: () =>
      StudentService.list({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        sorting: sorting,
        search: debouncedSearch,
      }),
  });

  const {
    isOpen: isAttachmentModalOpen,
    onOpen: openAttachmentModal,
    onClose: closeAttachmentModal,
  } = useDisclosure();

  const { mutate: deleteUserById } = useMutation({
    mutationFn: UserService.deleteStudentById,
  });

  const { mutate: confirmUserById } = useMutation({
    mutationFn: UserService.confirmUserVerificationById,
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
            src={generateAWSUrl(existingAvatar?.key || '')}
          />
        );
      },
      header: 'Avatar',
    }),
    columnHelper.accessor('firstName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'First Name',
    }),
    columnHelper.accessor('lastName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'Last Name',
    }),
    columnHelper.accessor('email', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'Email',
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
                    See student attachment
                  </Button>
                ) : null}
              </React.Fragment>
            ))}
          </>
        );
      },
      header: 'Attachment',
    }),
    columnHelper.accessor('student.faculty.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'Faculty',
    }),
    columnHelper.accessor('student.studentGrade.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'Student Grade',
    }),
    columnHelper.accessor('student.studentGradeGroup.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'Student Grade Group',
    }),
    columnHelper.accessor('createdAt', {
      id: uuidv4(),
      cell: info => {
        const currentDate = dayjs(info.getValue());
        return currentDate.format('YYYY-MM-DD HH:mm:ss');
      },
      header: 'Created At',
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: ({ row }) => (
        <ActionButtons>
          <MenuItem
            color="green"
            onClick={() => {
              confirmUserById(row.original.id);
            }}>
            Confirm
          </MenuItem>
          <MenuItem
            color="red"
            onClick={() => {
              onOpen();
              setSelectedStudent(row.original as unknown as User);
            }}>
            Delete
          </MenuItem>
        </ActionButtons>
      ),
      header: 'Actions',
    }),
  ];

  return (
    <>
      <SearchTable
        title="Students List"
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
      />
      {isOpen && (
        <SharedAlertDialog
          body={`Are you sure you want to delete ${selectedStudent?.firstName} student?`}
          isOpen={isOpen}
          title="Delete student"
          isLoading={isLoading}
          deleteFn={() => {
            if (selectedStudent?.id) {
              deleteUserById(selectedStudent.id);
            }
          }}
          onClose={onClose}
        />
      )}
      <Modal
        isOpen={isAttachmentModalOpen}
        onClose={closeAttachmentModal}
        title="Student attachment">
        <Image
          src={generateAWSUrl(attachmentKey)}
          width={400}
          height={400}
          alt="student attachment"
        />
      </Modal>
    </>
  );
}
