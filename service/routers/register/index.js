const express = require("express");
const sharp = require("sharp");
const path = require("path");
const runSql = require('../../db/datebase');
const nodemail = require('../../Component/nodemailer');
const gettime = require('../../Component/gettime');

const router = express.Router();

router.post("/", async (req, res) => {
    let svg = req.body.svg
    let name = req.body.name
    let password = req.body.password
    let email = req.body.email
    let code = req.body.code
    let sex = req.body.sex
    let signature = req.body.signature

    let sql = `SELECT TOP 1 "code", "expiration" FROM dbo.t_code WHERE "email" = '${email}'`
    runSql(sql)
        .then(data => {
            if (data.rowsAffected[0] > 0) {
                let expiration1 = data.recordset[0].expiration * 1
                let code1 = data.recordset[0].code
                console.log(expiration1)
                if (new Date().getTime() > expiration1) {
                    res.send({
                        code: 5,
                        msg: "验证码已过期！"
                    })
                } else {
                    if (code !== code1) {
                        res.send({
                            code: 4,
                            msg: "验证码错误！"
                        })
                    } else {
                        let sql2 = `SELECT TOP 1 * FROM dbo.t_user WHERE "username" = '${name}'`
                        runSql(sql2)
                            .then(data2 => {
                                if (data2.rowsAffected[0] > 0) {
                                    res.send({
                                        code: 2,
                                        msg: "用户名已存在！"
                                    })
                                } else {
                                    const roundedCorners = Buffer.from(svg);
                                    let headPath = path.join(__dirname, `../../public/head/${name}.png`)
                                    // console.log(headPath)
                                    sharp(roundedCorners)
                                        .resize(150, 150)
                                        .toFile(headPath, (err, info) => {
                                            if (err) {
                                                res.send({
                                                    code: 3,
                                                    msg: "头像存储错误！"
                                                })
                                            } else {
                                                console.log(`/head/${name}.png`)
                                                let head = `/head/${name}.png`
                                                let sql1 = "INSERT INTO dbo.t_user " +
                                                    `("username", "password", "email", "head", "sex", "signature", "creatTime") ` +
                                                    "VALUES " +
                                                    `('${name}', '${password}', '${email}', '${head}', '${sex}', '${signature}', '${gettime("YYYY-MM-DD HH:mm:ss.SSS")}')`
                                                runSql(sql1)
                                                    .then(data1 => {
                                                        if (data1.rowsAffected[0] > 0) {
                                                            res.send({
                                                                code: 0,
                                                                msg: "注册成功！"
                                                            })
                                                        }
                                                    })
                                            }
                                        });
                                }
                            })
                    }
                }
            }
        })
})

router.post("/sendCode", async (req, res) => {
    let email = req.body.email
    let code = rand(1000, 9999)
    let sql1 = `SELECT TOP 1 * FROM dbo.t_code WHERE "email" = '${email}'`
    runSql(sql1)
        .then(data1 => {
            if (data1.rowsAffected[0] > 0) {
                let n = new Date().getTime() + 1000 * 60 * 5
                let sql = `UPDATE dbo.t_code SET "expiration" = '${n}', "code" = '${code}' WHERE "email" = '${email}'`
                runSql(sql)
                    .then(data => {
                        // console.log(data)
                        if (data.rowsAffected[0] > 0) {
                            var mail = {
                                // 发件人
                                from: '"SunBUG 注册小助手 🐟" <suntongxue@sun0623.top>',
                                // 主题
                                subject: 'SunBUG音乐聊天室 注册凭证',//邮箱主题
                                // 收件人
                                to: email,//前台传过来的邮箱
                                // 邮件内容，HTML格式
                                text: "您的注册凭证是： " + code//发送验证码
                            };
                            nodemail(mail);//发送邮件
                            res.send({
                                code: 0,
                                msg: "邮件发送成功，有效期5分钟！"
                            })
                        }
                    })
                    .catch(err => {
                        res.send({
                            code: 1,
                            msg: "邮件发送失败！" + err
                        })
                    })
            } else {
                let n = new Date().getTime() + 1000 * 60 * 5
                let sql = `INSERT INTO dbo.t_code ("email", "code", "expiration") VALUES ('${email}', '${code}', '${n}')`
                runSql(sql)
                    .then(data => {
                        // console.log(data)
                        if (data.rowsAffected[0] > 0) {
                            var mail = {
                                // 发件人
                                from: '"SunBUG 注册小助手 🐟" <suntongxue@sun0623.top>',
                                // 主题
                                subject: 'SunBUG音乐聊天室 注册凭证',//邮箱主题
                                // 收件人
                                to: email,//前台传过来的邮箱
                                // 邮件内容，HTML格式
                                text: "您的注册凭证是： " + code//发送验证码
                            };
                            nodemail(mail);//发送邮件
                            res.send({
                                code: 0,
                                msg: "邮件发送成功，有效期5分钟！"
                            })
                        }
                    })
                    .catch(err => {
                        res.send({
                            code: 1,
                            msg: "邮件发送失败！" + err
                        })
                    })
            }
        })
        .catch(err => {
            res.send({
                code: 2,
                msg: "邮件发送失败！" + err
            })
        })
})

function rand(min, max) {
    let res = Math.floor(Math.random() * (max - min)) + min + ""
    return res;
}

module.exports = router;