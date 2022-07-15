import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import NewsPublish from '../../../components/NewsPublish'
import { Button,notification } from 'antd'
export default function Published() {
  const {username}=JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  useEffect(()=>{
    axios(`/news?author=${username}&publishState=2&_expand=category`).then(res=>{
      setDataSource(res.data)
    })
  },[username])
  const handleSunset=(id)=>{
    setDataSource(dataSource.filter(item=>item.id!==id))
    axios.patch(`/news/${id}`, {
      publishState: 3
    }).then(res => {
      notification.info({
        message: `通知`,
        description: `您可以到发布管理中的已下线中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button onClick={()=>handleSunset(id)} type='primary' style={{backgroundColor:'orange',border:0}}>下线</Button>}></NewsPublish>
    </div>
  )
}
