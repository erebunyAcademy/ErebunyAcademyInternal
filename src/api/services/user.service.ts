import { UsersListModel } from '@/utils/models/user';
import { ChangePasswordValidation, UserProfileFormValidation } from '@/utils/validation/user';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class UserService {
  static getAllUsers(params: QueryParams) {
    return $apiClient.get<UsersListModel>('/users/list', { params });
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
