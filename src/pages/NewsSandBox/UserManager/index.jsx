import React from "react";
import { Button, Table, Modal, Switch} from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import UserForm from "../../../components/UserForm";
import { useRef } from "react";
const { confirm } = Modal;

export default function UserManager() {
  const [dataSource, setDataSource] = useState([]);
  const [isAddVisible,setIsAddVisible]=useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const addForm=useRef(null)
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const updateForm=useRef(null)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [current, setCurrent] = useState(null)
  const{roleId,region,username}=JSON.parse(localStorage.getItem('token'))
  // 获取用户数据
  useEffect(() => {
    const roleObj={'1':'superadmin','2':'admin','3':'editor'}
    axios.get("/users?_expand=role").then((res) => {
      const list = res.data;
      setDataSource(roleObj[roleId]==='superadmin'?list:[...list.filter((item)=>item.username===username),...list.filter(item=>item.region===region&&roleObj[item.roleId]==='editor')]);
    });
  }, [roleId,region,username]);
  // 获取region数据
  useEffect(() => {
    axios.get("/regions").then((res) => {
      const list = res.data;
      setRegionList(list);
    });
  }, []);
  // 获取roles数据
  useEffect(() => {
    axios.get("/roles").then((res) => {
      const list = res.data;
      setRoleList(list);
    });
  }, []);
  // 表格相关
  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      filters:[...regionList.map(item=>({text:item.title,value:item.value})),{text:'全球',value:'全球'}],
      onFilter:(value,item)=>value==='全球'?item.region==='':item.region===value,
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => {
        return role.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={()=>handleChange(item)}></Switch>;
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              onClick={() => handleUpdate(item)}
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.default}
            ></Button>
            <Button
              onClick={() => deleteUser(item)}
              danger
              shape="circle"
              icon={<DeleteOutlined  />}
              disabled={item.default}
            ></Button>
          </div>
        );
      },
    },
  ];
  // 点击删除按钮回调
  const deleteUser = (item) => {
    confirm({
      title: "你确定要删除吗？",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethods(item);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
 
  // 添加用户提交表单
  const addFormOk=()=>{
    addForm.current.validateFields().then(value=>{
      setIsAddVisible(false)
      addForm.current.resetFields()
      axios.post(`/users`,{
        ...value,
        roleState:true,default:false
      }).then(res=>{console.log(res.data);setDataSource([...dataSource,{...res.data,role:roleList.filter(item=>item.id===value.roleId)[0]}])})
      
    }).catch(err=>{console.log(err);})
  }
  // 删除-确定
  const deleteMethods=(item)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.delete(`/users/${item.id}`)
  }
  // 用户状态栏change事件
  const handleChange=(item)=>{
    item.roleState=!item.roleState
    setDataSource([...dataSource])
    axios.patch(`/users/${item.id}`,{roleState:item.roleState})
  }
  // 编辑按钮相关
  const handleUpdate=async(item)=>{
    
    await setIsUpdateVisible(true)
    if(item.roleId===1){
      setIsUpdateDisabled(true)
    }else{setIsUpdateDisabled(false)}
    updateForm.current.setFieldsValue(item)
    setCurrent(item)
    
  }
  // 编辑-确定
  const updateFormOk=()=>{
    updateForm.current.validateFields().then(value=>{
      setIsUpdateVisible(false)
      setDataSource(dataSource.map(item=>{
      if(item.id===current.id){
        return{...item,...value,role:roleList.filter(data=>data.id===value.roleId)[0]}
      }
      return item
      }))
      setIsUpdateDisabled(!isUpdateDisabled)
      axios.patch(`/users/${current.id}`,value)
     })
  }
  return (
    <div>
      <Button type="primary" onClick={()=>{setIsAddVisible(true)}}>添加用户</Button>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="Ok"
        cancelText="Cancel"
        onCancel={()=>{setIsAddVisible(false)}}
        onOk={() => addFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>
      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="update"
        cancelText="Cancel"
        onCancel={()=>{setIsUpdateVisible(false);setIsUpdateDisabled(!isUpdateDisabled)}}
        onOk={() => updateFormOk()}
      >
        <UserForm  ref={updateForm} regionList={regionList} roleList={roleList} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
      </Modal>
    </div>
  );
}
