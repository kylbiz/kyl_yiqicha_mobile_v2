var Crawler = Meteor.npmRequire('mycrawl').Crawler;
var crawler = new Crawler();

var baseUrl = "http://www.sgs.gov.cn/lz/etpsInfo.do";
var creditOptions =  {
    homeRefererUrl: baseUrl + '?method=index', 
    registrationResultsUrl: baseUrl + '?method=doSearch',
    registrationDetailUrl: baseUrl + '?method=viewDetail' 
  }

var Fiber = Npm.require('fibers');

/**
 * 更新查询企业信用信息或行业信息次数
 */
function SearchTimesPlus(type) {
  SearchTimes.update({
    "type": type
  }, {
    $inc: {
      times: 1
    }
  }, {
    upsert: 1
  }, function(err) {
    if(err) {
      logError("SearchTimesPlus: plus " + type + " search times error.", err);
    } else {
      log("SearchTimesPlus: plus " + type + " search times succeed.");
    }
  })
};


/**
 * 初始化查询关键字记录
 * @param {json} options <sid:String, keywords: String>
 */
function InitSearchRecords(options) {
  if(!options
    || !options.hasOwnProperty("sid")
    || !options.hasOwnProperty("keywords")) {
    log("InitSearchRecords: options illegal.", options);
  } else {
    var sid = options.sid;
    var keywords = options.keywords;
    var insertOptions = {
      "keywords": keywords,
      "sid":sid,
      "ready": false,
      "host": "YQCWX",
      "createTime": new Date()
    }

    if(Meteor.userId() 
      && options.hasOwnProperty("userId") 
      && Meteor.userId() === options.userId) {
      insertOptions.userId = Meteor.userId();
      insertOptions.valid = true;
    }

    SearchRecords.insert(insertOptions, function(err) {
      if(err) {
        logError("InitSearchRecords: save search records: " + keywords + " error.", err);
      } else {
        log("InitSearchRecords: save search records: "+ keywords + " succeed.")
      }
    })
  }
}

/**
 * 更新查询关键字记录
 * @param {json} options 包含如下信息
 * sid: 当前查询的流水
 * keywords: 当前查询的关键字
 * allpageNo: 当前keywords查询到的页数
 * creditNum: 当前keywords查询到的记录条数
 */
function UpdateSearchRecords(options) {
  if(!options
    || !options.hasOwnProperty("sid")
    || !options.hasOwnProperty("keywords")
    || !options.hasOwnProperty("allpageNo")
    || !options.hasOwnProperty("creditNum")) {
    log("UpdateSearchRecords: options illegal.", options);
  } else {
    var sid = options.sid || "";
    var keywords = options.keywords || "";
    var allpageNum = options.allpageNo || 0;
    var creditNum = options.creditNum || 0;

    SearchRecords.update({
      keywords: keywords,
      sid: sid
    }, {
      $set: {
        allpageNum: allpageNum,
        creditNum: creditNum,
        ready: true
      }
    }, function(err) {
      if(err) {
        logError("UpdateSearchRecords: update keywords: " + keywords + " error.", err);
      } else {
        log("UpdateSearchRecords: update keywords: " + keywords + " succeed.");
      }
    })
  }  
}


Meteor.methods({
  "searchCredit": function(options) {
    log("searchCredit: Hi, I am calling.");
    if(!options
      || !options.hasOwnProperty("sid")
      || !options.hasOwnProperty("keywords")) {
      logError("searchCredit: options illegal.", options);
    } else {
      var sid = options.sid;
      var keywords = options.keywords;

      var initRecordOptions = {
        sid: sid,
        keywords: keywords
      };

      if(Meteor.userId() 
        && options.hasOwnProperty("userId")
        && Meteor.userId() === options.userId) {
        initRecordOptions.userId = Meteor.userId();
      }

      // 初始化查询记录
      Meteor._wrapAsync(InitSearchRecords(initRecordOptions));

      // 抓取字段信息
      crawler.searchCompanyInformation(creditOptions, keywords, function(err, results) {
        if(err) {
          logError("searchCredit: search keywords: " + keywords  + " error.", err);
        } else {
          log("searchCredit: search keywords: " + keywords  + " succeed.")

          var allpageNo = results.allpageNo || 0;
          var creditNum = results.numberOfResults;
          var creditLists = results.detailResultsOutputs;

          Fiber(function() {
            UpdateSearchRecords({
              sid: sid,
              keywords: keywords,
              allpageNo: allpageNo,
              creditNum: creditNum
            })

          }).run()

          // 存储查询结果
          if(allpageNo !== 0) {
            creditLists.forEach(function(credit) {
              var company = credit.company; 
              var companyName = company.companyName || "";               
              Fiber(function() {
                Credit.update(company, {
                  $set: {
                    basicDetail: credit.basicDetail,
                    annualCheckLists: credit.annualCheckDetail,
                    updateTime: new Date()
                  }
                }, {
                  upsert: true
                },function(err) {
                  if(err) {
                    logError("searchCredit: save credit: " + companyName + " error.", err);
                  } else {
                    log("searchCredit: save credit: " + companyName + " succeed.")
                  }
                })
              }).run();
            });
            
          }
        }
      });
    }
    SearchTimesPlus("credit");
  }
})



Meteor.methods({
  "getMoreCredit": function(options) {
    log("getMoreCredit: Hi, I am calling.");
    if(!options
      || !options.hasOwnProperty("sid")
      || !options.hasOwnProperty("keywords")
      || !options.hasOwnProperty("nextPage")) {
      logError("getMoreCredit: options illegal.", options);
    } else {
      var sid = options.sid;
      var keywords = options.keywords;
      var nextPage = options.nextPage || 1;

      var record = SearchRecords.findOne({keywords: keywords, sid: sid});

      if(!record 
        || !record.hasOwnProperty("creditNum")
        || !(nextPage <= Math.floor(record.creditNum / 5) + 1)) {
        log("getMoreCredit: nextPage larger than allpageNum.");
        log("nextPage: " + nextPage, "allpageNum: " + (Math.floor(record.creditNum / 5) + 1))
      } else {
        var keywords = options.keywords;
        var allpageNum = record.allpageNum;
        
        // 获取更多企业信用信息
        crawler.getMoreRegistrations(creditOptions, keywords, allpageNum, nextPage, function(err, results) {
          if(err) {
            log("getMoreCredit: get more credit error.", err);
          } else {
            if(!results.hasOwnProperty("detailResultsOutputs")) {
              log("getMoreCredit: get no more credit lists.", results);
            } else {
              var creditLists = results.detailResultsOutputs;
              
              creditLists.forEach(function(credit) {
                var company = credit.company;  
                var companyName = company.companyName || "";            
                Fiber(function() {
                  Credit.update(company, {
                    $set: {
                      basicDetail: credit.basicDetail,
                      annualCheckLists: credit.annualCheckDetail,
                      updateTime: new Date()
                    }
                  }, {
                    upsert: true
                  },function(err) {
                    if(err) {
                      logError("getMoreCredit: save credit: " + companyName + " error.", err);
                    } else {
                      log("getMoreCredit: save credit: " + companyName + " succeed.")
                    }
                  })
                }).run();
              });              
            }
          }
        })
      }
    }   
  }
})
