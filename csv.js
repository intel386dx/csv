/*
 * CSV Parser in JavaScript + command-line interface
 * =================================================
 *
 * Licensed under the MIT License:
 *
 * Copyright (c) 2023 Hilman Ahwas A.
 *
 * Permission is hereby granted, free of charge, to any person ob-
 * taining a copy  of this  software  and associated documentation 
 * files (the “Software”), to deal in the Software without restri-
 * ction, including  without limitation  the rights to  use, copy, 
 * modify, merge, publish, distribute, sublicense, and/or sell co-
 * pies of the  Software, and to permit persons to  whom the Soft-
 * ware  is furnished to  do so, subject  to the following  condi-
 * tions:
 * 
 * The above copyright notice and this permission notice shall be 
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS  FOR A PARTICULAR  PURPOSE AND NON-
 * INFRINGEMENT. IN NO  EVENT SHALL THE AUTHORS  OR COPYRIGHT HOL-
 * DERS BE LIABLE FOR ANY CLAIM,  DAMAGES OR OTHER LIABILITY, WHE-
 * THER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN  CONNECTION WITH THE SOFTWARE OR  THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 */

/* Part 1: Core CSV parser/stringifier 
 * ===================================
 * The global CSV object containing methods for converting CSV to multi-dimensional array and vice versa
 * Has been tested on Windows Script Host
 */
var CSV = {
    /* Part 1.1: CSV Parser
     * --------------------
     * This parses the CSV data into a two-dimensional JavaScript array.
     * Usage: CSV.parse(csv)
     * where: ``csv``: This is where you pass the CSV data.
     * 
     * > For example:
     *   ```
     *   CSV.parse("Name,Job,Salary\nSteve,Quality Control,2000\nAlex,Financial Manager,2500")
     *   ```
     *   will output a two-dimensional array like this:
     *   ```
     *   [["Name","Job","Salary"],["Steve","Quality Control","2000"],["Alex","Financial Manager","2500"]]
     *   ```
     */
    parse: function(csv) {
        if (typeof csv != "undefined") {
            parsedCSVByLine = csv.toString().replace("\r\n", "\n").split("\n");
            parsedCSV = [];
            for (h = 0; h < parsedCSVByLine.length; h = h + 1) {
                var line = parsedCSVByLine[h].split("");
                var values = [];
                var currentValue = "";
                var withinQuotes = false;
                for (i = 0; i < line.length; i = i + 1) {
                    var char = line[i];
                    if (char == "\"" && line[i - 1] === ",") {
                        if (line[i + 1] === "\"" && withinQuotes) {
                            currentValue = currentValue + "\"";
                            i = i + 1;
                        } else {
                            withinQuotes = !withinQuotes;
                        };
                    } else if (char == "\"" && (line[i + 1] === "," || line[i + 1] === ";")) {
                        withinQuotes = !withinQuotes;
                        values.push(currentValue);
                        currentValue = "";
                    } else if ((char === "," || char === ";") && !withinQuotes) {
                        values.push(currentValue);
                        currentValue = "";
                    } else if (char === "\"" && !withinQuotes) {
                        currentValue = currentValue + "\"";
                    } else {
                        currentValue = currentValue + char;
                    };
                };
                values.push(currentValue);
                parsedCSV.push(values);
            };
            return parsedCSV;
        } else {
            throw new SyntaxError("You must provide your CSV data, like this!\nA,B,C\n1,2,3")
        };
    },
    /* Part 1.2: CSV Stringifier
     * -------------------------
     * This parses the two-dimensional JavaScript array into a CSV data.
     * Usage: CSV.stringify(arr, useSemiColons, useCRLF)
     * where: ``csv``: This is where you pass your two-dimensional JavaScript array.
     *        ``useSemiColons``: if ``true``, it will use semicolons as the delimiter, otherwise it will use commas.
     *                           Excel might use semicolons depending on your region settings.
     *        ``useCRLF``: if ``true``, it will use CRLF for Windows/DOS, otherwise it will use LF for Linux/Unix.
     * 
     * > For example:
     *   ```
     *   CSV.stringify([
     *       ["Name","Job","Salary"],
     *       ["Steve","Quality Control","2000"],
     *       ["Alex","Financial Manager","2500"]
     *   ])
     *   ```
     *   will output a CSV data like this:
     *   ```
     *   Name,Job,Salary
     *   Steve,Quality Control,2000
     *   Alex,Financial Manager,2500
     *   ```
     */
    stringify: function(arr, useSemiColons, useCRLF) {
        if (typeof arr == "object") {
            var result = [];
            for (i = 0; i < arr.length; i = i + 1) {
                resultingLine = [];
                for (j = 0; j < arr[i].length; j = j + 1) {
                    quote = false;
                    currentValue = arr[i][j].toString();
                    if (currentValue.indexOf(",") != -1) quote = true;
                    if (quote && currentValue.indexOf("\"") != -1) currentValue = currentValue.replace(/"/g, "\"\"")
                    resultingLine.push(quote? "\"" + currentValue + "\"" : currentValue);
                };
                result.push(resultingLine.join(!!useSemiColons? ";" : ","));
            };
            return result.join(!!useCRLF? "\r\n" : "\n");
        } else {
            throw new SyntaxError("You must provide your two-dimensional array data, like this!\n[ [\"A\", \"B\", \"C\"], [1, 2, 3] ]");
        };
    }
};

