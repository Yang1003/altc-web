<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">{{ $t("settings.title") }}</h3>

      <div class="drawer-item">
        <span>{{ $t("settings.theme") }}</span>
        <theme-picker
          style="float: right; height: 26px; margin: -3px 8px 0 0"
          @change="themeChange"
        />
      </div>

      <div class="drawer-item">
        <span>{{ $t("settings.tagsView") }}</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t("settings.fixedHeader") }}</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>{{ $t("settings.sidebarLogo") }}</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

      <div v-if="lang === 'zh'" class="drawer-item">
        <span>菜单支持拼音搜索</span>
        <el-switch v-model="supportPinyinSearch" class="drawer-switch" />
      </div>
    </div>
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";

export default {
  components: { ThemePicker },
  data() {
    return {};
  },
  computed: {
    isShowJob() {
      return this.$store.getters.language === "zh";
    },
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "fixedHeader",
          value: val,
        });
      },
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "tagsView",
          value: val,
        });
      },
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "sidebarLogo",
          value: val,
        });
      },
    },
    supportPinyinSearch: {
      get() {
        return this.$store.state.settings.supportPinyinSearch;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "supportPinyinSearch",
          value: val,
        });
      },
    },
    lang() {
      return this.$store.getters.language;
    },
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch("settings/changeSetting", {
        key: "theme",
        value: val,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }

  .job-link {
    display: block;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}
</style>
