import React from 'react'
import { Button, Table,Modal,Form,Input} from 'antd'
import { useState,useEffect,useRef,useContext } from 'react';
import axios from 'axios';
import {
  DeleteTwoTone,ExclamationCircleOutlined
} from '@ant-design/icons';
const{confirm}=Modal
const EditableContext=React.createContext(null)
export default function NewsCategory() {
  const[dataSource,setDataSource]=useState([])
  const addForm=useRef(null)
  const [isAddVisible,setIsAddVisible]=useState(false)
  
  useEffect(()=>{
    axios.get('/categories').then(res=>{
      const list=res.data
      setDataSource(list)
    })
  },[])
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
  
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
  
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
  
    let childNode = children;
  
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  
    return <td {...restProps}>{childNode}</td>;
  };
  const handleSave=(record)=>{
    setDataSource(dataSource.map(item=>{
      if(item.id===record.id){
        return{
          id:item.id,title:record.title,value:record.title
        }
      }
      return item
    }))
    axios.patch(`/categories/${record.id}`,{title:record.title,value:record.title})
  }
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
      title: '栏目名称',
      dataIndex: 'title',
      onCell:(record)=>({
        record,editable:true,dataIndex:'title',title:'栏目名称',handleSave
      })
    },
   
    {
      title: '操作',
      render:(item)=>{
        return (
          <div>
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
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.delete(`/categories/${item.id}`)
  }
  // 添加
  const addFormOk=()=>{
    setIsAddVisible(false)
    addForm.current.validateFields().then(value=>{
      setIsAddVisible(false)
      addForm.current.resetFields()
      const{title}=value
      axios.post('/categories',{title,value:title}).then(res=>{
        setDataSource([...dataSource,{...res.data}])
      })
    })
  }
  return (
    <div>
      <Button type='primary' onClick={()=>{setIsAddVisible(true)}}>添加分类</Button>
     <Table columns={columns} dataSource={dataSource} pagination={{pageSize:5}} rowKey={item=>item.id} components={{
      body:{
        row:EditableRow,cell:EditableCell
      }
     }} />
     <Modal
        visible={isAddVisible}
        title="添加分类"
        okText="Ok"
        cancelText="Cancel"
        onCancel={()=>{setIsAddVisible(false);addForm.current.resetFields()}}
        onOk={() => addFormOk()}
      >
        <Form ref={addForm}>
          <Form.Item
            name="title"
            label="分类名"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div> 
  )
}
