const PDFDocument = require('pdfkit');
const fs = require('fs');

class Pdf {
    /**
     * Generate PDF documents
     */
    constructor() {

    }
    /**
     * Create test document
     * @param {string} filePath Path where the file will be saved. Relative to the working directory.
     */
    create(name, data) {
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(`${name}.pdf`));
        doc.font('fonts/roboto/Roboto-Regular.ttf')
            .fontSize(25)
            .text(data, 100, 100);
        doc.end();
    }
}
module.exports = new Pdf();