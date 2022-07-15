import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Button, Table,Tag,notification} from 'antd'
import {useNavigate, Link} from 'react-router-dom'
export default function AuditList() {
  const[dataSource,setDataSource]=useState([])
  const {username}=JSON.parse(localStorage.getItem('token'))
  const navigate =useNavigate()
  useEffect(()=>{
    axios(`/news?author${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res=>{
      setDataSource(res.data)
    })
  },[username])
  // 按钮相关
  const handleRervert=(item)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{auditState:0}).then(res=>{
      notification.info({
        message: `通知`,
        description: `您可以到草稿箱中重新修改您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  const handleUpdate=(item)=>{
    navigate(`/news-manage/update/${item.id}`)
  }
  const handlePublish=(item)=>{
    axios.patch(`/news/${item.id}`, {
      publishState: 2,publishTime:Date.now()
    }).then(res => {
      navigate('/publish-manage/published')
      notification.info({
        message: `通知`,
        description: `您可以到发布管理中的已发布中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
   // 表格相关
   const columns=[
    {
      title: '新闻标题',
      dataIndex: 'title',
      render:(title,item)=>{
        return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render:(category)=>{
        return <div>{category.title}</div>
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render:(auditState)=>{
        const colorList=['','orange','green','red']
        const auditList=['','审核中','已通过','未通过']
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return (
          <div>
            {
              item.auditState===1&&<Button style={{color:'gray'}} onClick={()=>handleRervert(item)}>撤销</Button>
            }
            {
              item.auditState===2&&<Button danger onClick={()=>handlePublish(item)}>发布</Button>
            }
            {
              item.auditState===3&&<Button type='primary' onClick={()=>handleUpdate(item)}>更新</Button>
            }
          </div>
        )
      }
    },
  ]
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} pagination={{pageSize:5}} rowKey={item=>item.id}  />
    </div>
  )
}
