import React, { ChangeEventHandler, FC, memo } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Select,
  SelectFieldProps,
  Text,
} from '@chakra-ui/react';
import { useTranslations } from 'use-intl';

interface SelectLabelProps extends SelectFieldProps {
  options: { [key: string]: string | number }[] | [];
  disabledOptions?: Array<string | number>;
  valueLabel: string;
  nameLabel: string;
  labelName?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  value: string | number;
  name?: string;
  placeholder?: string;
  isRequired?: boolean;
  formHelperText?: string;
  formErrorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
}

const SelectLabel: FC<SelectLabelProps> = ({
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
  disabledOptions,
}) => {
  const t = useTranslations();

  return (
    <FormControl isInvalid={isInvalid}>
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
      <Select
        onChange={onChange}
        value={value}
        name={name}
        placeholder={placeholder}
        isDisabled={isDisabled}>
        <option value="" disabled>
          {t('selectOption')}
        </option>
        {options.map((option, index) => (
          <option
            key={index}
            value={option[valueLabel]}
            {...(disabledOptions
              ? { disabled: disabledOptions.includes(option[valueLabel]) }
              : {})}>
            {option[nameLabel]}
          </option>
        ))}
      </Select>
      {!isInvalid && formHelperText && (
        <FormHelperText fontWeight="normal" color="#5b5b5b" mt={4}>
          {t(formHelperText)}
        </FormHelperText>
      )}
      {isInvalid && formErrorMessage && (
        <FormErrorMessage color="#DF1414" fontWeight="normal" mt={4}>
          {t(formErrorMessage)}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default memo(SelectLabel);
