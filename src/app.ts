import * as crypto from "crypto";
import * as fs from "fs-extra";
import { terminal } from "terminal-kit";
import * as math from 'mathjs';
import * as os from "os";
const countLines = require('count-lines-in-file')
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
        lines = data.toString().split(os.EOL)
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


        terminal.green("\nHashing Complete")
        uiAgain()
    });
}
// fucntion for the file input for the ui
function uiInputFile() {
    terminal('Choose input file: ');
    terminal.fileInput(
        { baseDir: './' },
        function (error: Error, path: string) {
            if (error) {
                terminal.red.bold("\nAn error occurs: " + error + "\n");
            }
            else {
                //file validation checks the path exits and checks to see if it is a file rather than a dir
                if (fs.pathExists(path) && fs.lstatSync(path).isFile()) {
                    terminal.green("\n Input file is '%s'\n", path);
                    uiOutputFile(path)
                } else {
                    terminal.red.bold('\nFile cound not be found. Check if file exsits.\n')
                    uiInputFile()
                }
            }
        }
    );
}
function uiOutputFile(path: string) {
    terminal('Choose output file: ');
    terminal.fileInput(
        { baseDir: './' },
        function (error: Error, savePath: string) {
            if (error) {
                terminal.red.bold("\nAn error occurs: " + error + "\n");
            }
            else {
                terminal.green("\nYour file is '%s'", savePath);
                hashSelector(path, savePath)
            }
        }
    );

}
const supportedHashes = [
    'MD5',
    'SHA1',
    'SHA256',
    'SHA224',
    'SHA512',
    'SHA384',
    'SHA3',
    'RIPEMD160'
];

function hashSelector(path: string, savePath: string) {
    terminal('\nSelect Hashing Algorithm')
    terminal.singleLineMenu(supportedHashes, { style: terminal.inverse, }, function (error, response) {
        terminal('\n').eraseLineAfter.green("Selected: %s\n", response.selectedText);
        setDelimiter(path, savePath, response.selectedText)
    });
}

function setDelimiter(path: string, savePath: string, hash: string) {
    terminal('Please enter the Delimiter to be used: \n');
    terminal.inputField(
        { autoComplete: [','], autoCompleteMenu: true },
        function (error, delimiter) {
            if (!delimiter) delimiter = ','
            terminal.green("\nDelimiter: %s\n", delimiter);
            setLineBuffer(path, savePath, hash, delimiter)
        }
    );
}
function setLineBuffer(path: string, savePath: string, hash: string, delimiter: string) {

    countLines(path, (error: Error, linenumebrs: number) => {
        console.log(linenumebrs)
        let arraylinenum: Array<any> = [
            math.round(linenumebrs).toString(),
            math.round(linenumebrs / 2).toString(),
            math.round(linenumebrs / 4).toString(),
            '1'
        ]
        terminal('Select the number of lines to buffer before writing to file. (Higher is usualy faster but with a higher memeory cost)')
        terminal.singleLineMenu(arraylinenum, { style: terminal.inverse, }, function (error, response) {
            terminal('\n').eraseLineAfter.green(
                "Selected: %s\n",
                response.selectedText,
            );
            uiFinalCheck(path, hash, savePath, delimiter, parseInt(response.selectedText))
        });
    });

}

function uiFinalCheck(path: string, savePath: string, hash: string, delimiter: string, buffer: number) {
    terminal.bold(`Input Path: ${path}\n Output Path ${savePath}\n Hashing Algorithm: ${hash}\n Delimiter: ${delimiter}\n Buffer: ${buffer}\n`).noFormat(`Are theses details correct? [Y,n]`)
    terminal.yesOrNo({ yes: ['y', 'ENTER'], no: ['n'] }, function (error, result) {

        if (result) {
            terminal.green("\nStarting Hashing");
            hashFromfileNoBuffer(path, savePath, hash, delimiter, buffer)
        }
        else {
            uiInputFile()
        }
    });
}
function uiAgain() {
    terminal("\nHash Again? [Y/n]\n")
    terminal.yesOrNo({ yes: ['y', 'ENTER', 'Y'], no: ['n'] }, function (error, result) {

        if (result) {
            terminal.clear()
            uiInputFile()
        }
        else {
            process.exit()
        }
    })
}

try {
    uiInputFile()
} catch (error) {
    console.log(error)
}