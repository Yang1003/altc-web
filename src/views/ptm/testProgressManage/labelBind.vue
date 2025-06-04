<template>
  <div class="ContractInfo">
    <el-card v-loading.lock="loading">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :inline="true"
        label-width="120px"
        size="small"
      >
        <!-- :inline="true" -->
        <div
          style="
            border: 1px solid #ebebeb;
            border-radius: 3px;
            position: relative;
            padding: 20px 20px 0 20px;
            margin: 10px 0 0 0;
          "
        >
        

          <el-form-item :label="$t('softLunch.orderNum')" prop="orderId">
            <el-input v-model="form.orderId" />
          </el-form-item>
          <el-form-item :label="$t('labelBindPage.bindCount')" prop="bindCount" >
            <el-input
              v-model="form.bindCount"
              readonly="true"
              style="width: 80px"
            />
          </el-form-item>
          <el-checkbox v-model="form.checked" style="margin-right: 20px">{{$t('labelBindPage.reformedOrNot')}}</el-checkbox>
          <el-button
            v-if="!isStart"
            size="small"
            type="primary"
            icon="el-icon-video-play"
            @click="handleStart"
          >
            {{$t('ptmTranslation.start')}}
          </el-button>
          <el-button
            v-if="isStart"
            size="small"
            type="primary"
            icon="el-icon-video-pause"
            @click="handleStop"
          >
            {{$t('ptmTranslation.stop')}}
          </el-button>
          <el-button
            v-if="isSetting"
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="visible = true"
          >
            {{$t('labelBindPage.dataRules')}}
          </el-button>
          <el-checkbox
            v-model="chkClearData"
            :disabled="!clearData"
            style="margin-left: 20px"
            :label="$t('labelBindPage.scanFail')"
          />
        </div>
      </el-form>

      <el-row>
        <el-col :span="10">
          <el-form
            :inline="false"
            size="small"
            label-width="80px"
            label-position="left"
          >
            <div
              style="
                border: 1px solid #ebebeb;
                border-radius: 3px;
                position: relative;
                padding: 20px;
                margin: 20px 0 0 0;
                height: 500px;
              "
            >
             
              <el-form-item prop="mac" label="MAC">
                <el-input
                  ref="inputMac"
                  v-model="mac"
                  :disabled="!isMacStart"
                  @keyup.enter.native="checkLabel('mac', mac)"
                />
              </el-form-item>
              <el-form-item prop="tsn" label="TSN">
                <el-input
                  ref="inputTsn"
                  v-model="tsn"
                  disabled="true"
                  @keyup.enter.native="checkLabel('tsn', tsn)"
                />
              </el-form-item>
              <el-form-item
               
                prop="bosasn"
                label="BOSASN"
              >
                <el-input
                  ref="inputBosasn"
                  v-model="bosasn"
                  :disabled="!isBosasnStart"
                  @keyup.enter.native="checkLabel('bosasn', bosasn)"
                />
              </el-form-item>
             
            </div>
          </el-form>
        </el-col>
        <el-col :span="14">
          <div style="position: relative">
            <div
              style="
                position: absolute;
                left: 15px;
                top: -12px;
                background: #fff;
                padding: 0 10px;
              "
            >
              {{$t('labelBindPage.bindingProcessInfo')}}
            </div>
            <div
              ref="productNum"
              class="productNum"
              style="
                border: 1px solid #ebebeb;
                border-radius: 3px;
                padding: 0px 20px 0 20px;
                margin: 20px 0 0 0;
                height: 500px;
                overflow: auto;
                fontsize: 30px;
              "
            >
              <p v-for="(item, index) in messageList" :key="index">
                <span
                  v-if="item.type === 'success'"
                  style="color: #67c23a; font-size: 40px"
                >{{ item.msg }}</span>
                <span
                  v-else-if="item.type === 'failure'"
                  style="color: #f56c6c"
                >{{ item.msg }}</span>
                <span v-else>{{ item.msg }}</span>
              </p>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      :title="$t('labelBindPage.dataRules')"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-form
        ref="dataRuleForm"
        :model="dataRuleForm"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item prop="orderId" 
        :label="$t('softLunch.orderNum')">
          <el-input v-model="form.orderId" readonly autocomplete="off" />
        </el-form-item>
        <el-form-item v-for="item in fieldRuleList" :prop="item.fieldDesc" :label="item.fieldDesc">
          <el-input-number
            v-if="item.fieldLength && item.fieldLength > 0"
            v-model="item.fieldLength"
            autocomplete="off"
          />
          <el-input v-else v-model="item.fieldPrefix" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">{{$t('table.cancel')}}</el-button>
        <el-button size="small" type="primary" @click="saveDataRule">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <audio
      id="bindFail"
      preload="none"
      src="https://ptm.fiberhome.com/api/ptmpre/ecmnode/download/6964c2b4-ccfb-4972-ba38-1939747e017e"
    />
    <audio
      id="bindFail_test"
      preload="none"
      src="http://ptmdev.fiberhome.com/api/ptmpre/ecmnode/download/7c460b38-e1c5-49d5-86cb-b99182c594de"
    />
    <audio
      id="tsnScanFail"
      preload="none"
      src="https://ptm.fiberhome.com/api/ptmpre/ecmnode/download/4bed4328-94f7-423a-a66e-48685df787a4"
    />
    <audio
      id="tsnScanFail_test"
      preload="none"
      src="http://ptmdev.fiberhome.com/api/ptmpre/ecmnode/download/39da617a-bcd2-47dd-8de5-b08657e03760"
    />
    <audio
      id="macScanFail"
      preload="none"
      src="https://ptm.fiberhome.com/api/ptmpre/ecmnode/download/aef5ac21-9dd9-48d4-a6cd-fa02b3832d9d"
    />
    <audio
      id="macScanFail_test"
      preload="none"
      src="http://ptmdev.fiberhome.com/api/ptmpre/ecmnode/download/4750d20b-16aa-46ba-8acc-b70ca8be75f3"
    />
    <audio
      id="bosasnScanFail"
      preload="none"
      src="https://ptm.fiberhome.com/api/ptmpre/ecmnode/download/34577cdd-b839-40bf-a029-e55668f5046e"
    />
    <audio
      id="repeatBind"
      preload="none"
      src="https://ptm.fiberhome.com/api/ptmpre/ecmnode/download/92fef89a-65f4-4d2c-ad9d-8fc6f2433885"
    />
  </div>
