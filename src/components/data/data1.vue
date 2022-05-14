<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据区</el-breadcrumb-item>
      <el-breadcrumb-item>指纹数据-测试集</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入数据 Order"
            v-model="queryInfo.order"
            clearable
            @clear="getDataList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getDataList()"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="10">
          <!-- 上传新数据 -->
          <el-button-group>
            <el-tooltip effect="dark" content="添加一个新数据" placement="top">
              <el-button
                type="primary"
                icon="el-icon-circle-plus"
                @click="addOneData"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="上传新数据" placement="top">
              <el-button
                type="primary"
                icon="el-icon-upload"
                @click="uploadDialog"
              ></el-button>
            </el-tooltip>
          </el-button-group>
          <el-button-group class="btn-group">
            <transition name="el-fade-in-linear">
              <!-- 在地图上显示定位结果 -->
              <el-tooltip
                effect="dark"
                content="在地图上显示定位结果"
                placement="top"
              >
                <el-button
                  type="primary"
                  icon="el-icon-map-location"
                  v-show="showOnMap"
                  @click="showOnMapFunc"
                ></el-button>
              </el-tooltip>
            </transition>
            <transition name="el-fade-in-linear">
              <!-- 使用NN算法 -->
              <el-tooltip effect="dark" content="使用NN算法" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-position"
                  v-show="showOnMap"
                  @click="arithmeticNN"
                ></el-button>
              </el-tooltip>
            </transition>
            <transition name="el-fade-in-linear">
              <!-- 使用KNN算法 -->
              <el-tooltip effect="dark" content="使用KNN算法" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-s-promotion"
                  v-show="showOnMap"
                  @click="KFormVisible = true"
                ></el-button>
              </el-tooltip>
            </transition>
            <transition name="el-fade-in-linear">
              <!-- 使用机器学习算法 -->
              <el-tooltip
                effect="dark"
                content="使用机器学习算法"
                placement="top"
              >
                <el-button
                  type="primary"
                  icon="el-icon-cpu"
                  v-show="showOnMap"
                  @click="arithmeticML"
                ></el-button>
              </el-tooltip>
            </transition>
          </el-button-group>
        </el-col>
      </el-row>
      <!-- 数据列表区 -->
      <el-table
        :data="datalist"
        border
        stripe
        height="480"
        @selection-change="dataSelectionChange"
        @select-all="dataSelectAll"
      >
        <el-table-column type="selection" width="48"> </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="Order" prop="Order"></el-table-column>
        <el-table-column label="XLabel" prop="XLabel"></el-table-column>
        <el-table-column label="YLabel" prop="YLabel"></el-table-column>
        <el-table-column label="LocalLabel" prop="LocalLabel"></el-table-column>
        <el-table-column label="RoomLabel" prop="RoomLabel"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip effect="dark" content="查看RSS指纹" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-s-order"
                  size="mini"
                  @click="showRSS(scope.row.Vector)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="修改RSS指纹数据"
                placement="top"
              >
                <el-button
                  type="warning"
                  icon="el-icon-s-tools"
                  size="mini"
                  @click="editRSS(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteRSS(scope.row.Order)"
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
      <!-- RSS指纹数据对话框 -->
      <el-dialog
        title="RSS指纹数据"
        :visible.sync="rssTableVisible"
        width="30%"
      >
        <el-table :data="rssData" border stripe height="450">
          <el-table-column
            property="rssID"
            label="BSSID"
            width="150"
          ></el-table-column>
          <el-table-column
            property="data"
            label="信号强度"
            width="200"
          ></el-table-column>
        </el-table>
      </el-dialog>
      <!-- 上传文件对话框 -->
      <el-dialog
        title="上传新的RSS指纹数据-测试集"
        :visible.sync="uploadTableVisible"
        width="50%"
      >
        <span>以csv文件格式上传，新上传的数据会覆盖旧数据</span>
        <el-upload
          action="http://localhost:8080/a/data/upload"
          :on-success="uploadSuccess"
          :file-list="fileList"
          :headers="headers"
          :data="postdata"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip">只能上传csv文件</div>
        </el-upload>
      </el-dialog>
      <!-- 添加/修改单个指纹数据对话框 -->
      <el-dialog
        :title="deleteOneBtn ? '添加RSS指纹数据' : '修改RSS指纹数据'"
        :visible.sync="rssTableOneVisible"
        width="30%"
      >
        <el-form
          :model="addRssOneForm"
          label-width="100px"
          ref="addRssOneFormRef"
          size="mini"
        >
          <el-form-item
            prop="Order"
            label="Order"
            :rules="{
              required: true,
              message: '数据不能为空',
              trigger: 'blur',
            }"
          >
            <el-input v-model="addRssOneForm.Order"></el-input>
          </el-form-item>
          <el-form-item
            prop="XLabel"
            label="XLabel"
            :rules="{
              required: true,
              message: '数据不能为空',
              trigger: 'blur',
            }"
          >
            <el-input v-model="addRssOneForm.XLabel"></el-input>
          </el-form-item>
          <el-form-item
            prop="YLabel"
            label="YLabel"
            :rules="{
              required: true,
              message: '数据不能为空',
              trigger: 'blur',
            }"
          >
            <el-input v-model="addRssOneForm.YLabel"></el-input>
          </el-form-item>
          <el-form-item
            prop="LocalLabel"
            label="LocalLabel"
            :rules="{
              required: true,
              message: '数据不能为空',
              trigger: 'blur',
            }"
          >
            <el-input v-model="addRssOneForm.LocalLabel"></el-input>
          </el-form-item>
          <el-form-item
            prop="RoomLabel"
            label="RoomLabel"
            :rules="{
              required: true,
              message: '数据不能为空',
              trigger: 'blur',
            }"
          >
            <el-input v-model="addRssOneForm.RoomLabel"></el-input>
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in addRssOneForm.Vector"
            :label="'BSSID ' + index"
            :key="domain.key"
            :prop="'Vector.' + index + '.BSSID'"
            :rules="{
              required: true,
              message: '数据不能为空',
              trigger: 'blur',
            }"
          >
            <el-input
              v-model="domain.BSSID"
              :style="deleteOneBtn ? 'width: 70%' : 'width: 100%'"
            ></el-input>
            <el-button
              @click.prevent="removeDomain(domain)"
              style="margin-left: 10px"
              v-show="deleteOneBtn"
              size="mini"
              >删除</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="addOneFormPost('addRssOneForm')"
              >提交</el-button
            >
            <el-button v-show="deleteOneBtn" @click="addDomain"
              >新增BSSID数据</el-button
            >
            <el-button
              @click="addOneFormReset('addRssOneForm')"
              v-show="deleteOneBtn"
              size="mini"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 选择KNN的k值对话框 -->
      <el-dialog title="KNN算法" :visible.sync="KFormVisible">
        <el-form :model="KForm" ref="KRef">
          <el-form-item
            prop="k"
            label="K: "
            label-width="80px"
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
            <el-input v-model.number="KForm.k" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="arithmeticKNN">确 定</el-button>
          <el-button @click="KFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      KFormVisible: false,
      KForm: {
        k: 5,
      },
      Admin: false,
      // 获取数据列表的参数对象
      queryInfo: {
        type: "test",
        query: "",
        order: "",
        pagenum: 1,
        pagesize: 20,
      },
      addRssOneForm: {
        Type: "test",
        Order: "",
        XLabel: "",
        YLabel: "",
        LocalLabel: "",
        RoomLabel: "",
        Vector: [{ BSSID: "" }],
      },
      datalist: [],
      total: 0,
      rssTableVisible: false,
      uploadTableVisible: false,
      rssTableOneVisible: false,
      deleteOneBtn: true,
      rssID: [],
      rssData: [],
      fileList: [],
      headers: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      postdata: {
        type: "test",
      },
      showOnMap: false,
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    async getDataList() {
      var that = this;
      const { data: res } = await this.$axios
        .get("a/data", {
          params: this.queryInfo,
        })
        .catch(function (error) {
          that.$message.error("服务器出错");
        });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.datalist = res.data.data;
      this.total = res.data.total;
      this.rssID = res.data.rssID;
      this.Admin = res.Admin;
    },
    // 页数大小改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.queryInfo.order = "";
      this.getDataList();
    },
    // 页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.queryInfo.order = "";
      this.getDataList();
    },
    // 显示指纹数据
    showRSS(vector) {
      this.rssTableVisible = true;
      this.rssData = [];
      var i = 0;
      for (i = 0; i < vector.length; i++) {
        var unit = { rssID: this.rssID.id[i], data: vector[i] };
        this.rssData.push(unit);
      }
    },
    // 删除指纹数据
    async deleteRSS(order) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该指纹数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");
      var temp = { order: order, type: this.queryInfo.type };
      var that = this;
      const { data: res } = await this.$axios
        .post("a/data/delete", temp)
        .catch(function (error) {
          that.$message.error("服务器出错");
        });
      if (res.meta.status != 200) return this.$message.error("删除失败");
      this.$message({
        type: "success",
        message: "删除成功!",
      });
      this.queryInfo.order = "";
      this.getDataList();
    },
    // 上传指纹数据
    uploadDialog() {
      this.uploadTableVisible = true;
    },
    // 成功上传到服务器
    uploadSuccess(res, file, fileList) {
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.uploadTableVisible = false;
      this.$message({
        message: "数据更新成功",
        type: "success",
      });
      this.fileList = [];
      this.getDataList();
    },
    // 表格多选
    dataSelectionChange(val) {
      if (val.length === 0) {
        window.sessionStorage.setItem("selectData", JSON.stringify(val));
        window.sessionStorage.setItem("selectAll", false);
        this.showOnMap = false;
        return;
      }
      let order = val.map((item) => {
        return item.Order;
      });
      window.sessionStorage.setItem("selectData", JSON.stringify(order));
      window.sessionStorage.setItem("selectAll", false);
      window.sessionStorage.setItem("selectType", "test");
      this.showOnMap = true;
      // console.log(JSON.parse(window.sessionStorage.getItem("selectData")));
    },
    // 表格全选
    dataSelectAll(val) {
      // console.log(val);
      if (val.length === 0) {
        window.sessionStorage.setItem("selectData", JSON.stringify(val));
        window.sessionStorage.setItem("selectAll", false);
        this.showOnMap = false;
        return;
      }
      // console.log("全选");
      window.sessionStorage.setItem("selectAll", true);
    },
    // 在地图上显示定位点
    showOnMapFunc() {
      // console.log("在地图上显示");
      // window.sessionStorage.setItem("activePath", "map/map_NY");
      this.$router.push("/map/map_NY");
    },
    // 使用NN算法
    arithmeticNN() {
      if (
        JSON.parse(window.sessionStorage.getItem("selectData")).length === 1
      ) {
        window.sessionStorage.setItem("selectType", "NN-One");
        this.$router.push("/map/map_NY");
      } else {
        return this.$message("只能同时将一个定位结果显示在地图上");
      }
    },
    // 使用KNN算法
    arithmeticKNN() {
      this.$refs.KRef.validate(async (valid) => {
        if (!valid) return;
        if (
          JSON.parse(window.sessionStorage.getItem("selectData")).length === 1
        ) {
          window.sessionStorage.setItem("k", this.KForm.k);
          window.sessionStorage.setItem("selectType", "KNN-One");
          this.$router.push("/map/map_NY");
        } else {
          return this.$message("只能同时将一个定位结果显示在地图上");
        }
      });
    },
    // 使用机器学习算法
    arithmeticML() {
      if (
        JSON.parse(window.sessionStorage.getItem("selectData")).length === 1
      ) {
        window.sessionStorage.setItem("selectType", "ML-One");
        this.$router.push("/map/map_NY");
      } else {
        return this.$message("只能同时将一个定位结果显示在地图上");
      }
    },
    // 添加一个指纹数据
    addOneData() {
      this.addOneFormReset();
      this.rssTableOneVisible = true;
      this.deleteOneBtn = true;
    },
    removeDomain(item) {
      var index = this.addRssOneForm.Vector.indexOf(item);
      if (index !== -1) {
        this.addRssOneForm.Vector.splice(index, 1);
      }
      console.log(this.addRssOneForm);
    },
    addDomain() {
      this.addRssOneForm.Vector.push({
        BSSID: "",
        key: Date.now(),
      });
      console.log(this.addRssOneForm);
    },
    // 单个指纹数据表单重置
    addOneFormReset() {
      this.addRssOneForm.Order = "";
      this.addRssOneForm.XLabel = "";
      this.addRssOneForm.YLabel = "";
      this.addRssOneForm.LocalLabel = "";
      this.addRssOneForm.RoomLabel = "";
      this.addRssOneForm.Vector = [{ BSSID: "" }];
    },
    // 提交单个指纹数据
    async addOneFormPost() {
      var that = this;
      const { data: res } = await this.$axios
        .post("a/data/addOne", this.addRssOneForm)
        .catch(function (error) {
          that.$message.error("服务器出错");
        });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.getDataList();
      this.$message({
        message: "数据上传成功",
        type: "success",
      });
      this.addOneFormReset();
      this.rssTableOneVisible = false;
    },
    // 修改一个RSS指纹数据
    editRSS(data) {
      this.rssTableOneVisible = true;
      this.deleteOneBtn = false;
      this.addRssOneForm.Order = data.Order + "";
      this.addRssOneForm.XLabel = data.XLabel + "";
      this.addRssOneForm.YLabel = data.YLabel + "";
      this.addRssOneForm.LocalLabel = data.LocalLabel + "";
      this.addRssOneForm.RoomLabel = data.RoomLabel + "";
      this.addRssOneForm.Vector = [];
      var i = 0;
      for (i = 0; i < data.Vector.length; i++) {
        this.addRssOneForm.Vector.push({ BSSID: data.Vector[i] + "" });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.btn-group {
  margin-left: 10px;
}
</style>
