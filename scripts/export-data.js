var regenerate = require('regenerate');
var fs = require('fs');

var packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// TODO: Use `Array#find` for this as soon as it lands in V8/Node
var unicodePackage = Object.keys(packageInfo.devDependencies).filter(function(key) {
	return /^unicode-/.test(key);
})[0];

// All types of combining marks
var combiningMarks = regenerate();
require(unicodePackage).blocks.forEach(function(block) {
	if (/^Combining/.test(block)) {
		combiningMarks.add(
			require(unicodePackage + '/blocks/' + block + '/code-points')
		);
	}
});

// All code points except those that map to combining marks
var allExceptCombiningMarks = regenerate()
	.addRange(0x000000, 0x10FFFF)
	.remove(combiningMarks.toArray());

module.exports = {
	'combiningMarks': combiningMarks.toString(),
	'allExceptCombiningMarks': allExceptCombiningMarks.toString(),
	'highSurrogates': regenerate.fromCodePointRange(0xD800, 0xDBFF),
	'lowSurrogates': regenerate.fromCodePointRange(0xDC00, 0xDFFF),
	'version': packageInfo.version
};
