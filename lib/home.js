$(function(){
	
	window.console.log('Carregando página...');


	$('#formLogin').submit(function(){

		window.console.log('Submetendo formLogin...');

		var elggApi = new ElggAPI(null);

		elggApi.authenticate($('#formLogin input[name=email]').val(), $('#formLogin input[name=password]').val());

		$.getJSON('http://nquestoes.com.br/ajax/view/nquestoes/filter/options?all=true&tipo_filtro=nq_course', function(data){
              $.each(data, function (i, item) {
                  $('#selectMateria').append($('<option>', { 
                      value: item.value,
                      text : item.clean_name 
                  }));
              });
          });

       	$.getJSON('http://nquestoes.com.br/ajax/view/nquestoes/filter/options?all=true&tipo_filtro=nq_university', function(data){
          	$.each(data, function (i, item) {
            	$('#selectBanca').append($('<option>', { 
                	value: item.value,
                  	text : item.clean_name 
              	}));
        	});
      	});
		
		return false;
	});

	$('#formQuestoes').submit(function(){

		window.console.log('Submetendo formQuestoes...');

		chrome.storage.sync.get('accessToken', function(value) {

			window.console.log(value);
			var elggApi = new ElggAPI(value.accessToken);
			elggApi.listQuestions();
			$(this).slideUp();

		});

		return false;
	});

	$('#lkNovaBusca').click(function(){

		$("#ulQuestoes").html('');
		$('#divQuestoes').hide();
		$('#formQuestoes').slideDown();

		return false;
	});
});