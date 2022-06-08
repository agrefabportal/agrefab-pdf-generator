const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
/**
 * PDFGenerator library specially designed to make Agrefab guide documents.
 */
class PDFGenerator {
    doc;
    fileName = 'Unvarietyd';
    get filePath() { return `documents/${this.fileName}.pdf` }
    variety = 'Unvarietyd';
    variety01 = 'Fingers';
    variety02 = 'Mothers';
    introduction = '';
    steps = [];
    tools = [];
    author = '';
    approvedBy = '';
    numberId = '';
    revisionDate = '';
    effectiveDate = '';
    replaces = '';
    version = '';
    searchSummary = '';
    locationReadable = '';
    locationBarcode = '';
    variety = '';
    productImage = '';
    productFingersBarcode = '';
    productMothersBarcode = '';
    quantity = '';
    finishedLot = '';
    consumedLots = [];
    productionId = '';
    /**
     * The class represents a pdf document. Saving the pdf creates a new file on the local filesystem. It overwrites an existing file of the same name.
     */
    constructor(fileName) {
        if (fileName != undefined) this.fileName = fileName;
    }
    async saveBarcode(options) {
        if (options?.location) this.location = options.location;
        this.doc = new PDFDocument({
            bufferPages: true,
            font: 'fonts/varela round/VarelaRound-Regular.ttf',
            size: 'LETTER',
            margins: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            layout: 'landscape'
        });
        if (options?.title) this.title = options.title;
        if (options?.variety) this.variety = options.variety;
        if (options?.finishedLot) this.finishedLot = options.finishedLot;
        if (options?.consumedLots) this.consumedLots = options.consumedLots;
        if (options?.locationReadable) this.locationReadable = options.locationReadable;
        if (options?.quantity) this.quantity = options.quantity;
        if (options?.productImage) this.productImage = options.productImage;
        if (options?.productionId) this.productionId = options.productionId;
        return new Promise(async function (resolve, reject) {
            try {
                await this.#createDocumentDirectoryIfEmpty().catch(error => { throw error; });
                let writeStream = fs.createWriteStream(this.filePath);
                writeStream.on('finish', _ => resolve()).on('error', error => { throw error; });
                this.doc
                    .font(path.join(__dirname, 'fonts', 'varela round', 'VarelaRound-Regular.ttf'))
                    .fontSize(24)
                    .text(this.title, 128, 12, { width: 268, align: 'center' })
                if (this.productionId.length > 0) {
                    this.doc.image(path.join(process.cwd(), 'documents', `${this.productionId}.png`), 12, 12, { height: 100, align: 'center', valign: 'center' })
                }
                this.doc
                    .fontSize(12)
                    .text('Scan to open in Odoo', 12, 120, { width: 116, align: 'center' })
                    .fontSize(24)
                    .text(this.variety, 300, 160, { height: 68, valign: 'center' })
                    .fontSize(13)
                    .text('TOTAL REQUEST', 0, 236, { width: 120, align: 'center' })
                    .fontSize(24)
                    .text(this.quantity, 0, 270, { width: 120, align: 'center' })
                    .fontSize(13)
                    .text('FIELD CLEANED FINGERS LBS', 120, 236, { width: 138, align: 'center' })
                    .fontSize(13)
                    .text('FIELD CLEANED MOTHERS LBS', 240, 236, { width: 138, align: 'center' })
                this.doc.image(path.join(process.cwd(), 'documents', `${this.finishedLot}.png`), 12, 160, { height: 60, align: 'center', valign: 'center' })
                for (let index = 0; index < this.consumedLots.length; index++) {
                    let rowHeight = 316 + index * 74;
                    const lot = this.consumedLots[index];
                    var tempLot = lot.lot;
                    const location = tempLot.substring(6, 8);
                    const field = tempLot.substring(tempLot.indexOf('F') + 1, tempLot.indexOf('R'));
                    const row = tempLot.substring(tempLot.indexOf('F') + 1, tempLot.indexOf('R'));
                    this.doc.image(path.join(process.cwd(), 'documents', `${lot.lot}.png`), 12, rowHeight, { height: 60, align: 'center', valign: 'center' })
                        .fontSize(13)
                        .text(`${location.toUpperCase()} FIELD ${field} ROW ${row}  PLANTED FT`, 280, rowHeight, { width: 120, align: 'center' })
                        .fontSize(24)
                        .text(lot.quantity, 280, rowHeight + 30, { width: 120, align: 'center' })
                }
                this.doc.pipe(writeStream);
                this.doc.end();
            } catch (error) {
                reject(error);
            }
        }.bind(this));
    }
    /**
     * Save document as a file in the working directory. Overwrites an existing file of the same name
     * @param {Object} options Fields
     */
    async saveGuide(options) {
        this.doc = new PDFDocument({
            bufferPages: true,
            font: 'fonts/roboto/Roboto-Regular.ttf',
            margins: {
                top: 110,
                bottom: 72,
                left: 72,
                right: 72
            }
        });
        if (options?.introduction) this.introduction = options.introduction;
        if (options?.variety) this.variety = options.variety;
        if (options?.steps) this.steps = options.steps;
        if (options?.author) this.author = options.author;
        if (options?.numberId) this.numberId = options.numberId;
        if (options?.revisionDate) this.revisionDate = options.revisionDate.substring(0, 15);
        if (options?.effectiveDate) this.effectiveDate = options.effectiveDate.substring(0, 15);
        if (options?.approvedBy) this.approvedBy = options.approvedBy;
        if (options?.replaces) this.replaces = options.replaces;
        if (options?.version) this.version = options.version;
        if (options?.searchSummary) this.searchSummary = options.searchSummary;
        if (options?.tools) this.tools = options.tools;
        if (options?.guidePhoto) this.guidePhoto = options.guidePhoto;
        return this.#save();
    }
    async #createDocumentDirectoryIfEmpty() {
        return new Promise((resolve, reject) => {
            fs.mkdir('documents', { recursive: true }, (err) => {
                if (err) { reject(err); } else { resolve(); }
            });
        });
    }
    /**
     * Make all configurations before saving.
     */
    async #save() {
        return new Promise(async function (resolve, reject) {
            let marginTop = 38;
            let marginBottom = 72;
            let marginLeft = 72;
            let marginRight = 72;
            let imageHeight = 140;
            try {
                await this.#createDocumentDirectoryIfEmpty().catch(error => { throw error; });
                let writeStream = fs.createWriteStream(this.filePath);
                writeStream.on('finish', _ => resolve()).on('error', error => { throw error; });
                this.doc
                    .font('fonts/roboto/Roboto-Black.ttf')
                    .fontSize(22)
                    .text('Agrefab', { align: 'center' })
                    .font('fonts/roboto/Roboto-Bold.ttf')
                    .moveDown(.2)
                    .fontSize(20)
                    .text(this.variety, { align: 'center' })
                    .font('fonts/roboto/Roboto-Bold.ttf')
                    .moveDown(.5)
                    .fontSize(16)
                    .text(this.searchSummary, { align: 'center' })
                    .font('fonts/roboto/Roboto-Medium.ttf')
                    .fontSize(16)
                    .text(`Written By: ${this.author}`, { align: 'center' });
                if (this.guidePhoto) {
                    this.doc.image(`photos/${this.guidePhoto}`, 12, 240, { fit: [586, 400], align: 'center', valign: 'center' })
                }
                this.doc.addPage()
                    .font('fonts/roboto/Roboto-Bold.ttf')
                    .fontSize(16)
                    .moveDown(1)
                    .text('Introduction')
                    .moveDown(.5)
                    .font('fonts/roboto/Roboto-Regular.ttf')
                    .fontSize(12)
                    .text(this.introduction)
                    .moveDown(1.5)
                    .font('fonts/roboto/Roboto-Bold.ttf')
                    .fontSize(14)
                    .text('Tools:')
                    .moveDown(.5)
                    .font('fonts/roboto/Roboto-Regular.ttf')
                    .fontSize(12);
                for (let index = 0; index < this.tools.length; index++) {
                    this.doc.text(this.tools[index]);
                }
                this.doc
                    .font('fonts/roboto/Roboto-Regular.ttf')
                    .fontSize(12)
                for (let index = 0; index < this.steps.length; index++) {
                    this.doc.addPage()
                        .rect(12, 100, 588, 40)
                        .fill('#DD7E43')
                        .stroke()
                        .fillColor("#181818")
                        .font('fonts/roboto/Roboto-Bold.ttf')
                        .fontSize(18)
                        .text(`Step ${index + 1} — ${this.steps[index].variety}`, this.doc.x, 110);
                    if (this.steps[index].photos) {
                        for (let index2 = 0; index2 < this.steps[index].photos.length; index2++) {
                            this.doc.image(`photos/${this.steps[index].photos[index2]}`,
                                12, 6 + imageHeight + (imageHeight * index2) + (8 * index2),
                                { fit: [200, imageHeight], align: 'center', valign: 'center' });
                        }
                    }
                    this.doc.font('fonts/roboto/Roboto-Regular.ttf')
                        .fontSize(12)
                        .text('', 220, imageHeight + 6)
                        .text(this.steps[index].stepDescription)
                    if (this.steps[index].stepBullets) {
                        for (let index3 = 0; index3 < this.steps[index].stepBullets.length; index3++) {
                            this.doc.fillColor("black")
                                .text(this.steps[index].stepBullets[index3][3])
                                .moveDown(1)
                        }
                    }
                }
                let pages = this.doc.bufferedPageRange();
                for (let i = 0; i < pages.count; i++) {
                    this.doc.switchToPage(i);
                    let oldBottomMargin = this.doc.page.margins.bottom;
                    this.doc.page.margins.bottom = 0 //HACK: Have to remove bottom margin in order to write into it. https://stackoverflow.com/a/59960316/5178499
                    let headerItemWidth1 = 100;
                    let headerItemWidth2 = 100;
                    let headerItemWidth3 = 100;
                    let headerItemWidth4 = 100;
                    let footerBaseline = this.doc.page.height - oldBottomMargin + 18
                    var tableStartY = 0;
                    if (i == 0) {
                        tableStartY = marginTop + 24
                        this.doc
                            .font('fonts/roboto/Roboto-Bold.ttf')
                            .fontSize(10)
                            .text('Agrefab LLC', marginLeft, marginTop)
                            .font('fonts/roboto/Roboto-Regular.ttf')
                            .fontSize(8)
                            .text(`41-720 Kumuhau St, Waimanalo HI 96795`)
                    } else {
                        tableStartY = marginTop;
                    }
                    this.doc
                        .rect(marginLeft, marginTop + 24, 122, 32)
                        .stroke()
                        .text('') // HACK: Text margin top needs to be reset or Number: is lower than expected
                        .font('fonts/roboto/Roboto-Regular.ttf')
                        .fontSize(7)
                        .text(`Number:`, marginLeft + 6, marginTop + 30)
                        .font('fonts/roboto/Roboto-Bold.ttf')
                        .fontSize(10)
                        .text(this.numberId, marginLeft + 6, marginTop + 40, {
                            width: 110,
                            height: 20,
                            lineBreak: false
                        })
                        .font('fonts/roboto/Roboto-Medium.ttf')
                        .rect(marginLeft + 122, marginTop + 24, 192, 32)
                        .stroke()
                        .font('fonts/roboto/Roboto-Medium.ttf')
                        .fontSize(7)
                        .text(`variety:`, marginLeft + 128, marginTop + 30)
                        .fontSize(10)
                        .font('fonts/roboto/Roboto-Bold.ttf')
                        .text(this.variety, marginLeft + 128, marginTop + 40, {
                            width: 180,
                            height: 20,
                            lineBreak: false,
                        })
                        .rect(marginLeft + 314, marginTop + 24, 78, 32)
                        .stroke()
                        .font('fonts/roboto/Roboto-Medium.ttf')
                        .fontSize(7)
                        .text(`Revision Date:`, marginLeft + 322, marginTop + 30)
                        .fontSize(10)
                        .font('fonts/roboto/Roboto-Bold.ttf')
                        .text(this.revisionDate, marginLeft + 322, marginTop + 40, {
                            width: 66,
                            height: 20,
                            lineBreak: false
                        })
                        .rect(marginLeft + 392, marginTop + 24, 78, 32)
                        .stroke()
                        .font('fonts/roboto/Roboto-Medium.ttf')
                        .fontSize(7)
                        .text(`Effective:`, marginLeft + 398, marginTop + 30)
                        .fontSize(10)
                        .font('fonts/roboto/Roboto-Bold.ttf')
                        .text(this.effectiveDate, marginLeft + 398, marginTop + 40, {
                            width: 66,
                            height: 20,
                            lineBreak: false
                        })
                        .rect(marginLeft, footerBaseline, 128, 32)
                        .stroke()
                        .font('fonts/roboto/Roboto-Regular.ttf')
                        .fontSize(7)
                        .text(`Author:`, marginLeft + 6, footerBaseline + 6)
                        .font('fonts/roboto/Roboto-Medium.ttf')
                        .fontSize(8)
                        .text(`${this.author}`, marginLeft + 6, footerBaseline + 16, {
                            width: 128,
                            height: 20,
                            lineBreak: false
                        })
                        .rect(marginLeft + 128, footerBaseline, 128, 32)
                        .stroke()
                        .font('fonts/roboto/Roboto-Regular.ttf')
                        .fontSize(7)
                        .text(`Approved By:`, marginLeft + 134, footerBaseline + 6)
                        .font('fonts/roboto/Roboto-Medium.ttf')
                        .fontSize(8)
                        .text(`${this.approvedBy}`, marginLeft + 134, footerBaseline + 16, {
                            width: 128,
                            height: 20,
                            lineBreak: false
                        })
                        .rect(marginLeft + 256, footerBaseline, 92, 32)
                        .stroke()
                        .font('fonts/roboto/Roboto-Regular.ttf')
                        .fontSize(7)
                        .text(`Replaces:`, marginLeft + 262, footerBaseline + 6)
                        .font('fonts/roboto/Roboto-Medium.ttf')
                        .fontSize(8)
                        .text(`${this.replaces}`, marginLeft + 262, footerBaseline + 16, {
                            width: 128,
                            height: 20,
                            lineBreak: false
                        })
                        .rect(marginLeft + 348, footerBaseline, 48, 32)
                        .stroke()
                        .font('fonts/roboto/Roboto-Regular.ttf')
                        .fontSize(7)
                        .text(`Version:`, marginLeft + 354, footerBaseline + 6)
                        .font('fonts/roboto/Roboto-Medium.ttf')
                        .fontSize(8)
                        .text(`${this.version}`, marginLeft + 354, footerBaseline + 16, {
                            width: 48,
                            height: 20,
                            lineBreak: false
                        })
                        .rect(marginLeft + 396, footerBaseline, 70, 32)
                        .stroke()
                        .font('fonts/roboto/Roboto-Regular.ttf')
                        .text('Page ', marginLeft + 402, footerBaseline + 12, {
                            continued: true,
                            baseline: -7.5
                        })
                        .font('fonts/roboto/Roboto-Bold.ttf')
                        .fontSize(10)
                        .text(`${i + 1}`, {
                            continued: true,
                            baseline: -8
                        })
                        .font('fonts/roboto/Roboto-Regular.ttf')
                        .fontSize(8)
                        .text(' of ', {
                            continued: true,
                            baseline: -7.5
                        })
                        .font('fonts/roboto/Roboto-Bold.ttf')
                        .fontSize(10)
                        .text(`${pages.count}`, {
                            continued: true,
                            baseline: -8
                        });
                    this.doc.page.margins.bottom = oldBottomMargin; //HACK: Re-protect bottom margin
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

