const fs = require('fs-extra');
const getTime = require('./gettime')
const consolelog = require('./consolelog')

const writelog = (path, type, log) => {
    let newLogFilePath = path.replace(".log", `${getTime("_YYYYMMDD")}.log`)

    /* 路径按"/"拆分，截取出文件夹路径 Start */
    let patharr = path.split("/")
    patharr.pop()
    let folderpath = patharr.join("/")
    /* 路径按"/"拆分，截取出文件夹路径 End*/


//                        +'_'+    @'_'@     @^_^@        +'v'+    

    //自动创建文件夹（fs-extra功能，原生fs没有此功能）
    fs.ensureDir(folderpath, (err) => {
        if (err) {
            throw err
        } else {
            if (log === "start") {
                fs.writeFile(
                    newLogFilePath,
                    "==============================" + getTime("【YYYY-MM-DD】") + "==============================" + "\r\n" +
                    getTime("【YYYY-MM-DD HH:mm:ss.SSS】") + "【INFO】   服务启动成功！" + "\r\n",
                    { flag: "a" },
                    (error) => {
                        if (!error) return;
                        consolelog(3, "日志写入出错" + error);
                    }
                );
            } else {
                let flag = type === 1 ? "【INFO】   " : type === 2 ? "【WARNING】" : type === 3 ? "【ERROR】  " : type === 4 ? "【NET】 " : type === 5 ? "【SQL】 " : "【UNKNOWN】"
                fs.writeFile(
                    newLogFilePath,
                    getTime("【YYYY-MM-DD HH:mm:ss.SSS】") + flag + log + "\r\n",
                    { flag: "a" },
                    (error) => {
                        if (!error) return;
                        consolelog(3, "日志写入出错" + error);
                    }
                );
            }
        }
    })
}

module.exports = writelog
/*
*日志存储模块
*使用方法:
*
*引入模块:
*const writelog = require('./writelog');
*
*记录日志
*writelog(String: "日志文件路径", Number: 1/2/3/4, String: "日志内容");
*
*注：日志开始记录:
*writelog(String: "日志文件路径", Number: 1, String: "start");
*/