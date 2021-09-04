<template>
  <div>
    <el-button type="info" @click="signOut">退出</el-button>
  </div>
</template>

<script>
  export default {
    name:'Home',
    methods: {
      signOut(){
        window.sessionStorage.removeItem('token');
        this.$router.push({
          path:'/login'
        })
        // console.log();
      }
    },
  }
</script>

<style>

</style>