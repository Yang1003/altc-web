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
        <el-form-item label="时间段">
          <el-select
            v-model="queryParams.tableName"
            clearable
            placeholder="默认查询当前季度"
          >
            <el-option
              v-for="item in tableList"
              :key="item.tableNameStr"
              :value="item.tableNameStr"
              :label="item.displayName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号" prop="orderNum">
          <el-input v-model="queryParams.orderNum" />
        </el-form-item>
        <el-form-item label="TSN" prop="tsn">
          <el-input v-model="queryParams.tsn" />
        </el-form-item>
        <el-form-item label="MAC" prop="mac">
          <el-input v-model="queryParams.mac" />
        </el-form-item>

        <el-form-item label="线体" prop="line">
          <el-input v-model="queryParams.line" />
        </el-form-item>
        <el-form-item label="工位" prop="testPositionNumber">
          <el-input v-model="queryParams.testPositionNumber" />
        </el-form-item>
        <el-form-item label="测试值" prop="testValue">
          <el-input v-model="queryParams.testValue" />
        </el-form-item>

        <el-form-item label="测试项编号" prop="itemCode">
          <el-input v-model="queryParams.itemCode" />
        </el-form-item>
        <el-form-item label="工装组别" prop="groupNum">
          <el-input v-model="queryParams.groupNum" />
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="queryParams.startTime"
            value-format="yyyy-MM-dd 00:00:00"
            type="date"
            placeholder="选择日期"
            style="width: 200px"
            @change="search"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="queryParams.endTime"
            value-format="yyyy-MM-dd 23:59:59"
            type="date"
            placeholder="选择日期"
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
          查询
        </el-button>
        <el-button
          size="small"
          type="danger"
          icon="el-icon-download"
          @click="exportData"
        >
          导出
        </el-button>
      </el-form>

      <!-- 列表 -->
      <el-table
        ref="multipleTable"
        v-loading="loading"
        size="small"
        :data="list"
        border
      >
        <el-table-column align="center" type="index" width="50" fixed />
        <el-table-column align="center" prop="orderNum" label="订单号" fixed />
        <el-table-column
          align="center"
          prop="mac"
          label="MAC"
          width="80px"
          fixed
        />
        <el-table-column align="center" prop="tsn" label="TSN" width="80px" />
        <el-table-column align="center" prop="testPositionNumber" label="工位" />
        <el-table-column align="center" prop="line" label="线体" />
        <el-table-column align=" center" prop="itemCode" label="测试项编号" />
        <el-table-column align="center" prop="itemName" label="测试项名称" />
        <el-table-column align="center" prop="groupNum" label="组别" />
        <el-table-column align="center" prop="standardValue" label="标准值" />
        <el-table-column align="center" prop="testValue" label="测试值" />
        <el-table-column align="center" prop="testResult" label="测试结果" />
        <el-table-column align="center" prop="testDuration" label="测试时长" />
        <el-table-column
          align="center"
          prop="testTimeDate"
          label="测试时间"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="otherDetail1"
          label="otherDetail1"
          width="300px"
        />
        <el-table-column
          align="center"
          prop="otherDetail2"
          label="otherDetail2"
          width="200px"
        />
        <el-table-column
          align="center"
          prop="otherDetail3"
          label="otherDetail3"
          width="200px"
        />
      </el-table>
      <!-- 分页组件 -->
      <pagination
        :total="total"
        :page.sync="queryParams.pageIndex"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
    <!--下载进度条-->
    <el-dialog
      title="正在下载，请等待"
      :visible.sync="fileDown.loadDialogStatus"
      :close-on-click-modal="false"
      :show-close="false"
      width="20%"
    >
      <div style="margin-bottom: 10px">
        数据总量： <span>{{ fileDown.exportTotalNum }} </span>
      </div>
      <div style="margin-bottom: 10px">
        处理进度：
        <span style="color: #f56c6c">{{ fileDown.processed }}</span>
        /
        <span>{{ fileDown.exportTotalNum }}</span>
      </div>
      <div style="text-align: center">
        <el-progress
          type="circle"
          :percentage="fileDown.percentage"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTestLog } from '@/api/board/boardPlateResult'
import { pageLog } from '@/api/board/boardPlateResult'
import { queryBoardTestLogExportInfo } from '@/api/board/boardPlateResult'
import { exportProcess } from '@/api/board/boardPlateResult'



