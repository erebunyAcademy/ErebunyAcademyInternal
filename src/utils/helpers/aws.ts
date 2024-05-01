export const generateAWSUrl = (key: string) =>
  key ? `${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/${key}` : '';

export const s3KeyGenerator = key => {};
