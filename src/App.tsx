import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { loadPosts } from './services/postService'

function App() {
  const [count, setCount] = useState(0)
  const posts = loadPosts(); // 调用以触发 console.log

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
        <p>找到的文件数量: {posts.count}</p>
        <p>检查浏览器控制台查看详细信息</p>
        <details>
          <summary>文件路径列表 (点击展开)</summary>
          <ul style={{textAlign: 'left', fontSize: '12px'}}>
            {posts.paths.slice(0, 5).map((path, index) => (
              <li key={index}>{path}</li>
            ))}
            {posts.paths.length > 5 && <li>... 还有 {posts.paths.length - 5} 个文件</li>}
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
