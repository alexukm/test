import React, { useState, useRef, useEffect } from 'react';
import { Keyboard, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { Box, Button, Center, FormControl, HStack, Input, NativeBaseProvider, Select, VStack, Text } from 'native-base';
import {userRegistry} from "../com/ studentlifestyle/ common/http/BizHttpUtil";

const RegisterScreen = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedValue, setSelectedValue] = useState('60');
    const [verificationCode, setVerificationCode] = useState('');
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isResendOtpActive, setIsResendOtpActive] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(0);

    const countryData = [
        { code: 'MY', label: '60' },
        { code: 'CHN', label: '86' },
    ];

    // 创建一个ref
    const firstNameInputRef = useRef(null);

    // 使用useEffect，在组件挂载完成后聚焦在firstName输入框
    useEffect(() => {
        if (firstNameInputRef.current) {
            firstNameInputRef.current.focus();
        }
    }, []);

    const submitData = () => {
        // 检查所有输入框都已填写
        if (!firstName || !lastName || !email || !phoneNumber) {
            alert('Please fill in all the fields.');
            return;
        }

        // 验证电子邮件格式
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // 根据选择的国家代码，验证电话号码
        let phonePattern;
        if (selectedValue === '60') {
            phonePattern = /^\d{9}$/;
        } else if (selectedValue === '86') {
            phonePattern = /^\d{11}$/;
        }

        if (!phonePattern.test(phoneNumber)) {
            alert('Please enter a valid phone number.');
            return;
        }
        const userPhone = selectedValue+phoneNumber
        // 调用后端函数
        doUserRegistry(firstName, lastName, email, userPhone, verificationCode);
    };
    const deviceId = 'ASAF414561CAD1';
    const doUserRegistry = (firstName, lastName, email, userPhone, code) => {
        const registryParams = {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "userPhone": userPhone,
            "deviceId": deviceId,
            "platform": 0,
            "code": code,
        }
        console.log("用户注册")
        console.log(registryParams)

        userRegistry(registryParams)
            .then(data => {
                if (data.code === 200) {
                    console.log("注册成功" + data)
                    setIsTimerActive(true);
                    setIsResendOtpActive(false);
                    let counter = 30;
                    setSecondsRemaining(counter);
                    const timer = setInterval(() => {
                        counter--;
                        setSecondsRemaining(counter);
                        if (counter === 0) {
                            clearInterval(timer);
                            setIsTimerActive(false);
                            setIsResendOtpActive(true);
                        }
                    }, 1000);
                } else {
                    console.log("注册失败" + data.message);
                    console.log(data.header)
                }
            }).catch(error => {
            console.log("注册失败" + error);
            console.log(data.header)
        });
    }

    const handleResendOtp = () => {
        // 这里处理OTP重发逻辑
        // 再次调用doUserRegistry函数
        doUserRegistry(firstName, lastName, email, phoneNumber, selectedValue);
    }

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
        <SafeAreaView style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Center flex={1}>
                    <Box flex={1} p={4} width="100%">
                        <VStack space={4} width="100%">
                            <HStack space={4} width="100%">
                                <FormControl flex={1}>
                                    <FormControl.Label>First Name</FormControl.Label>
                                    <Input
                                        size="lg"
                                        ref={firstNameInputRef}
                                        placeholder="Enter first name"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                    />
                                </FormControl>
                                <FormControl flex={1}>
                                    <FormControl.Label>Last Name</FormControl.Label>
                                    <Input
                                        size="lg"
                                        placeholder="Enter last name"
                                        value={lastName}
                                        onChangeText={setLastName}
                                    />
                                </FormControl>
                            </HStack>
                            <FormControl width="100%">
                                <FormControl.Label>Email</FormControl.Label>
                                <Input
                                    size="lg"
                                    placeholder="Enter email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </FormControl>
                            <FormControl width="100%">
                                <FormControl.Label>Phone Number</FormControl.Label>
                                <HStack space={2} width="100%">
                                    <Select
                                        size="lg"
                                        selectedValue={selectedValue}
                                        minWidth={120}
                                        accessibilityLabel="Choose Country Code"
                                        onValueChange={itemValue => {
                                            setSelectedValue(itemValue);
                                        }}
                                        flex={1}>
                                        {countryData.map(item => (
                                           <Select.Item key={item.code} label={`${item.code} +${item.label}`} value={item.label}/>
                                        ))}
                                    </Select>

                                    <Input
                                        placeholder={selectedValue === '60' ? 'Enter 9 digit number' : 'Enter 11 digit number'}
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        keyboardType="numeric"
                                        flex={1}
                                        size="lg"
                                    />
                                </HStack>
                            </FormControl>
                            <FormControl width="100%">
                                <FormControl.Label>Verification Code</FormControl.Label>
                                <Input
                                    size="lg"
                                    placeholder="Enter verification code"
                                    value={verificationCode}
                                    onChangeText={setVerificationCode}
                                    keyboardType="numeric"
                                    maxLength={4}
                                />
                            </FormControl>
                            {renderButton()}
                        </VStack>
                    </Box>
                </Center>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default function App() {
    return (
        <NativeBaseProvider>
            <RegisterScreen />
        </NativeBaseProvider>
    );
}
