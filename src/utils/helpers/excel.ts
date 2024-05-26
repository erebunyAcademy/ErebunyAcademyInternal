import { createStandaloneToast } from '@chakra-ui/react';
import { Maybe } from '../models/common';

export const prepareExcelOptionsForExam = (data: Record<string, Maybe<string>>, column: string) => {
  const obj = data[column];
  const { toast } = createStandaloneToast({
    defaultOptions: { id: 'opAs', status: 'warning', duration: 10000 },
  });

  if (!obj) {
    toast({ title: 'Answer not found' });
    return null;
  }

  const optionsArray = obj
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');

  return optionsArray
    .map(option => {
      if (/^[a-z]\.\s/.test(option)) {
        const key = option[0];
        const lastWord = option[option.length - 1];
        const value = option
          .slice(3)
          .trim()
          .slice(0, lastWord === ';' ? -1 : undefined);

        return { [key]: value };
      } else {
        toast({
          title: 'Invalid option format:',
          description: `In ${column} column, "${option}"`,
        });
        return null;
      }
    })
    .filter(option => !!option);
};

export const prepareExcelAnswersForExam = (data: Record<string, Maybe<string>>, column: string) => {
  const obj = data[column];
  const { toast } = createStandaloneToast({
    defaultOptions: { id: 'opAs', status: 'warning', duration: 10000 },
  });

  if (!obj) {
    toast({ title: 'Answer not found' });
    return null;
  }

  const answers = obj
    .trim()
    .split(';')
    .filter(line => line.trim() !== '');

  return answers
    .map((answer, idx) => {
      if (answer.length === 1) {
        return { [`answer-${idx + 1}`]: answer.toLowerCase() };
      } else {
        toast({
          title: 'Invalid answer format:',
          description: `In ${column} column, "${answer}"`,
        });
        return null;
      }
    })
    .filter(answer => !!answer);
};
