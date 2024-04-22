import React, { FC, memo } from 'react';
import { FormControl, FormLabel, Text } from '@chakra-ui/react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { segoe } from '@/utils/constants/fonts';

type PhoneNumberInputProps = {
  value: string;
  country?: string;
  onChange: (e: { target: { value: string } }) => void;
  placeholder?: string;
  isRequired?: boolean;
  formLabelName?: string;
  isDisabled?: boolean;
};

const PhoneNumberInput: FC<PhoneNumberInputProps> = ({
  onChange,
  value,
  isRequired,
  formLabelName = 'Phone Number',
  isDisabled = false,
}) => {
  return (
    <FormControl>
      <FormLabel
        fontWeight={600}
        marginBottom={4}
        lineHeight="20px"
        fontSize={14}
        color="#222"
        className={segoe.className}>
        {formLabelName}
        {isRequired && (
          <Text as="span" color="#222">
            *
          </Text>
        )}
      </FormLabel>
      <PhoneInput
        disabled={isDisabled}
        country="am"
        value={value}
        onChange={(phone: string) => onChange({ target: { value: phone } })}
        inputStyle={{
          width: '100%',
          height: 40,
          borderRadius: 6,
          boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgb(226, 232, 240)',
          paddingLeft: 56,
        }}
        buttonStyle={{
          backgroundColor: 'transparent',
          width: 50,
          display: 'flex',
          justifyContent: 'center',
        }}
        dropdownStyle={{ left: 0, top: '-125px' }}
      />
    </FormControl>
  );
};

export default memo(PhoneNumberInput);
