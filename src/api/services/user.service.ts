import { ChangePasswordValidation, UserProfileFormValidation } from '@/utils/validation/user';
import $apiClient from '../axiosClient';

export class UserService {
  static getPreSignedUrl(imageKey: string): Promise<{ url: string }> {
    return $apiClient.post('users/get-presigned-url', { imageKey });
  }
  static updateUserProfile(input: UserProfileFormValidation): Promise<number> {
    return $apiClient.post('users/update-profile', input);
  }
  static changeUserPassword(input: ChangePasswordValidation): Promise<number> {
    return $apiClient.post('users/update-password', input);
  }
  static confirmUserEmail(code: string): Promise<boolean> {
    return $apiClient.post('users/confirm-user-email', { code });
  }
  static deleteStudentById(id: string) {
    return $apiClient.delete(`/users/${id}`);
  }
  static confirmUserVerificationById(id: number) {
    return $apiClient.post(`/users/${id}`);
  }
}
