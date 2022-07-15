import React from 'react'
import { Card, Col, Row, List,Drawer } from 'antd';
import { PieChartOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import * as echarts from 'echarts'
import { useRef } from 'react';
import _ from 'lodash' 

const { Meta } = Card;
export default function Home() {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [visible, setVisible] = useState(false)
  const [pieChart, setPieChart] = useState(null)
  const [allList, setAllList] = useState([])


  const renderBarView=(obj)=>{
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(barRef.current);
    // echarts相关
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel:{
          rotate:'60'
        }
      },
      yAxis: {
        minInterval:1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item=>item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.onresize=()=>{
      myChart.resize()
    }
  }
  const renderPieView=(allList)=>{
    let currentList=allList.filter(item=>item.author===username)
    let groupObj=_.groupBy(currentList,item=>item.category.title)
    let list=[]
    for(let i in groupObj){
      list.push({name:i,value:groupObj[i].length})
    }
    var myChart
    if(!pieChart){myChart = echarts.init(pieRef.current);setPieChart(myChart)}
    else{myChart=pieChart}
    let option = {
      title: {
        text: `${username}新闻分类图示`,
        subtext: `${roleName}`,
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    myChart.setOption(option);
  }
  const barRef =useRef()
  const pieRef =useRef()
  useEffect(() => {
    axios(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=8`).then(res => {
      setViewList(res.data);
    })
    axios(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=8`).then(res => {
      setStarList(res.data);
    })
  }, [])
  
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  
  useEffect(() => {
    axios(`/news?publishState=2&_expand=category`).then(res => {
      setAllList(res.data)
      renderBarView(_.groupBy(res.data,item=>item.category.title))
    })
    return ()=>{
      window.onresize=null
    }
  }, [])
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true} hoverable>
            <List
              size='small'
              // bordered
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true} hoverable>
            <List
              size='small'
              // bordered
              dataSource={starList}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <PieChartOutlined key="setting" onClick={()=>{setVisible(true);setTimeout(()=>{renderPieView(allList)},0)}
            } />
            ]}
          >
            <Meta
              avatar={<Avatar icon={<UserOutlined></UserOutlined>} />}
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{ paddingLeft: '30px' }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer width={'50%'} title="个人新闻分类" closable={true} placement="right" onClose={()=>{setVisible(false)}} visible={visible}>
        <div ref={pieRef} style={{width:'100%', height: '400px', marginTop: '30px' }}></div>
      </Drawer>
      <div ref={barRef} style={{width:'100%', height: '400px', marginTop: '30px' }}></div>
    </div>
  )
}
