/*
 * CSV Parser in JavaScript
 * Licensed under the MIT License
 *
 * Copyright (c) 2023 Hilman Ahwas A.
 *
 * Permission is hereby granted, free of charge, to any person ob-
 * taining a copy  of this  software  and associated documentation 
 * files (the "Software"), to deal in the Software without restri-
 * ction, including  without limitation  the rights to  use, copy, 
 * modify, merge, publish, distribute, sublicense, and/or sell co-
 * pies of the  Software, and to permit persons to  whom the Soft-
 * ware  is furnished to  do so, subject  to the following  condi-
 * tions:
 * 
 * The above copyright notice and this permission notice shall be 
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS  FOR A PARTICULAR  PURPOSE AND NON-
 * INFRINGEMENT. IN NO  EVENT SHALL THE AUTHORS  OR COPYRIGHT HOL-
 * DERS BE LIABLE FOR ANY CLAIM,  DAMAGES OR OTHER LIABILITY, WHE-
 * THER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN  CONNECTION WITH THE SOFTWARE OR  THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 */
// The global CSV object containing methods for converting CSV to multi-dimensional array and vice versa
// Has been successfully tested on Windows Script Host
if (!CSV) var CSV = {};
(function() {
    CSV = {
        // Pass your CSV data as the first argument
        parse: function(csv) {
            if (typeof csv != "undefined") {
                parsedCSVByLine = csv.toString().replace("\r\n", "\n").split("\n");
                parsedCSV = [];
                separator = null;
                explicitSeparator = false;
                separatorSettingRegex = new RegExp("^Sep=(.)$", "i");
                if (separatorSettingRegex.test(parsedCSVByLine[0])) {
                    separator = parsedCSVByLine[0].match(separatorSettingRegex)[1];
                    explicitSeparator = true;
                    console.log("New Delimiter: " + separator);
                } else {
                    explicitSeparator = false;
                };
                for (h = 0; h < parsedCSVByLine.length; h = h + 1) {
                    line = parsedCSVByLine[h].split("");
                    values = [];
                    currentValue = "";
                    withinQuotes = false;
                    for (i = 0; i < line.length; i = i + 1) {
                        var char = line[i];
                        if (char == "\"") {
                            if (line[i + 1] == "\"" && withinQuotes) {
                                currentValue = currentValue + "\"";
                                i = i + 1;
                            } else if (((!explicitSeparator && (line[i + 1] == "," ^ line[i + 1] == ";")) || line[i + 1] == separator) ^ ((!explicitSeparator && (line[i - 1] == "," ^ line[i - 1] == ";")) || line[i - 1] == separator)) withinQuotes = !withinQuotes;
                              else if (!withinQuotes) currentValue = currentValue + "\"";
                        } else if (((!explicitSeparator && (char == "," ^ char == ";")) || char == separator)) {
                            if (withinQuotes) {
                                currentValue = currentValue + (explicitSeparator? separator : "");
                            } else {
                                values.push(currentValue);
                                currentValue = "";
                            };
                        } else currentValue = currentValue + char;
                    };
                    values.push(currentValue);
                    parsedCSV.push(values);
                };
                return parsedCSV;
            } else throw new SyntaxError("You must provide your CSV data, like this!\nA,B,C\n1,2,3")
        },
        // Pass your two-dimensional array as the first argument
        stringify: function(arr, delim, useCRLF) {
            separator = delim;
            if (typeof arr == "object") {
                var result = [];
                if (delim != "," || delim != ";") result.push([("Sep=" + delim)]);
                for (i = 0; i < arr.length; i = i + 1) {
                    resultingLine = [];
                    for (j = 0; j < arr[i].length; j = j + 1) {
                        quote = false;
                        currentValue = arr[i][j].toString();
                        if (currentValue.indexOf(separator) != -1) quote = true;
                        if (quote && currentValue.indexOf("\"") != -1) currentValue = currentValue.replace(/"/g, "\"\"")
                        resultingLine.push(quote? "\"" + currentValue + "\"" : currentValue);
                    };
                    result.push(resultingLine.join(separator));
                };
                return result.join(useCRLF? "\r\n" : "\n");
            } else {
                throw new SyntaxError("You must provide your two-dimensional array data, like this!\n[ [\"A\", \"B\", \"C\"], [1, 2, 3] ]");
            };
        }
    };
})();

// Test #1: Parsing
CSV.parse('a,"b""B""b,b",c"c;c^ddDd');
CSV.parse('a;"b""B""b,b";c"c,c^ddDd');
CSV.parse('Sep=^\na,"b""B""b,b",c"c;c^ddDd');
// Test #2: Stringifying
CSV.stringify([["a", "b", "c"], ["d", "e", "f"]], ",");
CSV.stringify([["a", "b", "c"], ["d", "e", "f"]], ";");
CSV.stringify([["a", "b", "c"], ["d", "e", "f"]], "^");
