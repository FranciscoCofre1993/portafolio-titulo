import * as CryptoJS from 'crypto-js'; 
import { environment } from 'src/environments/environment';

export const encrypt = (data:any):string=>{
return CryptoJS.AES.encrypt(data, environment.keyEncript).toString();
}

export const desencrypt = (valueEncrypt:string):any | null=> {
    const valueDecrypt = CryptoJS.AES.decrypt(valueEncrypt, environment.keyEncript).toString(CryptoJS.enc.Utf8);
    if (!valueDecrypt) {
        return null;
    }
    return valueDecrypt;
}