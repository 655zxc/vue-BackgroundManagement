<template>
  <div>
    <!-- 一个行内表单 -->
    <el-form :inline="true" class="demo-form-inline" :model="form">
      <!-- model代表数据收集到form里 -->
      <el-form-item label="一级分类">
        <!-- vmodel绑定form.categoryId1,这样选择项的value就是form.categoryId1 收集到:model里-->
        <el-select placeholder="请选择" value="" v-model="form.categoryId1" @change="changeSelect1">
          <!-- 为什么不是click.native -->
          <el-option :label="p.name" :value="p.id" v-for="p in list1" :key="p.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select placeholder="请选择" value="" v-model="form.categoryId2" @change="changeSelect2">
          <el-option :label="p.name" :value="p.id" v-for="p in list2" :key="p.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select placeholder="请选择" value="" v-model="form.categoryId3" @change="changeSelect3">
          <el-option :label="p.name" :value="p.id" v-for="p in list3" :key="p.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 全局组件 三级联动
export default {
  name: "CategorySelect",
  data(){
    return  {
      list1:[],
      //存一级返回的数据
      list2:[],
      list3:[],
      form:{
        categoryId1:"",
        categoryId2:"",
        categoryId3:"",
      }
     //存各级选择的id
    }
  },
  mounted(){
    this.getCategory1List()
  },
  methods:{
    //获取一级分类的数据
    async getCategory1List(){
      let result = await this.$API.attr.reqCategory1List()
      if(result.code == 200){
        this.list1 = result.data
      }
    },

    //选择一级分类时 获取二级分类的数据 并且清除二级三级的数据
    async changeSelect1(){
      this.list2=""
      this.list3=""
      this.form.categoryId2=""
      this.form.categoryId3=""
      //清除其他一级分类选项产生的数据

      let result = await this.$API.attr.reqCategory2List(this.form.categoryId1)
      if(result.code == 200){
        this.list2 = result.data
      }
    },

    //选择二级分类时 获取三级分类的数据 并清除三级的数据
    async changeSelect2(){
      this.list3=""
      this.form.categoryId3=""
      //清空数据

      let result = await this.$API.attr.reqCategory3List(this.form.categoryId2)
      if(result.code == 200){
        this.list3 = result.data
      }
    },

    //选择三级分类 此时完成所有选择 向父组件传递数据
    changeSelect3(){
      this.$emit('getId',this.form)
    }
  }
};
</script>

<style scoped>
</style>
