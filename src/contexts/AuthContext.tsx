'use client';
import React, { createContext, FC, useContext, useState } from 'react';
import { ForgotPasswordStep } from '@/utils/models/auth';

interface AuthState {
  step: ForgotPasswordStep;
  setStep: React.Dispatch<React.SetStateAction<ForgotPasswordStep>>;
  confirmationCode?: number;
  setConfirmationCode: React.Dispatch<React.SetStateAction<number | undefined>>;
}

interface Props {
  children?: React.ReactNode;
}

const AuthContext = createContext<AuthState>({} as AuthState);

export const AuthProvider: FC<Props> = ({ children }) => {
  const [step, setStep] = useState<ForgotPasswordStep>('emailStep');
  const [confirmationCode, setConfirmationCode] = useState<number>();

  return (
    <AuthContext.Provider
      value={{
        step,
        confirmationCode,
        setConfirmationCode,
        setStep,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
