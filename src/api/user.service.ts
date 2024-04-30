import { TeacherSignUpValidation } from '@/utils/validation';
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
}
