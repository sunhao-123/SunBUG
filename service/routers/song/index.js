const express = require("express");
const request = require('request');
const runSql = require('../../db/datebase');
const gettime = require('../../Component/gettime');
const writelog = require("../../Component/writelog");

let router = express.Router();

// 获取歌曲信息
router.post("/getMusicInfo", (req, res) => {
    let data = req.body
    let sql = `SELECT TOP 1 * FROM dbo.t_HotMusic WHERE date = '${gettime("YYYY/MM/DD", new Date().getTime() - 1000 * 60 * 60 * 9)}' AND musicrid = '${data.musicrid}'`
    runSql(sql)
        .then(data => {
            // console.log(data)
            if (data.rowsAffected[0] > 0) {
                // console.log(data)
                let musicData = {
                    album: data.recordset[0].album,
                    artist: data.recordset[0].artist,
                    pic120: data.recordset[0].pic120,
                    name: data.recordset[0].name,
                }
                res.send({
                    code: 0,
                    data: musicData
                })
            } else {
                let sql1 = `SELECT TOP 1 * FROM dbo.t_MusicQueue WHERE musicrid = '${data.musicrid}' ORDER BY ID DESC`
                runSql(sql1)
                    .then(data1 => {
                        // console.log(data)
                        if (data1.rowsAffected[0] > 0) {
                            // console.log(data)
                            let musicData = {
                                album: data1.recordset[0].album,
                                artist: data1.recordset[0].artist,
                                pic120: data1.recordset[0].pic120,
                                name: data1.recordset[0].name,
                            }
                            res.send({
                                code: 0,
                                data: musicData
                            })
                        }
                    })
            }
        })
})

// 手动获取热歌榜
router.get("/getHotMusic", (req, res) => {
    const getHot = require('../../Component/scheduleGetHot');
    
    setTimeout(() => {
        getHot.getHotMusic1()
    },0)
    setTimeout(() => {
        getHot.getHotMusic2()
    },30000)
    setTimeout(() => {
        getHot.getHotMusic3()
    },60000)
    setTimeout(() => {
        getHot.getHotMusic4()
    },90000)
    setTimeout(() => {
        getHot.getHotMusic5()
    },120000)
    setTimeout(() => {
        getHot.getHotMusic6()
    },150000)
    setTimeout(() => {
        getHot.getHotMusic7()
    },180000)
    setTimeout(() => {
        getHot.getHotMusic8()
    },210000)
    setTimeout(() => {
        getHot.getHotMusic9()
    },240000)
    setTimeout(() => {
        getHot.getHotMusic10()
    },270000)
    setTimeout(() => {
        getHot.getHotMusic01()
    },300000)
    setTimeout(() => {
        getHot.getHotMusic02()
    },330000)
    setTimeout(() => {
        getHot.getHotMusic03()
    },360000)
    setTimeout(() => {
        getHot.getHotMusic04()
    },390000)
    setTimeout(() => {
        getHot.deleteHotMusic()
    },420000)

    res.send("手动请求成功，正在抓取音乐！请稍后。")
})

// 加入黑名单
router.post("/addToBlickList", (req, res) => {
    let data = req.body
    let sql = `INSERT INTO dbo.t_musicBlackList ("room", "musicrid", "pic120", "name", "artist", "album") VALUES ('${data.room}', '${data.musicrid}', '${data.pic120}', '${data.name}', '${data.artist}', '${data.album}')`
    runSql(sql)
        .then(data => {
            // console.log(data)
            if (data.rowsAffected[0] > 0) {
                res.send({
                    code: 0,
                    msg: "已加入黑名单"
                })
            } else {
                res.send({
                    code: 1,
                    msg: "加入黑名单失败"
                })
            }
        })
        .catch(err => {
            res.send({
                code: 1,
                msg: "加入黑名单失败" + err
            })
        })
})

