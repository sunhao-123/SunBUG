const websocketConf = require('./websocket')
const url = require('url');
const axios = require("axios");
const gettime = require('./gettime')
const express = require("express");
const runSql = require('../db/datebase');
const request = require('request');

let router = express.Router();

let websocket = websocketConf()
let wsList = websocket.wsList
let wsserver = websocket.wsserver
let wsgetMusicInfoList = {}
let waitMusic = {}
let onlineList = {}

wsserver.on("connection", function (ws) {
    let query = url.parse(ws.path).query;
    // console.log(query)
    // console.log(parseURL(query))
    let data = parseURL(query)
    data.key = ws.key
    ws.send(JSON.stringify({ type: "rushKey", key: ws.key }))
    // console.log(data)
    // key为客户端传参的uuid
    let key = data.key;
    let channel = data.channel.toString();
    // console.log(key)
    // 将创建的连接收集起来
    if (!wsList[channel]) {
        wsList[channel] = {}
    }
    wsList[channel][key] = ws;
    // console.log(getObjKeysNum(wsList[data.channel.toString()]))

    ws.on("text", function (data) {
        let info = JSON.parse(data.toString());
        // console.log('收到客户端发送的消息：', info)
        // console.log(wsList)
        if (info) {
            if (info.type == "come") {
                if (!onlineList[`${info.room}`]) {
                    onlineList[`${info.room}`] = {}
                }
                onlineList[`${info.room}`][`${info.uid}`] = {
                    username: info.username,
                    addr: info.addr,
                    head: info.head,
                    key: info.key
                }
                for (let a in wsList[channel]) {
                    wsList[channel][a].send(JSON.stringify({
                        type: "come",
                        uid: info.uid,
                        username: info.username,
                        addr: info.addr,
                        onLineNum: getObjKeysNum(wsList[channel]),
                        onLineList: onlineList[`${info.room}`]
                    }))
                }
            } else if (info.type == "getMusicInfo") {
                wsgetMusicInfoList[`${info.timestamp}`] = ws
                wsList[info.room][Object.keys(wsList[info.room])[0]].send(JSON.stringify({
                    type: "getMusicInfo",
                    timestamp: info.timestamp
                }))
            } else if (info.type == "setMusicInfo") {
                let message = {
                    type: "setMusicInfo",
                    duration: info.duration,
                    currentTime: info.currentTime,
                    src: info.src,
                    nowMusicName: info.nowMusicName,
                    musicrid: info.musicrid,
                    message: info.message,
                }
                wsgetMusicInfoList[`${info.timestamp}`].send(JSON.stringify(message))
                delete wsgetMusicInfoList[`${info.timestamp}`]
            } else if (info.type == "musicFinish") {
                if (!waitMusic[`${info.roomID}`]) {
                    waitMusic[`${info.roomID}`] = {}
                }
                waitMusic[`${info.roomID}`][`${info.key}`] = ws
                // console.log(`${info.roomID}`)
                // console.log(11111, waitMusic[`${info.roomID}`])
                // console.log(22222, wsList)
                console.log("等待数量：", getObjKeysNum(waitMusic[`${info.roomID}`]))
                console.log("在线数量：", getObjKeysNum(wsList[`${info.roomID}`]))
                if (getObjKeysNum(waitMusic[`${info.roomID}`]) == getObjKeysNum(wsList[`${info.roomID}`])) {
                    let sql = ""
                    if(new Date().getDay() == 1 && new Date().getHours() <= 9){
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
                                            type: "newMusic",
                                            musicrid: data.recordset[0].musicrid,
                                            album: data.recordset[0].album,
                                            pic120: data.recordset[0].pic120,
                                            name: data.recordset[0].name,
                                            artist: data.recordset[0].artist,
                                            userID: data.recordset[0].userID,
                                            songTimeMinutes: data.recordset[0].songTimeMinutes,
                                            url: body
                                        }
                                        for (let a in waitMusic[`${info.roomID}`]) {
                                            waitMusic[`${info.roomID}`][a].send(JSON.stringify(musicData))
                                        }
                                        waitMusic[`${info.roomID}`] = {}
                                        delete waitMusic[`${info.roomID}`]
                                    } else {
                                        // console.log("获取直连失败")
                                    }
                                })
                            } else {
                                // console.log("其他错误")
                            }
                        })
                        .catch(err => {
                            // console.log(err)
                        })
                }
                // wsgetMusicInfoList[`${info.timestamp}`].send(JSON.stringify(message))
                // delete wsgetMusicInfoList[`${info.timestamp}`]
            } else if (info.type == "message") {
                // let message = {
                //     type: "message",
                //     content: this.message,
                //     message_time: new Date().getTime(),
                //     message_type: "text",
                //     message_user: this.myInfo.user_id,
                //     qout: "",
                //     key: this.wsKey,
                //     room: this.roomID
                //   };
                let sql = `INSERT INTO dbo.t_historyMsg ("content", "message_time", "message_type", "message_user", "qout", "room") VALUES ('${info.content.replace("'", "''")}', '${info.message_time}', '${info.message_type}', '${info.message_user}', '${info.qout.replace("'", "''")}', '${info.room}')`
                runSql(sql)
                    .then(data => {
                        for (let a in wsList[channel]) {
                            if (wsList[channel][a].key !== info.key) {
                                wsList[channel][a].send(JSON.stringify(info))
                            }
                        }
                    })
            } else if (info.type == "system-notice") {
                for (let a in wsList[channel]) {
                    wsList[channel][a].send(JSON.stringify(info))
                }
            } else {
                for (let a in wsList[channel]) {
                    if (wsList[channel][a].key !== info.key) {
                        wsList[channel][a].send(JSON.stringify(info))
                    }
                }
            }
        }
    })
    ws.on("close", function (code, reason) {
        let query = url.parse(ws.path).query;
        // console.log(query)
        // console.log(parseURL(query))
        let data = parseURL(query)
        data.key = ws.key
        // console.log(data)
        let key = data.key;
        let channel = data.channel.toString();
        let msg = ""
        for (let a in waitMusic[channel]) {
            if (waitMusic[channel][a].key === key) {
                delete waitMusic[channel][a]
                if (getObjKeysNum(waitMusic[channel]) == 0) {
                    delete waitMusic[channel]
                }
            }
        }
        for (let a in onlineList[channel]) {
            if (onlineList[channel][a].key === key) {
                msg = `${onlineList[channel][a].addr} 的 ${onlineList[channel][a].username} 悄悄地退出了房间`
                delete onlineList[channel][a]
                if (getObjKeysNum(onlineList[channel]) == 0) {
                    delete onlineList[channel]
                }
            }
        }
        for (let a in wsList[channel]) {
            if (wsList[channel][a].key === key) {
                delete wsList[channel][a]
                for (let a in wsList[channel]) {
                    wsList[channel][a].send(JSON.stringify({
                        type: "offline",
                        msg: msg,
                        onLineNum: getObjKeysNum(wsList[channel]),
                        onLineList: onlineList[channel]
                    }))
                }
                if (getObjKeysNum(wsList[channel]) == 0) {
                    delete wsList[channel]
                }
            }
        }
        // console.log(wsList)
    })
})

