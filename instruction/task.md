### **博客系统构建逐步计划**

本计划将引导你从零开始，基于已定义的架构，一步一步构建出完整的博客系统。请严格按照顺序执行每个任务。

#### **阶段一：项目初始化与环境配置**

此阶段的目标是建立一个可以正常运行的、配置好技术栈的空项目。

* [x] **任务 1.1: 初始化 Vite + React + TS 项目**
    *   **起点**: 空文件夹。
    *   **操作**:
        1.  在终端运行 `npm create vite@latest your-blog-name -- --template react-ts`。
        2.  进入项目目录: `cd your-blog-name`。
        3.  安装依赖: `npm install`。
    *   **终点/测试**: 运行 `npm run dev`，在浏览器中能看到 Vite 和 React 的默认欢迎页面。

* [x] **任务 1.2: 安装核心依赖项**
    *   **起点**: 任务 1.1 完成后的项目。
    *   **操作**: 运行以下命令安装所有必要的库：
        ```bash
        npm install react-router-dom gray-matter react-markdown remark-gfm
        npm install -D @types/react-router-dom
        ```
    *   **终点/测试**: 打开 `package.json` 文件，确认 `dependencies` 和 `devDependencies` 中包含了上述所有库。

* [x] **任务 1.3: 配置 Tailwind CSS**
    *   **起点**: 任务 1.2 完成后的项目。
    *   **操作**:
        1.  安装 Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer`。
        2.  生成配置文件: `npx tailwindcss init -p`。
        3.  配置 `tailwind.config.js`，指定内容源：
            ```javascript
            /** @type {import('tailwindcss').Config} */
            export default {
              content: [
                "./index.html",
                "./src/**/*.{js,ts,jsx,tsx}",
              ],
              theme: {
                extend: {},
              },
              plugins: [],
            }
            ```
        4.  在 `src/index.css` (或新建的 `src/styles/global.css`) 文件顶部添加 Tailwind 指令：
            ```css
            @tailwind base;
            @tailwind components;
            @tailwind utilities;
            ```
        5.  在 `src/main.tsx` 中导入该 CSS 文件: `import './index.css';`。
    *   **终点/测试**: 打开 `src/App.tsx`，给主 `div` 添加一个 Tailwind 类，如 `className="bg-red-500 h-screen"`。运行 `npm run dev`，你应该看到一个红色的全屏页面。测试通过后移除该测试类。

* [x] **任务 1.4: 创建项目目录结构**
    *   **起点**: 任务 1.3 完成后的项目。
    *   **操作**: 在 `src` 目录下，创建以下文件夹：
        - `assets`
        - `components`
        - `contexts`
        - `hooks`
        - `pages`
        - `posts`
        - `services`
        - `styles`
        - `types`
    *   **终点/测试**: 在文件浏览器中检查 `src` 目录，确认所有子目录都已正确创建。

#### **阶段二：核心数据管道构建**

此阶段的目标是实现从 Markdown 文件到结构化 JavaScript 数据的转换。这是系统的核心。

* [x] **任务 2.1: 查看示例 Markdown 内容**
    *   **起点**: 任务 1.4 完成后的项目。
    *   **操作**:
        1.  在 `src/posts/` 目录下查看文件 `introduction.md`，内容如下：
            ```markdown
            ---
            title: '关于我'
            date: '2024-01-01'
            ---
            这是个人介绍页面。
            ```
        2.  在 `src/posts/` 目录下查看文件夹 `2023`。
        3.  在 `src/posts/2023/` 目录下查看文件 `2023-07-22-use-sangfor-in-virtual-machine.markdown`，内容如下：
            ```markdown
            ---
            title: '我的第一篇文章'
            date: '2023-05-20'
            ---
            # 你好，世界！
            这是正文。
            ```
    *   **终点/测试**: 检查文件系统，确认这几个文件和文件夹已按要求查看。

* [x] **任务 2.2: 实现基础 `postService`**
    *   **起点**: 任务 2.1 完成后的项目。
    *   **操作**:
        1.  在 `src/services/postService.ts` 中，编写一个函数，使用 Vite 的 `import.meta.glob` 来导入所有 Markdown 文件。
        2.  暂时只打印结果到控制台，以验证导入是否成功。
            ```typescript
            // src/services/postService.ts
            export function loadPosts() {
              const modules = import.meta.glob('../posts/**/*.md', { as: 'raw', eager: true });
              console.log(modules);
              // 暂时返回一个空数组
              return [];
            }
            ```
        3.  在 `src/App.tsx` 中调用此函数：
            ```typescript
            // src/App.tsx
            import { loadPosts } from './services/postService';

            function App() {
              loadPosts(); // 调用以触发 console.log
              return <div>我的博客</div>;
            }

            export default App;
            ```
    *   **终点/测试**: 运行 `npm run dev`，打开浏览器的开发者工具，在控制台中看到一个对象，其键为 Markdown 文件的路径（如 `/src/posts/introduction.md`），值为文件的原始字符串内容。

* [x] **任务 2.3: 解析 Markdown 元数据和内容**
    *   **起点**: 任务 2.2 完成后的项目。
    *   **操作**:
        1.  修改 `src/services/postService.ts`。
        2.  导入 `gray-matter`。
        3.  在 `loadPosts` 函数中，遍历 `modules` 对象，对每个文件的内容使用 `matter()` 进行解析。
        4.  为每个文件创建一个包含 `path`, `frontmatter`, `content` 的对象。
        5.  让函数返回这个对象数组。
            ```typescript
            // src/services/postService.ts
            import matter from 'gray-matter';

            // 定义文章类型 (可以在 src/types/index.ts 中定义)
            export interface Post {
              path: string;
              frontmatter: { [key: string]: any };
              content: string;
            }

            let allPosts: Post[] | null = null;

            export function getAllPosts(): Post[] {
              if (allPosts) {
                return allPosts;
              }

              const modules = import.meta.glob('../posts/**/*.md', { as: 'raw', eager: true });
              const posts: Post[] = Object.entries(modules).map(([filepath, rawContent]) => {
                const { data, content } = matter(rawContent);
                // 从 '/src/posts/2023/2023-07-22-use-sangfor-in-virtual-machine.md' 提取 '2023/2023-07-22-use-sangfor-in-virtual-machine'
                const path = filepath.replace('../posts/', '').replace('.md', '');
                return { path, frontmatter: data, content };
              });

              allPosts = posts;
              return posts;
            }
            ```
    *   **终点/测试**: 在 `src/App.tsx` 中调用 `getAllPosts()` 并 `console.log` 其返回值。在浏览器控制台中，你应该能看到一个包含两个对象的数组，每个对象都有 `path`, `frontmatter`, 和 `content` 属性。

#### **阶段三：基础页面与路由渲染**

此阶段的目标是能够在浏览器中通过 URL 访问并显示一篇具体的文章内容。

* [x] **任务 3.1: 设置基础路由**
    *   **起点**: 任务 2.3 完成后的项目。
    *   **操作**:
        1.  在 `src/main.tsx` 中用 `<BrowserRouter>` 包裹 `<App />`。
        2.  创建 `src/pages/HomePage.tsx` 和 `src/pages/PostPage.tsx` 两个占位组件。
        3.  在 `src/App.tsx` 中，使用 `Routes` 和 `Route` 设置路由：
            ```typescript
            // src/App.tsx
            import { Routes, Route } from 'react-router-dom';
            import HomePage from './pages/HomePage';
            import PostPage from './pages/PostPage';

            function App() {
              return (
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="*" element={<PostPage />} />
                </Routes>
              );
            }
            ```
    *   **终点/测试**: 访问 `http://localhost:5173/` 应显示 `HomePage` 的内容。访问 `http://localhost:5173/some/other/path` 应显示 `PostPage` 的内容。

