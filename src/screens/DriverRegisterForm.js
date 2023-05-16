import React, { useState, useEffect } from "react";
import {
    ScrollView,
    FormControl,
    Center,
    VStack,
    Button,
    NativeBaseProvider,
    Input,
    Text,
    Box,
    Image,
    HStack,
    KeyboardAvoidingView,
    Avatar,
    IconButton,
    Spacer,
} from "native-base";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

function DriverRegisterForm() {
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);
    const [avatar, setAvatar] = useState(null);
    const [registrationCardFront, setRegistrationCardFront] = useState(null);
    const [registrationCardBack, setRegistrationCardBack] = useState(null);
    const [selfie, setSelfie] = useState(null);
    const [idCardFront, setIdCardFront] = useState(null);
    const [idCardBack, setIdCardBack] = useState(null);
    const [licenseFront, setLicenseFront] = useState(null);
    const [licenseBack, setLicenseBack] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [vehiclePlateNumber, setVehiclePlateNumber] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [vehicleBrand, setVehicleBrand] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [vehicleColor, setVehicleColor] = useState("");
    const [carRegistrationDate, setCarRegistrationDate] = useState("");
    const [chassisNumber, setChassisNumber] = useState("");
    const [coverNoteInsuranceFront, setCoverNoteInsuranceFront] = useState(null);
    const [coverNoteInsuranceBack, setCoverNoteInsuranceBack] = useState(null);
    const [insuranceExpiryDate, setInsuranceExpiryDate] = useState("");
    const [roadTax, setRoadTax] = useState("");

    const LargeInput = (props) => {
        return <Input size="lg" {...props} />
    }


    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    const handleImagePicker = async (setImage) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const handleRemoveImage = (setImage) => {
        setImage(null);
    };

    const handleSubmit = () => {
        if (!validateEmail(email)) {
            alert("Please enter a valid email address");
            return;
        }
        // send form data to backend
        const formData = new FormData();
        formData.append("avatar", avatar);
        formData.append("registrationCardFront", registrationCardFront);
        formData.append("registrationCardBack", registrationCardBack);
        formData.append("selfie", selfie);
        formData.append("idCardFront", idCardFront);
        formData.append("idCardBack", idCardBack);
        formData.append("licenseFront", licenseFront);
        formData.append("licenseBack", licenseBack);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("vehiclePlateNumber", vehiclePlateNumber);
        formData.append("vehicleType", vehicleType);
        formData.append("vehicleBrand", vehicleBrand);
        formData.append("vehicleModel", vehicleModel);
        formData.append("vehicleColor", vehicleColor);
        formData.append("carRegistrationDate", carRegistrationDate);
        formData.append("chassisNumber", chassisNumber);
        formData.append("coverNoteInsuranceFront", coverNoteInsuranceFront);
        formData.append("coverNoteInsuranceBack", coverNoteInsuranceBack);
        formData.append("insuranceExpiryDate", insuranceExpiryDate);
        formData.append("roadTax", roadTax);

        // send formData to backend using fetch or axios
        fetch("http://yourbackendurl.com/register-driver", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                alert("Driver Registration Successful");
            })
            .catch((error) => {
                console.error(error);
                alert("Failed to register driver");
            });
    };

    return (
        <NativeBaseProvider>
            <KeyboardAwareScrollView>
                <Center flex={1}>
                    <VStack space="2.5" mt="4" px="8" width="100%" w='350' >
                        <Box marginTop={6}>
                            <HStack space="2.5" flexWrap="wrap">
                                <FormControl flex={1}>
                                    <FormControl.Label>First Name</FormControl.Label>
                                    <LargeInput
                                        placeholder="Enter First Name"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                        width="100%"
                                    />
                                </FormControl>
                                <FormControl flex={1}>
                                    <FormControl.Label>Last Name</FormControl.Label>
                                    <LargeInput
                                        placeholder="Enter Last Name"
                                        value={lastName}
                                        onChangeText={setLastName}
                                        width="100%"
                                    />
                                </FormControl>
                            </HStack>
                        </Box>
                        <FormControl>
                            <FormControl.Label>Selfie</FormControl.Label>
                            {avatar ? (
                                <Box position="relative">
                                    <Avatar
                                        bg="pink.600"
                                        alignSelf="center"
                                        size="xl"
                                        source={{ uri: avatar }}
                                    >
                                        GG
                                    </Avatar>
                                    <IconButton
                                        icon={<MaterialIcons name="cancel" size={24} color="red" />}
                                        position="absolute"
                                        top={0}
                                        right={0}
                                        onPress={() => handleRemoveImage(setAvatar)}
                                    />
                                </Box>
                            ) : (
                                <Button onPress={() => handleImagePicker(setAvatar)}>
                                    <Text>Select Image</Text>
                                </Button>
                            )}
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Email</FormControl.Label>
                            <LargeInput
                                placeholder="Enter Email Address"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Vehicle Plate Number</FormControl.Label>
                            <LargeInput
                                placeholder="Enter Vehicle Plate Number"
                                value={vehiclePlateNumber}
                                onChangeText={setVehiclePlateNumber}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Vehicle Type</FormControl.Label>
                            <LargeInput
                                placeholder="Enter Vehicle Type"
                                value={vehicleType}
                                onChangeText={setVehicleType}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Vehicle Brand</FormControl.Label>
                            <LargeInput
                                placeholder="Enter Vehicle Brand"
                                value={vehicleBrand}
                                onChangeText={setVehicleBrand}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Vehicle Model</FormControl.Label>
                            <LargeInput
                                placeholder="Enter Vehicle Model"
                                value={vehicleModel}
                                onChangeText={setVehicleModel}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Vehicle Color</FormControl.Label>
                            <LargeInput
                                placeholder="Enter Vehicle Color"
                                value={vehicleColor}
                                onChangeText={setVehicleColor}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Car Registration Date</FormControl.Label>
                            <LargeInput
                                placeholder="Enter Car Registration Date"
                                value={carRegistrationDate}
                                onChangeText={setCarRegistrationDate}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Chassis Number</FormControl.Label>
                            <LargeInput
                                placeholder="Enter Chassis Number"
                                value={chassisNumber}
                                onChangeText={setChassisNumber}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Cover Note Insurance (Front)</FormControl.Label>
                            <Button onPress={() => handleImagePicker(setCoverNoteInsuranceFront)}>
                                {coverNoteInsuranceFront ? (
                                    <Image
                                        source={{ uri: coverNoteInsuranceFront }}
                                        alt="Cover Note Insurance (Front)"
                                        size="md"
                                    />
                                ) : (
                                    <Text>Select Image</Text>
                                )}
                            </Button>
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Cover Note Insurance (Back)</FormControl.Label>
                            <Button onPress={() => handleImagePicker(setCoverNoteInsuranceBack)}>
                                {coverNoteInsuranceBack ? (
                                    <Image
                                        source={{ uri: coverNoteInsuranceBack }}
                                        alt="Cover Note Insurance (Back)"
                                        size="md"
                                    />
                                ) : (
                                    <Text>Select Image</Text>
                                )}
                            </Button>
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Insurance Expiry Date</FormControl.Label>
                            <LargeInput
                                placeholder="Enter Insurance Expiry Date"
                                value={insuranceExpiryDate}
                                onChangeText={setInsuranceExpiryDate}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Road Tax</FormControl.Label>
                            <LargeInput
                                placeholder="Enter Road Tax"
                                value={roadTax}
                                onChangeText={setRoadTax}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>ID Card (Front)</FormControl.Label>
                            <Button onPress={() => handleImagePicker(setIdCardFront)}>
                                {idCardFront ? (
                                    <Image source={{ uri: idCardFront }} alt="ID Card (Front)" size="md" />
                                ) : (
                                    <Text>Select Image</Text>
                                )}
                            </Button>
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>ID Card (Back)</FormControl.Label>
                            {idCardBack ? (
                                <HStack alignItems="center">
                                    <Box maxWidth={200}>
                                        <Text numberOfLines={1} ellipsizeMode="tail">{idCardBack}</Text>
                                    </Box>
                                    <IconButton
                                        icon={<MaterialIcons name="cancel" size={24} color="red" />}
                                        ml={2}
                                        onPress={() => handleRemoveImage(setIdCardBack)}
                                    />
                                </HStack>
                            ) : (
                                <Button onPress={() => handleImagePicker(setIdCardBack)}>
                                    <Text>Select Image</Text>
                                </Button>
                            )}
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>License (Front)</FormControl.Label>
                            <Button onPress={() => handleImagePicker(setLicenseFront)}>
                                {licenseFront ? (
                                    <Image source={{ uri: licenseFront }} alt="License (Front)" size="md" />
                                ) : (
                                    <Text>Select Image</Text>
                                )}
                            </Button>
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>License (Back)</FormControl.Label>
                            <Button onPress={() => handleImagePicker(setLicenseBack)}>
                                {licenseBack ? (
                                    <Image source={{ uri: licenseBack }} alt="License (Back)" size="md" />
                                ) : (
                                    <Text>Select Image</Text>
                                )}
                            </Button>
                        </FormControl>
                        <Box mt="4" marginBottom={8}>
                            <Button
                                size="lg"
                                onPress={handleSubmit}
                                bg="blue.500"
                                color="white"
                                _text={{ fontWeight: 'bold' }}>
                                Submit Form
                            </Button>
                        </Box>

                    </VStack>
                </Center>
                <Spacer />
            </KeyboardAwareScrollView>
        </NativeBaseProvider>
    );
}

export default function App() {
    return (
        <NativeBaseProvider>
            <ScrollView>
                <Center flex={1}>
                    <DriverRegisterForm />
                </Center>
            </ScrollView>
        </NativeBaseProvider>
    );
}