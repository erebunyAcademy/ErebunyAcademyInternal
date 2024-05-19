import React, { FC, memo } from 'react';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';

type SelectLabelProps = {
  options: any[];
  valueLabel: string;
  nameLabel: string;
  labelName: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  value: string;
  name?: string;
  placeholder?: string;
};

const SelectLabel: FC<SelectLabelProps> = ({
  name,
  options,
  labelName,
  valueLabel,
  nameLabel,
  onChange,
  value,
  placeholder,
}) => {
  console.log({ value });
  return (
    <FormControl>
      <FormLabel fontWeight={600} marginBottom={4} lineHeight="20px" fontSize={14} color="#222">
        {labelName}
      </FormLabel>
      <Select onChange={onChange} value={value} name={name} placeholder={placeholder}>
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
