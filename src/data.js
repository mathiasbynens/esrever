var regenerate = require('regenerate');
var fs = require('fs');

// Start with all Unicode code points
var any = regenerate.range(0x000000, 0x10FFFF);

// Disallow combining marks
// Using Unicode 6.2.0 blocks: http://unicode.org/Public/6.2.0/ucd/Blocks.txt
var combiningMarks = regenerate.ranges([
	[0x0300, 0x036F], // Combining Diacritical Marks
	[0x1DC0, 0x1DFF], // Combining Diacritical Marks Supplement
	[0x20D0, 0x20FF], // Combining Diacritical Marks for Symbols
	[0xFE20, 0xFE2F]  // Combining Half Marks
]);

// All code points except those that map to combining marks
var allExceptCombiningMarks = regenerate.difference(any, combiningMarks);

module.exports = {
	'combiningMarks': regenerate.fromCodePoints(combiningMarks),
	'allExceptCombiningMarks': regenerate.fromCodePoints(allExceptCombiningMarks),
	'highSurrogates': regenerate.fromCodePointRange(0xD800, 0xDBFF),
	'lowSurrogates': regenerate.fromCodePointRange(0xDC00, 0xDFFF),
	'version': JSON.parse(fs.readFileSync('package.json', 'utf8')).version
};
