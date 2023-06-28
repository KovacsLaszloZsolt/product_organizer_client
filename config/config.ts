export default Object.freeze({
  env: process.env.NEXT_PUBLIC_NODE_ENV || 'development',
  isDevelopment: process.env.NEXT_PUBLIC_NODE_ENV === 'development',
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
});
