import matter from 'gray-matter';
import type { Post, TreeNode } from '../types/index';

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

// 将扁平的文章列表转换为树形结构
export function buildDirectoryTree(): TreeNode[] {
  const posts = getAllPosts();
  const tree: TreeNode[] = [];
  const directoryMap = new Map<string, TreeNode>();

  posts.forEach(post => {
    const pathParts = post.path.split('/');

    // 如果是根目录文件（如 introduction.md）
    if (pathParts.length === 1) {
      tree.push({
        name: post.frontmatter.title || pathParts[0],
        path: post.path,
        isDirectory: false
      });
      return;
    }

    // 处理有目录的文件
    let currentPath = '';
    let currentLevel = tree;

    // 遍历路径的每一部分，除了最后的文件名
    for (let i = 0; i < pathParts.length - 1; i++) {
      const dirName = pathParts[i];
      currentPath = currentPath ? `${currentPath}/${dirName}` : dirName;

      // 查找或创建目录节点
      let dirNode = currentLevel.find(node => node.name === dirName && node.isDirectory);

      if (!dirNode) {
        dirNode = {
          name: dirName,
          children: [],
          isDirectory: true
        };
        currentLevel.push(dirNode);
        directoryMap.set(currentPath, dirNode);
      }

      currentLevel = dirNode.children!;
    }

    // 添加文件节点
    const fileName = pathParts[pathParts.length - 1];
    currentLevel.push({
      name: post.frontmatter.title || fileName,
      path: post.path,
      isDirectory: false
    });
  });

  // 对每层进行排序：目录在前，文件在后，同类型按名称排序
  function sortTree(nodes: TreeNode[]): TreeNode[] {
    return nodes
      .sort((a, b) => {
        // 目录在前，文件在后
        if (a.isDirectory !== b.isDirectory) {
          return a.isDirectory ? -1 : 1;
        }
        // 同类型按名称排序
        return a.name.localeCompare(b.name);
      })
      .map(node => ({
        ...node,
        children: node.children ? sortTree(node.children) : undefined
      }));
  }

  const sortedTree = sortTree(tree);
  console.log('Directory tree:', sortedTree);
  return sortedTree;
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
