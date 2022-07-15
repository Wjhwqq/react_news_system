import React from 'react'
import { Table,Button,Modal ,Tree} from 'antd'
import { useState ,useEffect} from 'react'
import axios from 'axios'
import {DeleteTwoTone,ExclamationCircleOutlined,UnorderedListOutlined} from '@ant-design/icons'
const {confirm}=Modal
export default function RoleList() {
  const [dataSource,setDataSource] =useState([])
  const [isModalVisible,setIsModalVisible]=useState(false)
  const [rightList,setRightList]=useState([])
  const[currentRights,setCurrentRights]=useState([])
  const [currentId,setCurrentId]=useState([])
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
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render:(item)=>{
        return (
          <div>
            <Button onClick={()=>{setIsModalVisible(true);setCurrentRights(item.rights);setCurrentId(item.id)}} type='primary'  shape='circle' icon={<UnorderedListOutlined />}></Button>
            <Button onClick={()=>deleteRole(item)} shape='circle' danger   icon={<DeleteTwoTone twoToneColor={'red'}/>} ></Button>
            
          </div>
        )
      }
    },
  ]
  useEffect(()=>{
    axios.get('/roles').then(res=>{
      setDataSource(res.data)
    })
  },[])
  useEffect(()=>{
    axios.get('/rights?_embed=children').then(res=>{
      setRightList(res.data)
    })
  },[])
    // 点击删除按钮回调
    const deleteRole=(item)=>{
      confirm({
        title: '你确定要删除吗？',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          deleteRoleOk(item)
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
    // 删除按钮确定回调
    const deleteRoleOk=(item)=>{
        setDataSource(dataSource.filter((data)=>{return data.id!==item.id}))
        axios.delete(`/roles/${item.id}`)
      
    }
    // 显示调整权限分配
    const handleOk=()=>{

      setIsModalVisible(false)
      setDataSource(dataSource.map((item)=>{
        if(item.id===currentId){
          return {...item,rights:currentRights}
        }
        return item
      }))
      axios.patch(`/roles/${currentId}`,{
        rights:currentRights
      })
    }
    // 勾选tree组件check事件
    const onCheck=(checkedKeys)=>{
      setCurrentRights(checkedKeys.checked)
    }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}></Table>
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={()=>{setIsModalVisible(false)}}>
        <Tree
          checkable
          treeData={rightList}
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={true}
        />
      </Modal>
    </div>
  )
}
