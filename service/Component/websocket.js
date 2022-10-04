// wss://127.0.0.1:8888/?account=10000&channel=888&ticket=123456
//                        用户           房间        密码
const ws = require("nodejs-websocket")

let websocketConf = () => {
    let wsList = {};

    let wsserver = ws.createServer(function (conn) {
        conn.on("error", function (err) {
            if (err + "" !== "Error: read ECONNRESET") {
                console.log(3, "websocket error: " + err)
            }
        })
    }).listen(8888)

    wsserver.on("listening", function () {
        console.log(1, `websocket运行在8888端口！`)
    })
    wsserver.on("close", function () {
        console.log(2, "websocket 已关闭！")
    })
    wsserver.on("error", function (errObj) {
        console.log(3, "websocket 错误！" + errObj)
    })
    // wsserver.on("connection", function (ws) {
    //     console.log('客户端已连接', ws.path);
    //     let query = url.parse(ws.path).query;
    //     console.log(query)
    //     // console.log(parseURL(query))
    //     let data = parseURL(query)
    //     console.log(data)
    //     // key为客户端传参的uuid
    //     let key = data.uuid;
    //     let channel = data.channel.toString();
    //     console.log(key)
    //     // 将创建的连接收集起来
    //     if (!wsList[channel]) {
    //         wsList[channel] = {}
    //     }
    //     wsList[channel][key] = ws;
    //     ws.on("text", function (data) {
    //         // console.log(data);
    //         let info = JSON.parse(data.toString());
    //         console.log('收到客户端发送的消息：', info)
    //         console.log(wsList)
    //         if (info.text) {
    //             for (let a in wsList[channel]) {
    //                 wsList[channel][a].send(JSON.stringify(info))
    //             }
    //         }
    //     })
    // })
    return { wsList, wsserver }
}


module.exports = websocketConf

// 服务端会和每一个客户端都创建一个ws连接，所以需要根据id将所有的ws收集起来
// 多人聊天室和两人聊天不同，这里只实现简单的多人聊天
// let wsList = {};
// wss.on('connection', (ws, req) => {
//     // console.log(ws)
//     console.log('客户端已连接', req.socket.remoteAddress);
//     let query = url.parse(req.url).query;
//     // console.log(parseURL(query))
//     let data = parseURL(query)
//     console.log(data)
//     // key为客户端传参的uuid
//     let key = data.uuid;
//     let channel = data.channel.toString();
//     console.log(key)
//     // 将创建的连接收集起来
//     if (!wsList[channel]) {
//         wsList[channel] = {}
//     }
//     wsList[channel][key] = ws;
//     ws.on('message', data => {
//         // console.log(data);
//         let info = JSON.parse(data.toString());
//         console.log('收到客户端发送的消息：', info)
//         console.log(wsList)
//         if (info.text) {
//             for (let a in wsList[channel]) {
//                 wsList[channel][a].send(JSON.stringify(info))
//             }
//         }
//     })
//     ws.on('close', data => {
//         console.log(ws.key)
//         // delete obj['a']
//     })
// })

function parseURL(query) {
    let queryArr = query.split("&")
    let data = {}
    queryArr.forEach(item => {
        let one = item.split("=")
        data[one[0]] = one[1]
    })
    return data
}