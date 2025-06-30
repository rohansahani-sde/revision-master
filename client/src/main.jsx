import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import CodeEditor from './components/CodeEditor.jsx'
import CrudComponent from './components/CrudComponent.jsx'
import Lesson from './components/Lesson.jsx'
import DemoLesson from './components/DemoLesson.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
      <App />
      {/* <CrudComponent /> */}
      {/* <CodeEditor /> */}
      {/* <Lesson /> */}
      {/* <DemoLesson /> */}
    </BrowserRouter>
  </StrictMode>,
)
