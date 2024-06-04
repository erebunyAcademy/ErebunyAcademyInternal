'use client';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { LanguageTypeEnum } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useTranslations } from 'use-intl';
import { TestQuestionService } from '@/api/services/test-question.service';
import CreateEditExam from '@/components/pages/CreateEditExam';
import { TestQuestionListModel } from '@/utils/models/test-question.model';

const languages = [LanguageTypeEnum.EN, LanguageTypeEnum.RU, LanguageTypeEnum.AM];

const Exam = ({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: { language: LanguageTypeEnum };
}) => {
  const [examId, subjectId] = params.slug;
  const t = useTranslations();

  const { data: testQuestionQueryData } = useQuery<TestQuestionListModel>({
    queryKey: ['testQuestion', subjectId, searchParams.language],
    queryFn: TestQuestionService.getTestQuestionsBySubjectId.bind(
      null,
      subjectId,
      searchParams.language,
    ),
    enabled: !!subjectId,
  });

  return (
    <>
      <Tabs
        variant="unstyled"
        mt="30px"
        index={languages.findIndex(l => l === searchParams.language) || 0}>
        <TabList gap="20px">
          <Tab
            fontSize="22px"
            _selected={{ color: '#319795', borderBottom: '3px solid #319795' }}
            as={Link}
            href={`?language=${LanguageTypeEnum.EN}`}>
            {t('english')}
          </Tab>
          <Tab
            fontSize="22px"
            _selected={{ color: '#319795', borderBottom: '3px solid #319795' }}
            as={Link}
            href={`?language=${LanguageTypeEnum.RU}`}>
            {t('russian')}
          </Tab>
          <Tab
            fontSize="22px"
            _selected={{ color: '#319795', borderBottom: '3px solid #319795' }}
            as={Link}
            href={`?language=${LanguageTypeEnum.AM}`}>
            {t('armenian')}
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {testQuestionQueryData && (
              <CreateEditExam
                examId={examId}
                subjectId={subjectId}
                testQuestionQueryData={testQuestionQueryData}
              />
            )}
          </TabPanel>
          <TabPanel>
            {testQuestionQueryData && (
              <CreateEditExam
                examId={examId}
                subjectId={subjectId}
                testQuestionQueryData={testQuestionQueryData}
              />
            )}
          </TabPanel>
          <TabPanel>
            {testQuestionQueryData && (
              <CreateEditExam
                examId={examId}
                subjectId={subjectId}
                testQuestionQueryData={testQuestionQueryData}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Exam;
