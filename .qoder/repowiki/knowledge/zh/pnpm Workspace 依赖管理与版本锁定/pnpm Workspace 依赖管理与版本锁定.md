---
kind: dependency_management
name: pnpm Workspace 依赖管理与版本锁定
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - pnpm-workspace.yaml
    - package-lock.json
    - permission_apply/package.json
---

该项目采用 **pnpm** 作为核心包管理器，并通过 **pnpm workspace** 机制统一管理根目录与 `permission_apply` 子模块的依赖。以下是具体的依赖管理策略：

### 1. 依赖管理系统
- **包管理器**: 使用 `pnpm`，通过 `pnpm-workspace.yaml` 定义工作区范围（当前包含根目录 `.`）。
- **构建工具**: 统一使用 `Vite` (v6.3.5) 进行开发与构建，配合 `@vitejs/plugin-react` 和 `tailwindcss`。
- **UI 组件库**: 深度集成 `shadcn/ui`（基于 Radix UI primitives）与 `MUI` (Material-UI)，通过精确版本号锁定确保 UI 一致性。

### 2. 关键文件与配置
- **`package.json`**: 根目录与子模块均定义了相同的依赖集合。通过 `peerDependencies` 声明 `react` 和 `react-dom`，并在 `peerDependenciesMeta` 中将其标记为 `optional: true`，以适应不同的宿主环境。
- **`pnpm-workspace.yaml`**: 定义了工作区的物理结构，并限制了支持的架构（Linux x64/arm64, glibc），这通常用于确保部署环境的一致性。
- **`package-lock.json`**: 尽管使用 pnpm，项目中仍保留了 npm 格式的 lockfile（lockfileVersion 3），记录了完整的依赖树解析结果，包括所有子依赖的 `resolved` URL 和 `integrity` 哈希值。
- **`pnpm.overrides`**: 在 `package.json` 中通过 `pnpm.overrides` 强制指定 `vite` 版本为 `6.3.5`，防止子依赖引入不兼容的构建工具版本。

### 3. 架构与约定
- **依赖同步**: 根目录与 `permission_apply` 模块的 `package.json` 内容高度一致，表明项目可能采用“全量依赖”或“模板同步”的策略，而非严格的按需拆分。
- **版本锁定**: 所有生产依赖（dependencies）和开发依赖（devDependencies）均使用精确版本号（如 `"11.14.0"` 而非 `"^11.14.0"`），确保了构建的可重复性。
- **私有/内部依赖**: 目前未发现指向私有 registry 的配置，所有依赖均从公共 npm registry (`registry.npmjs.org`) 获取。

### 4. 开发者规范
- **安装依赖**: 应始终使用 `pnpm install` 而非 `npm install`，以利用 pnpm 的硬链接机制节省磁盘空间并避免幽灵依赖。
- **版本更新**: 由于使用了精确版本锁定，更新依赖时需手动修改 `package.json` 并重新运行 install，或使用 `pnpm update` 配合特定参数。
- **架构限制**: 注意 `pnpm-workspace.yaml` 中对 `supportedArchitectures` 的限制，在 Windows/macOS 本地开发时若遇到二进制包问题，需确认 pnpm 配置是否允许回退或忽略架构检查。