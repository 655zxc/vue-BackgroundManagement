//平台属性管理模块请求文件
import request from '@/utils/request';


//1.获取spu列表
export const reqSpuList = (page,limit,category3Id)=>{
    return request({
        url:`/admin/product/${page}/${limit}`,
        method:'get',
        params:{category3Id:category3Id}
    })
}


//2.获取spu基本信息
export const reqSpu = (spuId)=>{
    return request({
        url:`/admin/product/getSpuById/${spuId}`,
        method:'get',
    })
}



//3.获取品牌的信息
export const reqTradeMarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' });


//4.获取SPU图标的接口
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });


//5.获取平台全部销售属性----整个平台销售属性一共三个
export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' });


//6.修改SPU||添加SPU：对于修改或者添加，携带给服务器参数大致一样的，唯一的区别就是携带的参数是否带id
export const reqAddOrUpdateSpu = (spuInfo) => {
    //携带的参数带有id----修改spu
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo });
    } else {
        //携带的参数不带id---添加SPU
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo });
    }
}


//7.删除SPU
export const reqDeleteSpu = (spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'});


//8.sku获取图片的数据
///admin/product/spuImageList/{spuId}  get
export const reqSpuImageLIst = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'});


//9.sku获取销售属性的数据
///admin/product/spuSaleAttrList/{spuId}  get
export const reqSpuSaleAttrList = (spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'});


//10.sku获取平台属性的数据
//GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} 
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'});


//11.添加SKU
///admin/product/saveSkuInfo  post
export const reqAddSku = (skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo});



//12.获取SKU列表数据的接口
//GET /admin/product/findBySpuId/{spuId}  
export const reqSkuList = (spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'});