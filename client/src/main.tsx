import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router"
import { store } from './app/store.ts'
import { Provider } from 'react-redux'
import Chat from './pages/Chat.tsx'
import Register from './pages/Register.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
