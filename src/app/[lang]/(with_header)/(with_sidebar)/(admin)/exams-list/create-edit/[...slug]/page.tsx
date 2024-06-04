'use client';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useTranslations } from 'use-intl';
import CreateEditExam from '@/components/pages/CreateEditExam';

const CreateEdit = ({ params }: { params: { slug: string[] } }) => {
  const [examId, subjectId] = params.slug;
  const t = useTranslations();

  return (
    <>
      <Tabs variant="unstyled" mt="30px">
        <TabList gap="20px">
          <Tab fontSize="22px" _selected={{ color: '#319795', borderBottom: '3px solid #319795' }}>
            {t('english')}
          </Tab>
          <Tab fontSize="22px" _selected={{ color: '#319795', borderBottom: '3px solid #319795' }}>
            {t('russian')}
          </Tab>
          <Tab fontSize="22px" _selected={{ color: '#319795', borderBottom: '3px solid #319795' }}>
            {t('armenian')}
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <CreateEditExam examId={examId} subjectId={subjectId} />;
          </TabPanel>
          <TabPanel>
            <CreateEditExam examId={examId} subjectId={subjectId} />;
          </TabPanel>
          <TabPanel>
            <CreateEditExam examId={examId} subjectId={subjectId} />;
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default CreateEdit;
