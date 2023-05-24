import AsyncStorage from '@react-native-async-storage/async-storage';

export  function getValue(key) {
    return AsyncStorage.getItem(key);
}

export async function asyncGetValue(key) {

    return await AsyncStorage.getItem(key);

}

export function setKeyValue(key, value) {
    return AsyncStorage.setItem(key, value);
}

export function asyncSetLocalKeyValue(key, value) {
    return AsyncStorage.setItem(key, value);
}

export async function asyncDelKey(key) {
    return await AsyncStorage.removeItem(key);
}