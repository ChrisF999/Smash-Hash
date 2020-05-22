import * as crypto from "crypto";
import * as fs from "fs-extra";
const countLinesInFile = require('count-lines-in-file');


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
let writeBuffer: Array<string> = []
async function csvSave(toCVSPass: string, toCVSHash: string, path: string, delimiter: string, bufferSize: number) {

    try {
        writeBuffer.push(`${toCVSHash}${delimiter}${toCVSPass}\r\n`)
        if (writeBuffer.length != bufferSize) return
        fs.ensureFile(path)
        let writeStream = fs.createWriteStream(path, { flags: 'a' });
        writeBuffer.forEach(line => {
            writeStream.write(`${line}`);
        });
        writeBuffer = []
        writeStream.end();
    } catch (err) {
        console.error(err)
    }
}

//Hashes from a Plain Text file line by line bufffer
function hashFromfileNoBuffer(path: string, hashtype: string, savePath: string, delimiter: string, bufferSize: number) {
    let readStream = fs.createReadStream(path);

    readStream.on('data', function (data) {

        let lines: Array<string> = []
        lines = data.toString().split('\n')
        lines.forEach(line => {
            switch (hashtype) {
                case "MD5":
                    csvSave(line.toString(), MD5(line.toString()), savePath, delimiter, bufferSize)
                    break;
                case "SHA1":
                    csvSave(line.toString(), SHA1(line.toString()), savePath, delimiter, bufferSize)
                    break;
                case "SHA256":
                    csvSave(line.toString(), SHA256(line.toString()), savePath, delimiter, bufferSize)
                    break
                case "SHA224":
                    csvSave(line.toString(), SHA224(line.toString()), savePath, delimiter, bufferSize)
                    break
                case "SHA512":
                    csvSave(line.toString(), SHA512(line.toString()), savePath, delimiter, bufferSize)
                    break
                case "SHA384":
                    csvSave(line.toString(), SHA384(line.toString()), savePath, delimiter, bufferSize)
                    break
                case "SHA3":
                    csvSave(line.toString(), SHA3(line.toString()), savePath, delimiter, bufferSize)
                    break
                case "RIPEMD160":
                    csvSave(line.toString(), RIPEMD160(line.toString()), savePath, delimiter, bufferSize)
                    break
                default:
                    console.log(line)
            }
        });
    }).on('end', function () {
        console.log('done')
    });
}


try {
    hashFromfileNoBuffer("./examples/10-million-password-list-top-1000000.txt", "SHA512", "./examples/hashes.csv", '/', 100000)

} catch (err) {
    console.error(err)
}
