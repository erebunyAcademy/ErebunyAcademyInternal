"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import {
  ChakraProvider,
  extendTheme,
  LightMode,
  ThemeConfig,
} from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { colors, components, space } from "@/utils/constants/chakra";
import { ReactNode } from "react";
import { Header } from "@/components/organisms";

const theme: ThemeConfig = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors,
  components,
  space,
});

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <CacheProvider>
        <ChakraProvider
          theme={theme}
          toastOptions={{
            defaultOptions: { position: "bottom-right", isClosable: true },
          }}
        >
          <LightMode>{children}</LightMode>
        </ChakraProvider>
      </CacheProvider>
    </SessionProvider>
  );
};

export default Providers;
