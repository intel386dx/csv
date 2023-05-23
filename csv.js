// The global CSV object containing methods for converting CSV to multi-dimensional array and vice versa
// Has been successfully tested on Windows Script Host
var CSV = {
    // Pass your CSV data as the first argument
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
                    if (char == "\"") {
                        if (line[i + 1] === "\"" && withinQuotes) {
                            currentValue = currentValue + "\"";
                            i = i + 1;
                        } else {
                            withinQuotes = !withinQuotes;
                        };
                    } else if (char === "," && !withinQuotes) {
                        values.push(currentValue);
                        currentValue = "";
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
    // Pass your two-dimensional array as the first argument
    stringify: function(arr) {
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
                result.push(resultingLine.join("\,"));
            };
            return result.join("\n");
        } else {
            throw new SyntaxError("You must provide your two-dimensional array data, like this!\n[ [\"A\", \"B\", \"C\"], [1, 2, 3] ]");
        };
    }
};
// You can use this to convert the parsed CSV data to an HTML table.
// Pass the parsed CSV data to the first argument. If you want table headers then add ``true`` as the second argument.
function arrayToHTML(arr, head) {
    var resultingTable = "<table>";
    for (i = 0; i < arr.length; i = i + 1) {
        var resultingRow = "<tr>";
        for (j = 0; j < arr[i].length; j = j + 1) resultingRow = resultingRow + (head == true && i == 0? "<th>" : "<tr>") + arr[i][j].toString() + (head == true && i == 0? "<th>" : "</tr>");
        resultingRow = "</tr>";
        resultingTable = resultingTable + resultingRow;
    };
    resultingTable = "</table>";
    return resultingTable;
};

/* This can also act as a command-line tool that is compatible with both cscript (Windows) and Node.js (all platforms).
 * The purpose of this tool is to convert the CSV to JSON.
 * Here's how:
 * 1. Run the script:
 *    a. Windows Script Host:
 *    cscript csv.js [ help | row_number column_number [ file ] ]
 *    b. Node.js:
 *    node csv.js [ help | row_number column_number [ file ] ]
 * 
 * 2. Supply the file name.
 *    a. Windows Script Host
 *    cscript csv.js row_number column_number file
 *    b. Node.js
 *    node csv.js row_number column_number file
 * 
 * Note:
 * Replace ``line_index`` with the line index you want to access.
 * Replace ``value_index`` with the value index you want to access.
 * The line and value index starts with 0, then 1, 2, 3, and so on.
 * 
 * For example: 
 * > Get the 2nd line and the 2nd value on the file example.csv. The file's contents:
 *   a,b,c
 *   d,e,f
 *   g,h,i
 * > You can run:
 *   a. Windows Script Host:
 *   cscript csv.js 1 1 example.csv
 *   b. Node.js:
 *   node csv.js 1 1 example.csv
 * > The output would be:
 *   e
 */
if (typeof WScript != "undefined" || typeof process != "undefined") (function() {
    // Polyfills the ``console`` methods for Windows Script Host
    if (typeof console == "undefined" && typeof WScript != "undefined") console = {
        log: function() {
            if (typeof WScript != "undefined" && WScript.FullName.toString().toLowerCase().indexOf("cscript.exe") != -1) WScript.StdOut.WriteLine(Array.prototype.slice.call(arguments).join(" "))
        },
        error: function() {
            if (typeof WScript != "undefined" && WScript.FullName.toString().toLowerCase().indexOf("cscript.exe") != -1) WScript.StdErr.WriteLine(Array.prototype.slice.call(arguments).join(" "))
        }
    };
    try {
    	// This function can read a file as text.
        function readFileAsText(filePath, callback, error) {
		  if (typeof WScript !== 'undefined') {
			  try {
		          var fso = new ActiveXObject("Scripting.FileSystemObject");
			      var file = fso.OpenTextFile(filePath, 1, false);
			      var contents = file.ReadAll();
			      file.Close();
			      callback(null, contents);
			  } catch(x) {
				  error(x);
			  };
		  } else if (typeof require !== "undefined") {
		      var fs = require("fs");
		      var path = require("path")
		      fs.readFile(path.resolve(filePath), "utf8", function(x, y) {
		          if (!!x) {
		              error(x);
		              return;
		          };
		          callback(y);
		      });
		    } else {
		        callback(new Error("Only supports Node.js and Windows Script Host."));
		    }
		};
        // This function obtains the arguments given to the script.
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
        // This function exits the script with an error code.
        function exit(code) {
            if (typeof WScript != "undefined") {
                WScript.Quit(!!code? code : 0);
            } else if (typeof process != "undefined") {
                process.exit(!!code? code : 0);
            };
        };
        // This function prints the help message.
        function printHelp() {
            console.log(
                "Usage\r\n" +
                "csv.js [ help | row_number column_number [ file ] ]\r\n" + 
                "\r\n" + 
                "         help : Displays this help message.\r\n" + 
                "   row_number : Specifies the target line index (row). It starts from 0.\r\n" +
                "column_number : Specifies the target value (column). It starts from 0.\r\n" + 
                "         file : A file to read from. If empty it will read from stdin." +
                "                (Experimental feature: may break on Windows Script Host)\r\n" +
                "\r\n" +
                "This script reads the CSV data from standard input.\r\n"
            );
        };
        args = getCmdArgs();
        if (typeof args[0] != "undefined" && args[0].toLowerCase() == "help") {
            printHelp()
            exit(0);
        } else if (typeof args[0] != "undefined" && !!args[1]) {
            console.error("Getting data at " + args.join(",") + "...");
            var inputData;
            var lineIndex = args[0];
            var valueIndex = args[1];
            if (args[2] == "undefined") {
	            if (typeof WScript != "undefined") {
	                var stdin = WScript.StdIn;
	                while (!stdin.AtEndOfStream) {
	                    inputData = inputData + stdin.ReadLine();
	                    if (stdin.AtEndOfStream) {
	                        console.log(CSV.parse(inputData)[lineIndex][valueIndex]);
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
	                    console.log(CSV.parse(inputData)[lineIndex][valueIndex]);
	                    exit(0);
	                });
	            };
            } else {
            	readFileAsText(args[2].toString(), function (x) {
            	    console.log(CSV.parse(x)[lineIndex][valueIndex]);
	                exit(0);
                }, function(x) {
                	console.log(x.toString());
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