</template>

<script>
import { getMacByOrderNo } from '@/api/board/boardSapinfo'
import { countByOrderNum } from '@/api/board/boardCodebind'
import { getDataRule } from '@/api/board/boardCodebind'
import { savaDataRule } from '@/api/board/boardCodebind'
import { pageBindList } from '@/api/board/boardCodebind'
import { doBindNum } from '@/api/board/boardCodebind'

// const APP_URL = process.env.VUE_APP_BASE_API
// const HEADER = {
//   headers: {
//     'Access-Control-Allow-Credentials': true,
//     withCredentials: false
//   }
// }

export default {
  name: 'OrderVendor',

  data() {
    return {
      isSetting: false,
     
      loading: false,
      isStart: false,
      // tsnStart: false,
      isMacStart: false,
      isBosasnStart: false,
      isBosasn2Start: false,
      tsn: undefined,
      mac: undefined,
      bosasn: undefined,
      bosasn2: undefined,
      orderMacs: [],
      chkClearData: false,
      clearData: true,
      form: {
        orderId: undefined,
        bindQuantity: undefined,
        checked: false,
        bindCount: undefined
      },
      rules: {
        orderId: [
          { required: true, message: '请输入订单号', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 位', trigger: 'blur' }
        ],
        tsn: [
          { min: 12, max: 13, message: '长度在 12 到 13 位', trigger: 'blur' }
        ]
      },
      messageList: [],

      visible: false,
      dataRuleForm: null,
      fieldRuleList: [
        {
          fieldName: 'tsn',
          fieldDesc: 'TSN长度',
          fieldLength: 12
        },
        {
          fieldName: 'bosasn',
          // fieldDesc: 'BOSA长度',

          fieldDesc: 'o comprimento do BOSA deve ser de',
          fieldLength: 14
        },
        {
          fieldName: 'bosasn',
          fieldDesc: 'BOSA prefix 前缀(多个BOSA前缀用英文,隔开)',
          fieldPrefix: 'BAI1'
        },
        {
          fieldName: 'bosasn2',
          fieldDesc: 'BOSASN2长度',
          fieldLength: 14
        },
        {
          fieldName: 'bosasn2',
          fieldDesc: 'BOSASN2 prefix 前缀(多个BOSA前缀用英文,隔开)',
          fieldPrefix: 'BAI1'
        },
        {
          fieldName: 'mac',
          // fieldDesc: 'mac长度',
          fieldDesc: 'o comprimento do BOSA deve ser de',
          fieldLength: 12
        },
        {
          fieldName: 'mac',
          fieldDesc: 'MAC prefix 前缀',
          fieldPrefix: ''
        }
      ]
    }
  },
  // 计算属性
  computed: {},
  watch: {},
  async created() {},
  mounted() {},
  methods: {
    async handleStart() {
      debugger
      try {
        this.$refs['form'].validate(async (valid) => {
          if (!valid) return
          // 不满8位补0 超过八位取前八位
          this.loading = true
          // const queryMac = "/testResources/board/sapinfo/getMacByOrderNo";
          getMacByOrderNo(this.form.orderId)
            .then((res) => {
              if (res.code === '200') {
                this.orderMacs = res.data
                // const api = "/board/codeBind/countByOrderNum";
                countByOrderNum(this.form.orderId).then((res) => {
                  if (res.code === '200') {
                    this.isStart = true
                    this.isMacStart = true
                    this.clearData = false
                    this.getDataRule()
                    this.form.bindCount = res.data.bindQuantity
                    setTimeout(() => this.$refs.inputMac.focus())
                  } else {
                    this.$message.error('该订单号未查询到数据')
                    return false
                  }
                })
              } else {
                this.$message.error(res.msg.join(', '))
                return false
              }
            })
            .finally(() => {
              this.loading = false
            })
        })
      } catch (error) {
        console.log('连接客户端失败！')
      }
    },

    getDataRule() {
      const params = {
        type: 1,
        bindData: this.form.orderId
      }

      // const api = "/data/rule/get";
      getDataRule(params).then((res) => {
        if (res.code === '200') {
          if (res.data != null && res.data.length > 0) {
            this.fieldRuleList = res.data
            this.isSetting = true
          } else {
            this.visible = true
            this.isStart = false
          }
        }
      })
    },

    saveDataRule() {
      const params = {
        type: 1,
        bindData: this.form.orderId,
        fieldRuleList: this.fieldRuleList
      }

      // const api = "/data/rule/save";
      savaDataRule(params).then((res) => {
        if (res.code === '200') {
          if (res.data) {
            this.$message.success('保存数据规则成功！')
            this.visible = false
            this.isStart = true
            this.isSetting = true
          }
        } else {
          this.$message.error('保存数据规则失败！' + res.msg.join('，'))
        }
      })
    },

    async handleStop() {
      this.form.orderId = undefined
      this.form.bindQuantity = undefined
      this.form.checked = false
      this.isStart = false
      this.tsnStart = false
      this.isSetting = false
      this.clearData = true
      this.resetData()
    },

    checkLabel(field, value) {
      debugger
      if (!this.isSetting) {
        this.visible = true
      } else {
        var result = true
        this.setFiledEnable(field, false)
        // if (field === 'tsn') {
        //   // tsn前缀为订单号,不能包含小写字母
        //   // const prefix = this.form.orderId
        //   // if (prefix !== value.slice(0, prefix.length)) {
        //   //   this.playAudio(1, 'tsnScanFail')
        //   //   this.printMsg('扫描失败：tsn前缀必须为订单号', 'failure')
        //   //   result = false
        //   // }
        //   if (value.length < 12) {
        //     this.printMsg('扫描失败：tsn必须12位', 'failure')
        //     result = false
        //   }
        //   if (/[a-z]/.test(value)) {
        //     this.playAudio(1, 'tsnScanFail')
        //     this.printMsg('扫描失败：tsn不能包含小写字母', 'failure')
        //     result = false
        //   }
        // }

        try {
          this.fieldRuleList.forEach((fieldRule) => {
            if (fieldRule.fieldName === field) {
              // 校验标签格式
              if (
                fieldRule.fieldLength > 0 &&
                value.length !== fieldRule.fieldLength
              ) {
                this.playAudio(1, field + 'ScanFail')
                this.printMsg(

                   
                  'Vinculacao Falha（扫描失败）：' +
                    fieldRule.fieldDesc +
                    // '必须为' +
                    fieldRule.fieldLength +
                    'digitos',
                  'failure'
                )
                result = false
                throw new Error('退出循环')
              } else if (
                fieldRule.fieldPrefix &&
                fieldRule.fieldPrefix !== ''
              ) {
                // bosa、bosa2前缀可能有多种，多个前缀中间用,隔开
                if (field == 'bosasn' || field == 'bosasn2') {
                  result = false
                  let bosasnArr = fieldRule.fieldPrefix.split(',')
                  bosasnArr.forEach((item) => {
                    const prefixItem = value.slice(0, item.length)
                    if (prefixItem == item) {
                      result = true
                      throw new Error('退出循环')
                    }
                  })
                  if (!result) {
                    this.printMsg(
                       'Vinculacao Falha（扫描失败）：' +
                    fieldRule.fieldDesc +
                    " ser de "+
                    fieldRule.fieldPrefix ,
                  'failure'
                    )
                    this.playAudio(1, field + 'ScanFail')
                    throw new Error('退出循环')
                  }
                } else {
                  const prefix = value.slice(0, fieldRule.fieldPrefix.length)
                  if (prefix !== fieldRule.fieldPrefix) {
                    this.printMsg(
                        'Vinculacao Falha（扫描失败）：' +
                    fieldRule.fieldDesc +
                    " ser de "+
                    fieldRule.fieldPrefix ,
                  'failure'
                    )
                    this.playAudio(1, field + 'ScanFail')
                    result = false
                    throw new Error('退出循环')
                  }
                }
              }
            }
          })
        } catch (e) {}

        if (result) {
          // 校验是否绑定
          this.checkBind(field, value)
        } else {
          this.setFiledEnable(field, true)
        }
      }
    },

    checkBind(field, value) {
      debugger

      let params = {}
      if (field === 'mac') {
        params = {
          orderNum: this.form.orderId,
          mac: value
        }
        this.tsn=value
      } else if (field === 'bosasn') {
        params = {
          orderNum: this.form.orderId,
          bosasn: value
        }
      } else if (field === 'bosasn2') {
        params = {
          orderNum: this.form.orderId,
          bosasn2: value
        }
      }

      // currentField = false;
      // const api = "/board/codeBind/page";
      pageBindList(params).then((res) => {
        if (res.code === '200') {
          if (res.data.length > 0) {
            this.printMsg(value + '  ja vinculado, nao repita a operacao（已经绑定，请勿重复操作）！', 'failure')
            this.playAudio(1, 'repeatBind')
            this.setFiledEnable(field, true)
          } else {
            // if (field === 'tsn') {
            //   this.isMacStart = true
            //   this.tsnStart = false
            //   setTimeout(() => this.$refs.inputMac.focus())
            //   this.printMsg('扫描成功：' + value)
            // } else
             if (field === 'mac') {
              this.checkMac()
              setTimeout(() => this.$refs.inputBosasn.focus())
            } else if (field === 'bosasn') {
              this.printMsg('扫描成功：' + value)
              
              this.doBind()
             
            } else {
              this.printMsg('扫描成功：' + value)
              this.doBind()
            }
          }
        } else {
          this.setFiledEnable(field, true)
        }
      })
    },

    setFiledEnable(field, value) {
      if (field === 'tsn') {
        this.tsnStart = value
        if (value) {
          this.tsn = ''
          setTimeout(() => this.$refs.inputTsn.focus())
        }
      } else if (field === 'mac') {
        this.isMacStart = value
        if (value) {
          this.mac = ''
          setTimeout(() => this.$refs.inputMac.focus())
        }
      } else if (field === 'bosasn') {
        this.isBosasnStart = value
        if (value) {
          this.bosasn = ''
          setTimeout(() => this.$refs.inputBosasn.focus())
        }
      } else if (field === 'bosasn2') {
        this.isBosasn2Start = value
        if (value) {
          this.bosasn2 = ''
          setTimeout(() => this.$refs.inputBosasn2.focus())
        }
      }

      if (value && this.chkClearData) {
        // 扫描错误清空全部信息，鼠标光标回到tsn，mac，bosasn，bosasn2输入框禁用
        this.bosasn2 = ''
        this.bosasn = ''
        this.mac = ''
        this.tsn = ''
        this.tsnStart = true
        this.isMacStart = false
        this.isBosasnStart = false
        this.isBosasn2Start = false
        setTimeout(() => this.$refs.inputMac.focus())
      }
    },

    checkMac() {
      if (this.orderMacs.includes(this.mac)) {
        this.isBosasnStart = true
        this.printMsg('扫描成功：' + this.mac)
       
      } else {
        this.printMsg('Falha: MAC nao pertence a esta ordem（扫描失败,该mac不属于该订单)', 'failure')
        this.setFiledEnable('mac', true)
      }
    },

    doBind() {
      const params = {
        orderNum: this.form.orderId,
        bosasn: this.bosasn,
        mac: this.mac,
        tsn: this.mac,
        bosasn2: this.bosasn2,
        username: 'admin',
        reform: this.form.checked
      }
      debugger
      
      doBindNum(params).then((res) => {
        if (res.code === '200') {
          this.printMsg('Vinculacao OK（绑定成功）！', 'success')

          this.isStart = true
          this.isMacStart = true
          this.clearData = false
          this.tsn = ''
          this.mac = ''
          this.bosasn = ''
          this.form.bindCount=res.data

          setTimeout(() => this.$refs.inputMac.focus())
        } else {
          this.playAudio(1, 'bindFail')
          this.printMsg('绑定失败：' + res.msg.join(','), 'failure')
          this.setFiledEnable('bosasn', true)
          
        }
      })
    },

    printMsg(msg, type) {
      if (type === 'success') {
        this.messageList.unshift({
          msg: msg,
          type: 'success'
        })
      } else if (type === 'failure') {
        this.messageList.unshift({
          msg: msg,
          type: 'failure'
        })
      } else {
        this.messageList.unshift({
          msg: msg,
          type: ''
        })
      }
    },

    playAudio(times, id) {
      debugger
      var audio = document.getElementById(id)
      var start = 0
      audio.addEventListener('ended', () => {
        audio.play()
        start++
        start === times && audio.pause()
      })
      audio.play()
    },

    resetData(num) {
      this.isMacStart = false
      this.isBosasnStart = false
      this.isBosasn2Start = false
      this.tsn = ''
      this.mac = ''
      this.bosasn = ''
      this.bosasn2 = ''
      this.form.bindCount = num
    },

    resume() {
      this.messageList = []
      this.isMacStart = false
      this.isBosasnStart = false
      this.isBosasn2Start = false
      this.mac = ''
      this.bosasn = ''
      this.bosasn2 = ''
    }
  }
}
</script>

<style>
.el-form .el-select,
.el-form .el-input-number {
  display: inline-block;
  position: relative;
  width: 179px;
}

.el-dialog {
  width: 750px;
}
</style>
