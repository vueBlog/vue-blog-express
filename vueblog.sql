/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 80017
Source Host           : localhost:3306
Source Database       : vueblog

Target Server Type    : MYSQL
Target Server Version : 80017
File Encoding         : 65001

Date: 2020-02-29 09:17:32
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for vue_blog
-- ----------------------------
DROP TABLE IF EXISTS `vue_blog`;
CREATE TABLE `vue_blog` (
  `articleId` int(11) NOT NULL AUTO_INCREMENT COMMENT '文章 id',
  `articleTitle` varchar(255) NOT NULL COMMENT '文章标题',
  `articleSubTitle` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文章的二级标题，用于搜索快速定位',
  `articleNature` int(11) NOT NULL DEFAULT '0' COMMENT '0: 原创 1：转载 2：翻译',
  `articleKey` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文章关键字',
  `articleContentMarkdown` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文章内容markdown格式',
  `articleContentHtml` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文章内容html格式',
  `articleAuthorId` int(11) NOT NULL COMMENT '作者id',
  `articleCreateTime` datetime NOT NULL COMMENT '文章创建时间',
  `articleUpdateTime` datetime DEFAULT NULL COMMENT '更新时间',
  `articleView` int(11) NOT NULL DEFAULT '0' COMMENT '文章浏览次数',
  `articleStart` int(11) NOT NULL DEFAULT '0' COMMENT '文章点赞数',
  `articleColumn` int(255) NOT NULL DEFAULT '0' COMMENT '文章专栏id',
  PRIMARY KEY (`articleId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for vue_blog_author
-- ----------------------------
DROP TABLE IF EXISTS `vue_blog_author`;
CREATE TABLE `vue_blog_author` (
  `authorId` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户主键',
  `authorName` varchar(255) NOT NULL COMMENT '作者姓名',
  `authorHeadimg` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '作者头像链接',
  `authorIntroduce` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '作者简介',
  `authorPassword` varchar(255) NOT NULL COMMENT '密码',
  `authorEmail` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '作者邮箱',
  `admin` int(11) DEFAULT '0' COMMENT '是否是管理员，1：是，0：不是',
  `authority` int(255) DEFAULT '2' COMMENT '权限：0：管理员，1：成员，2：注册待通过，3：浏览用户',
  `token` varchar(255) NOT NULL COMMENT '用户token',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`authorId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for vue_blog_column
-- ----------------------------
DROP TABLE IF EXISTS `vue_blog_column`;
CREATE TABLE `vue_blog_column` (
  `columnId` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '栏目',
  `columnTitle` varchar(255) NOT NULL COMMENT '栏目名称',
  `columnContent` varchar(255) NOT NULL COMMENT '栏目内容',
  `columnNumber` int(11) NOT NULL DEFAULT '0' COMMENT '栏目包含的文章数',
  `columnCreateTime` datetime NOT NULL,
  `columnView` bigint(20) NOT NULL DEFAULT '0' COMMENT '栏目的访问数',
  PRIMARY KEY (`columnId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for vue_blog_img
-- ----------------------------
DROP TABLE IF EXISTS `vue_blog_img`;
CREATE TABLE `vue_blog_img` (
  `imgId` int(11) NOT NULL AUTO_INCREMENT COMMENT '图片id',
  `articleId` int(11) DEFAULT NULL COMMENT '图片所属的文章id',
  `imgPath` varchar(255) NOT NULL COMMENT '图片地址',
  PRIMARY KEY (`imgId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for vue_blog_title
-- ----------------------------
DROP TABLE IF EXISTS `vue_blog_title`;
CREATE TABLE `vue_blog_title` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `articleId` int(11) NOT NULL COMMENT '文章ID',
  `h0` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '文章标题',
  `h1` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '一级标题',
  `h2` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '二级标题',
  `h3` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '三级标题',
  `h4` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '四级标题',
  `h5` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '五级标题',
  `h6` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '六级标题',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for vue_blog_views
-- ----------------------------
DROP TABLE IF EXISTS `vue_blog_views`;
CREATE TABLE `vue_blog_views` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `routeFrom` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '对应router.beforeEach中from.path',
  `routeTo` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '对应router.beforeEach中to.path',
  `time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '跳转时间',
  `clientSystem` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '客户端系统',
  `clientBrowser` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '客户端浏览器',
  `clientBrowserVersion` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '客户端浏览器版本号',
  `clientIp` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '客户端ip地址',
  `clientCity` varchar(255) DEFAULT NULL COMMENT '客户端城市',
  `client` int(11) DEFAULT '0' COMMENT '0：vue-blog, 1: vue-blog-nuxt, 2: vue-blog-m-nuxt',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
