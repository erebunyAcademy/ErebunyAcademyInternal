import React, { ChangeEvent, FC, memo, useEffect, useRef, useState } from 'react';
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  List,
  ListItem,
  Text,
  useDisclosure,
  useOutsideClick,
} from '@chakra-ui/react';
import { useTranslations } from 'use-intl';

interface AutocompleteProps {
  options: { [key: string]: string | number }[] | [];
  disabledOptions?: Array<string | number>;
  valueLabel: string;
  nameLabel: string;
  labelName?: string;
  onChange?: (value: string | number) => void;
  value: string | number;
  name?: string;
  placeholder?: string;
  isRequired?: boolean;
  formHelperText?: string;
  formErrorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
}

const Autocomplete: FC<AutocompleteProps> = ({
  name,
  options,
  labelName,
  valueLabel,
  nameLabel,
  onChange,
  value,
  placeholder,
  isRequired,
  formHelperText,
  formErrorMessage,
  isInvalid,
  isDisabled,
}) => {
  const t = useTranslations();
  const [inputValue, setInputValue] = useState<string | number>('');
  const [filteredOptions, setFilteredOptions] = useState<typeof options>([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialOption = options.find(option => option[valueLabel] === value);
    if (initialOption) {
      setInputValue(initialOption[nameLabel]);
    }
  }, [value, options, valueLabel, nameLabel]);

  useOutsideClick({
    ref: containerRef,
    handler: onClose,
  });

  useEffect(() => {
    const filtered = options.filter(option =>
      option[nameLabel].toString().toLowerCase().includes(String(inputValue).toLowerCase()),
    );
    setFilteredOptions(filtered);
  }, [inputValue, options, nameLabel]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onOpen();
  };

  const handleSelect = (option: { [key: string]: string | number }) => {
    setInputValue(option[nameLabel]);
    onClose();
    onChange?.(option[valueLabel]);
  };

  return (
    <FormControl isInvalid={isInvalid} ref={containerRef}>
      {labelName && (
        <FormLabel fontWeight="bold" mb={4} lineHeight="20px" fontSize="14px" color="#222">
          {t(labelName)}
          {isRequired && (
            <Text as="span" color="#222">
              {' '}
              *
            </Text>
          )}
        </FormLabel>
      )}
      <Input
        name={name}
        value={inputValue}
        placeholder={placeholder}
        onChange={handleInputChange}
        isDisabled={isDisabled}
        onFocus={onOpen}
      />
      {isOpen && (
        <Box position="relative" zIndex={10}>
          <List
            position="absolute"
            width="100%"
            maxHeight="200px"
            overflowY="auto"
            background="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            mt={1}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <ListItem
                  key={index}
                  padding="8px"
                  _hover={{ background: 'gray.100', cursor: 'pointer' }}
                  onClick={() => handleSelect(option)}>
                  {option[nameLabel]}
                </ListItem>
              ))
            ) : (
              <ListItem padding="8px">{t('noOptionsFound')}</ListItem>
            )}
          </List>
        </Box>
      )}
      {formHelperText && !isInvalid && (
        <FormHelperText color="gray.500" mt={1}>
          {t(formHelperText)}
        </FormHelperText>
      )}
      {isInvalid && formErrorMessage && (
        <FormErrorMessage color="red.500" mt={1}>
          {t(formErrorMessage)}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default memo(Autocomplete);
