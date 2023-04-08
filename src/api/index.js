import http from './http'


const queryNewsLatest = () => {
    return http.get('/api/news_latest')
}

const queryNewsBefore = (time) => {
    return http.get('/api/news_before', {
        params: {
            time
        }
    })
}

const queryNewsInfo = (id) => {
    return http.get('/api/news_info', {
        params: {
            id
        }
    })
}

const queryStoryExtra = (id) => {
    return http.get('/api/story_extra', {
        params: {
            id
        }
    })
}

/* 发送验证码 */
const sendPhoneCode = (phone) => {
    return http.post('/api/phone_code', {
        phone
    })
}

/* 登录或注册 */
const login = (phone, code) => {
    return http.post('/api/login', {
        phone,
        code
    })
}


/* 获取登录者信息 */
const queryUserInfo = () => http.get('/api/user_info')


/* 收藏新闻 */
const store = (newsId) => {
    return http.post('/api/store', { newsId })
}

/* 获取收藏列表 */
const storeList = () => http.get('/api/store_list')



/* 移除收藏 */
const storeRemove = (id) => {
    return http.get('/api/store_remove', {
        params: {
            id
        }
    })
}

// 上传图片
const upload = (file) => {
    let fm = new FormData();
    fm.append('file', file);
    return http.post('/api/upload', fm)
}

// 修改个人信息
const userUpdate = (username, pic) => {
    return http.post('/api/user_update', {
        username,
        pic
    })
}

/* 暴露api */
const api = {
    queryNewsBefore,
    queryNewsLatest,
    queryNewsInfo,
    queryStoryExtra,
    sendPhoneCode,
    login,
    queryUserInfo,
    store,
    storeList,
    storeRemove, 
    upload, 
    userUpdate
}

export default api