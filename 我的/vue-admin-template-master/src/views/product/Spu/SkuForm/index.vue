<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元素)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <!-- 在一个行内表单中 根据数据vfor生成多个表单 -->
          <el-form-item :label="attr.attrName" v-for="(attr) in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <!-- v-model="attr.attrIdAndValueId" 把选择的项存在了数组attrInfoList的元素中 -->
              <!-- 这里的select的option也是vfor生成的 -->
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue) in attr.attrValueList" :key="attrValue.id"></el-option>
              <!-- value是收集的值 也就是选择的平台属性的id 也是select用vmodel绑定的值 -->
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr) in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" prop="prop" width="80" >
          </el-table-column>

          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row}">
                <img :src="row.imgUrl" style="width:100px;height:100px">
             </template>
             <!-- 作用域插槽 row是这一行的数据 向表格的列中插入图片 -->
          </el-table-column>

          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
             <template slot-scope="{row}">
                  <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
                  <el-button v-else>默认</el-button>
              </template> 
              <!-- 作用域插槽 -->
              <!-- 两个按钮相互切换 -->
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'SkuForm',
  data() {
    return {

      //展示的数据 发送API获得
      //存储图片的信息
      spuImageList: [],
      //存储销售是属性
      spuSaleAttrList: [],
      //存储平台属性的数据
      attrInfoList: [],



      //收集的数据 需要自己填写
      //收集sku数据的字段
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //存收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //存选择的平台属性 每个属性的数据是一个对象 
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //存选择的销售属性 每个属性的数据是一个对象
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // },
        ],
      },



      spu:{},
      //收集图片的数据字段:但是需要注意，收集的数据目前缺少isDefault字段，将来提交给服务器数据的时候，需要整理参数
      //存放勾选的图片
      imageList:[]
    };
  },
  methods:{
    //发送API 请求添加sku时需要的数据
    async getData(row,categoryId1,categoryId2,categoryId3){
      let result1 = await this.$API.spu.reqSpuImageLIst(row.id)
      //本来应该是id 但后面添加的id没数据 
      if(result1.code == 200){
          let list = result1.data;
          // 给每张图片添加一个属性
        list.forEach(item=>{
            item.isDefault = 0;
        });
        this.spuImageList = list;
       
      }
      let result2 = await this.$API.spu.reqSpuSaleAttrList(row.id)
      if(result1.code == 200){
        this.spuSaleAttrList = result2.data
      }
      let result3 = await this.$API.spu.reqAttrInfoList(categoryId1,categoryId2,categoryId3)
      if(result1.code == 200){
        this.attrInfoList = result3.data
      }
      
      //收集父组件给予的数据
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spu = row;
    },

    //保存按钮
    async save(){
      //1.整理平台属性 将选择的平台属性添加至skuInfo
      //可以用foreach 也可以用 reduce(reduce也会循环数组)
      //注意skuAttrValueList只需要attrInfoList的一部分数据即可
      //使用reduce循环数组 初始值是一个空数组,满足条件则向数组里push对象并且传给下一个值
      this.skuInfo.skuAttrValueList = this.attrInfoList.reduce((prev,cur)=>{
        if(cur.attrIdAndValueId){
          const [attrId,valueId] = cur.attrIdAndValueId.split(":")
           prev.push({attrId,valueId})
        }
        return prev
      },[])

      //2.整理销售属性 同上
      this.skuInfo.skuSaleAttrValueList = this.spuSaleAttrList.reduce((prev,cur)=>{
        if(cur.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] = cur.attrIdAndValueId.split(":")
           prev.push({saleAttrId,saleAttrValueId})
        }
        return prev
      },[])

      //3.整理图片的数据
      this.skuInfo.skuImageList = this.imageList.map(item=>{
         return {
           imgName:item.imgName,
           imgUrl:item.imgUrl,
           isDefault:item.isDefault,
           spuImgId:item.id,
         }
     });

      //4.发送API
      let result = await this.$API.spu.reqAddSku(this.skuInfo)
      if(result.code == 200){
        this.$message({type:'success',message:'添加SKU成功'})
        this.cancel()
        return "OK"
      }
    },

    //取消按钮
    cancel(){
      //自定义事件 让父组件flag = 0
      this.$emit('changeFlag')
      //重置表单数据
      Object.assign(this._data,this.$options.data())
    },

    //设置默认图片
    changeDefault(row){
      //排他操作
      this.spuImageList.forEach(p=>{
        p.isDefault = 0
      })
      // 切换当前图片为默认
      row.isDefault = 1
      //收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },

    //table表格复选框按钮的事件
    handleSelectionChange(params){
       //获取到用户选中图片的信息数据，但是需要注意，当前收集的数据当中，缺少isDefault字段
       this.imageList = params;
    },
  }
}
</script>

<style>

</style>