function parseURL(query) {
    let queryArr = query.split("&")
    let data = {}
    queryArr.forEach(item => {
        let one = item.split("=")
        data[one[0]] = one[1]
    })
    return data
}

function getObjKeysNum(obj) {
    // console.log(obj)
    return Object.keys(obj).length
}

// 获取定位
router.post("/getUserAddress", async (req, res) => {
    let ip = getClientIp(req)
    // let ip = "39.96.83.161"
    // console.log(ip)
    let address = await getClientAddress(ip)
    res.send({ addr: address })
})

function getPlace(ip) {
    return axios.get(`https://apis.map.qq.com/ws/location/v1/ip?ip=${ip}&key=yourkey`);
}

function getClientAddress(ip) {
    return new Promise((resolve, reject) => {
        getPlace(ip)
            .then((r) => {
                // console.log(r)
                let address = ""
                if (r.data.status * 1 === 0) {
                    let nation = ""
                    let province = ""
                    let city = ""
                    let district = ""
                    r.data.result.ad_info.nation ? nation = r.data.result.ad_info.nation : nation = ""
                    r.data.result.ad_info.province ? province = "-" + r.data.result.ad_info.province : province = ""
                    r.data.result.ad_info.city ? city = "-" + r.data.result.ad_info.city : city = ""
                    r.data.result.ad_info.district ? district = "-" + r.data.result.ad_info.district : district = ""
                    address = nation + province + city + district
                } else if (r.data.status * 1 === 375 && r.data.message === '局域网IP') {
                    address = "隔壁"
                } else {
                    address = "未知星球"
                }
                resolve(address)
            })
            .catch(err => {
                // console.log(err)
                resolve("未知星球")
            })
    })
}

function getClientIp(req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    let ip = ipAddress.replace(/::ffff:/g, '');
    return ip;
};

module.exports = router;