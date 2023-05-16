import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useEffect } from "react";
import { OTPPass, OTPError } from "./verifyPhoneNumber.js";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import {
    FormControl,
    Select,
    CheckIcon,
    Center,
    Modal,
    WarningOutlineIcon,
    VStack,
    Button,
    NativeBaseProvider,
    Input,
    Text,
    Flex,
} from "native-base";

function Example() {

    const navigation = useNavigation();

    const [otp, setOtp] = useState("");

    const [selectedValue, setSelectedValue] = useState("");

    const countryCodes = {
        my: "+60",
        cn: "+86",
    };

    const handleSelect = (value) => {
        setSelectedValue(value);
        if (value === "my") {
            setPlaceholder("Enter 9 digit phone number");
        } else if (value === "cn") {
            setPlaceholder("Enter 11 digit phone number");
        } else {
            setPlaceholder("");
        }
    };

    const submitData = async (phoneNumber) => {

        try {
            const response = await axios.get(urlPrefix + '/xfc/v1/sys/api/sms/send', {
                headers: {
                    'ngrok-skip-browser-warning': '123',
                },
                params: {
                    phoneNumber: phoneNumber,
                },
            });

            // Handle the response from the backend
            const successCode = 200;
            if (response.data.code === successCode) {
                // Verification successful, update the state to show the OTP modal
                setIsTimerActive(true);
                setModalVisible(true);
            } else {
                // Verification failed, show an alert with the error message
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('There was an error submitting your data. Please try again.');
        }
    };

    const urlPrefix = 'https://63ff-2409-8a44-867d-c730-d0a1-6b3b-3599-f256.ngrok-free.app'

    const verifyOtp = async (otp, phoneNumber) => {
        try {
            const response = await axios.post('<Your-OTP-Verification-Endpoint>', {
                otp: otp,
                phoneNumber: phoneNumber
            });

            // Here I assume the server will return a JSON response with a `success` field.
            // You may need to adjust this part based on your server's actual response.
            if (OTPPass(otp)) {
                // OTP verification was successful, navigate to the home page
                navigation.navigate('Home');
            } else {
                // OTP verification failed, show an error message
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert('There was an error verifying the OTP. Please try again.');
        }
    };


    const [placeholder, setPlaceholder] = useState("");

    const isInvalid = selectedValue === "";

    const [value, setValue] = React.useState("");

    // const handleChange = (text) => setValue(text);

    const [modalVisible, setModalVisible] = React.useState(false);
    const [secondsRemaining, setSecondsRemaining] = React.useState(30);

    const [timer, setTimer] = useState(30);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isResendOtpActive, setIsResendOtpActive] = useState(false);

    useEffect(() => {
        let intervalId;
        if (isTimerActive && timer > 0) {
            intervalId = setInterval(() => {
                setTimer((prev) => prev - 1);
                setSecondsRemaining((prev) => {
                    if (prev <= 0) {
                        return 30;
                    } else {
                        return prev - 1;
                    }
                });
            }, 1000);
        } else if (timer === 0) {
            setIsResendOtpActive(true);
            setIsTimerActive(false);
            setSecondsRemaining(0);
        }
        return () => clearInterval(intervalId);
    }, [timer, isTimerActive]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <VStack space="2.5" mt="4" px="8">
                <FormControl isRequired isInvalid={isInvalid}>
                    <FormControl.Label>Please choose the country</FormControl.Label>
                    <Select
                        accessibilityLabel="Choose Your Location"
                        placeholder="Choose Your Location"
                        _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size={5} />,
                        }}
                        mt="1"
                        selectedValue={selectedValue}
                        onValueChange={handleSelect}
                        size="lg" // 增加选择框的大小
                        w="300" // 设置固定宽度
                    >
                        <Select.Item label="+60 Malaysia" value="my" />
                        <Select.Item label="+86 China" value="cn" />
                    </Select>
                    {isInvalid && (
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            Please make a selection!
                        </FormControl.ErrorMessage>
                    )}
                </FormControl>
                <FormControl.Label>Phone Number</FormControl.Label>
                <Input w="300" placeholder={placeholder} value={value} onChangeText={(text) => setValue(text)} keyboardType="numeric" size="lg" />
                <Button
                    mt="4"
                    onPress={() => {
                        if (selectedValue === "cn" && value.length !== 11) {
                            alert("Please enter a valid 11-digit phone number for China");
                            return;
                        }
                        if (selectedValue === "my" && value.length !== 9) {
                            alert("Please enter a valid 9-digit phone number for Malaysia");
                            return;
                        }

                        if (!value) {
                            alert("Please enter a phone number");
                            return;
                        }

                        if (!selectedValue) {
                            alert("Please choose a country code");
                            return;
                        }

                        submitData(selectedValue + value); // Only submit data if all conditions are met

                        setIsTimerActive(true);
                        setModalVisible(true);
                    }}
                >
                    Get OTP
                </Button>

                <Text mt="4" textAlign="center">
                    Don't have an account?{" "}
                    <Text
                        onPress={() => navigation.navigate("DriverSignUp")} // 导航到注册页面
                        color="blue.500" // 设置文字颜色
                        _underline={{}} // 添加下划线
                    >
                        Sign Up here.
                    </Text>
                </Text>
                {modalVisible && (
                    <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                        <Modal.Content>
                            <Modal.Header>OTP Verification</Modal.Header>
                            <Modal.Body>
                                <Text fontSize="sm">
                                    We have already sent OTP to {countryCodes[selectedValue]} {value}{" "}
                                </Text>
                                <Flex direction="row" align="center">
                                    {!isResendOtpActive ? (
                                        <Text color="gray.400" fontSize="xs">
                                            Resend in {secondsRemaining} seconds
                                        </Text>
                                    ) : null}
                                </Flex>
                                <Input
                                    placeholder="Enter OTP"
                                    mt="4"
                                    onChangeText={(text) => setOtp(text)}
                                />
                            </Modal.Body>

                            <Modal.Footer>
                                <Button.Group space={2}>
                                    {isResendOtpActive && (
                                        <Button
                                            variant="outline" // 更改为轮廓按钮
                                            colorScheme="secondary" // 更改颜色方案
                                            onPress={() => {
                                                setIsTimerActive(true);
                                                setIsResendOtpActive(false);
                                                setTimer(30);
                                                setSecondsRemaining(30);
                                            }}
                                        >
                                            Resend
                                        </Button>
                                    )}
                                    <Button
                                        onPress={() => {
                                            setModalVisible(false);
                                            setIsTimerActive(false);
                                            setIsResendOtpActive(false);
                                            setTimer(30);
                                            setSecondsRemaining(30);
                                            setSelectedValue("");
                                            setValue("");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onPress={() => {
                                            if (otp.length === 4 && /^\d+$/.test(otp)) {
                                                // 用户输入的是4位数字，进行验证
                                                verifyOtp(otp, countryCodes[selectedValue] + value);
                                                setModalVisible(false);
                                                // 在这里进行页面导航或其他操作
                                            } else {
                                                // 用户输入不是4位数字，显示警告
                                                alert("Please enter a valid 4-digit OTP");
                                            }
                                        }}
                                    >
                                        Verify
                                    </Button>

                                </Button.Group>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                )}
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