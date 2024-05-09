import { RefObject, useEffect } from 'react';

export const useOutsideClickHandler = <T>(
  ref: RefObject<T>,
  onOutsideClick: CallableFunction,
  whitelist?: Array<string>,
) => {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        ref.current &&
        !(ref.current as any).contains(event.target) &&
        !whitelist?.includes(event.target?.id)
      ) {
        onOutsideClick();
      }
    }

    window?.addEventListener('mousedown', handleClickOutside);
    return () => {
      window?.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onOutsideClick, ref, whitelist]);
};
