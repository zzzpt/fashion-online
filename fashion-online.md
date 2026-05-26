# 时尚在线（Fashion Online）— AI 数字衣柜平台

> **技术路线：** Mobile First 的 AI Web 产品，前端 React + Next.js + TailwindCSS，后端 Python + FastAPI，数据库 PostgreSQL + Supabase，AI 能力通过 OpenAI API 和图像生成 API 实现，整体采用 API 调用型 AI 产品架构。

---

## 一、产品概述

### 1.1 产品定位

一个 AI 数字衣柜平台。用户可以上传自己的衣服，进行 AI 搭配、试穿和穿搭创作。核心价值：**"数字衣柜 + AI 穿搭"**，让用户方便快捷地决定今天出门穿什么、配什么妆造，根据场景（今日天气）来智能推荐搭配。

### 1.2 核心用户画像

| 维度 | 描述 |
|------|------|
| 年龄 | 18–35 岁 |
| 性别 | 女性为主 |
| 兴趣 | 穿搭、OOTD、记录生活 |
| 场景 | 日常通勤、约会、逛街、旅行 |
| 痛点 | 衣服多但不知道穿什么、买了很多但不会搭配、想记录穿搭但没有好工具 |

### 1.3 产品风格

**Pinterest + 小红书 + Apple 风格**

- 移动端优先（Mobile First）
- 简洁高级、偏女性化
- **不用卡片式布局** — 用大图、留白、细线分割
- 中文描述和文案

---

## 二、第一版核心功能

### 2.1 导航结构

```
├── 首页（发现/推荐）
├── 衣柜（衣物管理）
├── 搭配（AI 搭配 + 创作）
└── 我的（个人中心 + 设置）
```

AI 能力内嵌在"搭配"导航中，不单独作为一个 tab。

### 2.2 功能清单

#### 2.2.1 登录/注册

- Supabase Auth 实现
- 支持：手机号验证码登录、微信登录（后期）
- 登录态通过 JWT 维护

#### 2.2.2 上传衣服

- 支持拍照上传 / 相册选择
- 支持多图批量上传
- 上传后自动触发 AI 识别

#### 2.2.3 AI 识别衣物

- 调用 OpenAI Vision API 识别衣物属性：
  - 品类（上衣、裤子、裙子、外套、鞋子、包包、配饰等）
  - 颜色
  - 材质
  - 风格标签（休闲、通勤、甜美、街头、复古等）
  - 季节适用性
- 自动抠图（remove.bg API），生成透明背景单品图

#### 2.2.4 衣柜管理

- 按品类分类浏览（全部 / 上衣 / 下装 / 连衣裙 / 外套 / 鞋子 / 配饰）
- 按颜色筛选
- 按风格标签筛选
- 单品详情页：大图、属性、穿搭记录
- 编辑/删除单品

#### 2.2.5 拖拽搭配

- 从衣柜拖拽单品到搭配画布
- 画布支持自由排列、层级调整
- 支持更换背景（纯色/场景图）
- 搭配完成后保存为 Look

#### 2.2.6 保存 Look

- 保存搭配组合（多件单品的组合 + 布局信息）
- Look 可添加描述、标签、适用场景
- 我的 Looks 列表展示

#### 2.2.7 AI 智能搭配（内嵌在"搭配"页）

- **今日推荐：** 根据天气 + 场景，从衣柜推荐一套搭配
- **AI 一键搭配：** 选择一件单品，AI 推荐其他搭配单品
- **灵感生成：** AI 生成穿搭灵感图（Fal.ai / Replicate）

---

## 三、技术架构

### 3.1 整体架构图

```
┌─────────────────────────────────────────────────┐
│                    前端 (Vercel)                  │
│         Next.js 14 (App Router) + React 18        │
│    TailwindCSS + shadcn/ui + Framer Motion       │
│            Zustand (状态) + dnd-kit (拖拽)         │
└────────────────────┬────────────────────────────┘
                     │ REST API / Supabase SDK
┌────────────────────▼────────────────────────────┐
│                后端 (Railway/Render)              │
│              Python 3.12 + FastAPI               │
│         SQLAlchemy (ORM) + Alembic (迁移)         │
│     Celery/Dramatiq (异步任务) + Redis (缓存)      │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│                  Supabase (BaaS)                  │
│     PostgreSQL (主库) + Auth (认证)               │
│     Storage (图片存储) + Row Level Security       │
└─────────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│                外部 AI 服务                        │
│  OpenAI Vision API (衣物识别)                     │
│  Fal.ai / Replicate (AI 穿搭生成)                │
│  remove.bg API (抠图)                            │
│  天气 API (场景穿搭推荐)                          │
└─────────────────────────────────────────────────┘
```

