import matter from 'gray-matter';
import type { Post } from '../types/index';

let allPosts: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (allPosts) {
    return allPosts;
  }

  const modules = import.meta.glob('../posts/**/*.{md,markdown}', { query: '?raw', import: 'default', eager: true });
  const posts: Post[] = Object.entries(modules).map(([filepath, rawContent]) => {
    const { data, content } = matter(rawContent as string);
    // 从 '../posts/2023/my-first-post.md' 提取 '2023/my-first-post'
    const path = filepath.replace('../posts/', '').replace(/\.(md|markdown)$/, '');
    return { path, frontmatter: data, content };
  });

  console.log('Parsed posts:', posts);
  console.log('Number of posts found:', posts.length);

  allPosts = posts;
  return posts;
}

// 保留原来的函数用于向后兼容
export function loadPosts() {
  const posts = getAllPosts();
  return {
    count: posts.length,
    paths: posts.map(p => p.path),
    posts: posts
  };
}