* [x] **任务 3.2: 创建并使用 `PostContext`**
    *   **起点**: 任务 3.1 完成后的项目。
    *   **操作**:
        1.  创建 `src/contexts/PostContext.tsx`。它应在内部调用 `getAllPosts` 并将结果通过 Context Provider 提供出去。
        2.  在 `src/App.tsx` 的 `<Routes>` 外层包裹 `<PostProvider>`。
        3.  在 `src/pages/PostPage.tsx` 中，使用 `useContext` 获取文章数据并 `console.log` 出来。
    *   **终点/测试**: 访问任意文章页面（如 `/2023/2023-07-22-use-sangfor-in-virtual-machine`），在浏览器控制台应看到完整的文章数组，证明 Context 工作正常。

* [x] **任务 3.3: 根据 URL 显示文章内容**
    *   **起点**: 任务 3.2 完成后的项目。
    *   **操作**:
        1.  修改 `src/pages/PostPage.tsx`。
        2.  使用 `useLocation` from `react-router-dom` 来获取当前路径 (`location.pathname`)。
        3.  从 `PostContext` 获取的文章列表中，根据 `pathname` 查找对应的文章。注意 `pathname` 可能以 `/` 开头，需要处理一下。
        4.  将找到的文章的原始 Markdown 内容显示在一个 `<pre>` 标签内。
    *   **终点/测试**: 访问 `/2023/2023-07-22-use-sangfor-in-virtual-machine`，页面应显示该 `md` 文件的原始文本内容。访问 `/introduction`，页面应显示介绍页的原始文本。

