<template>
  <div id="CDF_Curve">
    <div id="CDF_text">
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据区</el-breadcrumb-item>
        <el-breadcrumb-item>定位误差分析</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 数据提交区 -->
      <el-card class="box-card">
        <el-form
          :model="dynamicValidateForm"
          ref="dynamicValidateForm"
          label-width="100px"
        >
          <el-form-item
            label="CDF分段"
            style="width: 390px"
            prop="cut"
            :rules="[
              { required: true, message: '分段值不能为空', trigger: 'blur' },
              {
                type: 'number',
                min: 5,
                max: 50,
                message: '必须为数字，范围: 5~50',
                trigger: 'blur',
              },
            ]"
            inline-message
          >
            <el-input v-model.number="dynamicValidateForm.cut"></el-input>
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in dynamicValidateForm.domains"
            :label="'算法-' + (index + 1)"
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
            style="width: 520px"
            :rules="[
              {
                type: 'number',
                min: 2,
                max: 20,
                message: 'K值必须为数字，范围: 2~20',
                trigger: 'blur',
              },
            ]"
          >
            <el-select
              v-model="domain.type"
              placeholder="算法"
              style="display: inline-block; width: 100px"
            >
              <el-option label="NN" value="NN"></el-option>
              <el-option label="KNN" value="KNN"></el-option>
              <el-option label="机器学习" value="ML"></el-option>
            </el-select>
            <div id="kNum">
              <el-input
                placeholder="K值"
                v-model.number="domain.value"
                v-show="
                  dynamicValidateForm.domains[index].type == 'KNN'
                    ? true
                    : false
                "
              ></el-input>
            </div>
            <el-button
              style="margin-left: 10px"
              @click.prevent="removeDomain(domain)"
              >删除</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
            <el-button @click="addDomain">新增算法</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form></el-card
      >
    </div>
    <!-- 误差分析结果对话框 -->
    <el-dialog
      title="误差分析结果"
      :visible.sync="resultVisible"
      width="1300px"
      @opened="open()"
      center
    >
      <div id="main"></div>
      <div id="errorTable">
        <el-table
          :data="errResultTable"
          border
          stripe
          style="width: 500px; height: 600px"
          size="medium"
        >
          <!--  width="100" -->
          <el-table-column prop="type" label="算法类型"> </el-table-column>
          <el-table-column prop="average" label="平均误差"> </el-table-column>
          <el-table-column prop="error_50" label="50%误差"> </el-table-column>
          <el-table-column prop="error_75" label="75%误差"> </el-table-column>
          <el-table-column prop="error_90" label="90%误差"> </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      errResultTable: [],
      resultVisible: false,
      dynamicValidateForm: {
        cut: 10,
        domains: [
          {
            type: "",
            value: 2,
          },
        ],
      },
      CDF_Data: [],
      myChart: null,
      option: {
        title: {
          text: "CDF curve",
          textStyle: {
            fontSize: 30,
          },
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          textStyle: {
            fontSize: 15,
          },
          data: [],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          right: 20,
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "value",
        },
        series: [],
      },
    };
  },

  methods: {
    // 打开误差分析对话框
    open() {
      if (this.myChart === null) {
        var chartDom = document.getElementById("main");
        this.myChart = echarts.init(chartDom);
      }
      this.CDFShow();
    },
    CDFShow() {
      this.myChart.setOption(this.option);
    },
    async submitForm() {
      this.$refs.dynamicValidateForm.validate(async (valid) => {
        if (!valid) return this.$message.error("提交数据格式错误");
        var that = this;
        const { data: res } = await this.$axios
          .post("a/chart/CDF", this.dynamicValidateForm)
          .catch(function (error) {
            that.$message.error("服务器出错");
          });
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        var i = 0;
        this.option.legend.data = [];
        this.option.series = [];
        for (i = 0; i < this.dynamicValidateForm.domains.length; i++) {
          var type = this.dynamicValidateForm.domains[i].type;
          if (type === "KNN") {
            type = "KNN-" + this.dynamicValidateForm.domains[i].value;
          }
          this.option.legend.data.push(type);
          this.option.series.push({
            name: type,
            type: "line",
            symbol: "none",
            step: "end",
            data: res.data[i],
          });
        }
        this.errResultTable = res.err;
        this.resultVisible = true;
      });
    },
    resetForm() {
      this.dynamicValidateForm = {
        domains: [
          {
            value: "",
            type: "",
          },
        ],
      };
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      console.log(this.dynamicValidateForm);
      if (this.dynamicValidateForm.domains.length === 9)
        return this.$message("不能再增加了");
      this.dynamicValidateForm.domains.push({
        value: 2,
        type: "",
        key: Date.now(),
      });
    },
  },

  mounted() {},
};
</script>

<style lang="less" scoped>
#CDF_Curve {
  position: relative;
  width: 100%;
  height: 600px;
}
#CDF_text {
  // left: 20px;
  // right: 20px;
  // top: 20px;
  width: 96%;
  position: absolute;
  z-index: 1;
  .el-card {
    margin-top: 20px;
    width: 100%;
    height: 650px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
  }
}
#CDFBackground {
  // position: absolute;
  // left: 50%;
  // top: 50%;
  // transform: translate(-50%, -50%);

  width: 800px;
  height: 600px;
  padding: 0;
  margin: 0;
}

#main {
  // margin: 10px 10px 10px 10px;
  display: inline-block;
  width: 750px;
  height: 600px;
  color: #bcd8ee;
}
#errorTable {
  display: inline-block;
  width: 500px;
  height: 600px;
}
#kNum {
  margin-left: 10px;
  width: 100px;
  display: inline-block;
}
</style>