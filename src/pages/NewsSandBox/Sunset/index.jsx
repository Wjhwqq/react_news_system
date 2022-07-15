import { Button ,notification} from 'antd'
import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import NewsPublish from '../../../components/NewsPublish'
export default function Sunset() {
  const {username}=JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  useEffect(()=>{
    axios(`/news?author=${username}&publishState=3&_expand=category`).then(res=>{
      setDataSource(res.data)
    })
  },[username])
  const handleDelete=(id)=>{
    setDataSource(dataSource.filter(item=>item.id!==id))
    axios.delete(`/news/${id}`).then(res => {
      notification.info({
        message: `通知`,
        description: `您已经删除了已下线的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button onClick={()=>handleDelete(id)} danger type='primary'>删除</Button>}></NewsPublish>
    </div>
  )
}
