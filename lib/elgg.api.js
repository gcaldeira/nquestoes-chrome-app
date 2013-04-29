function msg(msg) {
    $('div#msg label').html(msg);
    $('div#msg').show();
}

var ElggAPI = function(accessToken) {
  
  this.accessToken = accessToken;
  this.baseURL = 'http://nquestoes.com.br/services/api/rest/json';

  this.getMethod = function(method, params, callback){
  
    var data = { method: method};

    if(this.accessToken){
      data.auth_token = this.accessToken;
    }

  	$.extend(params, data);
  	$.getJSON(this.baseURL, params, callback);
  
  };

  this.postMethod = function(method, params, callback){
  	var data = { method: method};
    
    if(this.accessToken){
      data.auth_token = this.accessToken;
    }
  	
    $.extend(params, data);

    $.ajax({
            url: this.baseURL,
            type: 'post',
            dataType: 'json',
            success:callback,
            data: params
    });
  };

  this.authenticate = function(username, password) {
  	var params = {username: username, password: password};

    window.console.log('Autenticando');
  	
    this.postMethod('auth.gettoken', params, function(data){
      if(data.status == 0){

        chrome.storage.sync.set({accessToken:data.result}, function() {
          
          msg('Entrou.');
          
          $('#formLogin').slideUp();
          $('#formQuestoes').slideDown();

        });

      }else{
        msg('Login inválido');
      }
  		window.console.log(data);
  	});
  };

  this.listQuestions = function(){
      $("#divQuestoes").html('<ul id="ulQuestoes"></ul>');
      this.getMethod('nquestoes.listquestions', {item:1}, function(data){
            
            $.each(data.result, function(i, q){
              console.log(q);
              var content = "<li><form class='answer'><span class='enunciado'>" + q.title + "<span>";
              content += "<input type='hidden' value='" + q.guid + "' name='guid' />";
              for(var j=0; j<q.options.length; j++){
                var op = String.fromCharCode(j+65);
                content += "<label><input type='radio' name='option' value='" + op + "' />" + op + ') ' + q.options[j] + "</label>";
              }
              content += "<button type='submit' class='btn btn-success'><i class='icon-ok'></i>Responder</button></form></li>";
              $("#ulQuestoes").append(content);
            });

            $('form.answer').submit(function(){

              window.console.log('Submetendo formAnswer...');
              
              var params = {option:$(this).find('input[name=option]').val(), guid: $(this).find('input[name=guid]').val()};
              var form = $(this);

              chrome.storage.sync.get('accessToken', function(value) {

                var elggApi = new ElggAPI(value.accessToken);
                
                window.console.log(params);
                elggApi.postMethod('nquestoes.answer', params, function(data){
                  if(data.result.result){
                    form.addClass('right');
                  }else{
                    form.addClass('wrong');
                  }
                });
              });

              return false;
            });

            $('#ulQuestoes').bxSlider({easing:'linear', adaptiveHeight: true, slideWidth: 380});

      });
  }
}