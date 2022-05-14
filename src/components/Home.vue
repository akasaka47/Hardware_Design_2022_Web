<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header-left">
        <img id="header-img" src="../assets/fingerprint.jpeg" alt="" />
        <span style="margin-left: 15px">室内指纹定位可视化系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <!-- 页面主体区-->
    <el-container>
      <!-- 侧边栏主体 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-tooltip
          effect="dark"
          :content="isCollapse ? '点击展开菜单' : '点击收起菜单'"
          placement="right"
        >
          <div class="toggle-button" @click="toggleCollapse">|||</div>
        </el-tooltip>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体栏 -->
      <el-main>
        <!--  路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconObj: {
        10: "el-icon-location",
        20: "el-icon-s-data",
        30: "el-icon-user-solid",
      },
      // 是否折叠
      isCollapse: false,
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$message({
        message: "退出成功",
        type: "success",
      });
      this.$router.push("/login");
    },
    async getMenuList() {
      var that = this;
      const { data: res } = await this.$axios
        .get("a/menus")
        .catch(function (error) {
          that.$message.error("服务器出错");
        });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
    },
    // 点击按钮，折叠菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存连接的激活状态，高亮
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<!--scoped只影响当前组件 -->
<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  color: #fff;
  font-size: 20px;
  align-items: center;
}
.header-left {
  width: 1000px;
  display: flex;
  align-items: center;
}
#header-img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>