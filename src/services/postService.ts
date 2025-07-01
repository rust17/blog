export function loadPosts() {
  const modules = import.meta.glob('../posts/**/*.{md,markdown}', { query: '?raw', import: 'default', eager: true });
  console.log('Loaded modules:', modules);
  console.log('Number of files found:', Object.keys(modules).length);
  console.log('File paths:', Object.keys(modules));

  // 为了验证，返回一些基本信息
  return {
    count: Object.keys(modules).length,
    paths: Object.keys(modules),
    modules: modules
  };
}