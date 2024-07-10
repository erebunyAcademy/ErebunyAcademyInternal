import { User } from 'next-auth';
import path from 'path';

console.log(
  path.join(process.cwd()),
  '=======+++++++++++++++++=',
  path.join(process.cwd(), 'uploads'),
);

export const generateAWSUrl = (key: string) => {
  console.log(path.join(process.cwd()), '---------');
  console.log(path.join(process.cwd(), 'uploads', key), { key }, '****************');
  // return key ? path.join(process.cwd()) + path.join(process.cwd(), 'uploads', key) : '';
  return `/public/uploads/students/0755d7c7-d683-49dc-9d0a-bb6d26db143f/attachments/1720619441877_pexels-nout-gons-80280-378570.jpg`;
};

export const generateUserAvatar = (user: User) => {
  const key = user?.attachment.find(({ type }) => type === 'AVATAR')?.key;
  return key ? generateAWSUrl(key) : '';
};
