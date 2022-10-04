const express = require("express");
const request = require("request");
const schedule = require('node-schedule');
const writelog = require('./writelog')
const getTime = require('./gettime');
const runSql = require('../db/datebase');

const kwtoken = "your kuwo token"
const cookie = request.cookie(`kw_token=${kwtoken}`);

const getHotMusic01 = () => {
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=145&pn=1&rn=30`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=145`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },
    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let date = getTime("YYYY/MM/DD")
                let musicList = body.data.musicList
                let sql = "INSERT INTO dbo.t_HotMusic " +
                    `("musicrid", "album", "pic120", "name", "artist", "date", "songTimeMinutes") ` +
                    "VALUES "
                musicList.forEach(item => {
                    sql += `('${item.rid}', '${item.album.replace("'", "''")}', '${item.pic120.replace("'", "''")}', '${item.name.replace("'", "''")}', '${item.artist.replace("'", "''")}', '${date}', '${item.songTimeMinutes}'),`
                });
                sql = sql.substring(0, sql.length - 1)
                runSql(sql)
                    .then(data => {
                        console.log("获取成功01")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("获取失败01")
            }
        } else {
            console.log("2", error)
        }
    });
}


const getHotMusic02 = () => {
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=145&pn=2&rn=30`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=145`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },
    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let date = getTime("YYYY/MM/DD")
                let musicList = body.data.musicList
                let sql = "INSERT INTO dbo.t_HotMusic " +
                    `("musicrid", "album", "pic120", "name", "artist", "date", "songTimeMinutes") ` +
                    "VALUES "
                musicList.forEach(item => {
                    sql += `('${item.rid}', '${item.album.replace("'", "''")}', '${item.pic120.replace("'", "''")}', '${item.name.replace("'", "''")}', '${item.artist.replace("'", "''")}', '${date}', '${item.songTimeMinutes}'),`
                })
                sql = sql.substring(0, sql.length - 1)
                runSql(sql)
                    .then(data => {
                        console.log("获取成功02")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("获取失败02")
            }
        } else {
            console.log("2", error)
        }
    });
}


const getHotMusic03 = () => {
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=145&pn=3&rn=30`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=145`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },
    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let date = getTime("YYYY/MM/DD")
                let musicList = body.data.musicList
                let sql = "INSERT INTO dbo.t_HotMusic " +
                    `("musicrid", "album", "pic120", "name", "artist", "date", "songTimeMinutes") ` +
                    "VALUES "
                musicList.forEach(item => {
                    sql += `('${item.rid}', '${item.album.replace("'", "''")}', '${item.pic120.replace("'", "''")}', '${item.name.replace("'", "''")}', '${item.artist.replace("'", "''")}', '${date}', '${item.songTimeMinutes}'),`
                });
                sql = sql.substring(0, sql.length - 1)
                runSql(sql)
                    .then(data => {
                        console.log("获取成功03")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("获取失败03")
            }
        } else {
            console.log("2", error)
        }
    });
}


const getHotMusic04 = () => {
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=145&pn=4&rn=30`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=145`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },
    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let date = getTime("YYYY/MM/DD")
                let musicList = body.data.musicList
                let sql = "INSERT INTO dbo.t_HotMusic " +
                    `("musicrid", "album", "pic120", "name", "artist", "date", "songTimeMinutes") ` +
                    "VALUES "
                musicList.forEach(item => {
                    sql += `('${item.rid}', '${item.album.replace("'", "''")}', '${item.pic120.replace("'", "''")}', '${item.name.replace("'", "''")}', '${item.artist.replace("'", "''")}', '${date}', '${item.songTimeMinutes}'),`
                });
                sql = sql.substring(0, sql.length - 1)
                runSql(sql)
                    .then(data => {
                        console.log("获取成功04")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("获取失败04")
            }
        } else {
            console.log("2", error)
        }
    });
}

