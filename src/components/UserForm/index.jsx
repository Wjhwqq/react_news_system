import React from "react";
import {Form,Input,Select } from "antd";
import { useState } from "react";
import { forwardRef } from "react";
import { useEffect } from "react";

const { Option } = Select
const UserForm=forwardRef((props,ref) =>{
  const {regionList,roleList,isUpdateDisabled,isUpdate}=props
  const [isDisable, setIsDisable] = useState(false)

  useEffect(()=>{
    setIsDisable(isUpdateDisabled)
  },[isUpdateDisabled])
  const {roleId,region}=JSON.parse(localStorage.getItem('token'))
  const roleObj={'1':'superadmin','2':'admin','3':'editor'}
  const checkRegionDisabled=(item)=>{
    if(isUpdate){
      if(roleObj[roleId]==='superadmin'){
        return(false)
      }else{
        return(true)
      }
    }else{
      if(roleObj[roleId]==='superadmin'){
        return(false)
      }else{
        return(item.value!==region)
      }
    }
  }
  const checkRoleDisabled=(item)=>{
    if(isUpdate){
      if(roleObj[roleId]==='superadmin'){
        return(false)
      }else{
        return(true)
      }
    }else{
      if(roleObj[roleId]==='superadmin'){
        return(false)
      }else{
        return(roleObj[item.id]!=='editor')
      }
    }
  }



  return (
    <div>
      <Form layout="vertical" ref={ref}>
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"
          rules={isDisable?[]:[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
        >
          <Select disabled={isDisable}>
            {regionList.map((item) => {
              return (
                <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>
                  {item.title}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"
          rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
        >
          <Select onChange={(value)=>{
            if(value===1){
              setIsDisable(true)
              ref.current.setFieldsValue({region:""})
            }else{setIsDisable(false)}
          }}>
            {roleList.map((item) => {
              return (
                <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>
                  {item.roleName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
})
export default UserForm
