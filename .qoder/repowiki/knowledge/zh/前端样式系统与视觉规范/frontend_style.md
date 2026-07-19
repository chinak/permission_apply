## 1. 核心系统与技术栈
项目采用 **Tailwind CSS v4** 作为核心样式引擎，结合 **shadcn/ui** 组件库模式构建 UI。样式系统基于 CSS 变量（Design Tokens）实现主题化，支持深色模式（Dark Mode）。

- **CSS 框架**: Tailwind CSS 4.x (使用 `@tailwindcss/vite` 插件)。
- **组件库基础**: shadcn/ui (基于 Radix UI 原语 + Tailwind 类名)。
- **动画库**: `tw-animate-css` 提供标准化的过渡与动画效果。
- **工具函数**: `clsx` + `tailwind-merge` (`cn` 函数) 用于动态类名合并，确保样式覆盖的正确性。

## 2. 设计令牌 (Design Tokens)
样式定义集中在 `src/styles/theme.css` 中，通过 CSS 自定义属性映射到 Tailwind 的颜色和半径系统。

- **色彩系统**: 
  - 使用 OKLCH 色彩空间定义高一致性颜色。
  - 核心语义色：`--background`, `--foreground`, `--primary` (#030213), `--destructive` (#d4183d)。
  - 图表色：预定义 `--chart-1` 至 `--chart-5` 用于数据可视化。
- **圆角规范**: 
  - 基础半径 `--radius: 0.625rem`。
  - 衍生半径：`sm` (-4px), `md` (-2px), `lg` (base), `xl` (+4px)。
- **排版**: 
  - 基础字号 `16px`。
  - 标题 (h1-h4) 统一使用 `font-weight: 500` (Medium)，行高 1.5。

## 3. 架构与组织
- **全局入口**: `src/styles/index.css` 聚合了字体、Tailwind 基础层和主题定义。
- **组件样式**: UI 组件（如 `button.tsx`）使用 `class-variance-authority` (cva) 管理变体（Variant）和尺寸（Size），实现样式与逻辑的解耦。
- **深色模式**: 通过 `.dark` 类名切换 CSS 变量值，配合 `next-themes` 进行状态管理。

## 4. 开发规范
1. **类名合并**: 在组件中动态拼接类名时，必须使用 `cn()` 工具函数，以避免 Tailwind 类冲突。
2. **样式扩展**: 优先使用 `theme.css` 中定义的语义化变量（如 `bg-background`），避免硬编码颜色值。
3. **组件变体**: 新增组件样式时，应遵循 shadcn 模式，使用 `cva` 定义变体，保持 API 一致性。
4. **响应式**: 依赖 Tailwind 的断点系统（sm, md, lg, xl）进行布局适配。