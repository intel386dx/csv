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