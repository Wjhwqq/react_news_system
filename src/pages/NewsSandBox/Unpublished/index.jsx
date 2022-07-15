import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import NewsPublish from '../../../components/NewsPublish'
import { Button,notification } from 'antd'
export default function Unpublished() {
  const {username}=JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  useEffect(()=>{
    axios(`/news?author=${username}&publishState=1&_expand=category`).then(res=>{
      setDataSource(res.data)
    })
  },[username])
  const handlePublish=(id)=>{
    setDataSource(dataSource.filter(item=>item.id!==id))
    axios.patch(`/news/${id}`, {
      publishState: 2,publishTime:Date.now()
    }).then(res => {
      notification.info({
        message: `通知`,
        description: `您可以到发布管理中的已发布中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button type='primary' onClick={()=>handlePublish(id)}>发布</Button>}></NewsPublish>
    </div>
  )
}
