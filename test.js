const assert = require('assert');
const fs = require('fs');
const PDFGenerator = require('./index.js');
const PDFParser = require('pdf2json');
var MOCK_TEXT_LONG = `1.1 Purpose\nTitle:\nAssurance GDS\nRevision Date:\nEffective:\nMM/DD/YY\n    Describe the rationale for this particular document (ensure, describe, control). State the intention/objective of the process/procedure.\nNote: You know you’ve written a solid purpose statement when you can combine the policy statement and the purpose to form a logical what (policy) and why (purpose).\n1.2 Scope\nWhen and to whom the process/procedure applies.\nWho is affected, which areas, which activities, what are the limits (parameters for applying process/procedure).\n1.3 Roles\nList the role and functions of anyone involved in the process/procedure.\nUse verbs and nouns to describe the functions\n1.4 Definitions and Acronyms\nList definitions and acronyms that need to be defined in order to ensure proper interpretation of the process or procedure.\n1.5 References\n1.5.1 Standards\nList the standards (Audit, governing body etc) used to create the process/procedure.\n1.5.2 Forms\nList any logs or records associated with this procedure/document.\n    1.5.3 Equipment\n2. Procedure\n2.1\nAuthor\n[AUTHOR]\nProcedure\nApproved by:\n[APPROVER]\nReplaces: Version\nPage 1 of 3\n    1.0\n    \n    Company Logo Address\nNumber:\nSOP-ALL-\n2.2\n2.3\n3. Review\nTitle:\nAssurance GDS\nRevision Date:\nEffective:\nMM/DD/YY\n    Desc.\nStep 1 , Step 2 .\nProcedure\nDesc.\nStep 1 . Step 2 .\nProcedure\nDesc.\nStep 1 . Step 2 .\n    4. Nomenclature of Documents PROC - DEPT - #\nPROC:\nDOC- (Documents) Programs, Policies etc\nFORM- Logs, anything that needs filling in/completion SOP- Standard Operating Procedures\nWI- Work Instructions\nHACCP- HACCP Documents\n#: (Number)\nThree digit number, if documents are related use same first digit and sequential third digits.\nHACCP documents are numbered as follows and can include a letter to signify the specific flow chart.\n100 Product Description\nAuthor Approved by: Replaces: Version\n[AUTHOR] [APPROVER]\n    1.0\nPage 2 of 3\n    \nCompany Logo Address\nNumber: Title:\nSOP-ALL- Assurance GDS\n200 Hazard Analysis 300 Flow Chart\n400 HACCP Plan\nDOCUMENT NUMERATION:\n0##- Miscellaneous\n100- Quality Control\n200- Sanitation\n300- GMP/continuous improvement 400- Allergen Control\n500- Foreign Material Control 600- Recall and Traceability 700- Food Defense/ Emergency 800- Product Protection\n900- Supplier Approval\nRevision Date:\nEffective:\nMM/DD/YY\n    \n\n\n                    `;
var MOCK_TEXT_SHORT = `Cleaning microwave dryer is necessary for sanitation, elimination cross contamination (i.e. between different crops and Cert Organic and Non Cert Organic), and most importantly safety.
If residues are left to build up inside microwave cabinet or on electronics there is a chance of FIRE in the unit. This is prevented through following this Standard Cleaning Procedure
Underlying method: get all material on to the floor or sucked up in vacuum, then clean the floor, and sanitize the conveyor belt and sled.
Report anything out of place or in need of maintenance to Kevin, please take a photo if possible`;
(async function main() {
    Promise.all([
        testSaveGuideCreatesFile(),
        testPdfNamingConvention(),
        testAddText(),
        testHeaderAndFooter(),
        testSaveGuide_formatsRequiredFields(),
        testImageOptions_addsImage(),
    ]).then(_ => console.log('🏖  All tests passed. ✅'));
})().catch(error => console.error(error));
/**
 * Add image
 */
async function testImageOptions_addsImage() {
    let pdf = new PDFGenerator('testSaveGuide_formatsRequiredFields');
    let introduction = MOCK_TEXT_SHORT;
    let steps = [{
        title: 'Microwave Settings for cleaning',
        images: ['image.jpeg', 'image.jpeg', 'image.jpeg', 'image.jpeg',],
        text: ['insure microwave dryer power is shut down before starting to clean', 'Power Key: OFF position', 'System power Light OFF', 'AC System: OFF, Fan: AUTO', 'Make a note of what time Cleaning was started']
    }, {
        title: 'Microwave Settings for cleaning',
        images: [],
        text: []
    }];
    let numberId = 'SOP-ALL-001';
    let revisionDate = 'Wed Sep 01 2021 1W8:e2d4:S5e4p 01 GMT-1000 (Hawaii-2A0le2u1ti1a8n:24:54 Standard Time)';
    let effectiveDate = 'Wed Sep 01 2021 1W8:e2d4:S5e4p 01 GMT-1000 (Hawaii-2A0le2u1ti1a8n:24:54 Standard Time)';
    let approvedBy = 'kevin@agrefab.com';
    let author = 'f.samis@agrefab.com';
    let replaces = '';
    let version = 1;
    let tools = ['18v Milwaukee Blower (1)', '18v Back Pack Vacuum - Milwaukee (1)', 'Short Duster Broom (1)'];
    let guideImage = 'image.jpeg';
    let searchSummary = 'SOP for cleaning microwave dryer';
    await pdf.saveGuide({
        introduction,
        steps,
        author,
        numberId,
        revisionDate,
        effectiveDate,
        approvedBy,
        replaces,
        version,
        guideImage,
        searchSummary,
        tools,
    });
    await deleteFile(pdf.filePath);
}
/**
 * Create file with all options. Requires visual inspection, so the file is not deleted by default.
 */
