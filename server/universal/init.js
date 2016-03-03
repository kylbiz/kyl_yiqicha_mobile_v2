var creditStatus = [
  {key: "1", value: "确立"},
  {key: "2", value: "注销未吊销"},
  {key: "3", value: "注销"}
]

Meteor.startup(function() {
  if(CreditStatus.find().count() === 0) {
    creditStatus.forEach(function(status) {
      CreditStatus.insert(status);
    })
  }
})
