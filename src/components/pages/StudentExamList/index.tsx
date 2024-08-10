'use client';
import { Fragment, useCallback, useLayoutEffect } from 'react';
import { Button, Divider, Flex, ListItem, UnorderedList } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from 'next-auth';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { StudentService } from '@/api/services/student.service';
import SimpleTable from '@/components/organisms/SimpleTable';
import { Locale } from '@/i18n';
import { ROUTE_DASHBOARD, ROUTE_EXAMINATION } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { StudentExam, StudentExams } from '@/utils/models/student';

const StudentExamList = ({ user, lang }: { user: User; lang: Locale }) => {
  const t = useTranslations();
  const router = useRouter();
  const { data } = useQuery<StudentExams>({
    queryFn: StudentService.getStudentExams,
    queryKey: ['exams'],
    initialData: [],
  });

  useLayoutEffect(() => {
    router.refresh();
  }, [router]);

  const columnHelper = createColumnHelper<StudentExam>();

  const isExamCompleted = useCallback(
    (examId: string) =>
      user?.student?.studentExams.some(
        studentExam => studentExam.examId === examId && studentExam.hasFinished,
      ),
    [user?.student?.studentExams],
  );

  const columns = [
    columnHelper.accessor('studentExamResult', {
      id: uuidv4(),
      cell: info => info.getValue() || '-',
      header: t('results'),
    }),
    columnHelper.accessor('exam.duration', {
      id: uuidv4(),
      cell: info => `${info.getValue()} ${t('minutes')}`,
      header: t('duration'),
    }),
    columnHelper.accessor('exam.id', {
      id: 'exam-id', // should be a static string
      cell: info => {
        const hasExamFinishedForThisStudent = isExamCompleted(info.row.original.exam.id);
        const examStatus = info.row.original.exam.status;

        const disabled = hasExamFinishedForThisStudent || examStatus !== 'IN_PROGRESS';

        return (
          <Button
            disabled={disabled}
            isDisabled={disabled}
            variant="link"
            as={!disabled ? Link : undefined}
            target={!disabled ? '_blank' : '_self'}
            onClick={() => {
              router.push(languagePathHelper(lang, ROUTE_DASHBOARD));
            }}
            href={!disabled ? `${ROUTE_EXAMINATION}/${info.row.original.exam.id}` : undefined}>
            {t('startExam')}
          </Button>
        );
      },
      header: t('startExam'),
    }),
    columnHelper.accessor('exam.status', {
      id: uuidv4(),
      cell: info => {
        const hasExamFinishedForThisStudent = isExamCompleted(info.row.original.exam.id);
        if (hasExamFinishedForThisStudent) {
          return 'COMPLETED';
        }
        return info.getValue().split('_').join(' ');
      },
      header: t('status'),
    }),

    columnHelper.accessor('exam.examLanguages', {
      id: uuidv4(),
      cell: info => (
        <UnorderedList>
          {info.getValue().map((examLanguage, index) => (
            <Fragment key={index}>
              <ListItem key={index}>{examLanguage.title}</ListItem>
              <Divider />
            </Fragment>
          ))}
        </UnorderedList>
      ),
      header: t('examLanguageTitles'),
    }),
    columnHelper.accessor('exam.subject.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('subject'),
    }),
  ];

  return (
    <Flex width="100%" pt={{ base: '30px', md: '100px' }}>
      <SimpleTable columns={columns as any} data={data} title="yourExams" />
    </Flex>
  );
};

export default StudentExamList;
