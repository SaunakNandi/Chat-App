import { isValidUsername } from "6pp"
export const usernameValidator =(username) =>{
    if(isValidUsername(username))
        return {isValid:false,errorMessage:"Username must be alphanumeric"}
}

export const PasswordValidator = (password) =>{
    if(password.length>0 && password.length<=16)
    return {isValid:false,errorMessage:"Password must be 8 characters and at most 16 characters long"}
}