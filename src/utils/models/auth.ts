export interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export type ForgotPasswordStep = "emailStep" | "OTPStep" | "passwordStep";
