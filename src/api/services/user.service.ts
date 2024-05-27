import { RejectUserType } from '@/utils/input/user';
import { ChangePasswordValidation, UserProfileFormValidation } from '@/utils/validation/user';
import $apiClient from '../axiosClient';

export class UserService {
  static getPreSignedUrl(imageKey: string): Promise<{ url: string }> {
    return $apiClient.post('users/get-presigned-url', { imageKey });
  }
  static updateUserProfile(input: UserProfileFormValidation): Promise<number> {
    return $apiClient.put('users/update-profile', input);
  }
  static changeUserPassword(input: ChangePasswordValidation): Promise<number> {
    return $apiClient.patch('users/update-password', input);
  }
  static confirmUserEmail(code: string): Promise<boolean> {
    return $apiClient.post('users/confirm-user-email', { code });
  }
  static rejectUserEmail(input: RejectUserType): Promise<boolean> {
    return $apiClient.post(`users/reject-user/${input.userId}`, { message: input.message });
  }
  static deleteStudentById(id: string) {
    return $apiClient.delete(`/users/${id}`);
  }
  static confirmUserVerificationById(id: string) {
    return $apiClient.post(`/users/${id}`);
  }
}
