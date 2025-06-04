<template>
  <div class="OrderVendor">
    <!-- 搜索工作栏 -->
    <el-card class="box-card">
      <el-form
        size="small"
        :model="queryParams"
        ref="queryParams"
        label-width="120px"
        style="width: 100%"
        :inline="true"
        @submit.native.prevent
        @keyup.native.enter="search"
      >
        <el-form-item :label="$t('softLunch.orderNum')" prop="orderId">
          <el-input v-model="queryParams.orderId"></el-input>
        </el-form-item>
        <el-form-item label="MAC" prop="mac">
          <el-input v-model="queryParams.mac"></el-input>
        </el-form-item>
        <el-form-item label="TSN" prop="tsn">
          <el-input v-model="queryParams.tsn"></el-input>
        </el-form-item>
        <el-form-item :label="$t('testResultPage.repairCount')"  prop="servicenum">
          <el-input v-model="queryParams.servicenum"></el-input>
        </el-form-item>
        <el-form-item :label="$t('ptmTranslation.starttime')" prop="startTime">
          <el-date-picker
            v-model="queryParams.startTime"
            value-format="yyyy-MM-dd 00:00:00"
            type="date"
            :placeholder="$t('ptmTranslation.selectDateTime')"
            @change="search"
            style="width: 200px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('ptmTranslation.endtime')" prop="endTime">
          <el-date-picker
            v-model="queryParams.endTime"
            value-format="yyyy-MM-dd 23:59:59"
            type="date"
            :placeholder="$t('ptmTranslation.selectDateTime')"
            @change="search"
            style="width: 200px"
          >
          </el-date-picker>
        </el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          plain
          @click="search"
        >{{$t('ptmTranslation.search')}}
        </el-button>
      </el-form>

      <!-- 列表 -->
      <el-table
        size="small"
        :data="list"
        v-loading="loading"
        style="width: 100%"
        border
      >
        <el-table-column align="center" type="index" width="50" fixed>
        </el-table-column>
        <el-table-column
          align="center"
          prop="mac"
          label="MAC"
          min-width="180"
          fixed
        >
        </el-table-column>
        <el-table-column align="center" prop="tsn" label="TSN" min-width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="servicenum"
          :label="$t('testResultPage.repairCount')"
          min-width="180"
        >
        </el-table-column>

        <el-table-column
          align="center"
          prop="totalresult"
          :label="$t('testResultPage.totalresult')"
          min-width="180"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.totalresult == 1" type="success"
              >{{$t('testResultPage.pass')}}</el-tag
            >
            <el-tag v-else type="warning">{{$t('testResultPage.fail')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="personname"
          :label="$t('ptmTranslation.operator')"
          min-width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="datetime"
          :label="$t('table.date')"
          min-width="180"
        >
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <!-- <pagination
        :total="total"
        :page.sync="queryParams.pageIndex"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      /> -->

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
       
            :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { listTotalResult } from "@/api/board/boardTestResult"

// const APP_URL = process.env.VUE_APP_BASE_API;
// const HEADER = {
//   headers: {
//     "Access-Control-Allow-Credentials": true,
//     withCredentials: false
//   }
// };
export default {
  name: "OrderVendor",
 
  data() {
    return {
      currentPage:1,
      visible: false,
      testLog: "",
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        orderId: null,
        mac: null,
        totalresult: null,
        tsn: null,
        servicenum: null,
        startTime: null,
        endTime: null,
      },
      // 表格数据
      list: [],
    };
  },
  // 计算属性
  computed: {},
  watch: {},
  // 生命周期 - 创建完成（访问当前this实例）
  created() {
    this.getList();
    this.loading = false;
  },
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    
    handleSizeChange(size) {
      this.queryParams.pageSize = size;
      this.queryParams.pageIndex = 1;
      this.getList();
    },
    handleCurrentChange(page){
      this.queryParams.pageIndex = page;
      this.getList();
    },
    /** 查询列表 */
    getList() {
      debugger;
      this.loading = true;
      // const api = "/boardtest/total/result/list";
      listTotalResult(this.queryParams)
        .then((res) => {
          if (res.code === "200") {
            if (res.data != null) {
              this.list = res.data;
              this.total = res.total;
            }
          } else {
            this.$message.error(res.msg.join("，"));
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /** 搜索按钮操作 */
    search() {
      if (this.queryParams.mac === "") this.queryParams.mac = null;
      if (this.queryParams.totalresult === "") this.queryParams.totalresult = null;
      if (this.queryParams.tsn === "") this.queryParams.tsn = null;
      if (this.queryParams.startTime === "") this.queryParams.startTime = null;
      if (this.queryParams.endTime === "") this.queryParams.endTime = null;
      this.getList();
      this.queryParams.pageIndex = 1;
    }
  }
};
</script>

<style>
.ManufacturerInfoMainten .el-table__header-wrapper .el-table__cell,
.ManufacturerInfoMainten .el-table__fixed-header-wrapper .el-table__cell {
  background: #fafafa;
}

.ManufacturerInfoMainten .el-input,
.ManufacturerInfoMainten .el-input__inner {
  border-radius: 0;
}

.el-form .el-select,
.el-form .el-switch,
.el-form .el-input-number {
  display: inline-block;
  position: relative;
  width: 179px;
}
</style>
