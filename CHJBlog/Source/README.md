# CHJBlog
## 目录结构介绍
* bin : 存放命令行相关代码
* doc : 存放文档
* lib : 存放API相关代码
* node_modules : 存放三方包
* tests : 存放测试用例
* package.json : 元数据文件
* README.md : 说明文件

## CHJBlog
### 技术
 * Node.js
  * 安装 
  * 锁定依赖的版本: npm shrinkwrap
  * 代码保存自动刷新工具supervisor： npm i -g supervisor,安装完后在要监控的目录启动：supervisor index
 * MongoDB
  * 安装mongodb： brew install mongodb
  
  ```
      启动mongodb： mongod
      指定mongodb的数据库路径： mongod --dbpath [文件路径] 
  ```
  
  * 安装可视化管理工具：Robomongo 或者 MongoChef 
 * Express
### 功能
 * 登录\注册
 * 编写Blog