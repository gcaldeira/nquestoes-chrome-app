$(function(){

    jQuery.fn.msg = function(msg) {
   		$('div#msg label').html(msg);
   		$('div#msg').show();
    };
    
});