const getHotMusic1 = () => {
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16&pn=1&rn=30`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },
    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let date = getTime("YYYY/MM/DD")
                let musicList = body.data.musicList
                let sql = "INSERT INTO dbo.t_HotMusic " +
                    `("musicrid", "album", "pic120", "name", "artist", "date", "songTimeMinutes") ` +
                    "VALUES "
                musicList.forEach(item => {
                    sql += `('${item.rid}', '${item.album.replace("'", "''")}', '${item.pic120.replace("'", "''")}', '${item.name.replace("'", "''")}', '${item.artist.replace("'", "''")}', '${date}', '${item.songTimeMinutes}'),`
                });
                sql = sql.substring(0, sql.length - 1)
                runSql(sql)
                    .then(data => {
                        console.log("获取成功1")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("获取失败1")
            }
        } else {
            console.log("2", error)
        }
    });
}

const getHotMusic2 = () => {
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16&pn=2&rn=30`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },
    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let date = getTime("YYYY/MM/DD")
                let musicList = body.data.musicList
                let sql = "INSERT INTO dbo.t_HotMusic " +
                    `("musicrid", "album", "pic120", "name", "artist", "date", "songTimeMinutes") ` +
                    "VALUES "
                musicList.forEach(item => {
                    sql += `('${item.rid}', '${item.album.replace("'", "''")}', '${item.pic120.replace("'", "''")}', '${item.name.replace("'", "''")}', '${item.artist.replace("'", "''")}', '${date}', '${item.songTimeMinutes}'),`
                });
                sql = sql.substring(0, sql.length - 1)
                runSql(sql)
                    .then(data => {
                        console.log("获取成功2")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("获取失败2")
            }
        } else {
            console.log("2", error)
        }
    });
}

const getHotMusic3 = () => {
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16&pn=3&rn=30`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },
    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let date = getTime("YYYY/MM/DD")
                let musicList = body.data.musicList
                let sql = "INSERT INTO dbo.t_HotMusic " +
                    `("musicrid", "album", "pic120", "name", "artist", "date", "songTimeMinutes") ` +
                    "VALUES "
                musicList.forEach(item => {
                    sql += `('${item.rid}', '${item.album.replace("'", "''")}', '${item.pic120.replace("'", "''")}', '${item.name.replace("'", "''")}', '${item.artist.replace("'", "''")}', '${date}', '${item.songTimeMinutes}'),`
                });
                sql = sql.substring(0, sql.length - 1)
                runSql(sql)
                    .then(data => {
                        console.log("获取成功3")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("获取失败3")
            }
        } else {
            console.log("2", error)
        }
    });
}

const getHotMusic4 = () => {
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16&pn=4&rn=30`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },
    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let date = getTime("YYYY/MM/DD")
                let musicList = body.data.musicList
                let sql = "INSERT INTO dbo.t_HotMusic " +
                    `("musicrid", "album", "pic120", "name", "artist", "date", "songTimeMinutes") ` +
                    "VALUES "
                musicList.forEach(item => {
                    sql += `('${item.rid}', '${item.album.replace("'", "''")}', '${item.pic120.replace("'", "''")}', '${item.name.replace("'", "''")}', '${item.artist.replace("'", "''")}', '${date}', '${item.songTimeMinutes}'),`
                });
                sql = sql.substring(0, sql.length - 1)
                runSql(sql)
                    .then(data => {
                        console.log("获取成功4")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("获取失败4")
            }
        } else {
            console.log("2", error)
        }
    });
}

