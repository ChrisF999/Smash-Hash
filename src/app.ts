import { Hash } from "crypto";
const { GPU } = require('gpu.js');
const term = require('terminal-kit').terminal;
const fs = require('fs-extra')

try {
    const crypto = require('crypto');
} catch (err) {
    console.log('crypto support is disabled!');
    process.exit()
}
const readline = require('readline');
term.clear()
term.bold('Choose a file: ');
const countLinesInFile = require('count-lines-in-file');
const cliProgress = require('cli-progress');
const md5 = require('md5');// const readline = require('linebyline');




term.fileInput(
    { baseDir: './' },
    function (error: string, path: string) {
        if (error) {
            term.red.bold("\nAn error occurs: " + error + "\n");
            return process.exit(1)
        }
        else {
            fs.pathExists(path)
                .then((exists: boolean) => {
                    if (exists == true) {
                        term.green(`\nFile Found at ${path}\n`)

                        var items = ['Yes', 'No'];
                        term(`Do you want to continue with the current file.`).bold(`${path}`)
                        const options = {
                            style: term.inverse,
                            selectedStyle: term.dim.blue.bgGreen
                        };

                        term.singleLineMenu(items, options, function (error: any, response: { selectedIndex: any; selectedText: any; x: any; y: any; }) {
                            term('\n').eraseLineAfter.green(
                                "%s selected.\n",
                                response.selectedText,
                            );
                            if (response.selectedIndex == 0) {
                                countLinesInFile(path, async (error: Error, numberOfLines: number) => {
                                    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey);
                                    bar1.start(numberOfLines, 0);
                                    const readEachLineSync = require('read-each-line-sync')

                                    let ting: any;

                                    let toSave: Array<any> = [];

                                    readEachLineSync(path, 'utf8', function (line: any) {

                                        ting = md5(line);

                                        toSave.push({ password: line, hash: ting });
                                        bar1.increment();

                                    })
                                    bar1.stop();
                                    term.bold("Select output file (will create if file doesn't exist)\n")
                                    term.fileInput(
                                        { baseDir: './' },
                                        function (error: string, outpath: string) {
                                            if (error) {
                                                term.red.bold("\nAn error occurs: " + error + "\n");
                                                return process.exit(1)
                                            } else {
                                                fs.writeFile(`${outpath}.json`, JSON.stringify(toSave, null, '\t'), function (err: any) {
                                                    if (err) throw err;
                                                    console.log(`Saved: ${toSave.length} Hashes`);
                                                    process.exit()
                                                });
                                            }
                                        })



                                    //process.exit()
                                });
                            } else {
                                process.exit()
                            }
                        });
                    }
                    else {
                        term.red(`\nFile not found at ${path}\n`)
                        process.exit()
                    }
                })  // => false
                .catch((error: any) => {
                    //  term.red(error)
                    process.exit()
                })

        }

    }
);
