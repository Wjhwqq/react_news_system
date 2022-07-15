import React from 'react'
import { Table} from 'antd'
import { Link } from 'react-router-dom'
export default function NewsPublish(props) {
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
            {props.button(item.id)}
          </div>
        )
      }
    },
  ]
 
  return (
    <div>
     <Table columns={columns} dataSource={props.dataSource} pagination={{pageSize:5}}  rowKey={item=>item.id}/>
    </div> 
  )
}
