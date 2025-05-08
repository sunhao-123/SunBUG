# SunBUG 音乐聊天室（项目凉凉 所有API均已挂掉。。。。）

SunBUG 音乐聊天室，是原 BBBUG 音乐聊天室的 Cpoy 版本，功能及界面几乎相同，致敬Hamm大佬~~~

本项目后端使用nodejs搭建，开发版本V14.19.0，在V12.16.1环境下可正常运行，其他版本没有测试。

数据库使用 SQL serve 2019，在2014版本和2008版本上均可正常运行。如需其他数据库可自行修改源码。

前端使用VUE2开发。

本项目完全开源，可随意进行二开，无需属原作者名。

### 一. 服务端 —— service(nodejs) 

1. 运行 “npm i” 或 “npm install” 安装必要程序包

2. 安装 redis (建议版本：Redis-x64-5.0.10) 存储登录信息 session

3. 安装 SQL server (建议版本：2008以上均可) 存储数据

4. 安装好后先手动创建好一个数据库用来后期连接

5. 使用 pm2 持久化运行 或直接使用 “node app.js” 运行，也可通过pkg打包成exe文件以服务方式运行

   #### 服务端配置

   1. config/DB_config.json —— 配置 SQL server 数据库连接
   
   2. config/redis_config.json —— 配置 redis 连接
   
   3. Component/message.js （244行）—— 配置IP定位API密钥（项目中使用的腾讯API，可自行修改）
   
      ![image-20221004100121945](https://www.sun0623.top/img/sunbug/image-20221004100121945.png)
   
   4. Component/websocket.js（14行）—— 配置 websocket 端口号
   
      ![image-20221004100433093](https://www.sun0623.top/img/sunbug/image-20221004100433093.png)
   
   5. app.js（15行）—— 配置http端口号（由于安全性问题，此项目建议不使用https）
   
      ![image-20221004100629542](https://www.sun0623.top/img/sunbug/image-20221004100629542.png)
   
   6. Component/scheduleGetHot.js（8行）—— 配置酷我token（获取方法见百度）
   
      ![image-20221004101109514](https://www.sun0623.top/img/sunbug/image-20221004101109514.png)
   
   7. routers/song/index.js（133行）—— 配置酷我token（获取方法见百度）
   
      ![image-20221004101224468](https://www.sun0623.top/img/sunbug/image-20221004101224468.png)
   
   8. Component/scheduleGetHot.js —— 配置定时时间
   
      ![image-20221004103229270](https://www.sun0623.top/img/sunbug/image-20221004103229270.png)
   
   9. Component/scheduleGetHot.js —— 配置获取歌单地址
   
      ![image-20221004103325765](https://www.sun0623.top/img/sunbug/image-20221004103325765.png)



### 二. 客户端（web） —— client(VUE2)

1. 运行 “npm i” 或 “npm install” 安装必要程序包
2. 运行 “npm run build” 打包
3. 打包好后将 “dist“ 文件夹中全部内容复制到 ”service/public“ 文件夹中替换
4. 替换完成后即可正常访问项目

### 三. 第一次使用

访问 http://ip:端口/song/getHotMusic 接口，手动获取热歌榜。

之后每日会有定时获取，定时时间见 一.8 定时配置

![image-20221004102003729](https://www.sun0623.top/img/sunbug/image-20221004102003729.png)

### 四. PC客户端（nativefier打包）

项目已使用 ”nativefier“ 打包成客户端，并已配置好功能，修改配置文件中地址即可使用！

1. resources/app/nativefier.json（124行）—— 访问地址

   ![image-20221004102812903](https://www.sun0623.top/img/sunbug/image-20221004102812903.png)

2. resources/app/nativefier.json（126行）—— 模拟浏览器UA（Mozilla/1.0 用来判断是否是APP）

   ![image-20221004102840758](https://www.sun0623.top/img/sunbug/image-20221004102840758.png)

### 三. 软件截图

![QQ图片20221004120655](https://www.sun0623.top/img/sunbug/QQ图片20221004120655.png)

![QQ图片20221004120712](https://www.sun0623.top/img/sunbug/QQ图片20221004120712.png)

![QQ图片20221004120716](https://www.sun0623.top/img/sunbug/QQ图片20221004120716.png)

![QQ图片20221004120723](https://www.sun0623.top/img/sunbug/QQ图片20221004120723.png)

![QQ图片20221004120726](https://www.sun0623.top/img/sunbug/QQ图片20221004120726.png)

![QQ图片20221004120730](https://www.sun0623.top/img/sunbug/QQ图片20221004120730.png)

![QQ图片20221004120733](https://www.sun0623.top/img/sunbug/QQ图片20221004120733.png)

![QQ图片20221004120737](https://www.sun0623.top/img/sunbug/QQ图片20221004120737.png)
