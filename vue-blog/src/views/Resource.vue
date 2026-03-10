<template>
  <div class="blog-resource">
    <el-card class="blog-resource--wrap">
      <template #header>
        <div class="card-header blog-resource--title">
          <span>资源库</span>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="index" label="序号" type="index" align="center" width="60" />
        <el-table-column prop="name" label="资源名称" width="120" />
        <el-table-column prop="address" label="资源路径" show-overflow-tooltip>
          <template #default="scope">
            <a :href="scope.row.address">{{ scope.row.address }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="资源描述" />
      </el-table>
      <p class="blog-Annotation">后期开发计划: 添加资源的添加和删除...</p>
    </el-card>
    <!-- 表格缩放问题需要解决一下 -->
  </div>
</template>

<script setup>
const tableData = [
  {
    name: 'Element-Plus',
    address: 'https://element-plus.org/zh-CN/',
    description: '适用于pc端的UI库'
  },
  {
    name: 'Vue',
    address: 'https://cn.vuejs.org/',
    description: '前端最热门的开发框架'
  },
  {
    name: 'Vant4',
    address: 'https://vant-ui.github.io/vant/#/zh-CN/home',
    description: '适用于vue3的移动端UI库'
  },
  {
    name: '个人博客',
    address: 'https://www.ihewro.com/about.html',
    description: '挺不错的博客模板,可以作为学习参考'
  },
]
</script>

<style lang="stylus">
.blog-resource--title
  font-size 30px
  font-weight 700
.blog-resource--wrap
  min-height 80vh
.blog-Annotation
  user-select none
  margin-top 40px
  padding 10px
  font-size 12px
  color #666
  

</style>