const getHotMusic5 = () => {
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16&pn=5&rn=30`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },
    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let date = getTime("YYYY/MM/DD")
                let musicList = body.data.musicList
                let sql = "INSERT INTO dbo.t_HotMusic " +
                    `("musicrid", "album", "pic120", "name", "artist", "date", "songTimeMinutes") ` +
                    "VALUES "
                musicList.forEach(item => {
                    sql += `('${item.rid}', '${item.album.replace("'", "''")}', '${item.pic120.replace("'", "''")}', '${item.name.replace("'", "''")}', '${item.artist.replace("'", "''")}', '${date}', '${item.songTimeMinutes}'),`
                });
                sql = sql.substring(0, sql.length - 1)
                runSql(sql)
                    .then(data => {
                        console.log("获取成功5")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("获取失败5")
            }
        } else {
            console.log("2", error)
        }
    });
}

const getHotMusic6 = () => {
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16&pn=6&rn=30`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },
    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let date = getTime("YYYY/MM/DD")
                let musicList = body.data.musicList
                let sql = "INSERT INTO dbo.t_HotMusic " +
                    `("musicrid", "album", "pic120", "name", "artist", "date", "songTimeMinutes") ` +
                    "VALUES "
                musicList.forEach(item => {
                    sql += `('${item.rid}', '${item.album.replace("'", "''")}', '${item.pic120.replace("'", "''")}', '${item.name.replace("'", "''")}', '${item.artist.replace("'", "''")}', '${date}', '${item.songTimeMinutes}'),`
                });
                sql = sql.substring(0, sql.length - 1)
                runSql(sql)
                    .then(data => {
                        console.log("获取成功6")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("获取失败6")
            }
        } else {
            console.log("2", error)
        }
    });
}

const getHotMusic7 = () => {
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16&pn=7&rn=30`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },
    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let date = getTime("YYYY/MM/DD")
                let musicList = body.data.musicList
                let sql = "INSERT INTO dbo.t_HotMusic " +
                    `("musicrid", "album", "pic120", "name", "artist", "date", "songTimeMinutes") ` +
                    "VALUES "
                musicList.forEach(item => {
                    sql += `('${item.rid}', '${item.album.replace("'", "''")}', '${item.pic120.replace("'", "''")}', '${item.name.replace("'", "''")}', '${item.artist.replace("'", "''")}', '${date}', '${item.songTimeMinutes}'),`
                });
                sql = sql.substring(0, sql.length - 1)
                runSql(sql)
                    .then(data => {
                        console.log("获取成功7")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("获取失败7")
            }
        } else {
            console.log("2", error)
        }
    });
}

const getHotMusic8 = () => {
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16&pn=8&rn=30`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },
    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let date = getTime("YYYY/MM/DD")
                let musicList = body.data.musicList
                let sql = "INSERT INTO dbo.t_HotMusic " +
                    `("musicrid", "album", "pic120", "name", "artist", "date", "songTimeMinutes") ` +
                    "VALUES "
                musicList.forEach(item => {
                    sql += `('${item.rid}', '${item.album.replace("'", "''")}', '${item.pic120.replace("'", "''")}', '${item.name.replace("'", "''")}', '${item.artist.replace("'", "''")}', '${date}', '${item.songTimeMinutes}'),`
                });
                sql = sql.substring(0, sql.length - 1)
                runSql(sql)
                    .then(data => {
                        console.log("获取成功8")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("获取失败8")
            }
        } else {
            console.log("2", error)
        }
    });
}

