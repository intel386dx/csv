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
