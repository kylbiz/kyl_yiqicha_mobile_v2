// var Crawler = Meteor.npmRequire('mycrawl').Crawler;
// var crawler = new Crawler();

// var baseUrl = "http://www.sgs.gov.cn/lz/etpsInfo.do";
// var creditOptions =  {
//     homeRefererUrl: baseUrl + '?method=index', 
//     registrationResultsUrl: baseUrl + '?method=doSearch',
//     registrationDetailUrl: baseUrl + '?method=viewDetail' 
//   }

// var nameStatusOptions = {
//   targetUrl: 'http://www.sgs.gov.cn/shaic/workonline/appStat!toNameAppList.action'
// };



// CheckUtil = {};


// CheckUtil.checkCreditName = function(checkname, callback) {
//   log("checkCreditName: Hi I am called.")
//   if(!(typeof(checkname) === "string")
//     || !CheckUtil.verifyCheckName(checkname)) {
//     log("checkCreditName: options illegal.", 'checkname: ' + checkname);
//   callback("checkname: " + checkname + " not an legal company name.", null);
//   } else {
//     crawler.searchCompanyInformation(creditOptions, checkname, function(err, results) {
//       if(err) {
//         logError("checkCreditName: search checkname: " + checkname  + " error.", err);
//         callback(err, null);
//       } else {
//         log("checkCreditName: search checkname: " + checkname  + " succeed.")

//         var creditNum = results.numberOfResults || 0;

//         callback(null, {creditNum: creditNum})
//       }
//     });
//   }
// }

// CheckUtil.InitCreditName = function(options, callback) {
//   log("InitCreditName: Hi I am called.")
//   if(!options
//     || !options.hasOwnProperty("checkname")
//     || typeof(options.checkname) !== "string"
//     || !CheckUtil.verifyCheckName(options.checkname)
//     || !options.hasOwnProperty("userId")
//     || options.userId !== Meteor.userId()) {
//     log("InitCreditName: options illegal." + options);
//   callback("InitCreditName: options illegal", null);
//   } else {  
//     var self = this;
//     var checkname = options.checkname || "";
//     var userId = options.userId || "";
//     self.checkCreditName(checkname, function(err, result) {
//       if(err) {
//         log("InitCreditName: get credit information error.", err);
//         callback(err, null);
//       } else {
//         var creditNum = result.creditNum || 0;
//         if(creditNum !== 0) {
//           log("InitCreditName: checkname: " + checkname + " has credit information");

//           CheckName.update({
//             checkname: checkname,
//             userId: userId
//           }, {
//             $set: {
//               nameStatus: "工商已经存在名称为: " + checkname + " 的公司",
//               latestSearchTime: new Date(),
//               searchFinished: true
//             }
//           }, function(err) {
//             if(err) {
//               log("InitCreditName: update checkname: " + checkname + "   status error.", err);
//               callback(err, null);
//             } else {
//               log("InitCreditName: update checkname " + checkname + " succeed.");
//               callback(null, {searchFinished: true})
//             }
//           })
//         } else {

//           crawler.searchCompanyNameStatus(nameStatusOptions, checkname, function(err, statusInfo) {
//             log(arguments);




//           });
//         }
//       }
//     })

//   }
// }
























