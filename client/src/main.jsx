import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider,Navigate} from 'react-router-dom'
import RootLayout from './components/RootLayout.jsx'
import Home from './components/common/Home.jsx'
import Signin from './components/common/Signin.jsx'
import Signup from './components/common/Signup.jsx'
import UserProfile from './components/user/UserProfile.jsx'
import Articles from './components/common/Articles.jsx'
import ArticleByID from './components/common/ArticleByID.jsx'
import AuthorProfile from './components/author/AuthorProfile.jsx'
import PostArticle from './components/author/PostArticle.jsx'
import 'bootstrap/dist/css/bootstrap.css'
import UserAuthorContext from './contexts/UserAuthorContext.jsx'


const browserRouterObject=createBrowserRouter([
  {
    path:"/",
    element:<RootLayout/>,
    children:[{
        path:"",
        element:<Home/>
      },
      {
        path:"/signin",
        element:<Signin/>
      },
      {
        path:"/signup",
        element:<Signup/>
      },
      {
        path:'/user-profile/:email',
        element:<UserProfile/>,
        children:[
          {
            path:"articles",
            element:<Articles/>
          },
          {
            path:":articledID",
            element:<ArticleByID/>
          },
          {
            path: "",
            element: <Navigate to="articles" />
          }
        ]
      },
      {
        path:'/author-profile/:email',
        element:<AuthorProfile/>,
        children:[
          {
            path:"articles",
            element:<Articles/>
          },
          {
            path:":articledID",
            element:<ArticleByID/>
          },
          {
            path: 'article',
            element: <PostArticle />
          },
          {
            path: "",
            element: <Navigate to="articles" />
          }
        ]
      }
  ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserAuthorContext>
      <RouterProvider router={browserRouterObject}>
      </RouterProvider>
      </UserAuthorContext>
  </StrictMode>,
)
