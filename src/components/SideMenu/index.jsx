import React,{useEffect} from 'react'
import './index.css'
import { useLocation } from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {
  HomeOutlined,AuditOutlined,PushpinOutlined,
  UserOutlined,ClusterOutlined,FileTextOutlined,FileOutlined,FileSearchOutlined,TeamOutlined,BookOutlined,EyeOutlined,
  FundViewOutlined,InsertRowLeftOutlined,FileDoneOutlined,FileSyncOutlined,ExceptionOutlined,TrademarkCircleOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useState } from 'react';
import Pubsub from 'pubsub-js'
const {  Sider} = Layout;
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
// 侧边栏图标
const iconList={
  '/home':<HomeOutlined />,
  '/user-manage':<TeamOutlined />,
  '/user-manage/list':<UserOutlined></UserOutlined>,
  '/right-manage':<TrademarkCircleOutlined />,
  '/right-manage/role/list':<AuditOutlined />,
  '/right-manage/right/list':<ClusterOutlined />,
  '/news-manage':<BookOutlined />,
  '/news-manage/add':<FileTextOutlined />,
  '/news-manage/draft':<FileOutlined />,
  '/news-manage/category':<FileSearchOutlined />,
  '/audit-manage':<EyeOutlined />,
  '/audit-manage/audit':<FundViewOutlined />,
  '/audit-manage/list':<InsertRowLeftOutlined />,
  '/publish-manage':<PushpinOutlined />,
  '/publish-manage/unpublished':<FileSyncOutlined />,
  '/publish-manage/published':<FileDoneOutlined />,
  '/publish-manage/sunset':<ExceptionOutlined />,
}
// 侧边栏
let items = []
export default function SideMenu() {
  const {role:{rights}}=JSON.parse(localStorage.getItem('token'))
  const [isFirst,setIsFirst]=useState(true)
  const [menu,setMenu]=useState([])
  const [collapsed, setcollapsed] = useState(false)
  const navigate=useNavigate()
  const loca=useLocation()
  const mes=Pubsub.subscribe('collapsed',(msg,data)=>{setcollapsed(data)})
  useEffect(()=>{
    Pubsub.unsubscribe(mes)
  },[mes])
  // 接受导航栏数据
  useEffect(()=>{
    items=[]
    axios.get('/rights?_embed=children').then(res=>{
      setMenu(res.data)
    }) 
  },[])
  // 获取items
  // menu.forEach((i)=>{
  // let c=[]
  // if(i.children.length!==0){
  //     i.children.forEach(k=>{if(k.pagepermisson===1&&rights.includes(k.key)) c=[...c,getItem(k.title,k.key,iconList[k.key],k.children,k.type)]})
  //     if(isFirst&i.pagepermisson===1&&rights.includes(i.key)){items=[...items,getItem(i.title,i.key,i.icon,c,i.type)];setIsFirst(false)}
  //   }else{
  //     if(isFirst&i.pagepermisson===1&&rights.includes(i.key)){items=[...items,getItem(i.title,i.key,iconList[i.key])];setIsFirst(false)}
  //   }
  // }) 
  const getItems=()=>{
    menu.forEach((i)=>{
      let c=[]
      if(i.children.length!==0){
          i.children.forEach(k=>{if(k.pagepermisson===1&&rights.includes(k.key)) c=[...c,getItem(k.title,k.key,iconList[k.key],k.children,k.type)]})
          if(isFirst&i.pagepermisson===1&&rights.includes(i.key)){items=[...items,getItem(i.title,i.key,iconList[i.key],c,i.type)];setIsFirst(false)}
        }else{
          if(isFirst&i.pagepermisson===1&&rights.includes(i.key)){items=[...items,getItem(i.title,i.key,iconList[i.key])];setIsFirst(false)}
        }
      }) 
  }
  getItems()
  // willunmount
  // useEffect(()=>{if(loca.pathname==='/login')items=[]})
  return (
    <Sider trigger={null} collapsible  collapsed={collapsed} style={{height:'100vh',width:'100%',overflow:'auto'}}>
        <div style={{display:'flex',height:'100%','flexDirection':'column'}}>
          <div className="logo">全球新闻发布管理系统</div>
          <div style={{flex:1,"overflow":'auto'}}>
            <Menu
              defaultOpenKeys={['/'+loca.pathname.split("/")[1]]}
              theme="dark"
              mode="inline"
              selectedKeys={[loca.pathname]}
              items={items}
              onClick={(item)=>{navigate(item.key)}}
            />
          </div>
        </div>
      </Sider>
  )
}
