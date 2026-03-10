//文章 评论 分类 关联映射表
module.exports = {
  "Article": [
    {
      "path": "author",
      "select": "nikname avatar"
    },
    {
      "path": "column",
      "select": "name"
    },
    {
      "path": "comments",
      "select": "content uid aid date",
      "populate": {
        "path": "uid",
        "select": "nikname avatar"
      }
    }
  ],
  "Comment": [
    {
      "path": "uid",
      "select": "nikname avatar"
    },
  ],
  "Column": [
    {
      "path": "aids",
      "select": "title cover date hit_num comment_num like_num author"
    },
  ]
}