'use client';
import { useCallback } from 'react';
import { Button, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Locale } from '@/i18n';

const languages = [
  { text: 'Armenian (AM)', lang: 'am' },
  { text: 'English (EN)', lang: 'en' },
  { text: 'Russian (RU)', lang: 'ru' },
];

const ExamPage = ({ params }: { params: { lang: Locale } }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const onLangChange = useCallback(
    (val: string) => {
      if (!pathname) return '/';
      const segments = pathname.split('/');
      segments[1] = val;
      router.push(`${segments.join('/')}?${new URLSearchParams(searchParams?.toString())}`);
    },
    [pathname, router, searchParams],
  );

  const onStart = useCallback(() => {
    router.push('');
  }, [router]);

  return (
    <RadioGroup onChange={onLangChange} value={params.lang || 'am'}>
      <Stack direction="column">
        {languages.map(({ text, lang }) => (
          <Radio key={lang} value={lang}>
            {text}
          </Radio>
        ))}
        <Button onClick={onStart}>Start</Button>
      </Stack>
    </RadioGroup>
  );
};
export default ExamPage;