async function testSaveGuide_formatsRequiredFields() {
    let pdf = new PDFGenerator('testSaveGuide_formatsRequiredFields');
    let introduction = MOCK_TEXT_LONG;
    let steps = ['Instructions for step 1', 'Instructions for step 2'];
    let numberId = 'SOP-ALL-001';
    let revisionDate = 'Wed Sep 01 2021 1W8:e2d4:S5e4p 01 GMT-1000 (Hawaii-2A0le2u1ti1a8n:24:54 Standard Time)';
    let effectiveDate = 'Wed Sep 01 2021 1W8:e2d4:S5e4p 01 GMT-1000 (Hawaii-2A0le2u1ti1a8n:24:54 Standard Time)';
    let approvedBy = 'kevin@agrefab.com';
    let author = 'f.samis@agrefab.com';
    let replaces = '';
    let version = 1;
    await pdf.saveGuide({
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
    await deleteFile(pdf.filePath);
}
/**
 * Test there is a header and footer on every page.
 */
async function testHeaderAndFooter() {
    let pdf = new PDFGenerator('testSaveGuide_addsHeaderAndFooter');
    await pdf.saveGuide({
        introduction: MOCK_TEXT_LONG,
        author: 'n.bass@agrefab.com',
        numberId: 'SOP-ALL-001',
    });
    await checkForHeaderAndFooter();
    await deleteFile(pdf.filePath);
    async function checkForHeaderAndFooter() {
        return new Promise((resolve, reject) => {
            let pdfParser = new PDFParser();
            pdfParser.on('pdfParser_dataError', errData => reject(errData.parserError));
            pdfParser.on('pdfParser_dataReady', async pdfData => {
                pdfData.formImage.Pages.forEach((element, index) => {
                    let expectedMatches = [
                        'n.bass@agrefab.com',
                        'SOP-ALL-001'
                    ]
                    let matchesPerPage = element.Texts.filter((element, index, array) => {
                        let lineOfText = decodeURIComponent(element.R[0].T);

                        if (lineOfText.includes('n.bass@agrefab.com') || lineOfText.includes('SOP-ALL-001'))
                            return element;
                    });
                    assert.equal(matchesPerPage.length, 2, `There was no text matching header and footer on page ${index + 1}. There was a total of ${matchesPerPage.length} matches. There were ${expectedMatchNumber} expected matched.`)
                });
                resolve();
            });
            pdfParser.loadPDF('testSaveGuide_addsHeaderAndFooter.pdf');
        });
    }
}
/**
 * Test pdf generator creates a file on the local filesystem. @function deleteFile contains test assertions.
 */
async function testSaveGuideCreatesFile() {
    let pdf = new PDFGenerator('testPdfGenerator_createsFile');
    await pdf.saveGuide();
    // await deleteFile(pdf.filePath);
}
/**
 * Saving a guide with options should create a file with more text than a file without options.
 */
async function testAddText() {
    let pdf1 = new PDFGenerator('testPdfGenerator_createsFile1');
    await pdf1.saveGuide();
    let pdf2 = new PDFGenerator('testPdfGenerator_createsFile2');
    await pdf2.saveGuide({ introduction: '🌮' });
    assert.equal(fs.statSync('testAddText.pdf').size < fs.statSync('testAddText.pdf').size, true, 'The empty file is not smaller than the file with text. Check that there is text in testAddText.pdf.');
    await Promise.all([
        deleteFile(pdf1.filePath),
        deleteFile(pdf2.filePath)
    ]);
}
/**
 * Naming conventions for saving the PDF.
 */
async function testPdfNamingConvention() {
    let pdf1 = new PDFGenerator();
    assert.equal(pdf1.filePath, 'Untitled.pdf', `Default file name did not match expected. PDF file name: ${pdf1.fileName} and file path: ${pdf1.filePath}`);
    let name = 'testFileSystemNamingConvention';
    let pdf2 = new PDFGenerator(name);
    assert.equal(pdf2.filePath, name + '.pdf', `File naming convention does not match. Expected filename + .pdf. The pdf has a file path of ${pdf2.filePath}`);
    await pdf2.saveGuide();
    await deleteFile(pdf2.filePath);
}
/**
 * Delete file on the local filesystem. This inherently also checks if the file exists. Assertions are made during the delete process.
 * @param {string} filePath Relative path to the file including its name and extension.
 */
async function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            assert.notEqual(err?.code, 'ENOENT', `There was no file found with the following name: ${filePath}`);
            assert.equal(err, null);
            console.log(`📄🗑 ${filePath} was created and deleted. Comment out @function deleteFile() to keep the file.`);
            resolve();
        });
    });
}
