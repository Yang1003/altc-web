<template>
  <div class="OrderVendor">
    <!-- 搜索工作栏 -->
    <el-card class="box-card">
      <el-form
        ref="queryParams"
        size="small"
        :model="queryParams"
        label-width="120px"
        style="width: 100%"
        :inline="true"
        @submit.native.prevent
        @keyup.native.enter="search"
      >
        <el-form-item label="MAC" prop="mac">
          <el-input v-model="queryParams.mac" />
        </el-form-item>
        <el-form-item label="TSN" prop="tsn">
          <el-input v-model="queryParams.tsn" />
        </el-form-item>
        <el-form-item :label="$t('testRecordPage.testpostionnumber')" prop="testpostionnumber">
          <el-input v-model="queryParams.testpostionnumber" />
        </el-form-item>
        <el-form-item :label="$t('testRecordPage.line')" prop="line">
          <el-input v-model="queryParams.line" />
        </el-form-item>
        <el-form-item :label="$t('testRecordPage.error')" prop="error">
          <el-input v-model="queryParams.error" />
        </el-form-item>
        <el-form-item :label="$t('testRecordPage.itemName')" prop="itemName">
          <el-input v-model="queryParams.itemName" />
        </el-form-item>
        <el-form-item :label="$t('testRecordPage.content')" prop="content">
          <el-input v-model="queryParams.content" />
        </el-form-item>
        <el-form-item :label="$t('ptmTranslation.starttime')" prop="startTime">
          <el-date-picker
            v-model="queryParams.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            :placeholder="$t('ptmTranslation.selectDateTime')"
            style="width: 200px"
            @change="search"
          />
        </el-form-item>
        <el-form-item :label="$t('ptmTranslation.endtime')" prop="endTime">
          <el-date-picker
            v-model="queryParams.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            :placeholder="$t('ptmTranslation.selectDateTime')"
            style="width: 200px"
            @change="search"
          />
        </el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          plain
          @click="search"
        >
          {{$t('ptmTranslation.search')}}
        </el-button>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-upload2"
          plain
          @click="exportData"
        >
          {{$t('ptmTranslation.exportData')}}
        </el-button>
        <el-button
          v-if="showDelete"
          size="small"
          type="danger"
          icon="el-icon-delete"
          @click="deleteData"
        >
          {{$t('testRecordPage.batchDelete')}}
        </el-button>
      </el-form>

      <!-- 列表 -->
      <el-table
        ref="multipleTable"
        v-loading="loading"
        size="small"
        :data="list"
        style="width: 100%"
        border
        @sort-change="sortChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="50"
        />
        <el-table-column align="center" type="index" width="50" fixed />
        <el-table-column align="center" prop="mac" label="MAC" fixed />
        <el-table-column align="center" prop="line" :label="$t('testRecordPage.line')" />
        <el-table-column align="center" prop="slot" :label="$t('testRecordPage.slot')" />
        <el-table-column align="center" prop="testpostionnumber" :label="$t('testRecordPage.testpostionnumber')" />
        <el-table-column align="center" prop="tsn" label="TSN" />
        <el-table-column align="center" prop="servicenum" :label="$t('testResultPage.repairCount')" />
        <el-table-column align="center" prop="error" :label="$t('testRecordPage.error')" />
        <el-table-column align="center" prop="itemname" :label="$t('testRecordPage.itemName')"/>
        <el-table-column align="center" prop="testvalue" :label="$t('testRecordPage.testvalue')"/>
        <el-table-column align="center" prop="content" :label="$t('testRecordPage.content')" />

        <el-table-column
          align="center"
          prop="testresult"
          :label="$t('testRecordPage.content')"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.testresult == 1"
              type="success"
            >{{$t('testResultPage.pass')}}</el-tag>
            <el-tag
              v-else-if="scope.row.testresult == 0"
              type="warning"
            >{{$t('testResultPage.fail')}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="personname" :label="$t('testRecordPage.personname')" />
        <el-table-column
          align="center"
          prop="datetime"
          :label="$t('testRecordPage.datetime')"
          sortable="custom"
        />
        <el-table-column align="center" :label="$t('table.actions')" width="100">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              @click="openDialog(scope.row)"
            >{{$t('testRecordPage.viewLog')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <!-- <pagination
        :total="total"
        :page.sync="queryParams.pageIndex"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      /> -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
           :page-sizes="[10, 20, 50, 100]"
      :current-page="queryParams.pageIndex"
            :page-size="queryParams.pageSize"
            :total="total"
            
      layout="total, sizes, prev, pager, next, jumper"
      >
    </el-pagination>

    </el-card>

    <el-dialog
      title="测试日志"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-input
        v-model="testLog"
        type="textarea"
        readonly
        :autosize="{ minRows: 5, maxRows: 30 }"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="visible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pageResult } from '@/api/board/boardTestRecord'
import { deleteRecord } from '@/api/board/boardTestRecord'

const APP_URL = process.env.VUE_APP_BASE_API
const HEADER = {
  headers: {
    'Access-Control-Allow-Credentials': true,
    withCredentials: false
  }
}
export default {
  name: 'OrderVendor',
  
  data() {
    return {
      visible: false,
      testLog: '',
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      showDelete: true,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        orderNo: null,
        mac: null,
        line: null,
        testpostionnumber: null,
        slot: null,
        testResul: null,
        tsn: null,
        startTime: null,
        endTime: null,
        sortName: null,
        sortType: null,
        error: ''
      },
      // 表格数据
      list: []
    }
  },
  // 计算属性
  computed: {},
  watch: {},
  // 生命周期 - 创建完成（访问当前this实例）
  created() {
    this.getList()
    this.loading = false
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageIndex = val;
      this.getList();
    },
    openDialog(row) {
      if (row.testlog.length === 36) {
        this.testLog = row.testlog
      } else {
        this.testLog = JSON.stringify(JSON.parse(row.testlog), null, '\t')
      }
      this.visible = true
    },
    booleanFormat(row) {
      const testresult = row.testresult
      if (testresult === '1') {
        return '成功'
      } else {
        return '失败'
      }
    },

    /** 查询列表 */
    getList() {
      this.loading = true
      // const api = "/boardtest/page";
      pageResult(this.queryParams)
        .then((res) => {
          if (res.code === '200') {
            if (res.data != null) {
              res.data.map((item) => {
                if (item.result === '0') {
                  item.result = '失败'
                } else if (item.result === '1') {
                  item.result = '成功'
                }
              })
              this.list = res.data
              this.total = res.total
            }
          } else {
            this.$message.error(res.msg.join('，'))
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    /** 搜索按钮操作 */
    search() {
      if (this.queryParams.orderNo === '') this.queryParams.orderNo = null
      if (this.queryParams.mac === '') this.queryParams.mac = null
      if (this.queryParams.line === '') this.queryParams.line = null
      if (this.queryParams.slot === '') this.queryParams.slot = null
      if (this.queryParams.testResul === '') this.queryParams.testResul = null
      if (this.queryParams.tsn === '') this.queryParams.tsn = null
      if (this.queryParams.startTime === '') this.queryParams.startTime = null
      if (this.queryParams.endTime === '') this.queryParams.endTime = null
      this.getList()
      this.queryParams.pageIndex = 1
    },

    async exportData() {
      this.loading = true
      const api = '/boardtest/exportTestResult'
      this.$http
        .postBlob(APP_URL + api, this.queryParams, null, HEADER)
        .then(async (res) => {
          this.handleDownLoadFile(res, '测试记录' + '.xlsx')
        })
    },

    handleDownLoadFile(response, fileName) {
      const src = window.URL.createObjectURL(response)
      if (src) {
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = src
        link.setAttribute('download', decodeURI(decodeURI(fileName)))
        document.body.appendChild(link)
        link.click()
        // 下载完成移除元素
        document.body.removeChild(link)
        // 释放掉blob对象
        window.URL.revokeObjectURL(src)
        this.loading = false
      }
    },

    deleteData() {
      const rows = this.$refs.multipleTable.selection
      if (rows.length === 0) {
        this.$message.error('请勾选需要删除的数据!')
        return
      }
      this.$confirm(
        '总共选中' + rows.length + '条数据，请确认是否批量删除?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const ids = []
          rows.forEach((item, index) => {
            ids[index] = item.id
          })

          // const api = "/boardtest/result/delete";
          deleteRecord(ids).then((res) => {
            if (res.code === '200') {
              this.$message.success('批量删除成功！')
              this.getList()
              this.queryParams.pageIndex = 1
            } else {
              this.$message.error(res.msg.join('，'))
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    sortChange({ prop, order }) {
      this.queryParams.sortName = prop
      if (order.includes('ascending')) {
        this.queryParams.sortType = 'ASC'
      } else {
        this.queryParams.sortType = 'DESC'
      }

      this.getList()
    }
  }
}
</script>

<style>
.el-form .el-select,
.el-form .el-switch,
.el-form .el-input-number {
  display: inline-block;
  position: relative;
  width: 179px;
}
</style>
