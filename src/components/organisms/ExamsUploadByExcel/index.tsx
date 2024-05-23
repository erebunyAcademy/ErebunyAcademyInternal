import React, { memo, useCallback, useEffect, useReducer, useState } from 'react';
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
const SUGGESTED_LEVEL_NAMES = ['level', 'level*', 'մակարդակ', 'մակարդակ*'];

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

const ExamsUploadByExcel = () => {
  const [excelData, setExcelData] = useState<Maybe<DataType>>(null);
  const [data, setData] = useState<DataType>(null);

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

  useEffect(() => {
    if (excelData?.length) {
      setData(
        excelData
          .map(el => ({
            [QUESTION_FIELD_KEY]: toStringOrNull(el[questionColumnName]),
            [OPTION_FIELD_KEY]: toStringOrNull(el[optionsColumnName]),
            [ANSWER_FIELD_KEY]: toStringOrNull(el[answerColumnName]),
            [LEVEL_FIELD_KEY]: toStringOrNull(el[levelColumnName]),
          }))
          .filter(datum => Object.values(datum).some(val => val || Number(val) === 0)),
      );
    }
  }, [excelData, answerColumnName, levelColumnName, optionsColumnName, questionColumnName]);

  console.log(data);

  return <ExcelUpload setExcelData={setExcelData} setValues={setExamValues} />;
};

export default memo(ExamsUploadByExcel);
