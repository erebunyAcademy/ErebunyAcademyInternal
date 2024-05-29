import { ChangeEventHandler, FC, memo, useCallback, useRef } from 'react';
import { Button, Input, useToast } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import * as XLSX from 'xlsx';
import { Maybe } from '@/utils/models/common';

const fileTypes = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/x-iwork-numbers-sffnumbers',
  'text/csv',
];

export type ExcelDataType<T extends string = string, K = string> = Maybe<
  Array<Record<T, Maybe<K>>>
>;

interface Props {
  setExcelData: React.Dispatch<React.SetStateAction<ExcelDataType>>;
  setValues: (uniqueKeys: Array<string>) => void;
}

const ExcelUpload: FC<Props> = ({ setExcelData, setValues }) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFileClick = useCallback(() => fileInputRef.current?.click(), []);
  const t = useTranslations();

  const handleFile: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      e.preventDefault();
      if (!e.target.files?.length) {
        toast({ title: 'Please select your file', status: 'warning' });
        return;
      }
      const selectedFile = e.target.files[0];

      if (!fileTypes.includes(selectedFile.type)) {
        toast({ title: 'Please select only excel file types', status: 'error' });

        return;
      }

      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = e => {
        if (e.target?.result) {
          const excelFile = e.target?.result;

          const workbook = XLSX.read(excelFile, { type: 'buffer' });
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          const data = XLSX.utils.sheet_to_json(worksheet, { defval: null });
          const convertedDataKeys = data.flatMap(item => Object.keys(item as {}));
          const uniqueKeys = Array.from(new Set(convertedDataKeys)).filter(
            key => !key.startsWith('__EMPTY'),
          );

          if (!data.length) {
            return toast({ title: 'You have imported an empty file', status: 'error' });
          }
          setExcelData(data as ExcelDataType);
          setValues(uniqueKeys);
        } else {
          toast({ title: 'Something went wrong', status: 'error' });
        }
      };
    },
    [setExcelData, setValues, toast],
  );

  return (
    <>
      <Button fontSize="14px" size="sm" onClick={uploadFileClick}>
        {t('uploadExcelFile')}
      </Button>
      <Input
        required
        ref={fileInputRef}
        multiple={false}
        type="file"
        name="file"
        title=""
        position="absolute"
        display="none"
        top={0}
        bottom={0}
        left={0}
        onChange={handleFile}
      />
    </>
  );
};

export default memo(ExcelUpload);
