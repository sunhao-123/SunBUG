const getTime = require('./gettime');
const writelog = require('./writelog')
const consolelog = require('./consolelog')
const runSql = require('../db/datebase');
const crypto = require("crypto");

//t_user表
runSql("select count(*) from sysobjects where id = object_id('dbo.t_user')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_user" +
                "(" +
                "UID              int             not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                'username         nvarchar(20)    not null,' +
                'password         nvarchar(200)   not null,' +
                'email            nvarchar(200)   not null,' +
                'head             nvarchar(200)   not null,' +
                'sex              nvarchar(20)    not null,' +
                'signature        nvarchar(1023)  not null,' +
                'roomID           nvarchar(200)       null,' +
                "creatTime        datetime        not null," +
                "updateTime       datetime            null" +
                ")"
            ).then(() => {
                writelog("./log/SystemLog/SystemLog.log", 1, "t_user 数据表创建成功！")
                runSql(
                    "INSERT INTO dbo.t_user " +
                    `("username", "password", "email", "head", "sex", "signature", "roomID", "creatTime", "updateTime") ` +
                    "VALUES " +
                    `('admin', 'admin', '************', '/img/defaultPhoto.jpeg', 'GG', '我可是管理员呐！', '888', '${getTime("YYYY-MM-DD hh:mm:ss")}', ${null})`
                )
                    .then(data => {
                        writelog("./log/SystemLog/SystemLog.log", 1, "基础管理员账号创建成功！")
                    })
                    .catch(err => {
                        consolelog(3, `基础管理员账号创建失败！`)
                        writelog("./log/SystemLog/SystemLog.log", 3, `基础管理员账号创建失败！${err}`)
                    })
            })
                .catch(err => {
                    consolelog(3, `t_user 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_user 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_user 表已存在！`)
        }
    })

//t_room表
runSql("select count(*) from sysobjects where id = object_id('dbo.t_room')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_room" +
                "(" +
                "ID              int             not null    identity(888,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                'masterID        nvarchar(20)    not null,' +
                'name            nvarchar(20)    not null,' +
                'password        nvarchar(200)   not null,' +
                'notice          nvarchar(200)   not null,' +
                'signature       nvarchar(1023)  not null,' +
                "creatTime       datetime        not null," +
                "updateTime      datetime            null," +
                ")"
            ).then(() => {
                writelog("./log/SystemLog/SystemLog.log", 1, "t_room 数据表创建成功！")
                runSql(
                    "INSERT INTO dbo.t_room " +
                    `("masterID", "name", "password", "notice", "signature", "creatTime") ` +
                    "VALUES " +
                    `('1', 'SunBUG 音乐大厅', '0', 'SunBUG音乐聊天室V3.0上线，在这里，你可以聊天、点歌、听歌~~~全部功能基本完成，项目已开源！按F1打开使用手册', '这是SunBUG音乐聊天室的音乐大厅~', '${getTime("YYYY-MM-DD hh:mm:ss")}')`
                )
                    .then(data => {
                        writelog("./log/SystemLog/SystemLog.log", 1, "音乐大厅创建成功！")
                        runSql(`DBCC checkident([dbo.t_room], RESEED, 10000)`)
                    })
                    .catch(err => {
                        consolelog(3, `音乐大厅创建失败！`)
                        writelog("./log/SystemLog/SystemLog.log", 3, `音乐大厅创建失败！${err}`)
                    })
            })
                .catch(err => {
                    consolelog(3, `t_room 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_room 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_room 表已存在！`)
        }
    })

//t_code表
runSql("select count(*) from sysobjects where id = object_id('dbo.t_code')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_code" +
                "(" +
                "ID             int              not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                'email          nvarchar(200)    not null,' +
                'code           nvarchar(20)     not null,' +
                'expiration     nvarchar(20)     not null,' +
                ")"
            ).then(() => {
                writelog("./log/SystemLog/SystemLog.log", 1, "t_code 数据表创建成功！")
            })
                .catch(err => {
                    consolelog(3, `t_code 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_code 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_code 表已存在！`)
        }
    })

