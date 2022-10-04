const moment = require('moment');

const getTime = (type, date) => {
    timeStr = moment(date).format(type)
    // console.log(timeStr)
    return timeStr;
}

module.exports = getTime
/*
*时间获取模块
*调用方法：
*getTime(String: "YYYY-MM-DD hh:mm:ss", Num: date);

*根据type判定输出格式

*根据date判定输出时间

*/