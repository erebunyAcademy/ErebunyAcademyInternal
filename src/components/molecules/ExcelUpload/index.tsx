import { ChangeEventHandler, memo, MouseEventHandler, useCallback, useState } from 'react';
import { Box, Button, Input, useToast } from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import { Maybe } from '@/utils/models/common';

const fileTypes = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/x-iwork-numbers-sffnumbers',
  'text/csv',
];

// const SUGGESTED_QUESTION_NAMES = ['question', 'question*'];

const ExcelUpload = () => {
  const [excelFile, setExcelFile] = useState<FileReader['result']>(null);
  const [_, setExcelData] = useState<Maybe<unknown[]>>(null);
  const toast = useToast();

  const handleFile: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      if (!e.target.files?.length) {
        toast({ title: 'Please select your file', status: 'warning' });
        return;
      }
      const selectedFile = e.target.files[0];

      if (!fileTypes.includes(selectedFile.type)) {
        toast({ title: 'Please select only excel file types', status: 'error' });
        setExcelFile(null);
        return;
      }

      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = e => {
        if (e.target?.result) {
          setExcelFile(e.target.result);
        } else {
          toast({ title: 'Something went wrong', status: 'error' });
          setExcelFile(null);
        }
      };
    },
    [toast],
  );

  const handleFileSubmit: MouseEventHandler<HTMLButtonElement> = useCallback(
    e => {
      e.preventDefault();
      if (!excelFile) {
        toast({ title: 'Something went wrong', status: 'error' });
      }

      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      setExcelData(data);
    },
    [excelFile, toast],
  );

  return (
    <Box>
      <Input required type="file" onChange={handleFile} />
      <Button onClick={handleFileSubmit}>UPLOAD</Button>
    </Box>
  );
};

export default memo(ExcelUpload);
