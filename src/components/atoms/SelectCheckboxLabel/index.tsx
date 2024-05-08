import React, { FC, memo } from 'react';
import { CheckboxGroup, FormControl, FormLabel, Stack } from '@chakra-ui/react';
import Checkbox from '../Checkbox';

type SelectLabelProps = {
  options: any[];
  valueLabel: string;
  nameLabel: string;
  labelName: string;
  onChange: (values: string[]) => void;
  value: string[];
  name?: string;
};

const SelectLabel: FC<SelectLabelProps> = ({
  options,
  valueLabel,
  nameLabel,
  labelName,
  onChange,
  value,
  name,
}) => {
  return (
    <FormControl>
      <FormLabel fontWeight={600} marginBottom={4} lineHeight="20px" fontSize={14} color="#222">
        {labelName}
      </FormLabel>
      <CheckboxGroup colorScheme="green" value={value} onChange={onChange}>
        <Stack>
          {options.map((option, index) => (
            <Checkbox key={index} value={option[valueLabel]} name={name}>
              {option[nameLabel]}
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    </FormControl>
  );
};

export default memo(SelectLabel);
