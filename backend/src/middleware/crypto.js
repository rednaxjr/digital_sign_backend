var CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
// var SHA512 = require("crypto-js/sha512"); 
require('dotenv').config();

function hash512(data) {
    const ciphertext = CryptoJS.SHA512(data).toString(CryptoJS.enc.Hex);
    return ciphertext
}
function encryptId(data) {
    var ciphertext = CryptoJS.AES.encrypt(String(data), process.env.SECRET_KEY).toString();
    return ciphertext.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decryptId(data) {
    var base64 = data.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = CryptoJS.AES.decrypt(base64, process.env.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

function encrypt(data) {
    const ciphertext = CryptoJS.SHA512(data).toString();
    return ciphertext
}
function decrypt(data) {
    const bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = {
    encrypt,
    decrypt,
    hash512,
    decryptId,
    encryptId
}