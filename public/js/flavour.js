define(['util'], function (util) {

	var flavour = {
		closeIssue: [
			'You, sir, are a genius.', 'Die issues, die!', '*golf clap*',
			'Ω ♥ you.', 'You deserve a break.',
			'Not bad, not bad at all.', 'FTW!'
		]
	}

	function apply(key, text) {
		if (flavour[key]) {
			return text + ' ' + util.getRandomItem(flavour[key]);
		}
		return text;
	}

	return apply;

});
