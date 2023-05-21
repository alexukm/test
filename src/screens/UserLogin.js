// import {Keyboard, TouchableWithoutFeedback} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import React, {useState, useEffect} from "react";
// import {userLogin, smsSend} from "./BizHttpUtil";
// import {useNavigation} from "@react-navigation/native";
// import {
//     FormControl,
//     Select,
//     CheckIcon,
//     Center,
//     Modal,
//     WarningOutlineIcon,
//     Box,
//     VStack,
//     Button,
//     NativeBaseProvider,
//     Input,
//     Text,
//     Flex,
//     HStack,
// } from "native-base";
// import axios from "axios";
//
// //将countryCodes对象移到组件外部。这样，每次组件渲染时，这个对象就不必重新创建，从而提高了性能。
// const countryCodes = {
//     my: "+60",
//     cn: "+86",
// };
//
// function Example() {
//
//     const navigation = useNavigation();
//
//     const [otp, setOtp] = useState("");
//
//     const [selectedValue, setSelectedValue] = useState("my"); // 设置初始值为 +60 Malaysia
//
//     const [showSelect, setShowSelect] = useState(false);
//     const [showModal, setShowModal] = useState(false);
//
//
//     const handleSelect = (value) => {
//         setSelectedValue(value);
//         setShowModal(false); // Close the modal
//     };
//
//     const buttonText = () => {
//         switch (selectedValue) {
//             case 'my':
//                 return '+60';
//             case 'cn':
//                 return '+86';
//             default:
//                 return 'Select Country Code';
//         }
//     };
//     const countryItems = [
//         { label: '+60 Malaysia', value: 'my' },
//         { label: '+86 China', value: 'cn' }
//     ];
//     const submitData = (selectedValue) => {
//
//         if (selectedValue === "cn" && value.length !== 11) {
//             alert("Please enter a valid 11-digit phone number for China");
//             return false;
//         }
//         if (selectedValue === "my" && value.length !== 9) {
//             alert("Please enter a valid 9-digit phone number for Malaysia");
//             return false;
//         }
//
//         if (!value) {
//             alert("Please enter a phone number");
//             return false;
//         }
//
//         if (!selectedValue) {
//             alert("Please choose a country code");
//             return false;
//         }
//
//         const prefix = countryCodes[selectedValue];
//         //手机号 +86  / +60
//         const phoneNumber = {
//             'phoneNumber': prefix ? prefix + value : value,
//         }
//
//         //像后端发送请求,获取验证码
//         smsSend(phoneNumber)
//             .then(data => {
//                 if (data.code === 200) {
//                     setIsTimerActive(true);
//                     setModalVisible(true);
//                     // console.log(data.code)
//                 } else {
//                     alert(data.message);
//                     return false;
//                 }
//             }).catch(error => {
//             console.log(error)
//             alert('There was an error submitting your data. Please try again.');
//             return false;
//         })
//     };
//
//     const loginPress = (userPhone, smsCode) => {
//         if (smsCode.length !== 4 || !/^\d+$/.test(smsCode)) {
//             alert("Please enter a valid 4-digit OTP");
//             return;
//         }
//
//         verifyOtp(userPhone, smsCode)
//             .then(loginSuccess => {
//                 if (loginSuccess) {
//                     setModalVisible(false);
//                     alert("Login successful!");
//                 }
//             });
//     };
//
//     const verifyOtp = (userPhone, code) => {
//
//         const userLoginParam = {
//             'userPhone': userPhone,
//             'code': code,
//             'deviceId': "12345",
//             'platform': 0
//         }
//
//         let loginSuccess = true;
//         userLogin(userLoginParam)
//             .then(data => {
//                 if (data.code === 200) {
//                     AsyncStorage.setItem('userToken', JSON.stringify(data.data))
//                         .then(data => {
//                             console.log(data);
//                         });
//                 }else {
//                     loginSuccess = false;
//                     alert(data.message)
//                 }
//             })
//             .catch(error => {
//                 loginSuccess = false;
//                 console.log(error);
//                 alert("login failed")
//             })
//         return loginSuccess;
//     };
//
//     const [placeholder, setPlaceholder] = useState("");
//
//     const isInvalid = selectedValue === "";
//
//     const [value, setValue] = React.useState("");
//
//     // const handleChange = (text) => setValue(text);
//
//     const [modalVisible, setModalVisible] = React.useState(false);
//     const [secondsRemaining, setSecondsRemaining] = React.useState(30);
//
//     const [timer, setTimer] = useState(30);
//     const [isTimerActive, setIsTimerActive] = useState(false);
//     const [isResendOtpActive, setIsResendOtpActive] = useState(false);
//
//     useEffect(() => {
//         let intervalId;
//         if (isTimerActive && timer > 0) {
//             intervalId = setInterval(() => {
//                 setTimer((prev) => prev - 1);
//                 setSecondsRemaining((prev) => {
//                     if (prev <= 0) {
//                         return 30;
//                     } else {
//                         return prev - 1;
//                     }
//                 });
//             }, 1000);
//         } else if (timer === 0) {
//             setIsResendOtpActive(true);
//             setIsTimerActive(false);
//             setSecondsRemaining(0);
//         }
//         return () => clearInterval(intervalId);
//     }, [timer, isTimerActive]);
//
//
//     return (
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//             <VStack space="2.5" mt="4" px="8">
//                 <FormControl isRequired>
//                     <FormControl.Label>Please enter your phone number</FormControl.Label>
//                     <HStack space={2}>
//                         <Button onPress={() => setShowModal(true)}>
//                             {buttonText()}
//                         </Button>
//                         <Input
//                             placeholder={placeholder}
//                             value={value}
//                             onChangeText={(text) => setValue(text)}
//                             keyboardType="numeric"
//                             size="lg"
//                             width="78%"
//                         />
//                     </HStack>
//                     <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
//                         <Modal.Content>
//                             <Modal.Header>Select Country Code</Modal.Header>
//                             <Modal.Body>
//                                 <Select
//                                     selectedValue={selectedValue}
//                                     onValueChange={handleSelect}
//                                     accessibilityLabel="Choose Your Location"
//                                 >
//                                     <Select.Item label="+60 Malaysia" value="my" />
//                                     <Select.Item label="+86 China" value="cn" />
//                                 </Select>
//                             </Modal.Body>
//                         </Modal.Content>
//                     </Modal>
//                 </FormControl>
//                 <Input
//                     size='lg'
//                     placeholder="Enter OTP"
//                     mt="4"
//                     onChangeText={(text) => setOtp(text)}
//                 />
//                 <Button
//                     mt="4"
//                     onPress={() => {
//                         if (submitData(selectedValue)) {
//                             setIsTimerActive(true);
//                         }
//                     }}
//                 >
//                     Get OTP
//                 </Button>
//                 {isResendOtpActive ? (
//                     <Button
//                         variant="outline"
//                         colorScheme="secondary"
//                         size="sm"
//                         mt="2"
//                         onPress={() => {
//                             setIsTimerActive(true);
//                             setIsResendOtpActive(false);
//                             setTimer(30);
//                             setSecondsRemaining(30);
//                         }}
//                     >
//                         Resend
//                     </Button>
//                 ) : (
//                     <Button
//                         variant="outline"
//                         colorScheme="secondary"
//                         size="sm"
//                         mt="2"
//                         isDisabled={true}
//                     >
//                         <Text>{secondsRemaining} s</Text>
//                     </Button>
//                 )}
//                 <Text mt="4" textAlign="center">
//                     Don't have an account?{" "}
//                     <Text
//                         onPress={() => navigation.navigate("UserSignUp")}
//                         color="blue.500"
//                         _underline={{}}
//                     >
//                         Sign Up here.
//                     </Text>
//                 </Text>
//             </VStack>
//         </TouchableWithoutFeedback>
//     );
// }
//
// export default function App() {
//     return (
//         <NativeBaseProvider>
//             <Center flex={1}>
//                 <Example />
//             </Center>
//         </NativeBaseProvider>
//     );
// }






