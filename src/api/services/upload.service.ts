import axios from 'axios';

export class UploadService {
  static uploadFile({ file, key }: { file: FormData; key: string }) {
    return axios.post(`http://localhost:3000/api/file`, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-file-key': key,
      },
    });
  }
}
