<template>
  <el-card class="box-card">
    <el-tabs v-model="tabIndex" @tab-click="handleTabClick">
      <el-tab-pane :label="$t('markAsRepair.menu1')" name="second">
        <div class="ContractInfo">
          <el-form
            size="small"
            :model="terminalFormsearch"
            ref="terminalFormsearch"
            label-width="100px"
            style="width: 100%"
            :inline="true"
            @submit.native.prevent
            @keyup.native.enter="terminalsearch"
            @sort-change="sortChangeBad"
          >
            <el-form-item label="orderNo" prop="orderNo">
              <el-input v-model.trim="terminalFormsearch.orderNo"></el-input>
            </el-form-item>
            <el-form-item label="MAC" prop="mac">
              <el-input v-model.trim="terminalFormsearch.mac"></el-input>
            </el-form-item>
            <el-form-item label="TSN" prop="tsn">
              <el-input v-model.trim="terminalFormsearch.tsn"></el-input>
            </el-form-item>
            <el-button size="small" type="primary" icon="el-icon-search" plain @click="terminalsearch()"> {{ $t('markAsRepair.queryBtn') }} </el-button>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd('open1')"> {{ $t('markAsRepair.addFail') }} </el-button>
          </el-form>

          <!-- 列表 -->
          <el-table :data="terminalFormIofo" border style="width: 100%" size="small">
            <el-table-column type="index" width="50" align="center"> </el-table-column>
            <el-table-column prop="createDate" :label="$t('markAsRepair.createDate')" align="center" width="150" sortable></el-table-column>
            <el-table-column prop="cuser" :label="$t('markAsRepair.cuser')" align="center" width="100"></el-table-column>
            <el-table-column prop="mocode" label="orderNo" align="center"></el-table-column>
            <el-table-column prop="rcard" label="TSN" align="center" width="120" sortable></el-table-column>
            <el-table-column prop="mac" label="MAC" align="center" width="120" sortable></el-table-column>
            <el-table-column prop="testPositionNumber" label="testPositionNumber" align="center"></el-table-column>
            <el-table-column prop="content" label="content" align="center"></el-table-column>
            <el-table-column prop="eclStr" :label="$t('markAsRepair.eclStr')" align="center" width="150"></el-table-column>
            <el-table-column prop="status" :label="$t('markAsRepair.status')" align="center" width="120">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status == 0" type="danger">{{$t('markAsRepair.bad')}}</el-tag>
                <el-tag v-else-if="scope.row.status == 1" type="success">{{$t('markAsRepair.good')}}</el-tag>
                <el-tag v-else-if="scope.row.status == 2" type="warning">{{$t('markAsRepair.mesbad')}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="recordType" label="Source" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.recordType == '1'">{{$t('markAsRepair.auto')}}</el-tag>
                <el-tag v-else type="warning">{{$t('markAsRepair.manual')}}</el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="mesResultStr" label="MES打不良结果" align="center" width="160">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.mesResult == 1" type="success">{{ scope.row.mesResultStr }}</el-tag>
                <el-tag v-else type="warning">{{ scope.row.mesResultStr }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="mesMsg" :show-overflow-tooltip="true" label="MES打不良返回消息" align="center" width="200"></el-table-column>
            <el-table-column prop="mesStatusStr" label="MES维修返回消息" align="center" width="120">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.mesStatus == 1" type="warning">{{ scope.row.mesStatusStr }}</el-tag>
                <el-tag v-else type="error">{{ scope.row.mesStatusStr }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="optSource" label="操作源" align="center"></el-table-column>
            <el-table-column prop="optUser" label="人员" align="center" width="100"></el-table-column>
            <el-table-column prop="optDate" label="操作日期" align="center" width="150"></el-table-column> -->
            <el-table-column prop="itemName" label="itemName" align="center" width="120"></el-table-column>
            <el-table-column prop="errorCode" label="errorCode" align="center" width="100"></el-table-column>
            <el-table-column prop="ngcount" label="ngcount" align="center"></el-table-column>
            <el-table-column prop="line" label="line" width="120" align="center"></el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <!-- <pagination :total="total1" :page.sync="terminalFormsearch.pageIndex" :limit.sync="terminalFormsearch.pageSize" @pagination="getterminalForm" /> -->
 <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
       
            :current-page="terminalFormsearch.pageIndex"
            :page-size="terminalFormsearch.pageSize"
             :page-sizes="[10, 20, 50, 100]" 
            layout="total, sizes, prev, pager, next, jumper" :total="total1">
          </el-pagination>

          <el-dialog v-loading.fullscreen.lock="loading" :title="$t('markAsRepair.addFailTitle')" :visible.sync="open1" width="900px" :close-on-click-modal="false" :append-to-body="true" @closed="reset1">
            <el-form size="small" :model="terminalForm" ref="terminalForm" label-width="125px" style="width: 100%">
              <el-row>
                <el-col :span="16">
                  <el-form-item :label="$t('markAsRepair.addFailTsnInput')" prop="label">
                    <el-input
                      ref="boardFailMac"
                      type="textarea"
                      max="500"
                      :disabled="terminalForm.labelDisabled"
                      :autosize="{ minRows: 2, maxRows: 3 }"
                      v-model.trim="terminalForm.label"
                      @keyup.enter.native="onBoardFailMacChange"
                      :placeholder="$t('markAsRepair.addFailTsnInputMsg')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button style="margin-left: 10px" size="small" type="primary" plain @click="onBoardFailMacChange()"> {{$t('markAsRepair.inputBtn')}} </el-button>
                </el-col>
              </el-row>
              <!-- <div class="upload-tips">
                <div class="el-upload-tip">说明：</div>
                <div class="el-upload-tip" style="text-indent: 2em">
                  <div>1.可连续扫描多个MAC 或 TSN；未查询到测试记录不能打不良；已录入的条码可点击按钮删除</div>
                  <div>2.不良原因不能为空，未匹配到不良原因，请手动选择</div>
                  <div>3.批量从Excel复制的条码，请用分号(;)或换行隔开，否则会解析失败</div>
                  <div>4.重复的条码会自动过滤</div>
                  <div>5.MES打不良失败，PTM会新增一条失败的打不良记录！</div>
                </div>
              </div> -->
            </el-form>
            <el-row>
              <el-col :span="14">
                <div style="position: relative; margin-right: 5px">
                  <div class="label-input-title" style="">{{$t('markAsRepair.inputBtnMsg')}}</div>
                  <div class="label-input-div">
                    <el-table :data="boardTestFailList" border style="width: 100%" size="small" height="400">
                      <el-table-column type="index" width="30" label="" align="center"></el-table-column>
                      <el-table-column prop="type" width="50" label="type" align="center"></el-table-column>
                      <el-table-column prop="label" width="120" :show-overflow-tooltip="true" :label="$t('markAsRepair.label')" align="center"></el-table-column>
                      <el-table-column prop="reason" :label="$t('markAsRepair.reason')" align="center">
                        <template slot-scope="scope">
                          <el-select size="mini" v-model="scope.row.reason" :placeholder="$t('markAsRepair.selecttitle')">
                            <el-option v-for="(item, index) in failReason" :key="index" :value="item.code" :label="item.name"> {{ item.name }}</el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column fixed="right" :label="$t('markAsRepair.delBtn')" width="50" align="center" size="mini">
                        <template slot-scope="scope">
                          <el-button class="fail-del-btn" size="mini" type="danger" icon="el-icon-delete" circle @click="deleteTestFailInput(scope.row)"></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-col>
              <el-col :span="10">
                <div style="position: relative">
                  <div style="position: absolute; left: 15px; top: -12px; background: #fff; padding: 0 10px">{{ $t('markAsRepair.processMsg') }}</div>
                  <div class="label-input-div">
                    <div v-for="(item, index) in messageList" :key="index">
                      <span v-if="item.type === 'success'" style="color: #67c23a; font-size: 18px">{{ item.msg }}</span>
                      <span v-else-if="item.type === 'failure'" style="color: #f56c6c">{{ item.msg }}</span>
                      <span v-else>{{ item.msg }}</span>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>

            <div slot="footer" class="dialog-footer">
              <el-button @click="reset1" size="small">{{$t('markAsRepair.cancelBtn')}}</el-button>
              <el-button type="primary" @click="submitTerminalForm" size="small">{{$t('markAsRepair.submitBtn')}}</el-button>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="$t('markAsRepair.menu2')" name="third">
        <div class="ContractInfo">
          <el-form
            size="small"
            :model="maintainlFormsearch"
            ref="maintainlFormsearch"
            label-width="100px"
            style="width: 100%"
            :inline="true"
            @submit.native.prevent
            @keyup.native.enter="maintainsearch"
          >
            <el-form-item label="orderNo" prop="orderNo">
              <el-input v-model.trim="maintainlFormsearch.orderNo"></el-input>
            </el-form-item>
            <el-form-item label="MAC" prop="mac">
              <el-input v-model.trim="maintainlFormsearch.mac"></el-input>
            </el-form-item>
            <el-form-item label="TSN" prop="tsn">
              <el-input v-model.trim="maintainlFormsearch.tsn"></el-input>
            </el-form-item>
            <el-button size="small" type="primary" icon="el-icon-search" plain @click="maintainsearch()"> {{ $t('markAsRepair.queryBtn') }} </el-button>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd('open2')"> {{ $t('markAsRepair.addRepair') }} </el-button>
          </el-form>

          <el-table :data="maintainlFormInfo" border style="width: 100%" size="small" @sort-change="sortChangeMac">
            <el-table-column type="index" width="50" align="center"> </el-table-column>
            <el-table-column prop="tsn" label="TSN" align="center" sortable></el-table-column>
            <el-table-column prop="mac" label="MAC" align="center" sortable></el-table-column>
            <el-table-column prop="ordernumber" label="orderNo" align="center"></el-table-column>
            <el-table-column prop="testpostionnumber" label="testpostionnumber" align="center"></el-table-column>
            <el-table-column prop="servicenum" :label="$t('markAsRepair.servicenum')" align="center"></el-table-column>
            <el-table-column prop="personname" label="personname" align="center"></el-table-column>
            <el-table-column prop="datetime" :label="$t('markAsRepair.datetime')"  align="center" sortable></el-table-column>
            <!-- <el-table-column prop="serviceresult" label="维修结果" align="center"></el-table-column> -->
          </el-table>
          <!-- 分页组件 -->
          <!-- <pagination :total="total2" :page.sync="maintainlFormsearch.pageIndex" :limit.sync="maintainlFormsearch.pageSize" @pagination="getmaintainlFormInfo" /> -->
   <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
       
            :current-page="maintainlFormsearch.pageIndex"
            :page-size="maintainlFormsearch.pageSize"
             :page-sizes="[10, 20, 50, 100]" 
            layout="total, sizes, prev, pager, next, jumper" :total="total2">
          </el-pagination>
          <!-- 新建维修 -->
          <el-dialog v-loading.fullscreen.lock="loading" :title="$t('markAsRepair.addRepair')" :visible.sync="open2" width="900px" :close-on-click-modal="false" :append-to-body="true" @closed="reset2">
            <el-form size="small" :model="maintainlForm" ref="maintainlForm" label-width="125px" style="width: 100%">
              <el-row>
                <el-col :span="16">
                  <el-form-item :label="$t('markAsRepair.addFailTsnInput')" prop="label">
                    <el-input
                      ref="boardMac"
                      type="textarea"
                      max="500"
                      :disabled="maintainlForm.labelDisabled"
                      :autosize="{ minRows: 2, maxRows: 3 }"
                      v-model.trim="maintainlForm.label"
                      @keyup.enter.native="onBoardMacChange"
                      :placeholder="$t('markAsRepair.addFailTsnInputMsg')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button style="margin-left: 10px" size="small" type="primary" plain @click="onBoardMacChange()"> {{$t('markAsRepair.inputBtn')}} </el-button>
                </el-col>
              </el-row>
            </el-form>
            <el-row>
              <el-col :span="14">
                <div style="position: relative; margin-right: 5px">
                  <div class="label-input-title" style=""> {{$t('markAsRepair.inputBtnMsg')}} </div>
                  <div class="label-input-div">
                    <el-table :data="boardTestMacList" border style="width: 100%" size="small" height="400">
                      <el-table-column type="index" width="30" label="" align="center"></el-table-column>
                      <el-table-column prop="type" width="50" label="type" align="center"></el-table-column>
                      <el-table-column prop="label" width="120" :show-overflow-tooltip="true" :label="$t('markAsRepair.label')" align="center"></el-table-column>
                      <el-table-column prop="reason" label="$t('markAsRepair.repairreason')" align="center">
                        <template slot-scope="scope">
                          <el-select size="mini" v-model="scope.row.reason">
                            <el-option v-for="(item, index) in maintainReason" :key="index" :value="item.configKey" :label="item.configValue"> {{ item.configValue }}</el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column fixed="right" label="删除" width="50" align="center" size="mini">
                        <template slot-scope="scope">
                          <el-button class="fail-del-btn" size="mini" type="danger" icon="el-icon-delete" circle @click="deleteBoardMacInput(scope.row)"></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-col>
              <el-col :span="10">
                <div style="position: relative">
                  <div style="position: absolute; left: 15px; top: -12px; background: #fff; padding: 0 10px">{{ $t('markAsRepair.processMsg') }}</div>
                  <div class="label-input-div">
                    <div v-for="(item, index) in messageList" :key="index">
                      <span v-if="item.type === 'success'" style="color: #67c23a; font-size: 18px">{{ item.msg }}</span>
                      <span v-else-if="item.type === 'failure'" style="color: #f56c6c">{{ item.msg }}</span>
                      <span v-else>{{ item.msg }}</span>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>

            <div slot="footer" class="dialog-footer">
              <el-button @click="reset2" size="small">取 消</el-button>
              <el-button type="primary" @click="submitmaintainlForm" size="small">提 交</el-button>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
const APP_URL = "";
// const APP_URL = "http://localhost:8099";
const HEADER = {
  headers: {
    "Access-Control-Allow-Credentials": true,
    withCredentials: false,
  },
};
export default {
  name: "ContractInfo",
 
  data() {
    return {
      tabIndex: "second",
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      total1: 0,
      total2: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      open1: false,
      open2: false,
      // 查询参数
      queryParams: {
        orderId: null,
        pageIndex: 1,
        pageSize: 10,
        process: null,
      },
      // 表格数据
      list: [],
      processtype: [],
      // 勾选的表格数据
      multipleSelection: [],
      // 表单参数
      form: {
        orderId: "",
        sn: "",
        process: "",
      },
      terminalFormsearch: {
        mac: null,
        orderNo: null,
        tsn: "",
        pageIndex: 1,
        pageSize: 10,
        sortName: "",
        sortType: "",
      },
      terminalForm: {
        label: "",
        labelDisabled: false,
        checkResult: [],
      },
      terminalFormIofo: [],
      failReason: [
        {
          'code' : '0',
          'name' : this.$t('markAsRepair.failReason0')
        },{
          'code' : '1',
          'name' : this.$t('markAsRepair.failReason1')
        },{
          'code' : '2',
          'name' : this.$t('markAsRepair.failReason2')
        },{
          'code' : '3',
          'name' : this.$t('markAsRepair.failReason3')
        },{
          'code' : '4',
          'name' : this.$t('markAsRepair.failReason4')
        },{
          'code' : '5',
          'name' : this.$t('markAsRepair.failReason5')
        },{
          'code' : '6',
          'name' : this.$t('markAsRepair.failReason6')
        },{
          'code' : '7',
          'name' : this.$t('markAsRepair.failReason7')
        },{
          'code' : '8',
          'name' : this.$t('markAsRepair.failReason8')
        },{
          'code' : '9',
          'name' : this.$t('markAsRepair.failReason9')
        },{
          'code' : '10',
          'name' : this.$t('markAsRepair.failReason10')
        },
      ],
      maintainlForm: {
        label: "",
        labelDisabled: false,
        checkResult: [],
      },
      maintainlFormsearch: {
        mac: null,
        tsn: null,
        orderNo: null,
        pageIndex: 1,
        pageSize: 10,
        sortName: "",
        sortType: "",
      },
      maintainlFormInfo: [],
      maintainReason: [
        {
        'configKey':'0',
        'configValue': this.$t('markAsRepair.repairreason0')
      },
      {
        'configKey':'1',
        'configValue': this.$t('markAsRepair.repairreason1')
      },
      {
        'configKey':'2',
        'configValue': this.$t('markAsRepair.repairreason2')
      },
      {
        'configKey':'3',
        'configValue': this.$t('markAsRepair.repairreason3')
      },
      {
        'configKey':'4',
        'configValue': this.$t('markAsRepair.repairreason4')
      },
      {
        'configKey':'5',
        'configValue': this.$t('markAsRepair.repairreason5')
      }
    ],
      // 表单校验
      rules: {
        orderId: [{ required: true, message: this.$t('markAsRepair.msg1'), trigger: "blur" }],
        sn: [{ required: true, message: this.$t('markAsRepair.msg2'), trigger: "blur" }],
        process: [{ required: true, message: this.$t('markAsRepair.msg3'), trigger: "blur" }],
      },
      terminalFormrules: {
        mac: [
          { required: true, message: this.$t('markAsRepair.msg4'), trigger: "blur" },
          { min: 12, max: 12, message: this.$t('markAsRepair.msg5'), trigger: "blur" },
        ],
      },
      maintainlFormrules: {
        // mac: [
        //   { required: true, message: "请输入mac", trigger: "blur" },
        //   { min: 12, max: 12, message: "长度为12个字符", trigger: "blur" },
        // ],
      },
      // 批量打不良
      boardTestFailList: [],
      // 批量打不良
      boardTestMacList: [],
      // 过程信息
      messageList: [],
    };
  },
  // 计算属性
  computed: {},
  watch: {},
  // 生命周期 - 创建完成（访问当前this实例）
  async created() {
    // this.getFailReasonList();
    this.getterminalForm();
    this.getmaintainlFormInfo();
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.terminalFormsearch.pageSize = val;
          this.getterminalForm();
    },
    handleCurrentChange(val) {
      this.terminalFormsearch.pageIndex = val;
      this.getterminalForm();
    },
    
    handleSizeChange2(val) {
      this.maintainlFormsearch.pageSize = val;
      this.getmaintainlFormInfo();
    },
    handleCurrentChange2(val) {
      this.maintainlFormsearch.pageIndex = val;
      this.getmaintainlFormInfo();
    },



    handleTabClick(tab, event) {
      console.log(tab, event);
      if (tab == "second") {
        console.log(tab, event);
      } else if (tab == "third") {
        console.log(tab, event);
      }
    },
    // 查询所有不良原因
    getFailReasonList() {
      const api = APP_URL + "/boardtest/queryTestFailReason";
      return this.$http.post(api, null, null, HEADER).then((res) => {
        if (res.code === "200") {
          if (res.data != null) {
            this.failReason = res.data;
          }
        } else {
          this.$message.error(res.msg.join("，"));
        }
      });
    },

    getterminalForm() {
      const searchapi = APP_URL + "/boardtest/pageTerminalBadRecord";
      this.$http.post(searchapi, { ...this.terminalFormsearch }, null, HEADER).then((res) => {
        console.log(res);
        if (res.code === "200") {
          this.terminalFormIofo = res.data;
          this.total1 = res.total;
          this.loading = false;
        } else {
          this.$message.error(res.msg.join("，"));
          this.loading = false;
        }
      });
    },
    getmaintainlFormInfo() {
      debugger;
      const searchapi = APP_URL + "/boardtest/pageBoardMac";
      this.$http.post(searchapi, { ...this.maintainlFormsearch }, null, HEADER).then((res) => {
        console.log(res);
        res.data.map((item) => {
          if (item.serviceresult == "0") {
            item.serviceresult = this.$t('markAsRepair.failmsg');
          } else if (item.serviceresult == "1") {
            item.serviceresult = this.$t('markAsRepair.successmsg');
          }
        });
        if (res.code === "200") {
          this.maintainlFormInfo = res.data;
          this.total2 = res.total;
          this.loading = false;
        } else {
          this.$message.error(res.msg.join("，"));
          this.loading = false;
        }
      });
    },
    /** 新增按钮操作 */
    handleAdd(names) {
      debugger;
      this[names] = true;
      this.title = this.$t('markAsRepair.addmsg');
      this.messageList = [];
      if (names == "open1") {
        this.boardTestFailList = []
        this.boardFailMacFocus();
        this.printMsg(this.$t('markAsRepair.intpumsg'));
      } else if (names == "open2") {
        this.boardTestMacList = []
        this.boardMacFocus();
        this.printMsg(this.$t('markAsRepair.intpumsg'));
      }
    },
    /** 提交按钮 */
    async submitForm() {
      try {
        this.$refs["form"].validate(async (valid) => {
          if (!valid) return;
          this.$confirm(this.$t('markAsRepair.confirmmsg1'), this.$t('markAsRepair.noticemsg'), {
            confirmButtonText: this.$t('markAsRepair.confirmBtn'),
            cancelButtonText: this.$t('markAsRepair.cancelBtn'),
            type: "warning",
          }).then(() => {
            const insertapi = "/assembly/badinfo/save";
            this.$http.post(APP_URL + insertapi, { ...this.form }, null, HEADER).then((res) => {
              console.log(res);
              if (res.code === "200") {
                if (res.data != null) {
                  this.getList();
                  this.open = false;
                  this.loading = false;
                  this.$message.success(this.$t('markAsRepair.successmsg'));
                }
              } else {
                this.$message.error(res.msg.join("，"));
                this.loading = false;
              }
            });
          });
        });
      } catch (error) {
        console.log(error);
      }
    },
    /** 删除按钮操作 */
    handleDelete() {},
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    // 重置表单
    reset() {
      this.$refs.form.resetFields();
    },
    reset1() {
      this.$refs.terminalForm.resetFields();
      this.open1 = false;
    },
    reset2() {
      this.$refs.maintainlForm.resetFields();
    },
    reset3() {
      this.$refs.maintainlForm.resetFields();
      this.open2 = false;
    },
    search() {
      if (this.queryParams.orderId == "") this.queryParams.orderId = null;
      if (this.queryParams.process == "") this.queryParams.process = null;
      this.queryParams.pageIndex = 1;
      this.getList();
    },
    terminalsearch() {
      this.terminalFormsearch.pageIndex = 1;
      this.getterminalForm();
    },
    maintainsearch() {
      if (this.maintainlFormsearch.mac == "") this.maintainlFormsearch.mac = null;
      if (this.maintainlFormsearch.orderNo == "") this.maintainlFormsearch.orderNo = null;
      this.maintainlFormsearch.pageIndex = 1;
      this.getmaintainlFormInfo();
    },
    submitTerminalForm() {
      if (!this.checkBoardFailSubmit()) {
        return;
      }
      this.loading = true;
      var interfaceurl = APP_URL + "/boardtest/recordTestFailBatch";
      this.$http.post(interfaceurl, this.boardTestFailList, null, HEADER).then((res) => {
        this.loading = false;
        // todo
        if (res.code === "200") {
          this.$message.success(this.$t('markAsRepair.successmsg'));
          this.clearTestFailInput();
          this.open1 = false;
        } else {
          let msg = res.msg.join("，");
          this.$message.error(msg);
          this.printMsg(msg, "failure");
        }
        this.terminalsearch();
      });
    },
    checkBoardFailSubmit() {
      if (this.boardTestFailList == null || this.boardTestFailList.length == 0) {
        this.printMsg(this.$t('markAsRepair.inputEmptyErr'), "failure");
        return false;
      }
      for (let i = 0; i < this.boardTestFailList.length; i++) {
        let item = this.boardTestFailList[i];
        if (item.reason == null || item.reason == "") {
          let msg = item.label + this.$t('markAsRepair.inputEmptyErr2');
          this.$message.error(msg);
          this.printMsg(msg, "failure");
          return false;
        }
      }
      return true;
    },
    deleteTestFailInput(row) {
      let newList = [];
      for (let i = 0; i < this.boardTestFailList.length; i++) {
        let item = this.boardTestFailList[i];
        if (item.label != row.label) {
          newList.push(item);
        }
      }
      this.boardTestFailList = newList;
    },
    onBoardFailMacChange() {
      if (this.terminalForm.label == "" || this.terminalForm.label == null) {
        let msg = this.$t('markAsRepair.inputEmptyErr3');
        this.printMsg(msg, "failure");
        this.clearTestFailInput();
        return;
      }
      this.terminalForm.label = this.terminalForm.label.replaceAll("\n", ";").replaceAll("\r", ";").replaceAll(" ", ";");
      this.terminalForm.label += ";";
      if (this.checkForExist(this.terminalForm.label, this.boardTestFailList)) {
        // 条码已存在
        let msg = this.$t('markAsRepair.inputEmptyErr4') + this.terminalForm.label;
        this.printMsg(msg, "failure");
        this.clearTestFailInput();
        return;
      }
      try {
        this.terminalForm.labelDisabled = true;
        this.checkLastTestRecord(this.terminalForm.label);
      } catch (error) {
        console.log(error);
        let msg = this.$t('markAsRepair.inputEmptyErr5') + this.terminalForm.label;
        this.printMsg(msg, "failure");
        this.clearTestFailInput();
      }
    },
    checkLastTestRecord(label) {
      var interfaceUrl = APP_URL + "/boardtest/checkLabelForFail?label=" + label;
      this.$http.get(interfaceUrl, null, null, HEADER).then((res) => {
        //todo
        if (res.code === "200" && res.data !== null) {
          this.terminalForm.checkResult = res.data;
          this.setTestFailInput(this.terminalForm.checkResult);
        } else {
          let msg = this.$t('markAsRepair.inputEmptyErr6') + res.msg.join("，");
          this.printMsg(msg, "failure");
          this.clearTestFailInput();
        }
      });
    },
    setTestFailInput(checkResultList) {
      for (let i = 0; i < checkResultList.length; i++) {
        let checkResult = checkResultList[i];
        if (this.checkForExist(checkResult.label, this.boardTestFailList)) {
          // 条码已存在
          let msg = this.$t('markAsRepair.inputEmptyErr7') + checkResult.label;
          this.printMsg(msg, "failure");
        } else {
          let item = {
            type: checkResult.type,
            label: checkResult.label,
            reason: checkResult.reason,
          };
          let msg = this.$t('markAsRepair.inputMsg8') + checkResult.label;
          if (checkResult.reason == null || checkResult.reason == "") {
            msg += this.$t('markAsRepair.inputMsg9');
          }
          this.printMsg(msg, "success");
          this.boardTestFailList.push(item);
        }
      }
      this.clearTestFailInput();
    },
    clearTestFailInput() {
      this.terminalForm.label = "";
      this.terminalForm.labelDisabled = false;
      this.terminalForm.checkResult = [];
      this.boardFailMacFocus();
    },
    boardFailMacFocus() {
      this.terminalForm.labelDisabled = false;
      setTimeout(() => {
        this.$refs.boardFailMac.focus();
      });
    },
    checkForExist(label, list) {
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.label == label) {
          return true;
        }
      }
      return false;
    },
    deleteBoardMacInput(row) {
      let newList = [];
      for (let i = 0; i < this.boardTestMacList.length; i++) {
        let item = this.boardTestMacList[i];
        if (item.label != row.label) {
          newList.push(item);
        }
      }
      this.boardTestMacList = newList;
    },
    onBoardMacChange() {
      if (this.maintainlForm.label == "" || this.maintainlForm.label == null) {
        let msg = this.$t('markAsRepair.inputEmptyErr3');
        this.printMsg(msg, "failure");
        this.clearTestMacInput();
        return;
      }
      this.maintainlForm.label = this.maintainlForm.label.replaceAll("\n", ";").replaceAll("\r", ";").replaceAll(" ", ";");
      this.maintainlForm.label += ";";
      if (this.checkForExist(this.maintainlForm.label, this.boardTestMacList)) {
        // 条码已存在
        let msg = this.$t('markAsRepair.inputEmptyErr4') + this.maintainlForm.label;
        this.printMsg(msg, "failure");
        this.clearTestMacInput();
        return;
      }
      try {
        this.maintainlForm.labelDisabled = true;
        this.checkLabelForMac(this.maintainlForm.label);
      } catch (error) {
        console.log(error);
        let msg = this.$t('markAsRepair.inputEmptyErr5') + this.maintainlForm.label;
        this.printMsg(msg, "failure");
        this.clearTestMacInput();
      }
    },
    checkLabelForMac(label) {
      var interfaceUrl = APP_URL + "/boardtest/checkLabelForMac?label=" + label;
      this.$http.get(interfaceUrl, null, null, HEADER).then((res) => {
        //todo
        if (res.code === "200" && res.data !== null) {
          this.maintainlForm.checkResult = res.data;
          this.setTestMacInput(this.maintainlForm.checkResult);
        } else {
          let msg = this.$t('markAsRepair.inputEmptyErr5') + res.msg.join("，");
          this.printMsg(msg, "failure");
          this.clearTestMacInput();
        }
      });
    },
    setTestMacInput(checkResultList) {
      for (let i = 0; i < checkResultList.length; i++) {
        let checkResult = checkResultList[i];
        if (this.checkForExist(checkResult.label, this.boardTestMacList)) {
          // 条码已存在
          let msg = this.$t('markAsRepair.inputEmptyErr7') + checkResult.label;
          this.printMsg(msg, "failure");
        } else {
          let item = {
            type: checkResult.type,
            label: checkResult.label,
            reason: checkResult.reason,
          };
          let msg = this.$t('markAsRepair.inputMsg8') + checkResult.label;
          this.printMsg(msg, "success");
          this.boardTestMacList.push(item);
        }
      }
      this.clearTestMacInput();
    },
    clearTestMacInput() {
      this.maintainlForm.label = "";
      this.maintainlForm.labelDisabled = false;
      this.maintainlForm.checkResult = [];
      this.boardMacFocus();
    },
    boardMacFocus() {
      this.maintainlForm.labelDisabled = false;
      setTimeout(() => {
        this.$refs.boardMac.focus();
      });
    },
    submitmaintainlForm() {
      if (this.boardTestMacList == null || this.boardTestMacList.length == 0) {
        this.printMsg(this.$t('markAsRepair.inputEmptyErr'), "failure");
        return;
      }
      var interfaceurl = APP_URL + "/boardtest/markAsRepairBatch";
      this.$http
        .post(
          interfaceurl,
          this.boardTestMacList,
          null,
          HEADER
        )
        .then((res) => {
          //todo
          if (res.code === "200") {
            this.$message.success(this.$t('markAsRepair.successmsg'));
            this.clearTestMacInput();
            this.open2 = false;
          } else {
            let msg = res.msg.join("，");
            this.$message.error(msg);
            this.printMsg(msg, "failure");
          }
          this.maintainsearch();
        });
    },
    clearValue() {
      this.queryParams.process = null;
    },
    // 导出功能
    exportDataBad() {
      if (!this.terminalFormsearch.orderNo && !this.terminalFormsearch.mac && !this.terminalFormsearch.tsn) {
        this.$message.warning(this.$t('markAsRepair.inputMsg10'));
        return;
      }
      this.terminalsearch();
      let config = {
        header: HEADER.headers,
        timeout: 30 * 60 * 1000,
        onTimeout: () => {
          this.$message.error(this.$t('markAsRepair.inputMsg10'));
        },
      };
      const api = APP_URL + "/board/export/export?exportType=" + 1;
      this.$http.postBlob(api, { ...this.terminalFormsearch }, null, config).then(async (res) => {
        this.handleDownLoadFile(res, this.$t('markAsRepair.inputMsg12') + ".xlsx");
      });
    },
    // 导出功能
    exportDataBoardMac() {
      if (!this.maintainlFormsearch.orderNo && !this.maintainlFormsearch.mac && !this.maintainlFormsearch.tsn) {
        this.$message.warning(this.$t('markAsRepair.inputMsg10'));
        return;
      }
      this.maintainsearch();
      let config = {
        header: HEADER.headers,
        timeout: 30 * 60 * 1000,
        onTimeout: () => {
          this.$message.error(this.$t('markAsRepair.inputMsg10'));
        },
      };
      const api = APP_URL + "/board/export/export?exportType=" + 2;
      this.$http.postBlob(api, { ...this.maintainlFormsearch }, null, config).then(async (res) => {
        this.handleDownLoadFile(res, this.$t('markAsRepair.inputMsg13') + ".xlsx");
      });
    },
    handleDownLoadFile(response, fileName) {
      let src = window.URL.createObjectURL(response);
      if (src) {
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = src;
        link.setAttribute("download", decodeURI(decodeURI(fileName)));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // 下载完成移除元素
        window.URL.revokeObjectURL(src); // 释放掉blob对象
        this.downloadResult();
      }
    },
    downloadResult() {
      this.$message.success(this.$t('markAsRepair.inputMsg14'));
    },
    // 排序
    sortChangeBad({ prop, order }) {
      if (prop == "createDate") {
        this.terminalFormsearch.sortName = "create_date";
      } else {
        this.terminalFormsearch.sortName = prop;
      }
      if (order.includes("ascending")) {
        this.terminalFormsearch.sortType = "ASC";
      } else {
        this.terminalFormsearch.sortType = "DESC";
      }

      this.terminalsearch();
    },
    sortChangeMac({ prop, order }) {
      this.maintainlFormsearch.sortName = prop;
      if (order.includes("ascending")) {
        this.maintainlFormsearch.sortType = "ASC";
      } else {
        this.maintainlFormsearch.sortType = "DESC";
      }

      this.maintainsearch();
    },

    //
    printMsg(msg, type) {
      if (type != "success" && this.messageList.length > 50) {
        this.messageList = this.messageList.slice(0, 20);
      }
      msg = this.getTime() + " " + msg;
      if (type === "success") {
        this.messageList.unshift({
          msg: msg,
          type: "success",
        });
      } else if (type === "failure") {
        this.messageList.unshift({
          msg: msg,
          type: "failure",
        });
      } else {
        this.messageList.unshift({
          msg: msg,
          type: "",
        });
      }
    },
    getTime() {
      let date = new Date();
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return h + ":" + m + ":" + s;
    },
  },
};
</script>

<style>
.ContractInfo .el-table__header-wrapper .el-table__cell,
.ContractInfo .el-table__fixed-header-wrapper .el-table__cell {
  background: #fafafa;
}

.el-select {
  display: inline-block;
  position: relative;
  width: 179px;
}

.el-dialog__body {
  padding: 15px 20px !important;
}

.label-input-title {
  position: absolute;
  left: 15px;
  top: -12px;
  background: #fff;
  padding: 0 10px;
}

.label-input-div {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  padding: 5px 0 0 0;
  margin: 20px 0 0 0;
  height: 400px;
  overflow: auto;
  font-size: 18px;
}

.upload-tips {
  margin-top: 10px;
  margin-bottom: 5px;
  border: 1px solid #e1e1e1;
  padding: 5px;
}

.el-upload-tip {
  font-size: 14px;
  color: #a3a3a3;
  vertical-align: bottom;
}

.el-form-item.el-form-item--small {
  margin-bottom: 10px !important;
}
</style>
