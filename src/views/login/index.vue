<template>
    <div class="login-container">
      <el-container class="container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
          <div class="title-container">
            <h3 class="title">
              {{ $t("login.title") }}
            </h3>
            <lang-select class="set-language" />
          </div>
  
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input ref="username" v-model="loginForm.username" :placeholder="$t('login.username')" name="username" type="text" tabindex="1" autocomplete="on" />
          </el-form-item>
  
          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                :placeholder="$t('login.password')"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>
  
          <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px" @click.native.prevent="handleLogin">
            {{ $t("login.logIn") }}
          </el-button>
          <el-row>
            <el-col style="text-align: right">
              <el-button style="color: white" type="text" @click.native.prevent="handleRegisterOpen">
                {{ $t("login.register") }}
              </el-button>
            </el-col>
          </el-row>
        </el-form>
        <!-- 对话框(申请账号) -->
        <el-dialog :title="$t('login.register')" :visible.sync="register.open" width="500px" :close-on-click-modal="false" :append-to-body="true" @closed="handleRegisterClose" class="-dialog-body">
          <el-form ref="registerForm" :model="registerForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input ref="username" v-model.trim="registerForm.username" :placeholder="$t('login.username')" name="username" type="text" tabindex="1" autocomplete="on" />
            </el-form-item>
  
            <el-tooltip v-model.trim="capsTooltip" content="Caps lock is On" placement="right" manual>
              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="registerForm.password"
                  :type="passwordType"
                  :placeholder="$t('login.password')"
                  name="password"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
            </el-tooltip>
          </el-form>
          <span slot="footer" class="dialog-footer nalDetail-footer">
            <el-button @click="handleRegisterClose" size="small"> {{ $t("btn.cancel") }}</el-button>
            <el-button @click="handleRegister" type="success" size="small"> {{ $t("btn.confirm") }}</el-button>
          </span>
        </el-dialog>
      </el-container>
    </div>
  </template>
  
  <script>
  import { validUsername } from "@/utils/validate";
  import LangSelect from "@/components/LangSelect";
  
  export default {
    name: "Login",
    components: { LangSelect },
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validUsername(value)) {
          callback(new Error("请输入正确的用户名"));
        } else {
          callback();
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error("密码长度不能小于6"));
        } else {
          callback();
        }
      };
      return {
        loginForm: {
          username: "",
          password: "",
        },
        loginRules: {
          username: [{ required: true, trigger: "blur", validator: validateUsername }],
          password: [{ required: true, trigger: "blur", validator: validatePassword }],
        },
        passwordType: "password",
        capsTooltip: false,
        loading: false,
        showDialog: false,
        redirect: undefined,
        otherQuery: {},
        register: {
          open: false,
        },
        registerForm: {
          username: "",
          password: "",
        },
      };
    },
    watch: {
      $route: {
        handler: function (route) {
          const query = route.query;
          if (query) {
            this.redirect = query.redirect;
            this.otherQuery = this.getOtherQuery(query);
          }
        },
        immediate: true,
      },
    },
    created() {
      // window.addEventListener('storage', this.afterQRScan)
    },
    mounted() {
      if (this.loginForm.username === "") {
        this.$refs.username.focus();
      } else if (this.loginForm.password === "") {
        this.$refs.password.focus();
      }
    },
    destroyed() {
      // window.removeEventListener('storage', this.afterQRScan)
    },
    methods: {
      checkCapslock(e) {
        const { key } = e;
        this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
      },
      showPwd() {
        if (this.passwordType === "password") {
          this.passwordType = "";
        } else {
          this.passwordType = "password";
        }
        this.$nextTick(() => {
          this.$refs.password.focus();
        });
      },
      handleLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            this.$store
              .dispatch("user/login", this.loginForm)
              .then(() => {
                this.$router.push({
                  path: this.redirect || "/",
                  query: this.otherQuery,
                });
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      getOtherQuery(query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur];
          }
          return acc;
        }, {});
      },
      handleRegister() {
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            this.$store
              .dispatch("user/register", this.registerForm)
              .then(() => {
                this.$message.success("注册成功，请使用账号密码登录！");
                this.loading = false;
                this.handleRegisterClose();
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      handleRegisterOpen() {
        this.register.open = true;
      },
      handleRegisterClose() {
        this.register.open = false;
        this.registerForm.username = "";
        this.registerForm.password = "";
      },
    },
  };
  </script>
  
  <style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
  
  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;
  
  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }
  
  .container {
    width: 100%;
    height: 100vh;
    background-image: url("../../assets/loginPage/background_horizontal.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
  
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
  
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.258);
      background: rgba(0, 0, 0, 0.157);
      border-radius: 5px;
      color: #454545;
    }
  }
  </style>
  
  <style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  
  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
  
    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
      background-color: #ffffff51;
    }
  
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
  
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
  
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
  
    .title-container {
      position: relative;
  
      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
  
      .set-language {
        color: #fff;
        position: absolute;
        top: 3px;
        font-size: 18px;
        right: 0px;
        cursor: pointer;
      }
    }
  
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  
    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }
  
    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
  </style>
  