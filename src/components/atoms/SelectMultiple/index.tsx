import React, { FC, useState } from 'react';
import {
  Box,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

export type MultiSelectMenuProps = {
  label: string;
  options: string[];
  onChange?: (selectedValues: string[]) => void;
  buttonProps?: ButtonProps;
  value: string[];
  formErrorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
};

const MultiSelectMenu: FC<MultiSelectMenuProps> = ({
  label,
  options,
  onChange,
  buttonProps,
  value,
  isInvalid,
  formErrorMessage,
  isRequired,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(value || []);

  const t = useTranslations();

  const handleClearAll = (onClose: () => void) => {
    setSelectedOptions([]);
    onChange?.([]);
    onClose();
  };

  const handleSelectionChange = (values: string[] | string) => {
    const updatedValues = Array.isArray(values) ? values.filter(Boolean) : [values];
    setSelectedOptions(updatedValues);
    onChange?.(updatedValues);
  };

  return (
    <Box>
      <Menu closeOnSelect={false}>
        {({ onClose }) => (
          <>
            <FormControl>
              <FormLabel fontWeight="bold" mb={4} lineHeight="20px" fontSize="14px" color="#222">
                {t(label)}
                {isRequired && (
                  <Text as="span" color="#222">
                    {' '}
                    *
                  </Text>
                )}
              </FormLabel>

              <MenuButton
                width={{ base: '100%', md: '50%' }}
                type="button"
                textAlign="left"
                color={selectedOptions.length ? '#000' : 'gray.600'}
                borderColor={selectedOptions.length ? '#3cb4e7' : 'gray.300'}
                borderRadius={6}
                height="40px"
                p="8px 12px"
                bg={selectedOptions.length ? '#E8F0FE' : '#fff'}
                boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.05)"
                border="1px solid #CBD5E0"
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
                {selectedOptions.length === 0
                  ? t('selectOption')
                  : `${t('teachingSubjects')} (${selectedOptions.length})`}
              </MenuButton>
              <MenuList>
                <MenuGroup>
                  <MenuItem onClick={() => handleClearAll(onClose)}>{t('clearAll')}</MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuOptionGroup
                  value={selectedOptions}
                  type="checkbox"
                  onChange={values => handleSelectionChange(values as string[])}>
                  {options.map(option => (
                    <MenuItemOption key={`multiselect-menu-${option}`} value={option}>
                      {option}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
              {isInvalid && (
                <FormErrorMessage color="#DF1414" fontWeight="normal" mt={4}>
                  {t(formErrorMessage)}
                </FormErrorMessage>
              )}
            </FormControl>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default MultiSelectMenu;
