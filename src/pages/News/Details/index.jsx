import React, { useState } from 'react'
import {Descriptions, PageHeader } from 'antd';
import { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import moment from 'moment'
import {  HeartTwoTone} from '@ant-design/icons';
export default function Details(props) {
  const [newsInfo, setNewsInfo] = useState(null)
  const location=useLocation()
  useEffect(()=>{
    const newsNum=location.pathname.split('/')[location.pathname.split('/').length-1]
    axios.get(`/news/${newsNum}?_expand=category&_expand=role`).then(res=>{
      setNewsInfo({...res.data,
        view:res.data.view+1
      })
      return res.data
    }).then(res=>{
      axios.patch(`/news/${newsNum}?_expand=category&_expand=role`,{view:res.view+1})
    })
  },[location.pathname])
  const handleStar=()=>{
    setNewsInfo({
      ...newsInfo,
      star:newsInfo.star+1
    })
    const newsNum=location.pathname.split('/')[location.pathname.split('/').length-1]
    axios.patch(`/news/${newsNum}?_expand=category&_expand=role`,{star:newsInfo.star+1})
  }
  return (
    <div>
      {newsInfo&&<div>
      <PageHeader
        onBack={() => window.history.back()}
        title={newsInfo.title}
        subTitle={<div>{newsInfo.category.title}<HeartTwoTone onClick={()=>handleStar()} twoToneColor="#eb2f96" /></div>}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
          <Descriptions.Item label="发布时间">{newsInfo.publishTime?moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss'):'-'}</Descriptions.Item>
          <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
          <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
          <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
          <Descriptions.Item label="评论数量">0</Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div dangerouslySetInnerHTML={{
        __html:newsInfo.content
      }} style={{border:'1px solid gray',margin:'0 24px'}}>
      </div>
      </div>}
    </div>
  )
}
