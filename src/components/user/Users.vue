<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="paramsInfo.query"
            clearable
          >
            <!-- 点击查询，直接重新获取用户列表 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="isDialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <!-- 状态列 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChage(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row)"
              >
              </el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
              <!-- 分配角色按钮,当鼠标放上的时候可以提示文字，鼠标离开文字隐藏 -->
              <el-tooltip
                effect="dark"
                content="分配角色"
                placement="top-end"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="setRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsInfo.pagenum"
        :page-sizes="[1, 2, 5, 8]"
        :page-size="paramsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="isDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 主体内容区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <!-- prop指定的是校验规则 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 主体内容区 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <!-- disabled禁用用户名 prop是验证规则-->
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser"> 确 定 </el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前用户：{{ userInfo.username }}</p>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedReleId" placeholder="请选择">
            <!-- label是显示的哪个值,value是记住哪个值 -->
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    //验证邮箱自定义校验规则(ele-ui官方文档就是这么定义)
    // rule验证规则 ,value验证的值,cd是个回调函数
    var checkEmail = (rule, value, cb) => {
      // /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      // 验证邮箱的正则
      const regEmail =
        /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
      if (regEmail.test(value)) return cb();
      cb(new Error("请输入合法的邮箱"));
    };
    //验证手机号
    var checkMobile = (rule, value, cb) => {
      let regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) return cb();
      cb(new Error("请输入合法的手机号"));
    };
    return {
      // 获取用户列表的参数对象
      paramsInfo: {
        // 搜索关键字
        query: "",
        // 当前页码
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      isDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //添加表单验证规则
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个之间",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个之间",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            // 使用自定义的验证规则
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            // 使用自定义的验证规则
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
      //用户修改对话框显示与隐藏
      editDialogVisible: false,
      // 用户修改表单数据
      editForm: {
        id: "",
        username: "",
        email: "",
        mobile: "",
      },
      //控制分配角色的对话框显示和隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      //获取角色列表
      rolesList: [],
      //选中的角色id
      selectedReleId: "",
    };
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.paramsInfo,
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 监听pagesize改变的事件（是一页显示多少条数据的值）
    handleSizeChange(newSize) {
      this.paramsInfo.pagesize = newSize;
      // this.getUserList();
    },
    // 监听页码值改变 （是当前页码的值）
    handleCurrentChange(newPage) {
      this.paramsInfo.pagenum = newPage;
      // this.getUserList();
    },
    // 监听状态switch的改变
    async userStateChage(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新状态成功");
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      //关闭时清空对话框内容
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以添加用户的网络请求
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status != 201) return this.$message.error("添加用户失败");
        this.$message.success("添加用户成功");
        // 隐藏添加用户的对话框
        this.isDialogVisible = false;
        this.getUserList();
      });
    },
    // 展示编辑用户的对话框
    showEditDialog(val) {
      this.editDialogVisible = true;
      this.editForm.id = val.id;
      this.editForm.username = val.username;
      this.editForm.email = val.email;
      this.editForm.mobile = val.mobile;
    },
    // 监听修改用户对话框的确定（修改）事件
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          {
            id: this.editForm.id,
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        if (res.meta.status != 200) return this.$message.error("修改用户失败");
        // 提示修改成功
        this.$message.success("添加用户成功");
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getUserList();
      });
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 根据Id删除对应的用户信息
    async removeUserById(userId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 如果用户确认删除confirmResult=="confirm"
      // 如果用户取消删除confirmResult=="cancel"
      if (confirmResult !== "confirm") {
        return this.$message({
          type: "info",
          message: "已取消删除",
        });
      }
      const { data: res } = await this.$http.delete("users/" + userId);
      if (res.meta.status !== 200) return this.$message.error("删除用户失败");
      this.$message({
        type: "success",
        message: "删除成功!",
      });
      this.getUserList();
    },
    //分配角色
    async setRole(userInfo) {
      this.userInfo = userInfo;
      //在展示对话框之前获取所有的角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },
    //点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectedReleId) {
        return this.$message.error("请选择要分配的角色");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        { rid: this.selectedReleId }
      );
      if (res.meta.status !== 200) return this.$message.error("分配角色失败");
      this.$message.success("分配角色成功");
      this.setRoleDialogVisible = false;
      this.getUserList();
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedReleId = "";
      this.userInfo = {};
    },
  },

  // 监听属性
  watch: {
    paramsInfo: {
      deep: true,
      handler() {
        this.getUserList();
      },
    },
  },
  created() {
    this.getUserList();
  },
};
</script>

<style>
</style>