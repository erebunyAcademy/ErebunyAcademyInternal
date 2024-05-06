import React, { FC, memo, useState } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';

interface FormInputProps extends InputProps {
  isInvalid?: boolean;
  formLabelName?: string;
  value?: string;
  handleInputChange?: (_event: React.ChangeEvent<HTMLInputElement>) => void;
  formHelperText?: string;
  formErrorMessage?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  name: string;
  inputProps?: InputProps;
}

const FormInput: FC<FormInputProps> = ({
  isInvalid,
  value,
  handleInputChange,
  formHelperText,
  formErrorMessage,
  type,
  formLabelName,
  placeholder,
  isRequired,
  isReadOnly,
  name,
  inputProps,
  ...rest
}) => {
  const [isPasswordType, setIsPasswordType] = useState(true);

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
      <InputGroup>
        <Input
          type={isPasswordType ? type : 'text'}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          isReadOnly={isReadOnly}
          isRequired={isRequired}
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
          {...inputProps}
          {...rest}
        />
        {type === 'password' && (
          <InputRightElement>
            {isPasswordType ? (
              <Image
                width={20}
                height={20}
                alt="eye"
                style={{
                  cursor: 'pointer',
                }}
                src={'/icons/eye_open.svg'}
                onClick={() => setIsPasswordType(false)}
              />
            ) : (
              <Image
                width={20}
                height={20}
                alt="eye"
                style={{
                  cursor: 'pointer',
                }}
                src={'/icons/eye_closed.svg'}
                onClick={() => setIsPasswordType(true)}
              />
            )}
          </InputRightElement>
        )}
      </InputGroup>
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

export default memo(FormInput);
