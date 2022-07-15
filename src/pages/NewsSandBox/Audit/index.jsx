import React,{useState,useEffect} from 'react'
import {Table,Button,notification} from 'antd'
import axios from 'axios'
import { Link } from 'react-router-dom';
import {CheckOutlined,CloseOutlined} from '@ant-design/icons'
export default function Audit() {
  const [dataSource, setDataSource] = useState([]);
  const{roleId,region,username}=JSON.parse(localStorage.getItem('token'))
  useEffect(()=>{
    const roleObj={'1':'superadmin','2':'admin','3':'editor'}
    axios.get(`/news?auditState=1&_expand=category`).then((res) => {
      const list = res.data;
      setDataSource(roleObj[roleId]==='superadmin'?list:[...list.filter((item)=>item.author===username),...list.filter(item=>item.region===region&&roleObj[item.roleId]==='editor')]);
    });
  },[roleId,region,username])
  // 按钮相关
  const handleAudit=(item,auditState,publishState)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{auditState,publishState}).then(res=>{
      notification.info({
        message: `通知`,
        description: `您可以到审核管理的审核列表中查看您新闻的审核状态`,
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
      title: '操作',
      render:(item)=>{
        return (
          <div>
            <Button shape='circle' type='primary' icon={<CheckOutlined />} onClick={()=>{handleAudit(item,2,1)}}></Button>
            <Button shape='circle' type='primary' danger icon={<CloseOutlined /> }  onClick={()=>{handleAudit(item,3,0)}}></Button>
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
