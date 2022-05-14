<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员界面</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-form ref="userFormRef" :inline="true" :model="queryInfo">
        <el-form-item label="查找用户">
          <el-input
            v-model="queryInfo.searchInfo"
            placeholder="查找用户"
            clearable
            @clear="getUserList"
          ></el-input>
        </el-form-item>
        <el-form-item label="查找类型">
          <el-select v-model="queryInfo.searchType" placeholder="查找类型">
            <el-option label="ID" value="id"></el-option>
            <el-option label="用户名" value="username"></el-option>
            <el-option label="邮箱" value="email"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUserList">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 数据列表区 -->
      <el-table :data="userlist" border stripe height="480">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="管理员权限" prop="admin">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.admin"
              @change="userAdminChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteUser(scope.row)"
                ></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取数据列表的参数对象
      queryInfo: {
        id: "",
        username: "",
        email: "",
        pagenum: 1,
        pagesize: 20,
        searchInfo: "",
        searchType: "",
      },
      userlist: [],
      total: 0,
      headers: {
        Authorization: window.sessionStorage.getItem("token"),
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      var that = this;
      const { data: res } = await this.$axios
        .get("a/user", {
          params: this.queryInfo,
        })
        .catch(function (error) {
          that.$message.error("服务器出错");
        });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.userlist = res.data;
      this.total = res.total;
    },
    // 页数大小改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.$refs.userFormRef.resetFields();
      this.getUserList();
    },
    // 页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.$refs.userFormRef.resetFields();
      this.getUserList();
    },
    // 改变用户权限
    async userAdminChange(userinfo) {
      var that = this;
      const { data: res } = await this.$axios
        .get("a/user/adminChange", {
          params: userinfo,
        })
        .catch(function (error) {
          that.$message.error("服务器出错");
        });
      if (res.meta.status != 200) {
        userinfo.admin = !userinfo.admin;
        return this.$message.error(res.meta.msg);
      }
      this.$message({
        type: "success",
        message: "用户管理员权限更改成功!",
      });
    },
    // 删除用户
    async deleteUser(userinfo) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");
      var that = this;
      const { data: res } = await this.$axios
        .get("a/user/delete", {
          params: userinfo,
        })
        .catch(function (error) {
          that.$message.error("服务器出错");
        });
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message({
        type: "success",
        message: "删除成功!",
      });
      this.all = false;
      this.queryInfo.id = "";
      this.getUserList();
    },
  },
};
</script>

<style lang="less" scoped>
</style>
