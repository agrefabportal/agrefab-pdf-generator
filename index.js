const PDFDocument = require('pdfkit');
const fs = require('fs');
const { throws } = require('assert');

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
    author = '';
    approvedBy = '';
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
            bufferPages: true,
            font: 'fonts/roboto/Roboto-Regular.ttf'
        });
    }
    /**
     * Save document as a file in the working directory. Overwrites an existing file of the same name
     * @param {String} options Options for creating a guide.
     */
    async saveGuide(text, author) {
        this.body = text;
        this.author = author;
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
                let pages = this.doc.bufferedPageRange();
                for (let i = 0; i < pages.count; i++) {
                    this.doc.switchToPage(i);
                    let oldBottomMargin = this.doc.page.margins.bottom;
                    this.doc.page.margins.bottom = 0 //HACK: Have to remove bottom margin in order to write into it. https://stackoverflow.com/a/59960316/5178499
                    this.doc
                        .fontSize(9)
                        .text(`Page: ${i + 1} of ${pages.count}`, 72, 32, { align: 'right' })
                        .fontSize(10)
                        .text('Agrefab LLC')
                        .fontSize(9)
                        .text(`41-720 KUMUHAU ST 96795 WAIMANALO HAWAII`)
                        .fontSize(8)
                        .text(`Number: Title: Revision Date: Effective:`)
                        .text(`${this.numberId} ${this.revisionDate} ${this.effective} ${this.replaces} ${this.version}`)
                        .text(`Number: Title: Revision Date: Effective:`,
                            72, this.doc.page.height - (oldBottomMargin / 2) - 12
                        )
                        .text(`${this.author} ${this.approvedBy} ${this.replaces} ${this.version} ${this.version}`,
                            72, this.doc.page.height - (oldBottomMargin / 2)
                        )
                        .fontSize(9)
                        .text(`Page: ${i + 1} of ${pages.count}`,
                            this.doc.page.width - 100,
                            this.doc.page.height - (oldBottomMargin / 2),
                            {
                                width: 100,
                                lineBreak: false,
                            }
                        )
                    this.doc.page.margins.bottom = oldBottomMargin; //HACK:  ReProtect bottom margin
                }
                this.doc.pipe(writeStream);
                this.doc.end();
            } catch (error) {
                reject(error);
            }
        }.bind(this));
    }
}
module.exports = PDFGenerator;