//t_HotMusic
runSql("select count(*) from sysobjects where id = object_id('dbo.t_HotMusic')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_HotMusic" +
                "(" +
                "ID           int               not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                "musicrid     nvarchar(20)      not null," +    //rid
                "album        nvarchar(100)      not null," +    //zhuanji
                "pic120       nvarchar(200)     not null," +    //fengmian
                "name         nvarchar(100)      not null," +    //mingzi
                "artist       nvarchar(100)      not null," +    //geshou
                "date         nvarchar(20)      not null," +    //日期
                "songTimeMinutes         nvarchar(20)      not null," +    //
                ")"
            )
                .then(() => {
                    writelog("./log/SystemLog/SystemLog.log", 1, "t_HotMusic 数据表创建成功！")
                })
                .catch(err => {
                    consolelog(3, `t_HotMusic 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_HotMusic 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_HotMusic 表已存在！`)
        }
    })

//t_MusicQueue
runSql("select count(*) from sysobjects where id = object_id('dbo.t_MusicQueue')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_MusicQueue" +
                "(" +
                "ID           int               not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                "musicrid     nvarchar(20)      not null," +    //rid
                "album        nvarchar(100)     not null," +    //zhuanji
                "pic120       nvarchar(200)     not null," +    //fengmian
                "name         nvarchar(100)     not null," +    //mingzi
                "artist       nvarchar(100)     not null," +    //geshou
                "songTimeMinutes         nvarchar(20)      not null," +    //
                "roomID       nvarchar(20)      not null," +    //
                "userID       nvarchar(20)      not null," +    //
                "already      bit               not null," +
                "updateTime   nvarchar(50)      not null" +
                ")"
            )
                .then(() => {
                    writelog("./log/SystemLog/SystemLog.log", 1, "t_MusicQueue 数据表创建成功！")
                })
                .catch(err => {
                    consolelog(3, `t_MusicQueue 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_MusicQueue 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_MusicQueue 表已存在！`)
        }
    })

//t_LikeMusic
runSql("select count(*) from sysobjects where id = object_id('dbo.t_LikeMusic')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_LikeMusic" +
                "(" +
                "ID           int               not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                "musicrid     nvarchar(20)      not null," +    //rid
                "album        nvarchar(100)     not null," +    //zhuanji
                "pic120       nvarchar(200)     not null," +    //fengmian
                "name         nvarchar(100)     not null," +    //mingzi
                "artist       nvarchar(100)     not null," +    //geshou
                "songTimeMinutes         nvarchar(20)      not null," +    //
                "userID       nvarchar(20)      not null," +    //
                "timestamp    nvarchar(50)      not null" +    //
                ")"
            )
                .then(() => {
                    writelog("./log/SystemLog/SystemLog.log", 1, "t_LikeMusic 数据表创建成功！")
                })
                .catch(err => {
                    consolelog(3, `t_LikeMusic 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_LikeMusic 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_LikeMusic 表已存在！`)
        }
    })

// dbo.t_musicBlackList
runSql("select count(*) from sysobjects where id = object_id('dbo.t_musicBlackList')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_musicBlackList" +
                "(" +
                "ID           int               not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                "musicrid     nvarchar(20)      not null," +    //rid
                "room         nvarchar(100)     not null," +    //zhuanji
                "pic120       nvarchar(200)     not null," +
                "name         nvarchar(50)      not null," +
                "artist       nvarchar(20)      not null," +
                "album        nvarchar(100)     not null" +
                ")"
            )
                .then(() => {
                    writelog("./log/SystemLog/SystemLog.log", 1, "t_musicBlackList 数据表创建成功！")
                })
                .catch(err => {
                    consolelog(3, `t_musicBlackList 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_musicBlackList 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_musicBlackList 表已存在！`)
        }
    })

// dbo.t_historyMsg
runSql("select count(*) from sysobjects where id = object_id('dbo.t_historyMsg')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_historyMsg" +
                "(" +
                "ID            int              not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                "content       nvarchar(200)    not null," +    //rid
                "message_time  nvarchar(100)    not null," +    //zhuanji
                "message_type  nvarchar(20)     not null," +
                "message_user  nvarchar(20)     not null," +
                "qout          nvarchar(200)        null," +
                "room          nvarchar(20)     not null" +
                ")"
            )
                .then(() => {
                    writelog("./log/SystemLog/SystemLog.log", 1, "t_historyMsg 数据表创建成功！")
                })
                .catch(err => {
                    consolelog(3, `t_historyMsg 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_historyMsg 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_historyMsg 表已存在！`)
        }
    })