CSV Parser in JavaScript + CLI
==============================

## 1. Introduction

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
