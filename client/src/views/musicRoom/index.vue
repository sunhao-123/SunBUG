<template>
  <div>
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :close-on-press-escape="true"
      :show-close="true"
      :wrapperClosable="true"
      :withHeader="false"
    >
      <p class="tip_title">使用手册</p>
      <p class="tip_p">我来啦!</p>
      <p class="tip_p">F1 打开帮助手册</p>
      <p class="tip_p">F6 发送666</p>
      <p class="tip_p">F7 将当前歌曲加入黑名单</p>
      <p class="tip_p">F8 静音/解除静音</p>
      <p class="tip_p">F9 音量减小</p>
      <p class="tip_p">F10 音量增大</p>
      <p class="tip_p">F11 收藏正在播放的歌曲</p>
      <p class="tip_p">F12 切掉正在播放的歌曲</p>
    </el-drawer>
    <div class="room-box">
      <transition name="el-fade-in">
        <div v-show="volshow" class="transition-box">
          <div class="vol">
            <div v-if="audioVol > 60 && !muted">
              <span class="iconfont volicon">&#xea12;</span>
              <span>{{ audioVol }}%</span>
            </div>
            <div v-else-if="audioVol > 30 && !muted">
              <span class="iconfont volicon">&#xea13;</span>
              <span>{{ audioVol }}%</span>
            </div>
            <div v-else-if="audioVol > 0 && !muted">
              <span class="iconfont volicon">&#xea11;</span>
              <span>{{ audioVol }}%</span>
            </div>
            <div v-else-if="audioVol <= 0 && !muted">
              <span class="iconfont volicon">&#xea0f;</span>
              <span>{{ audioVol }}%</span>
            </div>
            <div v-else-if="muted">
              <span class="iconfont volicon">&#xea0f;</span> <span>静音</span>
            </div>
          </div>
        </div>
      </transition>
      <div class="top">
        <img
          src="https://www.sun0623.top/img/upload/avatar/5eb4f69be33da51f1019c563.png"
          style="height: 75%; margin: 6px; cursor: pointer"
          @click="gotoSun0623"
        />
        <div class="room-info keep-1-line">
          <div class="room-id copy">ID:{{ roomID }}</div>
          <div class="room-name copy" v-if="showRoomName()">
            {{ roomInfo.roomName }}
          </div>
          <div
            class="room-invate room-left-menu copy-button"
            @click="shellroom"
          >
            <span class="iconfont">&#xe608;</span><span>分享</span>
          </div>
          <div class="room-move"></div>
        </div>
        <div class="room-right" @click.stop>
          <!---->
          <div class="room-right-menu room-exit" @click="showBox('onLineShow')">
            <span class="iconfont">&#xe625;</span
            ><span>在线({{ onLineNum }})</span>
            <transition name="el-zoom-in-top">
              <div class="menuBox" v-show="onLineShow">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>在线列表</span>
                  </div>
                  <div class="listbox">
                    <div v-for="(item, index) in onLineUser" class="listitem">
                      <img :src="item.head" alt="" />
                      <div class="musicName">
                        {{ item.username }}
                      </div>
                      <div class="album">{{ item.addr }}</div>
                    </div>
                  </div>
                </el-card>
              </div>
            </transition>
          </div>
          <div
            class="room-right-menu room-exit"
            @click="showBox('roomListShow')"
          >
            <span class="iconfont">&#xe602;</span><span>房间</span>
            <transition name="el-zoom-in-top">
              <div class="menuBox" v-show="roomListShow">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <el-input
                      placeholder="搜索房间号"
                      v-model.number="searchRoom"
                      class="input-with-select"
                      @keyup.enter.native="gotoRoom"
                      size="small"
                    >
                      <el-button
                        slot="append"
                        icon="el-icon-s-promotion"
                        @click="gotoRoom"
                        >进入房间</el-button
                      >
                    </el-input>
                  </div>
                  <div class="listbox">
                    <div
                      v-for="(item, index) in roomList"
                      class="listitem"
                      @click.stop="gotoRoom(item.ID)"
                    >
                      <div
                        style="height: 55px; width: 55px; display: inline-block"
                        v-html="multiavatar(item.name)"
                      ></div>
                      <div class="roomName">
                        ID:{{ item.ID }} - {{ item.name }}
                      </div>
                      <div class="album" style="font-size: 14px">
                        {{ item.signature }}
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
            </transition>
          </div>
          <div
            class="room-right-menu room-exit"
            @click="showBox('roomManagementShow')"
            v-if="this.myInfo.roomID === this.roomID"
          >
            <span class="iconfont">&#xe979;</span><span>管理</span>
            <transition name="el-zoom-in-top">
              <div class="menuBox" v-show="roomManagementShow">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>房间管理</span>
                  </div>
                  <div class="listbox">
                    <div
                      v-html="multiavatar(roomInfo.roomName)"
                      class="avtart-block"
                    ></div>
                    <el-form
                      :model="roomInfo"
                      ref="ruleForm"
                      label-width="70px"
                      class="demo-ruleForm"
                    >
                      <el-form-item label="房间ID" prop="name">
                        <el-input
                          v-model="roomID"
                          size="small"
                          class="input"
                          :disabled="true"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="房间名字" prop="name">
                        <el-input
                          v-model="roomInfo.roomName"
                          size="small"
                          class="input"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="房间密码" prop="password">
                        <el-input
                          v-model="roomInfo.password"
                          size="small"
                          class="input"
                          show-password
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="房间公告" prop="notice">
                        <el-input
                          type="textarea"
                          :rows="4"
                          v-model="roomInfo.notice"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="房间介绍" prop="signature">
                        <el-input
                          type="textarea"
                          :rows="4"
                          v-model="roomInfo.signature"
                        ></el-input>
                      </el-form-item>
                      <el-button
                        type="primary"
                        @click="submitForm('ruleForm')"
                        :disabled="roomInfoChanged"
                        >提交</el-button
                      >
                    </el-form>
                  </div>
                </el-card>
              </div>
            </transition>
          </div>
          <div
            class="room-right-menu my-setting"
            @click="showBox('mainInfoShow')"
          >
            <span class="iconfont">&#xe8c8;</span><span>我的</span>
            <transition name="el-zoom-in-top">
              <div class="menuBox" v-show="mainInfoShow">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>我的信息</span
                    ><span class="fr hb" @click.stop="gotoMyRoom"
                      ><span class="iconfont">&#xe606;</span>我的房间</span
                    >
                  </div>
                  <div class="listbox">
                    <div
                      v-html="userHead(myInfo.user_name, myInfo.user_head)"
                      class="avtart-block"
                    ></div>
                    <el-form
                      :model="myInfo"
                      ref="mineForm"
                      label-width="70px"
                      class="mineForm"
                    >
                      <el-form-item label="昵称" prop="name">
                        <el-input
                          v-model="myInfo.user_name"
                          size="small"
                          class="input"
                          @input="changeInput"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="密码" prop="password">
                        <el-input
                          v-model="userPassword"
                          size="small"
                          class="input"
                          show-password
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="个性签名" prop="signature">
                        <el-input
                          type="textarea"
                          :rows="5"
                          v-model="myInfo.signature"
                        ></el-input>
                      </el-form-item>
                      <el-form-item>
                        <div class="buttomBox">
                          <el-button
                            type="primary"
                            @click="updateMyInfo"
                            :disabled="myInfoChanged"
                            >提交</el-button
                          >
                          <el-button @click="Logout">退出登录</el-button>
                        </div>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-card>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <div class="chat">
        <div class="history" id="messageHistory">
          <div v-for="item in messageList">
            <div
              class="message"
              v-if="
                item.type == 'message' &&
                item.message_user !== myInfo.user_id &&
                item.message_type == 'text'
              "
            >
              <div class="head">
                <div class="el-dropdown" aria-describedby="el-popper-2329">
                  <div
                    class="el-image el-dropdown-selfdefine"
                    aria-haspopup="list"
                    aria-controls="dropdown-menu-3047"
                    role="button"
                    tabindex="0"
                  >
                    <img
                      class="el-image__inner"
                      :src="getUserHead(item.message_user)"
                      style="object-fit: cover"
                    />
                  </div>
                </div>
              </div>
              <div class="content">
                <div class="nick copy">
                  {{ getUserName(item.message_user) }}
                </div>
                <div class="el-dropdown" aria-describedby="el-popper-6196">
                  <div
                    class="text copy el-dropdown-selfdefine"
                    aria-haspopup="list"
                    aria-controls="dropdown-menu-2805"
                    role="button"
                    tabindex="0"
                    v-html="getContent(item.content)"
                  ></div>
                </div>
                <div class="quot" v-show="item.qout !== ''">
                  <span>{{ item.qout }}</span>
                </div>
                <div class="time">
                  {{ friendlyFormatTime(item.message_time * 1) }}
                </div>
              </div>
              <div class="space"></div>
            </div>

            <div
              class="message from-me"
              v-if="
                item.type == 'message' &&
                item.message_user == myInfo.user_id &&
                item.message_type == 'text'
              "
            >
              <div class="head">
                <div class="el-dropdown" aria-describedby="el-popper-7049">
                  <div
                    class="el-image el-dropdown-selfdefine"
                    aria-haspopup="list"
                    aria-controls="dropdown-menu-8156"
                    role="button"
                    tabindex="0"
                  >
                    <img
                      class="el-image__inner"
                      :src="getUserHead(item.message_user)"
                      style="object-fit: cover"
                    />
                  </div>
                </div>
              </div>
              <div class="content">
                <div class="nick copy">
                  {{ getUserName(item.message_user) }}
                </div>
                <div class="el-dropdown" aria-describedby="el-popper-2054">
                  <div
                    class="text copy el-dropdown-selfdefine"
                    aria-haspopup="list"
                    aria-controls="dropdown-menu-4627"
                    role="button"
                    tabindex="0"
                    v-html="getContent(item.content)"
                  ></div>
                </div>
                <div class="quot" v-show="item.qout !== ''">
                  <span>{{ item.qout }}</span>
                </div>
                <div class="time">
                  {{ friendlyFormatTime(item.message_time * 1) }}
                </div>
              </div>
              <div class="space"></div>
            </div>

            <div
              class="message"
              v-if="
                item.type == 'message' &&
                item.message_user !== myInfo.user_id &&
                item.message_type == 'img'
              "
            >
              <div class="head">
                <div class="el-dropdown" aria-describedby="el-popper-5901">
                  <div
                    class="el-image el-dropdown-selfdefine"
                    aria-haspopup="list"
                    aria-controls="dropdown-menu-9111"
                    role="button"
                    tabindex="0"
                  >
                    <img
                      class="el-image__inner"
                      :src="getUserHead(item.message_user)"
                      style="object-fit: cover"
                    />
                  </div>
                </div>
              </div>
              <div class="content">
                <div class="nick copy">
                  {{ getUserName(item.message_user) }}
                </div>
                <div class="el-dropdown" aria-describedby="el-popper-4279">
                  <div
                    class="text img el-dropdown-selfdefine"
                    aria-haspopup="list"
                    aria-controls="dropdown-menu-8111"
                    role="button"
                    tabindex="0"
                  >
                    <div class="el-image">
                      <img
                        class="el-image__inner"
                        :src="item.content"
                        style="object-fit: cover"
                      />
                    </div>
                  </div>
                </div>
                <div class="time">
                  {{ friendlyFormatTime(item.message_time * 1) }}
                </div>
              </div>
              <div class="space"></div>
            </div>

            <div
              class="message from-me"
              v-if="
                item.type == 'message' &&
                item.message_user == myInfo.user_id &&
                item.message_type == 'img'
              "
            >
              <div class="head">
                <div class="el-dropdown" aria-describedby="el-popper-8517">
                  <div
                    class="el-image el-dropdown-selfdefine"
                    aria-haspopup="list"
                    aria-controls="dropdown-menu-9106"
                    role="button"
                    tabindex="0"
                  >
                    <img
                      class="el-image__inner"
                      :src="getUserHead(item.message_user)"
                      style="object-fit: cover"
                    />
                  </div>
                </div>
              </div>
              <div class="content">
                <div class="nick copy">
                  {{ getUserName(item.message_user) }}
                </div>
                <div class="el-dropdown" aria-describedby="el-popper-666">
                  <div
                    class="text img el-dropdown-selfdefine"
                    aria-haspopup="list"
                    aria-controls="dropdown-menu-8111"
                    role="button"
                    tabindex="0"
                  >
                    <div class="el-image">
                      <img
                        class="el-image__inner"
                        :src="item.content"
                        style="object-fit: cover"
                      />
                    </div>
                  </div>
                </div>
                <div class="time">
                  {{ friendlyFormatTime(item.message_time * 1) }}
                </div>
              </div>
              <div class="space"></div>
            </div>

            <div class="roomNotice copy" v-if="item.type == 'notice'">
              <div class="card">
                <div class="title">房间公告</div>
                <div class="desc">{{ item.content }}</div>
              </div>
            </div>

            <div class="system copy" v-if="item.type == 'system'">
              <div class="keep-1-line">{{ item.content }}</div>
            </div>
          </div>
        </div>
        <div class="chat-form">
          <div class="progress">
            <div :style="progressBar"></div>
          </div>
          <div class="tool">
            <div class="tool-left" @click.stop>
              <div class="tool-item" @click="showBox('faceShow')">
                <span class="iconfont">&#xe601;</span><span>Emoji</span>
                <transition name="el-fade-in-linear">
                  <div class="picker" v-show="faceShow">
                    <div class="face-list">
                      <div
                        class="item item-emoji"
                        v-for="(item, i) in emojiList"
                      >
                        <div class="el-image" @click="clickEmoji(i)">
                          <img
                            class="el-image__inner"
                            :src="item"
                            style="object-fit: cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
              <div class="tool-item" @click="showBox('searchBoxShow')">
                <span class="iconfont">&#xe6a2;</span><span>点歌</span>
                <transition name="el-zoom-in-bottom">
                  <div class="toolBox" v-show="searchBoxShow">
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <!-- <div class="searchbox" style="display: inline-block; width: 239px;float: left;"> -->
                        <div class="searchbox">
                          <el-input
                            placeholder="搜索音乐/MV/歌单/歌手"
                            v-model="searchInput"
                            class="input-with-select"
                            @keyup.enter.native="searchHandle"
                            size="small"
                          >
                            <el-button
                              slot="append"
                              icon="el-icon-search"
                              @click="searchHandle"
                              >搜索</el-button
                            >
                          </el-input>
                        </div>
                        <!-- <div style="margin-left: 10px;display: inline-block;">
                          <el-button
                            slot="append"
                            icon="el-icon-search"
                            size="small"
                            @click="searchWyy"
                            >从网抑云获取</el-button
                          >
                        </div> -->
                      </div>
                      <div
                        class="listbox infinite-list"
                        v-infinite-scroll="searchload"
                      >
                        <div v-for="item in searchList" class="listitem">
                          <img :src="item.pic120" alt="" />
                          <div
                            class="musicName"
                            :title="item.name + ' - ' + item.artist"
                          >
                            {{ item.name + " - " + item.artist }}
                          </div>
                          <div class="album" :title="item.album">
                            专辑：{{ item.album }}
                          </div>
                          <div class="right">
                            <span class="next" @click="addToMusicList(item)"
                              ><i class="el-icon-thumb"></i>&nbsp;点歌</span
                            >
                            <span class="save" @click="addToMyLove(item)"
                              ><i class="el-icon-folder-checked"></i
                              >&nbsp;收藏</span
                            >
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </transition>
              </div>
              <div class="tool-item" @click="showBox('musicQueueShow')">
                <span class="iconfont">&#xe69e;</span><span>已点</span>
                <transition name="el-zoom-in-bottom">
                  <div class="toolBox" v-show="musicQueueShow">
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <span>已点列表 ({{ musicQueue.length }} 首)</span>
                      </div>
                      <div class="listbox">
                        <div
                          v-for="(item, index) in musicQueue"
                          class="listitem"
                        >
                          <img :src="item.pic120" alt="" />
                          <div
                            class="musicName"
                            :title="item.name + ' - ' + item.artist"
                          >
                            {{ item.name + " - " + item.artist }}
                          </div>
                          <div class="album" :title="item.album">
                            专辑：{{ item.album }}
                          </div>
                          <div class="right">
                            <span class="next" @click="upToTop(index, item)"
                              ><i class="el-icon-thumb"></i>&nbsp;顶歌</span
                            >
                            <span
                              class="save"
                              @click="deleteMusic('delete', item, index)"
                              ><i class="el-icon-delete"></i>&nbsp;删除</span
                            >
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </transition>
              </div>
              <div class="tool-item" @click="showBox('likeBoxShow')">
                <span class="iconfont">&#xe6e7;</span><span>歌单</span>
                <transition name="el-zoom-in-bottom">
                  <div class="toolBox" v-show="likeBoxShow">
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <span>我的收藏 ({{ FavoritesList.length }} 首)</span>
                      </div>
                      <div class="listbox">
                        <div
                          v-for="(item, index) in FavoritesList"
                          class="listitem"
                        >
                          <img :src="item.pic120" alt="" />
                          <div
                            class="musicName"
                            :title="item.name + ' - ' + item.artist"
                          >
                            {{ item.name + " - " + item.artist }}
                          </div>
                          <div class="album" :title="item.album">
                            专辑：{{ item.album }}
                          </div>
                          <div class="right">
                            <span class="next" @click="addToMusicList(item)"
                              ><i class="el-icon-thumb"></i>&nbsp;点歌</span
                            >
                            <span
                              class="save"
                              @click="deleteFavoriteMusic(item)"
                              ><i class="el-icon-delete"></i>&nbsp;删除</span
                            >
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </transition>
              </div>
              <div class="tool-item" @click="showBox('blackListShow')">
                <span class="iconfont">&#xe607;</span><span>不喜欢</span>
                <transition name="el-zoom-in-bottom">
                  <div class="toolBox" v-show="blackListShow">
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <span>音乐黑名单 ({{ dontlikeList.length }} 首)</span>
                      </div>
                      <div class="listbox">
                        <div
                          v-for="(item, index) in dontlikeList"
                          class="listitem"
                        >
                          <img :src="item.pic120" alt="" />
                          <div
                            class="musicName"
                            :title="item.name + ' - ' + item.artist"
                          >
                            {{ item.name + " - " + item.artist }}
                          </div>
                          <div class="album" :title="item.album">
                            专辑：{{ item.album }}
                          </div>
                          <div class="right">
                            <span class="next opacity0"
                              ><i class="el-icon-thumb"></i>&nbsp;点歌</span
                            >
                            <span class="save" @click="deleteBlackList(item)"
                              ><i class="el-icon-delete"></i>&nbsp;删除</span
                            >
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </transition>
              </div>
            </div>
            <div class="tool-right">
              <div class="song-title">
                <span class="icon iconfont song-titleIcon">&#xf0064;</span>
                <div class="keep-1-line copy">
                  {{ nowMusicInfo.musicName }}
                </div>
              </div>
              <div class="song-control">
                <span
                  title="将此歌曲加入黑名单"
                  class="iconfont song-dontlike"
                  @click="dontlike"
                  >&#xe9a6;</span
                >
                <span
                  title="将此歌曲加入收藏"
                  class="iconfont song-love"
                  @click="loveMusic"
                  >&#xe8c6;</span
                >
                <span
                  title="下一首"
                  class="iconfont song-next"
                  @click="nextMusic(true)"
                  >&#xe603;</span
                >
              </div>
            </div>
          </div>
          <audio
            id="music"
            :src="nowMusicInfo.src"
            @ended="musicFinish"
            @timeupdate="timeUpdate"
          ></audio>
          <div class="chat-input">
            <el-input
              type="textarea"
              @keyup.enter.native="sendMessage"
              v-model="message"
            >
            </el-input>
            <div class="lrc">
              <span
                title="APP中点击打开桌面歌词"
                class="iconfont"
                @click="showLrc"
                >&#xea10;</span
              >
              {{ musicLrc }}
              <div class="nowtime">
                {{ nowTime }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getTime from "../../assets/js/gettime.js";
import multiavatar from "@multiavatar/multiavatar";

import {
  ifLogin,
  addToBlickList,
  getDontlikeList,
  deleteBlackList,
  getMusicLrc,
  searchMusic,
  addToMusicList,
  getMusicQueue,
  deleteMusic,
  getAlluser,
  getUserAddress,
  addToFavorites,
  getFavoritesList,
  deleteFavoriteMusic,
  Logout,
  getMyInfo,
  getRoomInfo,
  getMusicInfo,
  createMyRoom,
  getHistoryMsg,
  get10Room,
  upToTop,
  UpdateRoomInfo,
  updateMyInfo,
} from "../../api";

import Clickoutside from "element-ui/src/utils/clickoutside";

export default {
  directives: { Clickoutside },
  name: "musicRoom",
  components: {},
  data() {
    return {
      ws: null,
      ws1: null,
      wsKey: null,
      nowTime: "",
      roomID: 0,
      nowMusicInfo: {
        musicName: "",
        src: "/sound/defaultmusic.mp3",
        pic120: "",
        name: "",
        artist: "",
        album: "",
        musicrid: 0,
        songTimeMinutes: "",
      },
      roomInfo: {
        roomName: "",
        notice: "",
        signature: "",
        password: "",
      },
      oldroomInfo: {
        roomName: "",
        notice: "",
        signature: "",
        password: "",
      },
      roomInfoChanged: true,
      myInfoChanged: true,
      barTime: 0,
      searchInput: "",
      searchList: [],
      searchPage: 1,
      searchState: false,
      searchRoom: "",
      roomList: [],
      musicQueue: [],
      FavoritesList: [],
      dontlikeList: [],
      allBarTime: 0,
      canPlay: false,
      getMusicTimer: 0,
      progressBar: "width: 0%",
      allLrc: "",
      musicLrc: "",
      faceShow: false,
      searchBoxShow: false,
      musicQueueShow: false,
      likeBoxShow: false,
      onLineShow: false,
      roomListShow: false,
      roomManagementShow: false,
      mainInfoShow: false,
      blackListShow: false,
      volshow: false,
      drawer: false,
      audioVol: 100,
      myInfo: {
        user_account: "",
        user_admin: 0,
        user_bg: "",
        user_head: "",
        user_id: 1,
        user_ip_login: "",
        user_name: "",
        user_remark: "",
        user_role: false,
        user_sex: "",
        signature: "",
        roomID: 0,
      },
      oldmyInfo: {
        user_account: "",
        user_admin: 0,
        user_bg: "",
        user_head: "",
        user_id: 1,
        user_ip_login: "",
        user_name: "",
        user_remark: "",
        user_role: false,
        user_sex: "",
        signature: "",
        roomID: 0,
      },
      userPassword: "",
      Alluser: {},
      onlineObj: {},
      onLineUser: [],
      onLineNum: 0,
      emojiList: [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC9FBMVEWlYyzdpDXZnSrZniyxcCvZni3xx2Xany3uwl3YnS+tbCvcozPuwV3xx2WxcSzqu1TgqTzpuVG5eSvUmCq8fSvot0/RlCrOkSrwxmOlYyyoZizvw17PkivcozTepTbXnTG3dyvxx2SsaizksUbxx2XfqDvvxGCxcCy/gCupZyyvbizboTDLjSvjr0SmZCzhqz6qaCzgqz7YnCyraSzxx2XwxGGpZyzxx2UAAAC8dhuxXiG0cyvZnivJiSv221X23mH35Xv12VHzuSiubSz12Ezepzf24nH24Gn0yjj0xDPzwC70zDvztyf0wjH24W712lP1zjzxx2Xyqxz23mP232b12Er0xjT221jzvS310kD10D70yDb110f0wTDzuyr11kX12U711kP////AfR/23V1aJBP23V724WzzsiL23Fz23FrboC736o7FhSr48rL110n48Kb354TztSXysCHFiTjYmyruxzzKiyX35Hjyqhv35X/48am1ZSLntzjvwTjPjCb343bdozTxx2K3dyrprCfAgCr59LfAfyjzsyP47ZmpZyzVnTPCeynkrjHalSH0yzrzzlnnoh/gqjvirD/svVbmtErouE/PkSn11EL47qDpz3j35oC2cRvspRz23FnuwVz36Ynyrh7cojDRoWLDgyjBrafWmSrJkEbgoCbjr0Pu3cbuyUOkYhnhu1X18fDz4YGDW06OaF3VqXHOmTj465KLTRf79vHapi/221a6bCTcqz/owEDpy2jwvjNgKRSwbBrwzUHZsn/sxmD01E7inSDnsDDpuELiqS7hqDT01lqXVxi7eyvksUbpqCPkoyTq15fox1zcnyn110bTokfNmFT5+MOtkongv5T37uPtwlG+cybrvUrxzD7gsjfyzGDtty9kMiLTpleTXjTg1tOqZxry5dTdskm3n5jq1LjnwUbmzKrXoznty022gETv0l/RmivLkzfxy0rksEDt3Jbbt3F5TT/asFXutCqihHrz3G7lyXnWqEnfMOefAAAAOXRSTlOfr1C/QDC/n9+PcM+vzzBQn4+v38+/n7/vWOeAcCBAEIAgj89gUHDfgBDP7++fr2Ag32CAQBC/MAASfq38AAAExElEQVR4Ad3VA3RdWRcA4Nq2bbs999m2rdi2bbN2o9q2baRJ/rFtz77FrbX8z355Sc5a+ztGq0XvGP8XYPSEbp3KyioqysvHTp85/I1gXHdFyooVZXfvNjaWX6gtLW09/rVgXCeFIqXoOINhZ2vMtqr6U6UlJV1HvBLM76BQNJ/Vebu5efvoZHYgDkNCCYfTeeTLwcJBipSz3jQ1z9PTk6fyWC6zB4IQxXOSu7Z/GRgH1etoPG4UPSaGnsTlqbypD0XCmeSp7V8E8xSKIp1KGhW8cseOHX4rlyRJ1W57cGHkC/JXE4IAowc9yKdvXry4OjaoOtsvOArEZ/vrbQa5yXLat+vI50B3RZHMw5P+B4J4LyAgthrExy4oREYYCwX6076tnwVDU5rty9VJ1xFasy0ThWVkxGb7Ab5xNAy5IqAJpi+5zdNg/qBjx6GBjSjzI6dz1wb0482A6sUosw4K21CkkS+xppH7Pg2GrihiU1XctajOCXEHZd7MCLqObuOFXWEoQqTVh9SQ5zwFOpUFsnWq39AG54NYgy5nxLrQrgeFo2i33CRkpoW3fQJ6lt01wxCuoBvOD7ZuueW8DSAI1+u2frLpUxxYmF5Xw4cToHfFd4/Apv+5u7vfOoouBwShMOevUNjyOdptNEmsWZfC5xCgf0WV2a5TcVHmOneInzagH2Kr/dEdXLt/hZqMfAAX1w8gQHmFw2zfQ5NuR+/jKYeQf2x19s9ojTseDa77crwF5fqBT0Bj1TW2zIN3BX14CFJ2ot9hqTe70CFcH96NrzWAymkEuHDKYNMwfFTSjWhpQ8NhdD0bdlPMAdfSczvPLf3G8QB4KSspBKg9ZcD75KHmHtuO0LcH/PxWBsdEcb/OdaHIJth+Iq2QCcD/KWB0XNMwlsPmTqIvCYZY8mCDu+kYbDh4sF/14tBoSjoBSr+XG2xmtsyHppZyk6Lo9KgkrhTOkO7hGYIx60NWRfv3I8DsUr7RYQu0y3w8VDxPKYQnT01zw48p3kChFh9zcXofAvQqSZAboFP2L3XeNJUaQkXzII61/EGPlAXnRxFgZkk831jlMOdi+6g6H2+3B7cAlfEwn7IXGsB7ROpBgJEcjqAQRBOG7WPIqNQ9VKoMbppAyD/ij8VJ9GIv5bLUiU/t1tacFpMIBAfDvmDb8WBrNOZrNkfEPSzupNCatSo6kTT3KTAi+YwFhAEXefUajSbQjKc7cuOwewehQ6HKZSTWLAJAtE0+KTEVGg1V8XsxjLLfBuE4woH/Ew9a8A5Fr2VBA0+B4VNXt1i0fGjkfi6GYXF5eXn34G9evkBoFXutii5gDZn8FICYsxqEwMQXyY33cyEXYi8lXyt5mH+CldPu+Yuso6/vL3qLQGviF4pEovj8/ASTVmLRW0Mgv5iUM/jFqxIXVr1FItBqTSatViuQCPVWcVYo3p8cIo0AuCCT08RWvV4otFgsQsi2iqF65bJIVk6Xl1/3w8jkq2khYibTarUymeIQqF0ZXUBiDRn8qgelfdvw8KsXQ72yILxCIb04MZWVM2Pya56sNkDWh9fUXCouPlGQmJ5KYi1o94ZHsX3nvpWVFIr/2vTzqaQpY2a9zbM7st2wSZMmjerSbvI7v9P/UfAv+Gr4OqMH0vgAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC+lBMVEXxx2XcozLxx2WnZSzxx2XboTCsaizcpDTYnCylYyzdpTXZnSvuwl7dpDWpZyzYnCqpaCzqulPBgivtwFvboTDRlSq0cyvLjivxx2XksEXany/hrD/gqj3YnCrtwFvepTfaoC/ls0m+fiu9fivcozPqu1WoZyyraSzxx2XfpznQlCqqZyy9fSu3dyvrvFbPkiq9fSvLji7gqjzZni3wxGHxx2XvxGGlYyzepznxx2UAAAC8dhv0wzL110jzvS324nDpqye0dCv35HfZnSz12U712lH0yDbzuSnzsiL354XboC70wTD23Fv0xjX0zTvzuCf12U/12Er232X0xTTxx2T0wC/221byrBz12Ez110b0yzn22lTEhSvzuyr11kX11kTdpjf////23V3dozN9NB/zsyPYmyrAfSL59LX47p3gqjz365H221n23V/23mKQUSXysSHPlTH10kD35Xv10T70yTipaCzTmTHyqhv100HztiXyrh7SjiP47Jfuwlv69fHyz0XswDvMiSfpuFHMjyvHiivbnSn11ELVmCrIkUb5+MbFgybWoDH48Ka/fyr36o3CfCjrvVb24Gj24W2wbyzntUutbCxYIxOxXiH24GrTlCq5eSqaWRjgqDPkuDrImUHpsC3goyvgsTjjrkL1zz359r/krDDooR7nwUDtphzjpCbcmCPBgyu5gjffuD7wzkro0qPEhzjpv07RpEXArafpzWL35n/eu43vxGD343Ttx0zo0pDbt3DEjDX37uPvvzXZpzLZsn/ZlCLirDrlsUbptznZsF/yy1/NmFSFPiHiw5vwxzz5+MSoZiz59r3TnDTlx3G1ZSPAcyTuvDPxtCa6bSV3TD/guELHiSSskYny5dR2PhzLurXx5aaCWk7inB9+QhaqbSmKTRejYRm1ZiNrMxXfuUGXdmzark3kuT/msDT48anyz1fz01PqpyHx00vJolijYSzz0V3ix4b48ar48avenSTRoWLWqlPx0kfw24HhvFrbvpuMaF2xFyDvAAAAO3RSTlNwML+f7+/vj2BQz9+f73CfQK9wv8+fv+/PvyDvn7+AQO/PQM9w79+Aj2CvIICAQL8wEICfQCAwYL8QACZ5xVcAAASaSURBVHgB3dUDkCTNEgDgs23btmq6x7ZtrG3bts62bdt4v23bzJq9WJwv/P4MdUbk1+WqNsteMv4/wIJRffuXZWRUjR06b/TzwcIpHQ4nJ5eV7d1bVXV+3brhI9o+EyzsoVKpLn35lYylIwhL6onv/P39l7R9OmjTQaX6PjBQJBIFatgyOXHF9V7aOZtt3lPA0nYqVd6qIEV5XV25ItgRaGR9DMJwwebsNvdJYOkQlWqVy3XgCCMiIoJBrQsWGWVecWqFs2PbxwHUX4L6bw/ySwICSvgHGRUKh6ZRUDYKxgx7DLRrrOcH+BUVFfkllfAjqApHY684wo2CAXMfAaMe1icV+d7ccNP3C78APqMiWMSW7wShJNcI5rcGi7z931GAkM/x/Pz86yBuZ0FS+A2x80rIKSFXwBzdCvQ/nOdy0RHKu4zQKq+4jdAeSF79Tb/5moFipjG7twSzkpNDXDsQ2m23v56HjgN4ywddtdtP5qFCwhouUZLxa5hdWoAeZbt27QvDJSBQKTRxER3CSUoxSrXESThqKY05sgWYWGbRaVCx3Ru/oN35100oxZucQWstOes5Qi4v2zOsCczKOKoHcBlXvLn/EPohfwPa05j8iU4DiKKY3Vs9XZrAqCaQ8r+amhB0bIOvF3xSU/NGE/g6d2AT6FuVqtcZfaAXr9XgmmO+P51AJ+37IfkIrXwItLmzm8DQqjiLnH0LxgkN1Cz3+bHI71d0xv4XTlAqHgMG9YObwflwKyE7itBVKHkXXfRLSvodpvVtnMC0wiwJMchqASKthM74CkLL3/8A7YPNV8L/AyfL8cLBOojVXJ623tQM1klyLHKZZm8mQgWf8iEORjAOhEFyWkdYciINSlIaGpu1vQW4Bn3SsQODFBVUfB4YjCPUckUQnCG53hoHYybjE2JN45tAZ/+09TkW6BSI8roKKpVaUVeOz5xM7m1AjIewqXhQE5jqf8EQbtUTLLZGFBSswBEcJNJ463EDuEfabQ0zm8Aw/3McSRwIHduoEYkcDocIytksOQEd8jYAPUqn92neS91spwzrsZCz2EajRqMxGtkyHf5/TqSEQyGlPO2Whk4tNt9U2+dKLCwEIdexZDK4l6Bc762PUqpxA4n0yS3A3J7Oe2JDWulmq0VPfHbLtpkg9Lh8bUzhPSV0KFS7hV49vQlATHCuEIoFtXdsK8M+rIUoXWu1Wlc+wJ/ZuEOxBdWTW18CA5yrhcr0WhymmBiovFP6AJwgvfau1J0Qe7Zy0tzWoG1HwWo1ZWN9fWFaZGR4uNME8u4KMUVNo0H9O5XRfR69l7oIBKtJIUXMiTIYJBKJwRDFUVKEpDmelxC7iR69+PGrEgTNTKopFKUYQqmkUNSkWeoO1UJ/brR/0mXchclcc59rJkk1DpI0c6Xwe+2WguobvZ583bftzmTS7sdLuVwzlyuVxrtDoTyRXt2p69Peh7mdPZ7srTQez+3m8UITErSbEhsqo9vPfcaTNay3x5Obm/0zxLaz6cX0yur2fZ7zKM7tMi0zMzPLtL24oYE+qNf0F3p254zrN2PGzHFzXv6d/o+CfwGMtgjPhHP8HAAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC9FBMVEXHgyXvxGCoZizvvV7bmybUmCrimR3dmyTsvljuwl7Tly6lYyzksEblsUbhqj3hqz/emyTZnSzboTDdpTatayzbojK1dSutbCzepznhqz/boC/XlCTxx2XksEXYnCrWkyTxx2XimR3xx2XirUDZnS3rvVfxx2WmZCzGiCvxx2Xxx2Xxx2Xxx2XqvFW+fyvVli3dpDW5eiumZCylYyyvbSvuwl2oZyzaoDYAAADimRzGLAC/YgDcPADYOQDaOgD35X7ioynepTXzuSrxx2X12VH48KbTNQDJLwD243L23mLiQADany3fPQDOMgDZnCr24Gr12Ej12Uz11UP0zTv110XhPwDgqTv10kDLdwvzuyv////ysCDnoh/EhCnppR/zvSzlskjntUzztyfOkCnUmCrqrSf0yDf36Yvbnib9+PHztib48q/uwlv24W3yzkPrvVLdoi/Ngh3NgRfioiSubSy+fSnirUHy4c3859fhYhXGdSD36IXDaQTclyH59LX23VvyrR7zuCjZkRfmnh3uuGLpoEH35Hj0wjH137TwxGHhXRntRwD365Phnh/12nT22lT0xjT47qH221fINgTttCrvw07yqhveSAbrujLplyfqRQDwSQC0dCvzsyPotDfpuFDoq0fGbQXsknDnQwDwxETkQQCHMwD47Jj232feSg/fsYDkcST/dCD78uP/pnDSVAikPQD598H/iEDgVCD/tYiXQQDgZSPkeTLmqmT47Zz23l7svnGjSwDmpDbPUSD0vy7yyWLx1ZjMRg6xVgD001vtqlHjeybOiSPUXxnhqnb5+MXlrzLIOQzachjNfhDtriPzz1jsvlfsxZXIiivKjSv/YADuwDrrtFfxzI74XQDlz7/jbEDPiUDvnoCPNgD/fjDlpWHwwnvXnWDx1IXvtUf15aP000/nfjrSXzCnZizUQArz0UvouED24o+oZizquzzojzzNhCPTdR7PTgvlbRbgjCjv2L/DmYDzxDbDbBD/za/Tk1CVPcTvAAAAOXRSTlOfUO/vz9+vj7/fQFCvvyDfgO/P79/v71Dvr2Bwp49wIEBQ74Cfz79ggN+PMM9ggDCfYCBAn4C/EAAT2c7CAAAELUlEQVR4AdXWA5AcCRQG4Ng8x7Y5191j29batm3btmLbtpOzbRuv10Y5/+7O7Kv6v2pj1OsjzPMBRu+YtMKjwspq+rRlm4YGi+czklxd73vkeVhZWvr7z1wwY1CweCWDce7ePSZTJpNKle61X/ur1ZsJAwLCWqhfyo6AZGczcSJ3/05Ne3HuAGDdegbjUgSvUeLmJmnknQACQmNfTqN1X8iorv7Yo8ktH0u46d83sa+5ciVxQUFXapXyogK26NoLhL5g3dIW8kEisSU2mUhiiy6kXya91UQsKPqZSCaxOT+C6AUIa56SAvVCFURIJInQY0eq9e+oVHyVikhmcy4IlvcG8xmV5OpqVR2ELwTw/pGD1U18fFSR2ehPnoK5PcHopHO1ZCL0a2pq6lQkDnr+KFHIhwlGogi9nSuYTegBJid9ygzCG8XFxTV8Nvq5ywfA8am4jszJodOp4ondwQZXV2lGXgEOUlKKhZxbieGsz4StU0qdCC1K0JUJxIRuYNL9r2TZvDiopJSU1IjQBzfCWd8k8wGUpLDR24pMC2eqeGEXmOHhoQTAvSyEjpCDXr+xP5zVQEmGlVLBBmgUmWet74rHdYENFXmtgBL7pYiD3noAfZes1JD0KzChvyhxEGVwtCV0ggUV7jhwozh8dAY9c34/9FnHU0Pi3eJyck5L5RqFPQAf2ymdYLoVgIwTkviQ1OPHPgkPd8H7DhSuGy+vVgYAloCDeV3AUqOUMiMauRQQWSwWKwv6IfHcRvwMVLYDs83q7kAuZWbzJCAcUhsaGlKhT+FKeBEZrWcsvtEG86NuwF8jV8puent7eXn90B741xtypzVpFs6RxocbuwEFrJMjNmCidWWRRlMXmOP/BBbhiH34a79pxqLpZflhfls6wTL1E4VGXohd1/ebZgyxNuTb+G3qBFPU5fYauTsW/Fu/CcbulkXm+73S7Vx6Tf07LEKLHa7vJ4cxLSwgrHR7N7CZVm6v0FCxi22Vd/e1pW26iCGwAFPpq93ADBotAYQWO1Vfv2/vG487smuPk/5NrMrZkJ9W+lL36wEWcRNEYSis1N7H3XPI6WSoGd8C31U9wIyXPQtB+GDYqYA/9xzY1Vp+78ChQP0zJAb6V3139roJzPX01CVk2vuEYn856bsnADFG5of5jtna+760XOBJP5uQmavF/mgOaOvuToQPJyQG+t9O7XMjAyHItQCSVgXnwtuQYOQ0rpAY6K/q794Kwi5KB8Yu+o62qkqrRagAEpGrvl+s6v/uPUsspto5R9HpOp2OTo9yRp4COIn4jdk20PNh0ziclLXFYMBBIBK2nTDIE2jueLHY1tHHx2w2GsOQWL1TJTJriGfclOXjbWwePTSZ/EzIs92VyIRhPEUXTVm9ETIKqaQi4wjDf+xuQhBk4oie00vmLXpeXx0Gz/8AMCX8sQfKBQAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC9FBMVEXQlizboTDsvljdozSqaCzcpDbouFDAgSutayzhqz3ZnSvuwl3UmCrxx2XwxWHxx2XaoC7YnCu5eSvRlCrepjjhrD+1dSvqu1TYnS7qu1WoZizUmCzbojHmtEq0eiLvw17uwl7xx2XcojHepjjksUa2dSuraSzirUKycSumYyy9fSusayylYyy2divBgivksEWnZSwAAAD///9dIwChUxvQlTG5eSqtZia4cC757Jj343X476PfqDm0cyv23Vz33FrpuFH34XD221fqv1v35Hn10T/Zniv0zDvxx2T0wC/210f232PXmyr11kX1xjX22EmnWyDNkDT36o7any722lTFhSrls0rSrI/12lL89/Pyh2f11kTw4dP4jHD9k3birkPKizbTmS/spRz36If1yzn59bmTSxv354H200Hzvi30wzL48/DMnXbyrh/Ys2H365PvvjS+giPHiizvw1/pvjrYpTH35X2tbCzx5t7zuyv1zz3ztyf0yTiOQRDDgzryqxvzsiKnXinjrD3fqDT23V711UPQkij9pm/alSLAgCqnUQWwbiuHMwD24WzpsC6xYSr86Ve8dhv5+Ma+eDLmzKr24nLXt5vUnD748ar24GjlxpqlZkDHhjj12U62eEv487P9wmTsg13YrnvmwEPntTzpym3z2nqddkGtc1B2Phf59r9/QhDp2tDyskDt17LQeUfUp2z+nnXTq0Hhg1TzoS+pZyz5rlOfbBpkKgP06+TAfTT47pzzsyXLjSrRjST/vGz/r2710lPipSjhzL96Sye3djf3u01xOAreuIHfnSLav6+jVhzrolvvzUXZsVLSjkbUoUvpyEX94k2fcCtjKAPZwavs1WewhWHu47CCTBm8kjjXojmCSh7ew4vFbT71llbMnVDmpSP58eXCaDvNo2bHhjnq0rXxxkLo0ILzz17iwmr3rFy4bxWyZRDLiSf60Wa9eRq2ahDLpo/6wF7yzleJVjLv67q0kUrc0KHkw4tnMAy9mUKpyyTfAAAAMnRSTlPPz6/v73DP79+P359Q33DPr4+vv8/fcDCA758wnyDPv4DvYECfQIAQMDCAcGC/IL8QAEbyv2kAAASFSURBVHgB3dUDlBxJHAbw2LZtp7p6bNs7WNu2bSva2LZtO2fbtvHv2b25Rfh89z1Xf7/qqmanxc+Y/wYYOaDvxB4CQY+F07qPfDIYP6l/QoJYLBAIrFarj8/w3uMfC2b2VUC+P39+tV6v0t7euCk/nzNu/KPBgMkKxSciEZ/PF1nsq4EUyRM5nK7dHwFmdqHqheoVELWaJwKiLZLKN3EKBs18GJg5UPzKqzx1FUsiSZawhCvUfItTBMYWxE2Y2QFAX/EcQfzGSg4wQQKSWVVqnlOkxx4ljnWa2QFMVIjjjhHETzEn2Wz2SaYpRCKkhEqbdJUgjsV1bg8mKcR+JA3E1rVBO4LWLj8JokrNt98+ShDEznizeVRbMF6R8JofuWfXdhD1kCBKsFYUHqCmp1+7R5plY9uAiQk+fuQvCEVcIohLP9bX71jLjgmQvAi7Il5f6kB7SD/Z0NZgpFhAktEIEvEDJahTME3RMP3zLzkQ5B6pkU1tBfqKl5HL3kWpF1ORgxI/O9e0lSC2v4CcaST9NINagdFWo7EJXayszNqFUncSvzYD+tUsT3QjOHgpQg6S1GhmusBUwTLfuw60rbKychtCkcHBL8MemNH4pg1FZMFgKkIbjH6afi4wSeDrew2hlc3A04DfCFrOjnkb4wg4K+QiQk1GUjPKBbpYP1jVhNCN5mPoJn5/OZtpysYYOc+QFQGz+Bo1Q11goTU7uxGau76Fk6PjGO9jM2MCqDPA2MqVMAkA3+LW4ETDBvRPbBh/zDQFhERjbHMNfrhqVXH8v8DHyGBQp6DimYcvm6AvWULHeZ6oJfuys0+7tQKJFXR65HHqxtnyMP40JCSZtaTqDsZ5SxEVx4aGE8XxPVuBzIM1BoNhzZo1GHJHImEtgRei8AAGEmmzRV5mMBr83ea7QO/83e7r38PNYYiFQmEVvHRivmUjAwZuGgx0OmP9O2VDXGAKJ9/d3ct9L+Tura/Uzle0UOgG7+jZW3trMK5586D7+lLaCBcYz4FTeHl5e+8vObeOz+MV8nh80Za6jXrVurPnSvZ7e3t5uR9y485qAZBhnNjMK5+VlJz77rzdbhGJLBa7fXNdgUqrWtcM3jrkT+vV6uHrzqnWBaaHemhVev3qlmyuS9J6FEk/unLkyO5TUTlnuDNagZldC2IpUQQEDESlYu7bUhSaLs/UKdMycnP8ud0WuQBkVFKBUpeZLqWIVqvSahMTPYShUlc/pywFTuACkM5J1SDkFKESV17+jZyqh1P9qJzSil6L2oKxXc3VynCKpEulUlk5pDgQ+mHO/vWKw7Pbf5emmM3VYRTJDJTLiynwtTxc2dLnHp7X8VNJiTQg4TqdruUMUD+VmwPrgX4HAEImu5CRlhYWplSqPi8v/6JWB/WoHH+3FOh3BJCpfYCcyshIy9DV3r9f+8BZP8NN6Tb9Uf+HmYM1GtmFqNzcXKX+QaizTqs4PGbRY35ZC8ZpqFyHlJZ+WcblpoyZ/YSf4szuQ4tPn453Kyuj0bjz5y54qt/u2OlzINNnPfN/+v8K/gYlkb9r3hJF0gAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC+lBMVEUQDAbxx2W3diulYyzVmi7uwV3boTDlskjdpDWoZyzZnSvxx2WsaizRlS3YnCvgqz7YnCzRlCrTlyrhrD/Bgi22dSutbCvVmSrdpDXbsFHfqDrboTDpulKtbCzxx2VXPxLxx2XgqjyubCzZnSzboTHnt0/fqDkAAADZnizpuFDhqz+zcisAAACpaCy3ficAAADgqj3irULxx2Xuwl6nZSwAAADxx2XvxGG8fSvdqEMAAADanSr23FvzuCivbizepTfaoC7DhCoPDgvzvy70wjD35Hb24W323mP24Gj0wC/ztCT0yDb1xjT23V/z8vCHMwDzvSz1zTv11EH1yjn221j35Xv/7VjyrBz232b11kT2zz3zuyrzsyL11UP20T/22lPgqjz12Ez12En12U/110f11kYAAAD354Tot0748KTjqzHdozL36o/36IbWmimblpT23V2PioipaCy0cyvjrkK4eCp9fGP243NnYV8qJyb24nD0wzNfWFZcThjwyT+aTQr59r7ztib47p69gyi9giGjXBHxx2XaliLvxD+8eyr221XwxWDkpCXqulPNkCqAe3oxLy57dXMhHx7yrh9AOznxy0T47Zv55FPlskj365LpvTr36Yz35oHxsCIeGQjKiymwrayHgoBvaWj48av59LfgmyB1bm3yqhvqpyGkoZ9OSkjo3IiskDlrXyNMQh311VUPDQR8d1GOPQSeVhGajED11Vn21kWufiCjWxDpzEkVExPw2E/moB/47Jj22k1dWFDuphzp5KfotTnqsSzzyjvppB7tuTTQkCY9NRHmqinxyGThoij5+MVfRBPtv1kHBgbo2HqLhFF6YhrhwETAjSnp6bq6s3jnt0HxzVnlti/WliaRaxZMPA/SlSq4oDPGoy1dWTuplz7WtDW5r2tcUyVNSSuIcDnPzMtmUiLW09LKw4ZdVjDCvr25trR8el3Iske6t4jSjiMuKxi5p0vn02cvLyWKfz8TEhHKyqGcmnd8c0DToi4+OBvzzl/0lW0IAAAAO3RSTlPvUN9wv8/vgN+f33BQQCBwYM9wrzBgj59Q54DPj++AUOfvII/fUCBg779AQK/Pv7+fv49gvzCfIIAQAKkLk+YAAARFSURBVHgB1dUDlORYGAXgsW3bnnVt2bZttW3btj22bWtt27b/VJ9Oqmft3XsU3C95Lxxw/+/M/wPce+eclUOLPTNXTh6+6tcBbvTQwsKbN4uLPZ66uqiohRuW/SLAzVuQk1P4xC671WpzOKvzHo+yWDYu+3kwEOrfHlAQCARFgdludTiNpgYLmTzr58AdUFcQ2BoOh6NhhynMJ20gzp8lk2fjfhLck3P1AIHNimUqlUpmAodNKLAjQpoYELhkij/w64dxYpXBjUFBjcFNTJYmzCd0chDDcBhAx3N1F4HDdAfVeL3ejBNBbmUCIhxOmY7PCKDAqPqDgdB//+PPvnrwsTNdaWldnRn1buUn+3dcRpL80KFHKIv7A9zM13budvXm1KPXr3d11mx72+WXlhvz/cHy9S5XWWl4eZVvJ+0LEG/RXGUdHVs/x8z6u1EAddoW0euhpXFHfbs+jYl5j0ZrE70Z3lPlwrIGBctdrnaRqC28J+kWtrtNJHq3vQMDN9b5DWmAK7QttL08Lh7rx7e9s6W9J+lo3/rTePw4FOC2u+JKyzuSKvr2xqR9UNEOW05hfUMRfgIKlnreuFVWVoGN58uuTlr81ipsyzN63uaQ6SgY7qlOdvmFdqbTu6ffRX1Sz1OHDEHBnLpq5w6//Xs6vTXbPsLWdz/PAPBsCQo21lVrHdtb+va/kFFzor7xAVRcfonP0BvUT7ViICrF6LCaX3zlGxjOqy/X1yNPnzJ2/84WaCc/Z5LyuUQAVD+QJ3Pa7AVCDYupbHIHB7ublMxYlkaoMPveIrmATmxWX8LArKg8kxZOoQDhex2gnsDRCAlmu82hlcEDLkmv3EQdhILxlgadzOkTbA4rAcJicdhw/N7XVMqHOVeepq5DwSrLWbnJ6LSBIAjZGiRsIaG37zsBHabQnT8NezQWWvhSkxaEHQhBKAwL6/sMaL8+3MBnICNqjR6Dgcnki3KdTAujstvNBUjMULdBP2Wv+IgcOcHp6Ll+D98McoCgV9isYCBQR/qyVPEhFVcPJ/gwciQKICPIFxFhBOKw+eKAujElVbyvViohNsMJSIv8wYzAQLpALjUhxAnI6YR6Q9Ze6B+UEA1wAtLI/h+BIYEBXAFfqjPJZEajMSs7O/twqlgszqw9KSHyKjd1k+bi+oNxwyjn6IlwEjAmU5YYyb7MYyoT0lcfj4wYc/t3aSyFck7CTRTw5eel0lrVkYePqVSqgww90eDrT/vxl28ChXJFL+EyEgUCPl8HkQroemK6AcYTGQETQAEmVuCvpRMlEjqXy+By6RKJr66G+WJ9PwCZMgqPv5JOJBL1ECIxnYfUc6NJEYN/7v+AW4zH44uaDQYez2BorqxUX8jNJ0XcNeUXflnjpuNDQkLw14o2Xziee4kaHUlaO/VXforjJk0sKWltpVIz86MjB02b8pt+u2On3odk9aJ/5Mf+PwA/AFPw/pnXe+CNAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC/VBMVEXdpTaraitdIwDDjC/vxGFj///Slirany7dpTVj///xx2Wbmmhj//9dIwDksEXboTDcozJdIwBdIwDxx2Xls0hj///ksEWnZSy1dCt769Vj///any3YnCrqvFWoZizxx2XYnSvxx2VdIwCsayyraSzhqz/aoC/KjCrouFDZnSyxcCynZizcpkHrvVdj///gqj1dIwDPkirsvlhdIwC+fyvuwl65eSvdpDWmZCxdIwDZnizcozNo8+9dIwDxx2XirUGrt3HFhivuwl5dIwDAkEMAAAD12U/11kP10D70zDpdIwCHMwD47pzztCTqu1Pxx2XcojH35Hn0yTj23Fn24Gr12lPzvSz0xTTztyb0xjX0yDb35X3yrR7ysCD0wC/23V/12Enzvy/0wjL36Yr11kXzsiL11EH10kD221b12Ev476L110b23VzzuSnGhinmtEr24nLyqhvanizaoC724W3365S6eirKjCv487P0zjztwU3rpR6/iTXcpjrmtk7noiD48rDR6I3QrkTYnCqubCz47JfLiCbemiLOkSbgq0HZmSW+fiv598K/iC3Ulyq/hijfpjT36pDPqjbRvXyDThX232ZnLgb23mT24nHxxmL59bj48av48aeycSvhoCTlrzfR4XTgqTzMmi2qgjd+Rwv35oLt232H88+PXR/354Tzzl3s1WOH78vQ0mXR5oXR43vR2m3QsU1vNgnNwljxzEXrvkHquDjqsS3Py1/47Zjvw1/z0E7jr0TtwFvksUatayzmqCeI9dH5+Ma2divS6pbsvlj23mKF6shj///m3a3usyl+7NXz0Vbvxlf01VOkm2C4sl++aQmI+N3iuFfvwjqjXBLS657S7qbdnyf59rz343PT9sXR6JGaZh7jymKpfSPiwkXt3IB6SR3cz5qXbjnRuW/k0HvPpjDOoizOnSjl15S1xX7YkyF12sq20q/WqjC9nVCI99fjxE6ziSvU+tTiwDzQtFvSw5Xt3YWncCPT8rXfpC3Mnky8kjnyyWNsYAcKAAAARnRSTlPvMO+PQL/fMHDf79+Av7+vz2DPn6+fgO/v72Bgj1CvMJ/PcM9A72AgIO+f7xCvQGDfUL8wQN9g77+AcIDPIEAwv4CAEL8AkM3rOAAAA/9JREFUeAHN1gOU5FgUBuAxa2zb9sxaXUnKtm22bdsa27Y9a9u2zbOvXjKpV7vDw75HfV//X9046RR3l9VBwKM3BpORdbTu7zf4hmAQq8sq+Ee3RxYv5vEy/f2HDn8w8jtdWKzJNwKrWCzWwkEPDOnTcuL0ZV5qqt9/5lTJtK79wPIqdAI6Gvyv/i/+jqeeYTKdBrfl0OHDvzeyWIOX3Gyn5z52AJC3f/B4PGKHlOl0/1wf6Tv1ugmYOYnP/7sRRDbulDQ06cXSH0Gz6dsj1YIBc28EJvTh/yPW79wIxHdqYbOkKZfFanwXwwlTtWDgXBTQ+R2OK/HC7Z989EFCjXmzML5hW/17BosNF9ECBXMnwbz6/Y/r6uq+cB2v2S58Z39ubm1t7aeffV6cFx7wXzCEv40VrQ/bODVbGqP9gT9D98SCbi0tMaC1jfMbAjY9EZo1IwYsO3GSmbv/yWuR+ubXxy+UJ7sStvzyJey3gr3wngtNRMG4008bpPr4F2DgpwugWtsLzOpLsD+PE3IZN5Q3AwHzLp90Oq40x4DjNLADoDiXNzYK5vJ4bqejCQHlycgEG6E0KrR5PaJgHC/VHTOhvDXblRAFKSqdV/ta5QwaDM88ZHE66H0of701u50DzgQKrGsqF9FgqB8AqUdCgjeTs9vaOQnmzW+8Re0DBFmVD9Ogv99uMTDFTd/DwB8uFyeSFzbnUADsg1ebVoyAMzjmZjr0FCgogBdTQJJDH1aw02lJCDiVYgPbJCbBq2az+cXCzEB8wx76xMkUmiwfAkpEdszAlJLgFbVaXfJ8hqRBT4EUlUnG1WRVRcHwkpdwDOzFeRi4FAgE0tnp4BbaSwKwRV5rsLRsOQ0WrD9C2DG3kwQ5EklDOrvCI5ZSAAxQaIPFiZ1pMHP9WhFuw9wk2KPX6yvYFeCuJsEupc7L1QTLRiLX0sAMEwEEBRwORwW7Cjw41pEADii6OBsBvTLWKoEgwV4mk1nFrgIPGgoYIwN8q6ciYO6KaqOKwLfCwDqD07Dh5Q1uC0YBLxcMWD0l5ga6V1BtUhIUcIOyWDDMto8ECqsmLfHsVBSAvRAc1cl3kQDDImmbHSfBVasmWJg/Pi4W9BQAQYJ9dlA4nkIQu0mgCX6VP2cuAmBND4ePUoCIlEikklMgku/8/yffmHD4KgzsVipVSrncZDIeI0Fh/giYRwEUIQoYdTqd0SiTeUnw9Vk6jwC4H6Ng4JgXloJrPUiClTNu9o7rDgMHrZHSajUaEtyHRm4EnqssLV1TVFRa6HsW9t1vBx7qkZTk85WVJV7se2swn9EbBoYx4pZGqjNjGOx7M+bfGDCuXS9qge4ZNwaju18vaoHuR3e8bw20/gXLRao5EYRtugAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAADAFBMVEXpuVK/gCvYnCrFhivfqDnwxWHboTDuwV3ZnS2oZizxx2WvbiyraSzhrD/SlivdpDWlYyzxx2XmtUyxcCu9fivqu1TdpDXTlirxx2XksUeqaCy3dyvdpDTxx2XmtUzvw1/gqjzWmivxxmPdpTfksUbgqj2mZCyxcCynZizTlirvw1/ot0/dpTalYyzepjjntUzTly61dSusayzrvVjWmSvxx2UAAACZQwP22lXgqTr110b7mj76pEL8iDf47Zv48Kf1xTT22FX343T12U/zvy/35HjzvSz232P232b1yDb22E3354X22lL221efTAj21EHZniv24Gn34m71zz30yjr1wTDxx2X10j/zuCjzuyr11kX35oD3zlGubCz4wEz36pCycSv23Fryqxv+aCz6n0Dotk7VmSn110fhrD/10Ev22U7bliH36Yz23V311kTooh68eCDztiXboCz35Xv3x07zy2DmuDerXw7gnyT1xzX4u0r+bi7Il1OlVAv59LP23FzboTD476TzzDz+ay3Ymyr23V/2y1DnvT78gzbtv1n12Er6p0P5q0T7lTzvxF/EhSv7kjv7jzrnqSfwwTb0wjLyrx/zsiL4uUn5tkj31FPMiyTdozT6okH59bnpulLAgSr11lD110j20lK3dir11UPsph3Tkib70Tv9fTTwy0XBfxvJVhfjr0P0yjj8gDTmtELy0FexZBK5fj75rUWzahXMpGvvvTH48av/3kT365P+aSz6qUT36In598DLhSj5s0epZyzyrB310UTztCPgpSz9eDK4dyrssULPgCjls0nHhx7OjyvpsCykTg3hqDK6dRj5sUb47qDIiiv4xE3dpTf0xDL5uEm8eyr111j47JbGdyOyVxHMkSO3eTf1ZSj5+MarYBarVg/vizafRQbz7bmrZCbToC/mpD3gv2nCjELpvTbm0Izy4pDt4a7UrWPmsDXn1qHKjCv01Uftw0/lyGrw2GnuriTqzFywax/kZCTjcinoijPalzSxayHx23bCfiWDg+f4AAAAN3RSTlNAgK9Qv3DP72Dvr8+P3+8gUN/Pv8/P77+AnyCAgM+vn3CPIO+/j6fvgHC/gJ8gzzAQYEC/QBAAgn6IsQAABNFJREFUeAHd1QO4XDsQAODatm3rNueubVvXtm3btl3btu322bYxpzi1Pr836+z8yWQx6bb6LeO/AZb2nrpydK3LiFnjpy19PZgxbnhubkZGba2Ly8mTa9YMnj30lcBqqk6nC9nQWC/KbHAzdaStd3e3XjT05aB3X0i/IXVwcJBiEs9MN5M8Mc3aeuak5wExfYiDD1+gVCoFfB+pRNRgatZrQq9U9Vr2ImA1Wae7ESdQsbhBQVyWSsmPw9j3RdG5qj7LngeQH4KlKFlmsbednbfYzFIJfO4Ltab4XDyIZ8GA+/lcsR0tgZ5w8aa3mKsSxGFQlVwt5IB4FozThUjiBCzxzYTYmr01sXSaHQi+gySTBEVd5R0JnP40mKHT1WN8lXlnQs07EHtr6DRvM0uZIvW8v4TWEKhY9RRYkLuB7aDk7qHF4vkgYhN2ioPuL3F/F8ZCxdgnwdKM3MyODaogu/sL4FFD//LTv1n4Ltx89RoGLwCWeAJMzUhNQ7KfzDvpAL7atAnA9rvoL6gJg5o6USfHUKjo8QTom/F9GkLv/gjgw61nEfoWQDRCv/6SImV/HIPQFq2hVJG8jADdan8gifwRQvbRdyEdbYU90GkyBHNswe83FhUbD4cn9yPAQpcOUpoMPYpoyN9+cRMiRj5fC6DFdToBprh0dMiQ//ETMvTerdPoo5rY7QnRSLb++Al09taf/6A7ODjoOpYAs07KQ5G/7WbybfQ+pSwGfUG/SPssZn1k1h/oNnn3JyhGeB8MeQLofT1SL5DTz6L2gqx96GvaTbs9cZez839HXetysjeGCbUAWi89BmvUzUxbCjUKfZC0jlzujv/6uBWRzum/oa6odOdIjwiOodSxNe9JIGfC+0ldXU5Hcy5YxGJzkKqxnNx+r+vernbyNQ8Gx1DieKmOAL3cNXqmbTU1yslpV3vOfksQl8tSVlwjr0tyckpKdy7zKOYFlDjmjSLAePciNRa8Ob89KuootTryhkoF/x+mbVbBURgoyLrsgW/Br24kAaZZhyaKKiIpOVRqgfP+4BSBgM9PkVrKq/Op1PzqaxYNvgWv6xMJMNTaWqjGLJGbKZTd5cFMnxSfOGgDWGpZNoWSXZZarzVCRZVNKwiwesmVIs0hrCLY1vayBcOkUmgaEjYba4SB4MZ6Bs9QerDl2NwnfnzTrnwTodGLMCYTk4g82Wy2pwg6U4MEBiSHGBx8gVb7QU+AZWOqtkVo1PpmX5NbQ0NmJiS7kUy+zXJ94loGFFTq2HLMZgIBICZVndPiQg7EZCKRSKb76Wo8Hy/IcZ/NoKebQJ/4M1rG2kQgoZWJzXjIO2WBGuFVyD9c4uhl03/Z02BpfPwZTrEQyEYUFqrX6zXnEToVUcwx4vl+9gdWPNuX+oHgaa9GCDsRQudPdcoQCtum5UH99/PnPd8q+wUGnjHyOMVtdxAeoOQMoyEA6veyPzDn+VYJQqE4YjAYI3YkngpDsvOhO9oM+PQtlTYw//MAYtUQhaIwwKDd8SCEh0tLYPomm/7DXnY+LFuUnKwo/DlA29bWJgyAbL/W61DO4lccWat6JCe7uirCw/38wr0q65rsbUaueM2hOHT+2NOnv7uUl1d3vcl+4LwJb3TsrurZvXv3ictXvPU5/X8F/wKICwsvgfhFawAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAADAFBMVEVaJBPIrUVaJBNaJBPIrUXpulbIrUXWpzlaJBNaJBPwxWGnZSyZWRjmtUvAeyDIrUXaoDKmZCzxx2Xxx2WtaSbUoDHZni3twFqsaiylYyzZnixeJxPboTGwbyzntk60dCvcozS4eCvWmirRlCqraSzPqDyfbjdaJBNaJBNaJBOnZSzdpDTboC+nZSzZnSvTliyqaCzany5aJBO8dhvirEDcozRaJBO8dhvNjivTojRaJBOITxzMqT5aJBOIUyRaJBPlskfxx2XAfB7xx2XaoDDpuFDrvVYAAAC8dhvIrUVaJBP////aoC723Fr232TLsEbAfyn24Gj35n736Y310T722lP343X79vH24nDzvi323mH110b12Evzuin11UP10kD0zTv0yjj11kTuyE335XvaniutbCzYnCrBfiP12VDcozLgqjzsv1q2dinmtEz365PIhiP476T487L1zz3UlSn24WzRkSbsxEjhpizNiyTBfB717eP36IbvxVfu2HX23Fz12U3yrh7eu43SvGjlrizx11nryULy5dT47Jj47qDzvCv0xDP110j8+vP354LrvVT221bysSH0wC/lpyf18NzDhCvuwjr0xzbLslHq4LnepjfwxGD0wzLztCTEhzj5+Mb59rv48q3ZqTvksEXyrBzdzIu7fSzk1qLpuFDntDP48KjyqhvztiamZBnRmy2tkonnzE5kMiLeuj22cRvVqXHtz0bkx0Xtphz47p6ycSvxvC7gpzLPoEvZsn/KlzrQlDfSo2CRUhfZv03LrULJkEbkwT7l1JX59LfIp0DIjCzmzKrZtT7598Lp04nEhCbcxFvNmFTxzkLiw5vqpB/TpTvbmST36InTpE7WmSnBradgKRTHqkPx6LHPt1y1gjWkcUN5TT/z0Evpz3zbt3HlxWrRtkjx3ozZq0Ls0Gvt1mODW07u2WzjuTjry1iuf1LoyF5vPzHWyMT18fCihHrxyjzZx3/q5OLdskrXrmPcrTh5PhW3n5jusynxy0enZSzsuDV9GI4zAAAASHRSTlOv74CPn2DPUO+/3+/fIO9gQK+/7zC/78/vIM/Pj9+Pj7+/YM9QEM8Q35/PgHAQn5+Az1CAv59An+8wMFBAIO9gv4DvMM9AEACKwztbAAAEe0lEQVR4Ab2WA5jkWBRGx7ax3rGttWbeS9k227Zt23b32LbttW0bN6l8afd6/q6qDs7JvS/ut+lv5t4KTwwY8NTcvyEMICDDNnRavWFN78J8YtjAFf0o4wUqGzetmAdbGNCLsIFCQZsz1dU1o7HR3b3mSYKYOZwg5vcszB0A/MZnRhwsKQkLM5lMAQGHiZfc1i19bBixprdBT1o7BtmPmCQSiZNTpFp16lgbgoya2ZuwEjlSrVRGcDIl8cGo/FD0ToSeHdejADw/WsaSRSP0vdxPoIwLRjtZkJCTyHNRT8JghBJYZBIQCjdL5e+joywqMj7yXd1deO4IimY5Eo0OikKFwSiEnj+PPNmLugqjJwYjGQ3IkD3JIxxdZTHzwWz20C7CBNd2gHUVeXu9RRakU45i2VNmdxIGl7h3Ek5XdRaSAy1LOgkjSgIcwndbXiSFijOXHGP+GeahJUWrxTa6gzDYNUxNjeGrbQTxhgzxKyqr7OT813A6bjmP/LM1ObYlHYSprm+qN5M9fElAXkdHQbiDDrFYH8HstnLUlK3JsthmM8LojAyV2oT4CQ6hDb1y8Uzze3Z0nRJ+QkGG0uSyHNsjjDC40aSKzKxG/OshXxDEMfR2RaW3V+I7CJ38DPgdnt+Qwg3bUkZ4oPFXlTpTeRMh5Na2A/1wsdK7ea/H7Q8uIzKbr4kNKcllUXcfZYSn3a8Z1ZIIweeH7ch+55K3d1VzUqIo3Sz/tLr6x3ij1gcqgODfQdAZ1U4crtwcKkpM8mr28tqbCCeH1E/JkUSm0kLtrXPtQo3YmBqZqRRIhaEij0SIB8VzlZlOapVRpy8o1ZTV3u0o+GhVagmH6yc1p4eKRKLboelCqVxAFVBpQcgGwTePEVbV6HVkiQiun1xqFl4JFwrNJB9xfKsaOoIxKzRZtf78dsElXwwlnMAQ+MmvYN7HUvIS4hzHeLejo+TWqJa8ekZY6JIPJUiDo+QChXkfCrjKuHdxIebt0oqpjqL28B9mhKEuTQax1piqdpLAVgtz6zAvLgL4mLQGzIvXG0oVrVm1t+ofZITZxS4Feh1pRJI8iwXGVpKnpvKpAi2ebrNoAbK6+HfKUO3CuIHFIjlM8axcjC9QBW643d/hbB1XfCDFQBm7MS5ycHUUX0jyZIGgfcsYAfKQcxMYYq3WSBnA1bFoPgUaggL7pi3uKIxzdt6fUqD30Wm1YHxL80UUnwwNtfCtyzrfBO5zPrC/tMCg9xHr4nn0QIow3g79kLyndUHX+9Lz7EBFdgoo+lPQFM3jTxy8v3Xk9K7C7OXsQI0iu7RgO803wLgxbioDPsj626Tut8r1MyyBv2gUF3AhxdfBf7JIbO2ey9aRs3q6Gc+eYbHkAJ/r4DH8Jw22m3XkpF6eDwttNx1cGvC4jh7Ia+MX9/rYXT+Z4tJi8InYE5SRVogH9fmcfrw/Pg38WV//cy+DAZPA9yFAkf74VXw2L49fX98fx8TgIX/6JjAU4yGzqanZQ5jJ3gXI2EE0BAbwf+tdY/bs/+Dl5A/QvT/X+wy0pgAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAADAFBMVEXepzmZQwPxx2WycCvboTCZQwPvw169dx3ms0nirUKZQwOZQwPcojLFhyvwxWHEgSHXmivqu1OnZSzxx2WubSzYnCvZnSzani3RlCqycizqu1Xxx2Xls0nTliq6eivwxWKmZCynVw6ZQwO/eiKfSgbhrELani7xx2TZni7xx2XZnSvksEWgTQjhrD+lYyzPkiqZQwPuwl60cyvaoTLdpDXxx2WZQwPhqz6tayynZSyraiyfUxepaCzhqz6mZCy9fSvrvVikWBcAAACZQwP10T/12Ev11kX232XboC712U3DhSrzsyP36pC9fSr35HifTQmwbyz1zTv0vCv22lj0yjj221X35oH1yzr24Gr23Fn0xjX1zz312lL36IbzuSj48KX12Er110b0xTP23Fz23V/22lPzuir232b23V70zjzyrR30wS/ztSTxx2X100D11EL0yTf11UP110n110f11kT221b47Zv243P12U/24W3Ymyr35Xv343X59r60cyv24GjanizrvVbpulHntkzdoCf59bj35n7LjCrxyGH365KqZyv+6lb48av23mL1xzb24nD36Yvhy5WxayDztyfzvi3yqhvHjifiqi++aQnx0Vf47JbrrifzsiLuwlzzvy70wjH47qH0wzLjrkLgqjzyryD487O4dyqkTwXHiiH5+MbvwTnmtDfnoyHZmyKHMwCsaizjpCfxykzxyj3WmCfRkij01FKdSQbclyHPkCXopiLy2E+3ezzvpxzr1HjDgx7ZrkbUkCPlskexbSfxzkXotC/5+MTXrU/jnR/ZnSvepTf63UqlWBbUrV/fu1WrYRnBehzWoTamVQyxYAzYqTDcojHn1qHYpCzToTLaslfr1X3gwG3OoFDmoB7YqjjttCvtw0/jrjnv00rRny+PPwbCcQ7ouUHy4YzlxmXy6KjOix351UK9gzzhyIvVtHu9h0zw1WH0uCft4azx23Xz7brtxEPJm1vy45Tz0F28gTbgxYC2dSXgw3a6chrlxFvft0vtqiB7K0QWAAAAQ3RSTlO/7++f74+fz4BQz1BwcIDvv6/PcK+vUGDPYO+Pz4/Pv5/vv+9oEDAggM/fv5/vgO+fMEAg36+An99gIDC/QHCAvxAAiyLqRQAABMlJREFUeAHVlQOYJUkQhNc2z17bZnU/27ZtjG3bnlnbts2zbZvVY50dnx7ir4ws9lj7O/X/AOYMG7k6OiY29oFpAwau7Qua1POJnwEm3d8rqbw8OjomJvbEiZqaGY8/+thjPQEYtKz7CpP6Wa3WpOI9B4moy4079dnrNbW1PaYDMHtN95FG97Jav2SzhWqh0CsJoG6cE9l4/QbY+0T3PUxYgNkN6XqBQKBPN7C1ARfOeZcO9l7rv3BwN8CEKVYrW40P+mmhoaFhmYJ0tTegOAqa1RWA/iSvJjIsQZpFoWRJE2hBvcH7fEHB+vXrj177bvjELsDD1iSuQUCTUnxyubyqhCINzdQbuDCVXeyoLCRMndAJGGZNkqj1YdISeX14ePjnjJMnc3Jyjqm1qNtj46sqCgkjOgKTrNY93PRMXrI8/syGDRsOASj6WYHGi5UwOip1hKjxHYCHk4oDwkhalq8e+qHep4OrR0Iz8UIJqnQiHBWrNAqGagPmlJejEkMwgSKPx+yffgALnPwqwQ+7IMJMTFFFbtz5Ie2AftE70OZE0H8nBfqheGGRzZkyzLLS81PbAfdFu1Fvawt3srOz3/v626d5Yc1NiGET5LiQia3AipgXlUQIJFCqmnsIr5f7spoABc4pdlTrLAdCJrcCA2J2KFHvsW8+yfKlxYefyf44PD6tquTZp/yRjcBOhFPNsvwYMqIVGBl7Codq6SBHmlyV9tYhwKhPk/ueAeB7uNiBUzfBXQww7ZrVCkyLteEUEhIADUfeuHwJgEPyKl/yETqg/6DWPkkHYJejEUhsA04gHleAfRU06d0vfCWULN5ZbPGw70exlesMON1EbTEJ+/vS5eRkuPt4of5jjfYbt2xwWnXk/F2kNqDGaMcpAl7Nh1euvMmTQvESaP4gvvh6QcEteIr4ogpZWf7u9sBOm8eNSoQafdAfBs8DjebPFOA1Qm1AofTY4Kzm5dblJ1JbgUW1G8V2nCugFWrwkcFMqCB25qC/8ZgyM7AWDpMeagWG1G5iIk6M8Ko16Xi9Xo9P16jZjX5YgKOCiUznqL1bgXm1LzmMNo/SRZRw4RVgMBjUajZX0ui3I/yMShZMtL/h3ra9NP/CRo7YDgk0INFyvV4vVysJEBWNfqMDFiCb8qmMNW3AkAubRHzE7sG5XSgx0ChU4Wrxm3WWuvx9EWPa7dYJfS5UiPhimxMibpdCoXC53Eqcx2lDjByRmZVbZjpMZcxtf+Im3y6sFHGMiB0iOCUUDtrtNoTpEFXmYYGOM5Z3vATm3z5tVjmYYsRmd0LFFRVtgcPzYZ48GQx0jpGytCMw8TYkqjM4TKMYQWyni6C28B2iajML8z8XkbKy8700nkB4Ic+sEjk4fCZzS9FNsO5tPhxel0uG/oaUR7pelUMIhFJdnrlapRJlFBat27p1/zsVOpmlzATHh/4uAKwRFbU9V8fKqzCbL762buurL2fILOQ6rF/o7/a6H9fnfFSpJVcm0/FTN71yMPWjMmg/R92WMvPnnqwJY0NC4rbXkckWZmrqRZbJdHgflbFt1LJfeONWjAiBiovbfGDz5n3HSQ0RjMVLfuVRnPfgPbsTExNJJCq1IWJx77m/5dmdMHfoKkxzl/7zD/t/E/gJ5a1EFlb1XxkAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC+lBMVEVns9zxx2TXojhns9zwxWHZnSzgqj7any7ls0jVmSqsayy6eivuw1/YnCrTlircoTHany3UmTDhrD/gqj3jrkKtayyycivYnCvrvVjntUzqu1TksUdpsdbPkirRlCrvw1/epTbxx2Xqu1Xxx2Xxx2Vns9xns9zxxmPxx2W0dCvmtUxns9ypZyynZSzirkLepjhns9xns9zxx2WlYyzLjy2ycSulYyzWw33twFu+fysAAABns9yHMwD1zDrgqjz465T35Hn47qD48qz24Gf36Yzzvi31xjT12lL24W3200Daniv35X7243P47Zz48KX59bj0wTD23mL24nD23FrYnCr365Hztyf22Uzxx2X221X24Gr35oH////221f21UL12U/23V7110n11kX343a/agn36Ib210v36In0yznzvCv35Hv487Potk3yqxv110fxyGH36o747ZnzsiL10T7232XyrR2OPASjXRb0wzLqryn48amzciuqaCn23Vz21FHnu0DwzUW4eCqvbiz1zz3TkyXx0FbcojDeoSblskez2e7vwTbzuinquje8fSzepjf/umzztCTiqzD1xzb0wC/AgSv354XqulT59bv598D5+Mbw+PzToCyQyOb12Fjtv1nFhiv476JxuN75+MPvzUv354TbmCH0yTfuwl3uphz0yjzSjyL75FDrqyT3zl/487TZ7PaFOw693vDjrkKVRwq6unZvk6XWlyjaqC6EweOLuLKmsJaBsripZRbkhlvexl/2zE/kpif232S6fCD23mDqw0H+nXX/s27/rHHyryDjsjjNhhnVu1LwyTz5q1HLjSr+lHd6veD+l3f+pXOOPgbDcQ3jnR/Pix396VTJmTr/71r4wU3xtynrxU/asD9wqsS+himXgmPTpDPDqJDEok6cUg6cVBbHexPopCD7omh5orDMoULv1GHw2HC/jD2jXx7210b6r2D5tFPpzWjDgiiRtsnCf2qTrp6xhXmxoqjj8fjL5fOyo6mQp5fFkjFYxnAiAAAAO3RSTlMg73BQcFAwz7+vYL+vv4/f7yDvj4DfUGC/r8+v38/fn59g78/f73Agr0DfQJ/Pv0CAv4BwEJ8wECCAAEgEswgAAASSSURBVHgB1dUDYFxLFAbg2rZtW3PXtm17Y9u2a9t2mtp2+2zbnNttFs/Gn2X2fDNnLlss+p35f4B2bYYPGFTrntRhcJ92vw7GzxoTtmH58tpatzs/f/fuXr17/iKYP1wul4fl5KTKrAavMf10GhaLHdHz58HIlnL5tmUakUikUdB0Vq9RuykNW1ra52cAHB6W6wXRSiUpWqDX0GQGozZqU3Fpafs5PwXmj5bLl6U00dl4pxNvEioFIoUOFZjCitzu7QIgqD5smV7JZlnI4eFkC8tEj9b7hD2+IrdHzx+BCfIwhV5pWivhrORyCRHha/FCn2BkredX5MKuQkEbeZhORDLV4Liuuvo6VyJHshZPF4hocOVRdiollzkiFIxvKU9VCIQqCZe3uqGhYTUvkROuYiv1GrQpOMUjJnN6COgSloNOYOO40HooXFycxUlvQqdAV+FIYHYPBgs2bLDS9HRW+Epegy+8xAgyi03SK2ReIwNDpUjzxP2DwPDljVZfR3VPQR3R3xNcdiW/aKu4fRAYVeuVaSDAcQMzQGBSnmpeRFEkU9zTD6bXPvYBCcFV/6S+fjs3ghwE4h3lJ8St/KCPew0K6CwyJ5EHxep6HpGAs7FgSwGwVdzRDwa6040yuNvwFhyB6OLV8bYTuRGSGqeQFARi9g/1gw5uhtFASyGxWTYcgUskEhNXciQ2lgluVoUsAK4GQD4EurS4krdVZFwEh0DgREhsKryQdEpEk6WfjF0CFx0CpuVHab2y5xDkleMqG1kCQ7aonGylIEWhe2EPgpyEmzXSs39FAOzO0hoNa+IQBHmHpaqx1NSoWHg2PFw1a47C/x0thDsu0pNdHQQuM4xeGe2bWwjy7odOGBNbqIzWi+7HIkjsErgEivS8Z0WJH4zAFqJTnH4GFbfuC4VCupIk0D9Gp9yz5MCBQj5c88bqzn7QCluMYRhfRp4m+a1oeIqmoNqX2L2wozslc/2gHfbC+uOHdiLN2ZOjF2lOxvlH2AkOJ3g2Z3QKHEvdS/cC8Oy+z44dO3e2bJtGo1DAq4bMWnb23M0b1z7Z9/EqcGRjSdKcAGj1KQAFu8BXN87chECnSxdfzC42pKLgzLXPQcHig+DrJNiRH8wAq75Q73gCzpWlGk7fNsPkWZvBDvXiVeD5iQHQAq1Xf+mbodF4Gdbfhc+KxrJmAH8cEjjj4AQFarW6ALz4+vsPGVrtRbM57Z7sVfPtwk0PP7hy5TDYBX+9DkKA71+XKu2YrKhiOPaWKIbBbF5Hja9ySC+BpWr14hAwGYClBUvBIQo/nrrebt+cvQWDsWsv3C3mU4qk5eePgOsHAZjpBzCtxwK4WV9KcEAST7334L1KKjV+ywOGQ1oeGeN58w0AhsyYHwzgJOMmt2IyTzwqclCqqBg+v6qKUlUphcPHeDZnJk/56ct92x5MZoJUWuQLrI6E5XcyMpNn/9z9oWdHsZh54nw5mkhYHbNxXXVm8tR5v3DLmt5VDJOX9xrMuuyPMpIy+3b6lZtiu27DrsKsqK4uyUjqO2Xib7ntzpm48En69fwHbuz/C/A9EEsaHgY9M2MAAAAASUVORK5CYII=",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAADAFBMVEXFhivepTjZnizQkyruwV3wxWLcojHZnSvZnSzdpDXLjSvhrD/YnCzmtUzYnCq9fivvw1/mtUy5eivirUHYnCvaoDCxcCvboC/vw1/wxWHdpDSxbyvtv1rfqDnfqDrksUbBgyupaCyubSyraSyqaCzgqj3wxGHxx2Xxx2XWmirhrD/TmC7puVKoZiynZSylYyzSlSrrvVjxx2UAAAD23mPZnCr232a8dhu+finupR323mDdpDX243L12FD24m/23Fr24Wz23Vzany30xzX221idSQT24Gn0wTLzuyrxx2XcojDzvSzfqDr22lP476P11EH12U710T/12Ev110f11kX343b35oD0wC+4eCrtwVv23V7yrB347Zn11kPRSA3FIwX36o+jUwv36Yv0xDP36IbLPQvOMwarYBDZSAeREQDxzUz221X35HnxzkT12EnzuCj23FnDgyjqvzvdPwT59bv35Xvnox/pqieubSzqu1Tkr0LouE/0yzn48anViRbYqUTxyGHGiSvzsiLztyb0zTtaJBOxEQPztCT0yTfkskj1zz3////lfhTLlkHWyMSpaCz487PYOwXjoSOwahXaliLyrx/iu07465SzcivouTjhqz7kjHHXWS/q5OLu3ca4DQStLwfJLAbkyKPGNwnkwmLu1njEhzjLkjO5dhvZsn/AfR/yqhvPkSnxzD/kqSzSjiTpsCzlrzfMjiq0cyvEKBPgmyDiqTLyqxzig2bqo4zDMAnccVXmyW7NmFTgt0TJkivw4qX79vHw01f47p3z3Gzx0WHZXxTSni3nzHHt14PgRQXsti3VlijALgXVQwjnxVbhbBFjKxTfoSe2cRuaWRjcYxKwbyzyzlbxtinLl0bVqXHx567zTAHSnzzRLgTnhBbaUgr4UAC/hDTSXA6LXEHtw0/ba0jWYUnHKAbmRAPTVj3felrONwffeVniw3Xeu43q1LjWrV7QSSvXTwzgbxTTdxPBraeac17HLQfLNhPUOQbPnk/bt3DvryPrqiPswkOowEX/AAAANHRSTlNwcGDP76/f71DvQO+Pr7/vn9+AMK/vj8/PcIC/gL8gv4DP6iBVjyBg3yCfEECfMHCfvxAARQjagwAABJ9JREFUeAHd1WOcHVkTBvDYtm2ju69tm2Pbtp1kYjtjz2QQ23byrm3bu3U6v70ZhB/frc/P/1bV7dN9uq18xfr/ACPHD1s+LiFp+NQF3Ue+GMyZNC/dZrMlJCQlFRQkJg6cPeW5YMUwmUyW/pDF0upDDcaQvxO3b1cumPJsMLeXTHZeKORwOMIglVZvMLrURiqVjAnPAPDzEOdhhFgsJug8oUobanTRJW9jMCYv7AogP04mO8PDuMzgmJhgE1uMcYIeC0krY+zIrgDy6UF2MdPs7enu7ultNnEJnkPIRy/sAnqTeVPppdLLavVZZ3fvYDbBU2kNRk1hvqWOP3ZhJzBels7iEOfKKVCrT61NOQuCi3FUsLku2Ush5w/qCObIZKwg7FwGpayysoxCfT06xdnTbBLbYSiyxSM+f0AH0Dv9oZYjfpNy/HRR0enXKP+LXqveAkNhnMCKiy6oRRzepz2YY7PpVfbzFCrkQZRRTpEtmMQZP1GFUZctUGTdwXu0A8NsgfogegGlsois/ZQ/omELs+mmn8gvxKjJFljC4vAh7UCvBIM+CEuj7F6zZheA3ZTfSVDiIaoIJJeQSDNxfL4DLEr40KBF4IOcnJyfEFi9Vu3secxD5HHyYqTRhQTr8e4OMCkpEDrQ0+7moNpV9A3l2xT1lkseIrI21CKQ9xe+zAEGJ4UYYenNlNsIrCk6TvlK7Xz5vdVpm0+cOOknqirM95LmOV3r6QBTCzQAeETEPbLDfkqV2nkLPAf05LQhog2oA4CmdkBnDGUJsZuUe7dzfv6aQjnm7O5pDmaL6UJ41Nsis9EOTtcy2gMX2JpHbK66uwHORgk6fcFMLgbHD50N9LdmtrUHiYUwE0tIF59PKy9PK/X2NsdAnrAL0elDTxqBmggHmJyYrDMa9KpwOsFlmsj3gckWE/Zw8rXTwM6KrE3VGUMdYMH2SGgRqlWF2zExl81mstlcAoM8C72maCLYmUad6ADdlduyUQutSsijYwQUxHlCMg8N4OzBRC3UMQ4wRdmYDy1ApKam/uhz4MiRvXuvH/DxcX0/FeqqQCKFieqts56cpT5KSTISoSjg1tzcHBCQ6/aWr68rCVADJ5p1xsInoDujUZCs0xiB6LVunx36KCDgetSn7667oNFl53vBBtBg6+J2p3Vhf4ZFAD1cgBjcPt7xOQneWHeBzCuyMtto1viZDgA1gdEqAaFD5JOjhw8BWIcA5CVooOr6eGjQDizsI2+weOVnA9HsO3p4x78A/X4YDNTyYMbMdgBqpFx+1eIlAFLoCyA39xcAUfcf59tiDxbP6vxd6sGXX1UgkvwFjLRnzz4AV+4rpFmZZH5x10/lID6/QaqwSLxu7Nzx5Xe/+sLS/rfC8mD+lq2Q7wqgB7/ukVShiPvededOn9+irvi/Q8vchPaFfFcA1a8vzo/LywrL++EGlL//LSeIb7TGFy991v2wcBSO43F/ZubRVq1a9TZtkxNtI/VB8cQlz7myBgzBoe6sj42NXb+xPsK6NX76rBdcivMH9axpasrIiKBSrQdnjFnyMtfuwgHdpk0bMWLEgJmvfE//R8E/96rgrQtctCsAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC9FBMVEXSnEG+fyvani1dIwDboTDRpE/AeyBdIwDboC9dIwBdIwCpby/ani1dIwDZnizYnCtdIwDUmCrJiyunZiyraizfqDvdpTamZCzirUKnZCzSliqzcSvgqj2qaSzdpTbYnCq0dCunZSzbojXNkCrZnjBdIwDxx2XZnSzAgCvntk7ksUftwFrLji7cpDrdpTddIwCmZCymYxW3dytsMwrjrkK8dhuubSzfqDuCTBnxx2VdIwBdIwDxx2WqaSzxx2WoZixdIwCvbizpulPRlCrls0jxx2Xgqj1dIwAAAAC8dhtdIwD0xTT11kPYmyrEhzjzuSjAfR/BgCn23FrboC/23Vz24nL232bzsiP23V7ztib24W710T/zvSz0yjj23mL24Gr12Ez221j12lHztCT110nyrBz100D110f0yDb0zjz0wjHepTb////35XvzuirZnizmzKv12VD0zDq2dircpDL15MbetDn23mCsaizsvljbrlF1PQzzuyvuqBzxyDv24GjyqhvYnSvMjirIiir8+PLDgiLrzVzysCHCcg3iwpq8bA3ntzf12EvyyGTUkCPWliSvbyv0vy7hqz7Skyjpsy/hpifhpy31zz3IhSazcivyrh/moB711EL12U7221W+fSrDhSveu43RoWLRljjLkjP47+Ptx0zjr0LUihXTlij11kXfqDrqxVb35Hb110bz1VP01lqDW07twlH35oHUjx3u3cbzzl7Snz7vxGCkYhnuwz7uvzncrEnqyIjenyRvPzG6Zwryz0OpaCzjrTW6eivivE7JkEbPhRLbqD/hvV/y5dTktEjmuj9aJBPNmFTHeQ/qwTnrzqbCjGGdRwLSp4KOaF3GhzagSgOpVQbWp0jrzmL05tLsz2ewbBq3ZAqyXgjsuDTfmiDoy2uDSyTz3HDw2nrLu7WtkonoymjnpiPszJj02V/kwVju2cLhrl2XVxjq1LjSoEHZoE29ijimci/Zsn/oyGDMiB3BrafTnFjVqXGISheu1Nb5AAAASXRSTlPvz89Qn9/fQFCPr2AggO+Az9+fUN9QQICAz3Bw34/v35+vv98w79+vv4/vYBBgcGDvz6+fv1DvcIBQ37/PIO8wIM8gv78wgBAAIfhILgAABFtJREFUeAHVlgOUXEkUhmNjd7OKbdtmvbZtY2zbtm3Htp2sbdvmrffmTCM+zn8wM93/d+u/xem16xH1WACbBq8hiCELHxroO50ggCDW7nxIYBXxc2hIyE9hRNicZc9Pux+waSDUnLsu4/DhkPa9e6+FEXVNTbnjVs67B9AXYgxfPSMjI+Ngl1brU5GuD6SfOdqU2zZhwV2B4QTxxNL+4N6t4YvFYr6mUqvWt9KNkWlttinD7gQ2EdP7bofyu7lKoUoqlaqEQdxKn3QT3Wg5ds42YdAdwGBi+PYNGQc1QSrBr4fq6w+9LZAKxRotSZjP+fPmuwNriaHYr5R6/IBIveEhiAoCopMu86Xl83iD3IAhRK8ElHAZ+zne8fEpHJIQV/roW8uLFNZ83ohpbj0sRoiJUP0VxIy3g65y0IceAiG/Ug2hfGk5hbw+rsByxDlgv3oRshywk/JG9fs6VEoNOYTZ6lnoNdIFGIC8cV2Ebtq7xUSfeEiFXK2a7EIu8hoxzwmYj5ikqxY4rM9O3fgIXdkniKIyWWg5koKYkU7AFPQLtu3JphL9fgP0Tihkotq2mK2spJiJDmBLHUohbUeQHWsPBo5gIKinCdFJxrQeYG4d+h4GwEADBl7pBgQUQIeJDdd9wRjZA8yuQzXkCN9RkT6lIpEr0QNEMLb2ANsuo1qy8F9kL8Cegl8/75DCQlTgSBgwtEx1ANfYVBYmNVugBsT2EKiUMK0msmkMxDoBLeQQNQjhbNQEH+/A+4/asbhpQ1ZcD7CsKZKNbnrXIvbXbJgv0J+I/bE0SsnFifDC5bBEhrxqJ8ByOwGqsy+oLiB0saaGidhvgp+PjwRugSaXJEXHcRxA7lEZPdA/sIuvVCViEtUnqoRKvoY6dZBIriuNru7dA+zIPWYx0k1qbVdj41dRie3t2C7mVmor9J308u5EZVVLeoBn2tIUsvJWU1pzc/OlrEalUhlEnWoIRJfBAJDIkHl+rGMvtbXRfGX025e+DQj4MvPWdS5XA3Yftd6EAyloOZ6QiFOy3gH0s71vthj3/2gHxdclX4d7xgfKd4K/yJdGDlDmt9lptz5rs1kVkbdeoNYs+Te1Ol1vgvLYD4FYotLo4uyhPQBoin8+LT/5LTupP1LPmHB16NcCfjLQByVPu5y4af7+4SeT7ZRSTqfRsd0osyhIf5Ihwi94lAPAGskr3J/aDXxzurDcaJQVQXka+KGBaE7wZPe7dQqvpQd4N6vIYvFVYLucpQN/cfDoee7AvD68vPhu4L0ChdlMo1mtck+JrtQQURy8aKP7ZYwJr+MBJOD9eoEVlCP3ZOlEpbDE2O8OYGKml9cJPMjLrxXI5eGeLAm2R2SWnKXyuAOgMSNibCca7C++JJFIdDpRErb7ZZ997t5P1rB+DAYj9NXUUpAhoiyr2C87ePL6+75xw0Y+2ZKXFxsbV11ddd6vZMX49Q9+dqeNeWpWb05V71mTxm58XP91eID+B+DkYzTxEncvAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAADAFBMVEWmZCzxx2TYnjDms0nWmivZnizms0nZnSzdpDXksEXany+tayzQkyrYnCrdpDW6eivhrD/YnCvgqj3dpDXwxWHqu1XUmCzCgyvTlyrrvVjvxGHxx2W6eivqu1XntUzVmSrxx2WoZiyoZiyubSvaoC/cozOqaCzepjfxx2XgqTzxx2WqaCzcozOubSztv1nFhyvZnSumZCywbyzxxmOycSvpuVLwxGHxx2XTlzClYyyvbyzxx2WmZSzYnSsAAAC8dhv11UL11kT23V70wTDaoC7yryDzuCjzsyPyrB30wDD24W324Gryqhvztyb0xDPZniv0xzb24nD232f0zjz0yjn221j12Enzuyv232X23Fr0yzr0zTv23mL35Hj12lPzuin110jZnSnzvy7221X10T/xx2X0xjT0yTfztCTboy/10D3100D12EyxXiH110b///+9fCr48arntkz343T12VHzvSz487T476HEhCn36o/36YuLTRexcCz23VyubSz23WDfqzr0wjHyqxzuqB3vvjT12U7HhyrfqDnhqz748KX47Zv36pH35YL24nH36IbjqjDirkLtwFrPkSnBfij12U/JiyvnuDnzsiLVmyrqulPyrh7AfSD35Xz59LnMlUDdpDXz1VDdmCHyymDory1aJBPoox/TmzXLjDDVkSPjnR/iw3PRoWL05IzlxGK4eCvrrifyz1bkpifvxGDgoSbAgivWlyfz5Je3n5jq1LjatGv37uPu02riw5u2cRv69fHEhzjHjTf47Jd2OxWpZyzVp060cyvqvjukYhmaWRi1ZCLOhiTz1lmraSztwzr354XnsjT12Ffls0XqwkTutSzzzl/yzUXopiLUo0PZsn/NmFSDW07354TNjiXxzD/y0UK6bSa+dSm1ZSOOaF3czsXNlTPvxkzzvCvrzV2we0Tu3cbhu1j17bDBrafhulNgKRSwbBroymi4jGDmoB5sMxXgsT3CfS+zcyvxy1Dix4bx6LDq5OLlvUz598LVqXGtkomihHoAAzntAAAAP3RSTlNw7yCAr8+vUN+/72DfvzDP72CP73DvQICPvzDfgM/fcM9Ax1Bgz++fUHCv34Cvn4Dfn++fn0AggBCAMBAgvwBOwcRTAAAE1klEQVR4AdWVA7Qk2w6GZ87Ytm2bu6uqbdu2+9i2zbFt27b5rm1z9+DgGk83zaz1f/WnkKTZ4j8Z/wygf8/J/QZVeAe3a92i8+8Ds+cM2LatoKCiwuv1Xs3P79o95DeBBTMMBsOyLVuW2O1CJ3Lz2tX09LQxIb8OjG1uMNy4IpBIJAKdMsXuRHAPT8Wn1U38OVB/+BsCVC6m0bhiOSpQ2tVOnF5aWlc3au4vAQuGGgznY8RUn6K6WuHj0OQSXbEwSCTn1bXv/HMA6pddQWm+6tzIiIjI3GofVYzqitUIzspPyLO0D/kZMN6wTInSFPezMsMyMsKORtxXcCCRokZsPBOWh2819ydAT4PBL+H6PnwVgKK974R6MrPuK96ACSh/pJcatRZ8y6bA7OaGJTo5520ADt8F4EhojSczYn8VKIJJ1UNoQcSz2jQBZmzbUizhQskBl2tfLdj7bWjGhnDwnct1aD14oOczA5tZUxsDswsK7EqUehvcccE4VAS+qvGsA3efJYfBKZlRy9jO6tYImFzwhR1WVAL2uYJxB3xZ47kN9jxLDgALj01RbWa1agT0qnBCIAccdh3afW+3aw/YW+OpBS7X19+/63oLFFpNmIqk0YTUA7MqXnMGHSDwrxUrVvwAgdAMCLwCk3vPgASReatmSD3Q4jlALQFQAuMOWOcJqwV77gWTj4AF3rvXzUnlLeuB1t6bEEBpt8Gbz4AisCsjcyNY/yyJAhetJgiQyzvWA+28jxChMgZe1oPvQ8kn4ERYZlZ2ODgWBE4/wD0ribyzpAG4akPUfoGc+h44eCbqDDiy62hWZPb+qg+ijkWdrnpo4/0csOKCNYk5G+HTUHViQ1ZkbrbC9+LRQGwyeFlJiTtTG4B8Hg4R+gVxXI6iOvtSbu6l7GpFDlX8rCcQXPBhIpYlFu5oBPBtiNOulMRxqTmKYD8EG0KMSpSwIxCb1cQMMAj0VHc9MCb9ohWHqFOUElRMo3JycjhUGleOSnT+ZwYyNiYyVybt6FIPjEsvlUELYYpSEBMnF3O5sEXjYgRKqA8a8JlaVRl5rXtmPdA5Ld7ECxJ2v04gQVH0/DcwlhRD/TODhGBFDzZ1aHiW2qYl82FRTrW92K/U5X/meBZP4oN6ngkakMh0d/TcBmBi3WWjFBKIWm2/9sTheLx61arVj+FvKdQbKSIzgb705KRGT+vcHnXJbKnVBk3i4ZE/FQqFsJrSIoejkG/EAowycpI7dlgjAFrkYUY+T49b7XCscsJAEASHs+GfOlKxAJFUSV8TPbxJi85ta1mOGU2yQsfTUhwOiqHapudJL591nCOaK+lro0cvbDo1elss1ylMNtRb9XobFFutMqnJyFx+9pyZkPjxyePNfjqXRuLx17VYXrKJL5XJZFKZlA/lmFbEIFUmrnRfmPbzUTkGj18u0lISmEYjm802GpkJFK2IaC6rpMPjT/ulYTyRxdpKVAW0WgqGYRStNiAiMkgEMn1NLNT/4rhv057F2sxgqFQqEfwQGWYSAZ6uO/b4vF/bDyGLWBrNVgLJDKOsjFBJTlpaFH1h+LDfWFm9O2nKyzXbt9+6tXLl0jXhmz6PndDhd5Zi574dCwtLSlLDd7g3nZw+c8QfWbshvaf06TNw4MAR8/8ri/0fAPwI/Z8rWTyGFksAAAAASUVORK5CYII=",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC9FBMVEXxx2W/gCutbCvYnSzaoC/XmyzepjiwbyysaizlskjwxWLmtUy5eivmtUy5eivrvVjYnC3xx2XbojXdpDXYnCvdpDTcojOpZizfpznot0/Wmivxx2XZnSyoZiy+fivZnzTuwV3irUHqu1Txx2XLji+oZyy3dyvgqj3qu1TqulPNkC7xx2WnZSzwxWGtayulYyypaCzxxmPxx2UAAAC8dhv0xzb0xDP0wjH////zuCjaoC32rjnZnivztST24W723V311kT10D711UP110bzvCv12Ez10kDzuir0wS/221X12En0zTz0yjjxx2TyqxyHMwD4pD26eSrfqTrBfyjYlSPKjCr12lLysCH0vy3zsyT7hEvcoTD11ELztib4nkH2tDbirUD1ujTuwVv48KTNkSb343T37uPEhiv354H23Fr47Zv+XFr9bVTloCGubSyzciuhXBSwbRr22ljpuVH36o/24Gn1vzLYmyr23mKiVwzgpCv59LnzsyL232X10kX/WV35lET12U+aVRfJkEb36IiXSgzx0FbHjCTqwTzPoWTmtzLdozTwvzPNkzbObyz01VH8eU+qaCz6h0niqzH69fFaJBPMlz7AfR7mpSPmv0b47qH6jEfprijcnijAgSv35Hn47Jbeu43caTrq5OL+Z1fx3ozmzKrgmyDyrh62cRvuxTnhulPy3HbPlirxy0axcy348apgKRTBraf1z0LntUzrvVbNmFRzORXquDjisDbWqU3kejzEhzj8dFHlskLvpxzTmi3yw061dCvosTLPiyLywzrspR3lskfzy2DstCzqqiPXs2bbt3CQPwWubiLWqUXpyFSoZRj5kEXdpTfTq3TyyTutkonWyMSjXx/Hiy7t2H7q1LjxzU3487P5l0Pix4akcUPyXlHtp0v7iFLow0x/QxbaslyoZyxkMiL5+Mbev3vlyHOxdzLq25y4gjucb1D2sDjx6LH598Lu3cbFkTCDW07y4YeOaF3y5dTiw5v3p0PDgyVxUKN9AAAANHRSTlNggI9g37/f31C/r6+A37+/z8+f76+AIO9wgI+AUCBwQO+/z98wn++PMJ8Qn79wQGC/IBAAXls5YAAABLpJREFUeAHdlQOYJEkQhde2bRtZaNt2j23btj2ztm3bxsxaZ9tG5KLX+nz3PmVWvT/QiGg28y313wDGTR7fdURMTOf24/uNez0wfeBIjbf39u0xMdtOnjzg2XNsn1cCMyZqNJpT+RUVEolSlL6h8ICn0dijz8uBZsPAHh0dFBQUrbBmKUV8V1Wh0djU+yUAhAc7LzEtLi4uLZEXbZUo+ULp1V1NJa0nvAiY0V2jiealcf0Wgvy4cYlBCkgiFKhLa0q6jXoeAD+Er79w48bXt2JzcwP9uGm8HyMjLxesUZM1Lq0mPAd00JxS5GfrsPJ85iyKDVzITTuPb+d9CXkNs9uEZ4DJGo01P0+Xfdbnq6IrKXc3BWPi0myrMUqn8yXFycwBTwPTNZoKxQXdl8t9Uj4DfZ+CCb84HrSxXqcrljOY7KFPAlBQflbQxY23vjh77tx3mLjrsyh34VoLQusLC/KKSfE8dqsngXHe3hIrj7vuJsJ6BwhI8XMZQqao1Wi3VEXa3ZLZLZ8AxnvfkSgS426inBXf7IzEBAB7UM4PW+o2Z6NCFSFnnGG3fgIYtl0EwEWUU3utrq4u25QCwHJk8l9aB7pcoCIoWer8hD4OYGjMYQw0IH/6J3BsXv059PAxWkxfx8BHaI2aEjvNSmjpAPrHbADgEtpB07/cj1mfsmlOPfqVvp9hJyoGgHMmoYcD6LgNAx9CyPsxP40K2OQTXIZomt4Ct3cREwPaQ60dQPttUr7Seh+gl167thQFzAmOLUO1cK29Ti9GNbgk7XrLY+AkAFmzURF9X/6oflFsbj26Td9XESqGpp205icBgRBqQiYck4aQe2JzA9filu7jDfCxylK15gAHMNxT5QopDqEr9x0mtC4QfuF/oBW4phxogbQzbFrLgieAq1K+SHKnAV3xp2/vQxfv/yEuIVR0+7d9qOCqmhS72bQBYxxAD8/jApzifXRfZVwuF//nZjfgW3lIhjNLxll1YkEXB9DPuEslFaZ/kBGypLy8fG/j4TSw86IVd/YuWfJeRkZIZaZHqnaloYUD6GPcTai2ulcuy4C3oc7uXhW8+2Pgd+fQEPykWu/F0R470u7xb6mNsVR9XD+3MnTZsv3O91jxWxVgl6Sz7jnvDw2trHb3oNwOGqAFB9Cv6ShBeOgz51ZXN7qz4qmtWVkSpVIaz3LPnNt4T+9BUU7miNFPABN6lpSSlNe3er2e5UVRhBIk4gvxIxbLI56iGAcN4YMdAKh3SQ1FUlR8fDwFfqFIxOfzha4CeIQlhw7CRz89BFq5HJWTJBhIQiDEcpVKBSo1QcrtYrdV2pXhfSc8DYxycTktJwm1SiUQSEECAdjBbxcznFZpwyKq2j07l1oyXU6LASHUAKl8G3zVBA4ve+hv8fyo7MdkzpPZ5RRJEqV5MMCSKDmE59ignoiq0S8axi3Z7GSGTGyXy5PwwEs6JmNwnGxa6PeT0S8e94N6stnzOAwGQ4bFcOOkgt1sCO879WX7YUKvhIT5s2xOoNRUGxRzwmzYWDVp8CtW1tDWCaD5YWGzwsLMvqYjEeHTprxmKfYZ0M3XYrEEBCwwGCLathj1Jmt3wtAhzZt36jRkyoS33tP/U+Bfz17NZxiK14gAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC/VBMVEWqaCzDcAvany7DcAvuwFvDcAvDcAvntUu0bSHgqTvxx2Xlskjxx2TDcAuubCyxbijhrD/YnCvntUzqu1XJiyvjrkLksUfXmyytayzrvVjqu1TwxWHSlSrPkirepjjYnCrDcAvgqj7fpznDcAvaoTPZnSzxx2W2divxx2W4eCvYmi3irUHDcAvVmCrmtUzxx2Xxx2XDcAvDcAvZni3aoDDMgxjxx2XKghrMiCPBgiu6eivpuVLDcAvxx2WwbywAAADDcAuHMwCOPQX59bnYlh312VD23VzgqjzGdQ347Zv24W335X3Dhiv22lP48KjzuSj35Hn110f23Fr22lfYnCr232b34nD343X1zz312EvyrBz24Gnxx2X11kX476TUkRz12U/23mL36pDepjfpuVG7fSn11UL354T59LfWUADaniruwlzsvVe0Ywr47JfQhxXNgRP48qz36YqcVBXdoijzsSDxwjSWTSDiqzD59rz487TwzEX365OMNgDJexHBSQDmqib36o2kUwe4eCuOPw3ouDj0xzb35oGjXRXdx5XaqzGcWCX2XAD23V/10kD12EmlYBqlPgDAkVH221X5+Mb0yznupxvxxzq0cirhnR/hVQDzsyPAgCmlZkD/YADDmYD476GVQwS+awr598DjrkLwylH12E3ntUz01FH////z0UPNkijyymDzzl3qvz/twTj354bjukLlskfKjCr598PAk1nboC6rVgbx4Iz587L0wjHzuyveqCrZnSWrairpuDDcwX2VShHdmCG1gUbjyXqeOwDEfhfk06H47p3v5rThvlHgpi+nZSPHVAPnwjuWOQDuzkrgsTGeWTDarzjhzL/tryXw5t+wbizAlmPTkSW7dRXioyWVRwnwxWHsqyK8jHDp2c+9cQ+tc1Dzvi2WPQGwcR3w23nFjibLpo/WlyfSs5/k06C3ex/av6/x5qLbumXTqUexdzXpzmvjmBbGlkC8bRPcnCHaYATcojLQihnjrjnopCDDlE3HoGe5iVelI0ZJAAAAQHRSTlNA78/fn3C/IGCfr7/vQJ9Q72Cv70CAr9/fv89wr8/fv58wcFCPUM+fn4Dvv49w32Dfz4Cf73CAIBCAv0AwECAAov31hgAABF5JREFUeAHV1QOwHEsUBuDYts3n2En32rZ5bdu2rfjajG3bybNt1uu52J1YpfyFwTnfdI97bXrJvBFg9tR+k6eYTO8NnTB+9vPBwJUf3HV0dHIymXY2Nm7bNmrewGeCDYtUKlV1TXn5DnkqXx1Y20ClUgcPfDp4f5hKVSMUCgQCYSZbJ+erbWS1VKNx/FMAdvgaAUUvViqVYj1FyN6RqrZJyY42GvusfhLYsEClElLEDCmPyeNJJUq9IFPXKXz8/pg4Gwes/dXCZKWUWR9uMHjUM6UMMQWJwISLmFg+8DEwRFWdmXwmbd8/7WUczQmXcFueRExp+BRCeDFml18rmtXDYKpKRRaICage1eLvH8ChG2x5DBaEhLTPU7JjPj7duuxhMHCYqjxTL4k1HDgMYeLJZjsOPfyzNEhgXUCnIYvZxW11mP8Q6Hd3u06glHrQO5qPJ8Ko480BmnZP6HlKwJbz0Xnv2n3VYSIeDHR0lLOTGcz2A//euPEfmtbXRM4ZCD3T4uLivlFjc+J6iUbjQD+n7XJsRj/C7iT6t8DuENQp2JzuifrgwFgnfic4ktFyIz4+/mRWFhGdRKxUmSxsCOw8id2FDqJVFrDOtJ2/o/Ocyzq2ZmHZGtADyNhZZyNwW/SuBYw3BWIjMJjhdI4dJrbauZcFeTAxoOsB90TTLGDMzkA1Omkl7/uMjAMBRH9igLuGbqhHty4588Llc11A8eV0Cxi6s1Kdyqb8QICdN+47d04ZPcgjVso4Zb6D9typ6gJNVtCYok4lmyEsLi39CMKDh4+4GDxif/rlIOr2Lb4E4a3HgMyGfxlGXalAuYYIQp4Q6/7iGtpzJQpquQiwLODtbTIbtSf8qqIrD0qLoyAa7v6D7h3fws1cb8VNPMhNOQd9K56aSzDfW8EyW8Bgap0sAd5/OiiFboqcorUWMIcanZ2ATu+p8YUfKvLNCy1gNvWvmAT4rCBwM3KQ9VmaYfTZ/2zgmmPOW20Fc4yntVvAlghLPTg9Pd260QYAcMsbgXtaV79FAyAEAOdgVD9/tqCkM0n2Rzv7nQHNDdVH4kFfoPXJ3u8G2mCwfQkuBechbANuPrJcLRiAA/2Bq42cLM+lgU+SSh5K0tHgLbRcOZtcGQLWW8EAUCeUMCXsveD3h/vRGJsBicyw5Qm8QH8r6A3kEg3xBCManA0NtS/AxT40AnjpXfzdpbVgqRUAoOPZZXWgnc7wkRCcgZdYk0VkPgSWgEqli3uQ2A+Qwo5FWLs3O7vm/Az2Cmw1Lko/PJgF9pDFErHuT5BfyOVyw0jaW7eOkUiF3gpFfhEI4VOUelQbbgXDAa2On6reA2gih7CrhZ3xRt05h4qu7/sVkGz4qNYX/+V7B9BIYVoAVswUoXjd/hvl0E1WZN71SYNW9Qauv7kCMBwPkEDpPRc9iPMmVlU1NbFYRebIvEkjsPL6vt01K0BZ1X/poNXdq+PWoCxePHLjpu4M7z/89f/TbzL4H4jYRGOOTCMOAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC9FBMVEXxx2XNjyvWmivxx2TboTDZnizqu1XUpEqwbyzRlSuqaCzYnjDjs0zms0nbojG6eivxx2XhrD/cojTepTbcozOpZizaoTPxx2WmYyzZni2ubSzdpDXgqj6eZiLaoDatayzvw1/YnSrwxGHepjeycSupaCzwxWHxx2W6eivDhCvxx2Xtv1qvbizntUyqaCzjr0SmZCyqaSymZSwAAAC8dhuxXiHZnSr1xDP////GijX1yTjouFLLiyzztyf20D7fqTr1xzbzvCv221j1yznboS7221XNmVTxx2X1zTv12EzQ///12U/10kD110b0wDD12En11kRaJBPdpDXKjib12lLBfirtyk784069fCrzsyPJkEbzuinvxF7FgyX48ansvljBfR7u3cbkuD/urSPksUf23FvjnR/w3Wa+hCvirUHprCfUkCTFhSzeoSfztSW2ZyTmzKr65VXyqhvzsCCkhnryrB3zvi324Wz232XosCzNkTD21UKFViuCUB/pwUHPkinxwDV3RBzjsTblvkjjqC323mCubSzxzkfq2nLntUu0dCuxcCzb1mjGiiz37aFlMyK4eCuASxvvpxzeu43w22G+eyHSq3GqaCzqyFrWpDj52kbz5ZnZ8s/23V3wyD3343XZsV/dmCHVmCj69fHvsyr12lPruDbWyMTSoDDBradjLhfYpz6/fyTbrkPy5dT36o7rwE7vty/q5OLTokmDW07354Sr0JW+dCeXVxjPmT3RoWLCoEi5ijX/7ljw0069cSb37uPxzkHnpCG5r2Di12C6vW/47Zr12lTatE/X99yjdyrAeSzUp1WxfCltOxviw5uxhDSykVBvPzHn4YbJly3WqjO2cRvOqz3evXLQ3pq/xoTV1Wvs03f465O50YfZsn+zciv35Xrh1o/h1Y3b6bzB0n+tkomsyo3Khh65kj7q1LjL03bw12+dXBmwbBrg1tPd467g5aXS+/LHtljr1Wix0I/S/PPvwjrLu7Xw2l15TT9zORWNNhVjAAAANHRSTlPfUK/v78/vz+/f7yC/rxDPz+9wgM/Xj694YK/fMO9AYJ+/IJ+fv3BQgIAQgBDfQL+fMCAA/1cTugAABHtJREFUeAHdlQOYHN0SQGPbto3bGNu21rZt297Ytm3z/bZtm9W7Se/Eyef3n/F0nVtodVr6jPxfCONmTOrXk8Wa36//0HFPFqbM7STz8M4w7GeVlgYEhA4e0fexwpxJMpnMo8W6zaDQafTFWX6hPN7Uvo8WZna9IW0RCq/kGjIkZpXiliHzZhaPZxz6oEAvb2jnVkvhSqF5G3zLfWmT0ThswMOEOYNkMuH/Mv/Izch4rmR1cnJhoET1Sq4hd8uLISG9xz0oQLxHqw8CPK/s3n3wvdXJKSslKl1me8rxfR8QRspYnghJ6+udCDGWXwKlzci6di2ztrb2ZvcB9wkzZN6NSHqGBHY5EaOq3Qg0KzR6tYhIEou73CtM6SpjoyaI3vp8dcJ6J1rjBcbqZGuryWRal8fUusR453uESR57EGM9Se4zAFvPWNDyqrcOfpmGvj5y5GWEfFIFYXhvd2GKh8cWFEMlMAAHyHfQq16X3mxEX8Gv6hgpQpGcSHy0mzDJ22pCVAO/GoAE0hfd8Fq+AzUlGACSvI1QmD/e3U3o4a0xIZLid1hyHwhHvdagY+TmtnyU8akDx/vSwgTWHhCgBWDzZvj0Rfu9GFTKj6sPfEMCDOR/Dh9CC3NZVk02+pykuY3WVO2AFWicyN8f70IL/UuLNXlIStIw0OuvHUfOu0vsOoZ8HInretNCv1K1vtgHxnSHenTi0KFPTiCEnFIAPn3CQGDTwsIAtV7nh+4aMJSLPwHnP2tEbZjESYL7BG66RgGGNMbXlxr7+bfvUpEFx4acr3WBENEhhMrT9TpVvidqI+TiRzQXdPp0rojQcuITs0PchFVqvUaxUZjfmlZ5/IcvOqjQQQIuk0jixMdV2mlhaugvXCpFsLAwJbmk4o07VFzYqIAEVEWCqMS6kIG0MIS3Sa7Wm1c0YfmBhSkpKcHBwQ0NvwkvqxRtCeDwhhaC7NNoYRwvjylXX1XuxCIkwsCVFIFCiZmKhw5KIAFUFF4zseNYGsvLETUor67CLCrzRolEKJFcpsIhHgpaUUIlqLOXz+sQhhjz+KIXgtmYRadQqCjaw6l45s/f50TFx60tG+N2tA7oZtTmsKMxDONpdEAxG8PYZyFcLRf9qFR+SyUoWkALwFBjQQGGWbZjWJper9FEYNHR2OGzaq6cSXynVCo3xIWXT7/nFB0w1phakMO0+UEczy8COx0bex07vErEJLQrQPAOKu+zxE0AJojFe7UE33bqOgZEn0pfBsbpTYRW8CEIAWXNo+6/Lo0WizckaYllJ/OPMnbGQu1cMDDP8A173/+AZW9e9OClcqpYnCpI0vKX2Ww2EZ9PEKKT22EMQYlxQWUQf78ADMXxAo4LnHaSBIQt1mpNjAsvgvgHBaBzNzwyLIrjcrkE8OJwohyEnB9kL4L6H3F/6DsZx/Ewf4fDEQWv+PjEurWW8ubhix9zy5oAyjo8MvIcsDbcs+bdouETn3BTHDeid3Y2u7IywmKvKes1bcHT3Hb7Tpg9e/asWbM6L37m+/R/VfgX4Iq8/KMlK8kAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC/VBMVEXxx2WtbCzaoC2pZyzntk6zcCPuwl3HhRupZyzJiyvdpTbcoTHirEDwxmPksUbZnzOoZyzSlh+9fivYnSrUmSrksizfpznxx2XwxWGnZCzxx2XboTKtYgeraSzirUC0cyutYgfjrkKtYgetYgfirEDWmirmtEunZiy5dh/ls0nUlyrZni28fCvboTHqu1Txx2XwxWHrvVjepzmwcCzxx2XRlSqtaiXquk4AAACtYgeHMwCyaQr22lPfpjexcSqsaiv24Gr24nH0zjz210j12U723FryqxzztCP23l/110X5+MazYCLirkL232Tyx2XhrD3cozP48Kb0xTPYnCr22VD59Lf221fqu1P1zDr0yDfyrh7noR759rz+62r+52P35X3+5mD35Hf35oLEhBbAfBL94FL12Ez36pD47p3upxz94Vb97G/Iiyn12Er10kD221XBgCnzuCfx34fltUvPkhyOPgfrvDHGhx7irSr47JX36IjqvDryxjbbrzrwxGHaoyXboTDysSHYnyP0vy62dSrztSX0yjjtv1nqpyHcum28fBzyzF7zuin11UPzvCzryVW/fxj0wjH12Eu7eyrtx0q+cyb232j93k/anizuyULpsjDbmCPJihrz0VT10D7VnCH487HfoSjjsCvot07suTHMiSX920iwXxnyqhu3cxPEhSvftDywZQrfsTDbqDHr3630xzXbuV7y0Eq7dhDlsivuwjzfqijRlSrlsDbbpCXyz0TkpSb82UXTmB/OkSrMjir95FzswE7Wlib48avy0l3svjLtwDOcVh3wwzTgtkLAhi3+6Wbx23W/gyHcwX3z7LXuwTTouDDisUq1gUn598LQnDitbR/Hm1Peu1W/ije+hST941nKjh7dpyb93Uv71Dz40DvmtC381j/82EGjXBL24W2VSQ2jXhmVRwj2zTnk06GkZDK/jUPjzIbTqELmqiTapSjRkijChiT/8nvFhCfGlkPVsmjj0JT24Wzq15DOmS2yaxK7fCOxdzLv4Z/sjJykAAAAOXRSTlOf3zBwUI+vr89wv+9gz79A79+/74C/r+9At99QrzCAgGCX71C/j79QIM+vz+9wII+Av+9AML8QEABs1tjWAAAEhElEQVR4AeWVA3QkeRCH17Ztm5Or7rFtx7Zt28mawdq2bXv3bNt4Vz2ZcP14qAwz31f1+zdbvfGa9e8QBs3qMNtkqo2c3GNEO4eXCjNaDUxJyc01nTxZG3lLLlcN6PlCYUYHpVJZuHIln+8TzJMcWpooV6m69Hy+MAvxM0YBVUY634cnKQ7Zq2IwBjg8W3DojrhArGCzf2EvUogFdH4wGtxEhrprm2cJ84YoC43iu8x7P15xdXXnsBXi0AWPHgUlcpMOqLt2e1pwGEjxTALrfIRvgoc7Z9FX0fgleqtZuywtrWdLAfMU0sUPiOifrp0nbmv8fBNcOR8Rl5LvEZ+syilfloapmgszlYV6AfshcV9juE5EG077xSfsJD4W0H0+ILaZd2TGLZnaXBiUouSHKjgs4pqTVPo5sd3ptJ/vF8RDsVH/iLiKI4qql/RrJnRPWYkD3P8kfpZKpbeJ7VKDJv4+8UAhoCejYNaWZC/pO6mJ0C63NJgu/tA14ksnKdZnUimOiNjJWSQO5ScvDeHuyAw/rBvfROiQu6siVMzxiNegYCsqk4c7W2zk4+7jWsqL0nV9GwUHk0nig0vw8NUY7IKhXtDj3sNFlIiqdUMbhG6mBTbB1devqm6EU1X+HwAbI5sIeVQmuzC6lhJwDQnxmvz863fuOP11CfECgGQj3y5kC3XzG4QJkYckFXQx290jAvtWGqp+/R0KSgOdLwJs5vPsglV3rIkQIgnWCxScKwVQUAD5+QC/OTtfdnHbDOQuuyASLj/eIPS4taqYxy+V3boK331fChjn4mUXF7cTjwNi4QmveOFC3Eoi4amgRkG+qlhSsUC2HjZyAs8A8hT9OMB7MY8kJXdlC3fgZhWe2tQgjJNzQyQ8vnwLlAYGOmMeqrm39+K31h15AkEy2U1tZni68NuwJsJeaoS+DKjkEIvNKXrdkfffWw3rZWoLteYNm6Y1CCNUidyQYl5FGbi4uZ3YqPdejDjSb7/z6QpYrzZjIpHVMaxPgzBUdSAHR/DKAKMELEW6DjdbzpGwjYsDMNHyypGNx9IcRpIZjTIIaNI8J+nCuSjw5OZoM3HAhh+yhjcKoxlrLBiqDCja3jzpxtmYVCBvYCBqgGNW6yZHaxsGo9zC3Qpkk+YxN989SMI3yNcNYLZtELC6qJdpY0iIaWiOeE0U2HncRI7M1rSmwoyu6jVekNrYfE/Nm17I59j4dKF/JWti84vA9LRYWFHXfA02j9sXRQJZY9HW8RvCWINbXpc6wu4L9uZxGSt2A4DXDcRLbPxaVidaC4E2hjxrb+5JIk16ZtjwcJFV6B/G6jWp5YVsGMTZmu+jontF7Skvz7Th6bjeLFan4S0vlZPGHMXmiKd6Avl1CVZRUXg24kL/tUzWYMzz1KWyP9IHM1Z7whZHUTaWCGmr0BHxXm2ffX/ol5qx+qgnQKyu+nBentWa57h8bVgWs1d72vNuKG16R2H+9lP27z92PChoU1hlZRazU1vaC25ZtI4Ao/C9Z+d+fbDaj5xLe9lddOzY177t/i+EvwEaPRvhAOyR+wAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC91BMVEWmZSymZCzDhCvls0jZnjDxx2XZniytayzuwFvcojHcozOubSvms0nUmCytayzYnSrPkirxx2XdpDWycSuvbyzVmSrYnCvuwl6mZCy6eivrvVjgqTzntUzqu1XTlyrRlCqoZizxx2Txx2Xxx2XaoC/jr0TfqDq6eivhqz6nZSzany/xx2XZnSzxx2WpaCzgqj3qu1XYnjDhrECqaCyubSzany7puVLepTbtv1rvxGGlYyzwxGHgrUgAAACHMwDZnSv0zDu9fCr35HiOPgb24Gr23mL0yDb23Fz23V/35oL36o/11kT24W311UP332f10T/35Hv232X0xjX0wC/221b0xDPzvSz23Fnxx2Xzuir12Ev22lT0yjj1zz3zuCjztiX12lDboC7yqxzzsyP0wjH5+Mb12En11kXzvy3454b59bv343Xyrh712U7476T36Yr48q3100H365KzdCv47p323V6cUQzQkSmubRn598C5ex3xzEzBhSmxcCyubSz24nLhpyvpuTj110b0zFbvxF/5vV/ot0/cojHlskXAgSrhqzvfqDnXmirqulPmpCLHiCrBhB/11EL47JjvwDX59LX35n3irUHtv1ncnyjuzECqaCz10kDgmiDdpTftrSP211n+v2rjqzHQkCT8xHOzcyrvqBzw0lS4eCvetDf11U/AkEyVRgjmtErstCzyymD2im35jXH7kXX+lXf+pXP/rnDxg2fVuojprCjWlyfToy/yxjzLjSrqw0XxzUX7xI3WkiPxwk324nD48andpDXzhmr5tF3yuzD6zGvooR7yimbykln1uFL0q1X7pnD6q2jhwFb17bn+nHX7omiVSxfzsCCcWCXdx5WyfEjzzl7q2prnw0HNo1LFkjTp0nvbvGq/jkb5vYD71p74uXbmsDX+nHb0oVLyl1D1tULxtSj0kWj42XX8rXL9zYz9yn3HnFi4gjqjXhjpz23OrnykZDLAlF3w3YOjYCLFjyfnwTvToi7Zpy3/t27/tW6HMaNnAAAAPnRSTlMgcIC/r3DPYJ/fz1CvQO+/398wnzBwYHCfz79w38+P30Dvz59gv++An8/vr1BQv5/vIL/fr59AgIAwgCAQAN0Itv8AAASQSURBVHgB3dUDnFxJEAbw2M7ZtmLN9Rvbtq21bduIsYxtWxufbduqN8kN4vx8Vzvc+f7d1Y/9Xr7F+k+AWXcOu+f+isL7Bo6aMeHGYM7M8fn5TU0VFYW9vcXFjU+8OOm6gPCoUqlckbesy6e25zq2bytuLC0bNOna4PmHlcpX5ksVUFIjGAdPl1NaNnfGNQAMD3EGTUSl8kW0BIXGB6KNmDN37wjC1QDhEaUS4tQsslBI9uym0hhSoz0XRN3ComcmXAkgv0LD4GcJXVFsdpSLRd7NTwDh4AmIMhCTrgDPBvIeFrvW7/fH17JdQlxAVzU6rXWhaQjhMjBYqTQqRFmsWH+0O8Vdvyc+FoSIoVHnctqIYme2aVAkmPOwskvD5DawvzqDKBf6bO498WyW5+Q3CCV34lOoTNhzEWBYfp5PIfK4uhE6g9A5m63eXxv1LQVR4PELrEK+ERseDuY05duNDKrwRwo6b+s7h76zuaPj2V+jJQnSZJQcQ6RL9NnYHWFgWFOaHe/oLXTBZrOdR98HwE/oJFOahnpqdHSrah42JAy81ORQ4+Bt9IMNKgi4NIUxEfEEsAhLMzYpCKZX7AJA4za82f1qCoANG1LqYdWvx+GgczMAmdxQid0eBDML0/AZDr73zo4d7/aBSHFHw6JZHiptfkHB/v1HtwCYVz4oCEYVbneo8z5duWr1mlNr131R766P9uM7Iou/YN3aU2tWr1r54QGDt3xcEAzsFTjSDu+7BP74MnoP5KNYZO7B3y+BfR8ZvJu2hgPOsfVBsCA+vhbywizqgiBYHwEeL9bxdl0EHwBYHBvLhryHKwqBIxbzpqoQaCTGOI4evgQWs1wuVgM5iytizv93DUdUFnNSSRBMbtwi4OR2FZw4fvzzxZ/B+RA4IURMhcaYV3Di9OljHzv1Z81VpCB4qrFOV+Ow+zSKBBGfuxuKS+VDXmpUB046ulVu8C4tuTsI7i3NIQp4IIxSBpMm4vPhFGUyYHy4FHBidFqZRG8xt5MmBsGEslI6sY2DC82yN5YlQDEUUo0P8j+3CPAJoKNFHUNDx9LwsjqtLgaE2peO0qVQGqMxkEfVFyfwmkkZhBCYMfd9WUDk2l9DlG0Q9qkh7mihoN+0YljBWXN73NSwo5XwxN4DYq2ujQckFSVut6vtEHe0JKJkPA8TLCVlPhQCMEXRQisIQQyPA6nEFkhzOJ3wqU5sdeINLcp4IeIUJQwvWi6RaYlAakBQUjf/Wp2IIC+D8fGGMsb0CwNQo4tAWMVAdIItqShQPdV0mSSQP7Sktf/l16XHTKblcolMTNcSicScRdWp1dlimdWp0lsgT2q968pL5TSTaaNKLrHKxGI6nS6GtNUJw1u8MD7krwCwcAzL/kQld0okEqtVInHKVSoDDG/emQn5KwHUc89gzRsNer0KL73eAHEvHBGZrbOvdX+YNBYDMs9iMVigIL20vSSj9emHrnPLGj0WKy/HmpsrKysPte9M71iSOWXoDW6KEx54MClpa1VVegmpI27MxJE3c9udNHrAgAFPPvnkyNtu+T79fwX/AK8cJR925hgcAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC+lBMVEXEjTHXmyqvfjjrvVe2dSvboTJdIwBdIwDZnSupZyxdIwBdIwDcpDRdIwBdIwCwbyylYyxdIwDvxGHrvVfsv1q1dSvWmy1dIwC9fSvxx2Xxx2XwxWHboTHmtEvot06oZizWmiyraSzMjyrZni2raSzany3gqTvmtEq5eSvxx2XcojLxx2Xxx2XgqTusayyPUB3cozTksEbfpznTlipdIwDjr0SmZCyxcCxdIwDYnCvZnSuycSvOkCpdIwC5eSunZSwAAAC8dhv0xTT12Ev221b11kX22lP////12VH48rLdpDT12U3AgCrany3YnSr354L343b0wjH0yDf23mP10T/23mH12U/12Enxx2X35X7zvy7zvSz0xDJaJBP23V711ELBfiP48Kf1zDr23Fv10D335HldIwD0zjz24Gr110j11kP24nL110f12U724m+tbCzMiyXyrB3zuinUkSR7QRLyqhv47Zndpzr48ar24W2lUgDyrh/ztybqulP0uyrUlyn0yTizciv36If0wC/59brztCThqz3465TboTDGiCr36o/24Gi3dir36Y323Fn232buyFfzsiLVqXH47p779vH12lLMlkX100D0uCjOkSvouEvuxUr36In0yjn110b+3EOvbizSli7bliHNmFTTnjHv1WngoijwsiboqCWNUhiFTR7OmDfq5OLwyU7mzKrzz1vbz8zmtEvZsGL18fDZsn/hnB/iw5vsvlipZyz5+MXTo0ziuELyymHisUbtty67eyvaoijqwlTupxz70jz6yjTgszbHhCauXwb1xzXNkR/uujPjrTLz0k3pryzSoUPipyq4chf598LuwVzAfB7YmSjmtDDSmCT476LLjSrq1Ljpz32YdmyqZxq4fTfev3vTp1vq2JuDW07x4pzt2In37uPenCTw3IPy5dTLu7XHhxruxTjntDrwykjyzkTtvjrxxjtlLAS/eh2oaietkonapEXqwztoMhvgx6nw2XfmzITasl3hv2XEhzju3cbQQ9/GAAAAQXRSTlOPj49AQGBwYO+PvzDfgM+vcO9gr2CPv5+AMO/XcIBQ759QUECfML+/v4Dvv2AgcCBAEJ8gj7+f70CAzzDvEGAQAMCrFCsAAAUMSURBVHgBxZYDgBxJGIVj27Y9yfmiao5t27O2bdu7sW3bds62bVRN7OT4dma28b5+/1/dXd3N5j6h/mOgY98OHdrMurU+q293e5fODwba2pG63PJ3sSM99SBgVnd756nPdbG3ZbRsOXjwkJaTO9u7zJrbsbt91gOANva+8LeFPez8lvj4mnXrdn1pb8aYO7evve0DgY6M8QOUYcuLilatqq2trQlblpExfXLHDh0f2DS0K+NrKIoql3MUXvK7edXzIiOnMx7UQ/+BSuW3RgDAQoveQpT7FgKor+axJ0y7P9BygHLnirPLvl7ABdmLcmWWhWfDlv9QAkA1mz3ofsAkpXLNDvC9TreyrAKcFgbsA2E63Tf0anDhEjtr2L1Af+gvqH5Vh0xlXPCjagWAy2/RdAnYuzsrq/XdAGOAcg0hA6/BhLU0vRH8UmcEr+h0H9L0S+CydncWb+RdwETlmnJ9EViwYe1KGpl+zgS/0htoqN9AEKY+xWvHuAPoodwpJySLwALar81gfakRoCUEJyaJEs7wmt8BDDx/Um5x2oygDHlg3T+ZKsDq68snzJhmCY8/4zag1/kiBaWPVp0GJdeqMLKiXgbcD+AyHCWH46i6ail/2G1Azy0ncUIWIHjfCEreLVvNBa+nRZWeBtyNm+F5OGRwiEUhxfx2twBG/L4GCHgEme8YAdIb2yCQsx0tXjhEGqywifTF/BE3gSHxtQ0cmKDKKX17fUXF9je3pbFMEfmqRbsid5xUkG5rvTYhfSm/+U1gcM2nKCHaVhdhYqWdO3cujRVVmpmi8uTqCfk1QJMefLHPTWDsus9InNI7hYKcUhOLlcZiRV2JyBfYAgr1hM+FSkJAYvVtQCWpYFoKA1QpmRFXTCbTldKInBSV0CmxUBwIoB5gwtWbwNO7pG6XnJA5haqUnMwIqMx86IcBBUzc6650iP1A9m2A1d2AUxZJtFAlqMvPyc+vE6iEHniJU6iFSrM4NaQ4OPF2wGEgYYS+MNpjUwmgVDZhgFOiJ5g4qsiMqauKg0O5N4ExGV9I3V6cSeglzgCP0GYTejzRuRJ9AeVTNMCKYM9xseHZe24Na8bnKAIvJ/SywtxoKGduocxSQMlxL2mQmjFRSHrsfu64m0DrjE/MUjfp4jAJi14mQZKhu1oOC/IHoIo27el969KIzBA7Kt0wQ04RBRakAoJichTIDzuAYxQbHpQ3/NbFNybyeJKfUHDkTIoiqPJyuQ93eUk3LEis1cCA/XnP3na1tmafwOqtkGhwKXCOz+fj4LjL1QCPL0UFhcCA0ORRt99AndjHsXpHpcFNkl6XSwH/vCTprycJS02IQwGBU28DYARbjSU5rAi5Ljc6vFmMpWqgP/xwU/s7J4E+WSfUWrEZIpCBMhgqpVZHvViL/LHh85uGzrkTmDwh65RahEHEYZVKpZeOXbaa68WYSJ2A/Juatra6eyIbzeOd0qi1mDip3my+FBMTc8yKiVI1IX5/8tZu906VrXm8MyEatUirxcyXIXCkUQ3t6bD++U1bn7nfZDyyHW/xkqoEjUZ9dC8EzjYie2zw/sOB8Pj3ne5Hv8Dnn1kSF1eV0PhRzJGPD/rtocmBQ4c/8IHyfDs+f/HS4uKqA40HDsYGh28KyoPlzHnIc3pG83YXExMvvgc1PzRoT15y4Kipj3iwM1oPm3n1anY2lwvtXafMeaw3gRmtRvTrN7vVi//vu8bj60/yrihTkgQe+AAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC/VBMVEXxx2XfpznfqDndpDTboTCycSvvw1/UmCrxx2XZnSrXmivksEWmZCzepTepaCysayzsvljqu1WwbyzwxWHRlCq6eivms0nvxGDBgivPkirhrD/xx2WpaCzcozPany65eiumZCzxx2XWmi6saiynZSyvbSvgqj3any6+fiulYyzxx2W8fSvMjy7OkjDepznYnCvls0nmtUypaCzxx2Tuwl7ksUfani2nZSzxx2UAAAC8dhv0yjj0wTD100D12Ezztif0yDf1xzb24Wz23V/1zjz0xjX365D48av110f221b24GfzvSz23Fn10T/21ELzvi724nH12lH11kb11kT22U/0xTP59bnzsiLzuCjztCT10D321UP0zDr11kXzuyrepjixXiH110nxx2X////36InYmyn33VzdozOubSzZnyzRjyTupx24eCr0wC69fCrMkz7AeCzZnSr22lW0cyvyqxzHiSr35Hn0zTz36IX0wzL5+MbVqXH23mL35oHboC/swzvHhC/hu1vrvlrFhSbWnTH35n/puVFaJBP37aH35Xz487Pntk336Yz47Zz47JXAfyn47p748KbalSLCgivku0bxyGHuwlvYpTz541PtykvjqzDLjir343b22lP47Zrgqzu2ZyTUmSrioyfyrR2xcCzAfB/37uPyryB7PxbgpSzTpV3ksEXrvFXinB/OlTb232T59sDhrETQky/ms0lkMiLx1WHs3KDq1LiqaCzwzlXnpCHAfSL79vHloCDeu2n22k3HhyHrw03TnTryzkTnsDLdnifks1K7byr331bkukDpwULrrSXyqhvKkkbz1VLrsCry5dTVlyb54VlvPzHky6rJjDDeu43u3cb75lydXBnou0+YdmzcrTVzORXPnEXSoknLq4zdtFCXVxiOaF3LjCnXr2a2cRvg1tPy2mviw3jPnk7044v23FW9pJjiwW3y1Vnz33rkwVntyELZq0Lw0k722UrcoCvZpzXptjrOkSrEhzjiw5vZsn+yeDblvlNKh3//AAAAOnRSTlOfcI/P75+/cO/fr7+fUM+Pn+/fgM+/gK+A3+/Pr4AwgFCPQGAwQJ/fcHBwgBAgv5/Pr+8gMEBgvxAA5HBYGgAABLlJREFUeAHV1QN4JEkABeC1bds2qjG2bce2bdtcxFrbtnG2beO76kXvZM++ex+SSd5f6O7p6rHxd+b/AdaMHt+vIy07e8XgcUN/HayeOaC0rCypIy0te1d7+45J89b+Iljdw550tuzAVeUx3MY1XUzZudNSv2zWz4NFA84mAwCqK4VCnkz5LCDyqsXSa8lPgw3j7TsA+Pq7lqcaD/Bj3OoBiL7d0vJ6qMW999KfAhsm25MawTeOW+npLyfXSPcAcN3xTHr6c6Cqyr3PNGdA9ktTwLcORzpRSkx9ifj9FfgB3FBVxUHxOOhnLw2qBk0OOOruF8ELbH/whMPxxq3d74HjVLQqbv6Sx8Boe6nMDQDHvTQB/1x/4nciABhVkta4Qd3Barv9Ki8m+UHpOvDnPA9nIHIYHGdSUe3nnkO7gX6lB5RCfhfYd690FxzNOgqiH/y+WYSoBNc8BzqDNWVlNhmDngiuHCZWlA/2qjMOgdvEZPkgHjOyJJQtgeucwIikSjwoRhp7B1zZ13Q7H7wWpea8D0Db3WgAUkwYk4ZqLwUOdAIjO+Q4D4J37gAibVEQ5B49BH9t/MJmEuupqFlzxnUaCdamnbgP2BlvvX2lbW9U1PaswrqcDz/6pOSqzGYy6JFIs+6ga38SjEurJAA9M6eOo94eBftqTkaeS6qUz+ApHwJv10EkWJl9So4HMehhEXkFnCy1Wp3FKaxjR4R1A1s3TyTB4F2YySZz40tTXfIKCjkcTmFGHdsltYa+zS0I58I93AM3qp2ASGFTCmPoNbEu7LrcgoLcPLZLLDGBUIZzFRi8cwQIfQTa9QYuHgSnCIt1yWHD5ETAPv37p08obXIFFk6DVynEGexgiuGaeAy+tCYzNgImNjPR/5wVppJrMojgw6TVhHgVOwEEU3BxmZDBp0trwsIywxKJdkBCQlcFnABuQUBpvhzqR4Je9fF6OIWyVsjYxqfTpW/6w3bJ+Zvnlfi9CWjEFryLx5KgZ/2XRpFBDgXPjRGzbU+AdVPJk27CkpILF07BLSP3VtTp15cESy31VCamkNtwWZBQ+EGANaD2ppBXboUpN+iJCeCKvHxmP3qWelsiEb2YEEpZbYI1oOLdWpnyYkJXefmn4nBqJJxgq7dfw5JHoKflNMsIhYlrw8ut5ypkSiVug28mhVgUjqh8zbrmy0XBcEUkWNLHXQIFZlCYPt5krTxmg225SWHAiD4qoGhCvH085pIAZqp7FcpCmCKx4Y71ZIVcLjfBuhjTG4k+XNBlL48p3V8Cvd1PoyrEqI+3bqowwMA2pmcaqUQfLqizYdXS7mBaXNw1SSQNSbGe/EyEYSKRnhluRFiRvkQ/5Ejw/tmPv5fWQSFAVa3FMmO4EQZBqKxIVGKmaO71hzi9yJyEWeBLQ1QsGo3FUqlQWNfq4Po7yb4zgMLTs5ViNgskviiK+kokAqLeTOwX9p0BmVl9Aj0v6Shardls1mq1lHv1Ih+P/Qt/7nxYsjwwMHDLJY1Gp9NpYHurd5Ffw/71c37hyJo1yNV1s+uZLUcOHjxS5JXsE+wxbMavHIpL+4/5qro6NLQ4388neNTwOb/l2F0ya8GECYunL5i75B852P8H4Adw3fbrg7079QAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAADAFBMVEWlYyzcozPUmCqlYyylYyy4eCvUmCrZni3wxGGlYyzOkSrtv1rZnizxx2XFhivbojLZnS7ZnSvepjfjr0SlYyzsv1m8fCvxx2XJiyulYyzxx2W6eiulYyzaoC/irD/YnjPxx2WoZiysaizxx2XqvFaxcSu5eSulYyzIiizZnizpuVLlskjxxmTUmS+ubSvdpTbZnSvuwVzgqTzCgyvxx2XHiSsAAADy2FylYyzz3Gby01X48rLz3Wvyy0rzuzLy2mDyvTfyxUHyxkPYnCrAfyrkykz05H/yzUz15YX04nzywDreqTjy1Vfz33Dywj7yyUfz3WnyuTDyz1Dz3mzxx2X16JDz4HTztyzy22PytCnyvTX////yqhv5+Mby2V7154v265jy1lrysib376X37aL49bz05IL38KvxymX15ofyyEX04nnu3HLr2Innsj7o0ln26pTUjyGzcirUlyry0lP27Z3epDPy1GngxUbqulPOsE3hmh/z4HKqaCuwbSrms0nywTzyzk/ysCPrxEn38a7any3cojH598Dvx17twFqujC2lgh/GhCe4dinntk/msT3kr0a0lCrfxEO7m0v6+PD04Xb487Tvy1LouDryriCogyH16q/QkSncnyncmiTyrB7lzlL04nqtayzhqj3qryziqC/qzWrrwEHvvz/rpiD49Le8egPXuzHq1l3mszPr04Lu117OiSPqqyfknR7jqEDs4cPz31firUHLjSrtxFGDW0718fDipCj4zz/5+MXDozGwhyXexXTAjjDIiivx0GTy2oHPtXjgz6jYuoHPqWjXukPavmyOaF2Ydmy3iivtphy9lynMq3vk06+9oDS4iivQsznv5da1j0e/jkXVpzW2fB3q26+xdRnJnjCkcTLXmD/YmD/dp0/zwjz0yEHv3W7AiwW/mQbCnQzAiwbhvju8lQDpu07PjCXktGL17+PHkTXz2nDJiypaJBPwyU2OWSLIkTXu6NW4mCywkjvLu7Xj2LnenkHQlTqidUDgx5i5nDwZ7fYzAAAAN3RSTlPvcHDfcN9gz6+f74CPj9/fv++fz6+/j5+vUM+PYO+/UOeAIHCfML/FEN/vryAgQIAwMEC/EIAAfbqs/gAABHNJREFUeAHdlQO03Noeh2vbtu0kY9u2dWzbtmsd1a+2zWvbtr0zc08mdbv87jf8rfX/NrOTbmuekv8LYfnAfqNTKrOyRk5ZOvXxwqLB04pLSlJQofrItm3CESseKSwaq1KpfBeTSCRER4Wa8iKFwsRhKx4uzJym8iWJG8LCwho0YhJChQg57cLCwkHzHiys6qdSJWn4Hl5ICI/H4TeISTqLSCFtLizou+xBwqoJKt83fI9VHQ1QW0M8WzRKBDU6EguGL8MLwfp0Pk9tS3A5na4Em9rK42uUoI+cUEErM2hgQj+VT8wPUSc4vcRGYr7XlRCNGiQdFE+m04Ax7x5hoMqnDOOBeqK7qKjI3ZjvBIYnTCyj2hXSbPlJ5rC7hUUqFaLhWG2g/rTZbD7tbvS6bOoQDhgURODSDfoNcX3uEkYXX/R3cMlXXHzJjRpEtIukY3l5TQQwC/n+uAHzcMLykhIdOoPPq6oiIyOz1pnNRaALfwR8L5VQHBuPrsYJs0qKkXSOtfJggOp15qId+S4QA0jBmDq/HYITFqRAMg2n7fcuvjzt3pG/F4sH6TRty/ry2ZiwovKYBQjvvo3yDso6N9GLix00be5G1hhMGBgQ/ggSAUaEi5ECbW4naw4mLMxqgpD0tq8D/Ag4R/RG4KIQCCZWBSZMqVZAiLjt/LW//vwB8OzV8ze8zr24KKQBoTw2KBxR2HXK8NuXjTe/A5x47oUbTlfE7avGW//GV/1C5oygwBVRZeln64wnbh4//qvx8tlzCbZoNN4KRKFB32JibV2CCdvI8RCiLF17yIjyVenaCFu0unTtT12xmaLfZGJlBIckZCjsVFlqWemVeqPxt7qyv9XgQHTFX8qeEcgdm0wVMCaMEHZwCZBO9nxZgJpwawjPE47FdgOYgimjJyZ0T6ySKkQWXdT1Mz/X1Jx5kR3u4XC2fLC5K0rQEaXBozBhcaKQTo63W3ZvTq5NBu+oLXz0NrCbXeuPeTStw2Qqh3sFr6WhhTQGFxj7othsdpRMo0kXi5UyZN9mdnJyHkNAAWtkyoRnBIXuha2SUGBAVB0iIykBJBl6Z7ITFGRGtn8GMfBc3NU6b3KBATVEdgtVp9MhCHvXrloRJIrPITMkBnSJQAdLMAGwtKAVGGQFUCDIwv74M8BHnyq4UrQeHdD/QAd4Yd78gu2GbLqUq4gnEESfvPm6sf5Q6oftofTsQP0BGJ6NEwDLmMztFIGEISVzc5p3XjEC6nfukQgo/vo7GfD0e+9LfZgbtssNAgmdESp97ZWXwBVx7Y09BrnWgdbHwv3vv1UOYjL3a+UGmiD7/eS3/Fx/T6vP3QTGkwnPnXevAOgRF7fBodfKKYZTh1PrXk49fEqf22IC882AR8174O1+6oD160/mOvR6PeUUQIu2bkqrgIPjxwsoi8dduHB0Y2eLH7T6Tgwo77nkEY+sJStZLFb5FzEH0tLSYsorYFA+6TEPxdkTe1fExmZu3ZoBqrv1H/8kj90ZS6b7GT/7qZ/T/1XhH5rHK7ZF4km9AAAAAElFTkSuQmCC",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAADAFBMVEW3eiDany7ksUXlsUbZni/ani3twVt4OwbZni3JiyvXmyrxx2XZnSvLjirxxmPhqz7boDDxx2WqaCzYnSvtwV3sv1rZnizfqDqmZCylYyx4OwbcojKqaCx4OwbdpDTxx2V4OwbcozPuwl2sayymZCzrvVbmtEvwxGG2divxx2Xms0ncojKzciuWVh+mZCzxxmOSUxnepjfSlirxx2V4OwbfpzqmZCx4OwapaCwAAAB4Owb////0vjX110j12U711kT1yTv0tC7zjBbzmx/0rCn36Yz12Er24Wv232XzniH1zj/0qSj0uDH22lT23V70sCz47Zn343T110b35Xz12lD35oL1zD735Hj221f10UD23mH0wjjxx2T100P12lL12Uy/gyP23Fuvbizbny+HMwDzgA736o/48Kj354X24nH12Ev47p7zoCPdpDT0ujL36Ij365K/iTHSdhbZnCn487C+hyr48qzaskffpznsvljot0/sv0/ydQi6eSL0pSXziRS/fh724Gm3eCq8dhvzkBj47JbxeQv476L354P23Fn11UPirED24W7MtqLzlx3zhRKGRgnLmVLycAX1xjn5+MbZnizJdBz48KXdu1rzzlvlsUaxcxz00lb59bvVlyjPlivasD7ccxLlt0nzkxr59LfblCParjaDRxPz6+Lz1Vrvwl7FkjPKnUTKmjr59bnyymDwxD3JYgjssC+JSw7nkiDmcQypZyyyfEi0bymlXxXUsHyabETy7LqRYDW/dhrlhxj598GpZxbx0UuOPQXumCC8hjfsew/atU7v1WH5+MXsw0e+ij70pCXknCvjqDXpiRnmtD3gqTz0tjDupyzqulOAQAerhWOjWA7cojGOPwydSgb79vHlhhd8OQXbumXq147x56myfUqqbzj59brFhiq+bxXHoGfwyFPtcAjoyFXToy/roi3swkPxzUbnw0GieFSPUQ3jjB2JVCWSVRG3ZhHEgR/VwrHm2tD38+/dzsGzkXPx5aKOPwrk06GyfEbJkEa14TvCAAAAOnRSTlPfUJ+/IGAgj8+/r89An+/Pn1Dfv4+/73CfQO/v778wMFCAcIAg3+8Qz69w368QgGAwEHDfn+9gIL8ADECelgAABH5JREFUeAHt1QNgJEkUANC1bds2qjW2bfYotm07a9u2bXv3bNu+6iw6Z/v+JKP8l1+uBjN/YfwTwPDxXboOvZGUNKxxo1FNfhqMH2lZty4xMTk5edm8ecXF7btP/FHQcbLFsnnuAqnNprHzsDdev1J8derAHwbDR8L0tU6ZyWSSOQ02nIcRuisJCaP7/QDo385iWes0ZZYElIESvkBmsNkxQoReCg1t+r1gfDvLXKksM6DWhof7tWol3+SU1oltoXc6fA/ob7EskMr4er9XERysyOVq9SUCJ1WDIbl+xz3wO6BZO8sCmyxTH547O2bFihhfcIRfX2Iq1ASprGZ5iNvd8NugtWUuXihQ+nN9z52tqTm7MC7Yq1Vmygw47HhY2gl3tybfBIMsm3nnsvaerHxqBcyHYpNPEa4OCJwanspolpftqG31DTC83bpj9vUkFbsP1FBxJOZ+CdjvIgZTmP5BbZv6YFDiSxheeHrOk+c/J+9+cR/kw17wTQ/alHPT0ao+GJpoxTRO2GXFZ19C8S0gQsVRYHt0Exo0u5FcB6g+b9pH3j0A+xAXfB8cW5x6+/b7ewGYP4kGo5LOUUCgLIjIj1m4m3zmyMKY2Qou7MMr80kq7t0EoKIVDRolbbHCPggCaq5idtzTz75YNxFwlDYcJ4+nrtqCrgRv7QcNaNB4mdmK2Q0mvr7Aq8j3+eJ8+cERcK43kGRs3eqYD0pLwXv1wDzUqAqyOWEJPzeXWhqKCG6Beg5JbrRBoAt7G6xBVoOx9UCYjsA0BlPd0uN6vV5uOFx+G8n1BpynsjK2gXcR5BYYUA8wGbBNNicUerW2wF+gVesD/DPxdSvcaF4EbiHIh6A5DYo5qJHA8GWRkZEnz8PYMEdZciYyMjY21uFwZEQfBaUI8jHoS49S8XUJw6riHSUfxWlBPP3hCfARgiCg1yPQ/eprHFREYG8uWbIkPn4jrLN+rcwJP6xa9aoj49ALFQCBsR88Av0SLoUwq2GjeLhGanBSUWiQavAgjCjSmZlp4CAFDtJg5uiEE2IJFCosCNfYbFLq2MDtGMwXmSVidgX4BEE+pfsA2xR6kc0Jg4LAMJ7djtvxoCAMUxFWnVnCEeZsBVT0mkCDib1Dc9gciVlnJWAVGFQ2UWSk8kOWl6dsvbd99ZTp9XfcwNCLLLaYiVaLrEUERPDXatRVo0yxEOZXVUW5ZnxrT7e4s4PFTpNL0GqGTmQ0GkU6RjUqkaexc6j8na4+Q74F+vV2X05fLhTLr4WhZhgoGnZNLg4pY3mo/D27pn3nXGrodl/2sMqEF8QcuZwpl3PEF4RlOeV59/N7fM/J17S29p08T3pOGVsYEiIUssuWs8qpf1+1lM6nARVtutWuPJXi8aSns1isw4+Xe/Ko9JdnuXaN+4HTu0lnqkhVSkpeVHZ29qGlVHrUHlennj98PzQdHR298vCpqux9j62pnLVz6awsV59xY3/0BmraYtGixYszsiu/yk7NynJ1Gjz2J++4JpPatnzekZqaNWLM4Al/1rX7P/gaVdDqDiH3UnUAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC+lBMVEWGMgCHMgCCLACBKgCAKQCGMAC1dSvKjCuubiyjYCygUxOvbSzXnjShVhjcqkuHMwHls0r0yWfpulbvwFmZSg32zW3eqTy+gCvbojb2zWa0cSqpZi2+fiuqaS3UmCyrai3Tliq1dCvgqj3xxmfls0mGMACAKgHNli3QlDLLljqjXCHZnSvuwl3AgSvWnC/tv1vrvFSxcCrWmivxx2TYnCzdpDOHMADruk16HQDntVCkXiHfqDvJiirms0jjrj/TlSrdpDTaoTLjrkKwbivgq0SnYyWiXSPgqkCkYi3cojLYnCyGMADSlzPlsETEhSy4dyvKjC69eyYAAAD2yjf664f57pr7+sb45n7mqij69rq7dhz56o2vZhT686v73kb43Uz454P11UP1sR71zjuKMwH44mj465L69LH0uCj52EL31UD32UbcoCvxzUP33FHvyT7221j33lv4wizhqC7tsyn22Ev4yTPLjSb20T72xDLyuyyDLgDxwzf863TBfR3pvDn35Hb3uib34nHztSXUlib23mH66n7NSwDz6rSMOwu5g0q+gCb2rhv0vy3+8Y60bRy8hEDwy1KcViGRQxDPr3z74VG4dinyyGXmtDL675b575/YliHy0Vvs1HbqpyD34mzRjyPy0Ur35Xn2tCDmoB7WmyvXuqjMlln1uynx0GK6bhTvqRz+5k775WCCKgT34GP33FSaSgngypP//9T+/83wy1iOPQT786S9fireoibIhyfrv03BhS3vsCPNZQ7FahPruDH2YwTgt0vdXQWnaDP12me3WAv6sxmoZyz36tnJiiDt4qf8vyX5vCXrx0n973vhrjbawbTgmh//+6rmv1r01VDav6/LlFSAKwClPQDv1GiiVg+/hCG5iVj59NDKjyujWBv//Lr985fjtTz5tR7+XgDUsF3sZgircT7v5q/OmVyzfDrm0ITawbXUspjz4cr/YQDv1m/tWgDVsprZtomaPQHCmGfAk2HMo1nYuGyVSx7Unyj79evFijykl6LyAAAAU3RSTlO2ptBGmbuoqXa7sJSw3cheau5cpTPN/MuAbOPj4a7v8a/A7uD733f+Qv5g9szozK/pHJtPdGXw0P7bJJTlOC6I40r7/BJMPh7Twdv9KbUN9gIIAKB2FysAAATFSURBVHgB7dUDdGSHHsDhbcq1bSO2bY9t257Ytm3bXNu2UfOpr+69UwS7NY76O8jM5P9dYw7sN/Y3gxWvGNntfOllKPARAoHBoIvn7LTb+erisJ8C0F2MYL3ezsgXBvN3DYHCfI3sgoP1wUYrfgpA/Hb5heyZd3PhIhNHR0f7RQsd5u1xCtm3y+mnAJDPsuWOD29ODOaOj+eu6tW7hC7xARb0k8Bn7cqlrcxVd3b3iJS1ZHFU9sUnq8zW+P/kTruaLy2ukEiluRVSaY+ITKKKqeLoi6sCPX8CWJsUt0okiczIC5HVzO5Eiaijg8TVRJQIgmwhLwLW24HFd1fHoCkUNLourrpbKlIq+TwN/KDc2AY6E0zNx6ERLCSylIWnxBgEn8rTqEDxHHBbCc7HUFjDbCyWTSxjGUQPmU/VwLUKgYfnLBBmXlzRkxiHLiVisQMDKCy7DE+pq+6UiMh8Hl2VqRAE+s8ES5YOKnuYdXhWX0FBXwoKhSUi8UnHDu/d+0TIBVahkxu7zwBhJsXXyNJqBOv/+V1d+rSUfhSxrBS9l9HVNXRXyKVrZQpBUMg0AF1mMagUJcZlfcbIv3cvr+t/qAH28OM3U1OL0vODG/karYyDMXaHTgEf86u1yp7EC5Sc4E/v3+/LzzvTz75SmuPwFbNzN4MgJsG1sZONZv5TwNVxvJYMgMq81L7+/oGjjIIB9hXWUYfDkZ21Q0PRAGiZHN1kOwXWWpynGsB7b5/BovoL0voeEYdZaQ8HmZLC9CgxFwD1VcZWU2D5DiEf2KS4usr3gdOASnmHDewzvvLqsW6JSCikakDQnmA2BUJ3CLlKkZQZk/UYWUYkPnpELEPiKUmRTKnkWiH5B+AyA/CUIglw4hB4ZBkQkoVHoA2nGryc6C8CXGCbuqsjkxBZj8GyEEkXIpmdnYVkEolLh2dy6ttrpgMvMY/PF0kqKlpbb39i6HZrxWDueaEYSEPXgkBtOh1EaKj8wvO7HzxQPzCkNnQaSK2Ww1W6eFrVxIYp4Lwtms6jdkS3FTXfeHd6zc03crJrIuC6+IyGka1TwHbbE7gGBDdOnTr15VTAt4/+M1Ku1XLqM8rD508BV4+LEXRNhzgqp6mp6folQx9cun69qenDfzfjRlWZ8bT2sXW+UyDMalU0XEMSJmTnfT677CiMikPLaCjaajkFIJ7AKuA8bgnujt7QTTDDp15CjU4GrEC9+Q3oFIBBF8gPauFcsZrQq9cH6xm3wBgAHCLgMDIO7URDUYDljDtuj4dcp6JrSqJA8d/kf4El32IA8wm6WNqJ9rHN+2Y9BNYI5JlaOF2OI/TeSn72MdizI8cJuBpFC+1ERs3JjdBZwGeLQK6TweHy023HjxwC5w+9tb8tqkYRWw/OBzg991wKCWwEhEpVknAXd2A/0IE23OlRDjDfDsz7veDJ5xYokCtaZCot5gv1XTD1qKLl3NOMqrGp+SlgWMcWYwFGwZHJZBwFWHzsWWD88sjJuX4/8fQOswlqFGAm42PPnQV7SqtqKE/3Xj/f8qdfKG5WQcaCUUyVocvl6hHv9Rt9f/YtCnFzDwzatFs9NjYxEh6+LmC+L+QXXruQMH9P99dXm5puWP3a/H1OYZDf857+B3wLayzJyx11iLsAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAADAFBMVEX50oQTehATehATehD50oRcSCUTehD40YQTehATehD40YQ5KRATehATehATehCwklgTehA5KRA5KRA5KRATehDXnCzHiSvRlCrKjSvdpDT50oTYnCrWmSrZnSwTehDcozTPmk/50oSnZSysaiudYCm7eyuzcisTehC+fisTehATehCoZyzBgivermc5KRDany340YOPlyw5KRDepTb40oTEhSupZyzboTHYnSv30IP504Tepzk5KRCvbiwAAAARZRETehAVVxUSYhI5KRATdBATcRAUWRT0yDYKPAoUaRIVbRMTeRD0yjkSaxERZhH50oTzvS0LPwsSXhITXBP0wjERZBETdhAQbA8SbRD0xDMOag7YnCsSZxH0xjQSYBH11kT11EH221b12U7R5NDBgitSk1C4pjIedRw2bycZbhcNTQ3jqiz12EoNUQzany312lD23FpGMhTI3sfyuSr10kD0wC8XchP+24eJlU5uUCKHMwBFci5on2X0zTvLw219rHvpwDezcyv10D6eUw0TShHaoim1vYTJiyuVr4LkrDiGp3323mAMRQwPVg/fpjfcojKQZyk1gzT71oU0YCMZchUUbhFCbSxPj0kUbxLnri8WcBMXcRQRURAJOQlhRh7Agx+SvJIOYgwhZBrotC+9x1VkkE6XrniGnSgqfCnqsy324W3d692GYSmvz6+KuIhSOxk/LRL110cUeBEifB2XdSHdzoetayzRxX9ONhUAGABkiB/232bJtDLqvW0PIwTGqDG4eCstcCAvhBm8tC3fpS1Aiz4UVhTSrjOSQQUufSlpTBdsbystdiBxijrNjyqpZBTPkirmuS9Wixzgqj2+yl+vbiyNWSWexJ292LxMOBiBaTz02Ih3WCYsbCCJpUxYQR3u03/w04G9nmAfLwikqVrTn1gsWh89SBRAVhosWx/LjyJDKg74zWV3kVL4z3S+zGVamlr343Tmz1K+fRvAwIJ8eyFIfRmZjSmltoN1oGcsdCZdekdBfTUBHgEFMQTXwkhoXjAyAAAAP3RSTlO/76+P76+/v0Cfr+9w38/PIL9wn1CfcO9AUJ+/QL+AcJ94IGCfx48QgGAwr5+/UM8wUI/fIDDvEIBAz58Q3wBcWb6pAAAENElEQVR4AdXVA7AkSRQF0LFt27ZnMktt293ftm3b9ti2vbZt295X/a1laG6ocU+8zGKfXf8yDwhYNmvQSIzxqH6zlv0DsHgEW8ZCjRCzaOnfgQlQP0mHVlYJ+CaxjsZ45JC/AouHQj20vLKyqqq4WGBCasQI8azeweJRWEgXRJe5AQgFIUEWhYTGQ3sD0D9Z8ELgkbg77ASIBHnKs9UMiJ7BKKxxCXR68WjZfjt4yI2PfORyT6QD0RPojzUFh5yOupXb9xBanOkiQOpsuRyhG49O6AEMwcJTgYeiS0oA2Cdk/gQghwXuUX0XdwejsC7OqV7XCkKL41hA8uxAOLQbWIrpgvojbrr2CdHpfETm8HgIvRZVjMd0BTDApf6OrsOEsvSfkSWbl00C8IARncEyTHu4fKltB3CU0veQ8hreXRbwmb5dQH+s9XBx03acUJm5N7mmpppQwB6QGE/oCIbMGik0eOzXdpxQZSr78Rd5NQdAaSmS4JFDx7SBIRhj2iCGfjsQmCQee1PdlQShaIwqUiAhXIeLW8EgzEcSgxbSCqp9TBKk/jU11Z24W10alWxBSqUAz2oBY3A5R0kaDG0TLJ68GuiTlj3fniviFUV95IkQhyCEI1vAEEwSHGX7BLWcx5OzfYXyszNnwoveh76CIAgGtwETAAUyabVisVgiUfv45KjtfU5y6blXwt69oeAQEE3fFrC4L6b5pFKpIElSrUYQqNv70GoMfyssLJwgSL4G92/d9LKRGMKUiE1ka6DO9iHKxtffLIw9BYV+rUcJsnbf0zexPRqaZkp0sDQ+X8AwDGZzM7Yw9uJ3Yzqe6c3PZAQ9dWvf9w0G3Dl0Q4PPxVuXPy28srDzpbE+IyjEHON6AfLb7499AXl29+4PL7C5Gs9VyT6XzukMtucGyfSixB+uQuORg19BDl7K+voD+PbONZFZJcuQDusMpuZWyFTcmGCrq+sf/lmXIFn+Dn7el11dE2O4+pAg5yvSzmDX+lxYkyjRZj3h7efg4O8PdUfvE1ZbYowIVuSV8J50TWcwO69CpufGgADi6OfnyNattmAYYA6ROZ9dKd3aCcCIPHYEK4CwsbL9e9fuwQ6Mzy2f22UC7CLvtkzFimAg9thsoocpigo4XZGwad60LnuATPT1ClFxQQBhExwcn0QFRNQGUAHPz9/VpzvYvBoEzBDFJz1RxyYpMvIT6o1X8yOOU+t2DRjcDbCCXRW36X5kc+5/fJqijkUczj9PDZRO6wZAzDT6HlDpzVyvlLpv6lKazHoVbCKg9nD+sZelc7sDyBajMeWACgxEr4LDk3AeBCzrbemGHsGujdONRuNtryZIhW/a9YSzC8ZT1PGXagu39fpSnDFx8pOPp6U5OztfT9i5aN6uXauGw7EdvaZXAJkyacmKhYuWzN/Y/HXHuLHjd/yP9/SDD/4EzUEFxFkwpNoAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC+lBMVEXMQB7Zni+7eyuzcSvdpDTZnSynZSzntk31AQHEDQasaiypaCzScSTZny+qaCzfmDzwxWHYnC7CGAnYnSvntk64eCuqaSzepjfMjirxx2XNkCrany7GAwO0dCvSliqpZyzBGAn/AQHAgCvirULxxmT/AwPaki7YnSvGAwPuwl7HAwPGAwPPAgLkXTLQlDHvxGDepjbrvVfEhSuraizJiyvGAwPrvVflskjirUGnZSzvxGD+AACnZiyoZiymZCzGAwMAAAC8dhvYnSv0zjz23V/fpzfqulL24nL232Xfqjv1wTCsaiz24W31zDr12U722Ur24Gnxx2T0yjj221f23Vz12lP10D712VDzvSzBGAn20kBrKQDzuin12Ez210j110X11UP////221X0wzLuwVr2Hhz0yDb36IfyqxzBgCn23Fn47JjMjivNmFTztCTirkLGAwNxKwD3NTT5+Mb48anzuyv35HbRlzP4Q0LusSf3KSjltEnuzEz35X323mLKhyXyz0LztibzsSH5Xl3lnx+xcSu6eSqxXiHtwk/KkkX5UVDltDfpwEXcpTLDhCnuwDrHiSr0xjXvqBy2dSu+firfpS7So2DYpj/gskD37uPboC7lpibyrh/mzKr7x8bp2sv00lbzwC7rpyDvykb4SEf365H37J/rtjL96FX2slHkx5fGhSLAehzWiCndnyj26I3Gijb5ZmXZliLKGAz59LWOVTGdbVDcuX3xAQH59PD6AAD59brVlyi7bybRXx3AfSCISBbVGg/fumHCeyu3aCTt5d/TkibfAgLGgy56OBDYpTb4PTz3LSv3jFbtGxbAMA73JCL6amrTokfZuJL4lGnoyWP35X795FD354Px4ZjycT/0pVD3uVz91NTGRBLQAgL3vWPyzVz22GvECwXhGhP6bGusZxbcxrP5WFfu4KaviHD35oHTpVPp0YPBoo/KsJ/aUiT7eXmVYEDodjrVqXHlpEr5mX2/RxL5wLnKAwPgGhPSnjnbglTynVOl61XHAAAAQXRSTlPP389wr3CvUN9gYM/fgDAwj7/v74Cvj59wn9/P758w7zCPv2BA7yBwMN9AcKfPEL9Ar8/fn8/vv78gEDC/UIAQABEHUecAAASaSURBVHgB3dYDlGNZFwXgtm3btnVfbNtm2bZto23bNqvd/9i2PeemZqVTGS//sxei/b1zXtxu3b/M/y3odqLbrBn/Bkw+cezqd7PW/jFY0bXf3CVUKjUubunQiXNa7xuPQfDMPwKThgsEZrM5Ozs7Py4uKCioU1d878o/A5PmCgSC15plMpmGp9XpN+YHMRjt58EDx66+Ejzqdyut6Af1ZpFTLBY7RRKZBoiyKI9C6TRnHfSDZ/if9JTZ//vphe3bX3z1dTafTyc7JVweCFIRZXevccHBo7qv8wPjBpy/Y7l3KzQ6N63lM8hbabnRobfuWe6cVygUbyye5v869B2gOAggNvTmpty0/S0t+9NyN90MjfUACBy/LVjRTqE4+L0FjwDxLgT6eIDlzYMKnCl+YLjgq2/uwk6WWBDRmyDR0I+1eAbcffnM7v5twSSBoBpVGgwvNX575tOvcR4+vH37izM/NjYaDDVol7qC6NwGTBc030A7DDgB6GhYWNihcJeNVowafrtLHkMMnOMDuprNPAZ6YMBpQqjyvbCT4a4LhSjH4Mk+tD6ljujtA+ab4zX5KAA/+L5K9TZCO06G30fonOp6kwGvtJOpjiHaPwcrqFSdRrQTwaOXQ1SqwztQzqFnyPFApQo5AqASEUx16h5ijBd0pWYDiEOOGsPxkJCQI8cBfISOXobrABrQrhJTRCDs5AWDqBt1GmPiD8jRYPjk3OF3ctCH4c/gxsfXP2+q+RKhPCGADUR/L1gal6zTSMj8KoRQQMA+hPZt2eK64LmRg9DZPCkG9lMjfIBSx5OJ6bRH988iqF9wbXFttj2KwjeSCpL1JKsHuH2AVK/lish82mPb3s0uyOa9tseRbDpZBG9yeMdamWoAxV6wLEiqh53EiezIhKe2vRDb04RINj8R3uLwoZByStarU+1XCn0ASanTco1iOpsWmfABJCGSBn0xHgBAaJKnpNqLy31AER4hE4kT+UAgNBqbDn0J9HWwkUkeWG8v7OAFvRlFJKVe6xF0Pp+NP3F0MvS5PK2+daNAe3r5YC/oysgTwggQRqeYnIhDFjuNMujr8Cl7NjqQ2dEL5lAYJRwlFlyJUeTEERkl3I03rl10J5OEMAA2cpT1ef7mG0rZaiVhAUQmwZFxGRezcKI4rQPSy3r6vFvnUSgmIQhMeBocxumsrNPV8dviedDHAwozengBpH/BVhBSPRAw2nw4+rX4bTwlCU7As1B6xsI2n7i+BQURJitHqlSCSY6Co+dDXUoS4j4sVJrJWu0DIL1rK+SmEiGHJFXmnc66VLVNK5WSONaS1r7dweri/700srYigomJG7aR8UgkjhDqTNgf+kmsnnP8wRwQajlzKxy++gmUrSW4HpEC/dIk1tg+6/wBCKI2Rn0p66JMacJhrper4fD19g3luO8PsOhEEHVRVU+YcpwItToF10uvlOF9/gBApg4kCopiAlNwAgNTPfVMFmvNn/8oThlKEMSeug31OKXpB5LKMlirlv/lr+iU3u1PXXG73cXFheWZZRljh0D9LwFkzLBFExY4yjtMGN2xz3/nr4NvfgWfgzQFoq40AwAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC91BMVEXdw67ZnzTwxWLFhir89uzYnCvYnCqxcCvAfyvtwV7////ntUylZCyzcivgqj3ls0janizboTCxcSzZni25eSvcozPxx2WtbCzot0/rvVjmtUzPkircozPhrD/qu1WpaCymZCy3div////xx2XRlCrbojXwxmPYnCvboTGoZizgq0DmtUzwxWLirkLcozPouE+nZSzYvKWpaCzot0/NkC7////QlC7004QAAADZnCqxXiH///+8dhv11kT232X47Zv365P35X3343T12lLpuFDxqRv59rz24Wz24Gj12U/22lj35oD23V723Fr23mL35Hj24nD0yTj12EvbojH1zz3110f5+MbBgCrxx2T48KTgqTvBexz0wC/12EmHMwD48an0zDuvbizOmFSPOgLqpR7DgiLEhSr354m4eCr487PXlyX59Lj48qz47qDqvlflskjZlSC0cyvLjCr12E3izanwwzrZtn336YzirED36pDzsSGxaBXCgje8fCrWoknmyHjjsDbuwlzyrBznoR70xjX47JjksUL0wjL11EL100DztCT36IXgoyjkpCT221Xgmx7DmYC1ZynzuirQlEThqjLboC7lvk7pvDpeJQHLkDLUlizHqVT/YADbbA6qaCz88df5XgD99/H01VHkvEXmvD2lPgDSmzfdpDbxz1/wyE2ZSQjTkCTQr0n/17+1ZCTdslHXozm7biWjVg7iw0fASADyzlbyzUXx5dn04rDAdRnu3cbiw5vqsi6qXxLRihueWTDp2c/hoy3Nm1/puzW0gGDVqXHqrCXgv4j5+MPSTwDrxET8jEj/dCDo15SPQBC6by2EViTIjU/NcRTbszyoelPzZAXjyJLnxYfajmDJhCbSn4Du2ILDhUrv67qlZkC6cTb/pnDSwYvn0p3QWgfqzG/AjkSrhkNxPRDhrVTSs5/l2qHs0GrhVQCgdSaOYzGEUxjt2XiXayiXaB20kUVnMAb/fjCucDnszZvVbhHq1Li8jHDy0ZDbt4z4s0iGAAAAOXRSTlPPQK9wr6+/j4DPUDBQQI+/z+9Qj7+AgO+Av6+/3+/vv4/fr+fPn3Bgz59w35+/v59AcDAgEIAgEAAodmsRAAAEc0lEQVR4Ad2VA5hbeRTFa9u2jSkeYtt2xrZt26o7tW3bXNu2eV+mDep+3j1xcn7v3Ju/Oix/Sf03gN7T5ozsyWTO7j9/Vu/nA4uHTdZmZoaFMZnM8PC8hLH9Fj8TWDZHC9q3Zk203KQi7b+cl6DXT136dGDaZK12I58vEon4ZQyeXEUqsNbrN0T1eAxwXh7sQjGZy+WSxUI+I9pEIlmbtqO75nk9DoC/p1bLF5E5dAmNJqFLuWJRGc+0bheKapoUM5Y+BoC/urotbSOdVhyfmBhfTKNzyMKynWCvl+XXKMZ4PQZ0+hQlVP0GRafThebGF0uk5EYU3UkqVMqMNbUDvB4Bpmm1a+vCqm+gldfYbHaghZJYLNmBbl8LnRdac6pO1Q72BBZrtWvKxFKBvx2tPKhWXwy2UOI/RNE6aINUoMwxVtUiHT2ATtp9PBFX4k8JPI2+qQYiUEdNQdPEIgZEKGX5VeeRAe5A78xMOUPIoSXq2Op30PtABFvS0RvSrVv3RDtqMhaVINPdgPlhm+RERVQLW30BvQUAO+QW+tEnDQ0N37cDENHNDRgXpmoHrr33FkQ4EiorP24gdAeakBmrkhBkqRPoyNykigbg25tguPv+fQgI1KWnNxP+H4muoYmiUmS6ExgBACRwfmggFKO+yA4OCaX605q/++arPTA/HIAPMtUJjGLuB0DIaXYAn7ODA0N0xEBIYbB5DxOymkY7gf7hhSQ5Q8SlN9+8+XWcJSTEEkqh+gvoHJhP0SonEOUBmHh8MUciiKfmUkJDKbmJ/gKJlAtTlhjqdiDIBcwNV5KgayFZKhHA3KNSYfaBnwi4XKPIsBJ/a1JWkJ8LyFMWkOQ8vpArpdMExSABDfxk/h1fHGQ44wCiNC4gQVZIUkEXwrpG3NC44wsJsSDq2nA85cgB7DTuCxUlsfwmOoGpCbEQYeIx1uIP5NtIXPvcYQzDDpxIxkugBR/NECcwS19vJSJ4vvhms9l7d8o5u90eF7Ma7CfPms2b8SCoqDy1uxNYrM+QKYFYhyebCX2GtetkxQniIwBQUVTAINdcGqPPl0FR6/DdDuD63YqKirNvm0HrL61q+QCPSMpiBQx3m3yzNmTkWJUF9QB4yPvVqy0gAFhbIme6AV4DNxiBOOMJrF9/BdsG/nt4OQTYljoB0FBFTX6OLBZPdl5775dgvbrtXXj+1cBivWaDABcAXSiOGnNkdo13u3/vqhan7uERrHLbcC9PoLdCcTR2JfbbMYf/Uoub/5CBlR25os+j+9L0Wv1KDDtCDMT116+4/D/F+WWDf8LjW+Us8B8swfFj3r9jqx/aV7UexlaeilwBDTwGLCH8RaUGHP8Twx5U03oI/wUmx8/gfxzohXUZiCDniyIMALS2tt6+DfP0uE9EDIYtfNr54NUVQZDS839gGE6Yj5f7RKTaVnSYtOwxwKmO3QB5BVtd6pOdHbRFExBpG7/gOYfi0s5T2i6kRfn5aVIDIid2X/Qix65Xx849QJ37er38Of3/BP4FYt31GLXnFhEAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC/VBMVEUsIAqpZyzIdg7irkHvw1+sZybIdg4AAAAAAADIdg7Idg7svljfqDrIdg7wxWPIdxDmtEvirULZnjDaoC/xx2XIdg6oZizIdg7Idg6mZCzvxGDVmjGpZyyzcyvxxmSzcivwxGHsv1rls0kAAADQjyW5cB5INQ+abR/bojKvbywAAADYnSvQkyruwl4AAAAAAADIdg7TliqraSzepjgAAADOhRqmZSzgqTzxx2WxcCzxxmMAAAAAAADhqz6mZCzdpTe9fiuoZiwAAADIdg68dhv11ELntUjrwDvAfyn35Hj23FvJkEb36Ib232b0yzr23mH22lX1zjz10T/100H12lH476H12U724Wz1wjH110j11kT47Zr24nD////221jzvS3iw5vKiynOgBPcpUL/uWv/sG3rvFfBfiTcoCnpt1L35oLEhSrenCT0xDPrwk2xcCu3dirgqTnHhCPAeh+9eRr465T0yjn343PyrByGMgD20D33i279knXjr0P49Lvu3cbAdhf36o7aliDapDj48arUlif79fH487DmzKr35X3OfzTzvy7ysCHyrh6tayz110b23V7q1Lj22Urr1pXeu43xx2XNjCTEhzju2IbSo2DztibXmyrzuyrzuSj5+Mbkv130xzWtc1D59Lb0yDfXjhnvpxzqpx+tWwnzsyO8eyrgrD/ltT7NmFTpzHjqujPptS7VkDrVqXHtxFbhmhvVkCPhoyPltjP8wmPQjzHnglLy5dT+nXXymVzosCqNPxD4n2WnUQT+p3Lp2c/q0Ijqqyf37uOsZhOlZkDxx2TRminKeBLZsn/ar07crTPih0721FrSnjroqiXtryXzzV9aIwBwMAh/MADzvCzhzL/IpY+8jHDvw19gPQ8AAADYezfmhEv1uT7swUX5tV/5qlv42W/4xFf8pWj40VPu4Kb42Wfdt1t4OBD598Has1/Erp/av6/LlkW+dR2OaFBoKADw4KRsThbHdg/z6K9mTCrht2qqlHi/v7/f39/yqhvZrEQwVIduAAAAQ3RSTlNQ70DP3zDP378ggHBQv1Cfv3Bgn8+Pz9/vj2Agn+8gIK/Pr5/nWL/vz69gj684cIBgz4DfIBDPgJ/vEDBAvyBAQBAAJIE36wAABE9JREFUeAHVlQOc3EccR2Pbdmq3sTOztr17tm3bts3wFCeNbau27U9/898zar7z3PeNMWjr7+T/KYy6T3j2twovPTuSEkY9+xuF9fc7GEBYMHbRYitbWzp96JLJc9uF9eufGUiYM+3U3bu7djk5OdHpgYF1Q6dsXTdq1CjQ+heeHpaZefWiUCqVytOS1ZJX6+tcX9wE5QMIa1dDXM9OEQhS2HohpfDrXcOnrqCGsXR9b2HtNKg9hafQentrFbwUvVROOx+Z5Waa/9ggMklP9J5WktcLFCw7LpdrF+utELDr3TGF26NUf3oJVJ6njQ311Mg0nqF2LO0lzMw4rtOlNmCP51f0XelFmVed6n46915OdFlQWYTMk1uMmXt1FDEn7j3ybG9hwikrU0zxyTtFRUHRslB7TOUJ3/Xt0tphtu64ISY4OKYBWxMjohHvhOjHJ0tf1um+7yvMsXLHJjoKE2wdVPRB9Ic4Ff446OtbqtP98M29L6f0FIa14QxdOxk4lxKC4ff3r904SRVFLhuzfHSX8LSVezbJ3rqlA7Jxp/DR9YPQJV1uCCKMH90hjDXHZ6H8jq/vHfhxFqeXwRigpAPmV21fF33xrdms0e3CEnOcQfX48+vUKNKjZRprZlRH3iQENUYAOWhiuzDJKJTeuPYZ1eOjMk3oOcxpN/biELRLQQhHK4wCPRDnwn+ibt8mmVycownlxl7C2amkMAPjB4ihIjDQEKMQSHfrWqbj2N4T8ixFOMbMBg7G7nv2oG1iwrZOob6lswNRHFwMu4+l5Qlsd1hjHHfB3/8h2l5OCEOjjcLQQNFpzAkm+WAO3hHLYnkreAL2RQvLI/sCAvz3H0PN8UBz56A31HmJT2PM2bkTerDD4g2tguSF0rdbLSzfev0VQ56ZWUJNVQUasaJdWOXKENEuxGEgbr+lxbs8OHR6oVSuUtPEohJlQc1uRJgOeaMwztX1gM2DPf7+AQH7jli2prDZJJ6mUqslIi9HQ16CT9anE5/r3BpA0xkEPKSEVqFQCLcAnGnI+/FJA4mVtWu6b74VI5B5elFQ25lDh157U06A2lUd+ZvQQJPzC92F6ahYI4sOOoq20dTJKgoSp1F5Q2GNT6XL4C3dhBUoUuEdy/VshOWh0dRG0tIkYpEXlU/80S2JNNApDEEMqRDuFxbazheJJRIajSZhVFef55c7GvNhSTO29hRaaMkquVSPDpSUe/FFAM3j8OFqP8f4m1TeefDwHsLWWRXlfLFEzUCX45WOJSWwB/xAOME3FOZR9UO+pzAG7TYoS7y2I4e8AkO8ksDw8GiBeIJPpVvPPAjAeGS2u+pKBcq3OZZXWFhAUCohDtW7JK2EfE8BGDMTAROfzM+3uXylhpCQkOhT1VTrnDR7S/9v3OghQ6CmuVPzAZtmBweHsCymi3PSvI2/9iiumPLUMlNTe3tmrcv8x5dv+W2v6NzNhIX/wDv9fxF+BksHQrWz5m5QAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC8VBMVEXgqj2HMwDYnCvxx2XepTaHMwDepzjSlSrdpTfDdRWvbSvZnSvvw1+HMwCHMwDBcxb22U/Idg735HmoZyyoZiylYyzhqj2mZCytainboTLwxGGmZCy5eSvrvFa9fivSlirot0+lXBaHMwDdpDXvw1+vbiyHMwCraSzxx2WHMwClYyz1yznZniyoZizxx2SHMwDksEXIdg7xx2WHMwDjrkLUkiOWSxbTmDLxx2TZnizboC/UlTfYnCrany3any7oqiSHMwDepjj47p7cozOlYyzPkirpuFDwxGEAAADIdg68dhv110j343T35oP12VD59Ln476H36If35n724W312ErboC70wzLysCH48aj23mL11kb232fyqhv23Fr12U70wjD0yjj0wC/zvCv22lT23Vz23V/12EvZnSv221f24nD12lL110b0zDr11kX10T/UjyH0yDaHMwD0zTz0xTT11kT100H11ULfqTr48q7Oiyb35HmsayzyrR7et2v598DTlzrovT7sty736o/swjr36Yz23mHksTXzvi312E3PlCnmuE/s0HX47ZzztibzsyThrD7zuinKkkXUkyj47Jfepjf1zz3232T24GnFhyvqu1W5eCvosCzyqxzqpB7PhBf001juyFHltEnAfB9aJBPuxkrBgCj365Pxx2XzuCiwbyvyrB3Ujxzu2IX////dozPRmjLqrifvuzLquTPblyLTiRfrv0zhoiftwVzBgivTkjD59LXu3cbq1LjqujjWmCyhXBjixn737uPoyWrrymTZqFHLexDhmhzhqzLqy3LLu7Xux0LzsiLzzl7x5KrkwFSDW0703ndkMiL49PHLkTHVoUrlwGzDhCTOhiLOkCRgKRTYlR/jqCrjr0K3n5jiw5vJeBCqZxrVqXHRoWLNmFSYdmzZsn9vPzG2cRuFSBfyyDuoZizyzUXryFveu43s0HvSoEG2ciSeUhHjs1bpz3rLfRbXr2barUzx6eLx35DLq4x/QxY9gOOwAAAASXRSTlPvv1CPcK9g349AgK+AQN+vQIBAYN9QIL/Pv+9gv9/fj3C/z+8w73Ag3yBgQO/v35+/IGBgn4AwEFCf70DvMIBAEM9AQCC/QBAAfZIY3gAABOxJREFUeAHF1gOQJ0kWBvC17d3j2Frbyvrbtm23bdu2bdsYz5xtM3RZbXefX/BFfL9U8Y4v/8n6H4PXL9xpeuzeR9f6Dy88ZjIdvvDoruBO01K9stofhnFI7twVnHr0wy+/PG4ynfp8qR41HYb9h4+e2nsPb75gykhPT4/Iz/+t6dB9b+yz6efufqn0972+eXlFRUXNjt/Vxt7x6nN7gC8eKS0tncqVSNRqfBhVo7NP+MU6kh54Yzdw9CSMK6WyYFawjKdU86kaq83c7Ug68snO4GUYz6u9iixGYFWUVJZUifcLRwquh4TU1NyzE4D53KICBK1FHNmtSg2uRZbqVkMN7a3tAM3nFiDfW6jujEeGAkhk7AxS3FVd/W0E8a+vob2/FRyFeaUD+X41rP5i5K+JQeSrSCdsoLhO96fR7toMvjhfmquWLSL91Wj9COljJkYi8dVLVYxYRJm0s29sAo+UTvF5HARZjnQh3k5iJPKr5e4HSANdfEvx1kbwxUutcrU0FQULs4U//hviTWD+AQXj84U/hMASGq1QPLcBPNKaJ5cEq9AlfauwsPDvSB+BWYUuaRZ2vYjZIiqDU2wAX0tny5Us1Z/hpiGAkWkCMyoNbhqCGz8JNxsFcQzFu+vgaHqzJgyCOXisf5kt/CnyJ58OZtQAPNbx+RvfRQKTIYhpUdy1Br4ZUbQEyJHLFy7eh+CsisT9BlmqEHuykC6OyVZ8Yw28GvELtlwio7hJVZfTkPg+QodzDADX3EwtUhDup1sGFT2frYGL+TYdPCUOlhyUSGQ6nU4m0QV8QT4lhScJw0BgFEAQfv9GYMXgeSyKGxdUEkUkEqMSQfs06EmV8dRy9JZF91CRkLYObuutmjCJlKNy40gBJSUlAWPgsg/IYUklfCrbatMaRXGTWZuA2a6j4pUyKMg4HIlEGgTehGtAplSjK9JrLaFlDK6rbQP4mQ1OoebJOBSsG6184M1sBzzJ8kMkpIdGM7hpX18/pdjAZLsOw4ciJZWighULrhDbgYQv16AToFvwym776hq4x9Gt1dvZVL4aPqCsFA6H4wBVJQlgQo7RoRPAFU1mNWY8tAaec8QazXBRmDC8RMmTSmXSJPBrUgIIxMAdwx0IxNFeXFfGg+v30kdJ9cJkm5WNkfPxaj+DwZADIskJoLHBii6IDieoyM44tuHmuy8pxKKFQqfByOWjAK0BrAGAm3Y9XJAI7oDrKn9oA3jjSE09KuwowWComEowSDGAbvNSXhzNyMouP3ZiHcApakZFFqFZD4lVp2OzK8EvUwxAn6w1ovnJCm6x56HNL4EXUWHUQmKzw6oEedIcYBYa6Wjei2vwPPPGZvDc27TMUAFKzMl6vT4H5EkAMFoEoXFovrH83Otb30vvQSEW0S1GodC/EgBQxAc5ApE4LpoB856fn97+5nvvrOJWmThU4N8EwB97biupw2AkLjqGUcF1bchDsFHQ6spihsG1KwFYlloTCIYZDK+skQzPuWd3fnu/8bBC0dIEhghROApPbtXfBCNZ2a5yz/Of7vpBuet+xXcAwVniTpFg7OZMkFNc7jn3lT0/u68BXx8iSSXl62zaTICUv/D0Pt/pB8FQRyKZo8TAB7kOPH5i3w/7JeDLDMLK8Gyb1lIHnjzAn8CD73z81FNPPPHEmTNnPnjw0v/xX+Pg9Q9fIHF6dub5qAAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC+lBMVEXxx2XwxWHany7ms0nZnSzbojHcojLgqj6paCzxx2TcozPZnSzvw1+oZizksEXTlyrcozPcojHxx2WwbyzuwVzuwV3boTOubCuubSzSlSqzcivZni3hqz3YnSvms0mycSvUmCymZCymZCytayzboTGpZizrvFbQkyrwxGG6eivhrD/ntUyoZizxx2Wvbizxx2Xany64eCvAgSuvbyzYnCoAAACdSQT0yznZnSujVA/243L365HZoC7gqTr5+Ma9fCn35HmjUgj24Gn24m/1zzzztST0wzP1zDv10kD10D712VD221X0wTD0xjX33mT110nzsyPyqxvxx2X110b0uyr11kT11UL36Yr12U747Zjntkz0yTj24Gf0yDapXA6vbiz22Vj23FvgrDLirUHbnifcoTD0wC/59bn45YCpaCz12lLdpDXhsUb48av/uG3SnzX48KWuZBP47p3auXb0x0nvxF/24Wv0vi3pvzfFhyv36o75jXDyrx+XQgL23V7blyDyrB312EvinR/35XvkpiXXmireuVm6eB/vz0/gtDXztyjxzUHtv1n38rTAgi3pulL36IbppR/cqCvhxHP24o6uZx7JkCfyimTzoVrnsTHWlybizJWvWxvzzkTNkSr10FDPbz/830vUkSTvqBz354O0cCLssyvQjyTuwj7/71rfrjfyhWj/qnHIiSqzcivfoCf7xmL/r3DqqiT3lmf1vD3Vqk7EjDTsxk3KlDPo16Hu4q7ftDn33F3zzGC0dCv343XquTq4cBPAiUX50XvLoGHlxFbJjyP9lHf598HnoR64eCvcv4HKjCvuzmb7kHTFhiaybRrIhx+tairDfhv476L4yVTOcz3ngFnmkFf+o3P+mnb41V7xkVHyqC/xkFD0okzzrjT1rlfnt0H8tmbxzFnvryTguUvlwEr9y27w1mHx23XKmky5fTjhyIXWsGP3xVHLnFPn0IbFlFH8xXz1iGz0h2vy56LOezrOdjzUhkCzZQ3tp1j+nnXlgVoYtfX7AAAANnRSTlOvcM+vUBDvMFDvgO+fv7+Pr9/P70jncICvr1Bgn7+An0CfcGAg18ffIM/v30AQEICfIIAwvwBbxJQuAAAEmElEQVR4Ad3VA5Bj3RYF4LFt2+aObZuddJK2bdsc27Zt23i/bdvYN9UTjKf8/tVKn1rfuee62exXzP8HaNu805gx9daJXVoOaftiMG5q79TUmpr6eqvVGhMTPGHQqOeCyZ20Wu3xD1dKzYUqnWH5pveDGYxuo54NerXHutPpcrmcsihzoc5grD7FYER3eAbA6bGep7RxuTal8hgSlc4oJp2Kjm7R+mlgcg+t1ulSplHZxcXskzyu0iWTEkIkDIpu0/ZJgH2cnkuNaDBlZZkaIk7ylHkoDEYJSRgU2mbUE6CZ9nhF/C0AmH/mu4QkS9Y6Nk957OCCRBwJvEum46r8QXOtNp4DTfm+NiGJhuIQPMpdejd/MK69Nh7H13+RfO4MBeBceGxSVkQdjpQvqLxwGv/eJrfyA51SY3DTZaa5Xx1mHrkDlNraBEsZQOInFUcrMySLOcAhd/cF42pSy4Fz/vP5AHCYuRRgaXisZT4EfnYwEEcyREsANpIH+oBONRUcyOQdAADKESbTDeYB7OeW4winmj8HIJ/cwgf0rqkGiKGuhy/DmUxmshvMBSjjAtzEI8u/DdAYQh7lAb3qD1YCfMxbD5Srl5hLKbDsUm0CgpPcQEgMMhiDOPC7uoTcxwOG1Ke4QRk05Wp47D0EVK7nwBYJ9pT294CW1uXEktLY+ymAoSTXxiZYiCXZ8lZwAMMJ0QsKSsd6QBer2BAI5TZqhGnu198m/xybcC+JZgI4gNeT+Sj9wpwAIYIl17wgRmxYAHDo+tmz82iWJIyFZlpXBxBfESW9/00K3y7Xq/2BxFgdCO4s+2EejUbDq499ndM0ciN70T69WrMk0wuC+caUh8vAnUVxEQ0N64rZ1LTzieDOjewfF76r1qyp8wEB4kVbf3q4atWqB//bHfdpMdt9Q+S98cdvv/z64C8EW9/M0WxnecCg4E0SBNnZFy/+uQ0BlcdLw77LGRe37bXXLxLg7YK1deM9oA/jlChloQcobTYlUZdJdz0CC98qKGIN9YC2jC12/vL39hJg965jeRisR0kLVfc/IMDed6pyNBuvjGwCmO4MIUliNOhWrjRLo2Qyp0yGdfejBu/pfcL0KnWBhrVjihd0iF6sIIRBpyo0S81SKbaJOvb5AQq5XpCjyT/Rz+dqbd0mOsxOkohxIzqVqhCjcteNEhEJ+7iBtSzHJB+AmwiSK0h8sRG3gkiHbayLJSKc372gNY7Ofrdo6+6hi+WKAJFEjAaREdtiCZ9kJ/q4oCJH5HQfgBkWGrohTGgnifgSMSYjKIMvIgUohGF6on/5ROSIx59LA+mhG9LlQkUAiSQSzcnNzd1CUgjl6bj+HE0jK3L4k4/KaXT6Bj0SoUJhP43g1mqiLlC75+/8tIdxBzq5pEqvTw8LkxOgfLO+Cqcn9hfnfxJgWnUkh+wRVCEqgVyoWC0g6kUsR2TfZ70fRg0mk0NKPlKrBemVm1frcwrW5rMcd0ZPes4ra9gscmlpyM6djY2Nl/PX3LyywzF65Ateim27jl2x4tr2zMw61pUTPYe2e5nX7vRhM4j0HTDzld/T/1HwL1hLz4p/REHnAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAEhklEQVR4Ae2VA4yc2xvGz9q2+W3dLmp+tW27Df7Xtm3rJEW04UQbFZtGE9UNLrfRBhdVtNHvPjmD+utc6/88Ock77zvze858NP9M/V9euxfy8C54jX8MfptH1O2/5ueFnu81eo0Bu78g9Elv2W2/ca/n3270rNfnISPIO7cO8XodvvC2eF/z3tvhuWoXcm982GjuNftMr8H5gqp9Zpu6N1OWuQ34XuEt93aT9xkj0MkIOI0csuUsUol0FLTtBkootr2EAmpJviAMRTQwnHbnkaqG0EKZooyseD9+/vbFf3vyzoeIQgcoF7CLsUxgkvMExunzKIW0UhMNyerVOdung4r8jrmdFNErP6tFCxkYMhkk2Him4DODmczSmqF6inpdCm6jgVJ3wHJpiZy3bSYRNT4rPAWMYAyLWcsG5rKAhc4LVM/CZzJLmMck6ilH39bytunUJqiQ8HTxIB9jo36RbayUl7OUrTwX73/IRmpJx6ArK0Hda8hhDh9h6SbMCTnkYI+wgXU85epDrh+m24UMJQVFbEvo+JgLqUzAcpBzXFW/Qz3B81hC/MBVncPyAW0koTskgYO0z1DBW9irEMGvAAMuQnhVaNp/dY7luchhetYESzsgg6VYTgA40Ads4x4ORUEKVkCPOnv5Ir6JMJaxCf0HHf9iHsYK4iT8MFrkdZwDQi7ohD6pp8kBIrqCZXdC5yFkqOEteuJ/fq9Azq53jq9AVax3T/w/hHiEVAwiBIp06rHxgCtCRFCdHAN+kOGQPkW6TxNTjwLSUEBf8BVEDnW8TIiYDrHO4V+iHzjBOeC8PilCkzAxdccCCArwIwH3YLlCRAOC9iimP4qJRPer06NJTD9g2RR7yrYHBuRTw3wsx7hZX2Hlfm7WISwjYwF+YEA2VTTzDFa46/UDB/lMPqjq5uBHySLljgHthkzKaWCse1CEGSCmcwJbHuExrKqr4QOE3Z1cQQZJLiD4TiCVEmpoZTqvYmUdaS3B+ZT72cZmHlBl6eYQYU1s1HWkxQICdTKJQipoYDAdgr2EdX6bR9nEOnkNK1mlkDejk0ewLn5j7AD1Bge8Y8imhGqaGUonE/GZzXwWsZRlLNdaqnq+ej4TNR+mnnXP1Gdi+783OKBdB4l8yqilhWFCTGAqMwScyzzma81VPUO9CQ7fxYccZIBjWEzEjSZY+otkUUC5ixjCKMYw0b00pzv7qieqp7ey5ndhOQ+cwFKawAGKXqrJZFOoiBqaaGMY7e61P47xWmNVt6s3SLNaniAE0YA6FOAn+MJMVUQBpVRRT7NChgg5nBFaw1S3qVevWSmPuQMEPVgSf2kWmguKIIs8iigXqJYGmgRt0WpSXateOcWar8QK3o1lHaZPv0xQ7YoghQyyyVdIqXAVVFKlVaG6VL18zTJIFdhG8Bfiz6DEI5IEyCCLXOEKKHQuUJ1LloMnYyIOwgdE9BkUQgpppAuY6ZyhOk29JMxV9wXgA89FKIZIIjnmODrud/TNXy1fVzYBDukbv1mN2uPJG9EKvleT31V+3O3m//q//jT9DNx6QW0zDfORAAAAAElFTkSuQmCC",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAADAFBMVEW5cxWqYxCqYxDbmyT1ujOrYxCsZRD1ujOsZBCqYxC9dxOrZBDEfxWrZBCpYg/1ujPyqhvzuDH1ujPrriy1bxH1ujPytjHKhhmpYg+pYg+rYw/foCaqYxC7dRPioyf1ujPDfRXxtTD1ujP1ujOqYg/1ujPRjh3vsy+yaxGqYxCyaxHytjHVkx++eBPyqhvbmyPkpSnVjhfVkx+sZRAAAAC8dhuqYxD23V2HMwD465TzuSj24Wz32lT0wC/12lP35Hn24Gj221f23mPzsiL24nL48q723Fv1wzL12E31yzn110j11kX////1ujOyaxG9dhLzvCvyrR31zTuuahb12Evzuyr232b221b23V/hmhn59LX47p3ivEbAfSL354X23mD2zj3PiBb1vTX598G1cBPwzD712lDCexT1xzbEhzj365Hz33z36Yr35X3Ciiv24W7zsSDztia2cRvzvi3AgyDOlif232Xy0EH11EL12U7ztSXPjBv10kDLmTXyrh++gSnVqXHz5pmtkon11kTyqhtaJBPy2mrRoUd8QBbRmirXmCH35oKtZhDfoSbusi71zEXjvEHet0bLhRfFizHzuDH110n343brzmGxcBn476H376jyqxz1wTfRoji1dBzXkhrztyelYBf354bnnxnqqyr00kveu43y1lr72UxzORXu02bSixf47JjHiyL2xzrmyGnsvjfjoiDspBr0xjTLkTH11U7cmyTlpyr23mHuphrLu7X79vH35XrGgBW+hzrVkx6YSQjToy/mzKqpZBTUq13arkP61Uf94FP05ZLRoWLkszHUpTPLlDv/51vNmFSjXBHnw0b43VfBrafqwTm5fSnq15jp0YHQnSxjKxTZqzPatGR/UkDqtCvguVDds0voxk/Hiy1kMiK3n5jLmDDp1ISihHru3caPPgarZBDnwkGLTReeVRHnuzbJkEbSnTZvPzFsMxXw0VH1vDLx0UT1x0DEhx/esjS4eRu4eyLx5afx6LDp0oXbt3Hp0oTqqCDmsS36eShVAAAANXRSTlOfMI/Pj5/v71CvcHDPz4/fcDC/359An0C/cIDfYDBgr69QcGBAz98QIL+PgIC/gDDvUL8QAGglrFIAAARdSURBVHgB5ZUDeCRLFEbXtm1bVT227Ylt27a9yNq2lbWtZ9u2362wk/XHh5OZSeM/dW812y16Tv4tQv8JYwf01WoHDJg5furThakz+2qBlStXagljBz9RgHhXrfb78kN+fgqLKjtltxcUGvwEYXBfrVe5kHJwd5AJOX6gJChB6fRYYSKMLjwqCJdIwtk2dxlPoVIneARotZOnPlKAvNcmSiA5Wey2vjh0SXgcZU8EwxTwLRiPEiB/iGLz3YJ2OjvvDFofKrFRdgVMxHSAZtCE/jXaTTJB3g2EXC8sl9YyQ0LzvkQIFcZ7KOU1NUMeFgaWldtF213RF1cD0Q1vp1pm8NsoEJZ3+ZoORJeVjW8rzNy4N1HGPog2azQnrqLfvaXO+ShDo9FkoEKPAO7ajQPbCFPnHVHz3LejWxrgRHq1t1MmCtQQApGvUm7deGRMa2FM6V6LXfQGOgcRMuyvTr9BMcJm9LlSbkgqHdla6Hg4XiGMu4g+1LybdRxCLzj9AfK9rHtEgElE7js8ly5MLSpVg/AmOvdBbm7u8Qz0i/RFtDkLlrMahLV/Fs2iC0NPX1Mr7KKl6FYu8Fq6q9PyKyjwHVj+CuZgglmnnV5AF2Yl31dbOO5wlF6GUAF6dbkzM79++WtUmAAVQJhCF9rpMMbL3hIsdTUXbPs0qjrTmRkS7BpVsK0gKiY+pV5Yk0wTOmN86tQpbN7CXnoQIZR/hRkUUszPI8ux32WnKGHSxjVVLcII/CBTKpVewBfjwpcE7wkB3Ir5ErZoy51Ni9XZHuSwGnfQhC7mzFrgffweZWNL+KEAf4lEIKKE9fcEzNkqXrGjrlnohvOZzCAArxZSInI7kBtCcJQS8hRQADrisiJy6no1Cx3wnvWAm9sDfB6bK0U2gcBmE7nLGvIxjB/khsi0/f7jmoXp+CSf/PHTMV6NzTLKwYGiyD1K8glnGGFcltjo6N+jRfg5vIEwbM5LxRV2gMPzS7SQfAyD8Q0UyPH0n9YirI4jiESrcKqoEl9PJCgsi1WQj2Uw0rdCgQ3+sxfRWpJRMsIqXClzwS+pFgMqlVqdff88g/EZh5uUllOlH7qINukKDofD4/Gu4zu8Cnxm2VlfNaR9zy5jMBjr7npERqxw1EOBZmEU6UJB+ERhAYEB3L7NIHxUfXM35Pfr9aNpwjT8k6qZV3DYOkYj61LvbuVC/pi/T49WD4Hu+Ec1kE0oxNcuXXZxSV3l4nLz8iU5K6k+P6j1c6k99vFNSGlgF36dK5crTSZlQLSVFSlOW7FBryN5ugDTjlU24oNZVoMh2mCwstYmidOMx3bodDMeerYu7IL/ktdThH32iZMIYnEExD11ui7dHvEw7oaRlVCEcUmJT9UaxzSjcYOjp76kpMuIhY983E/HYhgyIhm379a5y8fN9O4J8UcKHXAOwRO3h5VJw0cMGzasz4hu0+jZthUahUnP+FLs3iDU4fbPKLTv2W8OMH/Uc792/wfC39RAxeWZy4qkAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC91BMVEWRPwWHMwCvaBC9dxOlXRGqYxC9jm70uDLIgBaHMwCXRge7dRPHgRf1ujPEm4K5cxL1ujOHMwCHMwC/eROHMwCscESyelKHMwDYlSO1bhG7dRPwtDDAehSjWQ6HMwDEm4OTQATDmn+sZRCwZw+9dhPEnIPVkh+1bhGTRAXGn4f1ujOHMwDOixvBexSuZxDdq1rFnYSHMwDNiRrFnIPEnIO/knT1ujO9dxO/eBPoqisAAACHMwD22lT23V7////CexTHoIj343bEfhb23mH24GzztyayaxG4chL0xzb12Ez24nH10T/zvi3zvCv36In232TyrBz0wTDShBT0wzPyrx/1ujP11UP12U/0zDr100D5+Mb221f12Er110b11kTFnIPXmCLSixnHgharZA/1yTjPghP35oCvaBD35X323VzyqRr476H12lDzsiH110j24GnzuSi9cA/110mmZjXSiiXgt0igXCaTRAWOOwP1yT/zvy748Ky1bhP36pDLhhrQhxb0xjTztCS8dhPjqSb1zz3JexHgtDWVRwrVkB63hGBdIwD47pz59LT47Jj465T48Kb232f343O+dxP12U28ag31vTXlyoapZiP35HmscEPhuFP11E3etUHkxG+EPgTooBngoijZlR7ZkhfYlTDixX7sy1bwzD7fmRn354TJlFDm1829jm/XuaTcw7GVRQjgrDD36Yv48rDfpy3rvzXuwj/1wTmdVQz598KyelL59PCbURj59bvr0aS+dBvyuDWhTQWxYArapjjbnkDwtTHHkiyeeGDqvjrkvluudETy6eLKpY7DmX3iwWPfrjSfSwXvyD3Lporj0MK3fDbZrjmJQwadXyWTURVkKQGJRAZnMRCKWDLdo0/t3aPmwEDChUaTTwnjzZa7i2jTqkjRoS7munv04MSGWkDqyJjQlEvWrITOomnu2JDz67Pjsmzgql2jXRfz3oPorSbv0F7MnTm2gFa/izqlXQ/bsoWGNhzwvS/vsiXvryODRxVpnvrkAAAAO3RSTlOvcO+PQM/fYL+A34DfcHBw7++/QK+/gNfvYO+vrxBA5zCIn1AgEICfj8+fYL/vICBgn1CfQDBAv58QAG7tjoUAAASgSURBVHgB7ZUDmGU5EIXHtm3byr3Ptm23bdsemz22bXvWtm2j8lqvZ70flufD1fmrKrlJqsWiP6i/NTCiY8cRDffzsEbM7In6DPslYOhMBOozdNHC9oN7qLHWJyKsyf7PY2c/DPRCqGd/hPoPBuuSw0lJSXsTUeLp9D0I+XN0s05vDkxGaCY8IJS6JGkVYSQI7RGUmC90XdyDOmHrcOvI5kBL1GvRovY9vAitJplSqZT5CUKXos0a/V7OenXXRXOs1uFjm5cE452kVh8qQMsEdDq9SrAMfWDUmswWvU6pVk+abbVaZzQHsH/JKvJl9GCbZJ9km+fWZ1tITGiEQJyh0W7QJjYB9f7DWjKCvi2tJCQkpCxN4quKACLaosl1KVfSaPdptLnNgPYXz/CDKumSsorSkydLU0LKJT5BJUnww6GozLdv3qDQbo4MAEaMHmC7vTpu5a01m5eeMhgM7y7dvObW1ZVxcavz8/PvHtq5czdl1852AcDZQL1oMDy4c+fsnQYx4oqKrlN2FBXNbQIWL/4C6/EnH33s9OJnDYbt57a/Bbq2du3a58/Zth97iUKhFB3r1wR0yDtFARUXF3+bFwslbY56Ez+/Di+8UVdWrLgHD/dW9G0EFm5wxx6Hd08VPxHlXmoAxfojXC4ufiGv8LmYmPvwsDsmphGYZStUbHqNQtnxdJTiAvYffcftfoNCOX75iDuj9nx8PI62Iz5+aAMwrvDgeoXiwqvPKBSbUo6CTu5fY1dseu/9WIX9rvnSiRhc3/UTJ9o0AFMKay1XNigUisKrJSn7S0tLUypKPjwPz/YDq0zmVwoKdkG2TwsKFjUCdr3FFEpsYfkk5SUhFRUVISXlEs/yj7eQBPzr2iMJCTHXEhISJjQB6UJLuNbIZNE9krTysrKy8jTwCyKYQfhXa/I/T8ByNv24Dum5GjOfCJKy6D5Ye/tg9YGfJSXrFyzPxqDmOdIDAIdOb4muIUgpS7Dc5/F4fMvpfn8oJID1mpkcGSZzdAkAGAeFGrNJaySlESxBVVWVQMCqBD9RgxPAchWxVcGMDk1AZ0YOpMBEEFNaGQGqlDKDjAQuCCeQi7Nk6xitm4BZVJsrV4MJwhhEkkwmSYI9tAb76xKEyTZSBwas1qkMuU6ICb6WIIwgsGv50WYLLggnUAU7qEMDgAXUHJ6fCDfxa7ShoVptDd8U7o+v48nFbJVsK3VI4BYdU+34Cgi9BZBok4lvMkWbIbzfrxRFZsmCGdW9AwBIUW2T83S5eo0FGCwLtgtzXTxlciQUtLF6fvNzacyg7Bx5pgsQ/SMNupurg/pF4Jety84e89BROZqb/VGykufSLfuyUbd5yjp/cDa3+09O79ZAiOTKzADggDxZzMbxqdzxP3Pcj0/l5ohFyXKlMhOkVMrlInFkVpgqeB03dfzPNpTOHI7960gxQFgiMbZDOXYOZ/wvdKDRrTipG75hsyNBbHaW376Ry2k18Bdb1tBRXi/HsVUVFhamUqlksq1ujtc7atqv9bhpo1o5nU5udUZGRjbXCQL7bzXF0aPaOuvUdtTAob+ziw5t06bN0D/fdv8HfgQAaAMXcA6VYgAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC8VBMVEW2cBKrZA/eniWxahGnYA+9dhOnYA/nqSrusS7IhBevaBCnYA+8dRLusi7PixusZA/FgBa4cRL1ujP1ujPYliHhoSesZQ/qrSzwtDDQjRy9dhP1ujPjpCjTkR6+eBPmqCqnYA+waRD1ujPvsy+9dhKnYA/CexTqrCzEfhXWlCD1ujPvsy+oYQ+2cBKnYA/IgxfOihvOihuxahHNiRrgnyUAAACqYw/11kW/agn11EH11kS2cBPnqirbnyT11UP221f232X23mP0uir0xzf0xDL24nHztib12VD0yzr12U6waRH0yTj35n7zsyPOhxb1zz322lT10kD0zTv0vSz36Ij20D723Fr12Eq8dRL110mnYA/110byqhvYmiLx0k724Gj0xTT22lLfmBjIhBi/eBP23Vz1xjT24GuDURf48quHMwC6cxL36o30wjGvaxf47JjWlSD12EyEUx7pvDXPixn59LjYkRe5eRvhskTuui/yvTP35HjFgBW2dyHZoizMhxvQkR/roxq1bhH24W7354P0wC/yrBzJgBX/30WEVSTuyT/CcQ3487H365L23mD47Zv00kL59sD5+Mb5+MNdIwD343TkpijIlizRjR3BehT47p/ysCCEVyvesECtZhDDfBTu4ZezbRHjsC6PPgS9gB7wwTf10kHrrS3476LepingoCbntjDQlyrSlC7TsVfYlR1nLwn52EO/gyDGeBHFjCTi0JTrxD/x0UaNYzTMgxTbyIGpfCOri1ndwmqXcECrjmLuqx/ztzHmzHH60DrssC7Ztma5fjHQpTfJoUb1ujPsz2DsyUWpfijSniznrCf35XuDTxHloyGqgC7t1WxwOQrauVfvsi+8eBbcqjKccjTIsnzaxHTw1W7imhneuUzutiry33/Hkza5fCnz44/6zTfjyWD5xTDjvknrsimrilWyhCLIsHLrqiLbyYfTjhq1m2/c0KF6SBr47JbgmhvRql/VqkX12Enp0nzdmh+NXBjw1GeGm2mQAAAANnRSTlO/n++vYGBQMI/vcN9w74DPr9+vUL/PQL+fMO+/7++P3+8ggECfv79wv3DPIGCAML+f3xBAEADx/W7PAAAEyElEQVR4AdXWA5RcVxwG8Ni2bfM+jG3bXNu2bca2s7Ftq7aZuj3qfYuZjZOD4jvYmdn/7/qhw9I3zP8EdJ80aPRlmFmjJw1+NZjdo+9pIpcTTzdnxOSXgtkjHjx4kMhSYhim0MhEGxLh1+GTXwym9910boMCxxEYHMc2apSsxHObNvVY8nywZDiZvKEcMZkKC3U6g6G8EKcqZCLfBDJ5fPfngSVDa8lKxGTQHUCLrDyeoAiNMuGYhu+bQ64d0/0ZAOu3kssRg05gzUOL5FotrQjdd9CEUAlxY2un7s+AIZQt5SZDhONqHorG0+mM0hUomnfAgGAaEVtVS+m05CnQz0LUC6ypKIru4HA4WX62ePgxtRDBZKwQ5m3LkCfByHBL1JbU1DQUJv6mGCapJiu+CH6TUiiUBBX3j/CZT4Ah6WulaHN2vJutDoZRi5M4V7ajzTkcwvw2feySdmBxfThmQdF9aSv+EqtLwsoaG8tKgrNvcujWR/X7UDTcDruo79cOLIjehpsi5D50zk11SWNAQHFxwOaw4OykLIaWpyNmkcM9Fb2wHeiZJkOu/unv7x8ZWVCwfPmJqoqY4u8KCiIj4U+3bt36WhTCXPZ92kgPWOyyYMjFam9+rKysOOb9ek/EZkp+dvXzgH6utZhJd+3OPfjPQ8dOnvyhEqbpqxNE8Z1rR4/W8dkqSYZrvgcMSI6imnRyH39Y8E1MVWVzKgKOEEDLMyAblRDkJvf0gBnJfCox50vV1Y83e0HZW7ADAmBKOwTSZC9YJcOIHmx3j5dsLq5oAU0BZeoznzFoAgOugEOCYJUHTFulxBCdQ0vniIPLApq7iLkAUn5XJ/mVtgLms8AgoDGykrLhNsRUVFU1AQBC79fYfOQRJqqGWFbz4XaggaVo3jgbR6z+6cih5W8XrwYXfgHgV4bWen39+r1rc7jLzA2jPGCKe5sMjolHK/WrEasLqqt3ry5LAavPA1BnjQNEKNzcDPc0D+jjpiibu9AyoNgNF/Od4EvgfNiZUBAK4go1FrBGkvuee5wHTNS7RDJiFnIfhh8HLubjbPFdkBKmvpIC4g7iGvtDcNscre/aCmAG6hP4Crh3Arm2lO53f2dNDScrBcBVsn1h/Q2CdCA1u/WLvKBPUDpLuREnBM2nlEG3wWv0ItgJgY+DABYgdQZNWeoFi0aREuCgcHhR8+Q0LRHaXnDGA1wg1h00zANg5pLS2CKZgopAIuA5HA4ebz34pA1sAUIpiSj1gkUDMylskVKB4ZAYdBHwTrYfHG8FUUIgzcyc6AVEhq0h3Qhh8WUKjErcKU3Inkfg4w+bQSoADaQ1vZ6+L/USkr7MsUOiUWDl2PZ1667HgdCP3l9RRwJAqhd2fvZW2VH48IYqxM4S8ZVKzbrAwMA96aA5eqde2H/RMwCKlcLbTFVOCNvuezYQJt/3g13R0tiMjKCVsP5ZAAUQ7uJymSqVyvd6YOD+fJVkWa7Z7BQCWP88AOcBp3dKIpFwuWfz8/M/Jcoz8gDo+OIn0LDexpWxuUSYn3PNME6hccKclz3jFnU0GjOd5tY4g4zGqRNf8RQd1t9oDIptK+/d7TUeu116G43CPGkmLO/ymg/2LlONRm/5qwHMxGHD5v1L7xp/A3i45c/hIj5QAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC91BMVEXQjRyqYxD1ujOqYw/1ujP1ujOtZhDbmiOqYhDoqiu1bhGqYxDBexSvZxDDfRX1ujPDfBX1ujPQjRypYg/1ujOqYg+rZBCyaxGrYxC5cxLmqCqqYg+vaBDioyfvsy/XlSDCfBTfnyXUkh+xaxHzuDLqrS2uZxDytjGxahHeniW/eRP1ujPprCsAAACqYxBdIwDCfBSxaxK/eRT36Yr354P365HhoiXHgBX36If35X312Ey0bxL0wTC+aQnyrB70zjz35oD24nL47Jb23Fj232T11UP221b0wzLztCT12U/0yznyqxvzuin1xzf12lH23Fr110f1ujOHMwD24W335HjzvCv48q723mD11EG9fhvtuzGWSArXrDe0giP/uGzMhhj22Er598L23V3ToCy5cxPOixvLhBX48Kf47p310T/UjRjysSHVlyLspyTOiBauZxDxtC3rrSzWkx710D7476L48ar1zTr343bcmiDEghnQjx334Gj36o70xjT11kW9mD3hmhnzvy748rH59r75+Mb47Zj0vS30yUD200766UP23FzdpyvhrS3itje8gzDszUrztyfatEvgypX23YqSZSjcwoTosCnOqlDgwVz1z0X2iW2rZBDZtFbty0PZsTX//Uj4zlfCjz/9vnjVrUDIhBjqzVr5jXGPPAPCcQ21m2/1wTmpZhf7pW39k3bDkkm5YDD6rmj53Tz7ymTjvkfOakbxg2b59LXKZUH343PzhWn6v1/rvTbIjyL0uDL2qVX/sW/yrx/5t173wFD1vjVnLwi1fDfcwHjmnhmOPgnby46qgTL8q3ji0qHr1Xbuphr5r1fnqCr3ykqzijF6SBnNo12vbBvgxXuXcD/+o3Psxz7x2Wf+m3bMn0P7kHTv2Dj+l3fsxTv+oHX+qHLkxWTuy0ipfCJ6RRB6RxTv46XixWyoTCDxi1mpYhLatlrzl1DxlVyVRQavbBj440f++0i9gyjnwTzHkS3QnjDvpxv1sT760GD+xG7/rHExZ0b5AAAALnRSTlPvj99An2CfQN9Qz2DfcK+/z8/fr++/7+/Pn++AEDDPj3CAv7/vgFAgIO9gQBAAax9iJwAABLZJREFUeAHVlgO4W0kYhmvbtjGxbdvXtm2btW3j1rbbtW3b3v0nuduTun3cL5znfO+PQU46zH1CPS3A9K5d+g+xWCxD+nfpOv3RQNeBFqwdOy54Pwd2fTjQtZPFcqG2TqPRcMPMikwDUJ26PhiY3h9C15kiQCalURNmLnHnANJ/+gOAnkPAHiEvtIEK5REyIxcInGXI7PsCXS2W5heul+ZyxHQxxy4pdJmU3DUfB6/RQpKuBODvDyKBXlwolUqL2OJcm9y0iAQKNvAxcTcwdsqp5RtJpIsk0qtOZ3ZWdRHdbiuFMQBaVc2pKWPvAuaMS6tVupbdKlpEuhgeXnk4Nq5InPsp6ZPW1UFukYGfljbuLmBqeoDGVGinxV0jkW5WVYUfjq2mcUikUmhcEa9VOdLTp94BTB+VvtzosokZsZXbt1eBKp1xDPrS65uVGpgpUXH5vOdGzfEHJjJPcJVyCV2aHY7tkKIiiwFduGSasBJckz6ZOdEfmMlUAHCUXp19bcH/gJRtXzVfZgwrUWRCTYnMmX5Az7wms0YmX3rpqtVqvXoTlwTALTzaujPSC6iZed0JYHzSCbNmY6DVJ2/T2XGMz9vHgZEYSE6aSACTMkSrd+JLly5fXrwAT6szS0oTL5s/f2MwDvNVQI1amDGJADoUNAeC/S07nREX66yowCvHYHNgeyg1YWvg0ndMtbBgEAFE52+1Wvfu23XjxoaF1VmguGoGDW+OBmXd8X279kIrecKMaAIIBf+RFVve3v3ma39twHuJAZsJ7z9Z25kP3n9390HIIUwIJYBNgdYjx9qBkD9pNBqbjvervOGPEC+w5aD1C13CJgJgFYgO3QZCOGIOx57rPRJt7cCKY4eSQ1kE0Iel/ZbIIDkqkbQfoXW3gS91rAEE0I8cUHvaB5xpK8SSy10N+JSuC/EB3wivkPsRwAQyU5u5/Py5c8fXyUwRLlCESeY71Yrnzz97+ve0RF0ZeQIBjCXnN+XEK0rMXE3rgValTCZTgp2L/e5MbTFfrz6riyHPIIAxwxA6KcJEM0KUIKPxo22NP4aZfX4D3zEvUXeFOsBv8w1Fe1pQgCjeXeJBL71MWc1tFGxb+0MJ9ucYVOV6tVAXQ51FAL3RnqrFKMmQk/keWu98BXnM0QJBfb3CHS/SYj8UVEbt43fiRqDPKitQvsqgbUKrpNIW9HqoQPBOfXymzw8F/UaNmkYAM9B62D7fR9Xwi5PQh2LxKhQZgwGwF/NrwC/UsaJGEj8CUNHXbDa7ZWW0o7wAbbbZ3kCeDIFg7X5DsarcoVeDPyWq1xg/YDRaJpFIfkK8TfPyUQQIeZYIUtbm8MshPNT/DIs3HPwEMA0dgKX6BfXiUXnICEIeft6S/TUOsEP4K1Rerxlz7wSCwPUrGjOZshKZQYjq0OvBrU6E8CkUymQcnwBgFX4GVySaO7fvMOQG8VKTwZx4FqKzKKnD+955f4AWPPGgk8jLGkCNKKoMlMDipaYO6wbh7wQQJUClUgXwhsH3joipB+UjtNKrEX3BfhcwA0XlZRTk81BHGHRGiJySUBaDegwdPHp0Z383kWEwwhoGftC0Hr7RjIfddjuDiFjE8Cn+6/Aw/QdRGLC50QSHQQAAAABJRU5ErkJggg==",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC+lBMVEX1ujP1ujPztzGzbBGtZhDYlyL1ujOoYA+oYQ+nYA/jpCj1ujPeniX1ujOoYQ+nYA+nYA+9dhKwaRH0uTL0uTK5cxLMiBrJhBi8dRPGgRf1ujOnYA/1ujPwtC+vaBDPjByrZBDnqSrkpSinYA/enSTMiBrMiBrNiRq3cBKnYA+qYg+/eRPoqiu/eRTwtDCtZhDSkB6vaBDfnyanYA/1ujOzbBG1bhL1ujPDfRQAAAD11kT12lKmWw/11kb23V+rZBCybBG+eBPFgBX40Df24W748Kf354OuZxC4chL35Hj465T221j232f12U7343T5zzX110j30z740Dj8yir30zz12VCnYA/110b6zTH7yyz23mL6zjP21UH110n221X40Tn12Er35oD35X311kXbnCPzuDP24nH24Gn8wHfpsjL47p78ySj+vWy1bxL00kPkph3TkR723Fn12E323Fv4jHDMiBrJhRhwOgv9xyTNmCj0wjn59Lb24Wz476T47Zr48q/kpSjtsS712Ez232TCfBT21D//xR+pYg/foCXYlhfPjBr1xTz36IjWliH7zC/36Yz9yCbIgxX5vRz12U/59bz0z0v07rpnMAarZRn/xB35+MbzhWn1ujP23V3Njx3bvlH+xiL4qmWCTRLboyTp0mv21FP8kXWriEqwj1Hv3oz/t23o2JX656WybRLp2qLTsVnVsGb36o+8dRPstifz2nPpqyz1vTXdpyW3eSvyxTT454TgrSvoqyv59LjytRvfnxnovTrXmBz36Y70xkv/6UH2kGn8lnT1v1T5u2P/q3Hyplf31F3SoDH/sXCvhzbhuDmTWxSUaCr+nnXvtB/+lHeJWyPJpDjJqUv+4Dv210TQlCDPkRzkylzx0UJ5RRDitjO7gjvFllLFllT+pHPfx43ky4Lt2H/+mXawbB3z557EkD3FkkPUqEru4KD62Y7ZuG/ryEHmwD+wbiP9zHf598KgdSzoz3nkyVrqvjz3wifvvC34xyzorB331GOo1p6+AAAAOnRSTlPfr4+PIN9gQO+Pr89Qv5/fz7+vMJ9QcK+Pz+9wgO/vn98w7zBg3yBAv79gj8/vEBDPYL+AIDCfQIAAFDb3YgAABEJJREFUeAHdlQOYY0kYRce2bdvIy4tt22zbtm2Pbdsza9u2bf2VtLn9efd22DmnbtXjgJ39zH9D2DJs0NixDQ0Dxg6cs71vYd2w0Q3tMmvK5N6FObMQdjH/iWei98bGXURfxk7uWZiMRo+r5JN+rEZ5KSwoHzmDehKGwY/5B3TpAuCjn9pb/RYmtOBIGb2uW2GK0+msJAkSXMC/uJ/xcnU0HxMa1UFxTufcyd0Ig1JTnQd2veE6/yzwLCtXdOpnEh8LM6oJ+ampcxd2EZZcuODL3wVsNDyP8M4UWLmM9EaT0qK2E+KuX1+zrpOwcFGKL0YCAXKIyUz04xWzuAm6cKjACYYrKSmjOgmbclIqw3WM/YcOHz4WX1FxI5mZVGwVuUneCoVvTs6YDsISh+MXE0lw+ZOP/JIr6iA/xDN5BVARiqVJ7AQpPccxtIMwtNCh5JMSiMTLnyIeGcl+d60uAcwJhEzzb4WFS9oJy0NCbitDdYwvwKiq8+ZGIo8lEjSahEYcBL0jZEM7YX5eoQUDwfYZGCe9QgUTBDcJBDXBYNafy8tb1iYsjbzmFYo/JxKJp6u6EX6PjJzWKiyLirptUfJ1CdyCpK9riMSa9z6oqotP5FnbTUl7J2p6q7C8tDQIBJJbxOIlfvkO0ZPvjhTbXOnNi5ZptMGlM1uFHTQabhSaGgUuW3ESM/7kuzXI+OkqbFa+Zz9I6Rp5MI3WJmS8ZpekYaEwJ9aZJGby8ePHPjx1usDmghmVW9QEgkJc5P98RkYHQW0pNzWmM7isu7zvA476fMUrsIncnv2GozV3FjJeffObNIxPEjC41qsBR5989H0fmwgOJShAM4IllLQXVmc03T9B/FaIhcLpIDqP+Oc+9nEDr/QUwIzkMbeoa1uFidTC+0Ti0xYhdOjcCR7+hYf+RLzRU6DXluzOpU5sE87uQ4IEDFM4SReA+IMRe5p5gxkVZNHOzmgVVnCQEItLLGFKzBT6OOAHIyIelHt5BV0DBWUcztR2ggMJBFxttISVK7FHEB9Rb5F4eBlsopisXA5nfZsQ+PorseS3CQS7GpS0tLA9gNfXq/FmXo4KAre1Ha2DKZxzGrFZagAFV6slRuPDD+rrH7MTWvmsXApla5swZB4lsOnSFbMikwCK3Y7jdvu9e4BLzXQvf5PNntT+jNvIhpy4RgcFWrwxGKQKmVjj4cuo7HlD2gTUMW4BmUy+pAdFKs1EkSrMMrG+SOsPfC2NTF7V5UI2fER29j6NXiyWmSEyuhhG18pLYmD80uzscd1cKhePUKmatEUajUavh5ciwP0Br73JUanGdXsxXj9BpaL9KpdrIQD7w+jA57IR31loM8h3YkpQYjx07S2KSqXa3PMNZST8TMn7YzfAWbVlwaVs+D5hcW+3rOErAQGJSqWqPBm/qq+b4vBxIxDopccN/1e33eGzN6MMH9Lv+/T/VPgHoUf+O2AtWtQAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC+lBMVEWzbBH1ujP1ujOpYg+nYA+3cRLsry2oYQ/1ujO8dROpYg+sZRCpYg/PjBzamSPTkB7sry31ujPoqivMiRqzbBH1ujPGghepYg+nYA+sZQ/1ujPwtDCnYA/foCbHghfTkB6nYA+nYA/XlSD1ujOnYA/1ujPztzHwsy/eniW/eRS/eRO+eBPoqiv1ujPPixzJhRjDfRSuZxDJhRgAAAD221f11kTjpijJhBewahGsZRD354P11EL35Hj24Gvyqxz23mLztSX23Fq5chL232X23V7ysCDzuSn24W7zuyr10D710T/36IbzsyP22lXyrh71zz3343T12U/zvSz0xTT0yzr10kDzvy70wzL1zTv0wTD110f12EtnMAb0xzX110b0yjn11UP35X6mWw+nYA9wOw7476G1bxHMiBj12En12U724nDztibipCP23mT1yTf21Fb23mD48aq8dROzbBHeqivpqyv12lKpYg/454vhmxnUjRfcmiPUkR712Ez23Vz+lnbyhWf/tm724Gn47Zu6dRTusi7zuDHXliHtpxvFfxXzuCj100H12lH232fnsy348q/365LyqhvBexT35Xv23FmPZTT1ujO+eBP9xXDAhiOrZRnRq2T1xz/36o/gnyb47Jf1wTbxz0n2iGz6kHL/rXHYkxrQjRz6s2v0rVf0xEv1y0j36o6TWxSCUBjTvG362z/59LTwvz3lryrblBj9knbMpUr465XUoif59rz476T34pD+pnO/fxvQkx/5+MbzsSLn05OuZxC2dy361HT598Lqtjf+oHTp15j+mnbQqmvv4qXqoxrovzr22WPirzLNjh3qrSn1tVr1nGP2y1b1zk732GjAnkV5RQ/bu0fbvlTavYHcxGr62DuugyW7gjzkx1OwlGb4jHCmgUGdeETUw4vw7Lr2z0vevGTcwmLCpmPjwj70vDe/exbpxjXUqlHjxm3PoEf8xHi6eh3z34rZunbu3ZS6fSnPoEbz6KOwbiK3kTXSrjns0mjjvTHBukL9AAAANHRSTlPfn9/vz99QgHBwYECf368ggO+vQICvr7/fMI+/UO+AgI8gnyBwv88QIL/Pn58w74C/EGAAxDqkRgAABHhJREFUeAHV1QOwI1kYBeBnjG3b7Ni2bevZtm1zbNtc27bNWfN2p+px7T0pBOfL/dsBW39n/h9gfUTg8hVtbSuWB0as/3WwdE5Q25AETVr5i2BpIFLb1nnoUGdPzzbkw5yVPw8iJsNtrfV5I8iTT0GiN3rAF5PDfgasnI7Uq1HvgPZho9H5dC2DAsEk8CfByhVlZW0KrQql/8ZofDH2CafR+RZRymHEv1tWNnflKAD6paVlCi0fZTbUfH26Nor4LBBHBDYpiXm8tHTuaDAlNbVUY+FZzQYZlFAktQka3gYb0vqK8zAp4Xhq6rqRYBIa/ZDaBDZA7xMxa6NsGWdcia85jSBOYhHzdjQ6bDhY1deH5voXqKHFcoiCBlf9uSuvv9Ta+uoRvJQhQvfNXzkMTMjOpqqRLc4FC0htB4sTz11B0t31ZjOJuT07e8lQMLG8PIatM0kIKK8MopCIeLDAbUj/Gbv9ND6KInqgvHziELAkJ+cqV+efqCWW0yw4c/4YAkD/qwsCKQPanpOzcAjYsCdTKPdvQhptCLjbbu+61g9Aiy9lz/hBMNXjqaDKNUq+VZ+LAP82X3sB9O9MhAFNdp/HM3EAbMR4xNFyhZKP8gMivrf4s1ugbr9xT72rAQ+vQMBgtgyAGZgscbQaAGQbKCTpR3YkXd3H6s/3Z9g4FMinv4xZMAA2VZ70r4AcZ3DcPofrN7q/rE90FffiiSSmKNd8uXLTMEBFNhrl9YnyYknffvHBh59eKHa5ivsPCpqjGLQ0AyplKGjyA0k1vBFQQi1Havu4sLAjo6E3A98sLUqAZHpUStMgWN20myzk6kzgSIOZRDRK0c1dF3cVFt4U4G3EKBKFlpZrtl5uWj0EZJGvVoGtBjPpc2ugvPsv3nUHEB3N4IIois0Tddq/O3q2ac0AWNuOaWRF+2cye8FQe0/lw6IjikNiUGgi2Sf2s0dT2tsHQGRSUqMYnknJI6D0Bl/8yzsR8TgjlsJsEckMMKhLShoAs+n0THgmjUWrsgLx8A4gTuXvZTLzWqA0mUEPwHMn6HQ/gBNK9zSKqVydwiKBxb4dQOzMj4cgUZos16BH2UeCaW73vWRWlRwMBYt9BbB4VCaT+UDdjLJesr8fF+N2D4LNyckYsBVstQYWhP0FBQWPPGbwGrxeUEcReNo4Dfu95IABAJbAYjMbWVRYWCT86gP7D6DMcFCgrpIoTXXlJVjsmCFgc/D15Aoyi8qFhVbCVxGs/hBUPK1Fd+k6yLhhd42xOBwdFmy5TgETCZ+vUqn4PInWEleHxeFwM8eMuC+Fp6e7gRBWydUwsSi14KW0WEyKE9fT08N/4lY5zuFwZ5LFwmg2IBqFCYlCo0PjHA7w76MBLHBZjWIWIFy5Wq0DUavlDzoG+sMByBjwGzaLDAg1uorN5XLZ7JgShyN49s8+H2aHAIKrPFkhZl0VCoWs3aDuCFn8S4+sMbMccLB0ekkJ1gESHP5rD8V544IdAwlZtvm3PHZnjwlfNHPmovAxi/+RB/v/APwINMnXfxJkSY0AAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC+lBMVEWqYxCqYxD1ujOqYxCqYxDVqkDsry6rYxDBexSqYw+qYxD1ujP1ujP1yUD1ujOrZBDjpSjfoCaqYxCqYg+qYxD1ujPQjR31xzjvxzn1ujO+eBOpYg/Ukh/bmiOsZRD1ujOwaRLEfxXoqyu8dhPxtjGqYxDCfBSxahHYliH0uDIAAACqYxDztST48KT47Jj35HjEfhT354P598HCexT20j+waRH23V/0wTD36Ym8dhv24nL23Vz232X12Er23mL100Hzvy312lDyqxv10D7zuCj22lT11kTzuyr110f0zjz11EL12E31ujPyrR3365L221evahP24Wv1yznHghbzvSxnMAb0yTi9fyfasU312U7////36Ib23Fm4eRrAgCLXqzLsyEH0xTTytzGdcCP24W/35XvysCD487L0wzH24nD0zDvzsiLPiBbPihn0xzXWkhv465X59LX110j47Zz35X711kX343X24Gj48azzsyPUkx/yrh+0cBT0yDfeu425dRbapi31wzvszkvrqB/20kzdlhi+fhu0bBH47p/pqyn1vjWuhCjnuDPx01Lr02759bn254zusS3y0UK9dhP48rD35n/HmUvhvl+/hzjQnSvFiyOviTvUwH7hmhm4eh7p2rPLhxnNmFSydRvv4tKvhi/1wTjatDnesTRwOw2vbR+LWhjXjxfqvDDx0UnOkBuqZBCtZhDHrm7VxpbgpiWCVCTmnhnhnh3hzIOMYTPKrFO5oXK1mGSmfTHpohrBpFv5+MXkpSnovDXgoCblpyT36o/cmyPYliH47qHFlFvLkC3HiivryEvnwEPy2WTy3HXnvz/AfB64k0CUaCvTumjUw4qee03NkiDoxEnvwjHat2DzyTSLXyzQnzKLXijruTDz0EV5SR6TZB15RA23jSnAmC+caBjetT/kyVjQoDjBoE3irSzLuYbu2nnw67f1xzrrti3SjBjCrX6eekvkrS747p71ykPVmCLSsEL59rzXmyTm146wkFfhvmTVqXEAkUcGAAAAK3RSTlOP789wr3BQn59AYFC/YK/fYN8wgL/f3zDvQEAgvzBwj5+/36+fz2AQgBAAhWTQJgAABIBJREFUeAHVlQOYZDkURnts22zeV7Ztt23btnvaGtu27Vnbtm3v5lU1XtX68/wfSuckuTdJPTef/5n7RPCetGzyHKPROGfysine/y4smGpEWbNnz541+JupC/5ZmDcZwd/Wq2Qygyi3QPEZkiYv+AdhmdFYUy9gi8VsQbhKJtKqJb5IWfZ3gvdI45p6gdCWwuen2ITscJUht0CvqzAaR3oTBSJfoxLbCvPDuGG0/EKbUIAbEl0m0XBz4qsPxj3Zwc3Oa84j3w5LSEFG7TtxbwXsJBgEYXVsTWsAyukTOZ05xfeywxLi34/bj3/zLic2dvWfhLHdsYb2TU/hxBsnr9H77plpH+If3nw7KjXGv7t7rKuwsuV1lZhPI29+FlFfXvuhOO9qQMD+3bUiVHcmR9my0ttZmH69zWARdjy9+ZmTF9HA2+hJPyHx8u7dra17FYHJmpbr052FGTd7QsKLNgUM5BI96efB9weZvjH+JTdnOAlL7nytlQlsF159+bwdukjvO2d/E4dmkKAisFt3lhAFr7s3cmWCIgo37xKOnf+0s/ibq/aaQ+xbIcXq7noRhcWlPVq0pMKw7BMBp7/6mN7ZRyJ3fXLh8sHvBwRlWeliojC3VK8NsYj5+V1kUnFSTlIxKc8clsC3b7ZakooLWXOJQsaP+gKDim2j0G6Tm0kkUjPZzEWnQ4zOk1bNTI2RYmVZGURh+3fMApEsXBhPoXHN2eTsrl+COyjxRWyLTFSgVviiok1Z24mCX6lCrQ1RsYtSKPk0LnddJI/He+hRsePA4vuAmb7wcxZ0ejSFhV0UX0h5bB0vqHLbDt6DAsedwHc6Te4srKAGoikMyBAG7wSA9btCQ3fwHpbhE6AVSZWJcuoKojCe+ppOty/qiKw9EmDjhgg4sCu0kvcI4tVMXQW+oivU8UTBg3GqrRzAGh0BW2sNWn01PBD6K+9xxEsUgWiCNHkDw4MoeDL8ymHtWrDC1nbE62LKD1TyIhGvV6RmcjRYmdyP4UkQ0JoQTzIHwU4Hr6kC3hPRdr4i2R9NcIaBVkQUFjbBOXN/MLzn4OugPKpHrZfgvFRZYpL79S50uUDL4cV+vtji4NOoEKVGy9f5ZiZLNVjdlvTeVa43biasH+avQLmEqdClBiJeiWUAwLGlroInBA3x8l6o1qX6Ipzjr8T8gHX0KAsmugju8MEQnw6NFRWZMckcqUZZchaqXmIyD1tHOHdpHEQO8YeA9XkyhyP11yixRBMV2nJVKtEGGEUURg3239/O39JoNEolVpJokp9psuaKuVxhNIwmCBPB+vwgnw6sLAzDStISy0zyBioLGkP66XRaCMweFmaOADv/0amzh5oAWIyMhi0o6QzW8ePTIMJAyclJOEIQPEfAXsTfqAI848ZNOzaYaeMm+MyGaAufH74PZg0Jo+EVnLfC6FmzRi1CXyyaMAvPhEWO5W5Ui0TqCJg5JIxx8I5O/znT4LkXDjfCaMI+TPl7Hq9wGqDM9iRu3Lz5f8+jGkeNHjfR5e9+3nK3//2cvm+FPwAmGmv25kOL8wAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC/VBMVEWTQga0bRGqYxCqYxCqYxDsry2qYxD0uTLtsC6tZRHZmCL1ujOqYxDAehPusi+qYxDkpinAehPSjx7lpin1ujPZmCLgoSeqYxCHMwD1ujP1ujPcmyeuZxD1ujPDfRT1ujOqYxCxaxG9dxO8dROHMwDlpyzcnCTHghf1ujPWlCDCfRTxtjCvaBCqYw/prCz1ujOHMwDKhhjOixupYg+HMwCpYg8AAACqYxD23mL24Gj221aHMwD23V/12E323Fr110j110bDfRT24nLyrBz35oH12VD12En5+Mb24W723Fj0yDb0zDr1zjz11kX110f11EL47Zz11kT24Gv12Ev10kD12lP1ujP35Hj36Yz12U723Fv343XTkh+8dhPztSX36pDzuyv354SycyL35Xr0wC/10D7232T48q736In0wjHzvi70xDPzuTLyryD1yjj59LbzuCfQnCr47p/48au4eRz48KfBhiD11UO7gCf35n7cnSSOPQavaBH24Gf465PitDK9gB3zsiLPjRz12U/zuin1wTjemBr47JjMiRrsvDTvsy6VRwn1ykL598PjwlLlrCn23V3ZlyCycRf1vTXnyFv0xjWOPwvioybnwTzcs0HPkiC+hCyvaxbwz0P59br11E3UpTPnz3T598DOhxb11kbrrSrHgRbQsVH35Hno3ajXqjm4cBLnoBnRtFzOliTSqVWzbRLs3pf354O/eRPXkhjtwzfCljvzvSzkpCL24nDvpxrMn0zpti7trCHovTbsyT7iuTiXbjjlpymDThHNplzKhRfAjDm9eBjhmhmmWQ7iri3476Tbu2ZdIwCfVRH36YvhpybUnSfHl0TSv4eri1vzuTGEVzD22lGqgDGDUhjRt2e9n1e0l2Dvxzv476OpfilwOQmpeyHYqCvOoi2pfCKWZhrv1F+VSxXiyHicUg3j0JarZBDOrnykZDHAlmOqh0jw2G6yfUqNYS3BiCS9fBry7Lrdx5XhvEnv1WTfu1f100vt13qWaSSEVSSgeTxhFVKOAAAAN3RSTlOPIN9AcBCvnzDP37/vYN+fIM+vgO+f72CAcGDPUM+P37/v37+fcGC/gIDPUDAQ7yAwQL+AEEAA/lcolQAABJRJREFUeAHFlgOYHFkQgGPbTs7anC+vPbbtmbVt2xstY9u27Zxt2+Z31cueiT/lH1Z/9b/3qprdZtwhd0XoN77vwFFWq3XywIcfu7XQe/xUK9BYUVFhBUb17Xdz4WEYumLmstclDlqq1alZaeATNxKeHTeuv9s60+KkKGouQ1gcUr7BnNiYe67buCevK4wjgbzQz4zyA3I5js0lJCatIbOOBO6/rvBA/oU6Vtm2M2Rnjk2IY4zl+Jewoe7qhYm9ryNMsDYuczadhYzT+ipfdI7LiP2eR5INRao46Fjva4R+8fF/MQWukC8+J1t2RF2qsotdf9SRecs1OrUy5tX4voFC7yG1MwlMKC7M+KqF/HZlUobengOzLaC1BrMqbl9t7WMBwsg1NWVOPMyemiT7hiQ3zEq6VBidR4YqJFJ2ivDkNY/39hOGnZzDs1BycWHaSpmshfxOtjRNf5kkm5wWEz8rIjGmfM3JkX7CyHk1JlhRSFXULJnsRxBWRqWeJq/iFNG+Ju+8MX7CgFwdTUS6QIAZfv1NJlsaleq7/IORIhw8EJpjvftzH+QI/eov8h2KN6508NqspDT9953hqZrY5CP1oznCI+6jfAfx5pVONkBjf+oKPwpPTqgfwBFGuN/l08TsdVveOsGO/8rLURl634ot69b9A+EHH36sZAV37y7h6VKdxmShcJf4bch4Jy3jPX1htNglx/ZC+AlbQ3JCZelTHKHabJBKmEh5WMh//57YkaqvgvwwIU4p3j/16bF2oZojPHQmIktLExQuDBNH230+n53NN2JOwiHVwH6AtiZUnuEKa9WwJokCww/YcsRwtIrDbEJjJEVIYDfo1IkxwV5R5Vo/QWU2aGkLgxXIhS6bzeYSyvFISgEn0eoss0oZXl4i2s0VpggOwxRSh4WhInGjXC434gXYXMg3wQSwIihBtErAaetgQa4qIms1GISTwrBIDGNPUjZfw04AK0o4KHiUI3QXVCvVZsNqKS2xEAzjdDIKwiKhW/PV7AQlovOCKZ0CMFxwOFGtM2h4JrpMYgEkZbRJ2pbfHA4TwIqCuMLgXe64RLU5S8PnmUwmmoYvnlZjgHxY0D6YYPOu4f4n0L2eOXF7ioqOA3wtj8fT8iFdZy66eHHOC/OOiERnPIP9hUkez3bUTuYxjcEA6UczUTub1nruC7wI9Edo0TaWl0JRg05nNkfsyUfZh9gth7IRuqd7oIAW//18K3b7WVSkVqtUL6K9bAxEr1g8aEaAEIQW2dpYv/5PtFWpVDYvRE22DhahQKE7yi4AcJbZaGFMTHjsQjS7oIPsAAFA6UwHG5E7OLi8vBQtYBhF2ytwScA0tNHRSllZOtrv9ZaUVKKfHe0sR0OvEXoiVFycmbJEOz8d5e8+zwJb5vOXpGwtTkeDugcIwKQeCEjRNcD3160gMHQpCOgfdIM70FjoD5o2/blnWpkUhH5RbkVjb3LL6olKg9G0rhidg9J73lRYJeIKPfJFq24hCDajPl3xNHTQg6YHClwG5W9CvbrCXmg76nHT224v6AhnxOnTEJp0EwEI6nnXH07+B2B23JiHn6xTAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC+lBMVEWsZRCqYxCqYxDqrCyqYxCzbRKqYxCqYxD1ujP1ujPdnSSqYw+qYw/1ujOqYxDUkh/1ujPytzLCfBThoiflpynZmCKqYw/PjBz1ujOqYw/BexS/eRTAehPBexTEfRT1ujOqYxDFfxXBexTzuDHOixv1ujPusi/1ujP1ujO8dhPvsy+rZRCqYxDJhRj1ujOqYxCuZhDgoCbusi/WlCDGgBbhoifTkB4AAACqYxC/agn487H12U/35Hr100HDfRT23mL10D712Er23V323Fz23V/221X47JX12lP11EL0zjz110b0zDr354L24nL10T/12Ez1zz312VD232b24m/11UP11kT221j232X1ujP110j59rz36o70yDf12U7476H598H24Gr354SvaBH343bcnyX35XzzuSj0wTH5+MX36Ij232P12lH365LyrR324nD24Wz1yjj0xDOsZBD35n+9gynSpkfQoj7qpBzktTPswznIjSCzgSLAehTRjRr11kXMiBv36Yv48av23Fr48KX48an23Fnisi/ysCC8dhPDchH476TgpCj47ZpxKwDMhhnTkh70xTT35Hn59Lb10kDotC7SmSrzuivCiivGeRXzsyPUmjzamSLXpCuvaxf12Ev1wTnqtzL0xzbv1nL343PZtmG7fyb1x0Dvsi/qrCzWlSDclxm1bhLet0f1vzXztSXjvkj36pCpYg/OoTPmvTe4eR3Ehx7crj7HlDjuz1Lq0oTivFGvahPwzkDFlSuSVxXzvy70wzG3cxblwlLyqhvjuTv48q7IfxbyxTr0zkTmpynzuDLIgxf47p3Vjxn59bnz0kvaoSrrzWbcoiX5+MabYhrGjybXqjHvpxvluELz2WWkah20hDH0337Ely/Niy/vwDO9gSHHlT7Rkzf2007nwT28jzPy4YbOhhft2X3UnUfZkRfgnBvusSrrrCXjoSHtz1u7iybkxWTcszXrvTTTnCejbBviuVnzvSzNiSXz1lvbozLsylrYoDvGeBNXJpnZAAAAOHRSTlNAr88gQN+Pn89gz1Dvr2CP70BQ759Qv+8wgGCfIM+Pv3C/7xC/38+fj49wrzC/UCAQEO9g72C/AONmpQUAAAS3SURBVHgB3ZYDtCtJEEC/bdu2f09s2+azbdv+tm3bNte2bdZMsieTtz7evWPcru6uCtos/pf8J4TxXaeMnmgymfqMnty1/d8LXXuacNatW0ccu3Qd/5fCLGh6z9Z7ajVVyTbnsa7tgUDT/lwYPxqafqOIw+NxuAYhda05T6QCpcuQPxGG9IHXOUaXNk4b7zLySoVKc56OlbDH1KfrHwpd+5i2ljLjvaEytzuZJncZuXw7xGAlhJtMXf9AGGIyXS8yykMj99fUCGIKZI1aDQc36GIbyQgI7fvcvG6Ikidbb5dQKFeKb+9307RGLvRK3yxtOHfzZt/WwqRt14S8+FCrg+KMiHDeLQSjMZ5pULNh4LbwpdvmjQ8Wpm1fbzdovJE1FOcjIOJuYU1BslzDwUMopInffLh9QJAwt/+N62oOBKiyPCJwUhwxbq+LZ6Dio9hwLuzGjfZkYWH1eraQGScTlDj9QlOVIJKmjSr19ynso+oBZKFbyGklP0ruFpRYfhOKBZGhWmNR9FoJ5OL80hUh/ecGhParqiVKmCNZTHFTBCFYKA48gpEbvdaswwex9+NVAwPC/B0ZEiWfGQeTesUCRoSzqQSfJiKCX0jf0Tsg9K7PBIEXT4sUVF1psljuUgodggKZ18UshS75hNj6RQFhQq44jx3N1WySWWscJyrfKyx2vF65MVSu4UEi8DHgQu5gkpCv0JvVhihto9sqWIm9fLtGUIn96I33l5PKdh6EO/kBYWadSmdW8jmaOJrsawxbGWMtWIlhFyFANCQOqglmKfZOHUm4JRblsdUGnuvktxhW+SKU68ZKDFvyLJ/KlkAxbQgPW3Ep91ZAGHv1mkJfX5d/FQOWP6DRGr3yH5ZjwNW6unpWQsO5sPJLtxYEhFGMFtV6jGD50ee0AHyCvvv+J4yghRjCM4yxAWEY46FUUR1y//7l58++wDQajVFMHuf447NnMkJCQh5KIcCK2A8YowLCCEb+BnGzXmLOrq2tfYvL5XCLDPyzcP5UL1JI8QDll+4w+pFqaWROi01M10vwlx4LhXyhMJpaC2TrFGJbIgSAHo0jF9+wnPrEBBVddwZeeklpt9uVSvZXcH5IIU5oCF8KAd7PGU4WenmSLhz5QqwQnck+aPYhOf1p9ufw/itZFzwV76TnVIwgCZ0Rjme1lNUs0unzcPR6Hb1ZJbW1eHzPKqYuDggz0JoTVVWbEfqyrCwjk04X6XQierMis6ysrNqDXnvb+u4W1HEOSeiENscAYBCcOpKhOpR1Afk4lgw8QIMWk4RBaKMM57PU1NRjKSlrINQphFJSlqWlpZ2MA7TaNT2ChU2AfBOxB1Kh4WVGnCh8YcKyBQULGj+fXLy4O20ZQgyEDh/cvW/fcYOfV1sJRT6OIoJduXtX7UIET6hUqh1oLagJ7qEeg5KSkip2ppeXx6bvZOxKQuhNX1IOBwlt0WUzzmXUaXGb6aDgloc4oCU6PSynUTuy0As90eOsRmPgak73oYMG9ThwYNCgod27oywVzmrUmSzM6YGesliZS06hGYuDgSdZLQ2JkO4OZAFC+Oi1uDW9eiCCTq1+H7q3Re0GjZm9+PfMGdN2EBpEaun/8F/jV+C5+KfgmwMZAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC/VBMVEWxahHTkR71ujP0uTO4chL1ujO7dBPGgBatZhD1ujP1uTLnqSvKhRmuZxDMiBrnqivBexTjpCjfnyatZhC1bhG9dhP1ujP1ujOvaRDVkyD1ujO6cxL1ujPsry2sZRDztzHFgBbCfBTCexTioyevaBDDfRTYlyGrYw/foCb1ujO/eBPbmySvaBCxaxGqZBDPjBy8dhPSjx23cRKpYg+8dhOqYw/1ujMAAAC8dhv////11kTAfyj365K0bRH24Gf23Vz24Gv200D110jzuCf221T23V+6cxL232Tzvi312Er110b1xTT12Ez5+Mb0wjD12VD1xjX21UP0wC/yrh70zDr0xDPzvCv10D70zjzzsyP1yjj10T+GNhy/agn24W71ujPBexTz00f12lLzuSn23FvLhxnzsSH23mHEfhTGgRb01EvUkx/yqxzmqCn1yDfDcg311kbNmFT47pz35oD221fyqhvMkSvJkEbbnCD35HevaBD35X3211L23Fntpx311ELztSXsry3110nEhzjVqXH35oT48KX36o/BfR/343Xvwjf36Ij35XrgrjT12EvalBnPjBz12U7Qihe9dxP1wDfhmhixahHltjT598Drty3rx0XEhinyrB3hszrxtS/dnCP1vDT24nD79vG3cRKKOhytZhDy5dTHjC/asX3SoUPJkTvu3cb47+P0vSz64E3grS/hpCPTjh/px07zuTPUjRbVq1/munvw46fam0Dq1LjShBSjVhvmzKrx1Vzz22v59Lbs2Zfnvj348azboyz741D41kT52Ua3cBKZTBz48KjuyT3KjiXnqSX+7VfrvDXytyjUpTzWrEbrpBrFkzv1xkD1vDHusCbgoCbYlyLpz3zeu43Lk0v487TTlzLLfRT59r3LgxixYhjiwnPx35C/cRaqZBDmoBv36NP17K3HiCPrzV/bozONQCDEdRbTjhrtujHjmxnboSXt3Zrp04jGdxHix4bhvV3gql3dtVLhvmOcUyrryZjnwEH1ykLyyTzpL92iAAAAOHRSTlPvr7+vYN/fv2CAn6+/j7/f32C/v5/v749wgM9QYCDPcO+fcECvj3BAnzAg778w37+AzxCAnyAQAONp6esAAAS3SURBVHgB3ZUDkCRZFEXHtm3b87Js265q27ZtDdsc27Ztz9q2Y39WReRY4d3bpRdxT79/86vd0nfUfwSYPrZHhxF2e+cOPbpPfzMwuntn+1MaMnT0a4ElPZCp8m9//zKJkEUy/1OJyh6jXw2MGmKvv5GY5En39Ix0l0tYJKVeUW+3d38RIP79jUQun8ZgMGh8bhJHLhSRmAbUpcOSlwFLRtjr/el8W15hQkJhXAODT4+UF4tIZgNq0nn6iwDyVyZyGXkRBTkUSk5BRGEDjRuJeijNGu1N+5AlLwAdt1fKuYy4LEp49tmz2eGUggQnkU5K0ZtkN7ePWPIcMLZ2e5knLS+Lkv3g8YrHh48hotDGp7tL0KA0CkFtbY9ngdFpaW4cn4YISvZnR3ZLpdLHx8JzsvIYPmhQzha6tLSJzwA9g/LlSbS4gvAjZICdiDj8AcDqL/ierhZawa2gvk8Do4OC3NzpjIScD8kQRoafpdLdADGQe5DLKWOhR6tQsS8E9X8KmHb7kpDDtUVQ1kEmth7uS6U74R6WCdGu2IZgmcet2wOeAmbWpRTjEX6HjEYMI4NUug42YI0xcIUIYayrG00AE+9sDpVwfGy/AezFMCwMpCsgA/1oJcNDf2GoUm/S6oxb7kwhgOEByxFw8CHAAcwJrPgBwjAXkVvjAlKTA9oTQPut+aRi92ggr8dcwIMfYY3z54YwgM/POYHqrfMJYG6pmZS+CjI2/Lpvz6cYlgHZd1HmXfseomJ9DEQ7AXVpKQH08TKTWH/BvV2PPvp6D9YIbeF3IfNPVGzFMFSCIRiFrv7GiwB6eemVoqOQed9isbyP7YW1OVlAXtNssexHwAE4b1DIPJ4BuvoZmCS3XPgDAc1YDPySFbEW9luQsNZMgOUasYrtHVju9xSQbyaJauAMDmRAW2Fc3qHVTgAAcotQBAHbO8pvHAGM911pSCGxVq1Glv0QfchmszFoV7+yWM7kni86h1arDGW+5tuVACb4fq8xK0npkm3Xr27z4fNpfL4P13Pb9StoW5OYeAMUocp3MgHMcHgpDGZSaLpEzolMotPpNV8WJXLcy4pZoWhduBpE7XCMfLKW+jlWmlBuEqu4TO7OWfWT1WoNOS4R4n6zIdjZINnXseAJMMERIDbpmUqSKF0oKcLt6B0gIuF+k1iFNyhxjH9qtS4YXLFSbDKYU0gk0WZkX37R/z2r9ZGSiftlOvRMkx0VMwgAaV6FlwonmErc77+JJDwRgHroNci/kW1ECSoWPbNFF3Thxaq0wRrDpRBriNspJdLFUqs1Nlir0uH+Kt7gGU8BSLN5vC0CmSIf5XU7aUbS6zehUW1R6S4b1YGfVPA6PX8udWriXdCpYq3Wo0wNLpPJlB5iLfFIxf28pkEvHpW9qdRYj/zS4ye1YoVCIdZqZcFuRd+mequjvuNRB73sMB5GpXoJTpzaKFDhEgh0HuJNG9WBUeVU5H8RQBrZbtnpEmPqZbYHEpudavRWV0eV8JYtG/aq+2HBpPj4pvJkIy5vb7U68NqO0/Hxs2a/5sqaOrClpYXqV15SVVVV7stDxZhub7gUF/ce8zGhOb1nv821u2DqsIW4pi5+53v6/wn8C1P04sJ1T1CpAAAAAElFTkSuQmCC",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC/VBMVEXwtDC1bhH1ujP1ujO1bxGrZBCxaxG9dhPFfxX1ujPbmyTTkR71ujO8dhOwaRD1ujOqZBD1ujPVkyDEfRTCfBTBexT1ujOpYg/wtDDnqivjpCjrri2zbBHfoCbCexTSjx3nqSv1ujO7dBPzuDHrry31ujPfoCbYlyHOihutZhCvaBDJhBixahH1ujOxaxG8dhOtZhC1bxGrZBDAehT1ujPYlyK5chKvaBDfoCX1ujOpYg8AAACNQgT12Ez11kX0xjT35n/36o6waRD23mH0zj323Fv36Im7dRL23V/yrx/0xDP59bf365L22VC5chL221b0wS+USwn35Hr24nDzuSn22lTzsiL12Erzvy723Fj11EL100HzvCzzsyP24Gv12lL0yTj12U70wjH11UP10j/10D7110j110b11kT5+Mb1ujOUTQ7ztSX232X0yDbyrB3zuCj1yzn0zTv47Zv35X3MiBnUjRfCexTEfhT24W3354Xzvi3354L24GjztybxtTD23mT1vDToqSmzbBH343bQjBv0yjjimxnuphrzvCvGgBXcuE/59r748Kfyqxz23V3zuyq1bxLyqhvyrh723V7243P476P487TfoCXdnSPqty7s4a7iuzr23FrVkx+tZhChXhDuwjjitjThmRj48azcu1f598OaVxbpyE747p7Ehhz1zz22hk3mxEfssC3bmx/343fNhhXYlyL1wjbAehT1wDj487H1x0D24GnSjx7000a1gDPYkRjClknHghf1vDHt1W/mnxmvejvy7brjy3fVqznjyW/KhRnSrVGobSnSq0uhYh/vzkXbszz10kvnrymaVAvquzboxD7eqCrkpSjmqiT47JfrqB/vsCTzwC++eBPPojnWtWPDmVaaVQ/v0lP232TeyZDv0Ezr36PwsyjkoSCqZBC0eyKucyO7ijvt02jy6rHx45TkzYDJpF+7hCWnaBjr2pDx4Ijpy1rkzoTvzUHbsTXImDO7iDTbsDPNkiHOnyzPpD/v01nctUK17cehAAAAPHRSTlNwYO+vn49Q77/f76/Pr0Cf34CAn2Dfj1Cf32BAcM9wz69w3yDvv59wv7+vv+9gIIDfMJ+fMEAQzyAQgACZTZkiAAAEuklEQVR4Ad2VA/RcVxCHYzt1rDp2Mm9t2zb+tm07tm3btpPatnV677ZnEee4naN9u79vsG/QavoT2n8DmDCk54huPl/nEW17T3g0MKx3Z1+YtXlm2EOBqT2RaNuO84SVULtITssW9Nhz2IOBkW18+TuEWmYtc57YLCRcJLtzS77P1/teIOh+h7IpL9tkMmXncbRKq9rt0SegKN2m3g+Y2s2Xf742Or1IlpQk29hsiq4VCwm3x5FAzvd1nnAvgPTbhCsrl1FYVIGAysqSybP//OvcWbfdEU8+4Gsz7B6gLdLfAYAzX7ZUV7ckCjKSTkoBpHNJOqfFdiCYVRBolZtrvQPYVnxeVcVfukpwHJAhAielyc19LhIYNnz97pVS8B/9CmCt1+utWvrFCpBW/gGwMBCibv36fhHA4IJF1o8BjiduPwwwx+tdzn8T4LQ8+meA3z2OeF7mBwXPhwNTrhbsXgewh9rCP+L/J4QfTlGas5vegosePcopruDqC2HAizMvqZGzg4IWvnctAALeBXgjq8jEQXXN1a2JkShuzhwQBnSZpSOOwS8UDMwBPwLe95+hZm000d+Wwlw7KqLcOGvWlCAwcfMVNyGmy5Ooq7ZXeeccQRnNqE6kogh07XuX3XZnic1g/HDzS0Ggz/xLbkLJSZexrlfPqFruXY7+15brLErzTo5YqMYAzxB1Y37XINB11yISYa7dWZQlWFW9nc/nz1jakkjNQC+7SWzFLYiBxl2DgsDLxQySyzwvWp7EEiR+ewrg8A+JAhalKD2PqUQAfhEYKA4ByQ6Pyyqmm4oorO/8gMx/FHfTTrrWTLg8ekYMKjp2b3IQeO2E0+4mzMx30ouS9gDs24cahCJrNuUxUQm4YWMkdcbYlBMhYH+CnoRCNEWnHwT4NCPjJABucA4OQML9qlGoalL2B4FOFYtQToRZy4muBPhMJpMtWyZH+n9naI2Fl5nDbaioCAJ902YzdCRM1GJALpenm7LpTVqlMBAgAZUQ1ViW1ikIDEybGe+wY0KMOuqT05Xf59E5TOSfcOEAJTij2NK0vkFgbGpyTILD43YRQuU3gEzKnKdVmgN6nRMFMKCMUlKfCvXS06mzLQy9B8Wwfh0AlGYkV2M9SoinURhjy9JSJ4WAgVvnk0vW6FFWZwEWHju3zkpgOQnrLWRJeRS3YcnW8WHdOqnj7dnkEobD7vkJtbNLrXa53Ehu1zux3pCjii1Lvd0jfOJGs5Ml5JIEp/5XgB9JSExCcp0D622GOGNjQwq7e8SIThrK3nCLFxPPWIxm0m6/LF2o0yN5fAxPEtAfYnccFbk1xopE1zQ2siX+IkgXL14I4GQgOdmmKY8zcmsOsUWt795LrUXsawaJjXwFAra6xILkksy6HGMj1re7d1W2q6/foDBobL8F9GQyz3YrszwuSoXyEdW3u98y7l9YWHxTUZ55YfXqCxKNJtNQh+TcmoaUwsJ291/3HV6n1W+IyolTKOoUiricKKOKG9tQKqLR+j/oPox6lUYTFd9QqYxGlYrLbawp28um0SaPfcjJ6vHKggUL6iuSS0uXLNm0SYQexrR+xFEc277XR0HrNa7H45zdST2mBezZUU98p/+nwN8c7QCAVPmlXAAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC/VBMVEXmqCqzbBHeniX1ujLXlSGrYxCpYg+qYxDvszDEfRXzuDH1ujO9dxOqYxD1ujOqYxDamSOpYg/mqCqpYg/ioyj1ujP1ujO7dBPmqCrTkR6vaBDytjD1ujP1ujPXlSHvsi+rZBD0uTK/eRPCfBT1ujO/eBOqYxDeniX1ujOqYw/1ujKqYg/GgBayaxGvaBDDfRXQjBwAAACVUQmqYxD110dlJgD23Fn////11kT24Wz24Gn12U/232P23mD0yDb110X47Jb0xjX22lT12lD23V735X70zDr10D712Er232f23Vv1yjn11EH221b12lL5+Mb11UP110jztSV2NQP12E310kD47p/1ujONSgf35oD1zz3zsiHyqxv12U70wC/Qjx324nKMXECIRQavaRKDQQagYRD35HpnLQP1zjvyrh712EvamyO5chPGhxzhszLzuim4dxjhmxqtZhDAeRP0wzLDfRXYliHpuDDKhBbUjhmCTzBwNRBxMQJdIwCbWQzouzXGkCX48arGdRHcnyTiuzrQnCr35Hf48q7fpCjzvy748KT24m/343TUkx/CfBPOiBf28vC8gR69fBn36In36Yz1vDS9eBT1wTi0lYC8oI+ocCtsLwKuejTmqCni0cGjYxPjynHGmTznwj6STgjFlSzNlSSwgiX59LTxtC/sryztyUD59LjwwDXzvCzs5N94QSDrwDazcRb59brrsynooRnblRrkpCLuqR7zuyuhZBrPu6+ohXDkwUpiJwG9kmWbWhHhrCr5977365G7jjDTtGi0bRHVrkXiry2rZBDIjyLvsST354TToCrtxjv1vDFpKQHRpjP1ykPTmiV/PQX/30X4yDT81T7ppyPOihvFfxbGgRfi1s+fd2CnbiKtdSLLs6G6jUXBmVjkyGKtdxvGljHmrSjYt1rpyEjGni+yfRzAlEbXrzyobhTHol3s3JX1uyrZpy17PhKValDUuX/Gn1OOWhjv4p7DnXXz7bfZyb+zjj/s0lqWXCbvzkL10krG46RBAAAAMnRSTlPPUK/PUO9gr8/vj++fgK9wUI+AgFDfgEDvjyBAcJ+PEJ/vYIAw38/vv0Agv78wEIC/AB/LJugAAAT8SURBVHgB1dUDdGNLHAfgtW3bzsy9N7ZtJ7Vt2zbXtm3b9rNt47xJ3znNdo2j/bWN+v/Gc9KO9Ip5O8CkUaOndTSbB0/rM2Tki8GMHoPNj6Tn6EnPBTNGo6LGa/8a6IYQLSaWN6K300Y+Gwzpaa6/xiNkAoGM4PENWoxilNebzT3GPh2MnWY2Z63+S0qjUqk0BlOmpIdgn6+2cdF0Jj0NjO1objwYmP5ngdBqFQaUUaUCQhWSnr46iFVv7omEG7jreb8sOLS07jiHc7zuQoAXjUl8pg8MzBNxLyPxOED1G1dmAAD2/fxrYXaJiVMr9Dq9BKD4b5XHXTaPn/EY6LG2yB8AHz8fAOb/fmx7YQmn9gQAFj+fFSAjguWxdm23tmDkukVLwG+LD+D4FQuYr1YfKzR9eXjx4hT0/gbISIzbu27dgDag3aJqcJhMJj9sET+p1Ru+BVVk8mYc5QbwP1OsWzRs7CNgUGiaBTQh0IQ3bf4BLFSrt38D0NsqPHV/Cr4CHAoMv1M04BHQITwdWFKqyFUp+AOyNwBoTAvBe64Ovcn7cT+wIP3r87lT3WBsaO4J4INv8d6C45vJ3hYENiwEV1JTcfwh+Q80po++2KHbHdqvFXRKOINlgCu4K81VqWjWx9a8D/Q4yhbyAdwCMuM26e4kjGkFw8szsWpwA29G/3VN8oPta7JPAp8U8gMcT8XTgL8cgT3l81rBPM9L7PUA6JvJP+K4HhxBW2fivAP+rkIAX7ACXHSBYE9PN7hrpGivon3Tp+nRzp0sMZk4dUuPAIs+Lc0PgGpbCyi/6waVYgpm+GoJcGXfUk7LYRJ++C5wJSNLEcSK26sLTq5sBbOSbApMoiJOL1u27NMLtXV1tReswoJS2sGPV668+o/GKGJ5RNodyUlucF+ExmTgyRi00rIAIUpAgVeplCFTolvEVojl3GIEKu+7wb1EsQaT0HkyppRa6lVW5uVVSpWiK6RquXVoRGgKjnvdW8Hc+CLUhUsQAoZUSqPRpAyGgED1EoyiEIu4HpG64J3xs1rB0IpyuU2BhFOlJAQCJpOJbrWS56pna/7vwO7YVTGxFZC6V2yUi5HQGvgqnpIgCCUqp6PxoHqbvKUDR1LFbDfoFZvLjThXnZWnlRicfL6Kz6c7DRI0fo1x67mamvLzdsfO2MkkNxgRGx8OXcnCtFpJCAqqxtgUhfF76ErYHkdS7AQ3QF2cgr65m0J9YT6bgqGwUTVFoxBHQOi545MaGBbd4OrADYZC361GiiLTF17SaCgoGo1CIbaJouB1sUZjq4Gnwtq3Af1hvoRgyAz58KLYaDQq0B8qlyfCKApdqXQuhzG9SG3ATLieaeXUSpfDGrlIFBSUkJNTdJvFvQ7zVdKAAoZzG5zzOHCWZavXWHmwhstlsRJzUES3ij1hnkxYYgogquH0xwG9oFC9waqEDcXFHh47WkBQpCeMkFmzS1xg9uNgOaPWdJyaB+N1kZGRe5NzchJu3rInoyFRrUIpfxsktQV94SqDQMrkZ8GwXXvsOt13G7k3b9uDd8JtmEpG8PPglMfACAgzNRglE8KYmJiGyl3R0bt3R1dW+J6Fq4xsyvoo2OUxQOqNNu7oKl/Yd/q4zmfd6doZhh8tioIzSY8DtBOu9CahzO4ycODMmf0HdkErM70zRJk553GAMqJ3794jSE9kTt/evdu/+ff02w3+A/60tRH1J3bAAAAAAElFTkSuQmCC",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFGUlEQVR4Ae2XA3QcaxzF9xiPR7VtM3Y2tm3bybNta2rbjm0ntd1G9TbnvrkPe7p1k0y595wbbjb3N98fMzK11FJLLbXU6qoMrJxfF50pukXf0tH3WQxfaWDtAn1LJxqEeObCWzp7w9Y9AKb27tA1d5AAQsLw1m7+cPYJhZtfGLyCovg9IejYpzq8sZ07TJ18YGLvCUfvUHiHxsI3LA5BUUlwC4ggAHTkdsJTGZ6hzd0CYObiRwgYi98zdHBsGsITMhCZ9CaBoC23fWoglOFNHb1hLV5xS4/gOyDcxRKKSXsX8RnvI/ntjxAQlaSEeGquvJ1/FGx9w+8J4eIfgZR3P0XGB18g46MvlRBaJtbCEw/vGBQLh6CYB0LwJN769FsCEIblJALYPH6IJdtyXv9aWF5p7uwDp9B4uIQlwikk/qEgOFYZPvntj1lShIKmiTU0jCwr5xiYv/5YwouuXLYjD0u2ZcM38W24RiQ/EgRHKsPHin3Bxua41TS2UoWQOnx2eT3qD5/Eqj2FXYIQT085nYJjUmDvEQANY0tJIQggiMbG3DIcOXUOl69dx4nzLV2GYP/4RyZxR3BXcHNjjqE5LQkEATJ59ddlleBi+yXc7OwEdepCW7cguCsIwK1tZu8uHcTyHXm2BFixqwDF9fuUAN2FMLJ1h6N3CEFg4+oHY2snzDYww2x9s5YZOsZTehrCl0G3FFSiat9hJQQ/P7icIu4Lwb6wcPQkAPTM7AgBPSOTlj8DpvUsxJrMYoFllFlWRwhcVygIgGs3FDh65mK3IHgjyInE8LP05KJNEeeoWVmdOKZny2l9TqnAZuY0IgQb+vrOXbh8+gwOnjrXHQg+PyjD0z522qhLGd3zEGIZCaKRU9mAczb2gEyGzsGD0VFQpAoR+egQbGSGn6lrgiB3DZz5ZZB0ENuLanAoOBwEoK+kpYNTqunY6S5DcCcwPP1z6iQoMseibd1s1KeP63mIHcW1QnZmIU5Z2eLmK6/iwoZNONPSzsnUZQiWEMM7Wevg+O8DQYDOUg20r9dEXZoEEHvKG4SsikYU1DSjfk8ubmhp4YqbO2G4sR8Jgj3A8A5meihPHoMT3wxC64J+uFkwA4RoXa1BiLWynlZ2VbOQW7MXZcvWspSUviw3R11lw0NByJ19watvZSVvKUuZgLqkMWhMHwlCtC3uD0XuNBFkLi4uJ8R4QQoIngTLSQXi2vgJqNp/DNt+/gsxvuF3hSAAa19cXoe4hU8IZkJ96jhUJ4xEfaoqhCJnNs4vnovaVAkgWE47S+t4EsrpRJ95+z3wc9OAQfCMTr0VggC8rWZ4le177A+5wFOoih2tCpE5GYQ4O18iCDY2pxOX3QV9Q7Q4OGFfXrESJn/hCkS98znes3ODj2/4XcPfClEVNw7lUaNQmzQSJ78fiPbFfaHYMQ43ds3Cqd9noiZpzDsySoo9QZDmb39Eu4lcCVAnLAF/zq+/HjXujvD3gigNG8OSugPi2LejWmQSiBDc2AyqYpYWG37nr/Phau/+UDdtR36RC+XR41UhlvwLcXX9KFz4c4CeJBDrskt9b7z8igrAhWkz8O9TXU6LaGX4h4EoCRuPwkAlBDqWDYFiy0jcWNeb7yONit7+0Dfryx+VAGcmTWV42lam1KNDsC/q04fj2FeDKmVSi88TpTFJLcc0tMFxyltzWRd1+Ge5b3nc1EwRIrM2eYRw6seB3MzSi+Ui+h3RejK11FJLLbXUklB/A6l/FGW+iFimAAAAAElFTkSuQmCC",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAADAFBMVEX957/7ynEZa7H+7M301DUmd7/9vSr9vSr1rTnrl00abbXsmUsZa7H93qf94rPypj8dcr0Za7GZt5n5tjH4sjQbcLkdcr0Za7HihV0abbX3rzfbdWvcd2odcr382Zv+7tDrlk3pj1b0tUYdcr3okVL+7tAZa7HlilgZa7H81pH92pv6tjD5szIabbX8zXv8uy381ZHz5k4bbrbyo0L97Mvnj1QZa7H27G3gfmMdcr2auIUhcbX+9eTac23+8NfeWa/voEQAAAD6sin7vzP8z0H8yDv876/4tDT1s0L788377r/5uzz976L+6oD91Bzoj1H69Nj93Fgre8P86ZU5htL+4l395nr69+n910Yhcbj7xDr85Yoxf8r8zD/8yjz7uy/91EX812v6ti37wjb94GX92Uj9uyvodr/+20r6rSWx1/YZa7Edcr1sser+3U/C4vzgf2I9h9TpfcL+64ZNl9tCicWw087z5k3eWa///cX1rTnzpz7/4RL877WhzPDxokKKxPH80Fv5wVj78cT90kLmcr3ig1zlbbr823xGj9jbdGwwgdTdZJTbaoLjZbX8zn3T6frti8r81GXrgsVzt+673vqWyvIme9P8zyrnjZT3qi3smUv94nGo0/bhfnffWa/njFX16WGmytOeytf2p9n37nZcnNv83Wf74J2bwsFXnN9lo+DtlkPeXKfujszqmovljGb81pKkz9/mgK/6tzan0eP4sdluo8Ta7OzgXrI5g8V1rdx6uOz/4i91tOr+3CRZoOLtoFH/4BxgpeTwoD+JvuuBuOnxnrbvkc7xmdL0ozHxnTktfcj58YhCjM5vq+TtqWjkbrDztIvcd2hBjNf0oNb5+PLticn9wOb4uMLwoL0pfdT0sKz++7rB3+lXl87+5En88bxkqeb9+K272ub8yh9Rjakzhdc+jNpHk91Qmt/6xi/79Jn0zp380ElvsOnM3Kdoq+cjdsD/yOv262z4xUp0rOKJtLjsiMLx4jyey+DnkYGWxO3keJ9vpcWKq3n18uxpAAAAQnRSTlOAv++/QCCf768gcO9Q73DvgIBwv79gz69gQDDvYFCfn5/nEN+AMBDPMO+62mWUryBwQMpAUGDfQIAwQO9AMBC/gABVD+qNAAAD0UlEQVR4AcXWA9jbWgCA4dm2bduKatu23d+2bc22bePatm3fM29Neo3vQdv0vLFaQX+y/xKsGDm5eMr4Oz9G7h7xu2AZrThtd9s7P8bPmAKBesxaERWAr1NajwBLmNluDPgxZO7cIdD47sXzogLQmGkdpppMah2ZTI6Li4uPj09O7jQkOhjToaMJVgtJVFoqopZzxJz0HLjuXNfO0cCQjiarFRaKxdTXGCjGNTSI5HxGGT159Lj5RACMR7SbNpWJEhl8P/NjmcxoMbpI6RwO56Nz7IlEYKo6UZzOEAn9TCbTgOnVsgylxsUVggUZyC2D8GCaSUtl+JlCF9dg4KpkiA5GMFRjtNwM3bYIDzq99aqfKRJaLBq9DoZ1+rQ0nV4FBEiiOU0A+rISNBKJUYKC0WpELhZz+BIVpkQzNBmokgj0YyWczACpwXA9l0riiwwuo1KGqVQqTOYZRrBKCIt1pkapQjQGUUNDg9AF1l2j1CMIXY/UDx2DB0OmxtckJLCMieKnQVSDxQJWD0NguD7Lk7ccwoMxPT84w4JRUjqIRqMlqiRfoZheZ7XWPVGwHSIA0yjHT1oRLp8vz8nJkcvlCN1DAeNBWQUxRGAV/XgNLEMNG7U326hUtzR5kq2gK3nbCcHceso+MoIpy7S3SmU3+X7Ky9p2lZ1X2EwEgBg1ms1uodwBZT98W25+rKCwsLCguTmmV69ewyMBaKX5i11xslRtatqjj1+89Ey5ObuoGQSAAzR2MRHIqoPpWoqn9qnLDwGvV6BwjCVcwhXrPu2u2nUR4No1hVfh6E8AdrKvnta+eACAyFVS5Dp64UDmswdqm3Zqn1sHwOVLpeU+c2Z2UdHhw2AvjeUFCEDRjh2lpRflz5eDfD6f2ZyZmQ3ETTCHd4oAxNxsL2lvTGS9pjsEr+NBF2kQdDD2oNQeEdiEs048GBx0l5SUHIo95K60NSb9eP7C11s33OwIz+l0VgTwe6m93e222V6OfTOpCow+8cjWLYEnQbm8GxUVzsDnA/B3vqVJtpSU/bHfHzvxyWdnT73/3rvvvFBdXS2QOm42YDEeTD9aCcBLkaBNF3AuDSa6t3Y74q7CgXzewOg34zZJjTggkHaLDqa/Upmy542HQL5iARQdtLc3VkUAgbR3VADqHbTtYax9AOQr2kz4LTBhwdH9Hz4A8r3SLr/9FJ1kX/Mg8PLm/N5jt//b19eev3AMiC2B3FxFm0m/B6A+1z8NhUJrNm/+5ucNN+yDod8FC9ev/3L16nA4/N0v0jndoN8HYxaCZs+e3a7dkvb/+7vGH+xX199Cd5pkCfQAAAAASUVORK5CYII=",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAElElEQVR42u2W/0sbZxzH9wcUyVir6CWXmG9q9PRME60x6s1o/JZoDEajThuNbtIJlYLduo3Wbu3aUmxo6Tb6bZay/jIG2QbbD/slsO337A8YyBh0pSZeNaYqVt57notmKvthbOAucG94E+5yB+/XfZ7P83leUaRI0b/Xk4Y63RPBKS53tof23v/wyBGBGMS+v3svYa+ZW3a1xOQAIBBDbG/Fqt8bWQv6VTsAsR0AkZjf+07SbuOXOA6JOgdkA/C8zYVVTxvW+rz41eOO3yzIp+H3epE48lOJ2Ze0WcVnJhOSjnqIrW6VLABWOluR6m5H2t+FFwEvNseDiFZzByHwm5UHDf/MaITocmHF4xVkAbDqcWPN10HCe7Ax2IPNN/zYemsYX9v4bPjP8vOR5KtoeGoC3YW1gQF5AKS8bUj7O7He343N4V5snezDy3A/tmfCeFRmxuW8PDxkGCQqyrMAKb8fL8bG5AKQWT7rA92Zrz8WwPZkULL4dghXVCo80qiR4CqyAOngoNTEMq7AALYngng5HcKCUY8vWM2+CqyPjkoAMusBL+kBH62CBLEVCmBrYhDf11jxmGWRKLdkATbCYRltox0tf+1C/RSih1Yi45MB/CzUI3Ls2L4m3hgflwWAjhhLrkasdrmR6tmB6PNgnYDQJbU+1ItvqjjcLChAopLLAmxOTUEux4nYH40OiO5mCkErIS2ndG+nBJPu78FXllLcLizEUkWmiZftdmyeOiUbAIEYT5vqKQQdahREmswpL53O3fi0qAj3GQZLFgsSXCXSQ0N0C43K6VAXIgatRMLVJB0tnreTSdvegl+cDtxRq/GjuQQJmw0rXR6k+gLx9NCwSm4nUx+xuAvyVHDid5eAxwY9fuA4JJtdSDYJouh2z614PCS8DDXZY+KHfcbFphEtzCE1nD412jxaDATMGPeZ48Ygo5NlcNMQozIOMpGyKTWsl1kcv8qCO6tB6aQapkEGJWE1Ks9pwJ9nUfqmek42wc2jDE+DSuHmWNR+opVsv2iIc7MZAC6sh/M9Pu68ahGl/+ZZ+nzUdp2NkGv+f4dovlfuE+6WxUiYWNPd0ljHgi1kn9cK/AWWfHkGjOc15LfmSYe2ts/50Ov3LNHGOyUL5D1yT6YiMCrrJRbG0UIaPgOQa7J+zC7mNID9htZHeiB3AajYwNFYzgDU3tbqyLKJSrvPhBrmEfVikefVxZwAoNshsXj8mrRFgs6DyuliaHqPQvYAtmusUHNLK9ojWlgvZQZYxTQZZmdN/xig5orxcCc0CaczjTC+8tOaGH9eIwWv/ohF1fsacGdYWGeNFCBOgu/rgRM3DDrHfb3QENUJjd9ppfMQ+eVr5w3RwwZQEc/xZwwiP1uM6neJ3ykGP6snwTPh6TO7AOXTmpj9olEkQeF4WIyGb7UgwanjjgfF9PnIoQIcgOGJQxSIeIafMWSXyy4Ad1oL+wUjaq8bUHdXD+eXOpAq4MQtfRZWju2RBSid0ERJSNF2zgTbB0YJhl5TaNmGpzrYAySsQE1A9jV1bgAckAKgACgACoACoAAoUqTov+tPgYkHUSa5SFoAAAAASUVORK5CYII=",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFiUlEQVR4Ae2YBXAbRxSG/90DnS05EYTxXOYqZa5SZhoot/Jwue4wOhksMzMPlJmZWWWuFebkTIrurNvt083eVHVIUi6cb+a3WHrfvd3bPWMLZytbYYiSY9N5AKdSbEoWCChS3qc8om4jhdGPIgJOo9ykCl8lSqBDSUUCx9pzJeU5VXxYYDuFqaRqis5RvqNkN5YO5CkPAQGdlJuxapKqS3klM4XiYC3RsF0LmsRWR95SR/hurJ4y5QXVhSxljHq8/ofQzu2tD+kmew5AUh31h1E/p1Mc1YncehfY58jEldJHvuLJrCpkOhqj9jNd611ADOIKtyKguKXJcXxzOKlV1o/A/qe02RCwhUDIw2iSqLqgYxWc1bFXtuQNnBYuRmOHTXi+MOdLW/iArjEQhdrz+Rnn75pbWlqMccMnFursysNPPvh1l+qATSlGJnDY4eNzM5d1v+eLCkL63b6uNpG+ZXl5MQwSOGzfdid7wM65hUsW2nNKxa45PTNtWQH+cn93GMPpda66z6t1JE+ZFtk6sMOYlmlMY4DEqUaaZVsncTAN8JZKVPolBpdJ+HQbT7dAJFxYEziES88vlcFaYI3nuXoEvnixL6sWtoJaF6JfyLZPt+S5xW5qmcCTvBVB8aEAPQ8jxcBNOOW5srOZOfHHglK3GkIs0jkQ8ufS5Q9fo48vLlpSeW6W5Sf/4SWML3Fsr8Uxv+xhvwWWs6sXu6XZCX2CViwCsCdPiD80YoT1PWTQuULdAnvvmcGqePfXnW3hug+JfjcHxvBN92LM6/dw4MTxSGocUkoI309KoEvtQjsoBTRCa/D+nNWq5RHCUIQMvuv9pk+jH8zcO8tj5nfcNHKyrxd/zJ2L7mXLMDmdwqh4K0zTRCwWg2VZ0HUdanvwnrpthB4QzAB4qwzCNNjqu/JNC/CYdRMzjOTgzJmQpRLmeC6ElJiQSYFrDNzQwHWKocMkERIKN2wPoRmYBLcktOES+hgfWlJAfVe+YYFP+49OciuWc//8E4KKh6ZhgUsCQmBseni18CHhMEhAN4ywE3k0iA9ZYDGAJwIJGBMEjHECYIGE3ZAA0/UshIDvOKjCGIMGoNWKgWk8PPKU/0uYMTN4L3Eh6mdPEH/+1N/JTPkwsyR4G0mkSKC9EtwSXQ0JcNOErFQQIoWPpGkg3mKBm/8VzlThJBWEa1o4H3Kon6S6dT57welghjydRIrgANOB2PY+VEftugXAORglQHVAAJAUruuUIRKapiQYNEOHolGBAoiPH+p9/sPb+trVGe35oCMJicYEhICk1BhAApg5fyFYdZjUDJuwcMZUOEODZFe2d/rw1r6HKacDmK6PEI1NYuF5kIODCJEVH3HTgJASc3r6wLWwcC3oFBgDuBJA/QLjWn+vPfqr4nl1W6xfwHUhPSWgSJhmcBb6+JsfgXgralFlN0N2dcWpThT8PvawlhFFCoZGr/4ZiphfhvBcKIIhM5sWMV9KFGfNxY8z52K30RnIigcICSmrAYJANiMwA6vhy3eXdWAV6PQihuIPWw7heqid1EKIIFXe/PBLjDz5KIxkLHhOBgkN0AiT1W0h0isyv1SC3+MgnMADho7Zff0IKZPcA0+/iq9nzAV0A9IPJFQa7kD0AoIEpCpeG9bmtJmxKQAo6lpW8faXBTz49kfvo7X1YXDNUV2IdA40fT2wuHcniYF+h5nm1KFH6I7ffgv3KA6lvXp71YlHJ32v8lylrz/numUQbA1nIBtAt9pxTo38mpjTURVCfCBX3t5OtQB9oCRw4ytvVW+nXnzIgTfBYz1YM3bt8ImgA+udaZSu2n9JNgPHhmPP2g5sigL2Ji6g9kCUTU5g6A50UxTIIiI4NiwfbOoCwFaBDYNTO4E3/Eq8dQhtFdh0+Rf5vCPRtyfpCwAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFOklEQVR4Ae2XA5CkSRCFN7y21bbG9tqeOdu2bdu279a2bZs9nukd8y4vX8b22Az8GfE1q///varMrOoOTQsllFBCCSWUUEIJJfZZLT23Wi33MauZb5mp9Y3fHx5+34HwsNVCSPC3R8PD9O0insXG7AsKOp1+771U+OKLlH3llXQ8NIS2WS278V3V8XsDA6YeGjnCk8Fjiz/9lPLHjKGk8DA6EhhABwP8321T8dtt1ndPJcRTya+/UunChSTMmyfCPDNn0m6HndjEc97xu3xcz52aMYMKly2j0r/+ouJbbqHCqVOpKDKSCoKC6FQAm/Bx7eYVUrd6ymCGE1kABJeJ//13KvnwQ1mJ0vfek9U45HQQ0gpmT0yeTMWzZ4vhovvvp6IpU0R8cXCQUOTnR24ez2M9/Buf1koZn2122+m0G28UwTAgvPkmFYwcSfkxMTKrwrhxVBAeLiZOREeJudLPP6eiu+7CWBGP7/N49vN5TL7FLLiZLQzf67oWF4/ZSb/2Oir96mvMpJgoeOIJyouLE/G5kRGUGxaG92WGILCIUwcmkTa5bAbjQI6vL2WbzdVIZrZbLS1nAhfCBdOuuBzpITNZ+vU3lP/ss5Q9bixljYiji3GxlMUFKYSFUhYLz+K8zmbyx44RE9ks2jsmg2sk02yqFbfZKCaQfi0jnnP4P85vzCRM5Nx5B2XExlJaUCAlcwqkmE1lpDqdlOFylT1nBgdTZmhoGak2G8bVyznm0kp82yzxF3x86CKnRPb0aeSJn0XJsTGU6LBhluoF5mAyNSSYkvkZOY7PG8pZTqddFnPjTLyoHqJbYjJ8uwLLaNTTBoOW1ugFmq9T02ydSvhBO5y+0QwrA58t12toh0FHJ4wGOmsyorOI8EReBczoHr7eFv4e11qsVwO89oLfYowXXAM0zsSnwf6LP2FxNfGheqjw7iXeUg2lN4YPEfD5V2zECwzONuloDgvHa3xWlS8aAe7/nsNyoCG9Xo0VQDvbazXTAbsNu6Xssgc5fXZyJwEbuSiXhYfTlz4uekQ1nK7t05vie/eS5/sG9qNXhw0qu/lzQwYKDwwaIN/dPUCQ948OGUTPq4bRm7x6n5gM9K3FRL/ZLfSXzVzGb2Y9T4TBvchkmN3gVDpssz533GGX7pPFHSfzDi7c6dMpPYK7yZgxqIkyUOQwBAE39e1Lk3r0oKiuXSiwUychoksXGt+9G83o1VMMYsV+Mxhoo91Ox3kTO+fvT25+RpFnR0ejqwlpfK9z4WF0ITxsTnJ4eL/G1jFMXMdQ4tVXk+fJJ4EYcev1UqAZ3POzJ04EaKliDJ8d5BVD6vyi1Qq/63W0hN9jY0OLrQl0LOwBF9RqOq9SoYBF/PmoyIc7NCNgwofxuO++m4pPnKB/09JwpsGs40Zol5gtiEe3wr6AWQTePaHBor2c1mkJ92SmttQZSM0XwxkIBoQSNpN+zTVlN8WqoE1K//f1FTJ9fCoBwdgHEo2mqqK9oIN5xfu0+EGOLzobK1F05AgV7dlDBWvWEI7T57Va3Ly5eMXvbnHxVVLqXRyN85Yupby5cyn32++4Np5CETZZ+DlejWMWs4jHRHVo7UBxnxg10pP+xhuU/e67YiD91luxSyOVmir+25YXX09x40/ImalTCUdsnFRTxo2DCRw/GpRWKNYjVgthVdvtPzFuzuBfFf4iAhwdkFIoahRrTbOOfG+RTtOSXepbRtLhtMNB52y2Ms5aLJhtiMb3XuHP1Zwy7W/kPmY2s7oGnmNiZLASSiihhBJKKKGEEkr8DxdDYoaJQm4eAAAAAElFTkSuQmCC",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC+lBMVEXBaQCwVACwVADDbADFbwDJdACxVACyVgCxVQCxVACwVADKdADKdACwVADHbwDCagDJcwD4smLFbgC8YwD/4rDzlDr2plDJcwDEbQDHcQDKdACwVACwVADDagDrv4WxVQD8z5KwVADFbgDCaBO/ZwC5XwCzVwC+ZQD6wn29ZACwVACxVgD1m0HHcQDJcwCwVAC2WwD2o0kAAAC4XgC1WQCwVAD/5bX1o0z81Jr1o0uzVwD/5bS/ZwD80JOxVQD7y4z2pE36wXv2p1K2WwDGbwC9ZAD3sWD2pk7/5LP5um+3XQD2q1j2qVX2plC6YAD7yYbJch2yVgD6xYD1okq7YQC9ZxP5vnb3rlv8zpD+4a7svH3olUn+36v6w374uGz5u3L3qFTzmUGzWAD/4rD5vXTEbhv/47L4t2v3sF/4tWn91ZvDawD3qle1WgXZmET3r134s2T2pEr5um3jmDvEbQDDbgv7yon+3qn92aLXizj4tGbglEDJeiTUkkP+3KfPgSP3rVm3XQjCaxftw4jam0/IcgDhqFvsv4TTgRjBaQD7x4X/4a/orGL80pX6xoP6xoHmkkb805j73arpsGrgqWbSjDnKeB392qT915/omE3+26XOeCi5YArRhi/21J380pfyq1rotnHtqlnpplvHcgz91p33q1btlD/LfCHylD70nET2o0jxolHjsHHdii3tt3O8ZAr0zpPqlEbtlEL61p/LgDPJdADrtHDtwYfunkvOdCPCbxf7zY75v3jknlHAZRD3rFr2pEnLdgrxsGDZgTH80pbakDnvwoHwmkjeij3mnUvdlETmmkjEchj6wnzhrGz1xIPYjjnRfSrzqVTLexbMfy3jlUzhpFzGcAX805bfjTfxypLssmTOeg7ssmvuxIjhqWjJcwDzlDv1n0fvtW7qmULWjz7ytW7sqFP4u27yqFHZiCXsoEbFdyLcjjHouHjKdhLuxYjcnlbIdxfllEHsuXbim0foolXEeCzhkDvZnlvUiCXrpFXCch+ENBkpAAAAM3RSTlO/YJ+vj5+/r+/P34BQgEDvIICAgICAgM8g72AgcDCAgICPz4DPn79wgO8wQIAQvxC/gACevSroAAAErklEQVR4AdXVA5wkZxMH4LNtxk5O0xjbtta2bds83/Js27at2LaTr7rn0J0vzk9X693/UzVvvTu7PRj/sB4JMG3I4MGTRjBG9B2/dfrgaX8NBm99najxpWRNHPYnYNqwYVOnQfBORUVFaansx673kg/KZH1GjXp+wu+BaX1KISWTHbxtSYpYekdWc6P+fcUHFSlk9SYIHUx7Sia7UwHgWC2AtSlx1QT46Hr0orKyC9HRw6fSAeRTLt9Ocn6YUuYG0HH9chMJFkd34lAb8itB0ECf6HyWMekSBAnwCeQIkFxZhpOVt5z3DA0Mi67ckGdMSq7sxAmwOLWJBIt5TZDmhrl9NqfyRlNBj8o4HMBnX+IE6OLF4QQ4xGvFcVWwOz1vTkaN/EUKmMrjtQE4xCshwVF5J3y8Uf+N/FpYtU/6/Iy5S1jtcjkFPM9bhAPIlnuRIF/+OTnhqPwY0Xxu1LpavsVmo4DR8lYC5Ms3kGC2/FVywgWbF9n8vOGuUG0w0EAuAWbbcA+wAagGYPg6qvEI3/WO4a2qSAShPiTbmdwc2/JUQ5sHGO5NQLbV8ncL084g9Q41HRjuVW4TAXYhxZ4JyF2IV9VpZov9HRrNQ/AsglyB4+JrdiEfF3/auh5BcM8ETbOxqt7yribHobZIpQ/AaARpwcni5mo8hZMTMqU1Fl+xuFuaqQ5Jo4CZGjLPJa7Iq6SkOUcqJScA6BbvcYTsRTP9zvJR9CGQFnvun7iiKNaRa1L03gS0OyTEX30R/UltPE8D26H5ZriiJVGNtXwX/OyWZwL6rdrPrwNdn+BweQUNeAjQcp/0n+3QvJ3vgrUYUXQNOSEn6FR4ZFZo0GmFmFXOee4BeA7dNiejBP0CmgvTYIuWoKCFPxSXXyvicAqzT5o4pnincP52MwUEnWxkCe0Lm6F5ncX37ClOaKzZzDFzTAuIj/suacPbq+ngtJjvWlfI2UJsseaKeeHVqxeL7DtPNDScMJluamPijRmq7YJ+D4E5O8KYZrxbZL5XC+bNm+ft3dDQ4L1aq43RKXz5PtxyCuhvNsVn1UHzvYtCoewCQSjkvTc27IB0gE7hb5yrUlHBywJBtlMNVwQ794O1dNkFhzdCrY7RSUT6/ZFiVzoe7IU9BIzHBbGXCtT34gkJio7YQsgf1wUorUyJQl0XFaZyv0YFjIGCIm1BOKSzEhQR8fHOBdjhTZv0EqXVqtRm7RHOx8PSt2BTKOClAdjFpQXQHOLO/VrtV9jOTcf1kGdL4v0sjdWqahaGvUQBjJ4Y9r1uaQQZh4PuwPYts4qYVqsoJsGRlqEK82nBBtH/kD2Jxb4doCvQanW6AIlED0DEZFvZeme4b62bG5xnx6ZQAVQ/EBKJTgdpvVKJ7Qtks2GAThFC7NTdgg2Y8RswYyAIyMKrSMQMXBFohfLslBt8rhAbyqADj7ipVCpFTCabHbhiJeSZAQr/KtjpOQzrxaADUvTDsLVKUWJiotXqAXrY6e487i1KngKgemHYMsgfOLBq5RtvkjtV1zcGq76j5mkATm4i86sCAZA7Fc7htsGB/whMHvr0LLJeGQvvxo0c+cITY8Y8NrTnf/8//YiD/wHtW+PC4HHXtgAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAC+lBMVEXGcijHciivViawVia3YCe7ZCewVyaxWCa3Xya3Xye8ZifGciixWCa7ZSexWCa8Zif6wHb4t2jFcCi1XSa8ZifAaye9Zye7ZSewVyaxWCb2rVmyWibEcCi5Yif3sV72qlPCcjy9Zye8Zie2XyazWya4YSfEbyiwWCa5YiexVybAayevVia3XyaxWSa+aCe/aSe6YyfCbSfCbSjCcz6wVyawVybEbyi+aCfFcSj6x4S3YCazWibCbCe3XyfAaie9ZyfDbijEcCgAAACwVyb/5bX/6L24YSe9Zyf+4K381Jm5YiexWCayWSa6Yyf+3qnDbii/aSe2Xif80JL8zo/7zIz+3Kb+36v92aKzWyb7yon+3aj6xX+3YCe8ZievVia6ZzX/6LvUlWD92KD+47T+4q/80ZT3sV3vxY/91pz4tmbFcCjzz6D5wHf/5LT92qT2qlP/47H/47LQjFT3r1v7y4r2q1XgrXzGcijsw5HtwInTk1+0XCb80Zb81ZzsvIX74bX8zo791Jr5um35vHHAcTrjsX7CbCe7ZSf805f+4K77yYf6w3z4t2j7yIX3smD3rln+3KXWjlO+azDnsHfFdjr/4rD1wID4tGPAayf4uWvNgkb9157ShkXTgD3NhUj2rFbCdUPDd0W1Xy3vwYvJgUz5vXLvyZmyWib006P/5ri+aCf8z5C1XSb/5rfLg036wXnotn/51J/93arWlFn3s2L4uGr3r1zQilLruYL6wnv6xoH5u2/gqHHanGbhqnXDdD/zw4jEeUb/5LbPiU3wx5LfoGT6x4POh1L42qzirXT5vHDboWq4ZC6/bzf915/MhErVjE7216r5v3Xepm/zzJu+azT/6b/TiUrTg0HSjk7yxIvPiEn2q1THdjHorW/XkVP5wHjprWzlqGnDcTDklUjRjFjHfEjCcDHIeDHanmnFekT1zZjjs4T3yo340ZnNhk3ovY/aoXD63rHeqXjXm2r21qnirHf21qjRkF3wvH7gpW3kqnLJg1LXmFw+BvvjAAAAQ3RSTlPvj4+/36/fr++/cK/P75+fv7+/z89QQL8wUM+PML+/v7+Pv3C/r+/v3xC/72CA3++AYK+/QCBwn8+/EO8gMIAQgEAAa1X9lwAABD5JREFUeAHV1gOQI10XBuC1bVtj243Ydsa2bdu2PWvbtvf/bNu8PexkUovi/72lU6fu86Y7ngK9Yf6/ge3UZVOdRucN86OiLI1eDmynRIEYjcy7fOuf+fo6vhRM9b3WHf3pruHZnHnt8eOrb+16KVjmm+SMHmBuwGZHZmfPgPMz5ssBswdBTjOdRsBFJCDgSeZLgTE4hJzMXInN9pkXAwJCXlRDWFbZ2xtpAODQXgTxq9Yenqu9QoIrXrCw2YjF6mWtcJgMVlX/hSDOF1grMcDyCnbPacSAbe8n0Z0XiPMmA8jgAwQZ6GbpOwDQ6+VOIjUSwXYeMcPN/ap8mwZg0QuuyfkGcSsAxDaSgNEoB9uZcr8EsiBrtaZXmliOIEhSuXwVZChvEzAktVlguzpLQM7O1gigxfIHSMBAZ9ZCW8OsGImk+A4GFpYK4z1+o8/UBBwWlnaHBDtH0lfMpMfwAwMH6RCkS3e5zem7RNmuCUDz6HeC3d1RFzqFnhgodB2kQNZ7KPc4fcm1BDuNANpIuUEiAUGhJApd6wYJkCHBRcLlVcpmQJqB9RxCDIMhQF0Ioa513u0y6zmyn/p44bUyXQ1gleHOjXNnEEq/4BdL0M9lZSnkWNlcdiyfJ36fvRyaBLbPkI3m1l6hUJKUfitnfzSbzf6FJ859xLZTB9ZzZbLYb/1QFO2MTGeH1nmf93volrPfpf9XYW7Be/2LIHUwl91+Dx0IqRDkVPSgkf1HSD1uFQJJoGvZWW7B8XfidNXBdnY76gZeWn4xeDL557/s/wHU84V1KfEcbq60RGSqBqzn3Pw+GJz3Sjz6NXhyvN0y/LD6hGwPLk9cIC2fBLbHfRfCkPz8KC4uTpReRs6uG6tPDs+9LM2L7VIHO0TdDMkpkWi2nt5ykejKV7cn6o9Lj717l7Z2Esjh77tpYwaBrFnQ9U0Krn7ofsfbtAXqoGtfYGyX3shCawHtd1z9/Y4T5D+peqpgPS20jTZLa3RjSjvDmai/nlqT9rB1t5YK0NpNo9Jmj++oygLxaH3aiZpD+T7iH+FFKgBaQFW2UqePbrSo53jSvLwh/+H6fJ+qg4WuStgMD9ZQz/H5LdTR52I2nAEuBlz8SH1VoefhtNOK2SoAbk9IaYN3Y0+36QL4CvkYvt4zrKiJq1SY4S9pN3yWQz7ZCs+aPguGP0uQqtQXNUUE+TxQTMMDPfhjbnL284+am5tPPY+XqtX/LygoqLJVRwsHtGYpLoWLkzkeHvF94iFQn+rjWVQ4Vo+l5g/FNByA1ugoDnDF4Jn370jNrwprGj4UETZaj+Xy4HQ8wETLUW8PXq7U//qhg4dHz2H1o/GsNFEBkNl0hULZ0tJ85khJyd0n9U+fNjR8GISPjxUeYDFdpKNQjaghAic2qYNRNh49UFBf5Vk0dhebNQN81kzfsmTJ0qWb1oFbwoP//H+NfwFaoRqoGS7QfQAAAABJRU5ErkJggg==",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAGvUlEQVR4Ae1ZA3Ak0RadNWJr0tnJ2rZt27Zt2zaCtW0EizhZ23ac2h/M/X1eVXftm5pMNPP/6lWdyjTSc87Fu/f2KP7P69/6t9TvDxQS4aZ+6/lC/X4fAeKxl4hevwv5cJDWitdbvX5tAbD6y3XEsGEgUbMqDOqZzUj9YBwx3B0y69ckH9SklfruUAJAmJyUHNTra1NicHNKCmgY/ma90vyXE5AU2HglCMZfqcqTl1BOSUm+xRgg9tcT4Fvci5GblE8m/VSppG/Ognwcv8+BEi860Ku9Nit/OQGJp229QC6pkyMje1cp0HrBlY4rZQGUtMaWki5Y0fJ+xiT+S7iIoyJq/TICQO4/tewpwcGRPJycab4oAMAxkDTGlhJPWJPvUjMI+BleIvL8L/nWwhdqCgC5qOp2FGNjS7OVAo0XVAw4BuJ721PcEVvJA5qAR0oZmji+4IX0hZoCQO5jBTP6YGVNg0XiAITgGAjvZc/yYGobE20CADzboDtUmMYXyuvtVrswkLtX3pQem5lTNxcVwATgGPjczZRi3cTEDt5MrVu1Sk6Em6HIt9JiLWn1glVBDgL8cuemViJ5YLWdDQUZGVGwkTG9HWnH7ol5dpmeP31Mdra22kUYKB9Wakk82TMjGxnLAs5ny0bt7B2ovihguZkZjgEmIHqdkuITEujtp480bMig5ASMSjkH0x5qXlqSTsoLql4oByN3t7ER7ROPIaBqPoFW5ciBY4aPM5T01a0aJanV9PnLZ10CvFIgTzBaRgUAID9LOoYAWFkSUFLgBXxdqKLIY21TI4BSycM8owK8fk7skwNsQZKR7WduAQEy+SMm2dm1iEMD5RDq2L6tLgHatlQ37p40FkFUTdIF5AF2IoQRYh6kH9pnwe7D9v+HM1zp0+WVFPfjh/Yk1k3OLaPJPiolAcgDVGPUgueiAAkQEHnAkk4My0cPTqwAeX4b1S3AXIfx0rTwICQuSTDPmlXTA0zA+9y5OUT0NqVXHna0pL2K+tZw0E2cF1BKDlFN4Hw61izO4rlzYp+XhRyZZULxqyzpq6kZh+h+5vR2mTE1L58HO1NqBcySDaYdrKPNkBeQqGiXrymVEIMmjQmItOQRv8CG7iwzJVdjYxb32TNn1kUcBuHu0Xexk5NplpUFJbgIAHp/JCo6TjRuHCBK6kB1QZU9K7UwNcJz8VnXvV56aSmwTUoCAMQ/rB1vZ88haRtroUFKBjwGgHAPCxNaaGdNmx3saK+TEp9xzSDWlysvMHn6dHq8YYMkAAMLyMoDDGYASdij+TYgiJzhIJHG4AOkQoBeXgqwlvqMuzvnAVgfZDH/SiIwA+BcVB9Heu0s0BPBhU1rwc4uLHcuKQUA5DEEQRQEwEsG7VRhBboycTwnAOMkyGKwQS4A+IxzX8oIyQngrA8REIAkNgj5kP5GtTY2RRhxAjS9wAHnsFulJADWx86mYf1wFNGMTzJT8pcKHaLw8h+Qhbw6Kmh0GUX4lQvnsftwAkAUkxcaO5BH8/Zj8wqKHDOWPnXoSG9EvOjTjx4sXiLj9sGDhGfNWzBfc94AcXO9kL8zIRuBfOIVU0YMxz5z28MLIM0JgKV9SpVkxDQXOlE0c1GxsfQlIoKevHtHd549Ix8/P9qzdxcJLnKh09+71NCBOY4+mZOVgA9bbEntk4/UVwsyQbfPudPpwQPgCZk4diYQxMqAAP0N+Aidj5tzs5dSTEBAeVKHVKOvh/OjhWZEXoaFAoygvHQLwEzACdi8fRs3rurVA+hl1N4qRp5u1SW635LBb7INOkwQArHUCEA7jfsxE8gCzl6+9HOHOkuvAi63V9RCuCB0YHlG/lk3hsiLNZgXXt+/AWLJisC55MIn8PYtWB89kOFerZxqoXBDNYUHJAH4C28glLSIADjiAK6DvKb1tcW+QUS8c3OFF0AcYILgGQwsR/uY0Vv/vbAwiHKkAZzXIA/LS5NZOOuzDL1kT9woxcDCytuB6KoZXR6Zle6OzBJ+bYSK5cXnl/dBWiLOkceOc35VbzalHZ/iTH5znV88HG/thkJpcBHnOytGgSzaZ4k86sOpAZnYjxe4fq6bIgwF73wHM/IaV1UGCEMgPIn/hRGQR/hdQfIkhBhcBNqJfR0VXhACgLB4zIWA3xAhDzaAE80UsyR4jy3zAjkD0aglCEP8MPJ4IfMoRDERt/oa/Xo/RaGiP9laBeQ5AdgQwgaw+iJ7FKH4ywmAR0KXNIIHEHJyXcHbOgiAIFgfNedO/6zyzPtLeiJwfJVZAcNLuwX2c/WSgIKJ0IHQ9D353/q3/q3/As0tEmSXxn1zAAAAAElFTkSuQmCC",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAPGElEQVRo3u2aaZBcV3XHf/e+pbfpnp591UgaSdZoGUljSd7wYMAgxZZjFBEqFcgHuyAU5SrHcSXB5cQQQoVQYFFmCRSFIRu4cLDLsSUTgmxZkmWMwZIiyxYaydo9+z7d06+733JvPrw3mpZKMgZDSKW4Vae651W/+87/LP9zzn0Dv1u/W29riV/XRkdXYVe/K70oHrdXGzGxBik6hCADoDU5lD4flPWRUsl9bWZv/uyqo7j/JwCM35u5xkxZ20RM3izjxlVmTGbshEQagIx+pEAF4BYVflnlVCk4octqt1/wnqh/KPez3wqAyb+oucXMmHfLpHlzqta0dUyjLAPsJNhpsDMIGQNAqzK4OXDz4DpIL0CUBYVJ31WOv9vP+V+t/eLUD/9XAAz+ed2Kqmr5GTNrbUvUmtKPS0RVI6J2NaJmDaKqE+xaMFMgIxcoBX4B3En07Gn01BH05Gvo2VHMkqI46St/2ntidkZ9qvVLE8d+YwAmPlF7Z6LO/lyiyW7ykgYy24Fs3YSovw7iDSAEaBWK0ICef4wWIGQoWkNpDD3+EmpwF2r6PJYTUBxxR4oT7v11X5j8518rgAPrsRZvrv9sqsn+S6sxJlQqgWzfhGy9Dewa0B4QXHl3fbldDRAWuFOowR+g+n+ELBTxRsu6MOJuP/Oj8b/ZcBDvF+lmvBXlO2+t/0p2Qfwe0RgTItuIseJjiAW/B7YJ0gNLg6EhcEEHEZgg/F75NwGIAGwDTA3CBzuGqFuLrGpHOycRtisStnhHstlu+GDB2fXNIdTb8sDEX9d/IduR+KugzsZqaIUlH+XcqKbvlUMM95/DcfJUpWtZvLyL9ddvIGHbYYhc9mmCouty8CcHOHO8j9n8JMlkmub2DrrWrmdho4BT38IbG8SYcJk+X3yw7h/GP/ErAxj6RO2dte3xb8mWpDQb6hm0N/EfT77I6wf3o91y6AADfCWZmFF03/hu7n3gHqTvX3Y/ZZo89Pdf5tUX9lBXLTGlCunVB2HHWLa+lz/YegOt7i78sXHUkKMm+0sfbXmTnLgigNfvrlrZvKBqX3JhVb2oTXJkfBHf+vbzxHSBJSuupqNrI02LuqiuaySWSOJ6AYYRsLipCNq/zNYahMmZkQRBYGBbBuWiw8zEKCNn+zjf9zKnjh2iLFJ89CPvZE39WfSkg3Nudnz4jdmbln119udvGcCnwfyzv61/rGZpemtQE0c2LOfrT2jS1c3cdOsW2trqMK0iBDnwnbBKCUL28cpvHpNWLGIiQveZSTAy+F6CgYEJ9v3nD8jPDHPXNoEaO44xVWLqZP7Jr/zd+Ac/Df5bAnDqnprb2pYmnzTa04aRSSBaNuFnb8CMaSgNgjsbxbkMqfOXSqtL8kPrsFQLAXYVxFvxywJz+kX00C6CXJGgPx8MnHS2Lvny1NO/kIU+th5ry7rMP6YXJJdQFUNWNULVUqQ3BMUh8IsVzOKD8kIa/VUFP9xL+WGxKw4hvWGQNsIbg8DBkloqJ2iazhe+d/ASVjIvBXDX2vS1iWqzN0jYSNuAeC3ocqi0FGBKCAI8VyEFGDEjtLqnQ2u+FQcIAZYANEE5QGmwbAmGAZ4CpUPbxmoR9hhBwiZRbfbetTZ97TcP5l94UwCNzbFtyTrbDmIWwrLAiIEqgK2ZnCzz7EtTHDnlMZmXmFLTXAfXrY7Te3UNlmWEQMSbKG8JPC9g/8+meOm1EsMT4CtBbVqxZonFe6+robY2Bq4AMxbqEFMk62y7sTm2DS4GcFEI3bWKqk0bqj6TaE42i1QcEbPDShuD3T8Z5UuPOgw5i2nqWMOiJauob15KIajnx0fK7D/wBkvbfWqzEgIvZKJLxQo41T/D5/5lnENnmsg0rmbhkm5aO65CxFt59Yzkh88PkLLydHaY4LkQzCCURgQBft5N5IcLj7w8Nt+KX+SBbetTnWbCWKZsE2kakatL7PlJnkf2NHLjTb10Lu4gk8lg2zZKKcrlMpOTk7zy6nEe/O5+HviTKdrrJfiXFFBT0j+iePC7KTpX3Mym7uXU1tYSi8WQUuK6LrlcjtNnzvPIc/uReoR3b7BACIRpoGwTM2Es27Y+1fn1o4UjlwXQUm13x1JmCtMAQ4IpGegf5/EfL+KWW29lRdcyampqSCaTJJNJlFI4jkNDQwP19XXE4wke3vk4n/zQFOaFYSBcfqB4eGeGlT2beMf1PdTV1ZNOp0kmk0gpcRwHx3Gorw+vP/7sU1zVfJa2Ggm+BNMgljJTLdV2N1wBQCoh1tpxAyWjrtGAXQcNlnf3snbNShoaGkmn0/i+z/PPP082m2XDhg2kUimSySQ3Csljg/0cPvksG7qMedY24XAfuPHruPGG9bS3t5PJZIjFYhw4cIDp6Wl6e3svALJti6GRSXYdfIM7N/uhLlJixw1SCbEWeGRO54vMZNpyAZYM2UaAV1QMzHbQs3YVjY1NZDIZisUid9xxB1u3bmXz5s1s376deDxONpulra2NVd1rOdqfAVERQkJxtD/Dqu61tLW1kc1micfjbN++nc2bN7N161buuOMOisUimUyGxsYmetauYmC2A6+oQlIQAiwZ6lixLgZgiqqwooYyWwQZa6a5uYFEIoFhGOzdu5djx47R09NDV1cXO3bsoL+/H9u2SaVSLGhrZbqcDasykWjFdDnLgrZWUqkUtm3T39/Pjh076Orqoqenh2PHjrF3714MwyCRSNDc3ICMNTNbvHisME1R9WY0KtA65OFAgRZYtoVlWvO0ZRgsWbKElpYWgiBgamoKrTVaa6SU2LaNYZmXzAcBhmVi2zZSygu/b21tpaamBsMwGBoawjDmSdEyLSzbCg0RRDqFXa64ogdcXxcINDrwIXBJ2S62MUPBKaGUwvd9ent76e7uJpfLUSgU2LJlC21tbXieh1KKmdws9dk8GH44K0gPDJ/6bJ6Z3CxKKTzPo62tjS1btlAoFMjlcnR3d9Pb24vv+yilKDglbGOGlOWC70Y66VDHK3lgtqiGtBdA4IMXzistmdOcPTdIe1sjSilisRj33Xcfhw8fJp1Os3LlSlzXxfd9HKfI2bOnuLZjCHDnZ2KhWN4xxE/PnuLqdSuiMVnx4Q9/mJ6eHvL5POvWrcM0TcrlMr7vcfbcIC3pM9iiDB7g+2gvYLaohq7ogdFccNQrqZDDgwAcRe/i8xw/sZ/h4Qlc16VUKqG1ZuPGjSxfvpxisUi5XMZ1y/T1nUN7e1m9KBe63vBDUYrVC2fQ3l76+s7humXK5TLFYpHly5ezceNGtNaUSiVc12V4eILjJ/bT23kWnCDUxQ/wiorRXHD0ipX4ulYZW9Vi/7GdMSxkSCRpw4XqQV44kqGxvpl4zLwQBp7nEQQBruvy+usDvHzw+3zgpn1k0aFp5kSAoaBtwTDPvOQTj3WQySQA8Dzvggd9z2N0dIpn9+7mmkWPs0LOgCvQgUK4itKY6+w56mx/+oTff1kAMzm//IG1yfenqs1GpESgoahZEM8TVL/OC68UyM3EAIMgCCgUSvQPjHPw0Cuc73+U22/YzQLbAyXAEBH9RaIgbQS0tp3mhcMjDAzaaG2ilaZUKjM6NsNrR1/nv1/byYaFj3O9HIY84emGrxGuIjfqnXhgx8xD52dxrtS8y5/fXfuNFd3JP9UpC2GKMPtLClKKqeY4B6c7GJjupOw3IvBJxftZ2nyKdc0T2A5h3Fsisn60vdIho7oatMJNwOGROk4OL6FQakdjEjNHacueZn31eWqGS+BIiIU1SQcaUfA49qrz8MqvTn484ufL0qg6cKa0c3GLdWfcNEyUCDlYaRjX1IwWeG/tMWg8gZs0EQZYWoErYUhCQkI8MktUDEOziPlWuwz2jOIaMcI1C4bwpET7YBd8mAzgbPT7uAhbawTCV5TGPf/AmdLOSuUv207fv8958T3L4gfaqq3rUEb4UD/iYR8YAUZ8bCuAuISkhCoNqYtPHy6EzpXOhWY15DRW0YWSjuaJCq/5ev4+VzE55r18/z7nxUu3kZdeGMgz8dOT3re9SVdTDkIrBBFuHRUTGcV4pZUvKB5dmwshWRlOkeiKp1fuNTdi6rmBT0M5wJtw9UsnvX8ayDPxCwEA3L0z/+Rgv7cPJwjjVkXpIuTFChkVChjRlJWUkDIikZEY0XUJpqgAVgmQCIi8cKKNp6EYMDjg7bt7Z/7Jy+lqXvYAF8a/c8j5/L1VRk+qRVRjy9B4lQrbkcJmJJZgfMpn19NT+Co8cLgw8GtQgcaU8L4b0jQkZLhHdB9KhnVjrn3SUc64isKwN/OdQ87nB2H8lzpa3DMYnO9tkFZnRt4kYoYIrRwxjC1DiVVIxuCpZ2Z4ZscUpfGAiTdcxs/Py1i/y5HDBUhKuruTUI5CRYsKQqwIMU+hJj29p6/0+Y/sKf7b5Q9fr+CBudS5Zcfs1w4l5bIeW36IjBlZfA5EZL05LwRw4/uyBKaBrUOslStQ4Zjb+65MSAaWDD/VHJCoBVYh75MPeOV0+Xu37Jj9WtiX/Ipnox1xOp/+w8xD3V2J28lakDRC9kmIeevHBcQEVBmQteZzRETZqsV8LZjyIB/lVklDWYV1phh9LwYw7fFqX3HHbY/n7j1f4vTbOp2e8Znaebx88J1NRkNTSqyWCSOKXVkhUVhFlIcbKTOnXElBUUEhmKdHxTy7edF9ZUUw4XLoeOnR2x/L3f9GmVNv+3gdIBcw+fCR8k+vzkp3QYrVdsKIX0jAuSQ2KuhQinlKvRDXokLxqKZ4OgRbVOD4FIbK0/91uPSlm7+f/2wu4Oxb0e0tAZjD8Wife6Dk6J93JnRzxhIdRkwIHY17IeGIiqPGCsUrlXY1lDW6FIaLKAR4o64+fbL4woPPOZ+8Z3fhX4Gx3+RLPhNY/I3fT79/05r4H7W0WuvijbZJykDbMnx5Yc15Y/4tJSqqtuUAUQ7DqTTm+kOD3uFdR0r//vGd+aeAM1zmAPc39Zo1Diz+zHuS77i5O/7ehc3W1dXVRns8YyTMhBGyVGUz52r8YkApFxRnZoL+c8Peod2vlp791HPOjyPFS7+tF90WUNOapP32NYmlGxZaXZ2NxlXZpGyKWzIJUPKUM+2okdOjwYkD57y+HUeKJwcd+oGpKIV/+2/qK1qTGJCMPufqjB/2oTjRp/rdP0n8f1n/A3VREkUM7VaOAAAAAElFTkSuQmCC",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAMFBMVEUAAAA6OjpJSUl+fH1kZGQ7OztDQEGUlJSvr6/Jycnf4OD5+voNDAyNKUHLUX7ljLWr8GMyAAAAB3RSTlMATKH89SfweH7ONAAAAjVJREFUSMfdVuua6yAIrIriJel5/7ddGDCpabY9v5fdr1txJsCgZB+PP2khJrcY/gtPibmKMSf6zsgx1dY6rLWaYv6CJzb4kB+lMOVveAEfJpTPjLjijRE/1Cv5L3hhSB3hY4BxIdyGyLOCNUDXlYSYVcxiQikmnij6UkGnbduS/BVtTfDijSyUKJ4ZOaWXTa2M4TlFgRUQiKtpJ5qOQfpUsbSZsRDIFK/4AgKUkBL6KMCI6dNL0RAdRYiCJ0HOAMHV+7aRpjG64kkZveNxIkhzgqbeasxKQCbVIhQiKoiQQo4i4BQY4kh/SNo2BpeGGhgMZftWn3KZ/Nqgtc+EmhN6zQAcDYGcfVQ8ZhzCVsmn2uGoenjPlgdCw+rSt+U0KU/ECushralp3IXUNWjTCMuZskMkhDaq6r/ve8EHJGsgnBW4UK2zEDoYuxvwcu0Sa17LoVUG43aqsPsTthfG+dadC14ZnOw6C2MSgFeCbL5dikg0x0WahDSHB1G8m0cn4R/shXB3S7MNJPlNTyM8QdCDlu4mByZYA+Elgjjae8XePSUoR4pGgJ27eSr/VoKZ6yqqTs9dEZaR7FXJQNu8F/FUd77npFcWcJvbLMOebQH3+8CUAA6ui83lNYQG8Gfry8Ezn0vduISISMBTYeRhrxRdMr7Ft7cO4ETOcLyt+fI2ykUJuiuj6IC4g8whY+9MylCAl4NycejirMA3QsiPHCIgQEc4gm+/XFFbh+O9W24d+a/8Y/ED/GIohT5cOWcAAAAASUVORK5CYII=",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAMFBMVEUAAACIUzCbaUa7lnIoFQuiVStPKRQlEAZxOBrXwJ3szaXt3bbgrH6+ekvYmWjpvZHwHDXRAAAACXRSTlMAcMv8Iv6cW+M6g3MbAAABl0lEQVRIx82VyZLDMAhErQWtgP7/bwdh2Yljp4rcpnNxUv2KRkZk2/67nA8heOei0e9Dra1WYbwJcaH2hgTcA1iASLX3QQCjh2Qt0BsASxUTkLD13qUAY6VsBpiGtF2iGUBGpJJtkcTfkKmkaDpVX2cBgpRt/hj0VIvYbS/aBWkBIW/GuYgzUeMSzXM3Cwwu5kFdLSerX1tuPwCaqLEZ0JZ/AbSA9GwGtMAEziFyqm/vcCWSuchvl1vl3fdEJxD1ck9VGfWn++3noJ6Ao6oJ9TdhyH1pQQ5pAuJvp12rBPfYwgKWv6l7IZ9EpjfAY1vqx8OtRtaeFYgOa7urUnwCkLw8nhqqNiaA6X6q8z4XP3bvcu+ICC+HK4AGHixbbNykAOTrzttDIO4WHHhoxboC6QDGy3j4d0JW1XukxHXF3l2sn3cFuDSdeKWd5iXkA5IvBJcCsTAesfkmIvkHuC6TCMRPIlIzlM9dGAvQg2Caoaj9Y8JTgUeV5b7du5jTofJSSnl3P1ygeCq/9M38QVxk3FFbNG/k/6A/BEIh45FSjDMAAAAASUVORK5CYII=",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAMFBMVEUAAABxOQhvPAh+Dw6EVQqleRO5mxD69JLFnEC1HiDlLTLxUFH26y7WujE+BgX+/uR4R9mcAAAACXRSTlMAoU79+Pz+/vp0QkM4AAACUklEQVRIx8WW23biMAxF64tky9jJ///tnCOHECBkylO1VoEUbd1l8/Pz5xLil/qWvjEYkzWL1wYtxYN+u91auAJSa83C4+kGuXLhJm8thSw5zAcAFy6iuUozURXEz8+tfU47hgmAwAcAUyzEeK6eqEObLRkCS3cAAebwSkXGvRtNYB3HK977UMSY92QitXX0ftdvaUlp8T+XUUrpKncgZK0D6gBgcKHNZRd/qCv0VeMOCE2sa1leZYNNULaxAzFnIutap8a0n3OaD0jelgz/B0BQBhFLMwC+us9qxl4wc+19PBqY2SfZzCdo5VrKDLJ6ocxGH3IoaVaKE+iD1RVCfb4l9sR6l+OERPrQZF71PDWn+tBsDGqoPPUtIAd8BfNpQZE362tBbTZgvAFotGeYOAhetFLZzMx/ylMKMyYgGwD3kqViHDoa7EukxxpthYJMIOmcHK9sGQSsvwEB+roV3QEVpX4XrxuAlwn3ygrXwRIrhrDYC+RKoB3a/NQ8ujBkTYTAqL0CMPRZ384LKk1AlPFh3iHFARRL3vYtPwCWCYKRL3dgvJ8EMyYPaSZdvUqSTnPeYmISBMaoVeYAAjA7ydnXyGNqDqA8E8jYBjlJYRtA7v0GcKLK6oCepeDN5vyh1Yjo4MHOc54xoU1cLyahE5jbo2cnWXTAJlDvHgicO5gxEVgU+vUAfNDn6aEIOS2Cqm7A4Ap+Pu+xRyfA1Y3CAxlL+gDqtT6dEKg7IEv47725HIDxm1vXj/IJ1PDL2zkGATDqF5c6Dyr56kcAAot/82PlH7Q+I3mOsEDYAAAAAElFTkSuQmCC",
        "data:image/png;base64,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",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAABBPSURBVHjavJl5dFRVnscvyKJiS0OrPY7dx8Yeum3tdrCPy9jaPUyPtD1UAglKI4gChk0WE0BI0mwCouwiiBg2gRBkhySs2QgEslJJZU8qWyWp1F716tVe2T7zRyWBIJ6xaHrqnO95t+679/5+n/v73fvuqxKAuJPy8zJFfl6mKOhSbs7lIbnZ6aFKZdZBVVF2ebEqW12iyrlnKlZlq1WqbOWNgitf5FxPfyUv93Lfbtv5eZni+/wUPxQgJyfjbzfyrxyorCww1tWW0FB/71VbW0xZWW5Nfu7lrbk5GS/eE4C8nAyRm52xorpKidVch9PRjNetx+fR43PfQ3n0eNw6HPZGjIYaSktynLnZ6ZPy/1GA3Oz0NQ11xbidLXhcLbjkZhz2pn+aXA4tHpcOp9xMZXl+Z/b19JC7AsjJTh+Ucz1dUV2lxO3U4vwnO3673M4WZEmDqui6OTs7/V+CB7ieNq4gL/OM1VyHx6X7f3W+W163Hm1TBTnX0yKDBsjLST9eVpojuZzNuGRtkMYbb9EPafv96WSzabhRkJl1NwA1VRUFeN0/fPZleyNuh5Z2jyUgrwWPU4/b0YLXpe/dVtLQ6jbR4bV2TdCdQdwuPYXKLEfwALlptepqJX6v4QcDOGUtDnsLBqManaGaFn0VNqmRito8ahqU+FwGZCngKO0utLoKymvzsdk0uB0td1xnPreOQuVVx13sQhlqtbqwB0CWGnHJzfxfn5ScMzw6ZwhD5vyIwTMf5svkjVTV5rP1xGd4nHo8Di10+vBJJkauepX73hVcVZ4PdO704Xa09EAG1oGOwsIse9AAudmp6uqqG/i9Rhz2RjxOHRZLHR8fi2ZR/FxiEiJ7KTohkhUnY/jLxpH0mS8QHwr6zhdkl16i3e8hfJ2Cy8pkAGzmZl5b8xJioiD68HzanFY2n1nDxhOrsVkacDt1PWvI625BWZAZPED2tUvqqop8/F4jstRIm9uM1lBJv+l9ENMFfWYKxJRb9J4I1EcJfrx0EGKBIHTrX/DIRqCTJQfn89+f/hGttpY/rH4B8abg67StAKw9thwxRhC+IQSXTYvHqUOWNMiSBo9LR0FeRvAA165eVFeW5+Hz6LDbGpClRtxOHbVNRZzPO4rJXI3fY0RjKKdBX4rJrqG0OpvhH/+CPgv6cF9kX5KyD0O7n3avhZrGfJ5Y+BiPz3uE/rP7sTvlCwCmfDkZMV4QFT8br6zH7zYgSxrstgbstgbcTi15OWnBA1zNPKcuL83pAbDb6rvy18/f9y1E8ckbVNblB3K3TQZgx/mN9JktEB8Ipu56m06fB7/bgNPeDG0+Vh5fjJgimLBjLEgyU7dPRLwrWJ/8MXgdtHnNPY7fCpBzPeVeADQgWetp90uo629w33TBQxGDWH5wMV6XGdmo5enYXyJmCv5txZNoGovpaHUgWeuRbPV0tsqYjXWMWPUsgxY9wPDYYTwaOZSs0gsAuBxaJGs9dlv9vQG4nJ6kLi2+hs+j7zWgbKuHDh+fJS5HTBWISYKkrCOsORqDiBAMjX6Y1IKT0O7Bbm3ocqoBWWqAdi8p+acQcwVimuD3n/yW4rLsrv3Lh8Pe1NO+Wx6XlutXLwQPkJZ6Wl2iysLv1X8nrD6nDqdNy8ubR/AfG55n0/HViFmCHy0cRGbRuZ60slnrcEqN0O6CDg+0SuBzsDNlMw9G349YIBg0+36mbZ9EdlEK+JzQ7uy1BjyuFq5eORs8QGrKSXWx6moXQH3POrDb6pGsddDhoUlbRtTe2Qxd+DC//viX5Jakce7qCZbERfHNuR20eczUapTE7l3Ikl1RJKTsBqDDYePpVU8xYHEfBi7pi3hfMHTuj3h5+e9ZemAhJmMNblkbWHeuFq5kJgcPkHLphFpVdAW/V49kretx3GapxWlvBOB6YSqDox5CzBF8dGQuV0svMjz2F4hxgtc/+RN0wNXy84iJAvGuYMSKZ8mqymJfynYeixnKoJgBDIjuQ9/FArEgsBWvPbKMdo8F2aZBstbhcbWQeTkpeIAL54+qi5SZtPr02K0B5yVbPa1uA7R72Za4jgdnDODnMY/z3KqnGbb4ZzwyZzAPfTQQESVQfD4K2iCr6gJilmDw8gcQ8wVibGDdPBR9Pw/FDmTEJ8/w3OrfIOYJHls2BJ2xilaXEbu1Hru1Dq9bR0bameABziYfVisLMmj1Gboi0ECb20iTtoxJ29+if0R/NpxdicVYR2WNktqGQtQ1N3hhw3OImYLQz9+AVrhWdRExW3Dfgr68se0/yaq/wq6MLTyydDAiSjB912SaNRVE7JnM40seoaIhF59Dh91ah2Stx+vWkZZyMniA5KQEtbIgnVafAbu1HrdDS0nldf62fizPRP+a9IJE8PvA74Y2B+CHVh+vbX4ZEXETIEedipglGLCwDzuSNgGgaSzhsdghiEjBu1+PB78XXGYybiRSWZ+H096I3VqHvQsg9dKJ4AGSEuPVN/LTaPObeh7rBWVpXFGew6Sr5e8JC/nz8j/x3ucTqK9Xgd+BzaDhpXXPI2Z0Afg7SC9JRMwUDIoeSH5ZBrR7yCvL4NGYHyOiBGM+/yv4vF1baTsuuRnJUtuVQvV4PXpSLh4LHiDx1H51Qe4lWj06JEsNkqUGn7MF2hx4JQPDlw1DTBaIWYJfL3mK3y/7Hb9d+it+Ej0Y8aFgzBd/BZeX+Iw4xFTB33aOxe8wgtdGdmkqQ6MfZsCSvjy2ZAh/XvdHRq55lfe/mkRTSykeuRnJrEYyq/E4m7l4/tvgAc6c/Eadn3OBVrcWyVzdJTV+l57GhhJ+t/ppRKTgmdXDmbd3Ogv2z2HunggGxzyAmCZ4feN/guxC8cUo+s/rR2n1NfDJtLmMKCsu0/fDwJFDfCACu1SoYMTff4tk0XQBVAUAHBounDscPMCJY3vVudfP0+pp6ZkNyaymw2umojqX4SuGIWYLxm1XgFMGOsDjYPGReYz6bCQbT6/iy+QNiFmCo9f2QIcfl9yM19mCzVLLuuQVRB6ZweLjc1lych4zE95j7fFYbOY6nLaGHnteZyNnkw4FD3DsyC51zrWztN0GgM9KbnEaP499HDFbMGbr/+C26Gj3WbCYa2jSlGE01ZOrSmXqtolczD8BnZ10uCy0OU20OU3Q6sKub+Ts5aOkXjvN6fQE6muLwCtjM6t7oh0AaCLpzMG7ADgad2eAVpnzOccYsjDwAAvfqgCnG4DPz67lkYif8ETkv7L06CK2Ja1nRUI0sfELmBH3Hh/sfp8P9rzPwv1zCNk8ivvnDOTBeQPp934/4lO+Blp72boJcCB4gCMJO9XZWcm0e3W9AdpcHL+6n/uj+jPgo/v4xbKfMfHLN4n8ZiYj1jzbc1CLPbGAdUeX8eDsB3h88aP8dd2feWXl87y66kVeW/0yT8Y+wYDFfRBRgp9GP0K+Kp1Oj7HX7EtmNT5nE2dOfRM8QMLBHeprV5Jo9+pvDmiqBjpYm7QUMUMwMLYvT634OSNXv8LI1a8yfPmT3B/bDzFXMOdQBLTDlymfEbL1DfB4cVq0yMY62iQTHx+LQSwMvHq+uulF/HZjV+7fDtDMqeN7gweIP7BdnZV5hjavFpupvEsVAHx4eAZifOB8Myt+CvjbAViVvAQxSyDmCmbtnwqA2VjNi8tHkFp0qusgpwWfnSk7JyIiBSJSsO3sevBJ2IyVPXa6bXqdjZw8tjt4gH37Nqsz04/R6qnHaizFaizFZirD5zQSf3knk796i3d2vMmp3P3Q5gJgdXIMYkY3wBRwSdDuZemRSJ5a9CQtzeXQ6UFdV8DPon+KiBQ8/+mztDSX4pU0XXZKeuxZjaV4HGqOfrsjeIBv9m1RZ6Yfp9XT0GtAi6EEl6UWZD2ddi0eay02Qwl0trLi1Ec3AQ5MAdmE39WEuaWSn0QOZnj0MAy6OlYkLA6cj6IEydmHwWO9o/MBgBqOfvvVXURg7+YeAIuhBIuhBKuxDKuxBMlUhsNSicNSiWQqw2Iohg43K08v7g3gMCOby8Gl53jWXkSE4FcfDePRhUPoP68f2y5+GjhBePTIlso7QngdtRw5fBcR2B23Xp2WchifqxazXoVZr8JqLL2lXNJTNutVgJc1SbEBgDmCqfsmgWxENpfjleqAzsBL/XSBiBI8GjuYWXumcubKIdTV+bitWvBZcNmqMetVXRNWgsdRw6GDXwQPsCtunTrl4iH87loshmIshuKugbvLRZj1Kky6Qty2agCWfDs/4OBMwaqTseCXwG9GttSz4+wmXvv0ZcZvH8sza4cH3g2mCfrP6MtvYobz0srneXXlC5y8HIfXXotJV4TFUIzTXsmhg1uDB9i5Y6360vl4/K6aXjPdLZOuCNlSDj49+JwkXj7Ewx8+hJguUGx7HY/UBB1ekrLjGbVmJH+IeYGDl7bSKbeQV3KRUVv+C/GhuKnpgicXPUFl1RXctmqMLUrMehUuezUH9m2+O4CUC/H4XDWYdIXfkd1Uirr2GgmpOwnZOArxnmBYzJN8dWEDOKyUVGQxYUsYL8Q8x6fHliDpymmXG5BNZbTLGmRjLV+cXc2zq34TAJgjWJ+4EhwGrAYVJp0Sk64Ql1TJgW/uBuCrterUi4fuCCCZSshRnePwpTj2JG5i/u4ItpxdjVaTT31NARE73+H1VX9i/bFYmhvzwGNAMpdibFFibFFiaLmBbC4FRwuaulziLmzi31c9y/x9U3GZqrB2paZJV4jbXsXB/VuCB/h8y/LaxNN7cMtVmPVFvQDM+iIaNTk0anJwmivwW+vosGtot9eRrzrPsbSvKao4D44mvDb1HSMYSJEifDY1nVIjTZpcrhUmomsu6LFn1hciW8vZFbcu+J/XVyyPqtmzeyOSuQTJVIJJV4hBq+wJrUWvwmpQYdYXYTGosHQbNZTitFQim8t6gQf6Bq49kdAqMesDEyKbyrCZKjDpbvaRzGU0N+Swdm20HDTA5MlvH1+4YLZUV30Vt70Kg/ZGz8wFnCjEoL2BWX+bc7c5+n3l7nFulbnrfveYPmcN166cYNq0d4L/i2n0aMW4cePCEhPit+KwlWEzlXzHcPf3253rBrp5v7BXm1vv3R6h7v4ueyXGlgI++zSWkJCQqKABQkPHDAoJCR0TEfEOyYm7cdkrkK2BtDDrirAaVViNge008EwowtRV3122GLqvql73u+u6+96sC5RdUgVmvZK9ezYwYcKbltCQMY8HDRAeHi7CwsJFSOiYTyIi3mHfno1UVmQgmUuwmQKSTCWBNXKbbKZirMbim3Wm3nVWYzGSKXC1mYp7jWkxFpGfl8zmjcuYNGl8Z2jo2NCwsHBxVwDh4eFi7NgwERISunL8+HEsWjSb7dvWcDhhJ6dOxHH6ZBynTnxXp7v0fXWnb6s7fTKOE8d3EX/wSzZtXM6cOdMICxvrCg0NfScsLEyEh/8DAN2RUChCJigUIQfGjQs3vf32W0yc+BZvv33vNHHiW0yY8Cbh4WE1o0crtoaGjnnpVh/+IYDw8HAREhI6VKEIDVWEhMQrFKPLRytGq0ePvndSKEarFYrRhSEhodsUitBXxowZe98PAfjfAQAV6YblMSIK5AAAAABJRU5ErkJggg==",
        "data:image/png;base64,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",
      ],
      message: "",
      messageList: [],
    };
  },
  watch: {
    "$route.path": function (newVal, oldVal) {
      /* 这里是需要执行的函数 */
      location.reload();
    },
    searchBoxShow() {
      this.searchInput = "";
      this.searchList = [];
      this.searchPage = 1;
      this.searchState = false;
    },
    messageList() {
      setTimeout(() => {
        var element = document.getElementById("messageHistory");
        element.scrollTop = element.scrollHeight;
      }, 50);
      if (this.messageList[this.messageList.length - 1].type == "system") {
        this.rushMusicQueue();
      }
    },
    roomListShow() {
      this.searchRoom = "";
    },
    musicLrc(newData, oldData) {
      if (this.ws1 !== null) {
        this.ws1.send(newData);
      }
    },
    searchRoom(newData, oldData) {
      this.searchRoom = newData.replace(/[^0-9]/gi, "");
    },
    roomInfo: {
      handler(n, o) {
        if (JSON.stringify(this.roomInfo) == JSON.stringify(this.oldroomInfo)) {
          this.roomInfoChanged = true;
        } else {
          this.roomInfoChanged = false;
        }
      },
      deep: true,
    },
    myInfo: {
      handler(n, o) {
        if (
          JSON.stringify(this.myInfo) == JSON.stringify(this.oldmyInfo) &&
          this.userPassword === ""
        ) {
          this.myInfoChanged = true;
        } else {
          this.myInfoChanged = false;
        }
      },
      deep: true,
    },
    userPassword() {
      if (
        JSON.stringify(this.myInfo) == JSON.stringify(this.oldmyInfo) &&
        this.userPassword === ""
      ) {
        this.myInfoChanged = true;
      } else {
        this.myInfoChanged = false;
      }
    },
  },
  methods: {
    showRoomName() {
      return window.screen.width > 500;
    },
    multiavatar(value) {
      if (value) {
        return multiavatar(value, false);
      } else {
        return "<img src='/img/defaultPhoto.jpeg' style='border-radius: 50%;'>";
      }
    },
    userHead(name, head) {
      if (head) {
        return `<img src='${head}' style='border-radius: 50%;'>`;
      } else {
        return this.multiavatar(name);
      }
    },
    gotoMyRoom() {
      this.closeBox();
      if (this.myInfo.roomID === this.roomID) {
        this.$alert("当前已在您的房间中，请勿重复进入！", "提示", {
          confirmButtonText: "确定",
          type: "info",
          callback: (action) => {},
        });
      } else {
        if (this.myInfo.roomID) {
          this.$confirm("确认离开当前房间吗?", "提示", {
            confirmButtonText: "这就离开",
            cancelButtonText: "再待一会",
            type: "warning",
          })
            .then(() => {
              this.$router.push(`/musicRoom/${this.myInfo.roomID}`);
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作",
              });
            });
        } else {
          this.$alert(
            "您还没有自己的音乐房间，点击确定将自动创建您的专属音乐房间！",
            "提示",
            {
              confirmButtonText: "确定",
              type: "info",
              callback: (action) => {
                if (action == "confirm") {
                  createMyRoom({
                    uid: this.myInfo.user_id,
                    name: this.myInfo.user_name,
                  })
                    .then((data) => {
                      if (data.data.code == 0) {
                        this.$confirm("确认离开当前房间吗?", "提示", {
                          confirmButtonText: "这就离开",
                          cancelButtonText: "再待一会",
                          type: "warning",
                        })
                          .then(() => {
                            this.$router.push(
                              `/musicRoom/${data.data.data.roomID}`
                            );
                          })
                          .catch(() => {
                            this.$message({
                              type: "info",
                              message: "已取消操作",
                            });
                          });
                      }
                      // this.$router.push(`/musicRoom/${this.myInfo.roomID}`);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  this.$message("已取消创建房间");
                }
              },
            }
          );
        }
      }
    },
    showLrc() {
      if (this.ws1 !== null) {
        this.ws1.send("OpenDesktopLrc");
      }
    },
    getTime(a, b) {
      return getTime(a, b);
    },
    initWebSocket(uuid) {
      let that = this;
      let host = window.location.host.split(":")[0]; //主机
      that.ws = new WebSocket(
        `ws://${host}:8888/?uuid=${uuid}&account=10000&channel=${this.roomID}&ticket=123456`
      );
      // var ws = new WebSocket("ws://localhost:8096/websocket/111405");
      that.ws.onopen = (e) => {
        // console.log("连接成功!");
        // console.log(that.ws.key);
      };
      that.ws.onmessage = function (res) {
        // console.log(res);
        var data = JSON.parse(res.data);
        // console.log(data);
        if (data.type == "rushKey") {
          that.wsKey = data.key;
          getUserAddress()
            .then((data) => {
              let addr = data.data.addr;
              let message = {
                type: "come",
                uid: that.myInfo.user_id,
                username: that.myInfo.user_name,
                addr: addr,
                room: that.roomID,
                head: that.myInfo.user_head,
                key: that.wsKey,
              };
              that.ws.send(JSON.stringify(message));
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (data.type == "come") {
          that.onlineObj["U" + data.uid] = {
            username: data.username,
            addr: data.addr,
            head: "",
          };
          that.Alluser["U" + data.uid] = {
            username: data.username,
            head: "",
          };
          that.getAlluser();
          that.onLineNum = data.onLineNum;
          that.onLineUser = data.onLineList;
          // console.log(arr)
          that.messageList.push({
            type: "system",
            content: `来自 ${data.addr} 的 ${data.username} 进入了房间`,
          });
        } else if (data.type == "getMusicInfo") {
          let music = document.querySelector("#music");
          let currentTime = music.currentTime;
          let duration = that.allBarTime;
          let src = music.src;
          let musicrid = that.nowMusicInfo.musicrid;
          let a = that.getMessage();
          let message = {
            type: "setMusicInfo",
            duration,
            currentTime,
            src,
            nowMusicName: that.nowMusicInfo.musicName,
            musicrid,
            message: a,
            timestamp: data.timestamp,
          };
          that.ws.send(JSON.stringify(message));
        } else if (data.type == "setMusicInfo") {
          that.nowMusicInfo.src = data.src;
          that.messageList.push({
            type: "system",
            content: data.message,
          });
          that.nowMusicInfo.musicrid = data.musicrid;
          that.getMusicLrc(data.musicrid);
          that.getMusicInfo(data.musicrid);
          that.nowMusicInfo.musicName = data.nowMusicName;
          that.allBarTime = data.duration;
          document.querySelector("#music").src = that.nowMusicInfo.src;
          let t;
          if (that.isMobileDevice() || that.isMobilePhone() || that.isIOS()) {
            t = data.currentTime * 1 + 2;
          } else {
            t = data.currentTime * 1 + 1.2;
          }
          that.canPlay = true;
          setTimeout(() => {
            if (that.canPlay) {
              document.querySelector("#music").play();
              document.querySelector("#music").currentTime = t;
            }
          }, 1000);
        } else if (data.type == "offline") {
          that.messageList.push({
            type: "system",
            content: data.msg,
          });
          delete that.onlineObj["U" + data.uid];
          that.onLineNum = data.onLineNum;
          that.onLineUser = data.onLineList;
        } else if (data.type == "system-nextmusic") {
          that.messageList.push({
            type: "system",
            content: data.content,
          });
          that.getOneMusic();
        } else if (data.type == "system-lovemusic") {
          that.messageList.push({
            type: "system",
            content: data.content,
          });
        } else if (data.type == "system-addmusiclist") {
          that.messageList.push({
            type: "system",
            content: data.content,
          });
          that.rushMusicQueue();
        } else if (data.type == "system-upToTop") {
          that.messageList.push({
            type: "system",
            content: data.content,
          });
        } else if (data.type == "newMusic") {
          that.replaceMusic(data);
        } else if (data.type == "system-notice") {
          that.messageList.push({
            type: "notice",
            content: data.content,
          });
        } else {
          that.messageList.push(data);
        }
      };
      that.ws.onclose = function (e) {
        // console.log("连接已关闭...正在重连...");
        setTimeout(() => {
          that.initWebSocket(uuid);
        }, 5000);
      };
      that.ws.onerror = function (e) {
        // console.log("WebSocket发生错误: " + e);
        setTimeout(() => {
          that.initWebSocket(uuid);
        }, 5000);
      };
    },
    initWebSocket1() {
      let that = this;
      that.ws1 = new WebSocket(`ws://127.0.0.1:1234`);
      // var ws = new WebSocket("ws://localhost:8096/websocket/111405");
      that.ws1.onopen = (e) => {
        // console.log("连接成功!");
        // console.log(that.ws.key);
      };
      that.ws1.onmessage = function (data) {
        // console.log(data);
      };
      that.ws1.onclose = function (e) {
        // console.log("连接已关闭...正在重连...");
        that.initWebSocket1();
      };
      that.ws1.onerror = function (e) {
        // console.log("WebSocket发生错误: " + e);
        that.initWebSocket1();
      };
    },
    shellroom() {
      let copyData = `${this.roomInfo.roomName} 正在播放 ${this.nowMusicInfo.musicName}，快来收听吧！传送门：${window.location.href}`;
      this.$copyText(copyData).then((e) => {
        this.$message({
          type: "success",
          message: "分享链接已复制到剪贴板!",
        });
      });
    },
    gotoSun0623() {
      window.open("https://www.sun0623.top", "_blank");
    },
    getMessage() {
      let reg = /^正在播放/;
      for (let i = this.messageList.length - 1; i > 0; i--) {
        if (
          this.messageList[i].type == "system" &&
          reg.test(this.messageList[i].content)
        ) {
          return this.messageList[i].content;
        }
      }
    },
    getMusicInfo(rid) {
      getMusicInfo({ musicrid: rid }).then((data) => {
        this.nowMusicInfo.album = data.data.data.album;
        this.nowMusicInfo.artist = data.data.data.artist;
        this.nowMusicInfo.name = data.data.data.name;
        this.nowMusicInfo.pic120 = data.data.data.pic120;
      });
    },
    getObjKeysNum(obj) {
      return Object.keys(obj).length;
    },
    gotoRoom(ID) {
      this.closeBox();
      if (ID) {
        if (ID != this.roomID) {
          this.$confirm("确认离开当前房间吗?", "提示", {
            confirmButtonText: "这就离开",
            cancelButtonText: "再待一会",
            type: "warning",
          })
            .then(() => {
              this.$router.push(`/musicRoom/${ID}`);
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作",
              });
            });
        } else {
          this.$alert("当前已在您的房间中，请勿重复进入！", "提示", {
            confirmButtonText: "确定",
            type: "info",
            callback: (action) => {},
          });
        }
      } else {
        if (this.searchRoom !== "") {
          if (this.searchRoom != this.roomID) {
            this.$confirm("确认离开当前房间吗?", "提示", {
              confirmButtonText: "这就离开",
              cancelButtonText: "再待一会",
              type: "warning",
            })
              .then(() => {
                this.$router.push(`/musicRoom/${this.searchRoom}`);
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消操作",
                });
              });
          } else {
            this.$alert("当前已在您的房间中，请勿重复进入！", "提示", {
              confirmButtonText: "确定",
              type: "info",
              callback: (action) => {},
            });
          }
        }
      }
    },
    clickEmoji(i) {
      this.message += `[emoji${i + 1}]`;
    },
    getUserHead(uid) {
      if (uid) {
        if (this.Alluser["U" + uid]) {
          return this.Alluser["U" + uid].head;
        } else {
          this.getAlluser();
        }
      } else {
        return "/img/defaultPhoto.jpeg";
      }
    },
    searchMusic(key, page) {
      this.searchState = true;
      searchMusic({ key, page })
        .then((data) => {
          // console.log(data);
          data.data.forEach((item) => {
            item.name = item.name
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");
            item.artist = item.artist
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");
            item.album = item.album
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");

            this.searchList.push(item);
          });
          this.searchState = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    searchHandle() {
      // searchPage
      // searchStation
      this.searchPage = 1;
      this.searchList = [];
      this.searchMusic(this.searchInput, this.searchPage);
    },
    searchWyy() {
      if (/^[0-9]*$/.test(this.searchInput)) {
      } else {
        this.$message({
          message: "请输入网易云音乐ID！！",
          type: "warning",
        });
      }
    },
    searchload() {
      if (this.searchState == false) {
        this.searchPage++;
        this.searchMusic(this.searchInput, this.searchPage);
      }
    },
    isApp() {
      //判断当前设备是否为移动端
      const ua = navigator.userAgent.toLowerCase();
      return /mozilla\/1.0/.test(ua);
    },
    isMobileDevice() {
      //判断当前设备是否为移动端
      const ua = navigator.userAgent.toLowerCase();
      const t1 =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          ua
        );
      const t2 = !ua.match("iphone") && navigator.maxTouchPoints > 1;
      let r = t1 || t2;
      return r;
    },
    isMobilePhone() {
      //判断当前设备是手机
      const ua = navigator.userAgent.toLowerCase();
      const t1 =
        /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
      // const t2 = !ua.match("iphone") && navigator.maxTouchPoints > 1;
      return t1;
    },
    isIOS() {
      // const ua = navigator.userAgent;
      // return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      var u = window.navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
      return isAndroid;
    },
    getContent(content) {
      // console.log("333333");
      let reg = /\[emoji[0-9]{1,3}\]/gm;
      let arr = content.match(reg);
      if (arr) {
        var newArr = [...new Set(arr)];
        newArr.forEach((item) => {
          let num = item.replace("emoji", "").replace(/\[|\]/g, "");
          let reg1 = new RegExp(`${item.replace(/\[|\]/g, "")}`, "g");
          let img = `<img src="${
            this.emojiList[num - 1]
          }" style="vertical-align: text-bottom;height:30px;width:30px;">`;
          content = content.replace(reg1, img).replace(/\[|\]/g, "");
        });
        return content;
      } else {
        return content;
      }
    },
    setTimeTimer() {
      var that = this;
      that.timer1 = setInterval(function () {
        that.nowTime = getTime("YYYY-MM-DD hh:mm:ss");
      }, 1000);
    },
    nextMusic(b) {
      if (b) {
        this.$message({
          message: "不喜欢表态成功，已切歌~~",
          type: "success",
        });
      }
      this.allLrc = [
        {
          lineLyric: "歌词读取中。。。。。。",
          time: "0.0",
        },
      ];
      this.musicLrc = "歌词读取中。。。。。。";
      this.ws.send(
        JSON.stringify({
          type: "system-nextmusic",
          content: `${this.myInfo.user_name} 切掉了 ${this.nowMusicInfo.musicName}`,
        })
      );
      // this.messageList.push();
      // this.getOneMusic();
    },
    dontlike() {
      if (this.nowMusicInfo.musicrid !== 0) {
        let info = {
          room: this.roomID,
          pic120: this.nowMusicInfo.pic120,
          name: this.nowMusicInfo.name,
          artist: this.nowMusicInfo.artist,
          album: this.nowMusicInfo.album,
          musicrid: this.nowMusicInfo.musicrid,
        };
        addToBlickList(info)
          .then((data) => {
            this.$message({
              message: "这首歌太难听了，已加入歌曲黑名单！！",
              type: "success",
            });
            this.nextMusic(false);
            this.rushDontlike();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$message({
          message: "下一首歌您才有权限拉黑哦！！",
          type: "success",
        });
      }
    },
    rushDontlike() {
      getDontlikeList({ room: this.roomID })
        .then((data) => {
          data.data.data.forEach((item) => {
            item.name = item.name
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");
            item.artist = item.artist
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");
            item.album = item.album
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");
          });
          this.dontlikeList = data.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteBlackList(item) {
      deleteBlackList({ ID: item.ID })
        .then((data) => {
          this.$message({
            message: "已从黑名单中删除~",
            type: "success",
          });
          this.rushDontlike();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loveMusic() {
      let info = {
        pic120: this.nowMusicInfo.pic120,
        name: this.nowMusicInfo.name,
        artist: this.nowMusicInfo.artist,
        album: this.nowMusicInfo.album,
        musicrid: this.nowMusicInfo.musicrid,
        songTimeMinutes: this.nowMusicInfo.songTimeMinutes,
        userID: this.myInfo.user_id,
      };
      addToFavorites(info)
        .then((data) => {
          if (data.data.code == 0) {
            this.$message({
              message: "好喜欢这首歌，已收藏到我的歌单~~",
              type: "success",
            });
            this.ws.send(
              JSON.stringify({
                type: "system-lovemusic",
                content: `${this.myInfo.user_name} 将 ${this.nowMusicInfo.musicName} 收入了Ta的歌单`,
              })
            );
          } else if (data.data.code == 1) {
            this.$message({
              message: "已收藏过这首歌，请勿重复收藏！",
              type: "warning",
            });
          }
          this.reshFavoritesList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getOneMusic() {
      this.barTime = 0;
      clearInterval(this.getMusicTimer);
      if (this.musicQueue.length == 0) {
        this.ws.send(
          JSON.stringify({
            type: "musicFinish",
            roomID: this.roomID,
            key: this.wsKey,
          })
        );
        // getOneMusic({ roomID: this.roomID }).then((data) => {
        //   console.log(data.data.data);
        //   this.messageList.push({
        //     type: "system",
        //     content: `正在播放 ${this.getUserName(
        //       data.data.data.userID
        //     )} 点的 ${(data.data.data.name + "(" + data.data.data.artist + ")")
        //       .replace(new RegExp("&amp;", "ig"), "&")
        //       .replace(new RegExp("&nbsp;", "ig"), " ")}`,
        //   });
        //   this.nowMusicInfo.musicrid = data.data.data.musicrid;
        //   this.getMusicLrc(data.data.data.musicrid);
        //   this.nowMusicInfo.src = data.data.data.url;
        //   this.nowMusicInfo.musicName = (
        //     data.data.data.name +
        //     " - " +
        //     data.data.data.artist
        //   )
        //     .replace(new RegExp("&amp;", "ig"), "&")
        //     .replace(new RegExp("&nbsp;", "ig"), " ");
        //     this.nowMusicInfo.pic120 = data.data.data.pic120
        //     this.nowMusicInfo.name = data.data.data.name
        //     this.nowMusicInfo.artist = data.data.data.artist
        //     this.nowMusicInfo.album = data.data.data.album
        //     this.nowMusicInfo.musicrid = data.data.data.musicrid
        //     this.nowMusicInfo.songTimeMinutes = data.data.data.songTimeMinutes
        //   this.allBarTime = this.toSecond(data.data.data.songTimeMinutes);
        //   setTimeout(() => {
        //     if (this.canPlay) {
        //       document.querySelector("#music").play();
        //     }
        //   }, 1000);
        // });
      } else {
        this.messageList.push({
          type: "system",
          content: `正在播放 ${this.getUserName(
            this.musicQueue[0].userID
          )} 点的 ${(
            this.musicQueue[0].name +
            "(" +
            this.musicQueue[0].artist +
            ")"
          )
            .replace(new RegExp("&amp;", "ig"), "&")
            .replace(new RegExp("&nbsp;", "ig"), " ")
            .replace(new RegExp("&apos;", "ig"), "'")}`,
        });
        this.nowMusicInfo.musicrid = this.musicQueue[0].musicrid;
        this.getMusicLrc(this.musicQueue[0].musicrid);
        this.nowMusicInfo.src =
          "/song/getMusicUrl?musicrid=" + this.musicQueue[0].musicrid;
        this.nowMusicInfo.musicName = (
          this.musicQueue[0].name +
          " - " +
          this.musicQueue[0].artist
        )
          .replace(new RegExp("&amp;", "ig"), "&")
          .replace(new RegExp("&nbsp;", "ig"), " ")
          .replace(new RegExp("&apos;", "ig"), "'");
        this.nowMusicInfo.pic120 = this.musicQueue[0].pic120;
        this.nowMusicInfo.name = this.musicQueue[0].name;
        this.nowMusicInfo.artist = this.musicQueue[0].artist;
        this.nowMusicInfo.album = this.musicQueue[0].album;
        this.nowMusicInfo.musicrid = this.musicQueue[0].musicrid;
        this.nowMusicInfo.songTimeMinutes = this.musicQueue[0].songTimeMinutes;
        this.allBarTime = this.toSecond(this.musicQueue[0].songTimeMinutes);
        this.deleteMusic("play", this.musicQueue[0]);
        setTimeout(() => {
          if (this.canPlay) {
            document.querySelector("#music").play();
            if (this.isMobileDevice() || this.isMobilePhone() || this.isIOS()) {
              document.querySelector("#music").currentTime += 1;
            }
          }
        }, 1000);
      }
    },
    replaceMusic(data) {
      this.allLrc = [
        {
          lineLyric: "歌词读取中。。。。。。",
          time: "0.0",
        },
      ];
      this.musicLrc = "歌词读取中。。。。。。";
      this.messageList.push({
        type: "system",
        content: `正在播放 ${this.getUserName(data.userID)} 点的 ${(
          data.name +
          "(" +
          data.artist +
          ")"
        )
          .replace(new RegExp("&amp;", "ig"), "&")
          .replace(new RegExp("&nbsp;", "ig"), " ")
          .replace(new RegExp("&apos;", "ig"), "'")}`,
      });
      this.nowMusicInfo.musicrid = data.musicrid;
      this.getMusicLrc(data.musicrid);
      this.nowMusicInfo.src = data.url;
      this.nowMusicInfo.musicName = (data.name + " - " + data.artist)
        .replace(new RegExp("&amp;", "ig"), "&")
        .replace(new RegExp("&nbsp;", "ig"), " ")
        .replace(new RegExp("&apos;", "ig"), "'");
      this.nowMusicInfo.pic120 = data.pic120;
      this.nowMusicInfo.name = data.name;
      this.nowMusicInfo.artist = data.artist;
      this.nowMusicInfo.album = data.album;
      this.nowMusicInfo.musicrid = data.musicrid;
      this.nowMusicInfo.songTimeMinutes = data.songTimeMinutes;
      this.allBarTime = this.toSecond(data.songTimeMinutes);
      setTimeout(() => {
        if (this.canPlay) {
          document.querySelector("#music").play();
        }
      }, 1000);
    },
    getMusicQueue(roomID) {
      getMusicQueue({ roomID })
        .then((data) => {
          // console.log(data);
          data.data.data.forEach((item) => {
            item.name = item.name
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");
            item.artist = item.artist
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");
            item.album = item.album
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");
          });
          this.musicQueue = data.data.data;
          // this.getOneMusic();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    rushMusicQueue() {
      getMusicQueue({ roomID: this.roomID })
        .then((data) => {
          data.data.data.forEach((item) => {
            item.name = item.name
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");
            item.artist = item.artist
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");
            item.album = item.album
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");
          });
          this.musicQueue = data.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    reshFavoritesList() {
      getFavoritesList({ userID: this.myInfo.user_id })
        .then((data) => {
          data.data.data.forEach((item) => {
            item.name = item.name
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");
            item.artist = item.artist
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");
            item.album = item.album
              .replace(new RegExp("&amp;", "ig"), "&")
              .replace(new RegExp("&nbsp;", "ig"), " ")
              .replace(new RegExp("&apos;", "ig"), "'");
          });
          this.FavoritesList = data.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUserName(uid) {
      if (uid) {
        if (this.Alluser["U" + uid]) {
          return this.Alluser["U" + uid].username;
        } else {
          this.getAlluser();
        }
      } else {
        return "SunBUG点歌机器人";
      }
      if (this.Alluser["U" + uid]) {
        return this.Alluser["U" + uid].head;
      } else {
        this.getAlluser();
      }
    },
    getAlluser() {
      getAlluser()
        .then((data) => {
          data.data.data.forEach((item) => {
            this.Alluser["U" + item.UID] = {
              username: item.username,
              head: item.head,
            };
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMusicLrc(mid) {
      this.allLrc = [
        {
          lineLyric: "歌词读取中。。。。。。",
          time: "0.0",
        },
      ];
      this.musicLrc = "歌词读取中。。。。。。";
      getMusicLrc({ musicrid: mid })
        .then((data) => {
          this.allLrc = data.data.lrc;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    musicFinish() {
      clearInterval(this.getMusicTimer);
      setTimeout(() => {
        this.getOneMusic();
      }, 500);
    },
    addToMusicList(item) {
      let musicinfo = {
        pic120: item.pic120,
        name: item.name,
        artist: item.artist,
        album: item.album,
        musicrid: item.rid ? item.rid : item.musicrid,
        roomID: this.roomID,
        user: this.myInfo.user_id,
        songTimeMinutes: item.songTimeMinutes,
      };
      addToMusicList(musicinfo)
        .then((data) => {
          this.ws.send(
            JSON.stringify({
              type: "system-addmusiclist",
              content: `${this.myInfo.user_name} 点了一首 ${item.name}(${item.artist})`,
            })
          );
          this.rushMusicQueue();
          this.$message({
            message: "点歌成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
        });
      let info = {
        pic120: item.pic120,
        name: item.name,
        artist: item.artist,
        album: item.album,
        musicrid: item.rid,
        songTimeMinutes: item.songTimeMinutes,
        userID: this.myInfo.user_id,
      };
      addToFavorites(info)
        .then((data) => {
          this.reshFavoritesList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addToMyLove(item) {
      let info = {
        pic120: item.pic120,
        name: item.name,
        artist: item.artist,
        album: item.album,
        musicrid: item.rid,
        songTimeMinutes: item.songTimeMinutes,
        userID: this.myInfo.user_id,
      };
      addToFavorites(info)
        .then((data) => {
          this.$message({
            message: "已收藏至我的歌单",
            type: "success",
          });
          this.reshFavoritesList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    upToTop(index, item) {
      let arr = this.musicQueue;
      if (index != 0) {
        upToTop({ ID: item.ID, time: arr[0].updateTime })
          .then((data) => {
            this.messageList.push({
              type: "system",
              content: `您将 ${item.name}(${item.artist}) 置顶了`,
            });
            this.ws.send(
              JSON.stringify({
                type: "system-upToTop",
                content: `${this.myInfo.user_name} 将 ${item.name}(${item.artist}) 置顶了`,
                index: index,
                key: this.wsKey,
              })
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    deleteMusic(type, item, i) {
      deleteMusic({ type, ID: item.ID })
        .then((data) => {
          this.rushMusicQueue();
        })
        .catch((err) => {
          console.log(err);
        });
      // console.log(item);
    },
    deleteFavoriteMusic(item) {
      deleteFavoriteMusic({ ID: item.ID })
        .then((data) => {
          this.$message({
            message: "已从我的收藏中删除~",
            type: "success",
          });
          this.reshFavoritesList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    timeUpdate(time) {
      //遍历所有歌词，看哪句歌词的时间与当然时间吻合
      let currentTime = document.querySelector("#music").currentTime;
      this.barTime = currentTime * 1000;
      this.progressBar =
        "width: " + (this.barTime / this.allBarTime) * 100 + "%";
      if (this.allLrc) {
        for (var i = 0; i < this.allLrc.length; i++) {
          if (currentTime + 0.5 > this.allLrc[i].time * 1) {
            //显示到页面
            this.musicLrc = this.allLrc[i].lineLyric;
          } else {
            break;
          }
        }
      } else {
        this.musicLrc = "获取歌词失败！";
        // setTimeout(()=>{this.getMusicLrc(this.nowMusicInfo.musicrid)}, 5000)
      }
    },
    updateMyInfo() {
      updateMyInfo({
        username: this.myInfo.user_name,
        password: this.userPassword,
        signature: this.myInfo.signature,
        uid: this.myInfo.user_id,
      }).then((data) => {
        if (data.data.code !== 0) {
          this.$message({
            message: data.data.msg,
            type: "error",
          });
        } else {
          this.$message({
            message: data.data.msg,
            type: "success",
          });
          this.oldmyInfo.user_account = this.myInfo.user_account;
          this.oldmyInfo.user_admin = this.myInfo.user_admin;
          this.oldmyInfo.user_bg = this.myInfo.user_bg;
          this.oldmyInfo.user_head = this.myInfo.user_head;
          this.oldmyInfo.user_id = this.myInfo.user_id;
          this.oldmyInfo.user_ip_login = this.myInfo.user_ip_login;
          this.oldmyInfo.user_name = this.myInfo.user_name;
          this.oldmyInfo.user_remark = this.myInfo.user_remark;
          this.oldmyInfo.user_role = this.myInfo.user_role;
          this.oldmyInfo.user_sex = this.myInfo.user_sex;
          this.oldmyInfo.signature = this.myInfo.signature;
          this.oldmyInfo.roomID = this.myInfo.roomID;
          this.myInfoChanged = true;
          this.userPassword = "";
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          UpdateRoomInfo({
            id: this.roomID,
            roomName: this.roomInfo.roomName,
            password: this.roomInfo.password,
            notice: this.roomInfo.notice,
            signature: this.roomInfo.signature,
          }).then((data) => {
            if (data.data.code !== 0) {
              this.$message({
                message: data.data.msg,
                type: "error",
              });
            } else {
              this.$message({
                message: data.data.msg,
                type: "success",
              });
              if (this.oldroomInfo.notice != this.roomInfo.notice) {
                this.ws.send(
                  JSON.stringify({
                    type: "system-notice",
                    content: `${this.roomInfo.notice}`,
                  })
                );
              }
              this.oldroomInfo.roomName = this.roomInfo.roomName;
              this.oldroomInfo.notice = this.roomInfo.notice;
              this.oldroomInfo.signature = this.roomInfo.signature;
              this.oldroomInfo.password = this.roomInfo.password;
              this.roomInfoChanged = true;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    toSecond(time) {
      let minute = time.split(":")[0] * 60;
      let second = time.split(":")[1] * 1;
      let ms = (minute + second) * 1000;
      return ms;
    },
    getRoomList() {
      get10Room({ room: this.roomID })
        .then((data) => {
          this.roomList.push({
            ID: 888,
            name: "SunBUG 音乐大厅",
            signature: "欢迎来到SunBUG音乐大厅",
          });
          data.data.data.forEach((item) => {
            this.roomList.push({
              ID: item.ID,
              name: item.name,
              signature: item.signature,
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showBox(el) {
      if (el == "faceShow") {
        this.faceShow = true;
        this.searchBoxShow = false;
        this.musicQueueShow = false;
        this.likeBoxShow = false;
        this.onLineShow = false;
        this.roomListShow = false;
        this.mainInfoShow = false;
        this.blackListShow = false;
        this.roomManagementShow = false;
      } else if (el == "searchBoxShow") {
        this.faceShow = false;
        this.searchBoxShow = true;
        this.musicQueueShow = false;
        this.likeBoxShow = false;
        this.onLineShow = false;
        this.roomListShow = false;
        this.mainInfoShow = false;
        this.blackListShow = false;
        this.roomManagementShow = false;
      } else if (el == "musicQueueShow") {
        this.faceShow = false;
        this.searchBoxShow = false;
        this.musicQueueShow = true;
        this.likeBoxShow = false;
        this.onLineShow = false;
        this.roomListShow = false;
        this.mainInfoShow = false;
        this.blackListShow = false;
        this.roomManagementShow = false;
      } else if (el == "likeBoxShow") {
        this.faceShow = false;
        this.searchBoxShow = false;
        this.musicQueueShow = false;
        this.likeBoxShow = true;
        this.onLineShow = false;
        this.roomListShow = false;
        this.mainInfoShow = false;
        this.blackListShow = false;
        this.roomManagementShow = false;
      } else if (el == "onLineShow") {
        this.faceShow = false;
        this.searchBoxShow = false;
        this.musicQueueShow = false;
        this.likeBoxShow = false;
        this.onLineShow = true;
        this.roomListShow = false;
        this.mainInfoShow = false;
        this.blackListShow = false;
        this.roomManagementShow = false;
      } else if (el == "roomListShow") {
        this.faceShow = false;
        this.searchBoxShow = false;
        this.musicQueueShow = false;
        this.likeBoxShow = false;
        this.onLineShow = false;
        this.roomListShow = true;
        this.mainInfoShow = false;
        this.blackListShow = false;
        this.roomManagementShow = false;
      } else if (el == "mainInfoShow") {
        this.faceShow = false;
        this.searchBoxShow = false;
        this.musicQueueShow = false;
        this.likeBoxShow = false;
        this.onLineShow = false;
        this.roomListShow = false;
        this.mainInfoShow = true;
        this.blackListShow = false;
        this.roomManagementShow = false;
      } else if (el == "blackListShow") {
        this.faceShow = false;
        this.searchBoxShow = false;
        this.musicQueueShow = false;
        this.likeBoxShow = false;
        this.onLineShow = false;
        this.roomListShow = false;
        this.mainInfoShow = false;
        this.blackListShow = true;
        this.roomManagementShow = false;
      } else if (el == "roomManagementShow") {
        this.faceShow = false;
        this.searchBoxShow = false;
        this.musicQueueShow = false;
        this.likeBoxShow = false;
        this.onLineShow = false;
        this.roomListShow = false;
        this.mainInfoShow = false;
        this.blackListShow = false;
        this.roomManagementShow = true;
      }
    },
    closeBox() {
      this.faceShow = false;
      this.searchBoxShow = false;
      this.musicQueueShow = false;
      this.likeBoxShow = false;
      this.onLineShow = false;
      this.roomListShow = false;
      this.mainInfoShow = false;
      this.blackListShow = false;
      this.roomManagementShow = false;
    },
    sendMessage(value) {
      if (value !== "666") {
        if (
          encodeURI(this.message).replace(new RegExp("%0A", "ig"), "") !== ""
        ) {
          let message = {
            type: "message",
            content: this.message,
            message_time: new Date().getTime(),
            message_type: "text",
            message_user: this.myInfo.user_id,
            qout: "",
            key: this.wsKey,
            room: this.roomID,
          };
          this.ws.send(JSON.stringify(message));
          this.message = "";
          document.querySelector("textarea").value = "";
          this.messageList.push(message);
        } else {
          this.message = "";
          document.querySelector("textarea").value = "";
          this.$message({
            message: "不可以发送空消息哦~~",
            type: "warning",
          });
        }
      } else {
        let message = {
          type: "message",
          content: "666",
          message_time: new Date().getTime(),
          message_type: "text",
          message_user: this.myInfo.user_id,
          qout: "",
          key: this.wsKey,
          room: this.roomID,
        };
        this.ws.send(JSON.stringify(message));
        this.message = "";
        document.querySelector("textarea").value = "";
        this.messageList.push(message);
      }
    },
    Logout() {
      Logout().then(() => {
        this.$router.push("/");
      });
    },
    initfn() {
      getMyInfo({ UID: this.myInfo.user_id })
        .then((myInfodata) => {
          this.myInfo.user_head = myInfodata.data.data.head;
          this.myInfo.user_sex = myInfodata.data.data.sex;
          this.myInfo.signature = myInfodata.data.data.signature;
          this.myInfo.roomID = myInfodata.data.data.roomID;
          this.oldmyInfo.user_head = myInfodata.data.data.head;
          this.oldmyInfo.user_sex = myInfodata.data.data.sex;
          this.oldmyInfo.signature = myInfodata.data.data.signature;
          this.oldmyInfo.roomID = myInfodata.data.data.roomID;
          this.getHistoryMsg();
          this.initWebSocket(this.myInfo.user_id);
          if (
            !this.isMobileDevice() &&
            !this.isMobilePhone() &&
            !this.isIOS() &&
            this.isApp()
          ) {
            this.initWebSocket1(this.myInfo.user_id);
          }
          this.getAlluser();
          this.getRoomList();
          this.getMusicQueue(this.roomID);
          // this.getOneMusic();
          this.setTimeTimer();
          this.$alert("请注意，进入房间后将自动播放音乐！", "欢迎光临", {
            confirmButtonText: "进入房间",
            type: "warning",
            callback: (action) => {
              this.canPlay = true;
              setTimeout(() => {
                if (this.canPlay) {
                  document.querySelector("#music").muted = true;
                  document.querySelector("#music").play();
                  document.querySelector("#music").pause();
                  document.querySelector("#music").muted = false;
                  document.querySelector("#music").volume = this.audioVol / 100;
                  if (this.onLineNum > 1) {
                    this.ws.send(
                      JSON.stringify({
                        type: "getMusicInfo",
                        room: this.roomID,
                        timestamp: new Date().getTime(),
                      })
                    );
                  } else {
                    this.getOneMusic();
                  }
                }
              }, 200);
            },
          });
          this.reshFavoritesList();
          this.rushDontlike();
          document.body.addEventListener(
            "click",
            () => {
              this.closeBox();
            },
            false
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getHistoryMsg() {
      getHistoryMsg({ room: this.roomID })
        .then((data) => {
          data.data.data.forEach((item) => {
            // if(item.message_user != this.myInfo.user_id){
            this.messageList.push({
              type: "message",
              content: item.content,
              message_time: item.message_time * 1,
              message_type: item.message_type,
              message_user: item.message_user * 1,
              qout: item.qout,
            });
            // }
          });
          this.messageList.push({
            type: "notice",
            content: this.roomInfo.notice,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showPasswordBox(RoomInfo) {
      this.$prompt("请输入房间密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          if (value == RoomInfo.data.data[0].password) {
            this.initfn();
          } else {
            this.$message({
              type: "warning",
              message: "房间密码错误",
            });
            this.showPasswordBox(RoomInfo);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入，即将返回音乐大厅！",
          });
          setTimeout(() => {
            this.$router.push("/musicRoom/888");
          }, 1000);
        });
    },
    friendlyFormatTime(stringTime) {
      // let str = stringTime;
      //将字符串转换成时间格式
      let timePublish = stringTime * 1;
      let timeNow = new Date().getTime();
      let minute = 1000 * 60;
      let hour = minute * 60;
      let day = hour * 24;
      let month = day * 30;
      let year = month * 12;
      let diffValue = timeNow - timePublish;
      let diffMonth = diffValue / month;
      let diffWeek = diffValue / (7 * day);
      let diffDay = diffValue / day;
      let diffHour = diffValue / hour;
      let diffMinute = diffValue / minute;
      let diffYear = diffValue / year;
      let result = null;
      if (diffValue < 0) {
        result = "刚刚";
      } else if (diffYear > 1) {
        result = parseInt(diffYear) + "年前";
      } else if (diffMonth > 1) {
        result = parseInt(diffMonth) + "月前";
      } else if (diffWeek > 1) {
        result = parseInt(diffWeek) + "周前";
      } else if (diffDay > 1) {
        result = parseInt(diffDay) + "天前";
      } else if (diffHour > 1) {
        result = parseInt(diffHour) + "小时前";
      } else if (diffMinute > 1) {
        result = parseInt(diffMinute) + "分钟前";
      } else {
        result = "刚刚";
      }
      return result;
    },
    help() {
      this.drawer = true;
    },
    keyDown(e) {
      if (e.key == "F1") {
        e.preventDefault(); //阻止浏览器默认事件
        this.help();
        return false;
      } else if (e.key == "F2") {
        e.preventDefault(); //阻止浏览器默认事件
        return false;
      } else if (e.key == "F3") {
        e.preventDefault(); //阻止浏览器默认事件
        return false;
      } else if (e.key == "F4") {
        e.preventDefault(); //阻止浏览器默认事件
        return false;
      } else if (e.key == "F5") {
        e.preventDefault(); //阻止浏览器默认事件
        return false;
      } else if (e.key == "F6") {
        e.preventDefault(); //阻止浏览器默认事件
        this.sendMessage("666");
        return false;
      } else if (e.key == "F7") {
        e.preventDefault(); //阻止浏览器默认事件
        this.dontlike();
        return false;
      } else if (e.key == "F8") {
        e.preventDefault(); //阻止浏览器默认事件
        this.noVol();
        return false;
      } else if (e.key == "F9") {
        e.preventDefault(); //阻止浏览器默认事件
        this.volDown();
        return false;
      } else if (e.key == "F10") {
        e.preventDefault(); //阻止浏览器默认事件
        this.volUp();
        return false;
      } else if (e.key == "F11") {
        e.preventDefault(); //阻止浏览器默认事件
        this.loveMusic();
        return false;
      } else if (e.key == "F12") {
        e.preventDefault(); //阻止浏览器默认事件
        this.nextMusic(true);
        return false;
      }
    },
    volUp() {
      this.muted = false;
      if (this.audioVol < 100) {
        this.audioVol = this.audioVol + 10;
      } else {
        this.audioVol = 100;
      }
      document.querySelector("#music").muted = false;
      document.querySelector("#music").volume = this.audioVol / 100;
      this.volshow = true;
      clearTimeout(this.volTimer);
      this.volTimer = setTimeout(() => {
        this.volshow = false;
      }, 1000);
    },
    volDown() {
      this.muted = false;
      if (this.audioVol > 0) {
        this.audioVol = this.audioVol - 10;
      } else {
        this.audioVol = 0;
      }
      document.querySelector("#music").muted = false;
      document.querySelector("#music").volume = this.audioVol / 100;
      this.volshow = true;
      clearTimeout(this.volTimer);
      this.volTimer = setTimeout(() => {
        this.volshow = false;
      }, 1000);
    },
    noVol() {
      this.muted = !this.muted;
      document.querySelector("#music").muted = this.muted;
      this.volshow = true;
      clearTimeout(this.volTimer);
      this.volTimer = setTimeout(() => {
        this.volshow = false;
      }, 1000);
    },
  },
  mounted() {
    addEventListener("keydown", this.keyDown);
    this.roomID = this.$route.params.id;
    ifLogin().then((logindata) => {
      // console.log(data);
      this.myInfo.user_id = logindata.data.userInfo.UID;
      this.myInfo.user_name = logindata.data.userInfo.username;
      this.oldmyInfo.user_id = logindata.data.userInfo.UID;
      this.oldmyInfo.user_name = logindata.data.userInfo.username;
      getRoomInfo({ roomID: this.roomID })
        .then((RoomInfo) => {
          if (RoomInfo.data.data.length > 0) {
            this.roomInfo.roomName = RoomInfo.data.data[0].name;
            this.roomInfo.notice = RoomInfo.data.data[0].notice;
            this.roomInfo.signature = RoomInfo.data.data[0].signature;
            this.roomInfo.password = RoomInfo.data.data[0].password;
            this.oldroomInfo.roomName = RoomInfo.data.data[0].name;
            this.oldroomInfo.notice = RoomInfo.data.data[0].notice;
            this.oldroomInfo.signature = RoomInfo.data.data[0].signature;
            this.oldroomInfo.password = RoomInfo.data.data[0].password;
            if (
              RoomInfo.data.data[0].masterID == this.myInfo.user_id ||
              RoomInfo.data.data[0].password == "0"
            ) {
              this.initfn();
            } else {
              this.showPasswordBox(RoomInfo);
            }
          } else {
            this.$alert(
              "您输入的房间号不存在！点击确定后返回音乐大厅！",
              "提示",
              {
                confirmButtonText: "确定",
                callback: (action) => {
                  this.$router.push("/musicRoom/888");
                },
              }
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  beforeDestroy() {
    this.ws.onclose();
  },
};
</script>

<style scoped lang="less">
@import "../../assets/icon/iconfont.css";
.tip_title {
  padding: 20px 25px 10px;
  font-size: 20px;
}
.tip_p {
  padding: 1px 20px;
}
.room-box {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  flex-direction: row;
  background-color: #fff;
  box-shadow: 0 0 20px rgb(0 0 0 / 10%);
  border-radius: 0 0 10px 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: Gotham-Book;
  background-attachment: fixed;
  outline: none;
  -webkit-text-size-adjust: none;
  -moz-text-size-adjust: none;
  text-size-adjust: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .transition-box {
    position: absolute;
    box-sizing: border-box;
    left: 50%;
    top: 313px;
    display: block;
    width: 170px;
    margin: 0 0 0 -85px;
    height: 100px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.4);
    text-align: center;
    color: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 999;
    .vol {
      font-size: 32px;
      color: #fff;
      font-weight: 700;
      margin-top: 22px;
      .volicon {
        font-size: 32px;
        margin-right: 0;
      }
    }
  }
  .top {
    border-bottom: 1px solid #eee;
    display: flex;
    flex-direction: row;
    height: 50px;
    padding: 0 15px;
    .room-info {
      display: flex;
      flex-direction: row;
      flex: 1;
      width: 0;
      align-items: center;
      font-size: 18px;
      .room-id {
        background-color: #333;
        color: #fff;
        padding: 0px 8px;
        font-size: 14px;
        border-radius: 3px;
        margin-right: 0px;
      }
      .room-name {
        // display: none;
        font-size: 14px;
        border-radius: 3px;
        margin-right: 0;
        margin-left: 10px;
      }
      .room-invate {
        padding: 5px 10px;
        font-size: 13px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        margin-left: 1px;
      }
    }
    .room-right {
      font-size: 14px;
      color: #999;
      display: flex;
      flex-direction: row;
      align-items: center;
      .room-right-menu {
        padding: 5px 10px;
        font-size: 13px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .menuBox {
        position: absolute;
        top: 51px;
        right: 20px;
        z-index: 9999999;

        .listitem {
          font-size: 14px;
          margin-bottom: 18px;
          height: 55px;
          img {
            width: 55px;
            height: 55px;
            border-radius: 10px;
          }
          .musicName {
            position: relative;
            top: -31px;
            left: 12px;
            display: inline-block;
            width: 185px;
            height: 22px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .album {
            display: inline-block;
            position: relative;
            top: -29px;
            left: 67px;
            width: 185px;
            height: 22px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .right {
            display: inline-block;
            position: relative;
            top: -50px;
            left: 67px;
            .next {
              display: inline-block;
              padding: 2px;
              cursor: pointer;
              border-radius: 5px;
              transition: 0.3s;
            }
            .next:hover {
              background-color: rgba(0, 0, 0, 0.2);
            }
            .save {
              display: inline-block;
              padding: 2px;
              cursor: pointer;
              border-radius: 5px;
              margin-left: 15px;
              transition: 0.3s;
            }
            .save:hover {
              background-color: rgba(0, 0, 0, 0.2);
            }
          }
        }

        .box-card {
          width: 350px;
          height: 420px;
          .listbox {
            margin-top: -15px;
            height: 350px;
            overflow: auto;
            .roomName {
              position: relative;
              top: -31px;
              left: 12px;
              display: inline-block;
              width: 230px;
              height: 22px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .avtart-block {
              margin: 0 auto;
              width: 80px;
              height: 80px;
              svg {
                margin-left: 25px;
              }
            }
            .demo-ruleForm {
              .el-button {
                margin: 10px auto 0;
                display: block;
              }
            }
            .mineForm {
              .el-button {
                margin: 10px 12px 0 0;
              }
            }
          }
        }
      }
    }
  }
  .chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 0;
    .history {
      flex: 1;
      height: 0;
      overflow: hidden;
      overflow-y: auto;
      padding: 20px;
      position: relative;
      transition: 0.3s;
      .message {
        display: flex;
        flex-direction: row;
        margin: 20px 0;
        text-align: left;
        padding-right: 60%;
        .head {
          .el-dropdown,
          .el-dropdown__popper {
            --el-dropdown-menu-box-shadow: var(--el-box-shadow-light);
            --el-dropdown-menuItem-hover-fill: var(--el-color-primary-light-9);
            --el-dropdown-menuItem-hover-color: var(--el-color-primary-light-2);
            --el-dropdown-menu-index: 10;
            .el-image {
              width: 50px;
              height: 50px;
              border-radius: 10px;
              background-color: #fff;
              cursor: pointer;
            }
          }
        }
        .content {
          margin-left: 20px;
          .nick {
            font-size: 14px;
            color: #666;
          }
          .el-dropdown,
          .el-dropdown__popper {
            --el-dropdown-menu-box-shadow: var(--el-box-shadow-light);
            --el-dropdown-menuItem-hover-fill: var(--el-color-primary-light-9);
            --el-dropdown-menuItem-hover-color: var(--el-color-primary-light-2);
            --el-dropdown-menu-index: 10;
            .text {
              background-color: #eee;
              font-size: 13px;
              color: #666;
              padding: 8px 16px;
              border-radius: 15px;
              margin-top: 2px;
              word-break: break-all;
              word-wrap: break-word;
              display: inline-block;
              position: relative;
              cursor: pointer;
              line-height: 18px;
              max-width: 300px;
              img {
                width: 30px;
                height: 30px;
                vertical-align: text-bottom;
              }
            }
            .text:before {
              content: "";
              position: absolute;
              top: -5px;
              left: -13px;
              right: auto;
              width: 15px;
              height: 15px;
              border: 0 solid transparent;
              border-bottom-width: 12px;
              border-bottom-color: currentColor;
              border-radius: 0 0 0 15px;
              color: #eee;
            }
            .img {
              padding: 2px;
              line-height: 0;
              .el-image {
                border-radius: 15px;
                max-width: 200px;
                .el-image__inner,
                .el-image__placeholder {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
          .quot {
            span {
              font-size: 12px;
              color: #eee;
              background-color: #eee;
              color: #aaa;
              padding: 2px 5px;
              margin-top: 5px;
              border-radius: 5px;
              display: inline-block;
              text-align: left;
            }
          }
          .time {
            font-size: 12px;
            color: #ccc;
            margin-top: 5px;
          }
        }
        .space {
          flex: 1;
          width: 0;
        }
      }
      .from-me {
        justify-content: flex-end;
        flex-direction: row-reverse;
        text-align: right;
        padding-right: 0;
        padding-left: 60%;
        .content {
          margin-right: 20px;
          margin-left: auto;
          text-align: right;
          .nick {
            text-align: right;
          }
          .el-dropdown,
          .el-dropdown__popper {
            --el-dropdown-menu-box-shadow: var(--el-box-shadow-light);
            --el-dropdown-menuItem-hover-fill: var(--el-color-primary-light-9);
            --el-dropdown-menuItem-hover-color: var(--el-color-primary-light-2);
            --el-dropdown-menu-index: 10;
            .text {
              background-color: #1295dd;
              color: #fff;
              text-align: left;
              img {
                width: 30px;
                height: 30px;
                vertical-align: text-bottom;
              }
            }
            .text:before {
              content: "";
              position: absolute;
              top: -5px;
              left: auto;
              right: -13px;
              width: 15px;
              height: 15px;
              border: 0 solid transparent;
              border-bottom-width: 12px;
              border-bottom-color: currentColor;
              border-radius: 0 0 15px 0;
              color: #1295dd;
            }
            .img {
              padding: 2px;
              .el-image {
                border-radius: 15px;
                max-width: 200px;
                .el-image__inner,
                .el-image__placeholder {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
          .quot {
            span {
              font-size: 12px;
              color: #eee;
              background-color: #eee;
              color: #aaa;
              padding: 2px 5px;
              margin-top: 5px;
              border-radius: 5px;
              display: inline-block;
              text-align: left;
            }
          }
          .time {
            text-align: right;
          }
        }
      }
      .roomNotice {
        text-align: center;
        margin-bottom: 10px;
        .card {
          display: inline-block;
          text-align: left;
          max-width: 500px;
          background: #eee;
          padding: 10px 15px;
          border-radius: 10px;
          color: #999;
          font-size: 13px;
          .title {
            font-size: 16px;
            color: #1295dd;
            display: inline-block;
            border-bottom: 2px dotted #1295dd;
            margin-bottom: 10px;
            padding-bottom: 5px;
          }
          .desc {
            word-break: break-all;
            word-wrap: break-word;
            margin: 0;
            overflow: hidden;
            white-space: pre-line;
          }
        }
      }
      .system {
        display: flex;
        flex-direction: row;
        text-align: center;
        padding: 0 20%;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        color: #aaa;
        margin-bottom: 10px;
        div {
          background-color: #eee;
          padding: 2px 8px;
          border-radius: 3px;
          max-width: 500px;
        }
      }
    }
    .chat-form {
      border-top: 1px solid #eee;
      display: flex;
      flex-direction: column;
      position: relative;
      .progress {
        height: 2px;
        position: relative;
        div {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          border-radius: 10px;
          background: #fff;
          background: linear-gradient(270deg, #4493d7, #fff);
          transition: 0.2s;
        }
      }
      .tool {
        display: flex;
        flex-direction: row;
        padding: 10px;
        padding-bottom: 5px;
        .tool-left {
          display: flex;
          flex-direction: row;
          flex: 1;
          font-size: 13px;
          color: #999;
          align-items: center;
          .tool-item {
            padding: 5px 10px;
            vertical-align: middle;
            cursor: pointer;
            transition: all 0.3s;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            .iconfont {
              margin-right: 5px;
              display: inline-block;
            }
          }
        }
        .tool-right {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          position: absolute;
          right: 5px;
          top: -30px;
          .song-title {
            flex-direction: row;
            display: flex;
            color: #999;
            font-size: 13px;
            cursor: pointer;
            flex: 1;
            div {
              max-width: 250px;
              flex: 1;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .song-titleIcon {
              margin-top: 1px;
            }
          }
          .song-control {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin: 0 5px;
            .song-dontlike {
              margin-left: 6px;
              margin-right: 9px;
              font-size: 12.5px;
              margin-top: 2px;
              color: #999;
              cursor: pointer;
            }
            .song-next,
            .song-love {
              margin-left: 2px;
              margin-right: 8px;
              margin-top: 0px;
              color: #999;
              cursor: pointer;
            }
          }
        }
      }
      .chat-input {
        padding: 0 10px 10px 18px;
        overflow: hidden;
        position: relative;
        textarea {
          height: 80px;
          width: 100%;
          resize: none;
          outline: none;
          border: none;
          font-size: 15px;
          color: #666;
          background-color: transparent;
        }
        /deep/.el-textarea__inner {
          height: 80px;
          width: 100%;
          padding: 0 8px;
          resize: none;
          outline: none;
          border: none;
          font-size: 15px;
          color: #666;
          background-color: transparent;
        }
        .lrc {
          font-family: Consolas;
          font-size: 12px;
          color: #999;
          display: flex;
          flex-direction: row;
          .iconfont {
            color: #999;
            margin-right: 5px;
            margin-top: -1px;
          }
          .nowtime {
            position: absolute;
            right: 20px;
            color: #999;
          }
        }
      }
    }
  }
}
.toolBox {
  position: absolute;
  bottom: 164px;
  left: 20px;
  .listitem {
    font-size: 14px;
    margin-bottom: 18px;
    height: 55px;
    img {
      width: 55px;
      height: 55px;
      border-radius: 10px;
    }
    .musicName {
      position: relative;
      top: -31px;
      left: 12px;
      display: inline-block;
      width: 185px;
      height: 22px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .album {
      display: inline-block;
      position: relative;
      top: -29px;
      left: 67px;
      width: 185px;
      height: 22px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .right {
      display: inline-block;
      position: relative;
      top: -50px;
      left: 67px;
      .next {
        display: inline-block;
        padding: 2px;
        cursor: pointer;
        border-radius: 5px;
        transition: 0.3s;
      }
      .next:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
      .save {
        display: inline-block;
        padding: 2px;
        cursor: pointer;
        border-radius: 5px;
        margin-left: 15px;
        transition: 0.3s;
      }
      .save:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: 410px;
    height: 330px;
    .listbox {
      height: 246px;
      overflow: auto;
    }
  }
}
.picker {
  position: absolute;
  left: 10px;
  bottom: 175px;
  padding: 20px 0 20px 15px;
  width: 460px;
  height: 260px;
  box-shadow: 0 0 10px rgb(0 0 0 / 20%);
  background-color: hsla(0, 0%, 100%, 0.8);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  .face-list {
    flex: 1;
    position: relative;
    height: 0;
    padding: 10px 15px;
    overflow: hidden;
    overflow-y: auto;
    text-align: left;
    .item {
      display: inline-block;
      width: 20% !important;
      overflow: hidden;
    }
    .item-emoji {
      width: 8% !important;
      .el-image {
        width: 80%;
        height: 80%;
        border-radius: 5px;
        transition: 0.3s;
        .el-image__inner {
          vertical-align: text-bottom;
        }
      }
      .el-image:hover {
        background-color: #aaa;
      }
    }
  }
}
img {
  vertical-align: text-bottom;
}
/*定义滚动条宽度*/
::-webkit-scrollbar {
  width: 0;
}

.opacity0 {
  opacity: 0;
}

.fr {
  float: right;
}
.hb {
  transition: 0.2s;
}

.hb:hover {
  color: #4493d7;
}

/deep/.el-card__header {
  padding: 10px 20px;
}
/deep/.numrule input::-webkit-outer-spin-button,
/deep/.numrule input::-webkit-inner-spin-button {
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
}
/deep/.numrule input[type="number"] {
  appearance: textfield;
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
}
/deep/.el-form-item {
  margin-bottom: 2px;
}
</style>
