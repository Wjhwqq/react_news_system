import { Navigate } from "react-router-dom"
import Login from '../pages/Login'
import NewsSandBox from "../pages/NewsSandBox"
import Home from '../pages/NewsSandBox/Home'
import RightManager from "../pages/NewsSandBox/RightManager"
import UserManager from '../pages/NewsSandBox/UserManager'
import NoPermission from "../pages/NewsSandBox/NoPermission"
import RightList from '../pages/NewsSandBox/RightManager/RightList'
import RoleList from '../pages/NewsSandBox/RightManager/RoleList'
import Audit from '../pages/NewsSandBox/Audit'
import AuditList from '../pages/NewsSandBox/AuditList'
import NewsAdd from '../pages/NewsSandBox/NewsAdd'
import NewsCategory from '../pages/NewsSandBox/NewsCategory'
import NewsDraft from '../pages/NewsSandBox/NewsDraft'
import Published from '../pages/NewsSandBox/Published'
import Sunset from '../pages/NewsSandBox/Sunset'
import Unpublished from '../pages/NewsSandBox/Unpublished'
import NewsPreview from "../pages/NewsSandBox/NewsPreview"
import NewsUpdate from "../pages/NewsSandBox/NewsUpdate"
import News from "../pages/News"
import Details from "../pages/News/Details"
const routes=[
  {
    path:'/login',
    element:<Login></Login>
  },
  {
    path:'/news',
    element:<News></News>
  },
  {
    path:'/detail/:id',
    element:<Details></Details>
  },
  {
    path:'/',
    element:localStorage.getItem('token')?<NewsSandBox></NewsSandBox>:<Login></Login>,
    children:[
      {
        path:'home',
        element:<Home></Home>
      },
      {
        path:'right-manage',
        element:<RightManager></RightManager>,
        children:[
          {
            path:'right/list',
            element:<RightList></RightList>
          },
          {
            path:'role/list',
            element:<RoleList></RoleList>
          }
        ]
      },
      {
        path:'user-manage/list',
        element:<UserManager></UserManager>
      },
      {
        path:'news-manage/add',
        element:<NewsAdd></NewsAdd>
      },
      {
        path:'news-manage/draft',
        element:<NewsDraft></NewsDraft>
      },
      //
      {
        path:'news-manage/category',
        element:<NewsCategory></NewsCategory>
      },
      {
        path:'news-manage/preview/:id',
        element:<NewsPreview></NewsPreview>
      },
      {
        path:'news-manage/update/:id',
        element:<NewsUpdate></NewsUpdate>
      },
      {
        path:'audit-manage/audit',
        element:<Audit></Audit>
      },
      {
        path:'audit-manage/list',
        element:<AuditList></AuditList>
      },
      {
        path:'publish-manage/unpublished',
        element:<Unpublished></Unpublished>
      },
      {
        path:'publish-manage/published',
        element:<Published></Published>
      },
      {
        path:'publish-manage/sunset',
        element:<Sunset></Sunset>
      },
      //
      {
        path:'',
        element:<Navigate to={'home'}></Navigate>
      },
      {
        path:'*',
        element:<NoPermission></NoPermission>
      }
    ]
  },
  {
    path:'/*',
    element:<Navigate to={localStorage.getItem('token')?'/':'/login'}></Navigate>
  }
]
export default routes