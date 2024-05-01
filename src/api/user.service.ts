import { TeacherSignUpValidation } from '@/utils/validation';
import { ChangePasswordValidation, UserProfileFormValidation } from '@/utils/validation/user';
import $apiClient from './axiosClient';

export class UserService {
  static teacherSignUp(data: TeacherSignUpValidation) {
    return $apiClient.post('/user/teacher-signup', data);
  }
  static studentSignUp(data: any) {
    return $apiClient.post('/user/student-signup', data);
  }
  static getPreSignedUrl(imageKey: string): Promise<{ url: string }> {
    return $apiClient.post('user/get-presigned-url', { imageKey });
  }
  static updateUserProfile(input: UserProfileFormValidation): Promise<number> {
    return $apiClient.post('user/update-profile', input);
  }
  static changeUserPassword(input: ChangePasswordValidation): Promise<number> {
    return $apiClient.post('user/update-password', input);
  }
  static confirmUserEmail(code: string): Promise<boolean> {
    return $apiClient.post('user/confirm-user-email', { code });
  }
}
