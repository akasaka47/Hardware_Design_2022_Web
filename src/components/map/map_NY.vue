<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>地图区</el-breadcrumb-item>
      <el-breadcrumb-item>指纹定位地图</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 地图区 -->
    <el-card class="box-card">
      <!-- <el-button type="primary" class="btn" size="mini" @click="showRSS"
        >显示定位结果</el-button
      > -->
      <div class="map-box">
        <div id="main"></div>
      </div>
    </el-card>
    <!-- 右侧弹出界面，显示定位点详细数据 -->
    <el-drawer
      :visible.sync="dataDetail"
      :with-header="false"
      direction="rtl"
      size="27%"
    >
      <!-- 详细信息描述区 -->
      <el-descriptions
        class="detail_desc"
        title="RSS定位点详细数据"
        :column="1"
        size="medium"
        border
      >
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-collection-tag"></i>
            Order
          </template>
          {{ this.rssDataAll.Order }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-position"></i>
            XLabel
          </template>
          {{ this.rssDataAll.XLabel }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-position"></i>
            YLabel
          </template>
          {{ this.rssDataAll.YLabel }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            LocalLabel
          </template>
          {{ this.rssDataAll.LocalLabel }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            RoomLabel
          </template>
          {{ this.rssDataAll.RoomLabel }}
        </el-descriptions-item>
      </el-descriptions>
      <!-- BSSID与信号强度 -->
      <el-table :data="rssData" height="400" border stripe class="rssTable">
        <el-table-column
          property="BSSID"
          label="BSSID"
          width="150"
        ></el-table-column>
        <el-table-column
          property="data"
          label="信号强度"
          width="200"
        ></el-table-column>
      </el-table>
    </el-drawer>
    <!-- 右侧弹出界面，显示NN误差 -->
    <el-drawer
      :visible.sync="dataNN"
      :with-header="false"
      direction="rtl"
      size="400"
    >
      <h3 class="title">NN定位信息</h3>
      <!-- 信息对比 -->
      <el-table :data="rssDataNN" border stripe class="rssNNTable">
        <el-table-column
          property="info"
          label="信息"
          width="80"
        ></el-table-column>
        <el-table-column
          property="trueData"
          label="真实数据"
          width="150"
        ></el-table-column>
        <el-table-column
          property="estimateData"
          label="估计数据"
          width="150"
        ></el-table-column>
      </el-table>
      <div class="title">定位误差: {{ this.err }} m</div>
    </el-drawer>
    <!-- 右侧弹出界面，显示KNN误差 -->
    <el-drawer
      :visible.sync="dataKNN"
      :with-header="false"
      direction="rtl"
      size="480px"
    >
      <h3 class="title">KNN定位信息</h3>
      <!-- 信息对比 -->
      <el-table :data="rssDataKNN" border stripe class="rssNNTable">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="Order">
                <span>{{ props.row.Order }}</span>
              </el-form-item>
              <el-form-item label="XLabel">
                <span>{{ props.row.XLabel }}</span>
              </el-form-item>
              <el-form-item label="YLabel">
                <span>{{ props.row.YLabel }}</span>
              </el-form-item>
              <el-form-item label="LocalLabel">
                <span>{{ props.row.LocalLabel }}</span>
              </el-form-item>
              <el-form-item label="RoomLabel">
                <span>{{ props.row.RoomLabel }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="数据类型" prop="type" width="80">
        </el-table-column>
        <el-table-column label="XLabel" prop="XLabel" width="150">
        </el-table-column>
        <el-table-column label="YLabel" prop="YLabel" width="150">
        </el-table-column>
      </el-table>
      <div class="title">定位点坐标:</div>
      <div class="pos">X: {{ this.pos[0] }} m</div>
      <div class="pos">Y: {{ this.pos[1] }} m</div>
      <div class="title">定位误差: {{ this.err }} m</div>
    </el-drawer>
    <!-- 右侧弹出界面，显示机器学习定位误差 -->
    <el-drawer
      :visible.sync="dataML"
      :with-header="false"
      direction="rtl"
      size="400"
    >
      <h3 class="title">全连接神经网络定位信息</h3>
      <!-- 信息对比 -->
      <el-table :data="rssDataML" border stripe class="rssNNTable">
        <el-table-column
          property="info"
          label="信息"
          width="80"
        ></el-table-column>
        <el-table-column
          property="trueData"
          label="真实数据"
          width="150"
        ></el-table-column>
        <el-table-column
          property="estimateData"
          label="估计数据"
          width="150"
        ></el-table-column>
      </el-table>
      <div class="title">定位误差: {{ this.err }} m</div>
    </el-drawer>
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
      // 同时显示地图和定位点
      option2: {
        tooltip: {},
        geo: {
          tooltip: {
            show: true,
          },
          map: "NY_svg",
          roam: true,
        },
        series: {
          type: "scatter",
          coordinateSystem: "geo",
          geoIndex: 0,
          symbolSize: 10,
          animationEasing: "circularInOut",
          itemStyle: {
            color: "#007ACC",
          },
          encode: {
            tooltip: 2,
          },
          data: [],
        },
      },
      // 显示NN/KNN算法定位结果
      option3: {
        tooltip: {},
        geo: {
          tooltip: {
            show: true,
          },
          map: "NY_svg",
          roam: true,
        },
        series: {
          type: "scatter",
          coordinateSystem: "geo",
          geoIndex: 0,
          symbolSize: 10,
          animationEasing: "circularInOut",
          itemStyle: {
            color: "#007ACC",
          },
          encode: {
            tooltip: 2,
          },
          label: {
            formatter: "{@3}",
            show: true,
            position: "top",
            distance: 6,
            fontStyle: "oblique",
            fontWeight: "bolder",
            fontFamily: "Arial",
            fontSize: 16,
            backgroundColor: "rgba(255, 255, 255, 1)",
          },
          data: [],
        },
      },
      dataDetail: false,
      dataNN: false,
      dataKNN: false,
      dataML: false,
      rssData: [],
      rssDataAll: {},
      rssDataKNN: [],
      rssDataNN: [],
      rssDataML: [],
      err: 0,
      pos: [],
    };
  },
  methods: {
    // 地图上显示定位点
    async showRSS() {
      this.postData.order = JSON.parse(
        window.sessionStorage.getItem("selectData")
      );
      this.postData.type = window.sessionStorage.getItem("selectType");
      this.postData.all =
        window.sessionStorage.getItem("selectAll") == "true" ? true : false;
      this.postData.k = Number(window.sessionStorage.getItem("k"));

      var that = this;
      const { data: res } = await this.$axios
        .post("a/map/NY/Rss", this.postData)
        .catch(function (error) {
          that.$message.error("服务器出错");
        });

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      if (
        this.postData.type === "NN-One" ||
        this.postData.type === "KNN-One" ||
        this.postData.type === "ML-One"
      ) {
        this.option3.series.data = res.data;
        this.option3.series.data[0].push("真实位置");

        if (this.postData.type === "NN-One") {
          this.option3.series.data[1].push("估计位置");
          this.chart.on("click", function (params) {
            that.showRssOneNN(res.data);
          });
        } else if (this.postData.type === "KNN-One") {
          var i = 0;
          var max = this.postData.k + 1;
          for (i = 1; i < max; i++) {
            this.option3.series.data[i].push("参考点" + i);
          }
          this.option3.series.data[max].push("估计位置");
          this.chart.on("click", function (params) {
            that.showRssOneKNN(res.data);
          });
        } else {
          this.option3.series.data[1].push("估计位置");
          this.chart.on("click", function (params) {
            that.showRssOneML(res.data);
          });
        }

        this.chart.setOption(this.option3);
      } else {
        this.option2.series.data = res.data;
        this.chart.setOption(this.option2);
        this.chart.on("click", function (params) {
          that.showRssOne(params.data[2]);
        });
      }
    },
    // 侧边栏弹出，显示定位点详细数据
    async showRssOne(order) {
      var that = this;
      const { data: res } = await this.$axios
        .get("a/map/NY/RssOne", {
          params: { order: order, type: this.postData.type },
        })
        .catch(function (error) {
          that.$message.error("服务器出错");
        });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // console.log(res);
      this.rssDataAll = res.data;
      this.rssData = [];
      var i = 0;
      for (i = 0; i < res.data.Vector.length; i++) {
        var unit = { BSSID: res.id.id[i], data: res.data.Vector[i] };
        this.rssData.push(unit);
      }
      this.dataDetail = true;
    },
    // 侧边栏弹出，显示NN定位结果
    async showRssOneNN(order) {
      this.postData.order = [];
      this.postData.order.push(order[0][2]);
      this.postData.order.push(order[1][2]);
      // 0为测试集数据，1为训练集数据
      var that = this;
      const { data: res } = await this.$axios
        .post("a/map/NY/RssOne/NN", this.postData)
        .catch(function (error) {
          that.$message.error("服务器出错");
        });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // console.log(res);
      var i = 0;
      this.rssDataNN = [];
      var info = ["Order", "XLabel", "YLabel", "LocalLabel", "RoomLabel"];
      var trueData = [
        res.trueData.Order,
        res.trueData.XLabel,
        res.trueData.YLabel,
        res.trueData.LocalLabel,
        res.trueData.RoomLabel,
      ];
      var estimateData = [
        res.estimateData.Order,
        res.estimateData.XLabel,
        res.estimateData.YLabel,
        res.estimateData.LocalLabel,
        res.estimateData.RoomLabel,
      ];
      for (i = 0; i < 5; i++) {
        var unit = {
          info: info[i],
          trueData: trueData[i],
          estimateData: estimateData[i],
        };
        this.rssDataNN.push(unit);
      }
      this.err = res.err;
      this.dataNN = true;
    },
    // 侧边栏弹出，显示KNN定位结果
    async showRssOneKNN(order) {
      this.postData.order = [];
      var i = 0;
      for (i = 0; i < this.postData.k + 1; i++) {
        this.postData.order.push(order[i][2]);
      }
      var that = this;
      const { data: res } = await this.$axios
        .post("a/map/NY/RssOne/KNN", this.postData)
        .catch(function (error) {
          that.$message.error("服务器出错");
        });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.err = res.err;
      this.pos = res.pos;
      this.rssDataKNN = [];
      var temp = {};
      temp = res.trueData;
      temp.type = "真实位置";
      this.rssDataKNN.push(temp);
      var i = 0;
      for (i = 0; i < this.postData.k; i++) {
        temp = res.estimateData[i];
        temp.type = "参考点 " + (i + 1);
        this.rssDataKNN.push(temp);
      }
      this.dataKNN = true;
    },
    // 侧边栏弹出，显示机器学习定位结果
    async showRssOneML(order) {
      this.postData.order = [];
      this.postData.order.push(order[0][2]);
      this.postData.order.push(order[1][2]);
      // 0为测试集数据，1为训练集数据
      var that = this;
      const { data: res } = await this.$axios
        .post("a/map/NY/RssOne/ML", this.postData)
        .catch(function (error) {
          that.$message.error("服务器出错");
        });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      var i = 0;
      this.rssDataNN = [];
      var info = ["XLabel", "YLabel"];
      var trueData = [res.trueData.XLabel, res.trueData.YLabel];
      var estimateData = [res.estimateData.XLabel, res.estimateData.YLabel];
      for (i = 0; i < estimateData.length; i++) {
        var unit = {
          info: info[i],
          trueData: trueData[i],
          estimateData: estimateData[i],
        };
        this.rssDataML.push(unit);
      }
      this.err = res.err;
      this.dataML = true;
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
    var order = JSON.parse(window.sessionStorage.getItem("selectData"));
    if (order === null || order.length === 0) {
      this.chart.setOption(this.option1);
      return;
    }
    this.showRSS();
    // 鼠标点击console输出SVG坐标点
    // var myChart = this.chart;
    // myChart.getZr().on("click", function (params) {
    //   var pixelPoint = [params.offsetX, params.offsetY];
    //   var dataPoint = myChart.convertFromPixel({ geoIndex: 0 }, pixelPoint);
    //   console.log(dataPoint);
    // });
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
    width: 90%;
    height: 75%;
    bottom: 5%;
    #main {
      width: 120%;
      height: 120%;
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