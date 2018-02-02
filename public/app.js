$(function(){
	$(this).scrollTop(0);
	$(document).on('click', '.save-article', function(){
		var article = {
			title: $(this).data('title'),
			link: $(this).data('link'),
			image: $(this).data('image')
		}
		$.post('/saved', article, function(data){
			location.reload();
		})
	})

	$(document).on('click', '#scrape-button', function(){
		$.get('/scrape', function(data){
			location.reload();
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
			location.reload();
		})
	})

	$(document).on('click', '.view-notes', function(){
		var articleId = $(this).attr('id');

			$.get(`/articlenotes/${articleId}`, function(data){
				console.log(data)
				$('.notes').html('');
				data.note.forEach((results, index)=>{
					var noteCollapsibles = `
            		<div>
            			<button class="panel panel-default panel-heading collapsed" data-toggle="collapse" data-target="#${results._id}" aria-expanded="false">${results.title}</button>
            			<div id="${results._id}" class="collapse" aria-expanded="false" style="height: 0px;">
	            			<div class="note-body">
	            				<p>${results.body}</p>
	            			</div>
            			</div>
            		</div>`;
            		$('.notes').append(noteCollapsibles);
				})
				$('#add-note').data('id', data._id);
				var articleId = $('#add-note').data('id');
				$('#add-note-button').on('click', function(){
					var note = {
						title: $('#note-title').val().trim(),
						body: $('#note-body').val().trim(),
						articleId: articleId
					}
					$.post('/articlenotes', note, function(data){
						console.log(data);
						location.reload();
					})
				})
					
			})
	})

	
})