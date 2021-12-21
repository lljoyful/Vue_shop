<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- border边框线 stripe隔行变色 -->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <!-- prop对应的是表格列的名称 -->
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <!-- 因为里边是自定义的属性，所以要加插槽 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">
              二级权限
            </el-tag>
            <el-tag v-else type="warning">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      //权限列表
      rightsList: [],
    };
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.rightsList = res.data;
    },
  },
  created() {
    //获取所有的权限
    this.getRightsList();
  },
};
</script>

<style lang="less" scope>
</style>