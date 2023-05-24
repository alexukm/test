import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert, ScrollView } from 'react-native';
import { Center, Box, VStack, Button, FormControl, NativeBaseProvider, Icon, Text } from 'native-base';
// import {driverUpload} from "./src/com/ studentlifestyle/ common/http/BizHttpUtil";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
// import {DriverImageType} from "./src/com/ studentlifestyle/ common/appUser/UserConstant";
import { driverUpload } from "../com/ studentlifestyle/ common/http/BizHttpUtil";
import { DriverImageType } from "../com/ studentlifestyle/ common/appUser/UserConstant";
import { getUserToken } from "../com/ studentlifestyle/ common/appUser/UserConstant";

const ImageUploadPage = () => {
    const [uploadedSelfie, setUploadedSelfie] = useState(false);
    const [uploadedCarInsurance, setUploadedCarInsurance] = useState(false);
    const [uploadedLicense, setUploadedLicense] = useState(false);
    const [uploadedIdCardFront, setUploadedIdCardFront] = useState(false);
    const [uploadedIdCardBack, setUploadedIdCardBack] = useState(false);
    const [uploadedPassport, setUploadedPassport] = useState(false);
    const [documentType, setDocumentType] = useState('ID');

    useEffect(() => {
        if (
            uploadedSelfie &&
            uploadedCarInsurance &&
            uploadedLicense &&
            (documentType === 'ID' ? (uploadedIdCardFront && uploadedIdCardBack) : uploadedPassport)
        ) {
            Alert.alert('Success', 'All documents uploaded successfully!');
            // 这里可以进行页面跳转或其他操作
        }
    }, [uploadedSelfie, uploadedCarInsurance, uploadedLicense, uploadedIdCardFront, uploadedIdCardBack, uploadedPassport, documentType]);

    const uploadImage = async (setUploadStatus, uploadType) => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (pickerResult.canceled === true) {
            return;
        }

        const file = pickerResult.assets[0];
        fetch(file.uri)
            .then(response => response.blob())
            .then(blob => {
                driverUpload(blob, {
                    uploadType: uploadType,
                    userPhone: '601394569874',
                    data: getUserToken(),
                })
                    .then(data => {
                        if (data.code === 200) {
                            console.log("上传成功: " + uploadType);
                            console.log(data);
                            setUploadStatus(true);
                        } else {
                            console.log("上传失败" + data.message);
                            setUploadStatus(false);
                        }
                    }).catch(error => {
                    console.log("上传失败" + error);
                    setUploadStatus(false);
                });
            })
            .catch(err => {
                console.log(err)
            });
    }

    const handleTabChange = (value) => {
        setDocumentType(value);
    };

    return (
        <NativeBaseProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <Center flex={1}>
                            <Box flex={1} p={4} width="100%">
                                <VStack space={4} width="100%">
                                    <Box bg='white' p={4} shadow={1} rounded="lg" marginTop={5}>
                                        <Text bold>Mention</Text>
                                        <Text pt={4}>
                                            This interface only collects information for verification purposes and will not disclose any personal details. Once all the document images have been uploaded, you will be automatically redirected to the next page.
                                        </Text>
                                    </Box>

                                    {[
                                        {
                                            label: "Selfie",
                                            desc: "Please upload your selfie...",
                                            handler: () => uploadImage(setUploadedSelfie, DriverImageType.Selfie),
                                            uploadStatus: uploadedSelfie,
                                        },
                                        {
                                            label: "Car Insurance",
                                            desc: "Please upload your Car Insurance...",
                                            handler: () => uploadImage(setUploadedCarInsurance, DriverImageType.Vehicle_Insurance),
                                            uploadStatus: uploadedCarInsurance,
                                        },
                                        {
                                            label: "License",
                                            desc: "Please upload your License...",
                                            handler: () => uploadImage(setUploadedLicense, DriverImageType.License),
                                            uploadStatus: uploadedLicense,
                                        },
                                    ].map(form => (
                                        <Box key={form.label} bg="white" p={4} shadow={1} rounded="lg" marginTop={5} flexDirection="row" justifyContent="space-between">
                                            <VStack alignItems="flex-start">
                                                <Text bold>{form.label}</Text>
                                                <Text>{form.desc}</Text>
                                            </VStack>
                                            <Button
                                                p={0}
                                                w={10}
                                                h={10}
                                                rounded="full"
                                                bg={form.uploadStatus ? 'green.500' : 'blue.500'}
                                                onPress={form.handler}
                                            >
                                                <Icon as={Ionicons} name={form.uploadStatus ? 'checkmark' : 'add'} color="white" />
                                            </Button>
                                        </Box>
                                    ))}

                                    <FormControl width="100%">
                                        <FormControl.Label>ID/PASSPORT</FormControl.Label>
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
                                    {documentType === 'ID' ?
                                        [
                                            {
                                                label: "ID Card Front",
                                                desc: "Please upload your ID Card Front...",
                                                handler: () => uploadImage(setUploadedIdCardFront, DriverImageType.NRIC_FRONT),
                                                uploadStatus: uploadedIdCardFront,
                                            },
                                            {
                                                label: "ID Card Back",
                                                desc: "Please upload your ID Card Back...",
                                                handler: () => uploadImage(setUploadedIdCardBack, DriverImageType.NRIC_BACK),
                                                uploadStatus: uploadedIdCardBack,
                                            }
                                        ].map(form => (
                                            <Box key={form.label} bg="white" p={4} shadow={1} rounded="lg" marginTop={5} flexDirection="row" justifyContent="space-between">
                                                <VStack alignItems="flex-start">
                                                    <Text bold>{form.label}</Text>
                                                    <Text>{form.desc}</Text>
                                                </VStack>
                                                <Button
                                                    p={0}
                                                    w={10}
                                                    h={10}
                                                    rounded="full"
                                                    bg={form.uploadStatus ? 'green.500' : 'blue.500'}
                                                    onPress={form.handler}
                                                >
                                                    <Icon as={Ionicons} name={form.uploadStatus ? 'checkmark' : 'add'} color="white" />
                                                </Button>
                                            </Box>
                                        )) :
                                        [
                                            {
                                                label: "Passport",
                                                desc: "Please upload your Passport...",
                                                handler: () => uploadImage(setUploadedPassport, DriverImageType.Passport),
                                                uploadStatus: uploadedPassport,
                                            }
                                        ].map(form => (
                                            <Box key={form.label} bg="white" p={4} shadow={1} rounded="lg" marginTop={5} flexDirection="row" justifyContent="space-between">
                                                <VStack alignItems="flex-start">
                                                    <Text bold>{form.label}</Text>
                                                    <Text>{form.desc}</Text>
                                                </VStack>
                                                <Button
                                                    p={0}
                                                    w={10}
                                                    h={10}
                                                    rounded="full"
                                                    bg={form.uploadStatus ? 'green.500' : 'blue.500'}
                                                    onPress={form.handler}
                                                >
                                                    <Icon as={Ionicons} name={form.uploadStatus ? 'checkmark' : 'add'} color="white" />
                                                </Button>
                                            </Box>
                                        ))
                                    }
                                </VStack>
                            </Box>
                        </Center>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </SafeAreaView>
        </NativeBaseProvider>
    );
};

export default ImageUploadPage;