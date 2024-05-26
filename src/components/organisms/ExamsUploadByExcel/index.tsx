import React, { FC, memo, useCallback, useEffect, useReducer, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { ExcelUpload } from '@/components/molecules';
import { ExcelDataType } from '@/components/molecules/ExcelUpload';
import { prepareExcelAnswersForExam, prepareExcelOptionsForExam } from '@/utils/helpers/excel';
import { Maybe } from '@/utils/models/common';
import {
  EXAM_FIELD_KEY,
  ExamColumnNamesType,
  ExcelReducerActions,
  State,
} from '@/utils/models/exam';

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

const reducer = (state: State, action: ExcelReducerActions) => {
  return {
    ...state,
    [action.type]: action.payload,
  };
};

export type UploadedExcelData = ExcelDataType<
  EXAM_FIELD_KEY,
  string | Maybe<Record<string, string>>[] | Maybe<Array<Maybe<string>>>
>;

interface Props {
  setUploadedResults: React.Dispatch<React.SetStateAction<UploadedExcelData>>;
}

const ExamsUploadByExcel: FC<Props> = ({ setUploadedResults }) => {
  const toast = useToast();
  const [excelData, setExcelData] = useState<Maybe<ExcelDataType>>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

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
    const errors = {} as Record<ExamColumnNamesType, Record<string, string>>;
    const stateItems = Object.entries(state) as [ExamColumnNamesType, string][];
    stateItems.forEach(el => {
      if (!el[1]) {
        errors[el[0]] = { message: 'This field is required' };
      }
    });

    if (!!Object.keys(errors).length) {
      return true;
    }

    excelData?.forEach(el => {
      if (!prepareExcelOptionsForExam(el, state.optionsColumnName)) {
        errors.optionsColumnName = { message: 'Invalid data' };
      }
      if (!prepareExcelAnswersForExam(el, state.answerColumnName)) {
        errors.answerColumnName = { message: 'Invalid data' };
      }
    });

    return !!Object.keys(errors).length;
  }, [excelData, state]);

  useEffect(() => {
    if (excelData?.length) {
      if (checkAndSetErrors()) {
        if (!toast.isActive('opAs')) {
          toast({ title: 'You have imported an invalid file', status: 'warning' });
        }
      } else {
        const { questionColumnName, optionsColumnName, answerColumnName, levelColumnName } = state;

        setUploadedResults(
          excelData
            .map((el, _idx) => ({
              [EXAM_FIELD_KEY.question]: toStringOrNull(el[questionColumnName]),
              [EXAM_FIELD_KEY.options]: prepareExcelOptionsForExam(el, optionsColumnName),
              [EXAM_FIELD_KEY.answers]: prepareExcelAnswersForExam(el, answerColumnName),
              [EXAM_FIELD_KEY.level]: toStringOrNull(el[levelColumnName]),
            }))
            .filter(el => Object.values(el).some(val => !!val)),
        );
      }
    }
  }, [checkAndSetErrors, excelData, setUploadedResults, state, toast]);

  return <ExcelUpload setExcelData={setExcelData} setValues={setExamValues} />;
};

export default memo(ExamsUploadByExcel);
