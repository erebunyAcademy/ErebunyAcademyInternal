import React, { FC, memo } from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

type MultiSelectCheckboxProps = {
  options: any[];
  valueLabel: string;
  nameLabel: string;
  labelName: string;
  onChange?: (selectedValues: string[]) => void;
  selectedValues: string[];
  name?: string;
};

const MultiSelectCheckbox: FC<MultiSelectCheckboxProps> = ({
  options,
  valueLabel,
  nameLabel,
  labelName,
  onChange,
  selectedValues,
  name,
}) => {
  const handleCheckboxChange = (value: string) => {
    const updatedSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(selectedValue => selectedValue !== value)
      : [...selectedValues, value];
    onChange?.(updatedSelectedValues);
  };

  return (
    <FormControl>
      <FormLabel fontWeight={600} marginBottom={4} lineHeight="20px" fontSize={14} color="#222">
        {labelName}
      </FormLabel>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} name={name}>
          {selectedValues.length > 0 ? `${selectedValues.length} selected` : 'Select options'}
        </MenuButton>
        <MenuList>
          {options.map((option, index) => (
            <MenuItem key={index}>
              <Checkbox
                isChecked={selectedValues.includes(option[valueLabel])}
                onChange={() => handleCheckboxChange(option[valueLabel])}>
                {option[nameLabel]}
              </Checkbox>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </FormControl>
  );
};

export default memo(MultiSelectCheckbox);