* [x] **任务 3.4: 渲染 Markdown 为 HTML**
    *   **起点**: 任务 3.3 完成后的项目。
    *   **操作**:
        1.  创建 `src/components/MarkdownRenderer.tsx` 组件。
        2.  该组件接收一个 `content` 字符串 prop，并使用 `react-markdown` 和 `remark-gfm` 将其渲染。
        3.  在 `src/pages/PostPage.tsx` 中，用 `<MarkdownRenderer>` 替换 `<pre>` 标签。
    *   **终点/测试**: 访问 `/2023/2023-07-22-use-sangfor-in-virtual-machine`，页面应显示格式化后的 HTML（例如，一个 H1 标题和一段文字），而不是原始的 `# 你好，世界！`。

#### **阶段四：布局与侧边栏实现**

此阶段的目标是搭建应用的整体布局，并实现核心的、可交互的文章目录侧边栏。

* [x] **任务 4.1: 创建 `Layout` 组件**
    *   **起点**: 任务 3.4 完成后的项目。
    *   **操作**:
        1.  创建 `src/components/Layout.tsx`。
        2.  `Layout` 包含一个 `div` 作为侧边栏容器，和另一个 `div` 作为主内容容器。主内容容器中应渲染 `<Outlet />` from `react-router-dom`。
        3.  使用 Flexbox 或 Grid 布局让它们并排显示。
        4.  修改 `src/App.tsx`，将所有路由包裹在一个父 `Route` 中，该 `Route` 的 `element` 是 `<Layout />`。
    *   **终点/测试**: 页面现在应该分为左右两部分，右侧显示文章内容，左侧暂时为空白。

* [x] **任务 4.2: 创建静态侧边栏 (`Sidebar`)**
    *   **起点**: 任务 4.1 完成后的项目。
    *   **操作**:
        1.  创建 `src/components/Sidebar.tsx`。
        2.  在 `Sidebar` 中，从 `PostContext` 获取文章列表。
        3.  将文章列表渲染成一个简单的 `<ul>` 列表，每一项都是一个指向文章路径的 `<Link>`。
        4.  在 `Layout.tsx` 的侧边栏容器中，渲染 `<Sidebar />` 组件。
    *   **终点/测试**: 左侧边栏现在应显示一个可点击的文章标题列表。点击链接可以正确地在右侧切换文章内容。

* [ ] **任务 4.3: 实现侧边栏高亮当前文章**
    *   **起点**: 任务 4.2 完成后的项目。
    *   **操作**:
        1.  在 `Sidebar.tsx` 的列表项组件中，使用 `useLocation`。
        2.  比较当前 `location.pathname` 和链接的 `to` 属性。
        3.  如果它们匹配，给该链接添加一个高亮 Tailwind 类（例如 `font-bold` 或 `bg-slate-200`）。
    *   **终点/测试**: 当你点击侧边栏中的链接时，被点击的链接应该保持高亮状态。

* [ ] **任务 4.4: 生成并渲染树形目录结构**
    *   **起点**: 任务 4.3 完成后的项目。
    *   **操作**:
        1.  **数据处理**: 在 `postService.ts` 中，创建一个新函数，将扁平的文章列表转换为你要求的树形结构（一个包含 `name` 和 `children` 的对象数组）。
        2.  **组件渲染**: 修改 `Sidebar.tsx`，使用新的树形数据。编写一个递归的 `DirectoryItem` 组件来渲染目录和文件。目录可以点击，文件是链接。
    *   **终点/测试**: 侧边栏现在应该显示为 `introduction`, `projects/`, `2023/` 这样的层级结构，而不是一个扁平列表。

* [ ] **任务 4.5: 实现目录展开/收起**
    *   **起点**: 任务 4.4 完成后的项目。
    *   **操作**:
        1.  在 `Sidebar.tsx` 中使用 `useState` 来维护一个已展开目录的列表（例如 `expandedDirs: string[]`）。
        2.  给目录项添加 `onClick` 事件，点击时更新 `expandedDirs` 状态（添加或移除该目录路径）。
        3.  在渲染时，只有当目录在 `expandedDirs` 列表中时，才渲染其子项。
        4.  **默认展开**: 使用 `useLocation`，确保当前页面所在的目录默认是展开的。
    *   **终点/测试**: 点击侧边栏中的文件夹（如 `2023/`）可以展开或收起其下的文章列表。刷新页面或直接访问文章 URL 时，其所在目录应自动展开。

#### **阶段五：高级交互与功能完善**

此阶段的目标是加入主题切换、侧边栏拖动等提升用户体验的功能。