/* Part 2: Two-dimensional array-to-HTML converter
 * ===============================================
 * You can use this to convert the parsed CSV data to an HTML table.
 * Usage: arrayToHTML(arr, head)
 * where: ``arr``: This is where you pass the two-dimensional array.
 *        ``head``: If ``true``, the first row would be the table's header, otherwise there would not be any table headers.
 * 
 * > For example:
 *   ```
 *   arrayToHTML([
 *       ["Name","Job","Salary"],
 *       ["Steve","Quality Control","2000"],
 *       ["Alex","Financial Manager","2500"]
 *   ], true)
 *   ```
 *   will output a string of HTML table like this:
 *   ```
 *   "<table><tr><th>Name</th><th>Job</th><th>Salary</th></tr><tr><tr>Steve</tr><tr>Quality Control</tr><tr>2000</tr></tr><tr><tr>Alex</tr><tr>Financial Manager</tr><tr>2500</tr></tr></table>"
 *   ```
 */
function arrayToHTML(arr, head) {
    resultingTable = "<table>";
    for (i = 0; i < arr.length; i = i + 1) {
        resultingRow = "<tr>";
        for (j = 0; j < arr[i].length; j = j + 1) resultingRow = resultingRow + (head == true && i == 0? "<th>" : "<td>") + arr[i][j].toString() + (head == true && i == 0? "</th>" : "</td>");
        resultingRow = resultingRow + "</tr>";
        resultingTable = resultingTable + resultingRow;
    };
    resultingTable = resultingTable + "</table>";
    return resultingTable;
};

/* Part 3: Command-Line Interface
 * ==============================
 * This can also act as a command-line tool that is compatible with both cscript (Windows) and Node.js (all platforms).
 * The purpose of this tool is to convert the CSV to JSON.
 * Here's how it works:
 * 1. Run the script:
 *    a. Windows Script Host:
 *    cscript csv.js [ help | row_number column_number [ file ] ]
 *    b. Node.js:
 *    node csv.js [ help | <row_number> column_number [ file ] ]
 * 
 * 2. Supply the file name.
 *    > For example: Read the file "example.csv":
 *      a. Windows Script Host
 *      cscript csv.js example.csv <row_number column_number
 *      b. Node.js
 *      node csv.js example.csv <row_number column_number
 * 
 * Note:
 * Replace ``_row_number`` with the row number you want to access or get the number of columns of.
 * Replace ``column_number`` with the column you want to access, or omit it if you want to get the 
 * number of columns of the row.
 * The line and value index starts with 0, then 1, 2, 3, and so on.
 * 
 * > For example: Get the 2nd line and the 2nd value on the file example.csv. The file's contents:
 *   a,b,c
 *   d,e,f
 *   g,h,i
 * > You can run:
 *   a. Windows Script Host:
 *   cscript csv.js example.csv 1 1
 *   b. Node.js:
 *   node csv.js example.csv 1 1
 * > The output would be:
 *   e
 */
