import axios from 'axios'


let protocol = window.location.protocol; //协议
let host = window.location.host; //主机
//动态请求地址                协议             主机
// if (/localhost/.test(host)) {


//配置默认的参数
axios.defaults.withCredentials = true; //跨域允许携带cookie
if (host == "127.0.0.1:8080") {
  axios.defaults.baseURL = 'http://127.0.0.1:11233';//默认访问地址
} else {
  axios.defaults.baseURL = protocol + "//" + host;
}
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"; //设置POST请求格式

//获取日志
export function getOneMusic(data) {
  return axios.post("/song/getOneMusic", data);
}

export function getMusicLrc(data) {
  return axios.post("/song/getMusicLrc", data);
}

export function searchMusic(data) {
  return axios.post("/song/searchMusic", data);
}

export function addToMusicList(data) {
  return axios.post("/song/addToMusicQueue", data);
}

export function getMusicQueue(data) {
  return axios.post("/song/getMusicQueue", data);
}

export function deleteMusic(data) {
  return axios.post("/song/deleteMusicFromQueue", data);
}

export function addToFavorites(data) {
  return axios.post("/song/addToFavorites", data);
}

export function getFavoritesList(data) {
  return axios.post("/song/getFavoritesList", data);
}

export function deleteFavoriteMusic(data) {
  return axios.post("/song/deleteFavoriteMusic", data);
}

export function addToBlickList(data) {
  return axios.post("/song/addToBlickList", data);
}

export function getDontlikeList(data) {
  return axios.post("/song/getDontlikeList", data);
}

export function deleteBlackList(data) {
  return axios.post("/song/deleteBlackList", data);
}

export function upToTop(data) {
  return axios.post("/song/upToTop", data);
}

export function getMusicInfo(data) {
  return axios.post("/song/getMusicInfo", data);
}

export function getAlluser() {
  return axios.post("/user/getAlluser");
}

export function getMyInfo(data) {
  return axios.post("/user/getMyInfo", data);
}

export function updateMyInfo(data) {
  return axios.post("/user/updateMyInfo", data);
}

export function Login(data) {
  return axios.post("/login", data);
}

export function Logout(data) {
  return axios.post("/login/logout", data);
}

export function ifLogin(data) {
  return axios.post("/login/ifLogin", data);
}

export function getUserAddress() {
  return axios.post("/other/getUserAddress");
}

export function Register(data) {
  return axios.post("/register", data);
}

export function sendCode(data) {
  return axios.post("/register/sendCode", data);
}

export function getRoomInfo(data) {
  return axios.post("/room/getRoomInfo", data);
}

export function createMyRoom(data) {
  return axios.post("/room/createMyRoom", data);
}

export function getHistoryMsg(data) {
  return axios.post("/room/getHistoryMsg", data);
}

export function get10Room(data) {
  return axios.post("/room/get10Room", data);
}

export function UpdateRoomInfo(data) {
  return axios.post("/room/UpdateRoomInfo", data);
}