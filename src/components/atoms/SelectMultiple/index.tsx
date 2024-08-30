import React, { FC, useState } from 'react';
import {
  ButtonProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';

export type MultiSelectMenuProps = {
  label: string;
  options: string[];
  onChange?: (selectedValues: string[]) => void;
  buttonProps?: ButtonProps;
  value: string[];
};

const MultiSelectMenu: FC<MultiSelectMenuProps> = ({
  label,
  options,
  onChange,
  buttonProps,
  value,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(value || []);

  const handleClearAll = (onClose: () => void) => {
    setSelectedOptions([]);
    onClose();
  };

  const handleSelectionChange = (values: string[] | string) => {
    // Ensure values are an array of strings and filter out empty strings
    const updatedValues = Array.isArray(values) ? values.filter(Boolean) : [values];
    setSelectedOptions(updatedValues);
    onChange?.(updatedValues);
  };

  return (
    <Menu closeOnSelect={false}>
      {({ onClose }) => (
        <>
          <MenuButton
            type="button"
            backgroundColor={selectedOptions.length ? 'purple.200' : 'white'}
            color={selectedOptions.length ? 'purple.500' : 'gray.600'}
            borderColor={selectedOptions.length ? 'purple.200' : 'gray.300'}
            borderRadius={6}
            height="40px"
            p="8px 12px"
            bg="#fff"
            boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.05)"
            _focus={{
              border: '1px solid #3cb4e7',
            }}
            _focusVisible={{
              border: '1px solid #3cb4e7',
            }}
            _readOnly={{
              bg: 'violet.50',
              color: 'violet.200',
              border: '1px solid grey.100',
            }}
            _placeholder={{
              color: 'grey.100',
              fontSize: 16,
              fontWeight: 400,
              fontStyle: 'normal',
            }}
            _invalid={{
              border: '1px solid #DF1414',
            }}
            {...buttonProps}>
            {`${label}${selectedOptions.length > 0 ? ` (${selectedOptions.length})` : ''}`}
          </MenuButton>
          <MenuList>
            <MenuGroup>
              <MenuItem onClick={() => handleClearAll(onClose)}>Clear all</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuOptionGroup
              defaultValue={selectedOptions}
              type="checkbox"
              onChange={values => handleSelectionChange(values as string[])}>
              {options.map(option => (
                <MenuItemOption key={`multiselect-menu-${option}`} value={option}>
                  {option}
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default MultiSelectMenu;
