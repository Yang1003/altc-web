<template>
  <div>
    <el-container>
      <el-main>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('softLunch.functionSoft')" name="first">
            <el-card>
              <el-collapse v-model="activeCollapseName" accordion>
                <el-collapse-item name="1">
                  <!-- <template slot="title"> 终端测试软件 </template>
                  <div>
                    <el-switch
                      v-if="formBoardSoft.isShow"
                      v-model="formBoardSoft.verified"
                      inactive-text="开启验证"
                      style="margin-left: 35px; margin-bottom: 20px"
                    />
                  </div> -->
                  <el-form
                    :inline="true"
                    :model="formBoardSoft"
                    label-width="100px"
                    size="small"
                  >
                    <el-form-item label="MAC">
                      <el-input
                        v-model="formBoardSoft.mac"
                        :placeholder="$t('softLunch.pleaseEnter')"
                        @change="onSelectChange(0)"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        icon="el-icon-download"
                        :disabled="!isConnect"
                        @click="onDownloadBoardSoft"
                      >{{$t('ptmTranslation.download')}}
                      </el-button>
                    </el-form-item>

                    <el-form-item :label="$t('softLunch.orderNum')">
                      <el-input
                        v-model="formBoardSoft.orderNo"
                        :placeholder="$t('softLunch.pleaseEnter')"
                        @change="onSelectChange(1)"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        icon="el-icon-download"
                        :disabled="!isConnect"
                        @click="onDownloadBoardSoft"
                      >{{$t('ptmTranslation.download')}}
                      </el-button>
                    </el-form-item>
                  </el-form>

                  <el-form
                    :inline="true"
                    :model="formBoardSoft"
                    label-width="100px"
                    size="small"
                  >
                    <el-form-item :label="$t('softLunch.softwareName')">
                      <el-select
                        v-model="formBoardSoft.softwareName"
                        :placeholder="$t('softLunch.pleaseSelect')"
                        @change="onSoftwareSelectChange"
                      >
                        <el-option
                          v-for="item in boardSoftStations"
                          :key="item.softwareName"
                          :label="item.softwareName"
                          :value="item.softwareName"
                        />
                      </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('softLunch.testStation')">
                      <el-select
                        v-model="formBoardSoft.station"
                        :placeholder="$t('softLunch.pleaseSelect')"
                      >
                        <el-option
                          v-for="item in boardSoftStations2"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="success"
                        icon="el-icon-switch-button"
                        :disabled="!isConnect"
                        :loading="lunchLoading"
                        @click="onOpenBoardSoft"
                      >{{$t('ptmTranslation.lunch')}}
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-tab-pane>
          <el-tab-pane :label="$t('softLunch.ptmClientSoft')" name="five">
            <el-card>
              <div
                v-loading="clientLoading"
                element-loading-text="拼命下载中，请等待。。。"
              >
                <el-button
                  type="success"
                  class="btnClass"
                  @click="downloadClient()"
                  round
                  icon="el-icon-download"
                >{{$t('softLunch.downloadPtmClient')}}
                </el-button>
              </div>
            </el-card>
          </el-tab-pane>
        </el-tabs>

        <div
          v-if="activeName !== 'fourth' && activeName !== 'five'"
          class="messageClass"
        >
          <p v-for="(item, index) in connectMsg" :key="index">
            <span v-if="item.indexOf('成功') > -1" style="color: #67c23a">{{
              item
            }}</span>
            <span
              v-else-if="item.indexOf('失败') > -1"
              style="color: #f56c6c"
            >{{ item }}</span>
            <span v-else>{{ item }}</span>
          </p>
        </div>

        <div v-if="progressLoading" class="loadingModal" style="height: 100%">
          <div style="margin-top: 200px">
            <div style="width: 100px; margin: 0 auto; font-size: 20px">
              <span v-if="progressCompletion" style="color: #67c23a">下载完成</span>
              <span v-else>正在下载中</span>
            </div>
            <div
              style="width: 50%; margin: 20px auto;"
              v-for="progress in progressList">
              <span>{{ progress.name }}</span>
              <el-progress
                :stroke-width="16"
                :percentage="progress.percentage"
                :color="colors"
              />
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getPtmClientServerVersion } from '@/api/ptmClient'
import { download } from '@/api/ptmClient'
import { boardSoftDownload } from '@/api/softManage'
import { softwareLunch } from '@/api/softManage'
import { getSoftwareStationsByMac } from '@/api/softManage'
import { state} from '@/store/modules/user'



