CSV Parser in JavaScript + CLI
==============================

## 1. Introduction

### 1.1. What is CSV?

CSV is an acronym for Comma-Separated Values. The comma-separated values is the columns, while the lines is the row, so it's a very open structured data format that any program including Excel can read.

If the value would contain a comma, we must enclose the value between two quotation marks (like this: ``A,"A,B",C``). To escape the quotation mark, use two adjacent quotation marks (``A,"B""b""B",C`` will be parsed into ``[['A', 'B"b"B', 'C']]``).

### 1.2. About this Library

This is a CSV parser and stringifier library, with plus features:
1. Two-dimensional array to HTML table conversion function
2. Command-line interface for Node.js and Windows Script Host

## 2. Usage

To use this library for web apps, simply download [``csv_core.js``](https://raw.githubusercontent.com/intel386dx/csv/main/csv_core.js) and copy its contents to your script.
To use this library as a command-line tool, [install Node.js](https://nodejs.org/) first. Then download [``csv.js``](https://raw.githubusercontent.com/intel386dx/csv/main/csv.js) and run it.

> **Note:** For Windows users, you can also run this script with Windows Script Host by following these steps:
> 1. Hold Shift and right-click an empty area on the file explorer window showing the directory where ``csv.js`` is at. **On Windows 11,** you don't have to hold the Shift button.
> 2. **On Windows 11:** Click _**Open Terminal**_ to summon Windows Terminal. **On another versions,** click _**Open command window here**_ or _**Open PowerShell window here**_ to summon Command Prompt or PowerShell.
> 3. You can run the script from there.

### 2.1. The CSV object

This script creates a new object called ``CSV`` that contains ``parse()`` and ``stringify()`` methods.

#### 2.1.1. ``parse(_csv_)``

This method parses the CSV data from the ``_csv_`` argument. The method returns a two-dimensional array based on the CSV data.

> ## Example:
> Parse the CSV data below:
> 
> ```csv
> A,B,C
> 1,2,3
> 4,5,6
> ```
> 
> We can run:
> ```javascript
> CSV.parse("A,B,C\n1,2,3\n4,5,6")
> ```
>
> It should output:
> ```javascript
> [["A","B","C"],["1","2","3"],["4","5","6"]]
> ```

### 2.1.2. ``stringify(arr, useSemiColons, useCRLF)``

This method converts a two-dimensional JavaScript array from the ``arr`` argument into a CSV data. If you set ``useSemiColons`` to ``true``, it will replace the comma with a semicolon as the delimiter. If you set ``useCRLF`` to ``true``, it will use CRLF line break sequence for use in various platforms.

> ## Example:
> Parse the two-dimensional array below:
> 
> ```csv
> [["A","B","C"],["1","2","3"],["4","5","6"]]
> ```
> 
> We can run:
> ```javascript
> CSV.parse([["A","B","C"],["1","2","3"],["4","5","6"]])
> ```
>
> It should output:
> ```javascript
> "A,B,C\n1,2,3\n4,5,6"
> ```

## 2.2. Two-dimensional array-to-HTML converter

Two-dimensional array-to-HTML converter lets you convert the parsed CSV data to an HTML table for visualization.

To use it, call the function ``arrayToHTML(arr, head)``, taking the ``arr`` parameter as where you will have to pass your two-dimensional array. If you set ``head`` to ``true``, this will make the very first row the table header.

> ## Example:
> Parse the two-dimensional array below:
> 
> ```csv
> [["A","B","C"],["1","2","3"],["4","5","6"]]
> ```
> 
> We can run:
> ```javascript
> arrrayToHTML([["A","B","C"],["1","2","3"],["4","5","6"]])
> ```
>
> It should output:
> ```javascript
> "<table><tr><tr>A</tr><tr>B</tr><tr>C</tr></tr><tr><tr>1</tr><tr>2</tr><tr>3</tr></tr><tr><tr>4</tr><tr>5</tr><tr>6</tr></tr></table>"
> ```
>
> The resulting table should be like:
> |   |   |   |
> |---|---|---|
> | A | B | C |
> | 1 | 2 | 3 |
> | 4 | 5 | 6 |