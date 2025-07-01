import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { getAllPosts } from '../services/postService';
import type { Post } from '../types/index';

// 创建 Context
const PostContext = createContext<Post[] | undefined>(undefined);

// Provider 组件
interface PostProviderProps {
  children: ReactNode;
}

export function PostProvider({ children }: PostProviderProps) {
  const posts = getAllPosts();

  return (
    <PostContext.Provider value={posts}>
      {children}
    </PostContext.Provider>
  );
}

// 自定义 Hook 用于使用 Context
export function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
}