const getHotMusic9 = () => {
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16&pn=9&rn=30`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },
    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let date = getTime("YYYY/MM/DD")
                let musicList = body.data.musicList
                let sql = "INSERT INTO dbo.t_HotMusic " +
                    `("musicrid", "album", "pic120", "name", "artist", "date", "songTimeMinutes") ` +
                    "VALUES "
                musicList.forEach(item => {
                    sql += `('${item.rid}', '${item.album.replace("'", "''")}', '${item.pic120.replace("'", "''")}', '${item.name.replace("'", "''")}', '${item.artist.replace("'", "''")}', '${date}', '${item.songTimeMinutes}'),`
                });
                sql = sql.substring(0, sql.length - 1)
                runSql(sql)
                    .then(data => {
                        console.log("获取成功9")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("获取失败9")
            }
        } else {
            console.log("2", error)
        }
    });
}

const getHotMusic10 = () => {
    request({
        url: encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16&pn=10&rn=30`),
        method: "GET",
        json: true,
        headers: {
            'Cookie': cookie,
            "content-type": "application/json",
            "csrf": kwtoken,
            "Referer": encodeURI(`http://www.kuwo.cn/api/www/bang/bang/musicList?bangId=16`),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        },
    }, function (error, response, body) {
        if (!error) {
            if (body.data) {
                let date = getTime("YYYY/MM/DD")
                let musicList = body.data.musicList
                let sql = "INSERT INTO dbo.t_HotMusic " +
                    `("musicrid", "album", "pic120", "name", "artist", "date", "songTimeMinutes") ` +
                    "VALUES "
                musicList.forEach(item => {
                    sql += `('${item.rid}', '${item.album.replace("'", "''")}', '${item.pic120.replace("'", "''")}', '${item.name.replace("'", "''")}', '${item.artist.replace("'", "''")}', '${date}', '${item.songTimeMinutes}'),`
                });
                sql = sql.substring(0, sql.length - 1)
                runSql(sql)
                    .then(data => {
                        console.log("获取成功10")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } else {
                console.log("获取失败10")
            }
        } else {
            console.log("2", error)
        }
    });
}

const deleteHotMusic = () => {
    let today = getTime("YYYY/MM/DD", new Date().getTime())
    runSql(`SELECT TOP 1 ID FROM dbo.t_HotMusic WHERE date = '${today}' ORDER BY ID asc`)
        .then(data => {
            runSql(`DELETE FROM dbo.t_HotMusic WHERE id < ${data.recordset[0].ID}`)
                .then(data => {
                    console.log("删除成功")
                })
                .catch(err => {
                    console.log("删除失败" + err)
                })
        })
        .catch(err => {
            console.log("删除失败" + err)
        })
}


//定时获取
schedule.scheduleJob("0 1 8 * * *", function () {
    getHotMusic1();
})

//定时获取
schedule.scheduleJob("0 2 8 * * *", function () {
    getHotMusic2();
})

//定时获取
schedule.scheduleJob("0 3 8 * * *", function () {
    getHotMusic3();
})

//定时获取
schedule.scheduleJob("0 4 8 * * *", function () {
    getHotMusic4();
})

//定时获取
schedule.scheduleJob("0 5 8 * * *", function () {
    getHotMusic5();
})

//定时获取
schedule.scheduleJob("0 6 8 * * *", function () {
    getHotMusic6();
})

//定时获取
schedule.scheduleJob("0 7 8 * * *", function () {
    getHotMusic7();
})

//定时获取
schedule.scheduleJob("0 8 8 * * *", function () {
    getHotMusic8();
})

//定时获取
schedule.scheduleJob("0 9 8 * * *", function () {
    getHotMusic9();
})

//定时获取
schedule.scheduleJob("0 10 8 * * *", function () {
    getHotMusic10();
})

schedule.scheduleJob("0 11 8 * * *", function () {
    getHotMusic01();
})

schedule.scheduleJob("0 12 8 * * *", function () {
    getHotMusic02();
})


schedule.scheduleJob("0 13 8 * * *", function () {
    getHotMusic03();
})


schedule.scheduleJob("0 14 8 * * *", function () {
    getHotMusic04();
})


schedule.scheduleJob("0 30 10 * * *", function () {
    deleteHotMusic();
})


const getHot = {
    getHotMusic1: getHotMusic1,
    getHotMusic2: getHotMusic2,
    getHotMusic3: getHotMusic3,
    getHotMusic4: getHotMusic4,
    getHotMusic5: getHotMusic5,
    getHotMusic6: getHotMusic6,
    getHotMusic7: getHotMusic7,
    getHotMusic8: getHotMusic8,
    getHotMusic9: getHotMusic9,
    getHotMusic10: getHotMusic10,
    getHotMusic01: getHotMusic01,
    getHotMusic02: getHotMusic02,
    getHotMusic03: getHotMusic03,
    getHotMusic04: getHotMusic04,
    deleteHotMusic: deleteHotMusic
}


module.exports = getHot