<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 表头搜索区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <!-- clearable清空效果 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加商品按钮 -->
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <!-- prop对应的实际的属性名称，label对应的是展示的名称 -->
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="110px"
        >
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template slot-scope="scope">
            <div>
              {{ scope.row.add_time | dateFormate }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <div>
              <!-- 编辑按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeById(scope.row.goods_id)"
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <!-- background给分页加背景 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        // 搜素关键字
        query: "",
        // 查询页码值
        pagenum: 1,
        // 每页的数据条数
        pagesize: 10,
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0,
    };
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      this.total = res.data.total;
      this.goodsList = res.data.goods;
    },
    // 分页的变化,每页多少条数据
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getGoodsList();
    },
    // 当前页是第几页
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getGoodsList();
    },
    // 删除商品
    async removeById(goodsId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message({
          type: "info",
          message: "已取消删除",
        });
      }
      const { data: res } = await this.$http.delete(`goods/${goodsId}`);
      if (res.meta.status !== 200) return this.$message.error("删除商品失败");
      this.$message({
        type: "success",
        message: "删除商品成功!",
      });
      this.getGoodsList();
    },
    // 添加商品
    goAddpage() {
      // 跳转路由
      this.$router.push("/goods/add");
    },
  },
  created() {
    this.getGoodsList();
  },
};
</script>

<style scoped>
</style>