### 3.2 前端技术选型

| 类别 | 技术 | 用途 |
|------|------|------|
| 框架 | Next.js 14 (App Router) | 页面路由、SSR |
| UI 库 | React 18 | 组件 |
| 样式 | TailwindCSS | 原子化 CSS |
| 组件库 | shadcn/ui | 基础 UI 组件 |
| 状态管理 | Zustand | 全局状态 |
| 动画 | Framer Motion | 页面过渡、微动效 |
| 拖拽 | dnd-kit | 拖拽搭配画布 |
| 图片处理 | browser-image-compression | 前端压缩后再上传 |
| HTTP 客户端 | fetch / ky | API 请求 |
| 表单 | react-hook-form + zod | 表单校验 |

### 3.3 后端技术选型

| 类别 | 技术 | 用途 |
|------|------|------|
| 框架 | FastAPI | REST API |
| ORM | SQLAlchemy 2.0 | 数据库操作 |
| 迁移 | Alembic | 数据库 migration |
| 认证 | python-jose + Supabase Auth | JWT 验证 |
| 异步任务 | Celery + Redis | AI 识别、图片处理 |
| 缓存 | Redis | 天气缓存、推荐缓存 |
| 文件存储 | Supabase Storage | 用户上传图片 |
| 数据库 | PostgreSQL (Supabase) | 主数据存储 |

### 3.4 数据库表设计（PostgreSQL）

#### users（扩展 Supabase auth.users）

```sql
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname      VARCHAR(50),
  avatar_url    TEXT,
  gender        VARCHAR(10) DEFAULT 'female',
  birth_date    DATE,
  city          VARCHAR(50),
  style_tags    TEXT[],  -- ['甜美','通勤','街头']
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
```

#### clothing_items（衣物单品）

```sql
CREATE TABLE public.clothing_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url       TEXT NOT NULL,                            -- 原始图片
  image_no_bg_url TEXT,                                     -- 抠图后透明背景图
  category        VARCHAR(20) NOT NULL,                     -- top/bottom/dress/outerwear/shoes/bag/accessory
  sub_category    VARCHAR(30),                              -- t_shirt/blouse/sweater/jeans/skirt/sneakers/heels/...
  color           VARCHAR(20),                              -- 主色调
  color_palette   TEXT[],                                   -- 色板 ['#FFFFFF','#000000']
  material        VARCHAR(30),                              -- 材质
  brand           VARCHAR(50),                              -- 品牌
  season          TEXT[],                                   -- ['spring','summer','autumn','winter']
  style_tags      TEXT[],                                   -- ['minimalist','streetwear','vintage',...]
  ai_description  TEXT,                                     -- AI 生成的完整描述
  is_favorite     BOOLEAN DEFAULT false,
  wear_count      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_clothing_user ON clothing_items(user_id);
CREATE INDEX idx_clothing_category ON clothing_items(user_id, category);
```

#### looks（穿搭组合）

```sql
CREATE TABLE public.looks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           VARCHAR(100),
  description     TEXT,
  cover_image_url TEXT,                                     -- 搭配缩略图（合成后的）
  scene           VARCHAR(30),                              -- 场景：daily/date/work/travel/sport
  season          VARCHAR(20),
  weather_condition VARCHAR(30),                            -- 搭配时的天气
  temperature     INTEGER,                                  -- 搭配时的温度
  layout_data     JSONB,                                    -- 画布布局 {items: [{clothing_id, x, y, scale, rotation}]}
  is_ai_generated BOOLEAN DEFAULT false,
  is_public       BOOLEAN DEFAULT false,
  like_count      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_looks_user ON looks(user_id);
```

#### look_items（Look 与单品的关联）

```sql
CREATE TABLE public.look_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  look_id         UUID NOT NULL REFERENCES looks(id) ON DELETE CASCADE,
  clothing_id     UUID NOT NULL REFERENCES clothing_items(id) ON DELETE CASCADE,
  position_x      FLOAT,                                    -- 在画布中的 x 坐标
  position_y      FLOAT,                                    -- 在画布中的 y 坐标
  scale           FLOAT DEFAULT 1.0,
  rotation        FLOAT DEFAULT 0,
  z_index         INTEGER DEFAULT 0,
  UNIQUE(look_id, clothing_id)
);
```

