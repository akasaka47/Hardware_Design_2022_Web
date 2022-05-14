<template>
  <div id="welcome">
    <div id="hello">
      <b style="font-size: 55px">{{ hello }}</b
      ><span style="font-size: 35px">{{ "  " + username }}</span>
    </div>
    <div id="motto">{{ motto }}</div>
    <div id="information">
      <el-descriptions title="当前用户信息" :column="1" border>
        <el-descriptions-item label="用户名">{{
          username
        }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ userID }}</el-descriptions-item>
        <el-descriptions-item label="电子邮箱">{{
          email
        }}</el-descriptions-item>
        <el-descriptions-item label="身份">
          <el-tag size="small">{{ administor }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
//用户名，头像，id，邮箱，身份
export default {
  data() {
    return {
      motto: "",
      hello: "",
      username: "",
      userID: "",
      email: "",
      administor: "",
    };
  },
  async created() {
    var that = this;
    const { data: res } = await this.$axios
      .get("a/welcome")
      .catch(function (error) {
        that.$message.error("服务器出错");
      });
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
    this.motto = res.helloMsg;
    this.username = res.data.username;
    this.userID = res.data.id;
    this.email = res.data.email;
    this.administor = res.data.admin ? "管理员" : "普通用户";

    var d = new Date();
    var h = d.getHours();
    if ((h >= 23 && h <= 24) || (h >= 0 && h <= 4)) {
      this.hello = "夜深了 ";
    } else if (h >= 5 && h <= 8) {
      this.hello = "早上好!";
    } else if (h >= 9 && h <= 10) {
      this.hello = "上午好!";
    } else if (h >= 11 && h <= 13) {
      this.hello = "中午好!";
    } else if (h >= 14 && h <= 17) {
      this.hello = "下午好!";
    } else if (h >= 18 && h <= 19) {
      this.hello = "傍晚好!";
    } else if (h >= 20 && h <= 22) {
      this.hello = "晚上好!";
    }
  },
  methods: {},
};
</script>


<style scoped>
#welcome {
  position: relative;
  height: 100%;
  width: 100%;
  margin: 0;
  background-image: url("../assets/svg.png");
}
#information {
  position: absolute;
  margin-left: 50px;
  margin-top: 19%;
  height: 300px;
  width: 60%;
}
#hello {
  position: absolute;
  margin-left: 60px;
  margin-top: 8%;
}
#motto {
  position: absolute;
  font-size: 25px;
  left: 600px;
  top: 130px;
}
</style>