// 文章类型定义
export interface Post {
  path: string;
  frontmatter: { [key: string]: any };
  content: string;
}

// 树形目录结构类型定义
export interface TreeNode {
  name: string;
  path?: string; // 文件才有path，目录没有
  children?: TreeNode[];
  isDirectory: boolean;
}