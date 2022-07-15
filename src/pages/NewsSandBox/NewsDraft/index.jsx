import React from 'react'
import { Table,Button,Modal,notification} from 'antd'
import { useState ,useEffect} from 'react'
import axios from 'axios'
import {EditOutlined,ExclamationCircleOutlined,DeleteOutlined,UploadOutlined} from '@ant-design/icons'
import { useNavigate ,Link} from 'react-router-dom'
const {confirm}=Modal
export default function NewsDraft() {
  const {username}=JSON.parse(localStorage.getItem('token'))
  const navigate= useNavigate()
  const [dataSource,setDataSource] =useState([])
  // 表格相关
  const columns=[
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render:(title,item)=>{
        return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render:(category)=>{
        return category.title
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return (
          <div>
            <Button onClick={()=>deleteNews(item)} danger  shape='circle' icon={<DeleteOutlined />}></Button>
            <Button  onClick={()=>{navigate(`/news-manage/update/${item.id}`)}} shape='circle'   icon={<EditOutlined></EditOutlined>} ></Button>
            <Button onClick={()=>{handleCheck(item.id)}} type='primary' shape='circle'    icon={<UploadOutlined />} ></Button>
            
          </div>
        )
      }
    },
  ]

  useEffect(()=>{
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res=>{
      setDataSource(res.data)
    })
  },[username])
    // 点击删除按钮回调
    const deleteNews=(item)=>{
      confirm({
        title: '你确定要删除吗？',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          deleteNewsOk(item)
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
    // 删除按钮确定回调
    const deleteNewsOk=(item)=>{
        setDataSource(dataSource.filter((data)=>{return data.id!==item.id}))
        axios.delete(`/news/${item.id}`)
      
    }
    const handleCheck=(id)=>{
      axios.patch(`/news/${id}`,{
        auditState:1
      }).then(res => {
        navigate('/audit-manage/list')
        notification.info({
          message: `通知`,
          description: `您可以到审核列表中查看您的新闻`,
          placement: 'bottomRight',
        });
      })
    }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id} pagination={{pageSize:5}}></Table>
    </div>
  )
}
