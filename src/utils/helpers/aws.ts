import { User } from 'next-auth';

export const generateUserAvatar = (user: User) => {
  const key = user?.attachment.find(({ type }) => type === 'AVATAR')?.key;
  return key ? `/api/readfile?path=uploads/${key}` : '';
};
