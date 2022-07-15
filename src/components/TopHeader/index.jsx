import { MenuFoldOutlined, MenuUnfoldOutlined,UserOutlined  } from "@ant-design/icons";
import { Layout , Dropdown, Menu,Avatar } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import Pubsub from 'pubsub-js'
const { Header } = Layout;
export default function TopHeader(props) {
  const {role:{roleName},username}=JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false);
  function changeCollapsed() {
    setCollapsed(!collapsed);
    Pubsub.publish('collapsed',collapsed)
  }
  
  const menu = (
    // <Menu>
    //   <Menu.Item>超级管理员</Menu.Item>
    //   <Menu.Item danger onClick={()=>{
    //     localStorage.removeItem('token')
    //     navigate('/login')
    //     }}>退出</Menu.Item>
    // </Menu>
    <Menu
    onClick={item=>{
      
      if(item.key==='0'){        
        localStorage.removeItem('token')
        navigate('/login')
      }
    }}
    items={[
      {
        key: '1',
        label: `${roleName}`,
      },
      {
        key: '0',
        danger: true,
        label: '退出',
      },
    ]}
  />
  );
  
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: "0 16px",
      }}
    >
      {collapsed ? (
        <MenuUnfoldOutlined onClick={changeCollapsed}></MenuUnfoldOutlined>
      ) : (
        <MenuFoldOutlined onClick={changeCollapsed}></MenuFoldOutlined>
      )}
      <div style={{ float: "right" }}>
        <span>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar  icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}
