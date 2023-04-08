import React, { useState, useEffect } from 'react'
import { Form, Input, Toast } from 'antd-mobile'
import './Login.less'
import NavBarAgain from '../components/NavBarAgain'
import ButtonAgain from '../components/ButtonAgain'
import api from '../api'
import _ from '../assets/utils'
import { connect } from 'react-redux'
import action from '../store/action'


/* 自定义表单校验规则 */
const validate = {
    phone(_, value) {
        value = value.trim()

        let reg = /^(?:(?:\+|00)86)?1\d{10}$/
        if (value.length === 0) return Promise.reject(new Error('手机号必填'))
        if (!reg.test(value)) return Promise.reject(new Error('手机号格式不正确'))
        
        return Promise.resolve();
    },
    code(_, value) {
        value = value.trim()
        let reg = /^\d{6}$/
        if (value.lenth === 0) return Promise.reject(new Error('验证码是必填项'))
        if (!reg.test(value)) return Promise.reject(new Error('验证格式有误！'))
        return Promise.resolve()
    }

}



const Login = function Login(props) {
    let { queryUserInfoAsync, navigate, usp } = props
    const [formIns] = Form.useForm()

    const [disabled, setDisabled] = useState(false),
        [sendText, setSendText] = useState('发送验证码')


    /*  const delay=(interval=1000)=>{
         return new Promise(resolve=>{
             setTimeout(()=>{
                 resolve()
             },interval)
         })
     }
  */
    const submit = async (values) => {
        // 表单校验已经成功
        try {
            await formIns.validateFields()
            let { phone, code } = formIns.getFieldsValue()
            let { code: codeHttp, token } = await api.login(phone, code)
            if (+codeHttp !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: '登录失败'
                })
                formIns.resetFields(['code'])
                return;
            }
            //    登录成功,存储到redux,提示跳转
            _.storage.set('tk', token)

            await queryUserInfoAsync();//派发任务，同步redux中的状态信息
            Toast.show({
                icon:'success',
                content:'登录/注册成功'
            });
            // 跳转
            let to=usp.get('to');
            to?navigate(to,{replace:true}):navigate(-1)

        } catch (_) { }
    }

    let timer = null, num = 31
    const countDown = () => {
        num--;
        if (num === 0) {
            clearInterval(timer)
            timer = null;
            setSendText(`发送验证码`)
            setDisabled(false)
            return;
        }
        setSendText(`${num}秒后重发`)
    }

    const send = async () => {
        try {
            await formIns.validateFields(['phone'])
            //通过则往下走
            let phone = formIns.getFieldValue('phone')
            let { code } = await api.sendPhoneCode(phone)
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: '发送失败'
                })
                return;
            }
            /* 像服务器发请求 */
            setDisabled(true)
            countDown();
            if (!timer) {
                timer = setInterval(countDown, 1000)
                // 等1000ms就开始countDown 即减一
            }
        } catch (_) { console.log(_); }
    }

    useEffect(() => {
        return () => {
            /* 组件销毁时把没有清除的定时器删掉 */
            if (timer) {
                clearInterval(timer);
                timer = null
            }
        }
    }, [])

    return <div className="login-box">
        <NavBarAgain title="登录/注册" />
        <Form
            layout='horizontal'
            style={{ '--border-top': 'none' }}
            footer={
                <ButtonAgain color='primary' onClick={submit}>
                    提交
                </ButtonAgain>
                /*  <Button color='primary' type='submit'
                     loading={submitLoading}>
                     提交
                 </Button> */
            }
            form={formIns}
            initialValues={{ phone: '', code: '' }}
            requiredMarkStyle={false}
        >
            <Form.Item name='phone' label='手机号' rules={[{ validator: validate.phone }]}>
                <Input placeholder='请输入手机号' />
            </Form.Item>

            <Form.Item name='code' label='验证码'
                rules={[{ validator: validate.code }]}
                /* rules={[
                    {required:true,message:'校验码必填'},
                    {pattern:/^\d{6}$/,message:'校验失败'}
                ]} */
                extra={
                    <ButtonAgain size='small' color="primary"
                        disabled={disabled}
                        onClick={send}>
                        {sendText}
                    </ButtonAgain>
                }
            >
                <Input />
            </Form.Item>
        </Form>
    </div>
}

export default connect(
    null,
    action.base
)(Login)


/* 客户端接受服务器返回的内容 失败 提示 
成功：开启倒计时 不可点击 */

/* localStorage要具备有效期 

    我们需要把登陆这信息获取到
    存储到Redux容器里，方便后期做登录态校验
*/