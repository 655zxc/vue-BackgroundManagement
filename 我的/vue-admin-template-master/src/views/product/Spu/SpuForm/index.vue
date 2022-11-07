<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="p.tmName"
            :value="p.id"
            v-for="p in tradeMarkList"
            :key="p.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <!-- 上传图片：action图片上传的地址  list-type: 文件列表的类型 on-preview:图片预览的时候会出发  on-remove:当删除图片的时候会出发 
         file-list：照片墙需要展示的数据【数组：数组里面的元素务必要有name、url属性】
         on-preview：图片预览功能
         on-remove:删除图片的时候会触发
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <!-- 销售属性有一个选择框 一个按钮 一个表格 -->
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrId">
          <el-option :value="p.id" v-for="p in unSelectSaleAttr" :key="p.id" :label="p.name"></el-option>
        </el-select>

        <el-button type="primary" icon="el-icon-plus" style="margin-left: 20px" @click="addSaleAttr"
          >添加销售属性</el-button
        >

        <!-- 展示的是当前SPU属于自己的销售属性 -->
        <el-table
          style="width: 100%; margin-top: 20px"
          border
          :data="spu.spuSaleAttrList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>

          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <!-- 这列使用了tag组件 -->
               <!-- button和input需要相互切换 -->
            <template slot-scope="{row}">
              <div>   
                <!-- vfor遍历row(这个属性)的属性值(spuSaleAttrValueList)列表 -->
                <el-tag
                  :key="tag.id"
                  v-for="(tag,index) in row.spuSaleAttrValueList"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(row,index)"
                >
                  {{ tag.saleAttrValueName }}
                </el-tag>
                <!-- input和button通过vif velse切换
                点击button显示input
                inout失焦或摁回车显示button -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >添加</el-button
                >
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,

      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储SPU图片的数据
      saleAttrList: [], //销售属性的数据（项目全部的销售属性）
      attrId: "", //收集未选择的销售属性的id-----
    };
  },
  methods: {
    //图片删除
    handleRemove(file, fileList) {
      //file 删除的图片
      //fileList 剩下的图片
      this.spuImageList = fileList
    },

    //图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    //图片上传成功
    handleSuccess(response, file, fileList){
      this.spuImageList = fileList
    },

    //关闭页面
    cancel() {
      this.$emit("cancel");
    },

    //保存信息
    async addOrUpdateSpu() {
      //整理参数：需要整理照片墙的数据
      //携带参数：对于图片，需要携带imageName与imageUrl字段
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      //发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        //提示
        this.$message({ type: "success", message: "保存成功" });
        //通知父组件回到场景0
        this.cancel()
      }
      //清除数据
      // Object.assign(this._data, this.$options.data());
    },

    //修改spu 被父组件修改时调用 发送详细spu的API
    async getSpuDate(spu) {
      // 这个方法根据点击的spu的id 发送四个API 得到点击的spu的数据 存于data

      //获取SPU信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        //在修改spu的时候,需要向服务器发请求的，把服务器返回的数据（对象），赋值给spu属性
        this.spu = spuResult.data;
      }

      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }

      //获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        //由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        //需要把服务器返回的数据进行修改
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
          //数组变更 新增的数据可以检测到 有get set
        });
        //把整理好的数据赋值给
        this.spuImageList = listArr;
      }

      //获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },

    //添加spu 被父组件添加时调用
    async addSpuDate(categoryId3){
      //获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }

      //获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }

      //整理参数
      this.spu.category3Id = categoryId3
    },

    //添加销售属性
    addSaleAttr(){
      let id = this.attrId
      let saleAttrName = ""
      this.saleAttrList.forEach(p=>{
         if(id == p.id){
           saleAttrName = p.name
         }
     
      })
      //通过得到的id获取name

      const newSaleAttr = {
        id,
        saleAttrName,
        spuSaleAttrValueList:[]
      }
      //整理数据
      
      this.spu.spuSaleAttrList.push(newSaleAttr)
      //加入数据

      this.attrId=""
      //置空
    },

    //点击添加属性 显示input
    showInput(row){
      this.$set(row,'inputVisible',true)
      this.$set(row,'inputValue',"")
      //添加并设置两个属性
    },

    //input失焦 enter的事件 需要在这里添加属性值
    handleInputConfirm(row){
      //解构出销售属性当中收集数据
      const { baseSaleAttrId, inputValue } = row;
      //新增的销售属性值的名称不能为空
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      //属性值不能重复,这里也可以用some
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      if (!result) return;
      //新增的销售属性值
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      //新增
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      //修改inputVisible为false，不就显示button
      row.inputVisible = false;
    },

    //点击tag的 x,删除tag
    handleClose(row,index){
      row.spuSaleAttrValueList.splice(index,1)
    },

    //删除销售属性
    deleteAttrValue(index){
      this.spu.spuSaleAttrList.splice(index,1)
    }
   
  },
  computed:{
    //计算未选中的销售属性
    unSelectSaleAttr() {
      return this.saleAttrList.filter(p=>{
        //返回true 意味没有这个属性 即每次比较都是true 意味着每次比较都是错 则返回true
        return this.spu.spuSaleAttrList.every(q=>{
          return p.name != q.saleAttrName
        })
      })
    }
  }
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>