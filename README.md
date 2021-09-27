# PDF Generator
NodeJS library for creating PDF documents.

## Installation
`npm i agrefab-pdf-generator`

## How to use
```javascript
const PDFGenerator = require('agrefab-pdf-generator');

let pdf = new PDFGenerator('Untitled');
let introduction = 'Introduction text';
let steps = ['Instructions for step 1', 'Instructions for step 2'];
let numberId = 'SOP-ALL-001';
let revisionDate = '8/9/21';
let effectiveDate = '8/9/21';
let approvedBy = 'email@example.com';
let author = 'email@example.com';
let replaces = '';
let version = 1;
pdf.saveGuide({
        introduction,
        steps,
        author,
        numberId,
        revisionDate,
        effectiveDate,
        approvedBy,
        replaces,
        version,
    });
```
See [tests.js](tests.js) for more examples.

## Usage information
* saveGuide() creates a file on the local filesystem.
* Each PDFGenerator class represents one instance of a PDF. Do not reuse the same object. Create a new instance to rewrite a file.
*  saveGuide() returns a promise, so it executes asychronously.