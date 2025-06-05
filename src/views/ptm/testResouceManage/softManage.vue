<template>
  <div>
    <el-container>
      <el-main>
        <el-collapse v-model="activeName" accordion @change="changeActiveName">
          <el-collapse-item :title="$t('softManage.boardSoftware')" name="TYPE1">
            <el-form
              ref="searchForm"
              :inline="true"
              label-width="100px"
              size="small"
            >
              <el-form-item :label="$t('softManage.productLine')">
                <el-select
                  v-model="searchForm.productLine"
                  clearable
                  @change="getList(1)"
                >
                  <el-option
                    v-for="item in productTypes"
                    :key="item.id"
                    :value="item.productLine"
                    :label="item.productLine"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('softLunch.softwareName')">
                <el-input
                  v-model.trim="searchForm.softwareName"
                  @keyup.enter.native="getList(1)"
                />
              </el-form-item>
              <el-form-item :label="$t('softManage.uploader')">
                <el-input
                  v-model.trim="searchForm.createUserName"
                  @keyup.enter.native="getList(1)"
                />
              </el-form-item>
              <el-button
                type="primary"
                plain
                size="small"
                icon="el-icon-search"
                @click="getList()"
              >{{ $t('ptmTranslation.search') }}
              </el-button>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-upload2"
                @click="openForm()"
              >{{ $t('softManage.uploadSoftware') }}
              </el-button>
              <el-button
                type="success"
                size="small"
                icon="el-icon-upload2"
                @click="openConfigForm()"
              >{{ $t('softManage.uploadConfig') }}
              </el-button>
            </el-form>

            <el-table ref="table" :data="softwareList" border size="small">
              <el-table-column
                type="index"
                width="50"
                align="center"
              />
              <el-table-column
                prop="productLine"
                :label="$t('softManage.productLine')"
                align="center"
              />
              <el-table-column
                prop="softwareName"
                :label="$t('softLunch.softwareName')"
                align="center"
                min-width="200px"
              >
                <template slot-scope="scope">
                  <el-link
                    type="primary"
                    @click="downloadFile(scope.row.url)"
                  >{{ scope.row.softwareName }}</el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="version"
                :label="$t('softManage.version')"
                align="center"
                min-width="200px"
              />

              <el-table-column
                prop="createDate"
                :label="$t('softManage.uploadTime')"
                align="center"
                width="180px"
              />

              <el-table-column prop="status" :label="$t('softManage.status')" align="center">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status == 0">{{ $t('softManage.disabled') }}</el-tag>
                  <el-tag v-else-if="scope.row.status == 1" type="warning">{{ $t('softManage.toBeVerified') }}</el-tag>
                  <el-tag v-else type="success">{{ $t('softManage.enabled') }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="configFile"
                :label="$t('softManage.configFile')"
                align="center"
                min-width="200px"
              >
                <template v-if="scope.row.boardConfig" slot-scope="scope">
                  <el-link
                    type="primary"
                    @click="downloadFile(scope.row.boardConfig.url)"
                  >
                    {{ scope.row.boardConfig.name }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="remark"
                :label="$t('table.remark')"
                align="center"
              />
              <el-table-column
                prop="createUserName"
                :label="$t('softManage.uploader')"
                align="center"
              />
              <el-table-column
                :label="$t('ptmTranslation.bind')"
                align="center"
                min-width="150px"
              >
                <template slot-scope="scope" width="150">
                  <el-button
                    type="text"
                    size="small"
                    @click="openBindForm(scope.row)"
                  >{{ $t('softManage.bindManage') }}</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="openDriverForm(scope.row)"
                  >{{ $t('softManage.uploadDriver') }}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                :label="$t('table.actions')"
                align="center"
                min-width="150px"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.status == 0"
                    type="text"
                    size="small"
                    @click="changeStatus(scope.row, 1)"
                  >{{ $t('softManage.switchVerifiedMode') }}
                  </el-button>
                  <el-button
                    v-if="scope.row.status == 1"
                    type="text"
                    size="small"
                    @click="changeStatus(scope.row, 2)"
                  >{{ $t('softManage.enabled') }}
                  </el-button>
                  <el-button
                    v-if="scope.row.status == 2"
                    type="text"
                    size="small"
                    @click="changeStatus(scope.row, 0)"
                  >{{ $t('softManage.stop') }}
                  </el-button>
                  <el-button
                    v-if="scope.row.status == 0 || scope.row.status == 1"
                    type="text"
                    size="small"
                    @click="deleteSoftware(scope.row)"
                  >{{ $t('table.delete') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              layout="total, prev, pager, next, jumper"
              :total="dataTotal"
              @current-change="getList"
            />
          </el-collapse-item>
        </el-collapse>
      </el-main>
    </el-container>

    <!--软件上传-->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      append-to-body
      @close="cancelForm"
    >
      <el-form
        ref="softwareForm"
        v-loading.fullscreen.lock="upload.isUploading"
        :model="softwareForm"
        :inline="true"
        size="small"
        label-width="110px"
        :element-loading-text="$t('softManage.uploading')"
      >
        <el-form-item
          prop="productLine"
          :label="$t('softManage.productLine')"
          :rules="{
            required: true,
            message: '产品线不能为空',
            trigger: 'blur',
          }"
        >
          <el-select v-model="softwareForm.productLine">
            <el-option
              v-for="item in productTypes"
              :key="item.id"
              :value="item.productLine"
              :label="item.productLine"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeName === 'TYPE6'"
          prop="softwareCode"
          :label="$t('softManage.softwareCode')"
          required
        >
          <el-input v-model.trim="softwareForm.softwareCode" />
        </el-form-item>
        <el-form-item v-if="showVersion" prop="version" label="版本号" required>
          <el-input v-model.trim="softwareForm.version" />
        </el-form-item>
        <el-form-item
          :label="$t('table.remark')"
        >
          <el-input v-model.trim="softwareForm.remark" />
        </el-form-item>
        <el-form-item
          :label="$t('softManage.softwarePackage')"
          required
        >
          <el-upload
            ref="upload"
            class="softwareClass"
            :limit="1"
            :auto-upload="true"
            :headers="upload.headers"
            :action="upload.url"
            :data="upload.data"
            :name="upload.name"
            :disabled="upload.isUploading"
            accept=".zip"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :on-remove="handleRemoveFile"
            drag
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              {{ $t('softManage.dragFileHere') }}<em>{{ $t('softManage.clickUploading') }} </em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitForm()">
          {{ $t('permission.confirm') }}
        </el-button>
        <el-button size="small" @click="cancelForm">{{ $t('permission.cancel') }}</el-button>
      </div>
    </el-dialog>

    <!--配置上传-->
    <el-dialog
      v-loading.fullscreen.lock="configUpload.isUploading"
      :title="configUpload.title"
      :visible.sync="configUpload.open"
      append-to-body
      :element-loading-text="$t('softManage.uploading')"

      @close="cancelConfigForm"
    >
      <el-form label-width="110px">
        <el-form-item label=" ">
          <div v-if="activeName === 'TYPE1'">
            <el-upload
              ref="configUpload"
              :limit="10"
              :auto-upload="true"
              multiple
              drag
              :headers="configUpload.headers"
              :file-list="fileList"
              :action="configUpload.url"
              :data="configUpload.data"
              :name="configUpload.name"
              :disabled="configUpload.isUploading"
              :on-progress="handleConfigUploadProgress"
              :on-success="handleConfigFileSuccess"
              :on-remove="handleConfigRemoveFile"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                {{ $t('softManage.dragFileHere') }}<em>{{ $t('softManage.clickUploading') }} </em>
              </div>
            </el-upload>
          </div>
          <div v-else>
            <el-upload
              ref="configUpload"
              :limit="1"
              :auto-upload="true"
              drag
              :headers="configUpload.headers"
              :file-list="fileList"
              :action="configUpload.url"
              :data="configUpload.data"
              :name="configUpload.name"
              :disabled="configUpload.isUploading"
              :on-progress="handleConfigUploadProgress"
              :on-success="handleConfigFileSuccess"
              :on-remove="handleConfigRemoveFile"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                {{ $t('softManage.dragFileHere') }}<em>{{ $t('softManage.clickUploading') }} </em>
              </div>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitConfigForm">
          {{ $t('permission.confirm') }}
        </el-button>
        <el-button size="small" @click="cancelConfigForm">{{ $t('permission.cancel') }}</el-button>
      </div>
    </el-dialog>

    <!--驱动上传-->
    <el-dialog
      v-loading.fullscreen.lock="driverUpload.isUploading"
      class="driverClass"
      :title="driverUpload.title"
      :visible.sync="driverUpload.open"
      append-to-body
      :element-loading-text="$t('softManage.uploading')"
      @close="closeDriverForm"
    >
      <el-table ref="table2" :data="driverList" size="small">
        <el-table-column
          prop="driverName"
          label="驱动名称"
          align="center"
        />
        <el-table-column prop="version" label="驱动版本" align="center">
          <template slot-scope="scope">
            <el-input
              v-if="showVersion && !scope.row.uploaded"
              v-model.trim="scope.row.version"
            />
            <span v-else> {{ scope.row.version }} </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="modifiedUserName"
          label="上传人"
          align="center"
        />
        <el-table-column prop="modifiedDate" label="上传时间" align="center" />
        <el-table-column prop="url" label="操作" align="center">
          <template slot-scope="scope">
            <el-upload
              ref="driverUpload"
              :limit="1"
              :auto-upload="true"
              :headers="driverUpload.headers"
              :action="driverUpload.url"
              :data="driverUpload.data"
              :name="driverUpload.name"
              accept=".zip"
              :disabled="driverUpload.isUploading"
              :before-upload="
                (file) => handleDriverBeforeUpload(file, scope.row)
              "
              :on-progress="handleDriverUploadProgress"
              :on-success="
                (response, file, fileList) =>
                  handleDriverFileSuccess(response, file, fileList, scope.row)
              "
              :on-remove="
                (file, fileList) =>
                  handleDriverRemoveFile(file, fileList, scope.row)
              "
            >
              <div v-if="scope.row.url && scope.row.url !== ''">
                <el-button
                  slot="trigger"
                  size="small"
                  type="text"
                  icon="el-icon-refresh"
                >重新上传</el-button>
                <el-button
                  size="small"
                  type="text"
                  icon="el-icon-download"
                  @click="downloadFile(scope.row.url)"
                >
                  下载驱动
                </el-button>
              </div>
              <el-button
                v-else
                slot="trigger"
                size="small"
                type="text"
                icon="el-icon-upload2"
              >
                点击上传
              </el-button>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>
      <div style="width: 350px; margin: 10px auto 0; color: red">
        <el-link v-if="tipMsg !== ''" type="danger" :underline="false">{{
          tipMsg
        }}</el-link>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitDriverForm">
          {{ $t('permission.confirm') }}
        </el-button>
        <el-button size="small" @click="closeDriverForm">{{ $t('permission.cancel') }}</el-button>
      </div>
    </el-dialog>

    <!--绑定管理-->
    <el-dialog
      :title="$t('softManage.bindManage')"
      :visible.sync="bindVisible"
      append-to-body
      @close="closeBindForm"
    >
      <el-form
        v-if="activeName === 'TYPE1'"
        ref="bindForm"
        class="bindForm"
        :model="equipmentTypeBind"
        :inline="true"
        size="small"
        label-width="80px"
      >
        <el-form-item
          prop="equipmentType"
          :label="$t('softManage.equipmentType')"
          :rules="{
            required: true,
            message: '请选择设备类型',
            trigger: 'blur',
          }"
        >
          <el-select
            v-model="equipmentTypeBind.equipmentType"
            filterable
            :remote-method="getEquipmentTypeList"
            @change="changeEquipmentType()"
          >
            <el-option
              v-for="equipmentType in equipmentTypeList"
              :key="equipmentType"
              :value="equipmentType"
              :label="equipmentType"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="fiberhomeItemList"
          :label="$t('softManage.fiberhomeitem')"
          :rules="{ required: true, message: '请选择物料号', trigger: 'blur' }"
        >
          <el-select
            v-model="equipmentTypeBind.fiberhomeItemList"
            filterable
            multiple
          >
            <el-option
              v-for="fiberhomeItem in fiberhomeItemList"
              :key="fiberhomeItem"
              :value="fiberhomeItem"
              :label="fiberhomeItem"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <el-form
        v-else
        ref="bindForm"
        class="bindForm"
        :model="networkBindForm"
        inline="true"
        size="small"
        label-width="80px"
      >
        <el-button
          v-if="networkBindForm.attributeList.length === 0"
          type="primary"
          size="small"
          @click="addRow"
        >新增单盘</el-button>
        <div
          v-for="(attribute, index) in networkBindForm.attributeList"
          :key="index"
        >
          <el-form-item :prop="`plateName${index}`" label="单盘号">
            <el-select
              v-model="attribute.key"
              placeholder="请选择"
              filterable
              @change="handlePlateSelect"
            >
              <el-option
                v-for="item in unbindTestStation"
                :key="item.plateName"
                :label="item.plateName"
                :value="item.plateName"
              />
            </el-select>
          </el-form-item>
          <el-form-item :prop="`station${index}`" label="工位号">
            <el-select
              v-model="attribute.value"
              placeholder="请选择"
              @change="handleStationSelect(attribute.value, index)"
            >
              <el-option
                v-for="item in unbindStation"
                :key="item.stationCode"
                :label="item.stationCode"
                :value="item.stationCode"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              type="text"
              icon="el-icon-plus"
              size="small"
              @click.prevent="addRow()"
            />
            <el-button
              type="text"
              icon="el-icon-delete"
              size="small"
              @click.prevent="removeRow(attribute)"
            />
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitBindForm">
          {{ $t('permission.confirm') }}
        </el-button>
        <el-button size="small" @click="closeBindForm">{{ $t('permission.cancel') }}</el-button>
      </div>
    </el-dialog>

    <!--验证启动-->
    <el-dialog
      title="软件验证"
      :visible.sync="verifyVisible"
      append-to-body
      :close-on-click-modal="false"
      @close="closeVerifyForm"
    >
      <el-form
        ref="verifyForm"
        class="verifyForm"
        :model="verifyForm"
        :inline="true"
        size="small"
        label-width="150px"
      >
        <el-form-item
          v-if="activeName === 'TYPE6'"
          prop="productNum"
          label="产品序列号"
          :rules="{
            required: true,
            message: '产品序列号不能为空',
            trigger: 'blur',
          }"
        >
          <el-input v-model.trim="verifyForm.productNum" />
        </el-form-item>
        <el-form-item
          v-else
          prop="mac"
          label="MAC地址"
          :rules="{
            required: true,
            message: 'MAC地址不能为空',
            trigger: 'blur',
          }"
        >
          <el-input v-model.trim="verifyForm.mac" />
        </el-form-item>
        <el-button
          type="primary"
          size="small"
          :disabled="!isConnect"
          :loading="lunchLoading"
          @click="verifyLunch"
        >
          启动验证
        </el-button>
        <el-button type="success" size="small" @click="verifyCompletion">
          测试完成
        </el-button>
        <el-button size="small" @click="closeVerifyForm">取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { pageSoftwareList } from '@/api/softManage'
