const express = require("express");
const runSql = require('../../db/datebase');
const getTime = require('../../Component/gettime');

const router = express.Router();

router.post("/get10Room", (req, res) => {
    let data = req.body
    runSql(`SELECT TOP 9 * FROM dbo.t_room WHERE ID != '888' AND ID != '${data.room}' ORDER BY newid()`)
        .then(data => {
            //返回前端
            res.send({
                code: 0,
                data: data.recordset
            });
        })
        .catch(err => {
            // console.log(err)
            res.send({
                code: 4,
                msg: "未知错误！" + err
            });
        })
});

router.post("/getRoomInfo", (req, res) => {
    let data = req.body
    let sql = `SELECT TOP 1 * FROM dbo.t_room WHERE ID = '${data.roomID}'`
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
});

router.post("/createMyRoom", (req, res) => {
    let data = req.body
    let sql1 = `SELECT TOP 1 ID FROM dbo.t_room WHERE masterID = '${data.uid}'`
    runSql(sql1)
        .then(data1 => {
            if (data1.rowsAffected[0] > 0) {
                let sql2 = `UPDATE dbo.t_user SET "roomID" = '${data1.recordset[0].ID}' WHERE "UID" = '${data.uid}'`
                runSql(sql2)
                    .then(data2 => {
                        console.log(data2)
                        if (data2.rowsAffected[0] > 0) {
                            let sql3 = `SELECT TOP 1 roomID FROM dbo.t_user WHERE UID = '${data.uid}'`
                            runSql(sql3)
                                .then(data3 => {
                                    if (data3.rowsAffected[0] > 0) {
                                        res.send({
                                            code: 0,
                                            data: {roomID: data3.recordset[0].roomID}
                                        })
                                    }
                                })
                        }
                    })
            } else {
                let sql4 = `INSERT INTO dbo.t_room ("masterID", "name", "password", "notice", "signature", "creatTime") VALUES ('${data.uid}', '${data.name}的音乐房间', '0', '${data.name}的音乐房间创建成功', '房主很懒，没写介绍', '${getTime("YYYY-MM-DD HH:mm:ss")}')`
                runSql(sql4)
                    .then(data4 => {
                        console.log(data4)
                        if (data4.rowsAffected[0] > 0) {
                            let sql5 = `SELECT TOP 1 ID FROM dbo.t_room WHERE masterID = '${data.uid}'`
                            runSql(sql5)
                                .then(data5 => {
                                    if (data5.rowsAffected[0] > 0) {
                                        let sql6 = `UPDATE dbo.t_user SET "roomID" = '${data5.recordset[0].ID}' WHERE "UID" = '${data.uid}'`
                                        runSql(sql6)
                                            .then(data6 => {
                                                if (data6.rowsAffected[0] > 0) {
                                                    let sql7 = `SELECT TOP 1 roomID FROM dbo.t_user WHERE UID = '${data.uid}'`
                                                    runSql(sql7)
                                                        .then(data7 => {
                                                            if (data7.rowsAffected[0] > 0) {
                                                                res.send({
                                                                    code: 0,
                                                                    data: {roomID: data7.recordset[0].roomID}
                                                                })
                                                            }
                                                        })
                                                }
                                            })
                                        }
                                    })
                        }
                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.send({
                code: 3,
                data: err
            })
        })
});

router.post("/getHistoryMsg", (req, res) => {
    let data = req.body
    let sql = `SELECT * FROM dbo.t_historyMsg WHERE room = '${data.room}'`
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
});

router.post("/UpdateRoomInfo", (req, res) => {
    let data = req.body
    let sql = `UPDATE dbo.t_room SET "name" = '${data.roomName}', "password" = '${data.password}', "notice" = '${data.notice}', "signature" = '${data.signature}' WHERE "ID" = '${data.id}'`
    runSql(sql)
        .then(data => {
            // console.log(data)
            if (data.rowsAffected[0] > 0) {
                // console.log(data)
                res.send({
                    code: 0,
                    msg: "修改成功！"
                })
            } else {
                res.send({
                    code: 1,
                    msg: "修改失败！"
                })
            }
        })
        .catch(err => {
            res.send({
                code: 3,
                msg: err
            })
        })
});



module.exports = router;