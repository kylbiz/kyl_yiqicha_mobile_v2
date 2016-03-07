var creditStatus = [
  {key: "1", value: "确立"},
  {key: "2", value: "注销未吊销"},
  {key: "3", value: "注销"}
]
var Fiber = Npm.require('fibers');

var checkPeriod = 4 * 3600 * 1000;

Meteor.startup(function() {
  if(CreditStatus.find().count() === 0) {
    creditStatus.forEach(function(status) {
      CreditStatus.insert(status);
    })
  }

  CheckUtil.maintainName(); 

  setInterval(function() {
    Fiber(function() {
      CheckUtil.maintainName();    
    }).run();
  }, checkPeriod)


})
