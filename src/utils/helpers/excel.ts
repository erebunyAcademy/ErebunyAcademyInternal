import { createStandaloneToast } from '@chakra-ui/react';
import { Maybe } from '../models/common';

function getAlphabetFromIndex(index: number) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  if (index >= 0 && index < alphabet.length) {
    return alphabet[index];
  } else {
    return null;
  }
}

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
    .map((option, idx) => {
      if (/^[a-z]\.\s/.test(option)) {
        const key = option[0];
        const value = option.slice(3).trim().slice(0, undefined);

        return { [key]: value };
      } else {
        const opt = `${getAlphabetFromIndex(idx)}. ${option}`;
        const key = opt[0];
        const value = opt.slice(3).trim().slice(0, undefined);
        // toast({
        //   title: 'Invalid option format:',
        //   description: `In ${column} column, "${option}"`,
        // });
        return { [key]: value };
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
    .map(answer => {
      if (answer.length === 1) {
        return answer.toLowerCase().trim();
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
