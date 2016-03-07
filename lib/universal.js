log = function(info) {
  console.log('--------------------');
  for(var i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}


verifyKeywords = function(keywords) {
  if (!typeof (keywords) === "string" || keywords.length < 2) {
    return false;
  } else {
    return true;
  }
};