#### ai_recommendations（AI 推荐记录）

```sql
CREATE TABLE public.ai_recommendations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  look_id         UUID REFERENCES looks(id) ON DELETE SET NULL,
  type            VARCHAR(30),                              -- daily_outfit/complete_look/inspiration
  input_data      JSONB,                                    -- 输入：天气、场景、选中单品ID
  result_data     JSONB,                                    -- AI 返回结果
  model           VARCHAR(50),                              -- 使用的模型
  tokens_used     INTEGER,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## 四、API 设计

### 4.1 认证相关

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册（Supabase 代理） |
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/refresh` | 刷新 token |
| GET | `/api/auth/me` | 获取当前用户信息 |

### 4.2 用户相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/users/me` | 获取个人信息 |
| PATCH | `/api/users/me` | 更新个人信息 |
| GET | `/api/users/me/stats` | 衣柜统计数据 |

### 4.3 衣物管理

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/clothing/upload` | 上传衣物图片（触发 AI 识别） |
| GET | `/api/clothing` | 获取衣物列表（支持分页、分类、颜色、风格筛选） |
| GET | `/api/clothing/{id}` | 获取单品详情 |
| PATCH | `/api/clothing/{id}` | 编辑单品信息 |
| DELETE | `/api/clothing/{id}` | 删除单品 |
| GET | `/api/clothing/{id}/looks` | 该单品出现在哪些 Look 中 |

### 4.4 穿搭 Look

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/looks` | 创建新 Look |
| GET | `/api/looks` | 获取 Look 列表 |
| GET | `/api/looks/{id}` | 获取 Look 详情 |
| PATCH | `/api/looks/{id}` | 更新 Look |
| DELETE | `/api/looks/{id}` | 删除 Look |
| POST | `/api/looks/{id}/like` | 点赞 Look |

### 4.5 AI 能力

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/ai/recognize` | AI 识别衣物属性 |
| POST | `/api/ai/remove-bg` | 抠图 |
| POST | `/api/ai/recommend-daily` | 今日穿搭推荐（基于天气+场景） |
| POST | `/api/ai/complete-look` | 选中一件单品，AI 推荐搭配 |
| POST | `/api/ai/generate-inspiration` | 生成穿搭灵感图 |

### 4.6 通用

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/weather` | 获取用户所在地天气 |
| POST | `/api/upload` | 通用文件上传（返回 URL） |

---

## 五、前端页面与组件树

### 5.1 页面路由

```
/app
├── layout.tsx                    # 根布局（导航栏）
├── page.tsx                      # 首页 - 今日推荐 / 灵感流
├── /wardrobe
│   ├── page.tsx                  # 衣柜列表
│   └── /[id]
│       └── page.tsx              # 单品详情
├── /outfit
│   ├── page.tsx                  # 搭配主页（AI 推荐入口）
│   ├── /create
│   │   └── page.tsx              # 拖拽搭配画布
│   └── /[id]
│       └── page.tsx              # Look 详情
├── /profile
│   ├── page.tsx                  # 我的 - 个人主页
│   ├── /settings
│   │   └── page.tsx              # 设置
│   └── /looks
│       └── page.tsx              # 我的 Looks
└── /auth
    ├── /login
    │   └── page.tsx              # 登录页
    └── /register
        └── page.tsx              # 注册页
```

### 5.2 核心组件

