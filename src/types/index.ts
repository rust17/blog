// 文章类型定义
export interface Post {
  path: string;
  frontmatter: { [key: string]: any };
  content: string;
}