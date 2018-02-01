$(function(){
	$(this).scrollTop(0);
	$(document).on('click', '.save-article', function(){
		var article = {
			title: $(this).data('title'),
			link: $(this).data('link'),
			image: $(this).data('image')
		}
		$.post('/saved', article, function(data){
			console.log(data);
			location.reload();
		})
	})

})