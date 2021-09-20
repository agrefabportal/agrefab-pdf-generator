const PDFDocument = require('pdfkit');
const fs = require('fs');

class Pdf {
    doc;
    name = 'Untitled';
    get filePath() {
        return `${this.name}.pdf`
    }
    /**
     * The class represents a pdf document. Saving the pdf creates a new file on the local filesystem. It overwrites an existing file of the same name.
     */
    constructor(name) {
        if (name != undefined) this.name = name;
        this.doc = new PDFDocument({ font: 'fonts/roboto/Roboto-Regular.ttf' })
    }
    /**
     * Save document as a file in the working directory. Overwrites an existing file of the same name
     */
    save() {
        this.doc.pipe(fs.createWriteStream(this.filePath));
        this.doc.end();
    }
}
module.exports = new Pdf();
