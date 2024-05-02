import { useEffect, useState } from "react";

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
