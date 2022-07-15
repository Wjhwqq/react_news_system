import React from 'react'
import { Button, Table,Tag,Modal,Popover, Switch} from 'antd'
import { useState,useEffect } from 'react';
import axios from 'axios';
import {
  EditOutlined,DeleteTwoTone,ExclamationCircleOutlined
} from '@ant-design/icons';
const{confirm}=Modal
export default function RightList() {
  const[dataSource,setDataSource]=useState([])
  useEffect(()=>{
    axios.get('/rights?_embed=children').then(res=>{
      const list=res.data
      list.forEach((i)=>{if(i.children.length===0)i.children=''})
      setDataSource(list)
    })
  },[])
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
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render:(path)=>{
        return <Tag color={'orange'}>{path}</Tag>
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return (
          <div>
            <Popover content={<div style={{textAlign:'center'}}><Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}></Switch></div>} title="页面配置项设置开关" trigger={item.pagepermisson===undefined?'':'click'}>
              <Button  type={item.pagepermisson===1?'primary':'warning'}  shape='circle' icon={<EditOutlined />} disabled={item.pagepermisson===undefined}></Button>
            </Popover>
            <Button onClick={()=>deleteRight(item)} danger  shape='circle' icon={<DeleteTwoTone twoToneColor={'red'} />}></Button>
          </div>
        )
      }
    },
  ]
  // 点击删除按钮回调
  const deleteRight=(item)=>{
    confirm({
      title: '你确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteRightOk(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  // 删除按钮确定回调
  const deleteRightOk=(item)=>{
    
    if(item.grade===1){
      setDataSource(dataSource.filter((data)=>{return data.id!==item.id}))
      axios.delete(`/rights/${item.id}`)
    }else{
      let list=dataSource.filter(data=>data.id===item.rightId)
      list[0].children=list[0].children.filter(data=>data.id!==item.id)
      setDataSource([...dataSource])
    }
    
  }
  // switch配置项开关
  const switchMethod=(item)=>{
    item.pagepermisson=item.pagepermisson===1?0:1
    setDataSource([...dataSource])
    if(item.grade===1){
      axios.patch(`/rights/${item.id}`,{pagepermisson:item.pagepermisson})
    }else{
      axios.patch(`/children/${item.id}`,{pagepermisson:item.pagepermisson})
    }
  }
  return (
    <div>
     <Table columns={columns} dataSource={dataSource} pagination={{pageSize:5}} />
    </div> 
  )
}
