import React, { FC, memo, useCallback, useEffect, useReducer, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { ExcelUpload } from '@/components/molecules';
import { DataType } from '@/components/molecules/ExcelUpload';
import { Maybe } from '@/utils/models/common';

type Case = 'questionColumnName' | 'optionsColumnName' | 'answerColumnName' | 'levelColumnName';

interface State {
  questionColumnName: string;
  optionsColumnName: string;
  answerColumnName: string;
  levelColumnName: string;
}
type Action = { type: Case; payload: string };

const QUESTION_FIELD_KEY = 'question';
const OPTION_FIELD_KEY = 'options';
const ANSWER_FIELD_KEY = 'answer';
const LEVEL_FIELD_KEY = 'level';

const SUGGESTED_QUESTION_NAMES = ['question', 'question*', 'հարց', 'հարց*'];
const SUGGESTED_OPTION_NAMES = ['options', 'options*', 'տարբերակ', 'տարբերակ*'];
const SUGGESTED_ANSWER_NAMES = ['answers', 'answers*', 'պատասխան', 'պատասխան*'];
const SUGGESTED_LEVEL_NAMES = [
  'level',
  'level*',
  'complexity',
  'complexity*',
  'մակարդակ',
  'մակարդակ*',
];

const toStringOrNull = (value: Maybe<string>) => (value ? String(value).trim() : null);

const initialState = {
  questionColumnName: '',
  optionsColumnName: '',
  answerColumnName: '',
  levelColumnName: '',
};

const reducer = (state: State, action: Action) => {
  return {
    ...state,
    [action.type]: action.payload,
  };
};

interface Props {
  setUploadedResults: React.Dispatch<React.SetStateAction<DataType>>;
}

const ExamsUploadByExcel: FC<Props> = ({ setUploadedResults }) => {
  const [excelData, setExcelData] = useState<Maybe<DataType>>(null);

  const toast = useToast();

  const [{ questionColumnName, optionsColumnName, answerColumnName, levelColumnName }, dispatch] =
    useReducer(reducer, initialState);

  const setExamValues = useCallback((uniqueKeys: Array<string>) => {
    uniqueKeys.forEach(columnName => {
      const formattedColumn = columnName.replace(/\s/g, '').toLowerCase();
      if (SUGGESTED_QUESTION_NAMES.includes(formattedColumn)) {
        dispatch({ type: 'questionColumnName', payload: columnName });
      }
      if (SUGGESTED_OPTION_NAMES.includes(formattedColumn)) {
        dispatch({ type: 'optionsColumnName', payload: columnName });
      }
      if (SUGGESTED_ANSWER_NAMES.includes(formattedColumn)) {
        dispatch({ type: 'answerColumnName', payload: columnName });
      }
      if (SUGGESTED_LEVEL_NAMES.includes(formattedColumn)) {
        dispatch({ type: 'levelColumnName', payload: columnName });
      }
    });
  }, []);

  const checkAndSetErrors = useCallback(() => {
    const error = {} as Record<Case, Record<string, string>>;
    const message = 'This field is required';
    if (!questionColumnName) {
      error.questionColumnName = { message };
    }
    if (!optionsColumnName) {
      error.optionsColumnName = { message };
    }
    if (!answerColumnName) {
      error.answerColumnName = { message };
    }
    if (!levelColumnName) {
      error.levelColumnName = { message };
    }

    console.log(error);

    return !!Object.keys(error).length;
  }, [answerColumnName, levelColumnName, optionsColumnName, questionColumnName]);

  useEffect(() => {
    if (excelData?.length) {
      if (checkAndSetErrors()) {
        toast({ title: 'You have imported an invalid file', status: 'error' });
      } else {
        setUploadedResults(
          excelData
            .map(el => ({
              [QUESTION_FIELD_KEY]: toStringOrNull(el[questionColumnName]),
              [OPTION_FIELD_KEY]: toStringOrNull(el[optionsColumnName]),
              [ANSWER_FIELD_KEY]: toStringOrNull(el[answerColumnName]),
              [LEVEL_FIELD_KEY]: toStringOrNull(el[levelColumnName]),
            }))
            .filter(el => Object.values(el).some(val => val || Number(val) === 0)),
        );
      }
    }
  }, [
    answerColumnName,
    checkAndSetErrors,
    excelData,
    levelColumnName,
    optionsColumnName,
    questionColumnName,
    setUploadedResults,
    toast,
  ]);

  return <ExcelUpload setExcelData={setExcelData} setValues={setExamValues} />;
};

export default memo(ExamsUploadByExcel);
