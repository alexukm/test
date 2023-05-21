import React, { useState } from 'react';
import { SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Center, Box, VStack, Button, FormControl, NativeBaseProvider, Icon, Text } from 'native-base';

import { Ionicons } from '@expo/vector-icons';

const ImageUploadPage = () => {
    const [selfiePath, setSelfiePath] = useState('');
    const [carInsurancePath, setCarInsurancePath] = useState('');
    const [licensePath, setLicensePath] = useState('');
    const [idCardFrontPath, setIdCardFrontPath] = useState('');
    const [idCardBackPath, setIdCardBackPath] = useState('');
    const [passportPath, setPassportPath] = useState('');
    const [documentType, setDocumentType] = useState('ID');

    const uploadImage = (setImage) => {
        // Here should be your logic to upload image.
        // After uploading, you should call setImage function to update the state.
    };

    const handleTabChange = (value) => {
        setDocumentType(value);
    };

    return (
        <NativeBaseProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Center flex={1}>
                        <Box flex={1} p={4} width="100%">
                            <VStack space={4} width="100%">
                                <FormControl>
                                    <FormControl.Label>Upload Selfie</FormControl.Label>
                                    <Button
                                        leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}
                                        onPress={() => uploadImage(setSelfiePath)}
                                    >
                                        Upload
                                    </Button>
                                </FormControl>
                                <FormControl>
                                    <FormControl.Label>Upload Car Insurance</FormControl.Label>
                                    <Button
                                        leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}
                                        onPress={() => uploadImage(setCarInsurancePath)}
                                    >
                                        Upload
                                    </Button>
                                </FormControl>
                                <FormControl>
                                    <FormControl.Label>Upload License</FormControl.Label>
                                    <Button
                                        leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}
                                        onPress={() => uploadImage(setLicensePath)}
                                    >
                                        Upload
                                    </Button>
                                </FormControl>
                                <FormControl width="100%">
                                    <FormControl.Label>Document Type</FormControl.Label>
                                    <VStack space={2}>
                                        <Button.Group variant="solid" isAttached space={2} borderColor="gray.200">
                                            <Button
                                                onPress={() => handleTabChange('ID')}
                                                colorScheme={documentType === 'ID' ? 'blue' : 'gray'}
                                                flex={1}
                                            >
                                                ID
                                            </Button>
                                            <Button
                                                onPress={() => handleTabChange('Passport')}
                                                colorScheme={documentType === 'Passport' ? 'blue' : 'gray'}
                                                flex={1}
                                            >
                                                Passport
                                            </Button>
                                        </Button.Group>
                                    </VStack>
                                </FormControl>

                                {documentType === 'ID' && (
                                    <>
                                        <FormControl>
                                            <FormControl.Label>Upload ID Card Front</FormControl.Label>
                                            <Button
                                                leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}
                                                onPress={() => uploadImage(setIdCardFrontPath)}
                                            >
                                                Upload
                                            </Button>
                                        </FormControl>
                                        <FormControl>
                                            <FormControl.Label>Upload ID Card Back</FormControl.Label>
                                            <Button
                                                leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}
                                                onPress={() => uploadImage(setIdCardBackPath)}
                                            >
                                                Upload
                                            </Button>
                                        </FormControl>
                                    </>
                                )}
                                {documentType === 'Passport' && (
                                    <FormControl>
                                        <FormControl.Label>Upload Passport</FormControl.Label>
                                        <Button
                                            leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}
                                            onPress={() => uploadImage(setPassportPath)}
                                        >
                                            Upload
                                        </Button>
                                    </FormControl>
                                )}
                                <Box
                                    bg='white'
                                    p={4}
                                    shadow={1}
                                    rounded="lg"
                                    marginTop={5}
                                >
                                    <Text bold>Mention</Text>
                                    <Text pt={4}>
                                        This interface only collects information for verification purposes and will not disclose any personal details. Once all the document images have been uploaded, you will be automatically redirected to the next page.
                                    </Text>
                                </Box>
                            </VStack>
                        </Box>
                    </Center>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </NativeBaseProvider>
    );
};

export default ImageUploadPage;
