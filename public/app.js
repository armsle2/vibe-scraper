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

	$(document).on('click', '.scrape-button', function(){
		$.get('/scrape', function(data){
			console.log(data)
		})
	})

	$(document).on('click', '.delete-article', function(){
		var articleId = {
			_id: $(this).attr('id')
		}
		$.ajax({
			method: 'DELETE',
			url: '/',
			data: articleId
		}).then(function(data){
			console.log(data)
		})
	})

})