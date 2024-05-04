import $apiClient from '../axiosClient';

export class FacultyService {
  static facultyList() {
    return $apiClient.get('/faculties/list');
  }
}
