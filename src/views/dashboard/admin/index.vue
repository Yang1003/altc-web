<template>
    <el-container>
      <el-main>
        <div id="app" style="text-align: center; margin-top: 50px; height: 100px">
          <h1>{{ $t("dashboard.searchTitle") }}</h1>
          <el-input style="width: 600px" placeholder="关键字" v-model.trim="searchQuery" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="performSearch"></el-button>
          </el-input>
        </div>
        <div id="display">
          <el-row>
            <el-col :span="6">
              <span><i class="el-icon-edit"></i></span>
              <span>整车数据</span>
            </el-col>
            <el-col :span="6">
              <span><i class="el-icon-edit"></i></span>
              <span>整车数据</span>
            </el-col>
            <el-col :span="6">
              <span><i class="el-icon-edit"></i></span>
              <span>整车数据</span>
            </el-col>
            <el-col :span="6">
              <span><i class="el-icon-edit"></i></span>
              <span>整车数据</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <span><i class="el-icon-edit"></i></span>
              <span>整车数据</span>
            </el-col>
            <el-col :span="6">
              <span><i class="el-icon-edit"></i></span>
              <span>整车数据</span>
            </el-col>
            <el-col :span="6">
              <span><i class="el-icon-edit"></i></span>
              <span>整车数据</span>
            </el-col>
            <el-col :span="6">
              <span><i class="el-icon-edit"></i></span>
              <span>整车数据</span>
            </el-col>
          </el-row>
        </div>
        <div id="searchResult">
          <p v-if="results.length > 0" style="margin-top: 20px">搜索结果：</p>
          <ul style="list-style-type: none; padding: 0">
            <li v-for="(result, index) in results" :key="index" style="margin: 10px 0">
              {{ result }}
            </li>
          </ul>
        </div>
        <div id="searchResult">
          <p v-if="results.length > 0" style="margin-top: 20px">搜索结果：</p>
          <ul style="list-style-type: none; padding: 0">
            <li v-for="(result, index) in results" :key="index" style="margin: 10px 0">
              {{ result }}
            </li>
          </ul>
        </div>
        <div id="searchResult">
          <p v-if="results.length > 0" style="margin-top: 20px">搜索结果：</p>
          <ul style="list-style-type: none; padding: 0">
            <li v-for="(result, index) in results" :key="index" style="margin: 10px 0">
              {{ result }}
            </li>
          </ul>
        </div>
        <div id="searchResult">
          <p v-if="results.length > 0" style="margin-top: 20px">搜索结果：</p>
          <ul style="list-style-type: none; padding: 0">
            <li v-for="(result, index) in results" :key="index" style="margin: 10px 0">
              {{ result }}
            </li>
          </ul>
        </div>
        <div id="searchResult">
          <p v-if="results.length > 0" style="margin-top: 20px">搜索结果：</p>
          <ul style="list-style-type: none; padding: 0">
            <li v-for="(result, index) in results" :key="index" style="margin: 10px 0">
              {{ result }}
            </li>
          </ul>
        </div>
        <div id="searchResult">
          <p v-if="results.length > 0" style="margin-top: 20px">搜索结果：</p>
          <ul style="list-style-type: none; padding: 0">
            <li v-for="(result, index) in results" :key="index" style="margin: 10px 0">
              {{ result }}
            </li>
          </ul>
        </div>
      </el-main>
    </el-container>
  </template>
  
  <script>
  export default {
    name: "DashboardAdmin",
    data() {
      return {
        searchQuery: "",
        results: [],
      };
    },
  
    methods: {
      performSearch() {
        // 这里可以替换为实际的搜索逻辑，例如调用后端API
        this.results = [`结果1: ${this.searchQuery}`, `结果2: ${this.searchQuery}`, `结果3: ${this.searchQuery}`];
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  #display {
    background-color: antiquewhite;
    margin: 10px 50px;
  }
  
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;
  
    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }
  
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
  
  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
  </style>
  