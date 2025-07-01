import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getAllPosts } from './services/postService'

function App() {
  const [count, setCount] = useState(0)
  const posts = getAllPosts(); // 调用以触发 console.log

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>我的博客</h1>
      <div className="card">
        <h2>PostService 测试结果:</h2>
        <p>找到的文件数量: {posts.length}</p>
        <p>检查浏览器控制台查看详细信息</p>
        {posts.length > 0 && (
          <div style={{marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
            <h3>第一篇文章解析示例:</h3>
            <p><strong>路径:</strong> {posts[0].path}</p>
            <p><strong>标题:</strong> {posts[0].frontmatter.title || '未设置'}</p>
            <p><strong>日期:</strong> {posts[0].frontmatter.date || '未设置'}</p>
            <p><strong>内容预览:</strong> {posts[0].content.substring(0, 100)}...</p>
          </div>
        )}
        <details>
          <summary>文章列表 (点击展开)</summary>
          <ul style={{textAlign: 'left', fontSize: '12px'}}>
            {posts.slice(0, 3).map((post, index) => (
              <li key={index} style={{marginBottom: '10px'}}>
                <strong>{post.frontmatter.title || post.path}</strong><br/>
                <small>路径: {post.path}</small><br/>
                <small>日期: {post.frontmatter.date || '未设置'}</small><br/>
                <small>内容长度: {post.content.length} 字符</small>
              </li>
            ))}
            {posts.length > 3 && <li>... 还有 {posts.length - 3} 篇文章</li>}
          </ul>
        </details>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
