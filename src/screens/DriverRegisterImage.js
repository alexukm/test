import React, {useState} from 'react';
import {SafeAreaView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {Center, Box, VStack, Button, FormControl, NativeBaseProvider, Icon, Text, Platform} from 'native-base';
import {driverUpload} from "./src/com/ studentlifestyle/ common/http/BizHttpUtil";
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {DriverImageType} from "./src/com/ studentlifestyle/ common/appUser/UserConstant";


const ImageUploadPage = () => {
    const [selfiePath, setSelfiePath] = useState('');
    const [carInsurancePath, setCarInsurancePath] = useState('');
    const [licensePath, setLicensePath] = useState('');
    const [idCardFrontPath, setIdCardFrontPath] = useState('');
    const [idCardBackPath, setIdCardBackPath] = useState('');
    const [passportPath, setPassportPath] = useState('');
    const [documentType, setDocumentType] = useState('ID');

    const uploadImage = async (setImage,uploadType) => {
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

        // Use the first item from the assets array
        // setImage(pickerResult.assets[0].uri);
        const file = pickerResult.assets[0];
        fetch(file.uri)
            .then(response => response.blob())
            .then(blob => {
                driverUpload(blob, {
                    uploadType: uploadType,
                    userPhone: '601394569874',
                })
                    .then(data => {
                        if (data.code === 200) {
                            console.log("上传成功: "+uploadType );
                            console.log(data);
                        } else {
                            console.log("上传失败" + data.message);
                        }
                    }).catch(error => {
                    console.log("上传失败" + error);
                }).catch(err => {
                    console.log(err)
                });
            })
        /*   let file = {
               uri: pickerResult.assets[0].uri,
               name: 'image.jpg',
               type: 'image/jpg'
           };*/
        // console.log(file)

    }


    const handleTabChange = (value) => {
        setDocumentType(value);
    };

    return (
        <NativeBaseProvider>
            <SafeAreaView style={{flex: 1}}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Center flex={1}>
                        <Box flex={1} p={4} width="100%">
                            <VStack space={4} width="100%">
                                <Box
                                    bg='white'
                                    p={4}
                                    shadow={1}
                                    rounded="lg"
                                    marginTop={5}
                                >
                                    <Text bold>Mention</Text>
                                    <Text pt={4}>
                                        This interface only collects information for verification purposes and will not
                                        disclose any personal details. Once all the document images have been uploaded,
                                        you will be automatically redirected to the next page.
                                    </Text>
                                </Box>
                                <FormControl>
                                    <FormControl.Label>Upload Selfie</FormControl.Label>
                                    <Button
                                        leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm"/>}
                                        onPress={() => uploadImage(setSelfiePath,DriverImageType.Selfie)}
                                    >
                                        Upload
                                    </Button>
                                </FormControl>
                                <FormControl>
                                    <FormControl.Label>Upload Car Insurance</FormControl.Label>
                                    <Button
                                        leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm"/>}
                                        onPress={() => uploadImage(setCarInsurancePath,DriverImageType.Vehicle_Insurance)}
                                    >
                                        Upload
                                    </Button>
                                </FormControl>
                                <FormControl>
                                    <FormControl.Label>Upload License</FormControl.Label>
                                    <Button
                                        leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm"/>}
                                        onPress={() => uploadImage(setLicensePath,DriverImageType.License)}
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
                                                leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm"/>}
                                                onPress={() => uploadImage(setIdCardFrontPath,DriverImageType.NRIC_FRONT)}
                                            >
                                                Upload
                                            </Button>
                                        </FormControl>
                                        <FormControl>
                                            <FormControl.Label>Upload ID Card Back</FormControl.Label>
                                            <Button
                                                leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm"/>}
                                                onPress={() => uploadImage(setIdCardBackPath,DriverImageType.NRIC_BACK)}
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
                                            leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm"/>}
                                            onPress={() => uploadImage(setPassportPath,DriverImageType.Passport)}
                                        >
                                            Upload
                                        </Button>
                                    </FormControl>
                                )}
                            </VStack>
                        </Box>
                    </Center>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </NativeBaseProvider>
    );
};

export default ImageUploadPage;