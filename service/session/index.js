const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis')
const path = require("path");
const consolelog = require('../Component/consolelog');
const writelog = require('../Component/writelog');

const config = require(path.join(process.cwd(), '/config/redis_config.json'))

const redisClient = redis.createClient(config.Port, config.IPAddress);

redisClient.on("error", (err) => {
    // report('RedisError');
    if (/connect ECONNREFUSED/ig.test(err)) {
        consolelog(3, "redis 连接失败，程序未安装或服务未启动！")
        writelog("./log/SystemLog/SystemLog.log", 3, "redis 连接失败，程序未安装或服务未启动！" + err)
    } else if (/read ECONNRESET/ig.test(err)) {
        consolelog(3, "redis 已断开连接！")
        writelog("./log/SystemLog/SystemLog.log", 3, "redis 已断开连接！" + err)
    } else {
        consolelog(3, "redis 发生未知错误！")
        writelog("./log/SystemLog/SystemLog.log", 3, "redis 发生未知错误！" + err)
    }
    consolelog(2, "redis 将自动重连！")
    writelog("./log/SystemLog/SystemLog.log", 2, "redis 将自动重连！")
});

redisClient.on("connect", () => {
    consolelog(1, "redis 连接成功！")
    writelog("./log/SystemLog/SystemLog.log", 1, "redis 连接成功！")
});

module.exports = session({
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: config.CookieTime,
        secure: false
    },
    rolling: true,
    secret: 'Accurate',
    store: new RedisStore({
        client: redisClient
    }),
});