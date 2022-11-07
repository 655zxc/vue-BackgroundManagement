<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getId="getId" />
    </el-card>

    <el-card>
      <!-- 属性展示的表格 -->
      <div v-show="isShowTable">
        <!-- 按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!categoryId3"
          @click="addAttr"
          style="margin: 10px 0"
        >
          添加属性
        </el-button>

        
        <el-table :data="data" style="width: 100%" border>
          <el-table-column label="序号" width="80" type="index" align="center">
          </el-table-column>

          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
            align="center"
          >
          </el-table-column>

          <el-table-column
            prop="prop"
            label="属性值列表"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <!-- 遍历数组生成tag -->
              <el-tag
                type="success"
                v-for="p in row.attrValueList"
                :key="p.id"
                style="margin: 0 5px"
                >{{ p.valueName }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <!-- 修改按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加属性的表格 -->
      <div v-show="!isShowTable">

        <!-- 输入属性名 -->
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>

        <!-- 添加/取消按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrInfo"
        >
          添加属性值
        </el-button>
        <el-button @click="isShowTable = true">取消</el-button>

        <!-- 添加属性值的表格 -->
        <el-table
          style="width: 100%; margin: 20px 0px"
          :data="attrInfo.attrValueList"
        >
          <!-- 使用attrInfo.attrValueList作为表格数据 -->
          <el-table-column
            prop="prop"
            label="序号"
            width="80"
            align="center"
            type="index"
          >
          </el-table-column>

          <el-table-column
            prop="prop"
            label="属性值名称"
            width="width"
            align="center"
          >
            <template slot-scope="{ row, $index }">
              <div>
                <!-- 这里结构需要用到span与input进行来回的切换 -->
                <el-input
                  v-model="row.valueName"
                  placeholder="请输入属性值名称"
                  size="mini"
                  v-if="row.flag"
                  @blur="inputChange(row)"
                  @keyup.native.enter="inputChange(row)"
                  :ref="$index"
                ></el-input>
                <span v-else @click="spanChange(row, $index)">{{
                  row.valueName
                }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
            <template slot-scope="{row,$index}">
                <!-- 一个可以弹出气泡框的按钮 -->
                <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttr($index)">
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

        <!-- 最后两个按钮 -->
        <el-button type="primary" @click="saveAttrValue">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      data: [],
      categoryId1: "",
      categoryId2: "",
      categoryId3: "",

      isShowTable: true,
      //控制表格是否显示

      attrInfo: {
        attrName: "", //属性名字
        attrValueList: [
          //存放属性值的数组
          // {
          //   attrId: 0,
          //   valueName: "",//属性值
          // },
        ],
        categoryId: 0, //id
        categoryLevel: 0, //id等级
      },
      //添加属性接口的参数
    };
  },
  methods: {
    //选择完三级联动触发 存储选择分类的id 
    getId(params) {
      const { categoryId1, categoryId2, categoryId3 } = params;
      this.categoryId1 = categoryId1;
      this.categoryId2 = categoryId2;
      this.categoryId3 = categoryId3;
    
      this.getAttrList()
    },

    //并发送请求获取相应id的商品数据
    async getAttrList(){
      let result = await this.$API.attr.reqGetTradeMarkList(
        this.categoryId1,
        this.categoryId2,
        this.categoryId3
      );
      if (result.code == 200) {
        this.data = result.data;
      }
    },

    //添加属性 同时清空之前的数据 并收集id
    addAttr() {
      this.isShowTable = false;
      //展示页面

      //重置
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.categoryId3,
        categoryLevel: 3,
        //收集id
      };
    },

    //修改属性
    updateAttr(row) {
      this.isShowTable = false;
      //展示页面

      this.attrInfo = cloneDeep(row);
      //深拷贝 获取要修改的数据

      this.attrInfo.attrValueList.forEach((p) => {
        this.$set(p, "flag", false);
      });
      //给数组的每个元素添加一个flag
    },

    //添加属性值
    addAttrInfo() {
      //往属性值数组中添加对象
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //新增属性值没有attrId 修改属性值,属性有attrId
        valueName: "",
        flag: true,
        //flag属性：给每一个属性值添加一个标记flag，用户切换查看模式与编辑模式，好处，每一个属性值可以控制自己的模式切换
        //当前flag属性，响应式数据（数据变化视图跟着变化）
      });

      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
        //自动聚焦新添加的属性值的input框
      });
    },

    //当属性值输入框失焦或enter
    inputChange(row) {
      //row是属性值数组的元素,代表这个属性值

      if (row.valueName.trim() == "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      //判断输入合法

      let result = this.attrInfo.attrValueList.some((p) => {
        if (row != p) {
          //比较自生除外的元素
          return p.valueName == row.valueName;
        }
      });
      //判断输入是否重复

      if (result) {
        this.$message("输入不能重复");
        return;
      }

      row.flag = false;
    },

    //当点击属性值的span 切换input 并实现自动聚焦
    spanChange(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },

    //删除属性值
    deleteAttr(index){
      this.attrInfo.attrValueList.splice(index,1)
      //删除数组中对应元素
    },

    //保存添加/修改的属性值
    async saveAttrValue(){
      //过滤值为空的 以及每个数组元素的flag属性
      let newarr = this.attrInfo.attrValueList.filter(p=>{
        delete p.flag
        if(p.valueName!=""){
          return true
        }
      })
      this.attrInfo.attrValueList = newarr
      //得到过滤后的参数


      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
         //发送API
         this.$message({
          message: '添加成功',
          type: 'success'
        });
         this.isShowTable = true
         this.getAttrList()
         //重新获取信息
      } catch (error) {
        this.$message.error('添加失败');
      }
  
     
      
    }
  },
};
</script>

<style>
</style>