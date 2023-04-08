import React, { useState, useEffect, useRef } from 'react'
import HomeHead from '../components/HomeHead'
import _ from '../assets/utils'
import './Home.less'
import { Swiper, Image, Divider, DotLoading } from 'antd-mobile'
import { Link } from 'react-router-dom'
import api from '../api'
import NewsItem from '../components/NewsItem'
import SkeletonAgain from '../components/SkeletonAgain'

const Home = function Home() {
    let [today, setToday] = useState(_.formatTime(null, "{0}{1}{2}"))
    let [bannerData, setBannerData] = useState([]),
        [newsList, setNewsList] = useState([])
    let loadMore = useRef()

    useEffect(() => {
        (async () => {
            try {
                let { date, stories, top_stories } = await api.queryNewsLatest()
                setToday(date)
                setBannerData(top_stories)
                newsList.push({
                    date,
                    stories
                })//堆内存一样的话就不更新
                setNewsList([...newsList])
            } catch (_) { }
        })()
    }, [])

    // 设置监听器 实现触底加载
    useEffect(() => {
        // console.log(loadMore.current)
        //IntersectionObserver的参数是监听的dom元素，几个DOM就是几个change
        let ob = new IntersectionObserver(async changes => {
            
            let { isIntersecting } = changes[0]
            if (isIntersecting) {
                //加载更多的按钮出现在视口

                try {
                    let time = newsList[newsList.length - 1]['date']
                    let res = await api.queryNewsBefore(time)
                    newsList.push(res)
                    setNewsList([...newsList])
                    // setState执行就重新渲染
                } catch (_) { }
            }
        })
        ob.observe(loadMore.current) //把这个DOM作为参数传入，每次页面渲染触底的时候触发新渲染 
        let temp = loadMore.current;
        

        return () => {
            // 在组件销毁释放的时候 手动销毁监听器
            // ob.unobserve(loadMore.current)//组件被撤销的时候 参数已经是空的了不能传空
            ob.unobserve(temp);
            ob = null
        }
    }, [])


    return <div className="home-box">
        <HomeHead today={today} />
        {/* 轮播图 */}
        <div className="swiper-box">
            {bannerData.length > 0 ? <Swiper autoplay={true} loop={true}>
                {/* 循环绑定 */}
                {bannerData.map(item => {
                    let { id, image, title, hint } = item
                    return < Swiper.Item key={id}>
                        <Link to={{
                            pathname: `/detail/${id}`
                        }} >

                            {/* <img src={image}alt="" /> */}

                            <Image src={image} lazy />
                            <div className="desc">
                                <h3 className="title">{title}</h3>
                                <p className="author">{hint}</p>
                            </div>
                        </Link>
                    </Swiper.Item>
                })}

            </Swiper> : null}
        </div>


        {/* 新闻列表 */}

        {newsList.length === 0 ?
            <SkeletonAgain /> :
            <>
                {
                    newsList.map((item, index) => {
                        let { date, stories } = item
                        return <div className="news-box" key={date}>
                            {index !== 0 ? <Divider contentPosition="left">{_.formatTime(date, '{1}月{2}日')}</Divider> : null}

                            <div className="list">
                                {stories.map(cur => {
                                    return <NewsItem key={cur.id} info={cur} />
                                })}
                            </div>
                        </div>
                    })

                }</>
        }



        <div className="loadmore-box" ref={loadMore} style={{
            display: newsList.length === 0 ? 'none' : 'block'
        }}>
            <DotLoading />
            数据加载中
        </div>

    </div >
}

export default Home


// 基于数据控制元素显示隐藏
/* 1.控制其是否渲染，没有数据可以不渲染 结构中找不到他 也获取不了DOM
 { newsList.length>0?<div className="loadmore-box" ref={loadMore}>
            <DotLoading />
            数据加载中
        </div>:null}
    2.控制元素的样式 display ，都会渲染，只是样式为none 可以获取DOM元素*/