// 搜索
router.post("/searchMusic", (req, res) => {
    const kwtoken = "your kuwo token"
    const cookie = request.cookie(`kw_token=${kwtoken}`);
    let data = req.body
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/search/searchMusicBykeyWord?key=${data.key}&pn=${data.page}&rn=30&httpsStatus=1`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/search/searchMusicBykeyWord?key=${data.key}`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },

    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let musicList = body.data.list
                // console.log({
                //     "歌曲名称": data.name,
                //     "歌曲ID": data.rid,
                //     "歌名封面": data.albumpic,
                //     "演唱者": data.artist,
                //     "专辑": data.album,
                //     "歌曲时长": data.songTimeMinutes,
                // })
                res.send(musicList)
            } else {
                res.send([])
            }
        } else {
            console.log("2", error)
        }
    });
})

// 搜索
router.get("/getMusicUrl", (req, res) => {
    // res.download("http://other.player.nf01.sycdn.kuwo.cn/2fffcb86c5e2ec94e9ad7c8a119896f1/62fc412f/resource/n3/91/34/2717149869.mp3", `123123.mp3`);
    // res.writeHead(302, { 'Location': 'http://other.player.nf01.sycdn.kuwo.cn/2fffcb86c5e2ec94e9ad7c8a119896f1/62fc412f/resource/n3/91/34/2717149869.mp3' });
    // res.end();
    let data = req.query
    request({
        url: encodeURI(`http://antiserver.kuwo.cn/anti.s?type=convert_url&rid=${data.musicrid}&format=mp3|aac`),
        method: "GET",
        json: true,
    }, function (error, response, body) {
        if (!error) {
            res.writeHead(302, { 'Location': body });
            res.end();
        } else {
            console.log("2", error)
        }
    })
})

// 获取歌词
router.post("/getMusicLrc", (req, res) => {
    let data = req.body
    request({
        url: encodeURI(`http://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${data.musicrid}`),
        method: "GET",
        json: true,

    }, function (error, response, body) {
        if (!error) {
            // console.log(body.data)
            if (body.data) {
                let lrclist = body.data.lrclist
                // console.log(lrclist)
                // let lrcStr = ""
                // lrclist.forEach(item => {
                //     lrcStr += `[${formatLrcTime(item.time)}]${item.lineLyric}\n`
                // });
                res.send({ lrc: lrclist })
            } else {
                res.send()
            }
        } else {
            res.send({ lrc: "[00:00.00] 歌词获取失败" })
            console.log("2", error)
        }
    })
})

//select top 1 * from dbo.t_HotMusic order by newid()
//随机获取一首音乐
router.post("/getOneMusic", (req, res) => {
    let sql = ""
    if (new Date().getDay() == 1 && new Date().getHours() <= 9) {
        sql = `SELECT TOP 1 * FROM dbo.t_HotMusic WHERE musicrid NOT IN (SELECT musicrid FROM dbo.t_musicBlackList WHERE room = '${info.roomID}') ORDER BY newid()`
    } else {
        sql = `SELECT TOP 1 * FROM dbo.t_HotMusic WHERE date = '${gettime("YYYY/MM/DD", new Date().getTime() - 1000 * 60 * 60 * 9)}' AND musicrid NOT IN (SELECT musicrid FROM dbo.t_musicBlackList WHERE room = '${info.roomID}') ORDER BY newid()`
    }
    runSql(sql)
        .then(data => {
            // console.log(data)
            if (data.rowsAffected[0] > 0) {
                // console.log(data)
                request({
                    url: encodeURI(`http://antiserver.kuwo.cn/anti.s?type=convert_url&rid=${data.recordset[0].musicrid}&format=mp3|aac`),
                    method: "GET",
                    json: true,

                }, function (error, response, body) {
                    if (!error) {
                        let musicData = {
                            musicrid: data.recordset[0].musicrid,
                            album: data.recordset[0].album,
                            pic120: data.recordset[0].pic120,
                            name: data.recordset[0].name,
                            artist: data.recordset[0].artist,
                            userID: data.recordset[0].userID,
                            songTimeMinutes: data.recordset[0].songTimeMinutes,
                            url: body
                        }
                        res.send({
                            code: 0,
                            data: musicData
                        })
                    } else {
                        res.send({
                            code: 0,
                            data: "获取直链失败"
                        })
                    }
                })
            } else {
                res.send({
                    code: 3,
                    data: "其他错误"
                })
            }
        })
        .catch(err => {
            res.send({
                code: 3,
                data: err
            })
        })
})

