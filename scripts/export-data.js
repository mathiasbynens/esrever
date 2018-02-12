var regenerate = require('regenerate');
var fs = require('fs');

var packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf8'));

var unicodePackage = Object.keys(packageInfo.devDependencies).find(function(key) {
	return /^unicode-/.test(key);
});

// All types of combining marks
var combiningMarks = regenerate();
require(unicodePackage).Block.forEach(function(block) {
	if (/^Combining/.test(block)) {
		combiningMarks.add(
			require(unicodePackage + '/Block/' + block + '/code-points.js')
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
	'version': packageInfo.version
};
