(function(root) {
	'use strict';

	var noop = Function.prototype;

	var load = (typeof require == 'function' && !(root.define && define.amd)) ?
		require :
		(!root.document && root.java && root.load) || noop;

	var QUnit = (function() {
		return root.QUnit || (
			root.addEventListener || (root.addEventListener = noop),
			root.setTimeout || (root.setTimeout = noop),
			root.QUnit = load('../node_modules/qunitjs/qunit/qunit.js') || root.QUnit,
			addEventListener === noop && delete root.addEventListener,
			root.QUnit
		);
	}());

	var qe = load('../node_modules/qunit-extras/qunit-extras.js');
	if (qe) {
		qe.runInContext(root);
	}

	/** The `esrever` object to test */
	var esrever = root.esrever || (root.esrever = (
		esrever = load('../esrever.js') || root.esrever,
		esrever = esrever.esrever || esrever
	));

	/*--------------------------------------------------------------------------*/

	function forEach(array, fn) {
		var index = -1;
		var length = array.length;
		while (++index < length) {
			fn(array[index]);
		}
	}

	// console.log(reverse('ma\xF1ana'));
	// console.log(reverse('man\u0303ana'));
	// console.log(reverse('\uD834\uDF06'));

	var data = [
		{
			'description': 'Nothing special',
			'input': 'ma\xF1ana',
			'expected': 'ana\xF1am'
		},
		{
			'description': 'Combining mark',
			'input': 'man\u0303ana',
			'expected': 'anan\u0303am'
		},
		{
			'description': 'Multiple combining marks',
			'input': 'foo\u0303\u035C\u035D\u035Ebar',
			'expected': 'rabo\u0303\u035C\u035D\u035Eof'
		},
		{
			'description': 'Astral symbol (surrogate pair)',
			'input': 'foo\uD834\uDF06bar',
			'expected': 'rab\uD834\uDF06oof'
		},
		{
			'description': 'Unpaired surrogates',
			'input': 'foo\uD834bar\uDF06baz',
			'expected': 'zab\uDF06rab\uD834oof'
		},
		{
			'description': 'Astral symbol (surrogate pair) followed by a single combining mark',
			'input': 'foo\uD834\uDF06\u0303bar',
			'expected': 'rab\uD834\uDF06\u0303oof'
		},
		{
			'description': 'Astral symbol (surrogate pair) followed by multiple combining marks',
			'input': 'foo\uD834\uDF06\u0303\u035C\u035D\u035Ebar',
			'expected': 'rab\uD834\uDF06\u0303\u035C\u035D\u035Eoof'
		},
		{
			'description': 'Zalgo',
			'input': 'H\u0339\u0319\u0326\u032E\u0349\u0329\u0317\u0317\u0367\u0307\u030F\u030A\u033EE\u0368\u0346\u0352\u0306\u036E\u0303\u034F\u0337\u032E\u0323\u032B\u0324\u0323 \u0335\u031E\u0339\u033B\u0300\u0309\u0313\u036C\u0351\u0361\u0345C\u036F\u0302\u0350\u034F\u0328\u031B\u0354\u0326\u031F\u0348\u033BO\u031C\u034E\u034D\u0359\u035A\u032C\u031D\u0323\u033D\u036E\u0350\u0357\u0300\u0364\u030D\u0300\u0362M\u0334\u0321\u0332\u032D\u034D\u0347\u033C\u031F\u032F\u0326\u0309\u0312\u0360\u1E1A\u031B\u0319\u031E\u032A\u0317\u0365\u0364\u0369\u033E\u0351\u0314\u0350\u0345\u1E6E\u0334\u0337\u0337\u0317\u033C\u034D\u033F\u033F\u0313\u033D\u0350H\u0319\u0319\u0314\u0304\u035C',
			'expected': 'H\u0319\u0319\u0314\u0304\u035C\u1E6E\u0334\u0337\u0337\u0317\u033C\u034D\u033F\u033F\u0313\u033D\u0350\u1E1A\u031B\u0319\u031E\u032A\u0317\u0365\u0364\u0369\u033E\u0351\u0314\u0350\u0345M\u0334\u0321\u0332\u032D\u034D\u0347\u033C\u031F\u032F\u0326\u0309\u0312\u0360O\u031C\u034E\u034D\u0359\u035A\u032C\u031D\u0323\u033D\u036E\u0350\u0357\u0300\u0364\u030D\u0300\u0362C\u036F\u0302\u0350\u034F\u0328\u031B\u0354\u0326\u031F\u0348\u033B \u0335\u031E\u0339\u033B\u0300\u0309\u0313\u036C\u0351\u0361\u0345E\u0368\u0346\u0352\u0306\u036E\u0303\u034F\u0337\u032E\u0323\u032B\u0324\u0323H\u0339\u0319\u0326\u032E\u0349\u0329\u0317\u0317\u0367\u0307\u030F\u030A\u033E'
		}
	];

	// explicitly call `QUnit.module()` instead of `module()`
	// in case we are in a CLI environment

	// `throws` is a reserved word in ES3; alias it to avoid errors
	var raises = QUnit.assert['throws'];

	QUnit.module('esrever');

	test('reverse', function() {
		forEach(data, function(item) {
			var reversed = esrever.reverse(item.input);
			equal(
				reversed,
				item.expected,
				item.description
			);
			equal(
				esrever.reverse(reversed),
				item.input,
				'Reversing twice: ' + item.description
			);
		});
	});

	/*--------------------------------------------------------------------------*/

	// configure QUnit and call `QUnit.start()` for
	// Narwhal, Node.js, PhantomJS, Rhino, and RingoJS
	if (!root.document || root.phantom) {
		QUnit.config.noglobals = true;
		QUnit.start();
	}
}(typeof global == 'object' && global || this));
