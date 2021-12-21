<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 添加商品信息 -->
      <!-- 提示区 -->
      <el-alert
        title="消息提示的文案"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <!-- active表示当前激活项 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <!-- label-position="top"为了设置文字在框框的上边 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- v-model设置当前激活的值 -->
        <!-- before-leave切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换 -->
        <!-- tab-click被选中的时候触发的 -->
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- 基本信息 -->
          <!-- el-tab-pane只允许作为el-tabs的子节点，所以要把表单放在el-tabs上边 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- v-model绑定的必须是数组 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="addProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(items, i) in item.attr_vals"
                  :key="i"
                  :label="items"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableDate"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品照片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传的api地址 -->
            <!-- headers是设置上传图片的请求头 -->
            <!-- on-success文件上传成功的钩子 -->
            <!-- on-preview预览图片的钩子 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="imgVisible" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Add",
  data() {
    return {
      activeIndex: "0",
      // 添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: -1,
        goods_number: -1,
        goods_weight: -1,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: "",
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "blur",
          },
        ],
      },
      // 商品分类数据
      cateList: [],
      // 级联选择框的配置对象
      addProps: {
        expandTrigger: "hover",
        // 选中的值
        value: "cat_id",
        // 看到的值
        label: "cat_name",
        // 级联的值
        children: "children",
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableDate: [],
      // 上传图片的url地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //上传的图片的真实完整的路径
      previewPath: "",
      // 控制图片预览框
      previewVisible: false,
    };
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      this.cateList = res.data;
    },
    // 级联选择，选中项变化触发的函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 切换标签之前的钩子 activeName进入标签页的名字，oldActiveName离开标签页的名字
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName == "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    // 标签的值改变的时候触发
    async tabClicked() {
      // 访问动态参数面板
      if (this.activeIndex == "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "many" } }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取分类参数列表失败");
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length == 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      }
      // 访问静态属性面板
      else if (this.activeIndex == "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "only" } }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取分类属性列表失败");
        this.onlyTableDate = res.data;
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      let index = this.addForm.pics.findIndex((val) => val.pic == filePath);
      this.addForm.pics.splice(index, 1);
    },
    // 文件上传成功时的钩子
    handleSuccess(response) {
      // 得到图片路径信息对象
      let picStr = { pic: response.data.tmp_path };
      this.addForm.pics.push(picStr);
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }
        // 执行添加的业务逻辑
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyTableDate.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newInfo);
        });
        // 因为addForm.goods_cat必须是数组，不能直接转化，所以可以直接使用json进行深拷贝
        const form = JSON.parse(JSON.stringify(this.addForm));
        form.goods_cat = form.goods_cat.join(",");
        // form.attrs=this.addForm.attrs;
        const { data: res } = await this.$http.post("goods", form);
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加商品失败");
        this.$message.success("添加商品成功");
        this.$router.push("/goods");
      });
    },
  },
  computed: {
    // 获取三级商品分类的id
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2];
      }
    },
  },
  created() {
    this.getCateList();
  },
};
</script>

<style scoped>
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px !important;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.imgVisible {
  width: 100%;
  height: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>