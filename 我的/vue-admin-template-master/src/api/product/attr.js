//平台属性管理模块请求文件
import request from '@/utils/request';

//1.获取一级分类数据接口
///admin/product/getCategory1   get
export const reqCategory1List = ()=>request({url:'/admin/product/getCategory1',method:'get'});

//2.获取二级分类数据接口
//admin/product/getCategory2/{category1Id} get
export const reqCategory2List = (category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'});

//3.获取三级分类数据接口
///admin/product/getCategory3/{category2Id}  get
export const reqCategory3List = (category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'});

//4.获取相应商品数据
export const reqGetTradeMarkList = (categoryId1,categoryId2,categoryId3)=>{
    return request({
        url:`/admin/product/attrInfoList/${categoryId1}/${categoryId2}/${categoryId3}`,
        method:'get',
    })
}

//5.添加/修改属性
export const reqAddOrUpdateAttr = (data)=>request({url:'/admin/product/saveAttrInfo',method:'post',data});