// const APP_URL = process.env.VUE_APP_BASE_API
//  const APP_URL = 'http://10.76.20.37:8091'
// const HEADER = {
//   headers: {
//     'Access-Control-Allow-Credentials': true,
//     withCredentials: false
//   }
// }

export default {
  name: 'Software',
  data() {
    return {
      clientLoading: false,

      progressList: [],
      percentage: 0,
      colors: [
        { color: '#667459', percentage: 10 },
        { color: '#6E8559', percentage: 25 },
        { color: '#759656', percentage: 40 },
        { color: '#7AA651', percentage: 55 },
        { color: '#7DB449', percentage: 70 },
        { color: '#80C53F', percentage: 85 },
        { color: '#67C23A', percentage: 100 }
      ],
      progressLoading: false,
      progressCompletion: false,
      roleGrade: '1', // 终端测试软件登录用户权限等级
      lunchLoading: false,
      reConnectObj: null,
      isConnect: false,
      websocket: undefined,
      connectMsg: [],
      activeName: 'first',
      poolTotal: 0,
      userid: 0,
      boardSoftStations: [],
      boardSoftStations2: [],
      formBoardSoft: {
        mac: '',
        orderNo: '',
        station: '',
        isShow: false,
        verified: false,
        softwareName: ''
      },
      formNetworkSoft: {
        sn: '',
        stationCode: '1',
        frameNo: [''],
        isShow: false,
        verified: false
      },
      formThirdSoft: {
        softwareName: ''
      },
      formDownloadSoft: {
        orderNo: '',
        plateName: ''
      },
      poolList: [],
      activeCollapseName: '1',
      currentMac: '',
      stationCodeList: [
        {
          key: '1',
          value: '1'
        },
        {
          key: '2',
          value: '2'
        },
        {
          key: '3',
          value: '3'
        },
        {
          key: '3',
          value: '3'
        },
        {
          key: '4',
          value: '4'
        },
        {
          key: '5',
          value: '5'
        },
        {
          key: '6',
          value: '6'
        },
        {
          key: '7',
          value: '7'
        },
        {
          key: '8',
          value: '8'
        }
      ]
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    async init() {
      await this.createWebSocket()
      // await this.onConfigMenu()
    },
    handleClick(tab, event) {
      debugger
      this.lunchLoading = false
      this.connectMsg = []
      this.reConnect()
    },

    printMsg(msg) {
      if (this.connectMsg.length > 5) {
        this.connectMsg.shift()
      }
      this.connectMsg.push(msg)
    },

    onSoftwareSelectChange(value) {
      this.boardSoftStations.forEach((item) => {
        if (item.softwareName === value) {
          this.boardSoftStations2 = item.stationList
        }
      })
    },

    createWebSocket() {
      if (typeof WebSocket === 'undefined') {
        this.printMsg(this.$t('softLunch.browserNotSupportWebSocket'))
      } else {
        try {
          this.printMsg(this.$t('softLunch.ptmClientIsConnecting'))
          this.websocket = new WebSocket('ws://localhost:7181/')
          this.initWebSocket()
        } catch (e) {
          this.printMsg()
          this.reConnect()
        }
      }
    },

    initWebSocket() {
      // 建立连接
      this.websocket.onopen = () => {
        debugger
        // const url = APP_URL + "/software/getPtmClientServerVersion";
        getPtmClientServerVersion().then((res) => {
          if (res.code === '200') {
            this.websocket.send(
              'open,' +
                res.data.version +
                ',' +
                res.data.url +
                ',' +
                res.data.token
            )
          }
        })
      }

      // 客户端接收服务端返回的数据
      this.websocket.onmessage = (evt) => {
        this.messageFallback(evt)
      }

      // 发生错误时
      this.websocket.onerror = (evt) => {
        this.printMsg(this.$t('softLunch.ptmClientNotLunch'))
        this.isConnect = false
        this.reConnect()
      }

      // 关闭连接
      this.websocket.onclose = (evt) => {
        this.isConnect = false
      }
    },

    reConnect() {
      // 如果已经连上就不在重连了
      if (this.isConnect) {
        this.printMsg(this.$t("softLunch.ptmClientConnected"))
      } else {
        this.reConnectObj && clearTimeout(this.reConnectObj)
        // 延迟3秒重连  避免过多次过频繁请求重连
        const that = this
        this.reConnectObj = setTimeout(function () {
          that.createWebSocket()
        }, 2000)
      }
    },

    messageFallback(e) {
      console.log('接收消息：' + e.data)

      const arr = e.data.split(',')
      const type = arr[0]
      const status = arr[1]
      const content = arr[2]
      if (type === '-1') {
        this.checkClient(status)
      } else if (type === '0') {
        // 记录启动客户端的用户id，mac，ip
        // this.bindMacAndUserid(content);
      } else if (type === '1') {
        // 软件下载中
        this.downloadProgress(content)
      } else if (type === '2') {
        // 软件下载结束
        this.downloadCompletion(status, content)
      } else if (type === '3') {
        // 软件启动
        this.lunchLoading = false
        this.printMsg(this.$t("softLunch.softwareStartupSuccess") + content)
      }
    },

    checkClient(status) {
      // 判断本地客户端是否最新版本
      if (status === 'success') {
        this.printMsg(this.$t("softLunch.ptmClientConnected"))
        this.isConnect = true
      } else {
        this.printMsg(this.$t("softLunch.ptmClientIsUpdating"))
        this.isConnect = false
        this.reConnect()
      }
    },

    startDownload() {
      this.progressLoading = true
      this.progressCompletion = false
      this.progressList = []
    },

    downloadProgress(progress) {
      const name = progress.substring(0, progress.indexOf(':'))
      const percentage = progress.substring(progress.indexOf(':') + 1)

      const progressList = this.progressList
      const currentProgress = progressList.filter(
        (progress) => progress.name === name
      )
      if (currentProgress && currentProgress.length > 0) {
        currentProgress[0].percentage = percentage
      } else {
        progressList.push({
          name: name,
          percentage: percentage
        })
      }
    },

    downloadCompletion(status, content) {
      if (status === 'fail') {
        this.printMsg(this.$t("softLunch.softDownloadFail") + content)
      } else {
        this.progressCompletion = true
        this.printMsg(this.$t("softLunch.softDownloadSuccess"))
      }
      this.lunchLoading = false

      setTimeout(() => {
        this.progressLoading = false
      }, 2000)
    },

    // bindMacAndUserid(content) {
    //   const arr = content.split(";");
    //   const mac = arr[0];
    //   this.currentMac = mac;
    //   const ip = arr[1];

    //   const api = "/common/ptmClient/bindClientInfo";
    //   const url = APP_URL + api + "?ip=" + ip + "&mac=" + mac;
    //   this.$http.get(url, null, null, HEADER).then((res) => {
    //     if (res.code != "200") {
    //       this.printMsg("MAC地址绑定失败！");
    //     }
    //   });
    // },

    sendMessage(data) {
      console.log('发出消息：' + data)

      if (this.websocket) {
        this.websocket.send(data)
      } else {
        this.reConnect()
      }
    },

    tableRowStyle() {
      return 'text-align: center'
    },

    async downloadClient() {
      this.clientLoading = true
      // const api = "/common/ptmClient/download";
      download().then((res) => {
        if (res.code === '200') {
          // let result = await this.$http.get(res.data, {}, {}, { responseType: "blob" });
          // this.handleDownLoadFile(result);
          window.location.href = res.data
          this.clientLoading = false
        } else {
          this.$message.error(res.msg.join(', '))
          this.clientLoading = false
        }
      })
    },

    handleDownLoadFile(response) {
      const src = window.URL.createObjectURL(response)
      if (src) {
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = src
        link.setAttribute(
          'download',
          decodeURI(decodeURI('PtmClientService.zip'))
        )
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(src) // 释放掉blob对象
      }
      this.clientLoading = false
    },

    // onConfigMenu() {
    //   // 判断当前登录用户权限
    //   debugger

    //   var loginUser = this.currLoginUser
    //   this.userid = parseInt(loginUser.userid)

    //   // 判断用户角色
    //   var userRole = loginUser.authorities
    //   if (userRole.includes('ROLE_ptmAdmin')) {
    //     this.formBoardSoft.isShow = true
    //     this.formNetworkSoft.isShow = true
    //     this.roleGrade = '3'
    //   } else {
    //     if (userRole.includes('ROLE_boardPP')) {
    //       this.formBoardSoft.isShow = true
    //       this.roleGrade = '3'
    //     } else if (userRole.includes('ROLE_classLeader')) {
    //       this.roleGrade = '3' // 班组长对于终端测试软件的权限等级为2
    //     } else {
    //       this.roleGrade = '1' // 普通账号对于终端测试软件的权限等级为1
    //     }

    //     if (
    //       userRole.includes('ROLE_networkPP') ||
    //       userRole.includes('ROLE_boardJoinPP')
    //     ) {
    //       this.formNetworkSoft.isShow = true
    //     }
    //   }
    // },

    onDownloadBoardSoft() {
      var mac = this.formBoardSoft.mac.trim()
      var ordernum = this.formBoardSoft.orderNo.trim()
      if (mac === '' && ordernum === '') {
        this.$message.error(this.$t("softLunch.pleaseEnterMacOrOrderNum"))
        return false
      }
      // const api = "/board/software/getDownloadUrls";
      const para = {
        equipMac: this.formBoardSoft.mac,
        ordernum: this.formBoardSoft.orderNo,
        userId: this.userid,
        verified: this.formBoardSoft.verified
      }

      boardSoftDownload(para).then((res) => {
        if (res.code === '200') {
          this.startDownload()
          this.printMsg(this.$t("softLunch.softDownloadingPleaseWait"))
          this.sendMessage(res.data.commandType + '&' + res.data.content)
        } else {
          this.printMsg(this.$t("softLunch.softDownloadFail")+ res.msg.join(', '))
        }
      })
    },

    onOpenBoardSoft() {
      debugger
      var station = this.formBoardSoft.station
      if (station === '') {
        this.$message.error(this.$t("softLunch.pleaseEnterMacAndSelectTestStation"))
        return false
      }

      // var api = "/board/software/lunch";
      const param = {
        equipMac: this.formBoardSoft.mac,
        ordernum: this.formBoardSoft.orderNo,
        boardSoftwareName: this.formBoardSoft.softwareName,
        station: this.formBoardSoft.station,
        verified: this.formBoardSoft.verified
      }


      softwareLunch(param).then((res) => {
        if (res.code === '200') {
          this.lunchLoading = true
          this.printMsg(this.$t("softLunch.startLaunchingSoftware"))
          // 增加登录用户信息
          // var loginUser = this.currLoginUser
          var tempObj = JSON.parse(res.data.content)
          var role = this.$store.getters.permit
          Object.assign(tempObj, {
            username: 'admin',
            // userRole: '3',
            userRole: role,
            Authorization: ''
          })
          var content = JSON.stringify(tempObj)
          this.sendMessage(res.data.commandType + '&' + content)
        } else {
          this.$message.error(res.msg.join(', '))
        }
      })
    },

    onSelectChange(selectType) {
      debugger
      this.boardSoftStations = []
      this.formBoardSoft.station = ''
      var mac = this.formBoardSoft.mac.trim()
      // var api = "/board/software/getSoftwareStationsByMac";
      var param = {}
      if (selectType === 0) {
        param = {
          equipMac: mac,
          verified: this.formBoardSoft.verified
        }
      } else {
        param = {
          ordernum: this.formBoardSoft.orderNo.trim(),
          verified: this.formBoardSoft.verified
        }
      }
      getSoftwareStationsByMac(param).then((res) => {
        if (res.code === '200') {
          // var result = res.data;
          // let selectData = [];
          // result.forEach((item) => {
          //   let obj = { label: item, value: item };
          //   selectData.push(obj);
          // });
          this.boardSoftStations = res.data
        }
      })
    },

    addframeNoRow() {
      this.formNetworkSoft.frameNo.push('')
    },
    removeframeNoRow(item) {
      if (this.formNetworkSoft.frameNo.length > 1) {
        const index = this.formNetworkSoft.frameNo.indexOf(item)
        if (index !== -1) {
          this.formNetworkSoft.frameNo.splice(index, 1)
        }
      }
    },
    chage() {
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.el-select {
  display: inline-block;
  position: relative;
  width: 200px;
}

.btnClass {
  width: 30%;
  height: 80px;
  margin: 0 35%;
  font-size: 20px;
}

.messageClass {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  padding: 0 20px;
  margin: 20px 0 0 0;
  max-height: 210px;
  overflow: auto;
  font-size: small;
}

.loadingModal {
  width: 100%;
  background: #e4e7ed;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999999;
}

.el-progress-bar {
  width: 98%;
}

.el-switch__label.is-active {
  color: #606266;
}
</style>
