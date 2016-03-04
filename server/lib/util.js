log = function(info) {
  console.log("--------------------------");
  console.log("Time: " + new Date())
  for(var i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}

logError = function(info) {
  console.error("--------------------------");
  console.error("Time: " + new Date());
  for(var i = 0; i < arguments.length; i++) {
    console.error(arguments[i]);
  }
}


//----------------------------------------------------

verifyPhone = function(phone) {
  var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
  if(!phoneReg.test(phone)) {
    return false;
  } else {
    return true;
  }
} 

// var url = 'http://192.168.1.142:8003/WordGenerator?wsdl';
// var args = {name: 'value'};

// try {
//   var client = Soap.createClient(url);
//   var result = client.wordPosition(args);
//   console.log(client)
//   console.log(result);
// }
// catch (err) {
//   console.log(err)
//   if(err.error === 'soap-creation') {
//     console.log('SOAP Client creation failed');
//   }
//   else if (err.error === 'soap-method') {
//     console.log('SOAP Method call failed');
//   }

// }