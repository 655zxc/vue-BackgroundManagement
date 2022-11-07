<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getId="getId" />
    </el-card>
    <el-card>
      <!-- 展示SPU列表结构 -->
      <div v-show="flag==0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!categoryId3" style="margin:20px 0" @click="addSpu">添加SPU</el-button>
        <!-- 表格 -->
        <el-table style="width: 100%" border :data="list">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}"> 
               <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              ></hint-button>
                <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          v-show="this.list.length>=1"
          style="margin-top: 20px; text-align: center"
          >
        </el-pagination>
      </div>

      <!-- 添加SPU|修改SPU -->
      <SpuForm v-show="flag==1" @cancel="cancel" ref="spu"/>

      <!-- 展示添加SKU结构 -->
      <SkuForm v-show="flag==2" @changeFlag="changeFlag" ref="sku"/>

    </el-card>



    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="skuName" label="名称" width="150"></el-table-column>
        <el-table-column property="price" label="价格" width="200"></el-table-column>
        <el-table-column property="weight" label="重量"></el-table-column>
        <el-table-column  label="默认图片">
          <template slot-scope="row">
            <div>
              <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm"
import SkuForm from "./SkuForm"
export default {
  name: "Spu",
  components:{
    SpuForm,
    SkuForm
  },
  data(){
    return {
      list:[],
      //spu列表

      page:1,
      limit:3,
      total:99,
      //分页器

      categoryId1:"",
      categoryId2:"",
      categoryId3:"",
      //参数

      flag:0,
      //控制card切换

      dialogTableVisible:false,
      //控制sku列表对话框的显示

      gridData:[],
      //展示sku列表

      spu:{}
      //临时存储 记录展示了哪个spu的sku列表
    }
  },
  methods:{
    //完成三级联动 获取三级联动id 并获取数据
    getId(params){
      this.categoryId1 = params.categoryId1
      this.categoryId2 = params.categoryId2
      this.categoryId3 = params.categoryId3
      this.getSquList()
    },

    //获取数据
    async getSquList(){
      let result = await this.$API.spu.reqSpuList(this.page,this.limit,this.categoryId3)
      if(result.code == 200){
        this.total = result.data.total
        this.list = result.data.records
      }
    },

    //分页器改limit
    handleSizeChange(limit){
      this.limit = limit
      this.getSquList()
    },

    //分页器改页
    handleCurrentChange(page){
      this.page = page
      this.getSquList()
    },

    //修改Spu 此时spu组件应该发送请求
    updateSpu(row){
      this.flag = 1

      //调用子组件的发送请求 并且传入数据-点击的spu
      this.$refs.spu.getSpuDate(row)
    },

    //添加Spu
    addSpu(){
      this.flag = 1

      //调用子组件的发送请求 
      this.$refs.spu.addSpuDate(this.categoryId3)
    },

    //删除spu
    async deleteSpu(row){
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSquList();
      }
    },

    //自定义事件的回调 用于关闭Spu
    cancel(){
      this.flag = 0
      this.getSquList()
    },

    //自定义事件的回调 用于关闭Spu
    changeFlag(){
      this.flag = 0
    },

    //添加sku
    addSku(row){
      this.flag = 2
      //调用子组件发送API
      this.$refs.sku.getData(row,this.categoryId1,this.categoryId2,this.categoryId3)
    },

    //查看sku列表
    async handler(row){
      this.dialogTableVisible = true
      //展示sku列表对话框
      let result = await this.$API.spu.reqSkuList(row.id)
      if(result.code == 200){
        this.gridData = result.data
        this.spu = row
      }
    },

    
  }
};
</script>

<style>
</style>