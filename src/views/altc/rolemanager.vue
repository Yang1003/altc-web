<template>
    <div>
      <!-- 搜索工作栏 -->
      <el-container>
        <el-main>
          <el-form size="small" :model="queryParams" ref="queryParams" label-width="100px" style="width: 100%" :inline="true" @submit.native.prevent @keyup.native.enter="search">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="queryParams.roleName"></el-input>
            </el-form-item>
            <el-button size="small" type="primary" icon="el-icon-search" plain @click="search"> 查询 </el-button>
            <el-button size="small" v-if="conf.pageRight.rightMap.add" type="success" icon="el-icon-plus" @click="handleAddOpen"> 新增角色 </el-button>
          </el-form>
  
          <!-- 列表 -->
          <el-table size="small" :data="list" border v-loading="loading" style="width: 100%">
            <el-table-column align="center" prop="id" label="ID" width="50"> </el-table-column>
            <el-table-column align="center" width="120" prop="roleName" label="角色名称"> </el-table-column>
            <el-table-column align="center" width="150" prop="roleDesc" label="角色描述"> </el-table-column>
            <el-table-column align="center" prop="permissionDetail" label="权限详情">
              <template slot-scope="scope">
                <span v-if="scope.row.roleName == '超级管理员'">
                  <el-tag type="success">超级管理员拥有全部权限，无需单独配置</el-tag>
                </span>
                <span v-else>{{ scope.row.permissionDetail }}</span>
              </template>
            </el-table-column>
  
            <el-table-column align="center" width="120" prop="modifiedUserName" label="创建人"> </el-table-column>
            <el-table-column align="center" width="180" prop="modifiedDate" label="创建时间"> </el-table-column>
  
            <el-table-column label="操作" fixed="right" align="center" width="150">
              <template slot-scope="scope">
                <span>
                  <el-button size="small" type="text" v-if="conf.pageRight.rightMap.modify" @click="handleModifyOpen(scope.row)">编辑</el-button>
                  <el-button size="small" type="text" v-if="conf.pageRight.rightMap.delete && scope.row.roleName != '超级管理员'" @click="handleDeleteOpen(scope.row)">删除 </el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <pagination :total="total" :page.sync="queryParams.pageIndex" :limit.sync="queryParams.pageSize" @pagination="getList" />
  
          <!-- 对话框(修改) -->
          <el-dialog :title="add.title" :visible.sync="add.open" width="800px" :close-on-click-modal="false" :append-to-body="true" @closed="handleAddClose">
            <el-form ref="addForm" :model="add.form" :rules="add.rules" label-width="150px" size="small">
              <el-row>
                <el-col :span="18">
                  <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model.trim="add.form.roleName" placeholder="请输入" :disabled="add.type != 1"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="18">
                  <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model.trim="add.form.roleDesc" placeholder="请输入" :disabled="add.view"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-divider>权限配置</el-divider>
              <el-row v-if="add.form.roleName == '超级管理员'">
                <el-col :span="18">
                  <el-form-item label=" ">
                    <el-tag type="success">超级管理员拥有全部权限，无需单独配置</el-tag>
                  </el-form-item>
                </el-col>
              </el-row>
              <div v-else>
                <el-button size="small" style="margin-bottom: 5px" type="primary" v-if="conf.pageRight.rightMap.modify" @click="handleAddPermissions">添加权限</el-button>
                <el-row>
                  <el-col :span="24">
                    <!-- 列表 -->
                    <el-table size="small" :data="add.form.rolePermissions" border v-loading="loading" style="width: 100%">
                      <el-table-column align="center" prop="permissionName" label="模块" width="200">
                        <template slot-scope="scope">
                          <el-select size="mini" v-if="scope.row.add" v-model="scope.row.permissionName" filterable>
                            <el-option v-for="item in conf.pagePermissions" :key="item.name" :value="item.name" :label="item.name"> </el-option>
                          </el-select>
                          <span v-else>
                            {{ scope.row.permissionName }}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="permissionValue" label="权限">
                        <template slot-scope="scope">
                          <el-select size="mini" class="right-select" v-model="scope.row.permissionList" filterable multiple>
                            <el-option v-for="right in conf.rights" :key="right.name" :value="right.name" :label="right.name"> </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" fixed="right" align="center" width="100">
                        <template slot-scope="scope">
                          <span>
                            <el-button size="mini" icon="el-icon-minus" circle @click="handleDeletePermissions(scope.row)" v-if="conf.pageRight.rightMap.modify"></el-button>
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
              </div>
            </el-form>
            <span slot="footer" class="dialog-footer" v-if="!add.view">
              <el-button @click="handleAddClose" size="small">取 消</el-button>
              <el-button type="primary" @click="handleSubmitAdd" size="small">确 定</el-button>
            </span>
          </el-dialog>
        </el-main>
      </el-container>
    </div>
  </template>
  
  <script>
  export default {
    name: "rolemanager",
    path: "/base/role",
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
        superAdminKey: "超级管理员",
        add: {
          view: false,
          // 0-查看，1-新增，2-编辑
          type: 0,
          open: false,
          title: "修改角色信息",
          rules: {},
          form: {
            id: "",
            roleName: "",
            roleDesc: "",
            rolePermissions: [],
          },
          selected: {},
        },
        loading: false,
        // 查询参数
        queryParams: {
          pageIndex: 1,
          pageSize: 10,
          roleName: "",
          roleDesc: "",
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
      handleAddOpen() {
        this.add.view = false;
        this.add.type = 1;
        this.add.open = true;
        this.add.title = "新增角色";
      },
      handleModifyOpen(row) {
        this.add.selected = row;
        this.add.view = false;
        this.add.type = 2;
        this.add.open = true;
        this.add.title = "修改角色信息";
        this.setAddFormData(row);
      },
      handleDeleteOpen(row) {
        this.$confirm("是否确定删除当前角色，该操作不可撤销？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.deleteByRoleName(row.roleName);
        });
      },
      handleAddClose() {
        this.add.view = false;
        this.add.open = false;
        this.add.type = 0;
        this.add.title = "";
        this.add.selected = "";
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
      },
      /** 配置 */
      getConf() {
        this.loading = true;
        const api = "/role/manager/conf";
        this.$http
          .get(api, null, null, null)
          .then((res) => {
            if (res.code === "200" && res.data != null) {
              this.conf = res.data;
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
        const api = "/role/manager/page";
        this.$http
          .post(api, this.queryParams, null, null)
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
      addNew(roleInfo) {
        this.loading = true;
        const api = "/role/manager/add";
        this.$http
          .post(api, roleInfo, null, null)
          .then((res) => {
            if (res.code === "200") {
              this.$message.success("新增成功！");
              this.handleAddSuccess();
            } else {
              this.$message.error(res.msg.join("，"));
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
      modify(roleInfo) {
        this.loading = true;
        const api = "/role/manager/modify";
        this.$http
          .post(api, roleInfo, null, null)
          .then((res) => {
            if (res.code === "200") {
              this.$message.success("修改成功！");
              this.handleModifySuccess();
            } else {
              this.$message.error(res.msg.join("，"));
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
      deleteByRoleName(roleName) {
        this.loading = true;
        let roleInfo = {
          roleName: roleName,
        };
        const api = "/role/manager/deleteByRoleName";
        this.$http
          .post(api, roleInfo, null, null)
          .then((res) => {
            if (res.code === "200") {
              this.$message.success("删除成功！");
              this.search();
            } else {
              this.$message.error(res.msg.join("，"));
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 权限编辑
      handleDeletePermissions(row) {
        let newRolePermissions = [];
        let rolePermissions = this.add.form.rolePermissions;
        if (rolePermissions == null) {
          rolePermissions = [];
        }
        for (let index = 0; index < rolePermissions.length; index++) {
          let item = rolePermissions[index];
          if (row.permissionName == item.permissionName) {
            continue;
          }
          newRolePermissions.push(item);
        }
        this.add.form.rolePermissions = newRolePermissions;
      },
      handleAddPermissions() {
        let item = {
          add: true,
          permissionName: "",
          permissionList: [],
          permissionValue: "",
        };
        let rolePermissions = this.add.form.rolePermissions;
        if (rolePermissions == null) {
          rolePermissions = [];
        }
        rolePermissions.push(item);
        this.add.form.rolePermissions = rolePermissions;
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
  
  .right-select {
    width: 330px !important;
  }
  </style>
  