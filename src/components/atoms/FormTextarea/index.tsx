import React, { FC, memo } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
  Textarea,
  TextareaProps,
} from '@chakra-ui/react';

type Props = {
  isInvalid?: boolean;
  formLabelName?: string;
  value?: string;
  handleInputChange?: (_event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  formHelperText?: string;
  formErrorMessage?: string;
  placeholder?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  name: string;
  textareaProps?: TextareaProps;
};

const FormTextarea: FC<Props> = ({
  isInvalid,
  value,
  handleInputChange,
  formHelperText,
  formErrorMessage,
  formLabelName,
  placeholder,
  isRequired,
  isReadOnly,
  name,
  textareaProps,
}) => {
  return (
    <FormControl isInvalid={isInvalid} id={name}>
      <FormLabel fontWeight={600} marginBottom={4} lineHeight="20px" fontSize={14} color="#222">
        {formLabelName}
        {isRequired && (
          <Text as="span" color="#222">
            *
          </Text>
        )}
      </FormLabel>
      <Textarea
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        bg="#fff"
        borderRadius={6}
        height="40px"
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
        {...textareaProps}
      />
      {!isInvalid ? (
        <FormHelperText fontWeight={400} color="#5b5b5b" marginTop={4}>
          {formHelperText}
        </FormHelperText>
      ) : (
        <FormErrorMessage color="#DF1414" fontWeight={400} marginTop={4}>
          {formErrorMessage}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export default memo(FormTextarea);
