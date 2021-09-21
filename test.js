const assert = require('assert')
const PDFGenerator = require('./index.js');
const fs = require('fs');

(async function main() {
    testPdfGenerator_createsFile();
    testFileSystemNamingConvention();
})().catch(error => console.error(error));
/**
 * Test that the pdf generator creates a file on the local filesystem
 */
async function testPdfGenerator_createsFile() {
    let pdf = new PDFGenerator('testPdfGenerator_createsFile');
    pdf.save().then(deleteFile(pdf.filePath));
}
/**
 * Test filesystem naming conventions.
 */
async function testFileSystemNamingConvention() {
    let pdf1 = new PDFGenerator();
    assert.equal(pdf1.filePath, 'Untitled.pdf', `Default file name did not match expected.`);
    let name = 'testFileSystemNamingConvention';
    let pdf2 = new PDFGenerator(name);
    assert.equal(pdf2.filePath, name + '.pdf', `File naming convention does not match. Expected filename + .pdf. The pdf has a file path of ${pdf2.filePath}`);
    pdf2.save().then(deleteFile(pdf2.filePath));
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