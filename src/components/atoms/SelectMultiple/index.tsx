import React, { FC } from 'react';
import {
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

export type MultiSelectMenuProps = {
  label: string;
  options: { id: string; title: string }[];
  onChange: (value: string | string[]) => void;
  buttonProps?: ButtonProps;
  value: string[];
  formErrorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  placeholder: string;
};

const SelectMultiple: FC<MultiSelectMenuProps> = ({
  label,
  options,
  onChange,
  buttonProps,
  value,
  isInvalid,
  formErrorMessage,
  isRequired,
  placeholder,
}) => {
  const t = useTranslations();

  return (
    <Menu closeOnSelect={false}>
      {() => (
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
              color={value.length ? '#000' : 'gray.600'}
              borderColor={value.length ? '#3cb4e7' : 'gray.300'}
              borderRadius={6}
              height="40px"
              p="8px 12px"
              bg={value.length ? '#E8F0FE' : '#fff'}
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
              {placeholder}
            </MenuButton>
            <MenuList maxHeight="300px" overflowY="auto">
              <MenuOptionGroup value={value} type="checkbox" onChange={onChange}>
                {options.map(option => (
                  <MenuItemOption key={option.id} value={option.id}>
                    {option.title}
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
  );
};

export default SelectMultiple;
