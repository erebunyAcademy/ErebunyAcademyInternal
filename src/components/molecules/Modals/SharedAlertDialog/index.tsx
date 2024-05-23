import { FC, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

interface SharedAlertDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  title: string | React.ReactNode;
  onClose: () => void;
  deleteFn: () => void;
  body: string;
}

const SharedAlertDialog: FC<SharedAlertDialogProps> = ({
  isOpen,
  isLoading,
  title,
  onClose,
  deleteFn,
  body,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations();
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      closeOnOverlayClick
      closeOnEsc
      isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent p="20px 10px">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>{body}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} isDisabled={isLoading}>
              {t('cancel')}
            </Button>
            <Button colorScheme="red" onClick={deleteFn} ml={3} isLoading={isLoading}>
              {t('delete')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default SharedAlertDialog;
