const PDFDocument = require('pdfkit');
const fs = require('fs');
const { throws } = require('assert');

/**
 * PDFGenerator library specially designed to make Agrefab guide documents.
 */
class PDFGenerator {
    doc;
    fileName = 'Untitled';
    get filePath() { return `${this.fileName}.pdf` }
    title = 'Untitled';
    introduction = '';
    steps = [];
    author = '';
    approvedBy = '';
    numberId = '';
    revisionDate = '';
    effectiveDate = '';
    replaces = '';
    version = '';
    /**
     * The class represents a pdf document. Saving the pdf creates a new file on the local filesystem. It overwrites an existing file of the same name.
     */
    constructor(fileName) {
        if (fileName != undefined) this.fileName = fileName;
        this.doc = new PDFDocument({
            bufferPages: true,
            font: 'fonts/roboto/Roboto-Regular.ttf',
            margins: {
                top: 122,
                bottom: 50,
                left: 72,
                right: 72
            }
        });
    }
    /**
     * Save document as a file in the working directory. Overwrites an existing file of the same name
     * @param {Object} options Fields
     */
    async saveGuide(options) {
        if (options.introduction) this.introduction = options.introduction;
        if (options.title) this.title = options.title;
        if (options.steps) this.steps = options.steps;
        if (options.author) this.author = options.author;
        if (options.numberId) this.numberId = options.numberId;
        if (options.revisionDate) this.revisionDate = options.revisionDate.substring(0, 15);
        if (options.effectiveDate) this.effectiveDate = options.effectiveDate.substring(0, 15);
        if (options.approvedBy) this.approvedBy = options.approvedBy;
        if (options.replaces) this.replaces = options.replaces;
        if (options.version) this.version = options.version;
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
                // Main document body text
                this.doc
                    .fontSize(15)
                    .text('1. Introduction')
                    .fontSize(11)
                    .text(this.introduction)
                    .text(' ')
                    .fontSize(15)
                    .text('2. Procedure')
                    .fontSize(11)
                for (let index = 0; index < this.steps.length; index++) {
                    this.doc.text(`Step ${index + 1}`)
                    this.doc.text(this.steps[index])
                }
                // Header and footer
                let pages = this.doc.bufferedPageRange();
                for (let i = 0; i < pages.count; i++) {
                    this.doc.switchToPage(i);
                    let oldBottomMargin = this.doc.page.margins.bottom;
                    this.doc.page.margins.bottom = 0 //HACK: Have to remove bottom margin in order to write into it. https://stackoverflow.com/a/59960316/5178499
                    let marginTop = 32;
                    let marginBottom = 72;
                    let marginLeft = 72;
                    let marginRight = 72;
                    this.doc
                        .fontSize(12)
                        .text('Agrefab LLC', marginLeft, marginTop)
                        .fontSize(9)
                        .text(`41-720 KUMUHAU ST, WAIMANALO HI 96795`)
                        .fontSize(8)
                        .text(`Number:`, marginLeft, marginTop + 42)
                        .fontSize(9)
                        .text(this.numberId, marginLeft, marginTop + 54)
                        .fontSize(8)
                        .text(`Title:`, marginLeft + 122, marginTop + 42)
                        .fontSize(9)
                        .text(this.title, marginLeft + 122, marginTop + 54)
                        .fontSize(8)
                        .text(`Revision Date:`, marginLeft + 322, marginTop + 42)
                        .fontSize(9)
                        .text(this.revisionDate, marginLeft + 322, marginTop + 54)
                        .fontSize(8)
                        .text(`Effective:`, marginLeft + 398, marginTop + 42)
                        .fontSize(9)
                        .text(this.effectiveDate, marginLeft + 398, marginTop + 54)
                        .fontSize(8)
                        .text(`Author:`,
                            marginLeft, this.doc.page.height - (oldBottomMargin / 2) - 12
                        )
                        .fontSize(9)
                        .text(`${this.author}`,
                            marginLeft, this.doc.page.height - (oldBottomMargin / 2)
                        )
                        .fontSize(8)
                        .text(`Approved By:`,
                            marginLeft + 128, this.doc.page.height - (oldBottomMargin / 2) - 12
                        )
                        .fontSize(9)
                        .text(`${this.approvedBy}`,
                            marginLeft + 128, this.doc.page.height - (oldBottomMargin / 2)
                        )
                        .fontSize(8)
                        .text(`Replaces:`,
                            marginLeft + 256, this.doc.page.height - (oldBottomMargin / 2) - 12
                        )
                        .fontSize(9)
                        .text(`${this.replaces}`,
                            marginLeft + 264, this.doc.page.height - (oldBottomMargin / 2)
                        )
                        .fontSize(8)
                        .text(`Version:`,
                            marginLeft + 378, this.doc.page.height - (oldBottomMargin / 2) - 12
                        )
                        .fontSize(9)
                        .text(`${this.version}`,
                            marginLeft + 378, this.doc.page.height - (oldBottomMargin / 2)
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

