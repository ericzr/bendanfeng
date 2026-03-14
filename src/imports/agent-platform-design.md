# 一、网站整体结构（信息架构）

agent 员工平台网站

---

# 🏠 1️⃣ 首页（Landing Page）

结构建议：

```
1. Hero Section
2. 痛点区
3. 解决方案区
4. Agent员工展示区
5. Agent团队展示区
6. 工作流程演示区
7. 价格区
8. 客户场景区
9. CTA 区
10. Footer
```

---

## 🟢 Hero Section（第一屏）

目标：让用户 5 秒理解

建议结构：

- 主标题
    
- 副标题
    
- 两个按钮（立即部署 / 查看员工库）
    
- 右侧：可视化控制台 UI 模拟图
    

示例文案：

标题：

> 一键部署 AI员工团队  
> 让企业 24 小时自动运转

副标题：

> 标准化Agent员工库，开箱即用。  
> 市场调研、内容运营、销售拓客、数据分析，全自动执行。

按钮：

- 🚀 立即创建我的AI团队
    
- 📦 浏览员工库
    

---

## 🟠 痛点区

三栏卡片：

- 招人贵
    
- 执行慢
    
- 管理复杂
    

设计风格：浅灰背景 + 白色卡片 + 图标

---

## 🔵 解决方案区

展示：

> 用 AI 员工替代重复性工作

流程图展示：

输入 → Agent团队 → 输出结果

可以用线性流程图：

```
输入目标
   ↓
AI市场部
   ↓
自动执行
   ↓
报告 / 内容 / 客户线索
```

---

## 🟣 Agent员工展示区（核心模块）

设计成卡片网格（类似 App Store）

每个卡片包含：

- Agent头像（抽象人物风格）
    
- 名称
    
- 职位
    
- 3个能力标签
    
- 按钮：查看详情
    

示例：

| AI市场调研员 |

- 行业分析
    
- 数据整理
    
- 报告生成
    

按钮：  
[ 立即部署 ]

---

## 🟡 Agent团队展示区

横向模块展示：

AI增长团队  
AI内容团队  
AI销售团队

每个展示：

- 包含哪些员工
    
- 解决什么问题
    
- 一键部署按钮
    

---

## 🔴 工作流演示区

这里是差异化核心。

展示一个“执行面板 UI 模拟图”

左侧：  
任务输入

右侧：  
执行日志滚动

例如：

```
[Step 1] 搜索行业数据 ✓
[Step 2] 抽取关键指标 ✓
[Step 3] 生成报告 ✓
```

视觉风格类似：

- Vercel
    
- Linear
    
- OpenAI 控制台
    

---

## 💰 定价区

三档：

- Starter
    
- Pro
    
- Enterprise
    

视觉风格：  
中间方案突出

---

# 二、核心页面结构（除了首页）

---

# 📦 2️⃣ 员工库页面（Agent Store）

布局建议：

左侧：

- 分类筛选
    
    - 市场
        
    - 内容
        
    - 销售
        
    - 产品
        
    - 数据
        

右侧：

- Agent卡片网格
    

顶部：  
搜索栏

---

# 👤 3️⃣ Agent详情页

结构：

- 左侧：头像 + 简介
    
- 右侧：能力说明
    
- 工作流可视化
    
- 输入示例
    
- 输出示例
    
- 部署按钮
    

可以做一个“模拟对话窗口”

---

# 🧑‍💼 4️⃣ 我的AI团队（Dashboard）

这是未来最重要页面。

结构：

顶部：

- 当前团队名称
    
- 状态（运行中）
    

左侧：

- 员工列表
    

中间：

- 当前执行任务流
    

右侧：

- 输出结果
    

视觉风格：类似 Notion + Linear + OpenAI

---

# 三、整体视觉风格建议

你这个产品定位是：

> 🚀 AI公司操作系统  
> 不是工具网站  
> 不是极客网站

建议风格：

## 🎨 视觉方向

关键词：

- 极简
    
- 科技感
    
- 高端
    
- SaaS企业级
    
- 深色模式优先
    

---

## 🎨 颜色方案

主色建议：

方案1（科技感强）：

- 主色：Electric Blue (#4F46E5)
    
- 辅助色：紫色渐变
    
- 背景：深灰黑
    

方案2（企业稳重）：

- 深蓝 + 白色
    
- 线性渐变背景
    

---

## 🎨 字体建议

- Inter
    
- SF Pro
    
- 思源黑体（中文）
    

---

# 四、给AI生成网页用的提示词（重点）

如果你用：

- Midjourney
    
- v0
    
- Framer AI
    
- Figma AI
    
- Webflow AI
    

下面是可以直接使用的提示词：

---

# 🌐 首页设计提示词（英文版，效果更好）

```
Design a modern SaaS landing page for an AI Agent marketplace platform.

Style:
- Minimalist
- Dark mode
- Futuristic but enterprise-friendly
- Inspired by Linear, Vercel, OpenAI, Stripe

Hero section:
- Big bold headline
- Subheadline explaining AI employee teams
- Two CTA buttons
- Right side: dashboard UI mockup showing AI workflow execution logs

Sections:
- Problem section with 3 feature cards
- AI Agent marketplace grid layout
- AI Team bundles section
- Workflow execution demo UI
- Pricing table with 3 tiers
- Enterprise CTA section

Design details:
- Soft shadows
- Rounded corners
- Subtle gradients
- Clean grid layout
- Large typography
- Elegant spacing
- High-end SaaS feeling

Color scheme:
- Deep navy background
- Electric blue accent
- Subtle purple gradient highlights

Make it look like a billion-dollar startup website.
```

---

# 🧩 Dashboard设计提示词

```
Design a modern AI operations dashboard interface.

Layout:
- Left sidebar navigation (Agents, Teams, Tasks, Logs, Settings)
- Main panel showing running AI workflow steps
- Real-time execution logs
- Output preview panel
- Clean card-based UI

Style:
- Dark mode
- Minimal
- Inspired by Linear, Notion, OpenAI dashboard
- Smooth rounded corners
- Elegant typography
- Subtle glassmorphism
```

---

# 🧑‍💼 Agent卡片设计提示词

```
Design a clean AI employee card UI component.

Include:
- Abstract AI avatar
- Agent name
- Role title
- 3 skill tags
- Deploy button

Style:
- SaaS marketplace style
- Minimal
- Slight shadow
- Rounded card
- Modern enterprise look
```

---

# 五、如果你想做得更高级

你可以加入：

- 动态粒子背景
    
- 模拟“AI正在运行”的动画
    
- Hover时卡片发光效果
    
- 工作流线条流动动画
    

会显得非常“智能体平台”

---

# 六、一个重要提醒

不要把它做成：

❌ ChatGPT皮肤  
❌ 自动化工具平台  
❌ 技术极客网站

你要传达的是：

> 🔥 这是一个可以替代一个部门的AI员工系统

视觉要有“组织感”和“企业感”。
