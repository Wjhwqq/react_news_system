import React from 'react'
import { Form,Button,Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './index.css'
import { useNavigate } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import axios  from 'axios';
export default function Login() {
  const navigate=useNavigate()
  const onFinish=(values)=>{
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res=>{
      console.log(res.data);
      if(res.data.length===0){
        message.error('用户名密码不匹配')
      }else{
        localStorage.setItem('token',JSON.stringify(res.data[0]))
        navigate('/home')
      }
    })
  }
  // #region 粒子效果
  const particlesInit = async (main) => {
    await loadFull(main);
  }
  const particlesLoaded = (container) => {
    console.log(container);
  }
  // #endregion
  return (
    <div style={{ background: 'rgb(35,39,65)', height: '100vh',overflow:'hidden'}}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          "background": {
            "color": {
              "value": "#efefef"
            },
            "position": "50% 50%",
            "repeat": "no-repeat",
            "size": "cover"
          },
          "fullScreen": {
            "zIndex": 1
          },
          "interactivity": {
            "events": {
              "onClick": {
                "mode": "push"
              },
              "onHover": {
                "enable": true,
                "mode": "bubble"
              }
            },
            "modes": {
              "bubble": {
                "distance": 400,
                "duration": 2,
                "opacity": 0.8,
                "color": {
                  "value": "#ff0000"
                },
                "size": 40,
                "divs": {
                  "distance": 200,
                  "duration": 0.4,
                  "mix": false,
                  "selectors": []
                }
              },
              "grab": {
                "distance": 400
              },
              "repulse": {
                "divs": {
                  "distance": 200,
                  "duration": 0.4,
                  "factor": 100,
                  "speed": 1,
                  "maxSpeed": 50,
                  "easing": "ease-out-quad",
                  "selectors": []
                }
              }
            }
          },
          "particles": {
            "color": {
              "value": "#1b1e34"
            },
            "links": {
              "color": {
                "value": "#ffffff"
              },
              "distance": 200,
              "width": 2
            },
            "move": {
              "attract": {
                "rotate": {
                  "x": 600,
                  "y": 1200
                }
              },
              "enable": true,
              "outModes": {
                "bottom": "out",
                "left": "out",
                "right": "out",
                "top": "out"
              },
              "speed": 8
            },
            "number": {
              "density": {
                "enable": true
              },
              "value": 6
            },
            "opacity": {
              "random": {
                "enable": true,
                "minimumValue": 0.3
              },
              "value": {
                "min": 0.3,
                "max": 0.5
              },
              "animation": {
                "speed": 1,
                "minimumValue": 0.1
              }
            },
            "shape": {
              "options": {
                "polygon": {
                  "sides": 6
                },
                "star": {
                  "sides": 6
                }
              },
              "type": "polygon"
            },
            "size": {
              "random": {
                "enable": true,
                "minimumValue": 100
              },
              "value": {
                "min": 100,
                "max": 160
              },
              "animation": {
                "minimumValue": 40
              }
            }
          }
        }}
      />
      <div className='formContainer'>
        <div className='loginTitle'>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" onClick={()=>{if(localStorage.getItem('token')) navigate('/home')}}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
