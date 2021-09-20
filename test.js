const assert = require('assert')
const pdf = require('./index.js');
const fs = require('fs');

(async function main() {
    testPdfGenerator_createsFile();
})().catch(error => console.error(error));

function testPdfGenerator_createsFile() {
    let name = '########TEST########';
    let path = name + '.pdf';
    pdf.save();
    fs.stat(path, err => assert.equal(err, null, 'PDF generator did not create a file. If a file was created in the working directory, check the naming convention matches this test.'));
    fs.unlink(path, (_) => {
        fs.stat(path, function (err, stat) {
            assert.equal(err.code, 'ENOENT', 'File was not deleted');
        });
    });
}