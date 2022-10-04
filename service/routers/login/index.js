const express = require("express");
const runSql = require('../../db/datebase');

const router = express.Router();

router.post("/", (req, res) => {
    let username = req.body.username
    let password = req.body.password
    runSql(
        "SELECT * FROM dbo.t_user " +
        `WHERE username = '${username.replace("'", "''")}'`
    )
        .then(data => {
            if (data.rowsAffected[0] === 0) {
                res.send({
                    code: 1,
                    msg: "用户名不存在！"
                });
            } else {
                if (data.recordset[0].password === password) {
                    req.session.login = {
                        UID: data.recordset[0].UID,
                        username: data.recordset[0].username
                    };
                    //返回前端
                    res.send({
                        code: 0,
                        msg: "登录成功"
                    });
                } else {
                    res.send({
                        code: 2,
                        msg: "密码错误！"
                    });
                }
            }
        })
        .catch(err => {
            // console.log(err)
            res.send({
                code: 4,
                msg: "未知错误！" + err
            });
        })
});

//验证是否登录
router.post("/ifLogin", (req, res) => {
    let data = req.session.login;
    let resData = false;
    if (data) {
        resData = data;
    }
    res.send({
        userInfo: resData
    });
});

//登出
router.post("/logout", (req, res) => {
    // console.log(req.session)
    req.session.destroy();
    res.send({
        code: 0,
        msg: "退出登陆成功"
    });
});




module.exports = router;