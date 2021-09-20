const assert = require('assert')
const pdf = require('./index.js');
const fs = require('fs');
const { resolve } = require('path');

(async function main() {
    testPdfGenerator_createsFile();
})().catch(error => console.error(error));

function testPdfGenerator_createsFile() {
    let name = '########TEST########';
    let path = name + '.pdf';
    pdf.create(name, '');
    fs.stat(path, function (err, stat) {
        assert.equal(err, null, 'PDF generator did not create a file or the naming is off.');
    });
    fs.unlink(path, (_) => {
        fs.stat(path, function (err, stat) {
            assert.equal(err.code, 'ENOENT', 'File was not deleted');
        });
    });
}