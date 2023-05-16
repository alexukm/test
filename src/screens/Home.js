import React from "react";
import { VStack, Box, Center, Button, Text } from "native-base";
import { useNavigation } from "@react-navigation/native";

function Home() {
    const navigation = useNavigation();

    return (
        <VStack flex={1} space={4} alignItems="center">
            <Box flex={0.6} w="full" bg="blue.500" mt="5%" roundedBottom="md" shadow={3}></Box>
            <VStack flex={0.2} w="full" space={1} alignItems="center">
                <Text fontWeight="bold">Welcome to my App</Text>
                <Text textAlign="center">
                    This is a very good app that you can share your ride with other person, and for drivers, they can earn a lot of money.
                </Text>
            </VStack>
            <VStack flex={0.2} w="full" justifyContent="flex-end" pb="15%" alignItems="center">
                <Box flexDirection="row" justifyContent="space-between" width="100%">
                    <Button size="lg" colorScheme="primary" flexGrow={1} marginRight={2} onPress={() => navigation.navigate("User")}>
                        User
                    </Button>
                    <Button size="lg" colorScheme="secondary" flexGrow={1} marginLeft={2} onPress={() => navigation.navigate("Driver")}>
                        Driver
                    </Button>
                </Box>
            </VStack>
        </VStack>
    );
}

export default Home;