/* This is the command-line interface. Only declared if it is running on Node.js or WSH (Windows Script Host). */
if (typeof WScript != "undefined" || typeof process != "undefined") (function() {
    /* Polyfills the ``console`` methods for Windows Script Host */
    if (typeof console == "undefined" && typeof WScript != "undefined") console = {
        log: function() {
            if (typeof WScript != "undefined" && WScript.FullName.toString().toLowerCase().indexOf("cscript.exe") != -1) WScript.StdOut.WriteLine(Array.prototype.slice.call(arguments).join(" "))
        },
        error: function() {
            if (typeof WScript != "undefined" && WScript.FullName.toString().toLowerCase().indexOf("cscript.exe") != -1) WScript.StdErr.WriteLine(Array.prototype.slice.call(arguments).join(" "))
        }
    };
    try {
        /* This function can read a file as text. */
        function readFileAsText(filePath, callback, error) {
          if (typeof WScript !== 'undefined') {
              try {
                  var fso = new ActiveXObject("Scripting.FileSystemObject");
                  var file = fso.OpenTextFile(fso.GetAbsolutePathName(filePath), 1, false);
                  var contents = file.ReadAll();
                  file.Close();
                  callback(contents);
              } catch(x) {
                  error(x);
              };
          } else if (typeof require !== "undefined") {
              var fs = require("fs");
              var path = require("path");
              fs.readFile(path.resolve(filePath), "utf8", function(x, y) {
                  if (!!x) {
                      error(x);
                      return;
                  };
                  callback(y);
              });
            } else {
                error(new Error("Only supports Node.js and Windows Script Host."));
            }
        };
        /* This function obtains the arguments given to the script. */
        function getCmdArgs() {
            if (typeof WScript != "undefined" && typeof WScript != "undefined".Arguments) {
                var args = [];
                for (i = 0; i < WScript.Arguments.length; i = i + 1) args.push(WScript.Arguments.Item(i));
                return args;
            } else if (typeof process != "undefined" && typeof process != "undefined".argv) {
                return process.argv.slice(2);
            } else {
                throw new Error("We don't know what kind of environment this script is running on. We only know of Node.js and Windows Script Host.");
            };
        };
        /* This function exits the script with an error code. If none is specified then it will exit with code zero. */
        function exit(code) {
            if (typeof WScript != "undefined") {
                WScript.Quit(!!code? code : 0);
            } else if (typeof process != "undefined") {
                process.exit(!!code? code : 0);
            };
        };
        /* This function prints the help message. */
        function printHelp() {
            console.log(
                "Usage:\r\n" +
                (typeof process != "undefined"? "node " : typeof WScript != "undefined"? "cscript " : "") + 
                "csv.js [ help | [ <file> | - ] [row_number] [column_number] ]\r\n" + 
                "\r\n" + 
                "           help : Displays this help message.\r\n" + 
                "   <row_number> : Specifies the target line index (row). It starts from 0.\r\n" +
                "                  If omitted, it will return the number of rows in the CSV data.\r\n" +
                "<column_number> : Specifies the target value (column). It starts from 0.\r\n" + 
                "                  If omitted, it will return the number of columns in the row.\r\n" +
                "         <file> : A file to read from. If set to a hyphen (-) it will read from stdin.\r\n" +
                "                  (Experimental feature: may break on some cases)\r\n" +
                "\r\n" +
                "This script reads the CSV data from either a file or the standard input.\r\n" +
                "\r\n" +
                "To omit the messages, add \"2>nul\" (for Windows) or \"2>/dev/null\" (for Linux/Unix) at the end of the command.\r\n" 
            );
        };
        args = getCmdArgs();
        if (typeof args[0] != "undefined" && args[0].toLowerCase() == "-?") {
            printHelp()
            exit(0);
        } else if (typeof args[0] != "undefined" /* && typeof args[1] != "undefined" && typeof args[2] != "undefined" */) {
            console.error("Getting data at row " + args[1] + " column " + args[2] + " from " + (args[0] == "-"? "standard input" : "the file " + args[0]) + "...");
            var inputData;
            var lineIndex = args[1];
            var valueIndex = args[2];
            if (args[0] == "-") {
                // Input would be from stdin. May be misbehaved.
                if (typeof WScript != "undefined") {
                    var stdin = WScript.StdIn;
                    while (!stdin.AtEndOfStream) {
                        inputData = stdin.ReadAll();
                        if (stdin.AtEndOfStream) {
                            var unicodeInput = new ActiveXObject("ADODB.Stream");
                            unicodeInput.Charset = "UTF-8";
                            unicodeInput.Open();
                            unicodeInput.WriteText(inputData);
                            unicodeInput.Position = 0;
                            unicodeInput.Type = 2;
                            var results = CSV.parse(unicodeInput.readText());
                            console.log(!!lineIndex && !!valueIndex? results[lineIndex][valueIndex] : !!lineIndex && !valueIndex? results[lineIndex].value : !lineIndex && !valueIndex? results.length : "");
                            exit(0);
                        };
                    };
                } else if (typeof process != "undefined") {
                    process.stdin.setEncoding("utf8");
                    process.stdin.on("data", function(x) {
                        inputData = inputData + x;
                    });
                    process.stdin.on("end", function() {
                        inputtingData = false;
                        data = Buffer.from(inputData, "binary");
                        console.log(!!lineIndex && !!valueIndex? CSV.parse(data.toString("utf-8"))[lineIndex][valueIndex] : !!lineIndex && !valueIndex? CSV.parse(data.toString("utf-8"))[lineIndex].length : !lineIndex && !valueIndex? CSV.parse(data.toString("utf-8")).length : "");
                        exit(0);
                    });
                };
            } else {
                /* Input would be from a file. This is a lot safer to work with.
                 * How to Use This Method Instead:
                 * 1. Redirect the program's CSV output from stdin/stderr to a file.
                 *    If you want to read from an already existing file, skip this step.
                 *    > For example: Echo an example CSV data and redirect it to a file named example.csv:
                 *      echo 1,2,3 > example.csv
                 *    > Note: 1. If you want only stderr, (assuming the echo command outputs to stderr,) use:
                 *               echo 1,2,3 2> example.csv
                 *            2. If you want stdout and stderr combined, use:
                 *               echo 1,2,3 > example.csv 2>&1
                 * 2. Now run this script like this:
                 *    > For example: Get the 2nd column of the 1st row of the CSV data in example.csv:
                 *      a. Windows Script Host
                 *      cscript csv.js example.csv 0 1 
                 *      b. Node.js
                 *      node csv.js example.csv 0 1 
                 * 3. If you don't want it for a long-term use, you may delete it using the command:
                 *    a. Linux/Unix
                 *    rm example.csv
                 *    b. Windows
                 *    del example.csv
                 */
                readFileAsText(args[0].toString(), function (x) {
                    console.log(!!lineIndex && !!valueIndex? CSV.parse(x)[lineIndex][valueIndex] : !!lineIndex && !valueIndex? CSV.parse(x)[lineIndex].length : !lineIndex && !valueIndex? CSV.parse(x).length : "");
                    exit(0);
                }, function(x) {
                    console.error(x.message);
                    exit(1);
                });
            };
        } else {
            printHelp();
            exit(0);
        };
    } catch(x) {
        console.log(x.message.toString());
        exit(1);
    };
})();