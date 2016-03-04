Credit = new Mongo.Collection("Credit");

SearchTimes = new Mongo.Collection("SearchTimes");

SearchRecords = new Mongo.Collection("SearchRecords");

CreditStatus = new Mongo.Collection("CreditStatus");

UserCode = new Mongo.Collection("UserCode");

// Messages: 消息Collection, 有如下结构：
// from : 消息来源
// toUserId: 消息接收对象userId
// toUserName: 消息接收对象userName
// title: 消息标题
// subtitle: 消息子标题
// summary: 消息摘要
// type: 消息类型，目前有三种： system(系统消息), checkname(核名消息), kylnotify(开业啦推送),
// detail: 消息详细内容
// removed: 消息是否被移除
// createTime: 消息发送时间
Messages = new Mongo.Collection("Messages");

CheckName = new Mongo.Collection("CheckName");