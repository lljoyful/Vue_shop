<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">
            添加分类
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <!-- columns属性表示表格各列的配置：label列标题名称，prop列内容的属性名 -->
      <!-- selection-type是否为多选类型的表格 -->
      <!-- expand-type是否为展开行 -->
      <!-- show-index是否设置索引列，index-text可以设置索引列名称 -->
      <!-- show-row-hover鼠标悬停高亮 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <!-- 这里用的是slot-scope接收数据，并没有用自带的prop属性 -->
        <template slot="isok" slot-scope="scope">
          <div>
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted == false"
              style="color: lightgreen"
            ></i>
            <i class="el-icon-error" v-else style="color: red"></i>
          </div>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.cat_level == 0" size="mini">一级</el-tag>
            <el-tag
              type="success"
              v-else-if="scope.row.cat_level == 1"
              size="mini"
            >
              二级
            </el-tag>
            <el-tag type="warning" v-else size="mini">三级</el-tag>
          </div>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <div>
            <el-button type="primary" icon="el-icon-edit" size="mini">
              编辑
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteCate(scope.row.cat_id)"
            >
              删除
            </el-button>
          </div>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 级联选择器 -->
          <!-- options指定数据源 -->
          <!-- props用来指定数据对象 -->
          <!-- clearable可清空 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <!-- 分类表单的尾巴 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      // 商品分类的数据列表查询条件
      queryInfo: {
        type: 3,
        // 当前页码
        pagenum: 1,
        // 每页数据条数
        pagesize: 5,
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      //总数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        // label列标题名称，prop列内容的属性名
        {
          label: "分类标题",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "isok",
        },
        {
          label: "排序",
          // 表示将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "order",
        },
        {
          label: "操作",
          // 表示将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "opt",
        },
      ],
      //添加分类对话框显示和隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0,
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
      //父级分类的列表
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: "hover",
        // 指定具体选中的属性
        value: "cat_id",
        // 指定看到的属性
        label: "cat_name",
        // 指定父子嵌套用的哪个属性
        children: "children",
        // 是否严格的遵守父子节点不互相关联
        checkStrictly: true,
      },
      //选中的父级分类的id数组
      selectedKeys: [],
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      // console.log(res.data);
      // 把数据列表赋值给catelist
      this.catelist = res.data.result;
      // 总数据条数
      this.total = res.data.total;
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 点击按钮,展示添加分类的对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList();
      //展示出对话框
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2,
        },
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类失败");
      this.parentCateList = res.data;
    },
    // 选择项发生变化触发这个函数
    parentCateChange() {
      if (this.selectedKeys.length > 0) {
        // 等级
        this.addCateForm.cat_level = this.selectedKeys.length;
        // 父id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
      } else {
        this.addCateForm.cat_level = 0;
        this.addCateForm.cat_pid = 0;
      }
    },
    // 点击确定按钮,添加新的分类
    addCate() {
      // 预校验
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) return this.$message.error("添加分类失败");
        this.$message.success("添加分类成功");

        this.addCateDialogVisible = false;
        this.getCateList();
      });
    },
    //关闭添加分类对话框,清空对话框
    addCateDialogClosed() {
      // 分类名称清空
      this.$refs.addCateFormRef.resetFields();
      // 父级分类清空
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    //点击删除按钮，删除当前分类
    async deleteCate(goodsId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
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
      const { data: res } = await this.$http.delete("categories/" + goodsId);
      if (res.meta.status !== 200)
        return this.$message.error("删除商品分类失败");
      this.$message({
        type: "success",
        message: "删除成功!",
      });
      this.getCateList();
    },
  },
  created() {
    this.getCateList();
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>