```
components/
├── layout/
│   ├── MobileNav.tsx             # 底部导航栏（首页/衣柜/搭配/我的）
│   ├── TopBar.tsx                # 顶部栏
│   └── PageTransition.tsx        # 页面过渡动画
├── wardrobe/
│   ├── CategoryFilter.tsx        # 品类筛选横条
│   ├── ClothingGrid.tsx          # 衣物瀑布流/网格
│   ├── ClothingCard.tsx          # 单品卡片（非卡片式，大图+轻量标签）
│   ├── ClothingDetail.tsx        # 单品详情弹窗/页
│   └── UploadButton.tsx          # 上传按钮 + 进度
├── outfit/
│   ├── OutfitCanvas.tsx          # 搭配画布（dnd-kit 拖拽区域）
│   ├── DraggableClothing.tsx     # 可拖拽单品
│   ├── ClothingDrawer.tsx        # 衣柜抽屉（拖拽源）
│   ├── OutfitPreview.tsx         # Look 预览卡片
│   ├── BackgroundPicker.tsx      # 背景选择器
│   └── SaveLookModal.tsx         # 保存 Look 弹窗
├── ai/
│   ├── DailyRecommend.tsx        # 今日推荐组件
│   ├── CompleteLook.tsx          # 一键搭配组件
│   ├── InspirationGenerator.tsx  # 灵感生成组件
│   └── AILoading.tsx             # AI 处理中动画
├── profile/
│   ├── UserStats.tsx             # 统计面板
│   └── LookGrid.tsx              # Look 网格展示
└── shared/
    ├── ImageUploader.tsx         # 通用图片上传
    ├── ColorPicker.tsx           # 颜色选择器
    ├── TagInput.tsx              # 标签输入
    └── LoadingSpinner.tsx        # 加载动画
```

---

## 六、开发阶段规划

### Phase 1 — 项目脚手架与环境搭建

**目标：** 两端项目能跑起来，数据库可连接，认证流程走通。

- [ ] 前端：`create-next-app` + TailwindCSS + shadcn/ui 初始化
- [ ] 前端：Zustand store 骨架搭建
- [ ] 前端：底部导航栏 + 4 个主页面占位
- [ ] 后端：FastAPI 项目结构初始化
- [ ] 后端：SQLAlchemy + Alembic 配置，执行初始 migration
- [ ] Supabase：创建项目，配置 Auth（手机号登录）
- [ ] 前端对接 Supabase Auth（登录/注册页）
- [ ] 后端 JWT 中间件（验证 Supabase 签发的 token）

### Phase 2 — 衣柜基础功能

**目标：** 用户能上传衣服、看见自己的衣柜。

- [ ] 前端：衣柜列表页（分类筛选、衣物网格展示）
- [ ] 前端：上传页面（拍照/相册 → 压缩 → 上传）
- [ ] 后端：文件上传 API → Supabase Storage
- [ ] 后端：衣物 CRUD API
- [ ] 后端：异步任务 — AI 识别衣物属性（OpenAI Vision）
- [ ] 后端：异步任务 — 抠图（remove.bg）
- [ ] 前端：上传进度 + AI 识别中状态
- [ ] 前端：单品详情页

### Phase 3 — 搭配画布

**目标：** 核心差异化功能 — 拖拽搭配。

- [ ] 前端：搭配画布页面（dnd-kit 实现）
- [ ] 前端：衣柜抽屉组件（从衣柜拖单品到画布）
- [ ] 前端：画布操作（移动、缩放、旋转、层级、删除）
- [ ] 前端：背景选择器
- [ ] 前端：保存 Look（生成缩略图 + 布局数据）
- [ ] 后端：Look CRUD API

### Phase 4 — AI 智能搭配

**目标：** AI 驱动的搭配推荐。

- [ ] 接入天气 API（获取用户城市实时天气）
- [ ] 前端：今日推荐组件（展示天气 + AI 推荐搭配）
- [ ] 后端：今日推荐 API（根据天气 + 衣柜内容 + 场景生成推荐）
- [ ] 前端：一键搭配组件（选一件 → AI 补全整套）
- [ ] 后端：一键搭配 API
- [ ] 后端：灵感图生成 API（Fal.ai / Replicate）
- [ ] 前端：灵感生成组件

### Phase 5 — 个人中心与社交雏形

**目标：** 完善个人主页，为后续社区功能打基础。

- [ ] 前端：个人主页（头像、数据统计、Looks 展示）
- [ ] 前端：我的 Looks 列表
- [ ] 前端：设置页（个人信息编辑、风格偏好）
- [ ] 前端：穿搭日历/记录视图

### Phase 6 — 打磨与上线

- [ ] 全链路性能优化（图片懒加载、API 缓存）
- [ ] 移动端适配细节打磨
- [ ] 动画补全（Framer Motion 页面过渡、微交互）
- [ ] 错误处理和空状态设计
- [ ] Vercel 部署前端
- [ ] Railway/Render 部署后端
- [ ] 域名 + SSL 配置

---

## 七、关键交互细节

### 7.1 上传→识别→入库 流程

