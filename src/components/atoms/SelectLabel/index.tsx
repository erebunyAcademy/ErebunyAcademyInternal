import React, { FC, memo } from 'react';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';

type SelectLabelProps = {
  options: any[];
  valueLabel: string;
  nameLabel: string;
  labelName: string;
  onChange: (e: any) => void;
  value: string;
};

const SelectLabel: FC<SelectLabelProps> = ({
  options,
  valueLabel,
  nameLabel,
  labelName,
  onChange,
  value,
}) => {
  return (
    <FormControl>
      <FormLabel fontWeight={600} marginBottom={4} lineHeight="20px" fontSize={14} color="#222">
        {labelName}
      </FormLabel>
      <Select onChange={onChange} value={value}>
        {options.map((option, index) => (
          <option key={index} value={option[valueLabel]}>
            {option[nameLabel]}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default memo(SelectLabel);
