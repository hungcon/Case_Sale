$(function() {
	$('.color--arrow').click(function(event) {
		$('.ShopBy__button').slideToggle();
		$('.icon1').toggleClass('d-none');
		$('.icon2').toggleClass('d-none');
	});
	$('.color-selection').click(function(event) {
		var color = $(this).data('color');
		var trangthai = color;
		console.log(color);
		if(color == 'all'){
			$('.Casies--List .row').isotope({ filter: '*' });
		}else  {
			$('.Casies--List .row').isotope({ filter: color });
		}
		return false;
	});
});

