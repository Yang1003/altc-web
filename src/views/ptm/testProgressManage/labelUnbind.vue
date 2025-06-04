<template>
  <div class="ContractInfo">
    <el-card class="box-card">
      <!-- 搜索工作栏 -->
      <el-form
        ref="queryParams"
        size="small"
        :model="queryParams"
        label-width="100px"
        style="width: 100%"
        :inline="true"
        @submit.native.prevent
        @keyup.native.enter="search"
      >
        <el-form-item 
        :label="$t('softLunch.orderNum')"
         prop="orderNum">
          <el-input v-model.trim="queryParams.orderNum" />
        </el-form-item>
        <el-form-item label="MAC" prop="mac">
          <el-input v-model.trim="queryParams.mac" />
        </el-form-item>
        <el-form-item label="TSN" prop="tsn">
          <el-input v-model.trim="queryParams.tsn" />
        </el-form-item>
        <el-form-item label="BOSASN" prop="bosasn">
          <el-input v-model.trim="queryParams.bosasn" />
        </el-form-item>
        <el-form-item label="BOSASN2" prop="bosasn2">
          <el-input v-model.trim="queryParams.bosasn2" />
        </el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          plain
          @click="search()"
        >
          {{$t('ptmTranslation.search')}}
        </el-button>
        <el-button
          v-if="showEdit"
          size="small"
          type="warning"
          plain
          @click="alledit()"
        >
          {{$t('labelUnbindPage.unbindBatch')}}
        </el-button>
        <el-button
          v-if="showEdit"
          size="small"
          type="danger"
          plain
          @click="handleUnBindByOrderNo()"
        >
          {{$t('labelUnbindPage.unbindBatchByOrderNum')}}
        </el-button>
      </el-form>

      <!-- 列表 -->
      <el-table
        ref="multipleTable"
        :data="list"
        border
        style="width: 100%"
        size="small"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="50" align="center" />
        <el-table-column
          prop="mac"
          label="MAC"
          align="center"
          width="200"
        />
        <el-table-column
          prop="orderNum"
          :label="$t('softLunch.orderNum')"
          align="center"
          width="200"
        />
        <el-table-column
          prop="tsn"
          label="tsn"
          align="center"
          width="200"
        />
        <el-table-column
          prop="bosasn"
          label="bosasn"
          align="center"
          width="200"
        />
        <el-table-column
          prop="bosasn2"
          label="bosasn2"
          align="center"
          width="200"
        />
        <el-table-column
          prop="bosaType"
          label="bosaType"
          align="center"
          width="200"
        />
        <el-table-column
          prop="bosatype2"
          label="bosatype2"
          align="center"
          width="200"
        />
        <el-table-column
          prop="bosavop"
          label="bosavop"
          align="center"
          width="200"
        />
        <el-table-column
          prop="remark"
          :label="$t('table.remark')"
          align="center"
          width="200"
        />1`2QQ
        <el-table-column
          prop="createUserName"
          :label="$t('table.creater')"
          align="center"
          width="200"
        />
        <el-table-column
          prop="createDate"
          :label="$t('table.date')"
          align="center"
          width="200"
        />
        <el-table-column
          v-if="showEdit"
          fixed="right"
          :label="$t('table.actions')"
          width="100"
          align="center"
          size="small"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="edit(scope.row)"
            >{{$t('ptmTranslation.unbind')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        :current-page="queryParams.pageIndex"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <!-- 对话框(根据订单号批量解绑：输入订单号) -->
      <el-dialog
        v-loading.fullscreen.lock="unBind.isLoading"
        :title="unBind.title"
        :visible.sync="unBind.open"
        width="400px"
        :close-on-click-modal="false"
        append-to-body
        @closed="unBindByOrderNoInputCancel"
      >
        <el-input v-model="unBind.orderNum" :placeholder="$t('softLunch.orderNum')" />
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="orderNoInputConfirm">
            {{$t('permission.confirm')}}
          </el-button>
          <el-button
            size="small"
            @click="unBindByOrderNoInputCancel"
          >{{$t('permission.cancel')}}</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { pageList } from '@/api/board/boardCodeUnbind'
import { unBindByOrderNum } from '@/api/board/boardCodeUnbind'
import { queryUnBindByOrderNum } from '@/api/board/boardCodeUnbind'
import { unBindBatch } from '@/api/board/boardCodeUnbind'
import { unBind } from '@/api/board/boardCodeUnbind'

// const APP_URL = process.env.VUE_APP_BASE_API
// const HEADER = {
//   headers: {
//     'Access-Control-Allow-Credentials': true,
//     withCredentials: false,
//   },
// }
export default {
  name: 'LabelUnbind',
  data() {
    return {
      // 是否显示编辑功能
      showEdit: true,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        bosasn: null,
        bosasn2: null,
        mac: null,
        orderNum: null,
        tsn: null
      },
      // 根据订单号解绑
      unBind: {
        title: this.$t('labelUnbindPage.unbindBatchByOrderNum'),
        open: false,
        isLoading: false,
        orderNum: '',
        total: 0
      },
      // 表格数据
      list: []
    }
  },
  // 计算属性
  computed: {},
  watch: {},
  // 生命周期 - 创建完成（访问当前this实例）
  async created() {
    await this.getList()
    await this.judgeRole()
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageIndex = val
      this.getList()
    },
    /** 查询列表 */
    getList() {
      pageList(this.queryParams).then((res) => {
        console.log(res)
        if (res.code === '200') {
          if (res.data != null) {
            this.list = res.data
            this.total = res.total
            this.loading = false
          }
        } else {
          this.$message.error(res.msg.join('，'))
          this.loading = false
        }
      })

      this.list = []
    },
    edit(row) {
      this.$confirm(this.$t('labelUnbindPage.unbindConfirm'), 
                    this.$t('dialog.remind'),
       {
        confirmButtonText: this.$t('permission.confirm'),
        cancelButtonText: this.$t('permission.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        unBind(row.mac).then((res) => {
          console.log(res)
          if (res.code === '200') {
            if (res.data != null) {
              this.$message.success('解绑成功')
              this.getList()
              this.loading = false
            }
          } else {
            this.$message.error(res.msg.join('，'))
            this.loading = false
          }
        })
      })
    },
    alledit() {
      const rows = this.$refs.multipleTable.selection

      if (rows.length === 0) {
        this.$message.error('请勾选需要解绑的数据!')
      }
      this.$confirm(
        '是否将所有勾选数据解除绑定？确认请点击“确定”按钮！',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.loading = true
        let macs = ''
        rows.forEach((item, index) => {
          if (index === 0) {
            macs = item.mac
          } else {
            macs = macs + ',' + item.mac
          }
        })
        unBindBatch(macs).then((res) => {
          console.log(res)
          if (res.code === '200') {
            if (res.data != null) {
              this.$message.success('解绑成功')
              this.getList()
              this.loading = false
            }
          } else {
            this.$message.error(res.msg.join('，'))
            this.loading = false
          }
        })
      })
    },
    search() {
      debugger
      if (this.queryParams.bosasn === '') this.queryParams.bosasn = null
      if (this.queryParams.bosasn2 === '') this.queryParams.bosasn2 = null
      if (this.queryParams.mac === '') this.queryParams.mac = null
      if (this.queryParams.orderNum === '') this.queryParams.orderNum = null
      if (this.queryParams.tsn === '') this.queryParams.tsn = null
      this.queryParams.pageIndex = 1
      this.getList()
    },
    judgeRole() {
      // 判断当前登录用户权限
      debugger
      // var loginUser = this.currLoginUser;
      this.userid = 'admin'

      // 判断用户角色
      // var userRole = loginUser.authorities;
      // if (
      //   userRole.includes("ROLE_ptmAdmin") ||
      //   userRole.includes("ROLE_boardPP") ||
      //   userRole.includes("ROLE_classLeader")
      // ) {
      this.showEdit = true
      // } else {
      //   this.showEdit = false;
      // }
    },
    // 批量解绑
    handleUnBindByOrderNo() {
      this.unBind.open = true
    },
    // 重置数据
    unBindByOrderNoInputCancel() {
      this.unBind.open = false
      this.unBind.isLoading = false
      this.unBind.orderNum = ''
      this.unBind.total = 0
    },
    orderNoInputConfirm() {
      if (this.unBind.orderNum == null || this.unBind.orderNum === '') {
        this.$message.warning('请输入订单号！')
        return
      }
      this.unBind.isLoading = true
      this.queryUnBindByOrder()
    },
    /** 查询列表 */
    queryUnBindByOrder() {
      queryUnBindByOrderNum(this.unBind.orderNum).then((res) => {
        this.unBind.isLoading = false
        if (res.code === '200' && res.data != null) {
          if (res.data === 0) {
            this.$message.warning('该订单关联数据为空，请检查订单号是否正确！')
            return
          }
          this.unBind.total = res.data
          this.showUnBindByOrderDialog()
        } else {
          this.$message.error(res.msg.join('，'))
        }
      })
    },
    showUnBindByOrderDialog() {
      this.$confirm(
        '当前批量解绑订单号为 ' +
          this.unBind.orderNum +
          ' 的共计 ' +
          this.unBind.total +
          ' 条数据，请确认是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.unBindByOrderHttp(this.unBind.orderNum)
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消' })
        })
    },
    unBindByOrderHttp(orderNum) {
      this.unBind.isLoading = true
      unBindByOrderNum(orderNum).then((res) => {
        this.unBind.isLoading = false
        if (res.code === '200') {
          this.$message.success('批量解绑成功！')
          this.unBindByOrderSuccess()
        } else {
          this.$message.error(res.msg.join('，'))
        }
      })
    },
    unBindByOrderSuccess() {
      this.getList()
      this.unBindByOrderNoInputCancel()
    }
  }
}
</script>

<style>
.ContractInfo .el-table__header-wrapper .el-table__cell,
.ContractInfo .el-table__fixed-header-wrapper .el-table__cell {
  background: #fafafa;
}

.el-select {
  display: inline-block;
  position: relative;
  width: 190px;
}
</style>
