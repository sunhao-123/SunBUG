const gettime = require('./gettime')
const fs = require('fs')
const path = require('path')
require('draftlog').into(console)

let logline = 20

let logArr = []
let updateArr = []
let line = logline //固定显示的行数
const consolelog = (type, log) => {
    let typeStr = type == 1 ? "\033[40;32m[INFO]   \033[0m" : type == 2 ? "\033[40;33m[WARNING]\033[0m" : type == 3 ? "\033[40;31m[ERROR]  \033[0m" : "\033[40;34m[UNKNOWN]\033[0m"
    let newLog = '\033[40;32m[' + `${gettime("YYYY/MM/DD HH:mm:ss.SSS")}` + ']\033[0m' + typeStr + log
    if (logArr.length < line) {
        logArr.push(newLog)
        updateArr.push(console.draft(newLog))
    } else {
        logArr.shift()
        logArr.push(newLog)
        for (let i = 0; i < line; i++) {
            updateArr[i](logArr[i])
        }
    }
}

module.exports = consolelog

/*
*固定日志模块
*使用方法：
*const consolelog = require('./consolelog');
*consolelog(type, log);

*type: 日志模式
*   1:[INFO]
*   2:[WARNING]
*   3:[ERROR]
*   其他:[UNKNOWN]

*log: 日志内容

*   eg: consolelog(1, "日志信息");     ==>    输出：[2022/03/04 13:05:37.873][INFO]   日志信息
*/