// import { Keyboard, TouchableWithoutFeedback } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import React, { useState, useEffect } from "react";
// import { userLogin, smsSend } from "./BizHttpUtil";
// import { useNavigation } from "@react-navigation/native";
// import {
//     FormControl,
//     Select,
//     CheckIcon,
//     Center,
//     Modal,
//     WarningOutlineIcon,
//     Box,
//     VStack,
//     Button,
//     NativeBaseProvider,
//     Input,
//     Text,
//     Flex,
//     HStack,
// } from "native-base";
// import axios from "axios";
//
// const countryCodes = {
//     my: "+60",
//     cn: "+86",
// };
//
// function Example() {
//
//     const navigation = useNavigation();
//
//     const [otp, setOtp] = useState("");
//     const [selectedValue, setSelectedValue] = useState("my");
//     const [showModal, setShowModal] = useState(false);
//
//     const handleSelect = (value) => {
//         setSelectedValue(value);
//         setShowModal(false);
//     };
//
//     const buttonText = () => {
//         switch (selectedValue) {
//             case 'my':
//                 return '+60';
//             case 'cn':
//                 return '+86';
//             default:
//                 return 'Select Country Code';
//         }
//     };
//
//     const submitData = () => {
//         if (selectedValue === "cn" && value.length !== 11) {
//             alert("Please enter a valid 11-digit phone number for China");
//             return false;
//         }
//         if (selectedValue === "my" && value.length !== 9) {
//             alert("Please enter a valid 9-digit phone number for Malaysia");
//             return false;
//         }
//
//         if (!value) {
//             alert("Please enter a phone number");
//             return false;
//         }
//
//         if (!selectedValue) {
//             alert("Please choose a country code");
//             return false;
//         }
//
//         const prefix = countryCodes[selectedValue];
//         const phoneNumber = {
//             'phoneNumber': prefix ? prefix + value : value,
//         }
//
//         smsSend(phoneNumber)
//             .then(data => {
//                 if (data.code === 200) {
//                     setIsTimerActive(true);
//                     console.log(data.code)
//                 } else {
//                     alert(data.message);
//                     return false;
//                 }
//             })
//             .catch(error => {
//                 console.log(error);
//                 alert('There was an error submitting your data. Please try again.');
//                 return false;
//             })
//     };
//
//     const [value, setValue] = useState("");
//     const [modalVisible, setModalVisible] = useState(false);
//     const [secondsRemaining, setSecondsRemaining] = useState(30);
//     const [isTimerActive, setIsTimerActive] = useState(false);
//     const [isResendOtpActive, setIsResendOtpActive] = useState(false);
//
//     useEffect(() => {
//         let intervalId;
//         if (isTimerActive && secondsRemaining > 0) {
//             intervalId = setInterval(() => {
//                 setSecondsRemaining((prev) => prev - 1);
//             }, 1000);
//         } else if (secondsRemaining === 0) {
//             setIsResendOtpActive(true);
//             setIsTimerActive(false);
//         }
//         return () => clearInterval(intervalId);
//     }, [isTimerActive, secondsRemaining]);
//
//     const handleResendOtp = () => {
//         setSecondsRemaining(30);
//         setIsResendOtpActive(false);
//         submitData();
//     };
//
//     const renderButton = () => {
//         if (isTimerActive) {
//             return (
//                 <Button
//                     variant="outline"
//                     colorScheme="secondary"
//                     size="sm"
//                     mt="2"
//                     isDisabled={true}
//                 >
//                     <Text>{secondsRemaining} s</Text>
//                 </Button>
//             );
//         } else if (isResendOtpActive) {
//             return (
//                 <Button
//                     variant="outline"
//                     colorScheme="secondary"
//                     size="sm"
//                     mt="2"
//                     onPress={handleResendOtp}
//                 >
//                     Resend
//                 </Button>
//             );
//         } else {
//             return (
//                 <Button
//                     mt="4"
//                     onPress={() => {
//                         submitData();
//                         setIsTimerActive(true);
//                     }}
//                 >
//                     Get OTP
//                 </Button>
//             );
//         }
//     };
//
//     return (
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//             <VStack space="2.5" mt="4" px="8">
//                 <FormControl isRequired>
//                     <FormControl.Label>Please enter your phone number</FormControl.Label>
//                     <HStack space={2}>
//                         <Button onPress={() => setShowModal(true)}>
//                             {buttonText()}
//                         </Button>
//                         <Input
//                             placeholder="Phone Number"
//                             value={value}
//                             onChangeText={(text) => setValue(text)}
//                             keyboardType="numeric"
//                             size="lg"
//                             width="78%"
//                         />
//                     </HStack>
//                     <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
//                         <Modal.Content>
//                             <Modal.Header>Select Country Code</Modal.Header>
//                             <Modal.Body>
//                                 <Select
//                                     selectedValue={selectedValue}
//                                     onValueChange={handleSelect}
//                                     accessibilityLabel="Choose Your Location"
//                                 >
//                                     <Select.Item label="+60 Malaysia" value="my" />
//                                     <Select.Item label="+86 China" value="cn" />
//                                 </Select>
//                             </Modal.Body>
//                         </Modal.Content>
//                     </Modal>
//                 </FormControl>
//                 <Input
//                     size='lg'
//                     placeholder="Enter OTP"
//                     mt="4"
//                     onChangeText={(text) => setOtp(text)}
//                 />
//                 {renderButton()}
//                 <Text mt="4" textAlign="center">
//                     Don't have an account?{" "}
//                     <Text
//                         onPress={() => navigation.navigate("UserSignUp")}
//                         color="blue.500"
//                         _underline={{}}
//                     >
//                         Sign Up here.
//                     </Text>
//                 </Text>
//             </VStack>
//         </TouchableWithoutFeedback>
//     );
// }
//
// export default function App() {
//     return (
//         <NativeBaseProvider>
//             <Center flex={1}>
//                 <Example />
//             </Center>
//         </NativeBaseProvider>
//     );
// }


