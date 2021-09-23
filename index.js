const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * PDFGenerator library specially designed to make guide documents.
 */
class PDFGenerator {
    doc;
    fileName = 'Untitled';
    get filePath() { return `${this.fileName}.pdf` }
    marginTop = 72;
    marginBottom = 72;
    marginLeft = 72;
    marginRight = 72;
    title = 'Untitled';
    body = '';
    numberId = '';
    revisionDate = '';
    effective = '';
    replaces = '';
    version = '';
    /**
     * The class represents a pdf document. Saving the pdf creates a new file on the local filesystem. It overwrites an existing file of the same name.
     */
    constructor(fileName) {
        if (fileName != undefined) this.fileName = fileName;
        this.doc = new PDFDocument({
            font: 'fonts/roboto/Roboto-Regular.ttf'
        });
    }
    /**
     * Save document as a file in the working directory. Overwrites an existing file of the same name
     * @param {String} options Options for creating a guide.
     */
    async saveGuide(text) {
        this.body = text;
        return this.#save();
    }
    /**
     * Make all configurations before saving.
     */
    async #save() {
        return new Promise(function (resolve, reject) {
            try {
                let writeStream = fs.createWriteStream(this.filePath);
                writeStream.on('finish', function () { resolve(); });
                this.doc
                    .fontSize(13)
                    .text(this.title)
                    .fontSize(11)
                    .text(this.body);
                this.doc.pipe(writeStream);
                this.doc.end();
            } catch (error) {
                reject(error);
            }
        }.bind(this));
    }
}
module.exports = PDFGenerator;

