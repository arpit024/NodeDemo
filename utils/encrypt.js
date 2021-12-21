const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const algorithm = "aes-256-cbc"; 
// generate 16 bytes of random data
const initVector = crypto.randomBytes(16);
const Securitykey = "secretjdivne3ig8woflr84nsugw9df";
let key = crypto.createHash('sha256').update(Securitykey).digest('hex');

function encrypt(plainString){
const cipher = crypto.createCipheriv(algorithm, Buffer.from(key,'hex'), initVector);
let encryptedData = cipher.update(plainString, "utf8", "hex") + cipher.final("hex");
return `${initVector.toString('hex')}${encryptedData}`;
}

function decrypt(encryptedString){
    let iv = encryptedString.substring(0,32)
    let encryptedValue = encryptedString.substring(32);
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key,'hex'), Buffer.from(iv,'hex'));

let decryptedData = decipher.update(encryptedValue, "hex", "utf8") + decipher.final("utf8");
return decryptedData;
}

function computeHash(text){
    return crypto.createHash('sha256').update(text).digest('hex')
}

async function getHashedPassword(password){
    let salt = bcrypt.genSaltSync(10);
    return await bcrypt.hash(password, salt);


}
async function compare(password, hashedpassword){
    return await bcrypt.compare(password, hashedpassword)
}
exports.encrypt=encrypt;
exports.decrypt=decrypt;
exports.compare=compare;
exports.computeHash=computeHash;
exports.getHashedPassword=getHashedPassword;