import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD5 } from "crypto-js";
import React, { useState, useEffect } from "react";
import {userLogin, smsSend} from "../com/ studentlifestyle/ common/http/BizHttpUtil";
import { useNavigation } from "@react-navigation/native";
import {
    FormControl,
    Select,
    CheckIcon,
    Center,
    Modal,
    WarningOutlineIcon,
    Box,
    VStack,
    Button,
    NativeBaseProvider,
    Input,
    Text,
    Flex,
    HStack,
} from "native-base";
import axios from "axios";

const countryCodes = {
    my: "+60",
    cn: "+86",
};

function Example() {

    const navigation = useNavigation();

    const [otp, setOtp] = useState("");
    const [selectedValue, setSelectedValue] = useState("my");
    const [showModal, setShowModal] = useState(false);

    const handleSelect = (value) => {
        setSelectedValue(value);
        setShowModal(false);
    };

    const buttonText = () => {
        switch (selectedValue) {
            case 'my':
                return '+60';
            case 'cn':
                return '+86';
            default:
                return 'Select Country Code';
        }
    };

    const submitData = () => {
        if (selectedValue === "cn" && value.length !== 11) {
            alert("Please enter a valid 11-digit phone number for China");
            return false;
        }
        if (selectedValue === "my" && value.length !== 9) {
            alert("Please enter a valid 9-digit phone number for Malaysia");
            return false;
        }

        if (!value) {
            alert("Please enter a phone number");
            return false;
        }

        if (!selectedValue) {
            alert("Please choose a country code");
            return false;
        }

        const prefix = countryCodes[selectedValue];
        const phoneNumber = {
            'phoneNumber': prefix ? prefix + value : value,
        }

        smsSend(phoneNumber)
            .then(data => {
                if (data.code === 200) {
                    setIsTimerActive(true);
                    console.log(data.code)
                } else {
                    alert(data.message);
                    return false;
                }
            })
            .catch(error => {
                console.log(error);
                alert('There was an error submitting your data. Please try again.');
                return false;
            })
    };

    const [value, setValue] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(30);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isResendOtpActive, setIsResendOtpActive] = useState(false);

    useEffect(() => {
        let intervalId;
        if (isTimerActive && secondsRemaining > 0) {
            intervalId = setInterval(() => {
                setSecondsRemaining((prev) => prev - 1);
            }, 1000);
        } else if (secondsRemaining === 0) {
            setIsResendOtpActive(true);
            setIsTimerActive(false);
        }
        return () => clearInterval(intervalId);
    }, [isTimerActive, secondsRemaining]);

    const handleResendOtp = () => {
        setSecondsRemaining(30);
        setIsResendOtpActive(false);
        submitData();
    };

    const handleOtpInputChange = (text) => {
        setOtp(text);
        if (text.length === 4) {
            const userPhone = selectedValue + value;
            userLoginWithSmsCode(userPhone, text);
        }
    };

    const userLoginWithSmsCode = (userPhone, code) => {
        const loginParams = {
            "userPhone": userPhone,
            "code": MD5(code).toString(), // 对验证码进行 MD5 加密
            "deviceId": "12345",
            "platform": 0
        }
        userLogin(loginParams)
            .then(data => {
                if (data.code === 200) {
                    console.log("登录成功：" + data.data)
                    // 导航到下一个页面
                    navigation.navigate("NextScreen");
                } else {
                    console.log("登录失败" + data.message);
                    alert("Login failed");
                }
            })
            .catch(error => {
                console.log(error);
                alert("Login failed");
            });
    };

    const renderButton = () => {
        if (isTimerActive) {
            return (
                <Button
                    variant="outline"
                    colorScheme="secondary"
                    size="sm"
                    mt="2"
                    isDisabled={true}
                >
                    <Text>{secondsRemaining} s</Text>
                </Button>
            );
        } else if (isResendOtpActive) {
            return (
                <Button
                    variant="outline"
                    colorScheme="secondary"
                    size="sm"
                    mt="2"
                    onPress={handleResendOtp}
                >
                    Resend
                </Button>
            );
        } else {
            return (
                <Button
                    mt="4"
                    onPress={submitData}
                >
                    Get OTP
                </Button>
            );
        }
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <VStack space="2.5" mt="4" px="8">
                <FormControl isRequired>
                    <FormControl.Label>Please enter your phone number</FormControl.Label>
                    <HStack space={2}>
                        <Button onPress={() => setShowModal(true)}>
                            {buttonText()}
                        </Button>
                        <Input
                            placeholder="Phone Number"
                            value={value}
                            onChangeText={(text) => setValue(text)}
                            keyboardType="numeric"
                            size="lg"
                            width="78%"
                        />
                    </HStack>
                    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                        <Modal.Content>
                            <Modal.Header>Select Country Code</Modal.Header>
                            <Modal.Body>
                                <Select
                                    selectedValue={selectedValue}
                                    onValueChange={handleSelect}
                                    accessibilityLabel="Choose Your Location"
                                >
                                    <Select.Item label="+60 Malaysia" value="my" />
                                    <Select.Item label="+86 China" value="cn" />
                                </Select>
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>
                </FormControl>
                <Input
                    size='lg'
                    placeholder="Enter OTP"
                    mt="4"
                    onChangeText={handleOtpInputChange}
                />
                {renderButton()}
                <Text mt="4" textAlign="center">
                    Don't have an account?{" "}
                    <Text
                        onPress={() => navigation.navigate("UserSignUp")}
                        color="blue.500"
                        _underline={{}}
                    >
                        Sign Up here.
                    </Text>
                </Text>
            </VStack>
        </TouchableWithoutFeedback>
    );
}

export default function App() {
    return (
        <NativeBaseProvider>
            <Center flex={1}>
                <Example />
            </Center>
        </NativeBaseProvider>
    );
}
