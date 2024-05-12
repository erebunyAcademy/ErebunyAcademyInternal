import { User } from 'next-auth';

export const generateAWSUrl = (key: string) =>
  key ? `${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/${key}` : '';

export const generateUserAvatar = (user: User) => {
  const key = user?.attachment.find(({ type }) => type === 'AVATAR')?.key;
  return key ? generateAWSUrl(key) : '';
};
