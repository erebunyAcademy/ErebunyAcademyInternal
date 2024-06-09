'use client';
import React, { FC, useState } from 'react';
import { Button, Flex, Stack } from '@chakra-ui/react';
import { LanguageTypeEnum } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ExamService } from '@/api/services/exam.service';
import { SelectLabel } from '@/components/atoms';
import { Locale } from '@/i18n';
import { ROUTE_EXAMINATION, ROUTE_STUDENT_EXAM_LIST } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import Modal from '../Modal';

type SelectExamLanguageModalProps = {
  examTranslation: { id: string; language: LanguageTypeEnum }[];
  examId: string;
  lang: Locale;
};

const SelectExamLanguageModal: FC<SelectExamLanguageModalProps> = ({
  examTranslation,
  examId,
  lang,
}) => {
  const [examTr, setExamTr] = useState('');
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: ExamService.getFirstTestQuestionByExamTrId.bind(null, examTr),
  });

  const formSubmitHandler = () => {
    mutate(undefined, {
      onSuccess(res) {
        router.push(`${ROUTE_EXAMINATION}/${examId}/${examTr}/${res?.id}`);
      },
    });
  };

  return (
    <Modal
      isOpen
      onClose={() => router.push(languagePathHelper(lang, ROUTE_STUDENT_EXAM_LIST))}
      title={'In which language you would prefer to start exam?'}>
      <Stack>
        <Flex flexDirection="column" gap="20px">
          <SelectLabel
            isRequired
            options={examTranslation}
            labelName={'course'}
            valueLabel="id"
            nameLabel="language"
            name="examTranslation"
            value={examTr}
            onChange={e => setExamTr(e.target.value)}
          />
          <Button onClick={formSubmitHandler}>Create exam</Button>
        </Flex>
      </Stack>
    </Modal>
  );
};

export default SelectExamLanguageModal;
