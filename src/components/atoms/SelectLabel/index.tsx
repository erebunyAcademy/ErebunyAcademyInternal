import React, { FC, memo } from 'react';
import { FormControl, FormErrorMessage, FormLabel, Select, Text } from '@chakra-ui/react';

type SelectLabelProps = {
  options: any[];
  valueLabel: string;
  nameLabel: string;
  labelName: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  value: string;
  name?: string;
  placeholder?: string;
  formErrorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
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
  formErrorMessage,
  isInvalid,
  isRequired,
}) => {
  return (
    <FormControl isInvalid={isInvalid} id={name}>
      <FormLabel fontWeight={600} marginBottom={4} lineHeight="20px" fontSize={14} color="#222">
        {labelName}
        {isRequired && (
          <Text as="span" color="#222">
            *
          </Text>
        )}
      </FormLabel>
      <Select onChange={onChange} value={value} name={name} placeholder={placeholder}>
        <option selected value="" disabled>
          Select an option
        </option>
        {options.map((option, index) => (
          <option key={index} value={option[valueLabel]}>
            {option[nameLabel]}
          </option>
        ))}
      </Select>
      {isInvalid && (
        <FormErrorMessage color="#DF1414" fontWeight={400} marginTop={4}>
          {formErrorMessage}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default memo(SelectLabel);
