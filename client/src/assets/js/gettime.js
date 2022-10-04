const moment = require('moment');

const getTime = (type, date) => {
    let timeStr = moment(date).format(type)
    // console.log(timeStr)
    return timeStr;
}

module.exports = getTime
/*
*时间获取模块
*使用方法：
*const getTime = require('./getTime');
*getTime(type, date);

*type: 时间格式
*   YYYY
*   MM
*   DD
*   HH
*   hh
*   mm
*   ss
*   SSS

*date: 时间戳 （不填写即为当前时间）

*   eg: getTime("【YYYY-MM-DD HH:mm:ss.SSS】", 0);     ==>    输出：【1970-01-01 08:00:00.000】
*/