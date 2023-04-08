import React, { useState } from "react";
import { Button } from 'antd-mobile';

const ButtonAgain = function ButtonAgain(props) {
    /* props中包含了调用<Button>组件时候的属性 */
    let options = { ...props };
    let { children, onClick: handle } = options;
    // 移除掉就不会在return的时候传给button了

    delete options.children;
    // delete options.onClick;
   

    /* 状态 */
    let [loading, setLoading] = useState(false);
    
    const clickHandle = async () => {
        setLoading(true);
        try {
            await handle();//各个button真正要做的事情 已经用handle取出
        } catch (_) { }
        setLoading(false);
    };
 if (handle) {
        options.onClick = clickHandle;
        // 如果handle存在，再把我自己定义的这个clickHandle传给Button
    }


    // 如果onClick没传，就不加clickHandle
    return <Button {...options} loading={loading}>
        {children}
    </Button>;
};
export default ButtonAgain;