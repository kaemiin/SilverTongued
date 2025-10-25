import React from 'react';
import {
  Box,
  Text,
  HStack,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Tag,
} from '@chakra-ui/react';
import { CopyIcon, DeleteIcon } from '@chakra-ui/icons';
import useSentenceStore from '../store/sentenceStore';
import { Clipboard } from 'react-native';

const SentenceListItem = ({ sentence, onDelete, onCopy }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  const handleDelete = () => {
    onDelete(sentence.id);
    onClose();
  };

  const handleCopy = () => {
    Clipboard.setString(sentence.content);
    onCopy(sentence.id);
  };

  return (
    <Box p={4} shadow="md" borderWidth="1px">
      <Text>{sentence.content}</Text>
      <HStack mt={2}>
        {sentence.tags.map((tag, index) => (
          <Tag key={index} size="sm">{tag}</Tag>
        ))}
      </HStack>
      <HStack mt={2} justify="space-between">
        <Text fontSize="sm">Usage (30 days): {sentence.usageCount}</Text>
        <HStack>
          <IconButton icon={<CopyIcon />} aria-label="Copy sentence" onClick={handleCopy} />
          <IconButton icon={<DeleteIcon />} aria-label="Delete sentence" onClick={() => setIsOpen(true)} />
        </HStack>
      </HStack>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Sentence
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

const SentenceList = ({ sentences }) => {
  const deleteSentence = useSentenceStore((state) => state.deleteSentence);
  const incrementUsage = useSentenceStore((state) => state.incrementUsage);
  const toast = useToast();

  const handleDelete = (id) => {
    deleteSentence(id);
    toast({
      title: 'Sentence deleted.',
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleCopy = (id) => {
    incrementUsage(id);
    toast({
      title: 'Copied! Usage +1',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={4} align="stretch">
      {sentences.map((sentence) => (
        <SentenceListItem key={sentence.id} sentence={sentence} onDelete={handleDelete} onCopy={handleCopy} />
      ))}
    </VStack>
  );
};

export default SentenceList;
