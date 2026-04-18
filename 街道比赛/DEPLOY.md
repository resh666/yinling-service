# Vercel 部署指南

## 一、准备工作

### 1. 注册 GitHub 账号
访问 https://github.com 注册账号

### 2. 注册 Vercel 账号
访问 https://vercel.com 使用 GitHub 账号登录

---

## 二、上传代码到 GitHub

### 方法一：使用 GitHub Desktop（推荐新手）

1. 下载安装 [GitHub Desktop](https://desktop.github.com/)
2. 登录你的 GitHub 账号
3. 点击 `File` → `Add Local Repository`
4. 选择 `街道比赛` 文件夹
5. 点击 `Create a new repository for the local project`
6. 填写仓库名称（如：`yinling-service`）
7. 点击 `Create repository`
8. 点击 `Publish repository` 上传

### 方法二：使用 Git 命令行

```bash
# 进入项目目录
cd "c:\Users\26082\Desktop\街道比赛"

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "初始提交"

# 添加远程仓库（先在 GitHub 创建仓库）
git remote add origin https://github.com/你的用户名/yinling-service.git

# 推送
git push -u origin main
```

---

## 三、在 Vercel 部署

1. 登录 [Vercel](https://vercel.com)
2. 点击 `Add New...` → `Project`
3. 选择你的 GitHub 仓库 `yinling-service`
4. 点击 `Import`
5. 保持默认设置，点击 `Deploy`
6. 等待部署完成（约1-2分钟）

---

## 四、获取网站地址

部署完成后，Vercel 会给你一个免费域名：
```
https://yinling-service-你的用户名.vercel.app
```

### 自定义域名（可选）

1. 在 Vercel 项目页面点击 `Settings`
2. 点击 `Domains`
3. 添加你的自定义域名

---

## 五、测试网站

部署完成后：

1. 打开 Vercel 给你的网址
2. 测试预约功能
3. 用手机扫描二维码测试

---

## 六、注意事项

### 免费额度
- Vercel 免费版每月有 100GB 流量
- 对于社区服务项目完全够用

### 数据存储
- Vercel Serverless 函数的数据存储在内存中
- 服务器重启后数据会丢失
- 如需持久化存储，建议使用：
  - Vercel KV（Redis）
  - MongoDB Atlas（免费）
  - Supabase（免费）

### 更新网站
1. 修改本地代码
2. 提交到 GitHub
3. Vercel 会自动重新部署

---

## 七、常见问题

### Q: 部署失败怎么办？
A: 检查 `vercel.json` 文件格式是否正确

### Q: API 接口不工作？
A: 确保 `api` 文件夹结构正确

### Q: 如何查看日志？
A: Vercel 项目页面 → `Deployments` → 点击部署 → `Functions`

---

## 八、项目文件结构

```
街道比赛/
├── index.html          # 前端页面
├── admin.html          # 管理后台
├── vercel.json         # Vercel 配置
├── api/                # Serverless API
│   ├── bookings.js     # 预约接口
│   ├── stats.js        # 统计接口
│   └── bookings/
│       └── [id].js     # 预约详情接口
└── 后端/               # 本地开发用
```

---

## 需要帮助？

如有问题，可以：
1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 联系项目负责人：177-1735-0629