```
用户拍照/选图 → 前端压缩 → 上传到 Supabase Storage
→ 后端收到 webhook / 轮询 → 创建 clothing_item 记录(status=processing)
→ Celery 任务：remove.bg 抠图 → OpenAI Vision 识别属性
→ 更新 clothing_item 记录(status=ready)
→ 前端轮询或 WebSocket 通知刷新
```

### 7.2 拖拽搭配流程

```
进入搭配页 → 底部弹出衣柜抽屉 → 左右滑动浏览单品
→ 长按/拖拽单品到画布 → 松手放置
→ 画布内手势：单指拖动位置、双指缩放旋转
→ 点击单品弹出操作菜单（复制/翻转/删除/置顶）
→ 点保存 → 输入标题/描述/场景 → 生成 Look
```

### 7.3 AI 每日推荐流程

```
首页进入 → 获取用户位置 → 获取实时天气
→ 读用户衣柜数据 + 风格偏好
→ AI 综合天气/温度/场景/衣柜 → 推荐一套完整搭配
→ 展示：效果图 + 单品列表 + 搭配理由
→ 用户可"采用此搭配"一键加入今日 Look
```

---

## 八、非功能性需求

### 8.1 性能

- 图片上传前前端压缩至 ≤ 2MB
- 首页首屏加载 < 3s
- 搭配画布操作帧率 ≥ 30fps
- API 响应时间 P95 < 500ms（不含 AI 接口）

### 8.2 安全

- 所有 API（除登录注册外）需 JWT 认证
- Supabase RLS 策略：用户只能读写自己的数据
- 上传文件类型白名单（仅图片）
- API 速率限制（AI 接口尤其需要）

### 8.3 可维护性

- 前端组件遵循单一职责
- 后端分层：router → service → repository
- 数据库 migration 文件纳入版本管理
- 环境变量统一管理（`.env.example`）

---

## 九、环境变量清单

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=

# Database (Supabase Postgres)
DATABASE_URL=

# OpenAI
OPENAI_API_KEY=

# remove.bg
REMOVEBG_API_KEY=

# Fal.ai / Replicate
FAL_API_KEY=
REPLICATE_API_KEY=

# Weather API (和风天气 / OpenWeather)
WEATHER_API_KEY=

# Redis
REDIS_URL=

