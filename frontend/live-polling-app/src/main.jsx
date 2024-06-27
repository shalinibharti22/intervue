import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.jsx';
import './index.css';
import Teacher from './components/Teacher.jsx';
import Student from './components/Student.jsx';

const appRouter = createBrowserRouter([
  {
  path:"/",
  element: <App/>,
  children: [
    {
      path:"/teacher",
      element: <Teacher/>
    },
    {
      path:"/student",
      element: <Student/>
    }
  ]
}
])

ReactDOM.createRoot(document.getElementById('root')).render(
<RouterProvider router={appRouter} />
);
