import React from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import { useState } from 'react'
import style from '../NewsAdd/index.module.css'
import { useEffect, useRef } from 'react'
import axios from 'axios'
import NewsEditor from '../../../components/NewsEditor'
import { useLocation, useNavigate } from 'react-router-dom'
const { Step } = Steps
const { Option } = Select
export default function NewsUpdate() {
  const location=useLocation()
  const NewsForm = useRef(null)
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')
  // const User = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()

  const handleNext = () => {
    if (current === 0) {
      NewsForm.current.validateFields().then(res => {
        setFormInfo(res);
        setCurrent(current + 1)
      }).catch(error => {
        console.log(error);
      })
    } else {
      if (content === '' || content.trim() === '<p></p>') {
        message.error('新闻内容不能为空')
      } else {
        setCurrent(current + 1)
      }

    }

  }
  const handlePrevious = () => {
    setCurrent(current - 1)
  }
  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategoryList(res.data)
    })
  }, [])
  useEffect(()=>{
    const newsNum=location.pathname.split('/')[location.pathname.split('/').length-1]
    axios.get(`/news/${newsNum}?_expand=category&_expand=role`).then(res=>{
      let{title,categoryId,content}=res.data
      NewsForm.current.setFieldsValue({
        title,categoryId
      })
      setContent(content)
    })
  },[location.pathname])
  const handleSave = (auditState) => {
    axios.patch(`/news/${location.pathname.split('/')[location.pathname.split('/').length-1]}`, {
      ...formInfo,
      content: content,
      auditState: auditState,
    }).then(res => {
      navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      notification.info({
        message: `通知`,
        description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="更新新闻"
        onBack={()=>{ window.history.back(-1)}}
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      <div style={{ marginTop: '50px' }}>
        <div className={current === 0 ? '' : style.active}>
          <Form
            ref={NewsForm}
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            initialValues={{
              remember: true,
            }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Select>
                {
                  categoryList.map(item => <Option value={item.id} key={item.id}>{item.title}</Option>)
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : style.active}>
          <NewsEditor content={content} getContent={(value) => { setContent(value) }}></NewsEditor>
        </div>
        <div className={current === 2 ? '' : style.active}>3</div>
      </div>

      <div style={{ marginTop: '50px' }}>
        {
          current === 2 && <span>
            <Button type='primary' onClick={() => handleSave(0)}>保存到草稿箱</Button>
            <Button danger onClick={() => handleSave(1)}>提交审核</Button>
          </span>
        }
        {
          current < 2 && <Button type='primary' onClick={handleNext}>next</Button>
        }
        {
          current > 0 && <Button onClick={handlePrevious}>back</Button>
        }
      </div>
    </div>
  )
}
