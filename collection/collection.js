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

// CheckName: 用户提交用户核名的公司名称,包含如下参数
// checkname: 用户提交的公司名称
// userId: 提交公司名称的用户ID
// nameStatus: 当前查询checkname查询结果
// removed: 用户是否清除查询
// messageNotify: 是否短信通知用户
// searchedTimes: 当前查询该 checkname 的次数
// beginSearchTime: 初始一次查询时间节点
// latestSearchTime: 最后一次查询时间节点
// searchFinished: 是否查询结束

CheckName = new Mongo.Collection("CheckName");