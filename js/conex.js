function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth,1);
}

function checkAuth() {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult && !authResult.error) {
    authorizeButton.style.display = 'none';
    makeApiCall();
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}

function makeApiCall() {
  gapi.client.load('drive', 'v2', function() {

    var request = gapi.client.drive.files.list();

    request.execute(function(resp) {
      console.log(resp);
      //moveData(resp,name)
    })
  });
}

function moveData(resp,name){
  if(!localStorage.getItem("dateData"+name)) storeDateData(name,resp.modifiedDate)
  if(localStorage.getItem("dateData"+name) != resp.modifiedDate || !localStorage.getItem("data"+name)) {
    storeDateData(name,resp.modifiedDate);
    downloadFile(name,resp,responseText);
  }
}

function storeDateData(name,modifiedDate){
  localStorage.setItem("dateData"+name,modifiedDate) 
}
function responseText(name,responseText){
  localStorage.setItem("data"+name,responseText);
  //expulsaData(name);
}

function expulsaData(name){
  /*$('#we-precarga').hide();
  window[name] = JSON.parse(localStorage.getItem("data"+name));*/
}

function downloadFile(name,file,callback) {
  if (file.downloadUrl) {
    var accessToken = gapi.auth.getToken().access_token;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file.downloadUrl);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.onload = function() {
      callback(name,xhr.responseText);
    };
    xhr.onerror = function() {
      callback(null);
    };
    xhr.send();
  } else {
    callback(null);
  }
}
