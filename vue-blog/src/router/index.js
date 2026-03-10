import { createRouter, createWebHashHistory } from 'vue-router'
import { useBlogStore } from '@/stores/blog_store'
import { ElNotification } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//pc views
import Home from '../views/Home.vue'
import ArticleList from '../views/ArticleList.vue'
import Article from '../views/Article.vue'
import Articles from '../views/Articles.vue'
import Resource from '../views/Resource.vue'
import Editor from '../views/Editor.vue'
import About from '../views/About.vue'
import UserInfo from '../views/UserInfo.vue'
import Socket from '../views/Socket.vue'
import Album from '../views/Album.vue'

//moblie views
import MHome from '../mviews/MHome.vue'
import MArticleList from '../mviews/MArticleList.vue'
import MArticle from '../mviews/MArticle.vue'
import MArticles from '../mviews/MArticles.vue'
import MUser from '../mviews/MUser.vue'
import MUserInfo from '../mviews/MUserInfo.vue'
import MAlbum from '../mviews/MAlbum.vue'
import MAbout from '../mviews/MAbout.vue'
import MResource from '../mviews/MResource.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/index',
      component: Home,
      children: [
        { path: '/index', name: 'index', component: ArticleList },
        { path: '/articles', name: 'articles', component: Articles, meta: { requiresAuth: true }, props: true },//通过判断是否有requiresAuth属性 来确定是否需要token验证
        { path: '/album', name: 'album', component: Album },
        { path: '/resource', name: 'resource', component: Resource },
        { path: '/article/:id', name: 'article', component: Article, props: true },
        { path: '/editor', name: 'editor', component: Editor, props: true },
        { path: '/about', name: 'about', component: About },
        { path: '/userinfo', name: 'userinfo', component: UserInfo },
        { path: '/chat', name: 'chat', component: Socket },
      ]
    },
    {
      path: '/m',
      name: 'mHome',
      redirect: '/m/index',
      component: MHome,
      children: [
        { path: 'index', name: 'mIndex', component: MArticleList, meta: { isShow: true } },
        { path: 'article/:id', name: 'mArticle', component: MArticle, props: true },
        { path: 'articles', name: 'mArticles', component: MArticles, meta: { title: '文章' } },
        { path: 'user', name: 'mUser', component: MUser, meta: { title: '个人中心' } },
        { path: 'userinfo', name: 'mUserInfo', component: MUserInfo, meta: { title: '设置' } },
        { path: 'album', name: 'mAlbum', component: MAlbum, meta: { title: '画廊' } },
        { path: 'about', name: 'mAbout', component: MAbout, meta: { title: '关于我' } },
        { path: 'resource', name: 'mResource', component: MResource, meta: { title: '资源库' } },
      ]
    }
  ],
})

//全局前置守卫
router.beforeEach((to, from, next) => {
  //通过插件添加加载动效
  NProgress.start()
  let userAuth = to.meta.requiresAuth
  const blogStore = useBlogStore()
  //对需要进行验证的项 判断是否存在token
  if (userAuth && !blogStore.token) {
    ElNotification({
      title: '通知',
      message: '请先登录',
      type: 'Info',
    })
    next('/')
  }
  next()
})

//全局后置钩子
router.afterEach(() => {
  NProgress.done()
})


export default router
