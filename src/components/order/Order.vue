<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <!-- 是否付款 -->
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <div>
              <el-tag type="success" v-if="scope.row.pay_status == 1">
                已付款
              </el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <!-- 下单时间 -->
        <el-table-column label="下单时间">
          <template slot-scope="scope" prop="“create_time">
            <div>
              {{ scope.row.create_time | dateFormate }}
            </div>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <div>
              <!-- 编辑按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showBox"
              ></el-button>
              <!-- 定位按钮 -->
              <el-button
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="showProgressBox(scope.row)"
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 点击修改按钮的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <!-- 表单 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address">
          <el-cascader
            v-model="addressForm.address"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addressDetail">
          <el-input v-model="addressForm.addressDetail"></el-input>
        </el-form-item>
      </el-form>
      <!-- 确认取消按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- timeline时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata";
export default {
  name: "Order",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //订单数据总条数
      total: 0,
      // 订单列表
      orderList: [],
      // 修改对话框显示与隐藏按钮
      addressVisible: false,
      addressForm: {
        address: [],
        addressDetail: "",
      },
      // 验证规则
      addressFormRules: {
        address: [
          {
            required: true,
            message: "请选择省市区/县",
            trigger: "blur",
          },
        ],
        addressDetail: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur",
          },
        ],
      },
      // 城市数据
      cityData,
      // 物流进度的对话框显示和隐藏
      progressVisible: false,
      //自己写的物流数据
      progressInfo: [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: "",
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: "",
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: "",
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: "",
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: "",
        },
      ],
    };
  },
  methods: {
    // 获取订单数据列表
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error("添加商品失败");
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    // 当前每页显示的数据条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    // 当前页码值是
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true;
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    async showProgressBox() {
      // 物流接口有问题
      // const { data: res } = await this.$http.get("/kuaidi/804909574412544580");
      // console.log(res);
      this.progressVisible = true;
    },
  },
  created() {
    this.getOrderList();
  },
};
</script>

<style scoped>
/* 导入时间线样式 */
@import "../../plugins/timeline/timeline.css";
@import "../../plugins/timeline-item/timeline-item.css";

.el-cascader {
  width: 100%;
}
</style>