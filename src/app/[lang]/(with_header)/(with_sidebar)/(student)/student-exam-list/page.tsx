'use client';
import { useState } from 'react';
import {
  Button,
  Divider,
  Flex,
  ListItem,
  Text,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { ExamService } from '@/api/services/exam.service';
import { StudentService } from '@/api/services/student.service';
import Modal from '@/components/molecules/Modal';
import SimpleTable from '@/components/organisms/SimpleTable';
import { ROUTE_EXAMINATION } from '@/utils/constants/routes';
import { StudentExam, StudentExams } from '@/utils/models/student';

const StudentExamList = () => {
  const t = useTranslations();
  const router = useRouter();
  const [info, setInfo] = useState('The exam has not yet started.');
  const { data } = useQuery<StudentExams>({
    queryFn: StudentService.getStudentExams,
    queryKey: ['exams'],
  });

  const {
    isOpen: isStudentInfoModalOpen,
    onOpen: openStudentInfoModal,
    onClose: closeStudentInfoModal,
  } = useDisclosure();

  const { mutate: checkStudentPermission } = useMutation({
    mutationFn: ExamService.createStudentUuid,
  });

  const columnHelper = createColumnHelper<StudentExam>();

  const checkStartExam = (studentExam: StudentExam) => {
    if (studentExam.exam.status !== 'IN_PROGRESS') {
      return openStudentInfoModal();
    }
    checkStudentPermission(studentExam.exam.id, {
      onSuccess(res) {
        setCookie('student-exam-uuid', res.uniqueId);
        router.push(`${ROUTE_EXAMINATION}/${studentExam.exam.id}`);
      },
      onError(err) {
        setInfo(err.message);
      },
    });
  };

  const columns = [
    columnHelper.accessor('exam.duration', {
      id: uuidv4(),
      cell: info => `${info.getValue()} minutes`,
      header: t('duration'),
    }),
    columnHelper.accessor('exam.id', {
      id: uuidv4(),
      cell: info => (
        <Button variant="link" onClick={checkStartExam.bind(null, info.row.original)}>
          Start Exam
        </Button>
      ),
      header: t('startExam'),
    }),
    columnHelper.accessor('exam.examLanguages', {
      id: uuidv4(),
      cell: info => (
        <UnorderedList>
          {info.getValue().map((examLanguage, index) => (
            <>
              <ListItem key={index}>{examLanguage.title}</ListItem>
              <Divider />
            </>
          ))}
        </UnorderedList>
      ),
      header: t('examLanguageTitles'),
    }),
    columnHelper.accessor('exam.subject.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('subjectTitle'),
    }),
  ];

  return (
    <Flex width="100%">
      {data && <SimpleTable columns={columns as any} data={data} title="Your exams" />}
      <Modal isOpen={isStudentInfoModalOpen} onClose={closeStudentInfoModal} title="startExam">
        <Flex
          width={{ base: '100%' }}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap="50px">
          <Text>{info}</Text>
        </Flex>
      </Modal>
    </Flex>
  );
};

export default StudentExamList;