import { boardConfigUpload } from '@/api/softManage'
import { updateStatus } from '@/api/softManage'
import { softwareBindUpdateBind } from '@/api/softManage'
import { softwareDelete } from '@/api/softManage'
import { boardSoftUpload } from '@/api/softManage'
import { listProductLine } from '@/api/productLine'
import { distinctListProductType } from '@/api/board/boardSapinfo'
import { distinctListFiberhomeItem } from '@/api/board/boardSapinfo'
import { selectBindBySoftwareCode } from '@/api/softManage'
import { driverUpload } from '@/api/software/softwareDriver'
import { selectDriver } from '@/api/software/softwareDriver'

const APP_URL = process.env.VUE_APP_BASE_API

const HEADER = {
  headers: {
    'Access-Control-Allow-Credentials': true,
    'withCredentials': false
  }
}

export default {
  name: 'SoftwareUpload',
  data() {
    return {
      showVersion: false,

      softwareId: null,
      verifyVisible: false,
      verifyForm: {},

      boardRole: true,
      networkRole: true,

      fileList: [],

      networkBindForm: {
        attributeList: [
          //   {
          //   key:"",
          //   value:''
          // }
        ]
      },
      // 下拉框一级级联动
      unbindTestStation: [],
      // 下拉框二级联动
      unbindStation: [],

      // 网产选中参数
      // testStationIdList: [],

      plateNameForm: {
        plateName: ''
      },
      softwareCode: '',
      equipmentTypeList: [],
      fiberhomeItemList: [],

      activeName: 'TYPE1',
      configList: [],

      driverList: [],
      bindVisible: false,
      equipmentTypeBind: {
        equipmentType: '',
        fiberhomeItemList: [],
        station: ''
      },

      searchForm: {
        softwareName: '',
        softwareType: 'TYPE1'
      },

      dataTotal: 0,
      softwareList: [],

      upload: {
        open: false, // 是否显示弹出层
        title: this.$t('softManage.uploadSoftware'), // 弹出层标题
        isUploading: false, // 是否禁用上传
        url: APP_URL + '/file/upload',
        headers: { ...HEADER.headers },
        name: 'file',
        data: {
          bizType: 'BoardSoftware'
        }
      },

      configUpload: {
        open: false, // 是否显示弹出层
        title: this.$t('softManage.uploadConfig'), // 弹出层标题
        isUploading: false, // 是否禁用上传
        url: APP_URL + '/file/upload',
        headers: { ...HEADER.headers },
        name: 'file',
        data: {
          bizType: 'BoardConfig'
        }
      },

      driverUpload: {
        open: false, // 是否显示弹出层
        title: this.$t('softManage.uploadDriver'), // 弹出层标题
        isUploading: false, // 是否禁用上传
        url: APP_URL + '/file/upload',
        headers: { ...HEADER.headers },
        name: 'file',
        data: {
          bizType: 'BoardDriver'
        }
      },

      softwareForm: {
        productLine: '',
        softwareCode: '',
        softwareName: '',
        url: '',
        remark: ''
      },
      productTypes: [],

      tipMsg: '',
      isConnect: false,
      websocket: undefined,
      lunchLoading: false
    }
  },

  mounted() {
    this.getList(1)
    this.getProductTypeList(2)
  },

  methods: {
    addRow() {
      this.networkBindForm.attributeList.push({
        key: '',
        value: ''
      })
    },

    removeRow(item) {
      if (this.networkBindForm.attributeList.length > 0) {
        const index = this.networkBindForm.attributeList.indexOf(item)
        if (index !== -1) {
          this.networkBindForm.attributeList.splice(index, 1)
        }
      }
    },

    listUnbindTestStation() {
      const api = '/softwareBind/listUnbindTestStation'

      return this.$http.get(APP_URL + api, null, null, HEADER).then((res) => {
        if (res.code === '200') {
          this.unbindTestStation = res.data
        } else {
          this.$message.error(res.msg.join('，'))
        }
      })
    },

    // 下拉框二级联动，一级选择之后，筛选二级
    handlePlateSelect(plateName) {
      this.unbindStation = []
      for (var item of this.unbindTestStation) {
        if (item.plateName === plateName) {
          this.unbindStation.push(item)
        }
      }
    },
    // 二级选中后设置参数
    handleStationSelect(id, index) {
      // 替换
      if (index !== -1) {
        this.testStationIdList.splice(index, 1)
        this.testStationIdList.splice(index, 0, id)
      }
    },

    changeActiveName() {
      this.searchForm = {}
      this.getList(1)
      if (this.activeName === 'TYPE1') {
        this.getProductTypeList(2)
      } else {
        this.getProductTypeList(1)
      }
    },

    openVerifyForm(row) {
      this.softwareId = row.id
      this.verifyVisible = true
    },

    closeVerifyForm() {
      this.$refs.verifyForm.resetFields()
      this.softwareId = null
      this.verifyVisible = false
    },

    verifyLunch() {
      this.$refs.verifyForm.validate((valid) => {
        if (valid) {
          let api =
            '/network/software/verify/lunch?softwareId=' + this.softwareId
          if (this.activeName === 'TYPE1') {
            api = '/board/software/verify/lunch?softwareId=' + this.softwareId
          }
          this.$http.get(APP_URL + api, null, null, HEADER).then((res) => {
            if (res.code === '200') {
              this.lunchLoading = true
              this.sendMessage(res.data.commandType + '&' + res.data.content)
            } else {
              this.$message.error(res.msg.join(', '))
            }
          })
        } else {
          return false
        }
      })
    },

    verifyCompletion() {
      this.$refs.verifyForm.validate((valid) => {
        if (valid) {
          let api =
            '/network/software/verify/completion?softwareId=' + this.softwareId
          if (this.activeName === 'TYPE1') {
            api =
              '/board/software/verify/completion?softwareId=' + this.softwareId
          }
          this.$http.get(APP_URL + api, null, null, HEADER).then((res) => {
            // eslint-disable-next-line no-empty
            if (res.code === '200') {

            } else {
              this.$message.error(res.msg.join(', '))
            }
          })
        } else {
          return false
        }
      })
    },

    // roleControl() {
    //   var user = this.currLoginUser
    //   var userRole = user.authorities
    //   const boardPP = userRole.includes('ROLE_boardPP')
    //   const networkPP = userRole.includes('ROLE_networkPP')
    //   const boardJoinPP = userRole.includes('ROLE_boardJoinPP')
    //   const ptmAdmin = userRole.includes('ROLE_ptmAdmin')
    //   const modulePP = userRole.includes('ROLE_modulePP')

    //   this.boardRole = ptmAdmin ? true : boardPP
    //   this.networkRole = ptmAdmin ? true : networkPP || boardJoinPP || modulePP
    // },

    getList(pageIndex) {
      if (this.activeName && this.activeName !== '') {
        // const api = '/software/page';
        if (pageIndex) {
          this.searchForm.pageIndex = pageIndex
        }
        this.searchForm.pageSize = 10
        this.searchForm.softwareType = this.activeName
        pageSoftwareList(this.searchForm)
          .then((res) => {
            if (res.code === '200') {
              this.softwareList = res.data
              this.dataTotal = res.total
            } else {
              this.$message.error(res.msg.join('，'))
            }
          })
      }
    },

    getEquipmentTypeList(equipmentType) {
      if (equipmentType === undefined) {
        equipmentType = ''
      }
      const parm = {
        productType: equipmentType
      }

      distinctListProductType(parm).then((res) => {
        if (res.code === '200') {
          if (res.data != null && res.data.length > 0) {
            this.equipmentTypeList = res.data
          } else {
            this.equipmentTypeList = []
          }
        } else {
          this.$message.error(res.msg.join('，'))
        }
      })
    },

    changeEquipmentType() {
      if (this.equipmentTypeBind.fiberhomeItemList) {
        this.equipmentTypeBind.fiberhomeItemList.length = 0
      }
      this.getFiberhomeItemList(this.equipmentTypeBind.equipmentType)
    },

    getFiberhomeItemList(equipmentType) {
      if (equipmentType && equipmentType !== '') {
        const params = {
          productType: equipmentType
        }
        // const api = '/testResources/board/sapinfo/distinctListFiberhomeItem'
        distinctListFiberhomeItem(params)
          .then((res) => {
            if (res.code === '200') {
              if (res.data != null) {
                this.fiberhomeItemList = res.data
              } else {
                this.fiberhomeItemList = []
              }
            } else {
              this.$message.error(res.msg.join('，'))
            }
          })
      } else {
        this.fiberhomeItemList = []
      }
    },

    getProductTypeList(outputLine) {
      const params = {
        outputLine: outputLine
      }
      // let api = '/product/line/list'
      listProductLine(params).then((res) => {
        if (res.code === '200') {
          this.productTypes = res.data
        } else {
          this.$message.error(res.msg.join('，'))
        }
      })
    },

    /* 软件管理*/
    openForm() {
      this.upload.open = true
    },
    submitForm() {
      debugger
      if (this.softwareForm.productLine == null ||
        this.softwareForm.productLine.trim() === '') {
        this.$message.error('请选择产品线！')
      } else if (this.softwareForm.url == null ||
        this.softwareForm.url.trim() === '') {
        this.$message.error('请上传软件包！')
      } else if (this.showVersion &&
        (this.softwareForm.version == null ||
          this.softwareForm.version.trim() === '')) {
        this.$message.error('请输入版本号！')
      } else {
        this.showVersion = false
        // 宽产软件上传
        if (this.activeName === 'TYPE1') {
          boardSoftUpload(this.softwareForm)
            .then((res) => {
              if (res.code === '200') {
                if (res.data) {
                  this.upload.open = false
                  this.$message.success('软件上传成功！')
                  this.getList()
                } else {
                  this.$message.error('软件上传失败！')
                }
              } else if (res.code === '504') {
                this.$message.warning(
                  '版本号解析失败，请从软件配置文件中获取版本号，手动输入！'
                )
                this.showVersion = true
              } else {
                this.$message.error('软件上传失败！' + res.msg.join('，'))
              }
            })
        }
      }
    },

    cancelForm() {
      this.upload.data.businessid = null
      this.upload.open = false
      this.$refs.softwareForm.resetFields()
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
    },

    /* 驱动管理*/
    openDriverForm(row) {
      this.driverUpload.open = true
      const para = {
        softwareName: row.softwareName
      }
      // const api ='/board/softwareDriver/selectDriver?softwareName=' + row.softwareName
      selectDriver(para).then((res) => {
        if (res.code === '200') {
          this.driverList = res.data
          this.driverList.forEach((driver) => {
            driver.uploaded = driver.version && driver.version.trim() !== ''
          })
        } else {
          this.tipMsg = res.msg.join('，')
        }
      })
    },
    closeDriverForm() {
      this.tipMsg = ''
      this.driverUpload.open = false
      this.driverList = []
      if (this.$refs.driverUpload) {
        this.$refs.driverUpload.clearFiles()
      }
    },
    submitDriverForm() {
      this.showVersion = false
      const driverList = this.driverList

      // const api = '/board/softwareDriver/driverUpload'
      driverUpload(driverList)
      // return this.$http
        // .post(APP_URL + api, driverList, null, HEADER)
        .then((res) => {
          if (res.code === '200') {
            if (res.data) {
              this.$message.success('驱动上传成功！')
              this.driverUpload.open = false

              // driverList.forEach((item) => {
              // this.saveSystemLog('驱动上传', item.oldUrl, item.url)
              // })
            } else {
              this.$message.error('驱动上传失败！')
            }
          } else if (res.code === '504') {
            this.$message.warning(
              '版本号解析失败，请从软件配置文件中获取版本号，手动输入！'
            )
            this.showVersion = true
          } else {
            this.$message.error('软件上传失败！' + res.msg.join('，'))
          }
        })
    },

    /* 配置管理*/
    openConfigForm(row) {
      this.configUpload.open = true
      if (row) {
        this.softwareCode = row.softwareCode
      }
    },
    submitConfigForm() {
      if (this.fileList && this.fileList.length > 0) {
        const configList = []
        for (const file of this.fileList) {
          let fileName = file.name
          fileName = fileName.substring(0, fileName.lastIndexOf('.'))
          configList.push({
            url: file.response.data.url,
            configName: fileName
          })
        }
        if (this.activeName === 'TYPE1') {
          // const api = '/board/software/configUpload'
          boardConfigUpload(configList)
            .then((res) => {
              if (res.code === '200' && res.data) {
                this.$message.success('配置文件上传成功！')
                this.configUpload.open = false
              } else {
                this.$message.error(res.msg.join('，'))
              }
            })
        }
      } else {
        this.$message.error('您未上传配置文件！')
      }
    },
    cancelConfigForm() {
      this.configUpload.open = false
      if (this.$refs.configUpload) {
        this.$refs.configUpload.clearFiles()
      }
    },

    /* 绑定管理*/
    openBindForm(row) {
      this.bindVisible = true
      this.softwareCode = row.softwareCode
      if (this.activeName === 'TYPE1') {
        this.getEquipmentTypeList()
        // 查询绑定信息
        // const api =
        //   '/softwareBind/selectBySoftwareCode?softwareCode=' + row.softwareCode
        const parm = {
          softwareCode: row.softwareCode
        }
        selectBindBySoftwareCode(parm).then((res) => {
          if (res.code === '200') {
            this.equipmentTypeBind.station = row.softwareName
            if (res.data && res.data.length > 0) {
              for (const item of res.data) {
                this.equipmentTypeBind.fiberhomeItemList.push(
                  item.fiberhomeItem
                )
              }
              this.equipmentTypeBind.equipmentType = res.data[0].equipmentType
              this.getFiberhomeItemList(res.data[0].equipmentType)
            }
          } else {
            this.$message.error(res.msg.join('，'))
          }
        })
      }
    },
    closeBindForm() {
      this.bindVisible = false
      this.equipmentTypeBind = {
        equipmentType: '',
        fiberhomeItemList: []
      }
      this.$refs.bindForm.resetFields()
    },
    submitBindForm() {
      debugger
      this.$refs.bindForm.validate((valid) => {
        if (valid) {
          if (this.activeName === 'TYPE1') {
            const bindList = [
              {
                softwareCode: this.softwareCode,
                softType: this.activeName,
                equipmentType: this.equipmentTypeBind.equipmentType,
                fiberhomeItemList: this.equipmentTypeBind.fiberhomeItemList,
                station: this.equipmentTypeBind.station
              }
            ]
            this.bindSoftware(bindList)
          } else if (this.activeName === 'TYPE6') {
            const bindList = [
              {
                softwareCode: this.softwareCode,
                attributeList: this.networkBindForm.attributeList,
                softType: this.activeName
              }
            ]
            this.bindSoftware(bindList)
          }
        } else {
          return false
        }
      })
    },
    // submitBindForm() {
    //   this.$refs.bindForm.validate((valid) => {
    //     if (valid) {
    //       if (this.activeName === 'TYPE1') {
    //         let bindList = [{
    //           softwareCode: this.softwareCode,
    //           softType: this.activeName,
    //           equipmentType: this.equipmentTypeBind.equipmentType,
    //           fiberhomeItemList: this.equipmentTypeBind.fiberhomeItemList,
    //           station: this.equipmentTypeBind.station
    //         }]
    //         this.bindSoftware(bindList)
    //       } else {
    //         let plateNumList = []
    //         let plateNameArr = this.plateNameForm.plateName.split('\n')
    //         for (let item of plateNameArr) {
    //           if (item && item.trim() !== '') {
    //             let list = item.trim().split('、')
    //             for (let li of list) {
    //               if (li && li.trim() !== '') {
    //                 plateNumList.push(li.trim())
    //               }
    //             }
    //           }
    //         }
    //         let bindList = [{
    //           softwareCode: this.softwareCode,
    //           plateNumList: plateNumList,
    //           softType: this.activeName
    //         }]
    //         this.bindSoftware(bindList)
    //       }
    //     } else {
    //       return false
    //     }
    //   })
    // },
    deleteSoftware(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // const api = '/software/delete?softwareId=' + row.id
          const parm = {
            softwareId: row.id
          }
          softwareDelete(parm)
            .then((res) => {
              if (res.code === '200' && res.data) {
                this.$message.success('删除成功！')
                this.getList(1)
              } else {
                this.$message.error(res.msg.join('，'))
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },

    bindSoftware(bindList) {
      // const api = '/softwareBind/updateBind'
      softwareBindUpdateBind(bindList)
        .then((res) => {
          if (res.code === '200' && res.data) {
            this.bindVisible = false
            this.$message.success('bind success，绑定成功！')
          } else {
            this.$message.error(res.msg.join('，'))
          }
        })
    },

    changeStatus(row, status) {
      this.$confirm(this.$t('dialog.confirmRemind'),
        this.$t('dialog.remind'),
        {
          confirmButtonText: this.$t('permission.confirm'),
          cancelButtonText: this.$t('permission.cancel'),
          type: 'warning'
        }
      ).then(() => {
        const parm = {
          softwareId: row.id,
          status: status
        }
        updateStatus(parm)
          .then((res) => {
            if (res.code === '200' && res.data) {
              // this.saveSystemLog(
              //   '更新状态为：' + status,
              //   '',
              //   '软件ID：' + row.id
              // )
              this.$message.success(this.$t('dialog.setupSuccess'))
              this.getList()
            } else {
              this.$message.error(res.msg.join('，'))
            }
          })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('dialog.cancelLog')
          })
        })
    },

    handleDriverBeforeUpload(file, driver) {
      let fileName = file.name
      fileName = fileName.substring(0, fileName.lastIndexOf('.'))
      if (fileName !== driver.driverName) {
        this.$message.error('驱动名称不一致，请检查驱动是否正确！')
        return false
      } else {
        return true
      }
    },

    handleRemoveFile(file, fileList) {
      this.softwareForm.url = ''
      this.removeFile(file.response.data[0].code)
    },

    handleConfigRemoveFile(file, fileList) {
      this.fileList = fileList
      this.removeFile(file.response.data[0].code)
    },

    handleDriverRemoveFile(file, fileList, driver) {
      driver.url = driver.oldUrl
      this.removeFile(file.response.data[0].code)
    },

    /**
     * 软件上传成功处理
     */
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false
      if (response.code === '200') {
        this.softwareForm.url = response.data.url
        let fileName = response.data.name
        fileName = fileName.substring(0, fileName.lastIndexOf('.'))
        this.softwareForm.softwareName = fileName
      } else {
        this.$message.error(response.msg.join('，'))
      }
    },

    /**
     * 配置文件上传成功处理
     */
    handleConfigFileSuccess(response, file, fileList) {
      debugger
      this.configUpload.isUploading = false
      if (response.code === '200') {
        this.fileList = fileList
      } else {
        this.$message.error(response.msg.join('，'))
      }
    },

    /**
     * 驱动文件上传成功处理
     */
    handleDriverFileSuccess(response, file, fileList, driver) {
      this.driverUpload.isUploading = false
      if (response.code === '200') {
        driver.oldUrl = driver.url
        driver.url = response.data.url
        driver.uploaded = false
        driver.version = ''
      } else {
        this.$message.error(response.msg.join('，'))
      }
    },

    /** 处理文件上传中 */
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true // 禁止修改
    },
    handleConfigUploadProgress(event, file, fileList) {
      this.configUpload.isUploading = true // 禁止修改
    },
    handleDriverUploadProgress(event, file, fileList) {
      this.driverUpload.isUploading = true // 禁止修改
    },

    downloadFile(url) {
      window.open(url)
    },

    saveSystemLog(operateDesc, pre, after) {
      const params = {
        appName: 'PTMPRE2',
        logType: '软件管理',
        operateType: 2,
        operateDesc: operateDesc,
        preContent: pre,
        afterContent: after
      }
      const api = '/api/ptmanalysisrest/system/log/save'
      return this.$http.post(api, params, null, HEADER).then((res) => {
        if (res.code === '200' && res.data) {
          console.error('保存操作日志失败')
        } else {
          console.error('保存操作日志失败')
        }
      })
    },
    removeFile(code) {
      const api = '/api/ptmpre/ecmnodes?ids=' + code
      return this.$http.delete(api, null, null, HEADER).then((res) => {
        if (res.code === 200) {
          console.log('删除成功：' + code)
        } else {
          console.log('删除失败：' + code)
        }
      })
    },

    // /* 连接客户端*/
    // createWebSocket() {
    //   if (typeof WebSocket === 'undefined') {
    //     console.log('您的浏览器不支持WebSocket')
    //   } else {
    //     try {
    //       console.log('开始连接客户端 。。。')
    //       this.websocket = new WebSocket('ws://localhost:7181/')
    //       this.initWebSocket()
    //     } catch (e) {
    //       console.log('连接客户端失败！')
    //     }
    //   }
    // },

    // initWebSocket() {
    //   // 建立连接
    //   this.websocket.onopen = () => {
    //     const url = APP_URL + '/software/getPtmClientServerVersion'
    //     this.$http.get(url, null, null, HEADER).then((res) => {
    //       if (res.code === '200') {
    //         this.websocket.send('open,' + res.data)
    //       }
    //     })
    //   }

    //   // 客户端接收服务端返回的数据
    //   this.websocket.onmessage = (evt) => {
    //     this.messageFallback(evt)
    //   }

    //   // 发生错误时
    //   this.websocket.onerror = (evt) => {
    //     console.log('连接客户端异常！')
    //     this.isConnect = false
    //   }

    //   // 关闭连接
    //   this.websocket.onclose = (evt) => {
    //     this.isConnect = false
    //   }
    // },

    sendMessage(data) {
      console.log('发出消息：' + data)
      if (this.websocket) {
        this.websocket.send(data)
      }
    }

    // messageFallback(e) {
    //   console.log('接收消息：' + e.data)

    //   const arr = e.data.split(',')
    //   const type = arr[0]
    //   const status = arr[1]
    //   const content = arr[2]
    //   if (type === '-1') {
    //     if (status === 'success') {
    //       console.log('连接客户端成功')
    //       this.isConnect = true
    //     } else {
    //       this.$message.error(
    //         '连接客户端失败，本地客户端不是最新版本，请重新下载安装客户端'
    //       )
    //       this.isConnect = false
    //     }
    //   } else if (type === '2') {
    //     // 软件下载结束
    //     if (status === 'fail') {
    //       this.$message.error('软件下载失败：' + content)
    //       this.lunchLoading = false
    //     } else {
    //       this.$message.success('软件下载成功！')
    //     }
    //   } else if (type === '3') {
    //     // 软件启动
    //     this.lunchLoading = false
    //     if (status === 'success') {
    //       this.$message.success('软件启动成功')
    //     } else {
    //       this.$message.error('软件启动失败：' + content)
    //     }
    //   }
    // }
  }
}
</script>

<style scoped>
.el-select {
  display: inline-block;
  position: relative;
  width: 179px;
}

.bindForm .el-select {
  width: 220px !important;
}

.el-textarea {
  width: 179px;
}

.el-dialog {
  width: 750px;
}

.driverClass .el-dialog {
  width: 1050px;
}

.el-upload-dragger {
  width: 492px;
}
</style>
