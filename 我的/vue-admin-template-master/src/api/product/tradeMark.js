import request from '@/utils/request'

//1.获取品牌列表
export const reqTradeMarkList = (page,limit)=>{
    return request({
        url:`/admin/product/baseTrademark/${page}/${limit}`,
        method:'get'
    })
}

//2.添加品牌列表 
export const reqAddTradeMarkList = (params)=>{
    return request({
        url:"/admin/product/baseTrademark/save",
        method:'post',
        data:params
    })
}

//3.修改品牌列表 
export const reqUpdateTradeMarkList = (params)=>{
    return request({
        url:"/admin/product/baseTrademark/update",
        method:'put',
        data:params
    })
}

//4.删除品牌列表 
export const reqDeleteTradeMarkList = (id)=>{
    return request({
        url:`/admin/product/baseTrademark/remove/${id}`,
        method:'delete',
    })
}