const APP_URL = '/api/ptmaction2'
// const APP_URL = "http://localhost:8092";
const HEADER = {
  headers: {
    'Access-Control-Allow-Credentials': true,
    withCredentials: false
  }
}
export default {
  name: 'OrderVendor',
  components: {
    Pagination: {
      name: 'Pagination',
      props: {
        total: {
          required: true,
          type: Number
        },
        page: {
          type: Number,
          default: 1
        },
        limit: {
          type: Number,
          default: 20
        },
        pageSizes: {
          type: Array,
          default() {
            return [10, 20, 30, 50]
          }
        },
        layout: {
          type: String,
          default: 'total, prev, pager, next, jumper'
        },
        background: {
          type: Boolean,
          default: false
        },
        autoScroll: {
          type: Boolean,
          default: true
        },
        hidden: {
          type: Boolean,
          default: false
        }
      },
      computed: {
        currentPage: {
          get() {
            return this.page
          },
          set(val) {
            this.$emit('update:page', val)
          }
        },
        pageSize: {
          get() {
            return this.limit
          },
          set(val) {
            this.$emit('update:limit', val)
          }
        }
      },
      methods: {
        handleSizeChange(val) {
          this.$emit('pagination', { page: this.currentPage, limit: val })
        },
        handleCurrentChange(val) {
          this.$emit('pagination', { page: val, limit: this.pageSize })
        }
      },
      template: `
            <div :class="{'hidden':hidden}">
            <el-pagination
              :background="background"
              :current-page.sync="currentPage"
              :page-size.sync="pageSize"
              :layout="layout"
              :page-sizes="pageSizes"
              :total="total"
              v-bind="$attrs"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
            </div>
          `
    }
  },
  data() {
    return {
      // 遮罩层
      fullscreenLoading: false,
      fileDown: {
        downloadBatchNum: '',
        processed: 0,
        exportTotalNum: 0,
        loadDialogStatus: false,
        percentage: 0
      },
      loading: false,
      // 总条数
      total: 0,
      // 分表数据
      tableList: [],
      // 查询参数
      queryParams: {
        tableName: '',
        pageIndex: 1,
        pageSize: 10,
        orderNum: null,
        line: null,
        testPositionNumber: null,
        testValue: '',
        tsn: null,
        itemCode: null,
        groupNum: null,
        mac: null,
        startTime: null,
        endTime: null,
        downloadBatchNum: ''
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
    debugger
    this.onConfigMenu()
    this.loading = false
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.getTableList()
  },
  methods: {
    /** 查询分表列表 */
    getTableList() {
      // const api = '/inner/test/log/divide/table/list'
      listTestLog()
        .then((res) => {
          if (res.code === '200' && res.data != null) {
            this.tableList = res.data
          } else {
            this.$message.error(res.msg.join('，'))
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    /** 查询列表 */
    getList() {
      this.getTableList()
      if (
        !this.queryParams.orderNum &&
        !this.queryParams.tsn &&
        !this.queryParams.mac
      ) {
        this.$message.warning(
          '由于数据量较大，请输入订单号、TSN、MAC中的任意一个条件后再查询！（均为精确查询）'
        )
        return
      }
      this.loading = true
      // const api = '/inner/test/log/query/page'
      pageLog(this.queryParams)
        .then((res) => {
          if (res.code === '200') {
            if (res.data != null) {
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
      this.getList()
      this.queryParams.pageIndex = 1
    },
    /** 导出当前查询数据 */
    exportData() {
      if (this.fileDown.downloadBatchNum) {
        this.$message.warning('正在下载中，请勿重复操作！')
        return;
      }
      if (
        !this.queryParams.orderNum &&
        !this.queryParams.tsn &&
        !this.queryParams.mac
      ) {
        this.$message.warning(
          '由于数据量较大，请输入订单号、TSN、MAC中的任意一个条件后再导出！'
        )
        return;
      }
      this.queryBoardTestLogExportInfo()
    },
    queryBoardTestLogExportInfo() {
      // const api = '/inner/test/log/query/queryBoardTestLogExportInfo'
      queryBoardTestLogExportInfo(this.queryParams)
        .then((res) => {
          if (res.code === '200' && res.data != null) {
            this.fileDown.downloadBatchNum = res.data.downloadBatchNum
            this.fileDown.exportTotalNum = res.data.exportTotalNum
            this.exportNotice()
          } else {
            this.$message.error(res.msg.join('，'))
          }
        })
    },
    exportNotice() {
      this.$confirm(
        '当前共计 ' + this.fileDown.exportTotalNum + ' 条数据，请确认是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.export()
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消' })
          this.fileDown.downloadBatchNum = ''
          this.fileDown.exportTotalNum = ''
        })
    },
    export() {
      this.fileDown.loadDialogStatus = true
      const config = {
        header: HEADER.headers,
        timeout: 30 * 60 * 1000,
        onTimeout: (request) => {
          this.downloadResult(false)
          this.$message.error('请求超时，请稍后重试！')
        }
      }
      this.queryProcess()
      this.queryParams.downloadBatchNum = this.fileDown.downloadBatchNum
      const api = '/inner/test/log/query/export'
      this.$http
        .postBlob(APP_URL + api, this.queryParams, null, config)
        .then((res) => {
          this.handleDownLoadFile(res, '宽产测试结果明细.csv')
        })
        .catch(() => {
          this.downloadResult(false)
          this.$message.error('导出失败，请稍后重试!')
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
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(src) // 释放掉blob对象
        this.downloadResult(true)
      }
    },
    downloadResult(result) {
      if (result) {
        this.$message.success('导出成功，请稍后在下载记录中查看!')
        this.fileDown.percentage = 100
      }
      if (this.fileDown.downloadBatchNum) {
        this.fileDown.downloadBatchNum = ''
        setTimeout(() => {
          this.fileDown.loadDialogStatus = false
          this.fileDown.percentage = 0
        }, 2000)
      }
    },
    queryProcess() {
      if (!this.fileDown.loadDialogStatus) {
        return
      }
      // const config = {
      //   header: HEADER.headers,
      //   timeout: 30 * 60 * 1000,
      //   onTimeout: (request) => {
      //     this.downloadResult(false)
      //     this.$message.error('请求超时，请稍后重试！')
      //   }
      // }
      // const api ='/inner/test/log/query/exportProcess?batchNum=' +
      exportProcess(this.fileDown.downloadBatchNum).then((res) => {
        if (res.code === '200' && res.data != null) {
          this.fileDown.percentage = res.data.percentage
          this.fileDown.processed = res.data.processed
          if (this.fileDown.percentage < 100) {
            setTimeout(() => {
              this.queryProcess()
            }, 3000)
          }
        } else {
          this.$message.error(res.msg.join('，'))
        }
      })
    }
  }
}
</script>

