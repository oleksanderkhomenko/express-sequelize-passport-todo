$('#myForm').on('submit', function (event) {
	event.preventDefault();
	var data = {newtodo: $('#newtodo').val()};

	$.ajax({
	  	type: 'POST',
	 	data: JSON.stringify(data),
	  	contentType: 'application/json',
	  	url: 'http://localhost:8080/todo/add',
	  	success: function(data) {
			$('body ul').append('<li><a class="click-element row-'+data.id+'" onclick="deleteRow('+data.id+');">✘</a> '+data.info+' </li>');
	  	}
	});
});

function deleteRow(id) {
  	event.preventDefault();
  	var data = {id: id};
  	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
		contentType: 'application/json',
		url: 'http://localhost:8080/todo/delete',
		success: function(data) {
	  		$('.row-'+id).parent().remove();
		}
  	});
}