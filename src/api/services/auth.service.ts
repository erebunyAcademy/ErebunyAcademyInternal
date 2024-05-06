import {
  ForgotPasswordStep1Validation,
  ForgotPasswordStep2Validation,
  ForgotPasswordStep3Validation,
  ResendEmailValidation,
  StudentSignUpValidation,
  TeacherSignUpValidation,
} from '@/utils/validation';
import $apiClient from '../axiosClient';

export class AuthService {
  static teacherSignUp(data: TeacherSignUpValidation) {
    return $apiClient.post('/custom-auth/teacher-signup', data);
  }
  static studentSignUp(data: StudentSignUpValidation) {
    return $apiClient.post('/custom-auth/student-signup', data);
  }
  // forgot password
  static forgotPasswordStep1(data: ForgotPasswordStep1Validation) {
    return $apiClient.post('/custom-auth/forgot-password-first-step', data);
  }
  static forgotPasswordStep2(data: ForgotPasswordStep2Validation) {
    return $apiClient.post('/custom-auth/forgot-password-second-step', data);
  }

  static forgotPasswordStep3(data: ForgotPasswordStep3Validation) {
    return $apiClient.post('/custom-auth/forgot-password-third-step', data);
  }

  static resendEmail(data: ResendEmailValidation) {
    return $apiClient.post('/custom-auth/resend-email', data);
  }
}
