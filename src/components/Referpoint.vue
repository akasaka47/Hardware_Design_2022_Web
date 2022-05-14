<template>
  <div>
    <span>Referpoint</span>
    <h1>上传文件</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
      文件: <input type="file" name="file" /><br /><br />
      <input type="submit" value="上传文件到 train 数据库" />
    </form>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
</style>