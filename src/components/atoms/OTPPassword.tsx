import { FC, memo } from 'react';
import { HStack, PinInput, PinInputField, theme } from '@chakra-ui/react';

interface Props {
  onChange: () => void;
  value: string;
}

const OTPPassword: FC<Props> = ({ onChange, value }) => {
  return (
    <HStack>
      <PinInput
        otp
        mask={false}
        placeholder=""
        value={value}
        onChange={onChange}
        focusBorderColor={theme.colors.blue[500]}>
        <PinInputField />
        <PinInputField />
        <PinInputField />
        <PinInputField />
      </PinInput>
    </HStack>
  );
};

export default memo(OTPPassword);
