const assert = require('assert')
const PDFGenerator = require('./index.js');
const fs = require('fs');

(async function main() {
    testPdfGenerator_createsFile();
})().catch(error => console.error(error));
/**
 * Test that the pdf generator creates a file on the local filesystem
 */
async function testPdfGenerator_createsFile() {
    let pdf = new PDFGenerator('testPdfGenerator_createsFile');
    pdf.save().then(deleteFile(pdf.filePath));
}
/**
 * Delete file. This inherently also checks if the file exists and other errors in the delete process.
 * @param {string} filePath Path to the file including its name and extension
 */
function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        assert.notEqual(err?.code, 'ENOENT', `There was no file found with the following name: ${filePath}`);
        assert.equal(err, null);
    });
}