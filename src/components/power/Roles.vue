<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="isRolesVisible = true">
            添加角色
          </el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 二级渲染 -->
                <el-row
                  :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级渲染 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="350px">
          <template slot-scope="scope">
            <div>
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditRoles(scope.row)"
              >
                编辑
              </el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeRolesById(scope.row.id)"
              >
                删除
              </el-button>
              <!-- 分配角色按钮 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRightDialog(scope.row)"
              >
                分配权限
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="isRolesVisible"
      width="50%"
      @close="addRolesClosed"
    >
      <!-- 主体内容区域 -->
      <el-form
        :model="addRolesList"
        :rules="addRolesRules"
        ref="addRolesRef"
        label-width="70px"
      >
        <el-form-item label="角色名称" prop="roleName" label-width="100px">
          <el-input v-model="addRolesList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
          <el-input v-model="addRolesList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRolesVisible"
      width="50%"
      @close="editRolesClosed"
    >
      <!-- 主体内容区域 -->
      <el-form
        :model="editRolesList"
        :rules="addRolesRules"
        ref="editRolesRef"
        label-width="70px"
      >
        <el-form-item label="角色名称" prop="roleName" label-width="100px">
          <el-input v-model="editRolesList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
          <el-input v-model="editRolesList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 添加角色对话框是否显示
      isRolesVisible: false,
      // 添加角色的数据
      addRolesList: {
        roleName: "",
        roleDesc: "",
      },
      //添加用户角色的验证规则
      addRolesRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "角色名的长度在2~10个之间",
            trigger: "blur",
          },
        ],
        roleDesc: [
          {
            required: true,
            message: "请输入角色描述",
            trigger: "blur",
          },
          {
            min: 3,
            max: 20,
            message: "角色描述的长度在3-20个之间",
            trigger: "blur",
          },
        ],
      },
      // 修改角色对话框是否显示
      editRolesVisible: false,
      // 修改角色信息
      editRolesList: {},
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限数组
      rightList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      defKeysTemps: [],
      //修改权限的当前角色的id
      roleId: "",
    };
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.roleList = res.data;
    },

    // 监听添加角色对话框的关闭事件,重置表单
    addRolesClosed() {
      this.$refs.addRolesRef.resetFields();
    },
    //添加角色对话框的确定事件
    async addRoles() {
      const { data: res } = await this.$http.post("roles", {
        roleName: this.addRolesList.roleName,
        roleDesc: this.addRolesList.roleDesc,
      });
      if (res.meta.status !== 201) return this.$message.error("添加角色失败");
      this.getRolesList();
      this.isRolesVisible = false;
    },
    // 修改角色按钮
    showEditRoles(role) {
      this.editRolesList = role;
      this.editRolesVisible = true;
    },
    // 修改框确定按钮之后
    async editRoles() {
      console.log(this.editRolesList);
      const { data: res } = await this.$http.put(
        `roles/${this.editRolesList.id}`,
        {
          roleName: this.editRolesList.roleName,
          roleDesc: this.editRolesList.roleDesc,
        }
      );
      this.getRolesList();
      this.editRolesVisible = false;
    },
    // 关闭修改对话框
    editRolesClosed() {
      this.$refs.editRolesRef.resetFields();
    },
    //删除角色
    async removeRolesById(roleid) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
      const { data: res } = await this.$http.delete("roles/" + roleid);
      if (res.meta.status !== 200) return this.$message.error("删除用户失败");
      this.$message({
        type: "success",
        message: "删除成功!",
      });
      this.getRolesList();
    },
    //根据id删除对应的权限
    async removeRightById(role, rightId) {
      //弹窗提示用户是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除用户失败");
      role.children = res.data;
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取所有权限的数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) return this.$message.error("读取权限失败");
      //递归获取三级节点的id
      this.rightList = res.data;
      this.getLeafKey(role, this.defKeysTemps);
      this.defKeys = this.defKeysTemps.slice(0);
      this.defKeysTemps.splice(0, this.defKeysTemps.length);
      this.setRightDialogVisible = true;
    },
    //通过递归的形式，获取角色下所有三级权限的id
    getLeafKey(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKey(item, arr);
      });
    },
    //点击分配权限
    async allotRights() {
      this.setRightDialogVisible = false;
      const keys = this.$refs.treeRef.getCheckedKeys();
      keys.push(...this.$refs.treeRef.getHalfCheckedKeys());
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        "roles/" + this.roleId + "/rights",
        { rids: idStr }
      );
      if (res.meta.status !== 200) return this.$message.error("分配权限失败");
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
  },
  /* watch数据监听和展开行冲突
   watch: {
    roleList: {
      deep: true,
      handler() {
        this.getRolesList();
      },
    },
  }, */
  created() {
    this.getRolesList();
  },
};
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>