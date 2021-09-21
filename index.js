const PDFDocument = require('pdfkit');
const fs = require('fs');

class PDFGenerator {
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
    async saveTextFile(text) {
        return new Promise(function (resolve, reject) {
            try {
                let writeStream = fs.createWriteStream(this.filePath);
                writeStream.on('finish', function () { resolve(); });
                this.doc.text(text, 50, 50);
                this.doc.pipe(writeStream);
                this.doc.end();
            } catch (error) {
                reject(error);
            }
        }.bind({ filePath: this.filePath, doc: this.doc }));
    }
    /**
     * Save document as a file in the working directory. Overwrites an existing file of the same name
    * BUG: Resolves before file is finished c 
    */
    async saveEmptyFile() {
        return new Promise(function (resolve, reject) {
            try {
                let writeStream = fs.createWriteStream(this.filePath);
                writeStream.on('finish', function () { resolve(); });
                this.doc.pipe(writeStream);
                this.doc.end();
            } catch (error) {
                reject(error);
            }
        }.bind({ filePath: this.filePath, doc: this.doc }));
    }
}
module.exports = PDFGenerator;
