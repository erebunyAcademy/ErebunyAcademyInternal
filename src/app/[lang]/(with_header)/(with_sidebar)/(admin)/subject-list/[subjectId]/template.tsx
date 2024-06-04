'use client';
import { useMemo } from 'react';
import { Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { LanguageTypeEnum } from '@prisma/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function CreateTestQuestionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();
  const t = useTranslations();

  const languages = useMemo(
    () => [
      { text: t('english'), lang: LanguageTypeEnum.EN },
      { text: t('russian'), lang: LanguageTypeEnum.RU },
      { text: t('armenian'), lang: LanguageTypeEnum.AM },
    ],
    [t],
  );

  return (
    <Tabs
      variant="unstyled"
      mt="30px"
      index={languages.findIndex(l => l.lang === searchParams?.get('language'))}>
      <TabList gap="20px">
        {languages.map(({ lang, text }) => (
          <Tab
            key={lang}
            _focusVisible={{ boxShadow: 'unset' }}
            fontSize="22px"
            as={Link}
            href={`?language=${lang}`}>
            {text}
          </Tab>
        ))}
      </TabList>
      <TabIndicator mt="-1.5px" height="2px" bg="#319795" borderRadius="1px" />
      <TabPanels>
        {languages.map(item => (
          <TabPanel key={item.lang}>{children}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
