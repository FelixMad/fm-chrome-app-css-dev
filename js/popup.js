
$(document).ready(function(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { $("#url").val(tabs[0].url) });

    $('#we-precarga').hide();

    window['webseries'] = JSON.parse(localStorage.getItem("datawebseries"));

  $("#we-accordion").accordion({collapsible: true,create: function(event,ui) {eventoTituloAcordeon()}});
  
  $("#name").focus(function(){
    var element = $(this);
    valoresInicio();
    activaSiquientesCampos(element);
    focusWebserie(element,devuelveItemWebserie);
  });

  $('#articTitle').focus(function(){
    var element = $(this);
    activaSiquientesCampos(element);
  });

  $("#webserieWES").focus(function(){
    var element = $(this);
    activaSiquientesCampos(element);
    focusWebserie(element,devuelveItemWES);
  });

  $(".we-bt-aceptar").click(function(){
    validateForm()
  });

  cargaLogData()
  cargaLang()
});

function devuelveItemWebserie(item,element){
  imprWeListCapitulos(buscaCapitulosWebserie(item.idW));
  imprPrevisionCapitulo(buscaCapitulosWebserie(item.idW)[0]);
}

function devuelveItemWES(item,element){
  $("#idW").val(item.idW);
  $("#name").val(item.label);
  buscaDistribucionDeWebserie(item.idW);
  var wes = JSON.parse(localStorage.getItem("datawes"));
  (buscaWES(item.idW,wes)) ? $('#wes').attr('checked','checked') : $('#wes').removeAttr('checked');
}

function cargaLogData(){
  var enlaces = JSON.parse(localStorage.getItem("dataenlaces"));
  var reverseEnlaces = enlaces.reverse();
  for(i=0;i<5;i++){
    $('#logData').append('<li><small>'+reverseEnlaces[i].name+'</small></li>');
  }
}

function valoresInicio(){
  $("#kind").val('we#enlaceWebserie');
  $('#season').val(1);
  $('#chapter').val(1);
  $('#part').val(1);
}

function eventoTituloAcordeon(){
  $('#we-accordion a.we-section-title').click(function(){
    desactivarCampos()
  });

  $('#we-section-enlaceWebserie a.we-section-title').click(function(){

  });
  $('#we-section-enlaceArticulo a.we-section-title').click(function(){
    cargaBlogCategorias();
    $("#kind").val('we#enlaceArticulo');
  });
  $('#we-section-adminWES a.we-section-title').click(function(){
    $("#kind").val('we#adminWES');
  });
}


function cargaBlogCategorias(){
  var element = $('select#tipoNoticia');
  element.find('option').remove();
  element.append('<option/>');
	var blogCategorias = JSON.parse(localStorage.getItem("datablogCategorias"));
  for(i in blogCategorias){element.append('<option value="'+ blogCategorias[i].label +'">'+ blogCategorias[i].label +'</option>') };
  element.change(function(){
    var str = "";
    element.find("option:selected").each(function() {
      str += $( this ).val();
    });
    $("#category").val( str );
  }).change();
}
function activaSiquientesCampos(element){
  element.parents('.we-section').find('.we-disabled').addClass('we-enabled').removeClass('we-disabled')
  element.parents('.we-section').find('input,button,select').removeAttr('disabled');
}
function desactivarCampos(){
  $('.we-section input').val('');
  $('.we-section option').remove();
  $('#we-list-capitulos').html('');
  $('.we-enabled').addClass('we-disabled').removeClass('we-enabled');
  $('input.we-disabled,button.we-disabled,select.we-disabled').attr('disabled','disabled');
}


function focusWebserie(element,callback){
    element.autocomplete({
    source: webseries,
    select: function( event, ui ) {
      element.val(ui.item.label);
      callback(ui.item,element)
      return false;
    }
  }).data( "autocomplete" )._renderItem = function( ul, item ) {
    return $( "<li></li>" ).data( "item.autocomplete", item ).append( "<a>" + item.label + "</a>" ).appendTo( ul );
  }; 
}



function imprPrevisionCapitulo(string){
  var season = string.replace(/^.*:\s(\d{1,2})x(\d{1,3})\s#(\d{1})$/,'$1');
  var chapter = string.replace(/^.*:\s(\d{1,2})x(\d{1,3})\s#(\d{1})$/,'$2');
  var part = string.replace(/^.*:\s(\d{1,2})x(\d{1,3})\s#(\d{1})$/,'$3');

  $('#season').val(season);
  $('#chapter').val(Number(chapter)+1);
  $('#part').val(1);
}

function imprWeListCapitulos(arr){
  $('#we-list-capitulos').show();
  for(i in arr){ $('#we-list-capitulos ul').append('<li>'+ arr[i]+'</li>') }
}

function buscaDistribucionDeWebserie(id){
  var $select = $('select#distribucion')
  var $option = $select.find('option');
  var servidores = JSON.parse(localStorage.getItem("dataservidores"));
  var distribucion = JSON.parse(localStorage.getItem("datadistribucion"));
  var aDistribucion = new Array();
  $option.remove();
  var datadistribucion
  for($i in distribucion){
    if(distribucion[$i].idW == id) $('#distribucion').append('<option value="'+ distribucion[$i].idD +'">'+ distribucion[$i].distribucion + ' ('+ buscaServidor(distribucion[$i].idS,servidores) +')</option>');
  };
  $select.change(function(){
    var str = "";
    $select.find("option:selected").each(function() {
      str += $( this ).val();
    });
    $("#idD").val(str);
  }).change();
}

function buscaCapitulosWebserie(idW){
  var capitulos = JSON.parse(localStorage.getItem("datacapitulos"));
  var arr = new Array();
  for(i in capitulos){ if(capitulos[i].idW == idW) arr.push(capitulos[i].titleOrder)}
  return arr.sort().reverse();
}

function buscaWES(idW,wes){
  for(i in wes){
    if(wes[i]['idW'] == idW) return wes[i]['idWES']
  }
}

function buscaServidor(id,servidores){
  for(i in servidores){
    if(servidores[i]['idS'] == id) return servidores[i]['server']
  }
}

function validateForm(){
  $("#alert").show();
  $('#enviar').attr('disabled','disabled');
  var $respons = $.ajax({
    type: "post",

    url: urlPost,
    dataType: 'json',
    data: {
      "entry.1655199218": $("#name").val(),
      "entry.499296553" : ($("#wsTitle").val())?'"'+$("#wsTitle").val()+'"':'',
      "entry.348826115" : $("#season").val(),
      "entry.950399632" : $("#chapter").val(),
      "entry.1354545818": $("#part").val(),
      "entry.314533266" : $("#genre").val(),
      "entry.571992267" : $("#idW").val(),
      "entry.75792442"  : $("#idD").val(),
      "entry.1185674008": $("#mail").val(),
      "entry.920659638" : ($("#wes").prop("checked"))?true:false,
      "entry.416360471" : $("#articTitle").val(),
      "entry.1875929347": $("#category").val(),
      "entry.185593958" : $("#url").val(),
      "entry.145575713" : $("#kind").val()
    },
    complete: function() {
      $('input,select,textarea').val('');
      window.close();
    },
    success: function(data) {
      $("#alert").text("Enviado");
    },
    error: function (statusText) {
      $("#alert").text("Error");
    }
  });
}