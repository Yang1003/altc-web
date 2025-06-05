<template>
    <div>
      <!-- 搜索工作栏 -->
      <el-container>
        <el-main>
          <el-form size="small" :model="queryParams" ref="queryParams" label-width="120px" style="width: 100%" :inline="true" @submit.native.prevent @keyup.native.enter="search">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="queryParams.username"></el-input>
            </el-form-item>
            <el-button size="small" type="primary" icon="el-icon-search" plain @click="search"> 查询 </el-button>
          </el-form>
  
          <!-- 列表 -->
          <el-table size="small" :data="list" border v-loading="loading" style="width: 100%">
            <el-table-column align="center" prop="id" label="ID" width="50"> </el-table-column>
  
            <el-table-column align="center" prop="displayName" label="姓名"> </el-table-column>
            <el-table-column align="center" prop="username" label="用户名"> </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" width="120" prop="roleStr" label="角色"> </el-table-column>
  
            <el-table-column align="center" prop="modifiedUserName" label="创建人"> </el-table-column>
            <el-table-column align="center" prop="modifiedDate" label="创建时间"> </el-table-column>
  
            <el-table-column label="操作" fixed="right" align="center" width="150">
              <template slot-scope="scope">
                <span>
                  <el-button size="small" type="text" @click="handleViewOpen(scope.row)">查看 </el-button>
                  <el-button size="small" type="text" v-if="conf.editAuth" @click="handleModifyOpen(scope.row)">编辑 </el-button>
                  <el-button size="small" type="text" v-if="conf.editAuth" @click="handleDeleteOpen(scope.row)">删除 </el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <pagination :total="total" :page.sync="queryParams.pageIndex" :limit.sync="queryParams.pageSize" @pagination="getList" />
  
        </el-main>
      </el-container>
    </div>
  </template>
  
  <script>
  const APP_URL = "/api/ptmlabel";
  // const APP_URL = "http://localhost:8096";
  const HEADER = {
    headers: {
      "Access-Control-Allow-Credentials": true,
      withCredentials: false,
    },
  };
  export default {
    name: "netaccess_rule",
    components: {
      Pagination: {
        name: "Pagination",
        props: {
          total: {
            required: true,
            type: Number,
          },
          page: {
            type: Number,
            default: 1,
          },
          limit: {
            type: Number,
            default: 20,
          },
          pageSizes: {
            type: Array,
            default() {
              return [10, 20, 30, 50];
            },
          },
          layout: {
            type: String,
            default: "total, prev, pager, next, jumper",
          },
          background: {
            type: Boolean,
            default: false,
          },
          autoScroll: {
            type: Boolean,
            default: true,
          },
          hidden: {
            type: Boolean,
            default: false,
          },
        },
        computed: {
          currentPage: {
            get() {
              return this.page;
            },
            set(val) {
              this.$emit("update:page", val);
            },
          },
          pageSize: {
            get() {
              return this.limit;
            },
            set(val) {
              this.$emit("update:limit", val);
            },
          },
        },
        methods: {
          handleSizeChange(val) {
            this.$emit("pagination", { page: this.currentPage, limit: val });
          },
          handleCurrentChange(val) {
            this.$emit("pagination", { page: val, limit: this.pageSize });
          },
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
              `,
      },
    },
    data() {
      return {
        conf: {},
        currentRuleType: {},
        add: {
          view: false,
          // 0-查看，1-新增，2-编辑
          type: 0,
          open: false,
          title: "新增规则",
          rules: {
            productItemCode: [
              {
                required: true,
                message: "产品物料号",
                trigger: "blur",
              },
            ],
            processType: [
              {
                required: true,
                message: "请选择工序",
                trigger: "blur",
              },
            ],
            checkType: [
              {
                required: true,
                message: "请选择是否需要校验",
                trigger: "blur",
              },
            ],
            netAccessTypeNum: [
              {
                required: true,
                message: "请输入进网证数量",
                trigger: "blur",
              },
            ],
            netAccessRuleType: [
              {
                required: true,
                message: "请选择进网证规则类型",
                trigger: "blur",
              },
            ],
            netAccessResourceName: [
              {
                required: true,
                message: "请输入进网证物料号",
                trigger: "blur",
              },
            ],
            labelItemCode: [
              {
                required: true,
                message: "请输入标签物料号",
                trigger: "blur",
              },
            ],
            netAccessBindType: [
              {
                required: true,
                message: "请选择绑定类型",
                trigger: "blur",
              },
            ],
          },
          form: {
            id: "",
            productItemCode: "",
            deviceTypeName: "",
            processType: "",
            checkType: "",
            netAccessTypeNum: "",
            netAccessResourceName: "",
            netAccessBindType: "",
            labelItemCode: "",
            netAccessRuleType: 0,
            netAccessRuleCfg: "",
          },
          selected: {},
        },
        // 遮罩层
        fullscreenLoading: false,
        loading: false,
        // 查询参数
        queryParams: {
          pageIndex: 1,
          pageSize: 10,
          productItemCode: "",
          deviceTypeName: "",
          processType: "",
          checkType: "",
        },
        // 表格数据
        list: [],
        // 总条数
        total: 0,
      };
    },
    // 计算属性
    computed: {},
    watch: {},
    // 生命周期 - 创建完成（访问当前this实例）
    created() {
      debugger;
      this.init();
    },
    // 生命周期 - 挂载完成（访问DOM元素）
    mounted() {},
    methods: {
      init() {
        this.getConf();
        this.getList();
      },
      handleAddSuccess() {
        this.search();
        this.handleAddClose();
      },
      handleModifySuccess() {
        this.search();
        this.handleAddClose();
      },
      /** 搜索按钮操作 */
      search() {
        this.getList();
        this.queryParams.pageIndex = 1;
      },
      handleViewOpen(row) {
        this.add.selected = row;
        this.add.view = true;
        this.add.type = 0;
        this.add.open = true;
        this.add.title = "查看规则";
        this.setAddFormData(row);
      },
      handleAddOpen() {
        this.add.view = false;
        this.add.type = 1;
        this.add.open = true;
        this.add.title = "新增规则";
      },
      handleModifyOpen(row) {
        this.add.selected = row;
        this.add.view = false;
        this.add.type = 2;
        this.add.open = true;
        this.add.title = "编辑规则";
        this.setAddFormData(row);
      },
      handleDeleteOpen(row) {
        this.$confirm("是否确定删除当前规则？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.delete(row.id);
        });
      },
      handleAddClose() {
        this.add.view = false;
        this.add.open = false;
        this.add.type = 0;
        this.add.title = "查看规则";
        this.add.selected = "";
        this.currentRuleType = this.conf.netAccessRuleType[0];
        this.resetAddForm();
      },
      handleSubmitAdd() {
        if (this.add.type == 1) {
          // 新增
          this.addNew(this.add.form);
        } else if (this.add.type == 2) {
          // 编辑
          this.modify(this.add.form);
        }
      },
      setAddFormData(row) {
        for (let key in this.add.form) {
          this.add.form[key] = row[key];
        }
      },
      resetAddForm() {
        for (let key in this.add.form) {
          this.add.form[key] = "";
        }
        this.add.form.netAccessRuleType = 0;
      },
      /** 配置 */
      getConf() {
        this.loading = true;
        const api = "/net/access/rule/conf";
        this.$http
          .get(APP_URL + api, null, null, HEADER)
          .then((res) => {
            if (res.code === "200" && res.data != null) {
              this.conf = res.data;
              this.currentRuleType = this.conf.netAccessRuleType[0];
            } else {
              this.$message.error(res.msg.join("，"));
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
      /** 查询列表 */
      getList() {
        this.loading = true;
        const api = "/net/access/rule/page";
        this.$http
          .post(APP_URL + api, this.queryParams, null, HEADER)
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
      netAccessRuleTypeChange(val) {
        for (let i = 0; i < this.conf.netAccessRuleType.length; i++) {
          let item = this.conf.netAccessRuleType[i];
          if (val == item.code) {
            this.currentRuleType = item;
          }
        }
      },
      /** 新增 */
      addNew(entity) {
        this.loading = true;
        const api = "/net/access/rule/add";
        this.$http
          .post(APP_URL + api, entity, null, HEADER)
          .then((res) => {
            if (res.code === "200") {
              this.$message.success("规则创建成功！");
              this.handleAddSuccess();
            } else {
              this.$message.error(res.msg.join("，"));
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
      /** 编辑 */
      modify(entity) {
        this.loading = true;
        const api = "/net/access/rule/modify";
        this.$http
          .post(APP_URL + api, entity, null, HEADER)
          .then((res) => {
            if (res.code === "200") {
              this.$message.success("规则修改成功！");
              this.handleModifySuccess();
            } else {
              this.$message.error(res.msg.join("，"));
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
      /** 删除 */
      delete(id) {
        this.loading = true;
        const api = "/net/access/rule/delete?id=" + id;
        this.$http
          .post(APP_URL + api, null, null, HEADER)
          .then((res) => {
            if (res.code === "200") {
              this.$message.success("规则删除成功！");
              this.getList();
            } else {
              this.$message.error(res.msg.join("，"));
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  };
  </script>
  
  <style>
  .el-form .el-select,
  .el-form .el-switch,
  .el-form .el-input-number {
    display: inline-block;
    position: relative;
    width: 179px;
  }
  
  .el-textarea.is-disabled .el-textarea__inner {
    color: #5b5c5d !important;
  }
  
  .el-input.is-disabled .el-input__inner {
    color: #5b5c5d !important;
  }
  
  .upload-tips {
    /* margin-top: 10px; */
    margin-bottom: 5px;
    border: 1px solid #e1e1e1;
    padding: 5px;
  }
  
  .el-upload-tip {
    font-size: 14px;
    color: #a3a3a3;
    vertical-align: bottom;
  }
  </style>
  