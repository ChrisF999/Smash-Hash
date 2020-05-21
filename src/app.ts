import crypto from "crypto";
import fs, { copySync } from "fs-extra";
import lineReader from "line-reader";


//MD5 Hash Fuction
function MD5(tohash: string) {
    return (crypto.createHash('MD5').update(tohash).digest("hex"))
}
//SHA1 Hash Fuction
function SHA1(tohash: string) {
    return (crypto.createHash('SHA1').update(tohash).digest("hex"))
}
//SHA256 Hash Fuction
function SHA256(tohash: string) {
    return (crypto.createHash('SHA256').update(tohash).digest("hex"))
}
//SHA224 Hash Function
function SHA224(tohash: string) {
    return (crypto.createHash('SHA224').update(tohash).digest('hex'))
}
//SHA512 Hash Function
function SHA512(tohash: string) {
    return (crypto.createHash('SHA512').update(tohash).digest('hex'))
}
//SHA384 Hash Function
function SHA384(tohash: string) {
    return (crypto.createHash('SHA384').update(tohash).digest('hex'))
}
//SHA3 Hash Function
function SHA3(tohash: string) {
    return (crypto.createHash('SHA3').update(tohash).digest('hex'))
}
//RIPEMD160 Hash Function
function RIPEMD160(tohash: string) {
    return (crypto.createHash('RIPEMD160').update(tohash).digest('hex'))
}
//CVS File Saver
function csvSave(toCVSPass: string, toCVSHash: string, path: string, delimiter: string) {
    try {
        fs.ensureFile(path)
        //console.log('File Exits')
        fs.appendFile(path, `${toCVSPass}${delimiter}${toCVSHash}\r\n`, (err) => {
            if (err) throw err;
        });

    } catch (err) {
        console.error(err)
    }
}
//Hashes from a Plain Text file line by line no bufffer
async function hashFromfileNoBuffer(path: string, hashtype: string, savePath: string, delimiter: string) {
    const readline = require('readline').createInterface({
        input: require('fs').createReadStream(path)
    });

    readline.on('line', function (line: string) {
        switch (hashtype) {
            case "MD5":
                csvSave(line, MD5(line), savePath, delimiter)
                break;
            case "SHA1":
                csvSave(line, SHA1(line), savePath, delimiter)
                break;
            case "SHA256":
                csvSave(line, SHA256(line), savePath, delimiter)
                break
            case "SHA224":
                csvSave(line, SHA224(line), savePath, delimiter)
                break
            case "SHA512":
                csvSave(line, SHA512(line), savePath, delimiter)
                break
            case "SHA384":
                csvSave(line, SHA384(line), savePath, delimiter)
                break
            case "SHA3":
                csvSave(line, SHA3(line), savePath, delimiter)
                break
            case "RIPEMD160":
                csvSave(line, RIPEMD160(line), savePath, delimiter)
                break
            default:
                console.log(line)
        }
    });

}
hashFromfileNoBuffer("C:/Users/Khris/Documents/GitKraken/Smash-Hash/examples/10-million-password-list-top-1000000.txt", "MD5", "C:/Users/Khris/Documents/GitKraken/Smash-Hash/examples/hashes.csv", '/')
//Hashes from a Plain Text file line by line bufffer