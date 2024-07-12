import axios from 'axios';

export class UploadService {
  static uploadFile({ file, key }: { file: FormData; key: string }) {
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/file`, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-file-key': key,
      },
    });
  }
}
