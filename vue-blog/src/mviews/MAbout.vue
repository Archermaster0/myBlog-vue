<template>
  <div class="mblog-about">
    <van-image class="mblog-about--image" src="src/assets/img/banner.jpg" />
    <div class="mblog-about--content">
      <el-descriptions class="margin-top" title="自述" column="1">
        <el-descriptions-item label="所在地">成都</el-descriptions-item>
        <el-descriptions-item label="目标">开心做自己</el-descriptions-item>
        <el-descriptions-item label="岗位">前端工程师</el-descriptions-item>
        <el-descriptions-item label="联系方式">1311211019@qq.com</el-descriptions-item>
        <!-- <el-descriptions-item label="Place">Suzhou</el-descriptions-item> -->
        <el-descriptions-item label="自我标签">
          <el-tag size="small">踏实</el-tag>
          <el-tag size="small">爱笑</el-tag>
          <el-tag size="small">热爱生活</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="座右铭">
          认准自己的方向, 坚持下去!
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="margin-top blog-about--experience" title="相关经历" :column="1">
        <el-descriptions-item>
          <el-timeline style="max-width: 600px">
            <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp"
              placement="top">
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="margin-top blog-about--skill" title="技能储备" :column="1">
        <el-descriptions-item>
          <ul>
            <li>前端开发js/html/css三件套</li>
            <li>Node开发</li>
            <li>axios网络请求</li>
            <li>webpack打包</li>
            <li>vue开发vue-cli/vue-router/vuex三件套</li>
            <li>更多技能正在开发中...</li>
          </ul>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="margin-top blog-about--work" title="相关作品" :column="1">
        <el-descriptions-item>
          <ul>
            <li>正在创作...</li>
          </ul>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="margin-top blog-about--outlook" title="未来展望" :column="1">
        <el-descriptions-item>
          <ul>
            <li>拥有一份钱多稳定的工作</li>
            <li>节假日与家人一起外出旅游</li>
            <li>时不时与朋友相聚</li>
          </ul>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <el-divider border-style="hidden">
      努力一定会有结果
    </el-divider>
  </div>
</template>

<script setup>
const activities = [
  {
    content: '乐山师范学院 / 本科 / 市场营销',
    timestamp: '2017-09-01--2021-06-01',
  },
  {
    content: '渡劫',
    timestamp: '2021-06-01至今',
  }
]
</script>

<style lang="stylus">
.mblog-about
  width 100%
  background-color #fff
.mblog-about--image
  width 100%
  height 20vh
.mblog-about--content
  padding 0 10px
.mblog-about--content ul
  padding-left 1.2em
  list-style-type disc
  list-style-position outside
  list-style-image none
.blog-about--experience ul
  list-style none
.mblog-about--content .el-descriptions
  padding-bottom 16px
.mblog-about--content .el-descriptions__title
  width 100%
  line-height 2em
  font-size 18px
  font-weight 700
  border-bottom 1px solid rgb(216.8, 235.6, 255)
.mblog-about--content .el-divider--horizontal
  margin 60px 0 0 0
  border-top none
.mblog-about--content .el-divider__text
  font-size 12px
  color rgb(159.5, 206.5, 255)
</style>