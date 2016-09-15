require(["jquery/jquery.reveal"], function () {

	$(document).ready(function () {

		// Show help modal on the help button click
		$('#linkHelp').click(function (e) {
			e.preventDefault();
			$('#linkHelpModal').reveal();
			_gaq.push(['_trackEvent', "Help", "Rollover", $(this).attr('data-old-url')]);
		});

		// Back button click event
		$('#toolsTitleBarBackButton').click(function (e) {
			//e.preventDefault();
			navigateTo($(this).attr('data-back-count'), $(this).attr('data-label-key'), $(this).attr('data-postfix'));
		});

		// Tools ddl change event
		$('#ddToolsTitleBar').change(function (e) {
			var loc = $(this).val() || "";
			if (loc != "") {
				window.location = loc;
			}
		});
	});

	// Navigates back in browser history
	function navigateTo(siteno, backButtonLabel, postfix, siteurl) {
		window.history.go(siteno);
		document.cookie = "BackButton_" + postfix + "=goBackCount=1&backButtonLabel=" + backButtonLabel;
		return false;
	}

});