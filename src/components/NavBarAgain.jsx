import React from "react";
import PropTypes from "prop-types";
import { NavBar } from 'antd-mobile';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import './NavBarAgain.less';

const NavBarAgain = function NavBarAgain(props) {
    let { title } = props
    // useLocation useSearchParams拿到当前路由地址和问号参数


    const navigate = useNavigate(),
        location = useLocation(),
        [usp] = useSearchParams();

    const handleBack = () => {
        let to = usp.get('to')
        if (location.pathname === '/login' && /^\/detail\/\d+$/.test(to)) {
            navigate(to, { replace: true })
            return;
        }
        navigate(-1);
    }
    return <NavBar onBack={handleBack}>{title}</NavBar>
}

NavBarAgain.defaultProps = {
    title: '个人中心'
}
NavBarAgain.propTypes = {
    title: PropTypes.string
}

export default NavBarAgain;