* [ ] **任务 5.1: 实现主题切换 (Context)**
    *   **起点**: 任务 4.5 完成后的项目。
    *   **操作**:
        1.  创建 `src/contexts/ThemeContext.tsx`，管理主题状态 (`'light'` 或 `'dark'`) 和一个切换函数。从 `localStorage` 读取初始主题，以实现持久化。
        2.  在 `App.tsx` 的最外层用 `ThemeProvider` 包裹。
        3.  在 `tailwind.config.js` 中启用暗黑模式：`darkMode: 'class'`。
        4.  在 `ThemeProvider` 中，使用 `useEffect` 监听主题变化，并相应地在 `<html>` 元素上添加或移除 `dark` 类。
    *   **终点/测试**: 此任务本身不可见。但为下一步做好了准备。

* [ ] **任务 5.2: 创建主题切换按钮 (`ThemeToggle`)**
    *   **起点**: 任务 5.1 完成后的项目。
    *   **操作**:
        1.  创建 `src/components/ThemeToggle.tsx` 组件。
        2.  该组件从 `ThemeContext` 获取当前主题和切换函数。
        3.  渲染一个按钮，点击时调用切换函数。
        4.  在 `Layout.tsx` 的某个位置（例如右上角）放置此按钮。
        5.  添加一些基础的 `dark:` 样式，例如 `dark:bg-slate-900 dark:text-white` 到你的布局和页面上。
    *   **终点/测试**: 点击主题切换按钮，页面的背景色和文字颜色应在浅色和深色模式之间切换。刷新页面应保持所选主题。

* [ ] **任务 5.3: 实现侧边栏宽度拖拽调整**
    *   **起点**: 任务 5.2 完成后的项目。
    *   **操作**:
        1.  在 `Layout.tsx` 中用 `useState` 管理侧边栏宽度。
        2.  在侧边栏和主内容区之间添加一个可拖拽的 `div` (Handle)。
        3.  为 Handle 添加 `onMouseDown` 事件。在 `mousedown` 时，给 `window` 添加 `mousemove` 和 `mouseup` 事件监听器。
        4.  在 `mousemove` 事件中，根据鼠标位置计算并更新侧边栏宽度 state。
        5.  在 `mouseup` 事件中，移除 `mousemove` 和 `mouseup` 监听器。
    *   **终点/测试**: 鼠标可以拖动侧边栏和主内容区之间的分割线，从而调整侧边栏的宽度。

#### **阶段六：样式美化与部署**

此阶段的目标是进行最终的样式调整，并配置自动化部署流程。

* [ ] **任务 6.1: 美化 Markdown 内容样式**
    *   **起点**: 任务 5.3 完成后的项目。
    *   **操作**:
        1.  安装 Tailwind 的排版插件: `npm install -D @tailwindcss/typography`。
        2.  在 `tailwind.config.js` 的 `plugins` 数组中添加 `require('@tailwindcss/typography')`。
        3.  给渲染 Markdown 的容器（可能在 `PostPage.tsx` 中）添加 `prose` 和 `dark:prose-invert` 类。
    *   **终点/测试**: 文章详情页中的标题、段落、列表、代码块等元素现在应该有了优雅、易读的默认样式，并且能适应暗黑模式。

* [ ] **任务 6.2: 配置 GitHub Pages 部署**
    *   **起点**: 任务 6.1 完成后的项目。
    *   **操作**:
        1.  在 `vite.config.ts` 中，设置 `base` 属性为你的仓库名称，例如 `base: '/your-repo-name/'`。
        2.  在 `package.json` 的 `scripts` 中添加一个 `deploy` 命令。
    *   **终点/测试**: 运行 `npm run build`，检查 `dist/index.html`，确认所有资源（JS/CSS）的引用路径都以你的仓库名作为前缀（例如 `./your-repo-name/assets/...`）。

* [ ] **任务 6.3: 创建 GitHub Actions 自动化部署工作流**
    *   **起点**: 任务 6.2 完成后的项目。
    *   **操作**:
        1.  在项目根目录创建 `.github/workflows/deploy.yml`。
        2.  使用社区提供的 `actions/checkout`, `actions/setup-node` 和 `peaceiris/actions-gh-pages` 等 Actions 编写工作流。
        3.  工作流应在 `push` 到 `main` 分支时触发，执行 `npm install`, `npm run build`，然后将 `dist` 目录的内容推送到 `gh-pages` 分支。
        4.  在你的 GitHub 仓库设置中，将 Pages 的源设置为 `gh-pages` 分支。
    *   **终点/测试**: 将所有代码推送到 GitHub 的 `main` 分支。在仓库的 "Actions" 标签页中观察工作流是否成功运行。几分钟后，你的博客应该可以通过 `https://<your-username>.github.io/<your-repo-name>/` 访问。