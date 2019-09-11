$(function() {
	$('.product-title').click(function(event) {
		$('.product-text').slideToggle();
		$('.icon1').toggleClass('fa-plus');
	});
});