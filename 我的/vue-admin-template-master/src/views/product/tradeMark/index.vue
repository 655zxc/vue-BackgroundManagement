<template>
  <!-- 品牌属性 -->
  <div>
    <!-- 1.按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="addTradeMark"
      >添加</el-button
    >

    <!--  2.表格组件 -->
    <!-- 
         表格组件 
         data:表格组件将来需要展示的数据------数组类型
         border：是给表格添加边框
         column属性
         label：显示标题
         width：对应列的宽度
         align：标题的对齐方式
         prop:对应列内容的字段名
         注意1：elmentUI当中的table组件，展示的数据是以一列一列进行展示数据
         -->

    <!-- 表格获取数据后:data="data",每一列的某行展示的数据就是data[某行]的元素 -->
    <el-table :data="data" style="width: 100%" border>
      <!-- 第一列 -->
      <el-table-column type="index" label="序号" width="80px" align="center">
        <!-- 这列的宽度设置为80 其余列均分  -->
      </el-table-column>

      <!-- 第二列 -->
      <!-- prop="tmName" 这一列会遍历data[x]的tmName -->
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
        align="center"
      >
      </el-table-column>

      <!-- 第三列 -->
      <!-- 这个el-table-column 就很像v-for -->
      <el-table-column
        prop="prop"
        label="品牌logo"
        width="width"
        align="center"
      >
        <!-- 解构赋值组件传来的数据 -->
        <!-- row是data[这一行]的数据 -->
        <template slot-scope="{ row }">
          <div>
            <img :src="row.logoUrl" alt="" style="width: 120px" />
            <!-- 第一页后台的图片被改成静态了 -->
            <!-- {{row.logoUrl}} -->
          </div>
        </template>
        <!-- 往插槽里插入这个结构 每一行都会显示它 -->
      </el-table-column>

      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row }">
          <div>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updateTradeMark(row)"
              >修改</el-button
            >
            <!-- row是作用域插槽解构得到的数据 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteTradeMark(row)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 
       3.分页器 
     
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange" 改变当前页面的事件 还会传递点击的详情数据

      current-page:代表的是当前第几页
      total：代表分页器一共需要展示数据条数
      page-size：代表的是每一页需要展示多少条数据
      page-sizes：代表可以设置每一页展示多少条数据
      layout：可以实现分页器布局
      pager-count:按钮的数量  如果 9  连续页码是7

    -->
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!--
      4.添加/修改功能的对话框
      :visible.sync:控制对话框显示与隐藏用的(sync 父子传值)
      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
    -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <!-- 对话框中的一个表单 -->
      <!-- model 用于收集表单数据 -->
      <el-form style="width: 80%" :model="form" :rules="rules" ref="ruleForm">
        <!-- 第一个表单元素-->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <!-- 输入框 -->
          <!-- <el-input  autocomplete="off"></el-input> -->
          <el-input v-model="form.tmName" placeholder="请输入内容"></el-input>
        </el-form-item>
        <!-- 第二个表单元素 -->
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <!-- 上传图片 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- action是上传图片的接口 -->
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <!-- 有图片就显示图片 否则显示+ -->
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <!-- 使用插槽 传入html结构到相应slot的位置 -->
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <!-- 底部的按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogFormVisible = false"
          @click.native="addOrUpdateTradeMarkList"
          >确 定</el-button
        >
      </div>
    </el-dialog>



  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      data: [],
      page: 1,
      limit: 10,
      total: 10,
      //   设置初始参数 会被后续操作修改

      dialogFormVisible: false,
      //控制添加修改的dialog是否显示

      centerDialogVisible:false,
      //删除的dialog

      form: {
        logoUrl: "",
        //图片上传成功后 收集图片在服务器里的地址
        tmName: "",
        //绑定输入框
      },
      //收集表单数据

      //表单验证
      rules: {
        //品牌名称的验证规则
        //require:必须要校验字段（前面五角星有关系）  message 提示信息    trigger:用户行为设置（事件的设置:blur、change）
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //自定义校验规则
          // { validator: validateTmName, trigger: "change" },
        ],
        //品牌的logo验证规则
        logoUrl: [{ required: true, message: "请选择品牌的图片" }],
      },
    };
  },
  methods: {
    //获取商品数据的方法
    async getPageList() {
      let result = await this.$API.trademark.reqTradeMarkList(
        this.page,
        this.limit
      );
      if (result.code == 200) {
        this.total = result.data.total;
        this.data = result.data.records;
        return "OK";
      } else {
        return Promise.reject(new Error("错误"));
      }
    },

    //分页器换页 并获取数据
    handleCurrentChange(page) {
      this.page = page;
      this.getPageList();
    },

    //分页器改数据
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },

    //添加按钮点击事件 显示dialog
    addTradeMark() {
      this.dialogFormVisible = true;

      this.form = {
        id: "",
        logoUrl: "",
        tmName: "",
      };
      //添加前清空数据
    },

    //上传图片成功之后
    handleAvatarSuccess(res, file) {
      // res file是成功后返回给前端的数据
      // 上传成功之后(没点确定) 会返回图片在服务器的地址
      this.form.logoUrl = res.data;
      //收集数据 设置logoUrl 证明图片上传成功
    },

    //上传图片之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    //点击dialog的确定按钮,添加或修改品牌 这个按钮会根据form 发送不同的api
    addOrUpdateTradeMarkList() {
      this.$refs.ruleForm.validate(async (valid) => {
        //获取节点 进行表单验证
        if (valid) {
          //表单验证成功
          //以下是发送api的代码
          const params = this.form;

          let result = "";
          if (!params.id) {
            result = await this.$API.trademark.reqAddTradeMarkList(params);
            //无id 发送添加api
          } else {
            result = await this.$API.trademark.reqUpdateTradeMarkList(params);
            //有id 发送修改api
          }

          console.log(result);

          if (result.code == 200) {
            this.getPageList();
            //重新获取数据

            this.$message({
              type: "success",
              message: this.form.id ? "修改品牌成功" : "添加品牌成功",
            });

            return "OK";
          } else {
            return Promise.reject(new Error(result.message));
          }
        } else {
          //表单验证失败
          return false;
        }
      });
    },

    //点击修改数据,生成要传递的数据,这些数据会在点击确定按钮后触发addOrUpdateTradeMarkList被传递
    updateTradeMark(row) {
      this.form = {
        id: "",
        logoUrl: "",
        tmName: "",
      };

      // this.form.id = row.id
      // this.form.logoUrl = row.logoUrl
      // this.form.tmName = row.tmName
      this.form = { ...row }; //浅拷贝 注意不能直接赋值 地址会相同
      //展示数据 获取数据

      this.dialogFormVisible = true;
      //弹出dialog
    },

    //删除商品
    async deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          
          //执行删除
          let result = await this.$API.trademark.reqDeleteTradeMarkList(row.id)
          //发送API请求
          console.log(result);
          if(result.code == 200){
            //API成功 弹出message
            this.$message({
            type: 'success',
            message: '删除成功!'
            })
            this.getPageList();
            //重新获取数据
          }
          else{
            //API失败
            this.$message({
            type: 'error',
            message: '删除失败!'
          })
          }
        }).catch(() => {
          // 执行取消删除
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      

    },


  },
  mounted() {
    //获取数据
    this.getPageList();
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>