export const generateAWSUrl = (key: string) =>
  key ? `${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/${key}` : '';
