const express = require('express')
var router = express.Router()

/*文章相关的接口*/
router.use("/song", require('./song/index'));

/*文章相关的接口*/
router.use("/user", require('./user/index'));

/*文章相关的接口*/
router.use("/login", require('./login/index'));

/*文章相关的接口*/
router.use("/other", require('../Component/message'));

/*文章相关的接口*/
router.use("/register", require('./register/index'));

/*文章相关的接口*/
router.use("/room", require('./room/index'));

module.exports = router