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
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      closeOnOverlayClick
      closeOnEsc>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>{body}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} isDisabled={isLoading}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={deleteFn} ml={3} isLoading={isLoading}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default SharedAlertDialog;
