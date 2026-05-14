import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

const root = document.getElementById('root');

try {
  ReactDOM.createRoot(root).render(<App />);
} catch (error) {
  console.error('Application failed to initialize:', error);
  root.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:Inter,system-ui,sans-serif;padding:24px;background:#fafafa">
      <div style="max-width:400px;text-align:center">
        <h1 style="font-size:18px;font-weight:600;color:#171717;margin-bottom:8px">Failed to Load</h1>
        <p style="font-size:14px;color:#737373;margin-bottom:16px">The application could not start. This is usually caused by missing configuration.</p>
        <p style="font-size:12px;color:#a3a3a3;background:#f5f5f5;padding:8px 12px;border-radius:6px;word-break:break-all">${error.message}</p>
        <button onclick="location.reload()" style="margin-top:16px;padding:8px 16px;font-size:14px;font-weight:500;background:#171717;color:#fff;border:none;border-radius:6px;cursor:pointer">
          Retry
        </button>
      </div>
    </div>
  `;
}
