const sql = require('mssql');
const writelog = require('../Component/writelog');
const getTime = require('../Component/gettime');
const consolelog = require('../Component/consolelog');
// const createdatatable = require("../Component/createdatatable");
const fs = require("fs");
const path = require("path");

const config = require(path.join(process.cwd(), '/config/DB_config.json'))

function connectSQL() {
    try {
        sql.connect(config)
            .then(() => {
                consolelog(1, "数据库连接成功！")
                writelog("./log/SystemLog/SystemLog.log", 1, `数据库连接成功！`)
                require("../Component/createdatatable");
            })
            .catch(err => {
                consolelog(3, "数据库连接失败！")
                consolelog(2, "数据库将在5s后自动重连！")
                writelog("./log/SystemLog/SystemLog.log", 3, `数据库连接失败！${err}`)
                setTimeout(function () { connectSQL() }, 5000)
            })
    } catch {
        writelog("./log/SystemLog/SystemLog.log", 3, `数据库连接失败！${err}`)
    }
}
connectSQL()

sql.on('error', err => {
    consolelog(3, "数据库错误！")
    writelog("./log/SystemLog/SystemLog.log", 3, `数据库错误！${err}`)
    connectSQL()
})

function runSql(sqltext) {
    writelog("./log/SQLLog/SQLLog.log", 5, `${sqltext}`)
    return new Promise((resolve, reject) => {
        sql.query(sqltext, (err, recordset) => {
            if (err) {
                consolelog(3, "数据库错误！" + `(${sqltext})`)
                writelog("./log/SystemLog/SystemLog.log", 3, `数据库执行错误！(${sqltext}) ==> ${err}`)
                reject(err)
            } else {
                resolve(recordset)
            }
        });
    })
}

module.exports = runSql