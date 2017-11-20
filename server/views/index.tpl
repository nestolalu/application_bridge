<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
  </head>
  <body>
    <h2>POC Container</h2>
    <div class="container">
        <button type="button" class="btn btn-primary btn-lg btn-block" onClick="showToast('Hello toast message!')" >Show Toast</button>
        <button type="button" class="btn btn-info btn-lg btn-block" onClick="dropDownAlert('Hello message!')" >Show dropDownAlert</button>
        <button type="button" class="btn btn-primary btn-lg btn-block" onClick="showDialog('Hello dialog!')" >Show Dialog</button>
        <button type="button" class="btn btn-info btn-lg btn-block" onClick="showDatePicker()" >Show datePicker</button>
      </div>
    

    <!-- jQuery first, then Tether, then Bootstrap JS. -->
    <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
  </body>
</html>

<script type="text/javascript">
    function showToast(toast) {
        //Check if webkit is defined --> ios (maybe need to find another way)
        if(typeof webViewBridge !== "undefined" && webViewBridge !== null){
            webViewBridge.send('showToast', toast, function(){console.log('success')},function(){console.log('error')});
        }
        // Check if navigator
        else{
            alert("Not viewing in webview");
        }   
    }
    function dropDownAlert(message) {
        //Check if webkit is defined --> ios (maybe need to find another way)
        if(typeof webViewBridge !== "undefined" && webViewBridge !== null){
            webViewBridge.send('dropDownAlert', message, function(){console.log('success')},function(){console.log('error')});
        }
        // Check if navigator
        else{
            alert("Not viewing in webview");
        }   
    }
    function showDialog(message) {
 
        if(typeof webViewBridge !== "undefined" && webViewBridge !== null){
            webViewBridge.send('showDialog', message, function(){console.log('success')},function(){console.log('error')});
        }
        // Check if navigator
        else{
            alert("Not viewing in webview");
        }   
    }
    function showDatePicker() {
        if(typeof webViewBridge !== "undefined" && webViewBridge !== null){
            webViewBridge.send('showDatePicker', null, function(){console.log('success')},function(){console.log('error')});
        }
        // Check if navigator
        else{
            alert("Not viewing in webview");
        }   
    }


    (function(){
  
      var promiseChain = Promise.resolve();
  
      var promises = {};
      var callbacks = {};
  
     var init = function() {
  
         const guid = function() {
             function s4() {
                 return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
             }
             return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
         }
  
         window.webViewBridge = {
             /**
              * send message to the React-Native WebView onMessage handler
              * @param targetFunc - name of the function to invoke on the React-Native side
              * @param data - data to pass
              * @param success - success callback
              * @param error - error callback
              */
             send: function(targetFunc, data, success, error) {
                 success = success || function(){};
                 error = error || function () {};
  
                 var msgObj = {
                     targetFunc: targetFunc,
                     data: data || {},
                     msgId: guid(),
                 };
  
                 var msg = JSON.stringify(msgObj);
  
                 promiseChain = promiseChain.then(function () {
                     return new Promise(function (resolve, reject) {
                         console.log("sending message " + msgObj.targetFunc);
  
                         promises[msgObj.msgId] = {resolve: resolve, reject: reject};
                         callbacks[msgObj.msgId] = {
                             onsuccess: success,
                             onerror: error
                         };
  
                         window.postMessage(msg);
                     })
                 }).catch(function (e) {
                     console.error('rnBridge send failed ' + e.message);
                 });
             },
  
  
         };
  
         window.document.addEventListener('message', function(e) {
             console.log("message received from react native");
  
             var message;
             try {
                 message = JSON.parse(e.data)
             }
             catch(err) {
                 console.error("failed to parse message from react-native " + err);
                 return;
             }
  
             //resolve promise - send next message if available
             if (promises[message.msgId]) {
                 promises[message.msgId].resolve();
                 delete promises[message.msgId];
             }
  
             //trigger callback
             if (message.args && callbacks[message.msgId]) {
                 if (message.isSuccessfull) {
                     callbacks[message.msgId].onsuccess.apply(null, message.args);
                 }
                 else {
                     callbacks[message.msgId].onerror.apply(null, message.args);
                 }
                 delete callbacks[message.msgId];
             }
  
         });
     };
  
     init();
  }());
        
</script>
