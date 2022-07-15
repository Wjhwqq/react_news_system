import { Layout ,Spin} from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "../../components/SideMenu";
import TopHeader from "../../components/TopHeader";
import "./index.css";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useEffect } from "react";
import {connect} from'react-redux'
const { Content } = Layout;
function NewsSandBox(props) {

  NProgress.start()
  useEffect(()=>{
    NProgress.done()
  })
  return (
    
      <Layout>
        <SideMenu></SideMenu>
        <Layout className="site-layout" style={{backgroundColor:'#dbdbdb',maxHeight:'100vh'}}>
          <TopHeader></TopHeader>
          <Spin size="large" spinning={props.isLoading}>
            <Content
              className="site-layout-background"
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: 280,
                overflow:'auto',
                maxHeight:'86vh'
              }}
            >
              <Outlet></Outlet>
            </Content>
          </Spin>
        </Layout>
      </Layout>
    
  );
}
const mapStateToProps=({LoadingReducer:{isLoading}})=>({isLoading})
export default connect(mapStateToProps)(NewsSandBox)