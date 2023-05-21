// // //先获取位置权限，屏幕上方有一个固定的input输入位置，用户可以自己手动输入位置，
// // //然后调用谷歌maps来查看位置并确定位置，也可以直接使用当前位置（把获取的位置信息直接选择到输入框）起点位置输入完毕，
// // //此时另外一个输入框显示出来，这里可以输入终点地址。起点和终点位置输入之后地图会有一个动画：有一条路线规划从起点移动到终点
// //
// // // 我现在需要一个以react base为框架的页面，主要需求是：
// // // 1.  画面分成三个部分，第一部分在顶部占据屏幕的60长度，设置一个背景颜色填充，不能完全在顶部，要留出5%的位置给顶部，不能完全贴着顶部。
// // // 2. 中间设置两段话，占屏幕的20%长度，还要分为上下行：
// // //     a. 上行字体加重，写上Weclome to my App
// // //     b. 下行写上， This is the very good app that you can sharing your ride with other person, and for driver thay can earn a lot money
// // // 3. 底部屏幕的20%长度，同时设置两个按钮，并借用 react base框架中的：<Button size="sm">PRIMARY</Button>来设计，左边一个右边一个，颜色要有差别。左边的按钮上写 User，右边的按钮写Driver；同时上个按钮要在一行中间相距部分距离，左右两边也要相聚部分距离，同时要距离底部大改15%的距离。
// //
//
//
// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { VStack, Box, NativeBaseProvider } from "native-base";
//
// import User from "./src/screens/UserLogin";
// import Driver from "./src/screens/DriverLogin";
// import Home from "./src/screens/Home";
// import UserSignUp from "./src/screens/UserRegisterForm";
// import DriverSignUp from "./src/screens/DriverRegisterForm";
//
// const Stack = createStackNavigator();
//
// export default function App() {
//   return (
//     <NativeBaseProvider>
//       <Box flex={1} px={0} py={0}>
//         <NavigationContainer>
//           <Stack.Navigator
//             initialRouteName="Example"
//             screenOptions={{
//               headerStyle: { backgroundColor: '#FFF' },
//               cardStyle: { backgroundColor: 'transparent' }
//             }}
//           >
//             <Stack.Screen name="Home" component={Home} />
//             <Stack.Screen name="User" component={User} />
//             <Stack.Screen name="Driver" component={Driver} />
//             <Stack.Screen name="UserSignUp" component={UserSignUp} />
//             <Stack.Screen name="DriverSignUp" component={DriverSignUp} />
//           </Stack.Navigator>
//         </NavigationContainer>
//       </Box>
//     </NativeBaseProvider>
//   );
// }
//

import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Center, Box, VStack, Button, FormControl, NativeBaseProvider, Icon, Text } from 'native-base';
import {driverUpload} from "./src/com/ studentlifestyle/ common/http/BizHttpUtil";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {DriverImageType} from "./src/com/ studentlifestyle/ common/appUser/UserConstant";

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
            </SafeAreaView>
        </NativeBaseProvider>
    );
};

export default ImageUploadPage;