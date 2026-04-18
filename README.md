# 社区银龄生活管家服务项目

## 项目简介

本项目为洋泾街道社区老年人提供专业、便捷、贴心的上门养老服务预约平台。

## 功能特点

- 在线预约服务
- 微信扫码访问
- 预约数据自动保存
- 局域网访问支持

## 快速启动

### 方法一：双击启动（推荐）

1. 双击运行 `启动服务器.bat`
2. 等待服务器启动完成
3. 打开浏览器访问显示的网址

### 方法二：手动启动

1. 打开命令行，进入后端目录：
   ```
   cd 后端
   ```

2. 安装依赖（首次运行）：
   ```
   npm install
   ```

3. 启动服务器：
   ```
   npm start
   ```

4. 打开浏览器访问：
   - 本地访问：http://localhost:3000
   - 局域网访问：http://你的IP地址:3000

## 目录结构

```
街道比赛/
├── index.html          # 前端页面
├── 启动服务器.bat       # 一键启动脚本
├── 后端/
│   ├── server.js       # 服务器主文件
│   ├── package.json    # 项目配置
│   └── data/           # 数据存储目录
│       ├── bookings.json   # 预约数据
│       └── contacts.json   # 联系记录
└── 商业企划书.doc       # 项目文档
```

## API 接口

### 预约相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/bookings | 获取所有预约 |
| POST | /api/bookings | 创建新预约 |
| PUT | /api/bookings/:id | 更新预约状态 |
| DELETE | /api/bookings/:id | 删除预约 |

### 其他接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/stats | 获取统计数据 |
| GET | /api/qrcode-url | 获取二维码URL |

## 预约数据格式

```json
{
  "id": "唯一ID",
  "name": "姓名",
  "phone": "电话",
  "address": "地址",
  "serviceType": "服务类型",
  "appointmentTime": "预约时间",
  "notes": "备注",
  "status": "pending/confirmed/completed/cancelled",
  "createTime": "创建时间"
}
```

## 注意事项

1. 确保电脑已安装 Node.js（版本 14 以上）
2. 确保防火墙允许 3000 端口访问
3. 局域网访问需要电脑和手机在同一网络下
4. 预约数据保存在 `后端/data/bookings.json` 文件中

## 技术栈

- 前端：HTML + CSS + JavaScript
- 后端：Node.js + Express
- 数据存储：JSON 文件

## 联系方式

- 电话：177-1735-0629
- 联系人：王云娴
- 地址：上海市第二轻工业学校
"# yinling-service" 