# App
NEXT_PUBLIC_API_URL=
```

---

## 十、给 AI 开发助手的指引

1. **每次只实现一个 Phase 中的一个功能点**，不要跨功能同时修改。
2. **先定义数据模型再写 API**，先写 API 再写前端页面。
3. **前端组件优先实现移动端 375px–430px 宽度**，再考虑桌面适配。
4. **不用卡片式布局** — 用大图 + 细线分割 + 充足留白。
5. **所有文案用中文**，包括按钮、提示、错误信息。
6. **颜色方案**：主色调偏暖（玫瑰金/浅粉），背景偏白或浅灰，文字深灰。
7. **每个 Phase 完成后**，写一个简短总结：实现了什么、有哪些文件、如何验证。

---

## 十一、建议补充的产品边界

### 11.1 第一版必须完成

第一版优先验证"用户上传衣物 → 形成数字衣柜 → 生成或手动保存穿搭"这个核心闭环。

- 用户可以注册、登录、退出登录
- 用户可以上传衣物图片
- 系统可以识别衣物基础属性
- 用户可以查看、筛选、编辑、删除衣物
- 用户可以手动拖拽生成一套 Look
- 用户可以保存 Look，并在"我的 Looks"中查看
- AI 可以基于天气、场景和衣柜数据推荐一套搭配

### 11.2 第一版暂不做

这些能力有价值，但会明显增加复杂度，建议放到第二版或后续版本。

- 社区信息流、关注、评论、私信
- 真实人体试穿和人体姿态重建
- 电商导购、购买链接、返佣系统
- 多人共享衣柜
- 品牌自动识别的高准确率承诺
- 复杂的穿搭评分体系
- 桌面端完整设计稿级适配

### 11.3 第一版成功标准

- 新用户 5 分钟内可以完成第一次上传衣物
- 上传后 30 秒内能看到识别结果或明确的处理中状态
- 用户至少能保存一套完整 Look
- AI 推荐能解释为什么这样搭配，而不是只给结果
- 主要流程在移动端 375px–430px 宽度下可顺畅使用

---

## 十二、关键状态与异常处理

### 12.1 衣物处理状态

建议给衣物单品增加明确状态，方便前端展示和排查问题。

| 状态 | 含义 | 前端表现 |
|------|------|----------|
| uploading | 图片上传中 | 展示上传进度 |
| processing | AI 识别或抠图处理中 | 展示处理中占位 |
| ready | 已完成处理 | 正常展示单品 |
| failed | 处理失败 | 展示失败原因和重试入口 |

### 12.2 AI 失败兜底

- AI 识别失败时，允许用户手动填写品类、颜色、季节、风格
- 抠图失败时，保留原图继续入库，不阻断用户使用
- 每日推荐失败时，展示可手动选择场景的一键搭配入口
- 灵感图生成失败时，保留文字版搭配建议
- 对用户展示友好提示，对后台保留具体错误原因

### 12.3 空状态设计

- 衣柜为空：引导用户上传第一件衣物
- Look 为空：引导用户从衣柜中选择单品创建搭配
- AI 推荐无结果：提示衣物数量不足，并建议先上传上衣、下装、鞋子
- 天气不可用：允许用户手动选择温度和天气场景

---

## 十三、隐私、安全与数据合规

### 13.1 用户隐私

衣物照片、穿搭记录和个人资料都属于用户的私人数据，默认不公开。

- 新建 Look 默认 `is_public = false`
- 用户明确选择公开后，才允许进入社区或分享流
- 删除衣物时，需要同步处理图片存储和相关 Look 引用
- 删除账号时，需要清理个人资料、衣物、Look、AI 推荐记录和存储图片

### 13.2 图片安全

- 上传前限制图片类型和大小
- 后端再次校验文件类型，不能只依赖前端
- 图片访问地址需要区分公开图片和私有图片
- 私有衣柜图片不应被未授权用户访问

### 13.3 AI 数据使用说明

- 在用户协议或隐私说明中告知：图片会被发送给第三方 AI 服务用于识别或生成
- 不把用户图片用于训练，除非用户明确授权
- AI 返回结果只作为辅助建议，允许用户修改

---

## 十四、推荐提示词与 AI 输出格式

### 14.1 衣物识别输出字段

AI 识别衣物时，建议输出结构化结果，便于直接入库和人工校正。

```json
{
  "category": "top",
  "sub_category": "shirt",
  "color": "white",
  "color_palette": ["#FFFFFF"],
  "material": "cotton",
  "season": ["spring", "summer"],
  "style_tags": ["minimalist", "commute"],
  "description": "白色棉质衬衫，适合通勤和日常搭配",
  "confidence": 0.86
}
```

### 14.2 每日搭配输出字段

AI 推荐穿搭时，需要返回可解释、可落地的结果。

```json
{
  "title": "清爽通勤搭配",
  "scene": "work",
  "reason": "今天温度较高，选择轻薄上衣和浅色下装，整体更清爽。",
  "items": [
    {
      "clothing_id": "uuid",
      "role": "top",
      "reason": "作为主视觉单品，颜色干净，适合通勤。"
    }
  ],
  "missing_suggestion": "如果有浅色乐福鞋，整体会更完整。"
}
```

---

## 十五、上线前检查清单

### 15.1 功能检查

- 注册、登录、退出登录可正常完成
- 上传单张图片和多张图片都可正常完成
- AI 识别成功、失败、重试状态都有对应展示
- 衣柜筛选、编辑、删除正常
- 拖拽搭配在移动端可操作
- Look 可以保存、查看、删除
- 今日推荐在有天气和无天气时都有可用结果

### 15.2 体验检查

- 375px、390px、430px 移动端宽度下没有文字遮挡或按钮溢出
- 首屏加载时有明确反馈
- 所有空状态都有下一步行动入口
- 所有按钮、提示、错误信息都是中文
- 图片加载失败时有占位图

### 15.3 运营检查

- 准备 20–30 件示例衣物作为演示数据
- 准备 6–10 套示例 Look 用于首页和空状态引导
- 准备隐私说明、用户协议和 AI 使用说明
- 准备测试账号，方便演示完整流程

---

## 十六、后续可扩展方向

- 穿搭日历：记录每天穿了什么，避免重复搭配
- 衣物利用率：统计最常穿、长期未穿、季节切换提醒
- 旅行打包：根据目的地天气和天数推荐行李清单
- 胶囊衣橱：帮助用户用少量单品组成更多搭配
- 社区分享：公开 Look、点赞、收藏、关注用户
- 购物建议：根据衣柜缺口推荐需要补充的单品类型
