'use client';
import { ReactNode } from 'react';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, extendTheme, LightMode, ThemeConfig, useToast } from '@chakra-ui/react';
import {
  QueryCache,
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Loading } from '@/components/atoms';
import { colors, components, space } from '@/utils/constants/chakra';

const theme: ThemeConfig = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors,
  components,
  space,
});

const Providers = ({ children }: { children: ReactNode }) => {
  const toast = useToast();
  const t = useTranslations();
  const gqlGlobalOptions: QueryClientConfig = {
    queryCache: new QueryCache({}),
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError: err => {
          toast({ title: t(err.message), status: 'error', position: 'bottom-right' });
        },
      },
    },
  };
  return (
    <SessionProvider>
      <CacheProvider>
        <ChakraProvider
          theme={theme}
          toastOptions={{ defaultOptions: { position: 'bottom-right', isClosable: true } }}>
          <LightMode>
            <QueryClientProvider client={new QueryClient(gqlGlobalOptions)}>
              <Loading />
              {children}
            </QueryClientProvider>
          </LightMode>
        </ChakraProvider>
      </CacheProvider>
    </SessionProvider>
  );
};

export default Providers;