// 点歌
router.post("/addToMusicQueue", (req, res) => {
    let data = req.body
    let sql = `INSERT INTO dbo.t_MusicQueue ("musicrid", "album", "pic120", "name", "artist", "songTimeMinutes", "roomID", "userID", "already", "updateTime") VALUES ('${data.musicrid}', '${data.album.replace("'", "''")}', '${data.pic120.replace("'", "''")}', '${data.name.replace("'", "''")}', '${data.artist.replace("'", "''")}', '${data.songTimeMinutes}', '${data.roomID}', '${data.user}', '${false}', '${new Date().getTime()}')`
    runSql(sql)
        .then(data => {
            // console.log(data)
            if (data.rowsAffected[0] > 0) {
                // console.log(data)
                res.send({
                    code: 0,
                    data: "点歌成功"
                })
            } else {
                res.send({
                    code: 3,
                    data: "其他错误"
                })
            }
        })
        .catch(err => {
            res.send({
                code: 3,
                data: err
            })
        })
})

// 喜欢
router.post("/addToFavorites", (req, res) => {
    let data = req.body
    if (data.musicrid) {
        let sql = `UPDATE dbo.t_LikeMusic SET "timestamp" = '${new Date().getTime()}' WHERE "musicrid" = '${data.musicrid}' AND "userID" = '${data.userID}'`
        // let sql = `INSERT INTO dbo.t_LikeMusic ("musicrid", "album", "pic120", "name", "artist", "songTimeMinutes", "userID", "timestamp") VALUES ('${data.musicrid}', '${data.album}', '${data.pic120}', '${data.name}', '${data.artist}', '${data.songTimeMinutes}', '${data.userID}', '${new Date().getTime()}')`
        runSql(sql)
            .then(data2 => {
                // console.log(data)
                if (data2.rowsAffected[0] > 0) {
                    // console.log(data)
                    res.send({
                        code: 1,
                        data: "已收藏过"
                    })
                } else {
                    let sql1 = `INSERT INTO dbo.t_LikeMusic ("musicrid", "album", "pic120", "name", "artist", "songTimeMinutes", "userID", "timestamp") VALUES ('${data.musicrid}', '${data.album.replace("'", "''")}', '${data.pic120.replace("'", "''")}', '${data.name.replace("'", "''")}', '${data.artist.replace("'", "''")}', '${data.songTimeMinutes}', '${data.userID}', '${new Date().getTime()}')`
                    runSql(sql1)
                        .then(data1 => {
                            // console.log(data)
                            if (data1.rowsAffected[0] > 0) {
                                // console.log(data)
                                res.send({
                                    code: 0,
                                    data: "收藏成功"
                                })
                            } else {
                                res.send({
                                    code: 3,
                                    data: "其他错误"
                                })
                            }
                        })
                        .catch(err => {
                            writelog("./log/SystemLog/SystemLog.log", 3, err)
                            res.send({
                                code: 4,
                                data: err
                            })
                        })
                }
            })
            .catch(err => {
                writelog("./log/SystemLog/SystemLog.log", 3, err)
                res.send({
                    code: 6,
                    data: err
                })
            })
    } else {
        res.send({
            code: 5,
            data: "musicrid为空"
        })
    }
})

// 获取黑名单
router.post("/getDontlikeList", (req, res) => {
    let data = req.body
    let sql = `SELECT * FROM dbo.t_musicBlackList WHERE room = '${data.room}'`
    runSql(sql)
        .then(data => {
            // console.log(data)
            if (data.rowsAffected[0] > 0) {
                // console.log(data)
                res.send({
                    code: 0,
                    data: data.recordset
                })
            } else {
                res.send({
                    code: 0,
                    data: []
                })
            }
        })
        .catch(err => {
            res.send({
                code: 3,
                data: err
            })
        })
})

// 获取喜欢列表
router.post("/getFavoritesList", (req, res) => {
    let data = req.body
    let sql = `SELECT * FROM dbo.t_LikeMusic WHERE userID = '${data.userID}' ORDER BY timestamp DESC`
    runSql(sql)
        .then(data => {
            // console.log(data)
            if (data.rowsAffected[0] > 0) {
                // console.log(data)
                res.send({
                    code: 0,
                    data: data.recordset
                })
            } else {
                res.send({
                    code: 0,
                    data: []
                })
            }
        })
        .catch(err => {
            res.send({
                code: 3,
                data: err
            })
        })
})

