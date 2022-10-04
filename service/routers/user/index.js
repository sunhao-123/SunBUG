const express = require("express");
const request = require('request');
const runSql = require('../../db/datebase');
const gettime = require('../../Component/gettime');

let router = express.Router();

// 获取热歌榜
router.post("/getAlluser", (req, res) => {
    let data = req.body
    let sql = `SELECT username, UID, head FROM dbo.t_user`
    runSql(sql)
        .then(data => {
            // console.log(data)
            if (data.rowsAffected[0] > 0) {
                // console.log(data)
                res.send({
                    code: 0,
                    data: data.recordset
                })
            }
        })
})


//登出
router.post("/getMyInfo", (req, res) => {
    let uid = req.body.UID
    let sql = `SELECT username, head, sex, signature, roomID FROM dbo.t_user WHERE "UID" = '${uid}'`
    runSql(sql)
        .then(data => {
            // console.log(data)
            if (data.rowsAffected[0] > 0) {
                // console.log(data)
                res.send({
                    code: 0,
                    data: data.recordset[0]
                })
            }
        })
});

router.post("/updateMyInfo", (req, res) => {
    let data = req.body
    let sql = `UPDATE dbo.t_user SET "username" = '${data.username}', "password" = '${data.password}', "signature" = '${data.signature}' WHERE "UID" = '${data.uid}'`
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