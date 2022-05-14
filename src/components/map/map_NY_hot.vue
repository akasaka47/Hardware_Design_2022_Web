<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>地图区</el-breadcrumb-item>
      <el-breadcrumb-item>AP信号强度热力图</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 地图区 -->
    <el-card class="box-card">
      <el-select v-model="BSSID" placeholder="请选择BSSID">
        <el-option
          v-for="item in rssID"
          :key="item.value"
          :label="item.id"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 10px" @click="showHeat"
        >显示</el-button
      >
      <div class="map-box">
        <div id="main"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
// 导入echarts
import * as echarts from "echarts";
export default {
  data() {
    return {
      postData: {
        all: false,
        order: [],
        type: "",
        k: 5,
        XTrue: 43.5,
        YTrue: 10.600000381469727,
        XMin: 82.60073715325804,
        YMin: 57.888311882834174,
        XMax: 711.2492598617564,
        YMax: 224.66882806460814,
      },
      dataList: [],
      rssDataList: [],
      chart: null,
      // 只显示地图
      option1: {
        tooltip: {},
        geo: {
          map: "NY_svg",
          roam: true,
        },
      },
      // 显示热力图
      option2: {
        tooltip: {},
        geo: {
          tooltip: {
            show: true,
          },
          map: "NY_svg",
          roam: true,
        },
        visualMap: {
          show: true,
          top: "top",
          min: -80,
          max: -50,
          seriesIndex: 0,
          calculable: true,
          inRange: {
            color: [
              "#0000FF",
              "#0033FF",
              "#0066FF",
              "#0099FF",
              "#00CCFF",
              "#00FFFF",
              "#00FFCC",
              "#00FF99",
              "#00FF66",
              "#00FF33",
              "#00FF00",
              "#33FF00",
              "#66FF00",
              "#99FF00",
              "#CCFF00",
              "#FFFF00",
              "#FF9900",
              "#FF6600",
              "#FF3300",
              "#FF0000",
            ],
          },
        },
        series: [
          {
            type: "heatmap",
            coordinateSystem: "geo",
            data: [],
            pointSize: 10,
            blurSize: 9,
          },
        ],
      },
      option3: {
        tooltip: {},
        geo: {
          tooltip: {
            show: true,
          },
          map: "NY_svg",
          roam: true,
        },
        visualMap: {
          show: true,
          top: "top",
          min: 50,
          max: 80,
          seriesIndex: 0,
          calculable: true,
          inRange: {
            color: [
              "#0000FF",
              "#0033FF",
              "#0066FF",
              "#0099FF",
              "#00CCFF",
              "#00FFFF",
              "#00FFCC",
              "#00FF99",
              "#00FF66",
              "#00FF33",
              "#00FF00",
              "#33FF00",
              "#66FF00",
              "#99FF00",
              "#CCFF00",
              "#FFFF00",
              "#FF9900",
              "#FF6600",
              "#FF3300",
              "#FF0000",
            ],
          },
        },
        series: [
          {
            type: "heatmap",
            coordinateSystem: "geo",
            data: [],
            pointSize: 5,
            blurSize: 6,
          },
        ],
      },
      rssID: [
        {
          id: "",
          value: 0,
        },
      ],
      BSSID: 0,
    };
  },
  methods: {
    // 地图上显示定位点
    async showHeat() {
      var that = this;
      const { data: res } = await this.$axios
        .get("/a/map/NY/getHeatData", { params: { BSSID: this.BSSID } })
        .catch(function (error) {
          that.$message.error("服务器出错");
        });

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.option2.series[0].data = res.data;
      this.chart.setOption(this.option2);
    },
  },
  // 显示地图
  async mounted() {
    var that = this;
    const { data: res } = await this.$axios
      .get("img/NY.svg")
      .catch(function (error) {
        that.$message.error("服务器出错");
      });
    echarts.registerMap("NY_svg", { svg: res });
    this.chart = echarts.init(document.getElementById("main"));
    // this.chart.setOption(this.option3);
    this.chart.setOption(this.option1);
  },
  async created() {
    var that = this;
    const { data: res } = await this.$axios
      .get("a/data/RssID")
      .catch(function (error) {
        that.$message.error("服务器出错");
      });
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
    this.rssID = res.data;
  },
};
</script>

<style lang="less" scoped>
.box-card {
  height: 80%;
  width: 80%;
  position: absolute;
  .btn {
    position: absolute;
  }
  .map-box {
    position: absolute;
    width: 100%;
    height: 75%;
    bottom: 5%;
    #main {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.detail_desc {
  margin-top: 15px;
  margin-left: 10px;
  margin-right: 10px;
}
.rssTable {
  margin-left: 10px;
  margin-right: 10px;
}
.title {
  margin-top: 20px;
  margin-left: 25px;
}
.rssNNTable {
  margin-left: 10px;
  margin-right: 25px;
}
.pos {
  margin-left: 25px;
  margin-top: 10px;
}
</style>