// 删除喜欢
router.post("/deleteFavoriteMusic", (req, res) => {
    let data = req.body
    let sql = `DELETE FROM dbo.t_LikeMusic WHERE ID = '${data.ID}'`
    runSql(sql)
        .then(data => {
            // console.log(data)
            if (data.rowsAffected[0] > 0) {
                // console.log(data)
                res.send({
                    code: 0,
                    data: data.recordset
                })
            } else {
                res.send({
                    code: 0,
                    data: []
                })
            }
        })
        .catch(err => {
            res.send({
                code: 3,
                data: err
            })
        })
})

// 删除黑名单
router.post("/deleteBlackList", (req, res) => {
    let data = req.body
    let sql = `DELETE FROM dbo.t_musicBlackList WHERE ID = '${data.ID}'`
    runSql(sql)
        .then(data => {
            // console.log(data)
            if (data.rowsAffected[0] > 0) {
                // console.log(data)
                res.send({
                    code: 0,
                    data: data.recordset
                })
            } else {
                res.send({
                    code: 0,
                    data: []
                })
            }
        })
        .catch(err => {
            res.send({
                code: 3,
                data: err
            })
        })
})



// 获取已点列表
router.post("/getMusicQueue", (req, res) => {
    let data = req.body
    let sql = `SELECT * FROM dbo.t_MusicQueue WHERE roomID = '${data.roomID}' AND already = '${false}' ORDER BY updateTime`
    runSql(sql)
        .then(data => {
            // console.log(data)
            if (data.rowsAffected[0] > 0) {
                // console.log(data)
                res.send({
                    code: 0,
                    data: data.recordset
                })
            } else {
                res.send({
                    code: 0,
                    data: []
                })
            }
        })
        .catch(err => {
            res.send({
                code: 3,
                data: err
            })
        })
})

// 从已点列表中删除
router.post("/deleteMusicFromQueue", (req, res) => {
    // let sql2 = `update dbo.t_MusicQueue set already = '${true}' where already = '${false}' AND roomID = '${roomID}' AND musicrid = '${data1.recordset[0].musicrid}'`
    //                     runSql(sql2)
    let data = req.body
    // console.log(data)
    let sql = ""
    if (data.type == "play") {
        sql = `UPDATE dbo.t_MusicQueue SET already = '${true}' WHERE ID = '${data.ID}'`
    } else {
        sql = `DELETE FROM dbo.t_MusicQueue WHERE ID = '${data.ID}'`
    }
    runSql(sql)
        .then(data => {
            // console.log(data)
            if (data.rowsAffected[0] > 0) {
                // console.log(data)
                res.send({
                    code: 0,
                    data: data.recordset
                })
            } else {
                res.send({
                    code: 3,
                    data: "其他错误"
                })
            }
        })
        .catch(err => {
            res.send({
                code: 3,
                data: err
            })
        })
})

// 置顶
router.post("/upToTop", (req, res) => {
    let data = req.body
    let sql = `UPDATE dbo.t_MusicQueue SET updateTime = '${data.time * 1 - 1}' WHERE ID = '${data.ID}'`
    runSql(sql)
        .then(data => {
            // console.log(data)
            if (data.rowsAffected[0] > 0) {
                // console.log(data)
                res.send({
                    code: 0,
                    data: "更新成功"
                })
            } else {
                res.send({
                    code: 3,
                    data: "其他错误"
                })
            }
        })
        .catch(err => {
            res.send({
                code: 3,
                data: err
            })
        })
})

// 格式化歌词
function formatLrcTime(time) {
    let timeArr = time.split(".")
    let s = (timeArr[0] % 60) < 10 ? "0" + (timeArr[0] % 60) : (timeArr[0] % 60)
    let m = (Math.floor(timeArr[0] / 60)) < 10 ? "0" + (Math.floor(timeArr[0] / 60)) : (Math.floor(timeArr[0] / 60))
    return `${m}:${s}.${timeArr[1]}`
}

module.exports = router;