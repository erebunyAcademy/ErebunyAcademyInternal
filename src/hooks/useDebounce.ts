import {
  useEffect,
  useState,
} from '../../public/node_modules/.pnpm/@types+react@18.3.1/node_modules/@types/react';

const useDebounce = (text: string, delay: number = 300) => {
  const [debounceText, setDebounceText] = useState<string>(text);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceText(text);
    }, delay);

    return () => clearTimeout(handler);
  }, [delay, text]);

  return debounceText;
};

export default useDebounce;
