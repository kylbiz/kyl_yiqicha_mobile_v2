var creditStsuts = [
  {key: "1", value: "确立"},
  {key: "2", value: "注销未吊销"},
  {key: "3", value: "注销"}
]

Meteor.startup(function() {
  if(CreditStatus.find().count() === 0) {
    creditStsuts.forEach(function(status) {
      CreditStatus.insert(status);
    })
  }
})
