const SUCCESS_CODE = 200;
const ERROR_CODE = 500;


export function OTPPass(code) {
    return code === SUCCESS_CODE;
}

function OTPError(code) {
    return code === ERROR_CODE;
}