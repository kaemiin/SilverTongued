import React from "react";
import { Box, Heading, VStack, Button } from "native-base";

const SettingsScreen = ({ navigation }) => {
  return (
    <Box flex={1} p={5} safeArea>
      <VStack space={4} alignItems="center">
        <Heading>Settings</Heading>
        <Button onPress={() => navigation.goBack()}>Go Back</Button>
      </VStack>
    </Box>
  );
};

export default SettingsScreen;
