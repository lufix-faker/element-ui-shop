<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb>
      <template v-slot:firstItem>商品管理</template>
      <template v-slot:secondItem>商品列表</template>
    </Breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示文本 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="handleTabBeforeLeave"
          @tab-click="tabClick"
        >
          <!-- 标签-基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleCateChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 标签-商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, ci) in item.attr_vals"
                  :key="ci"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 标签-商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染表单的item项 -->
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 输入框 -->
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 标签-商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传组件 -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handleUploadPreview"
              :on-remove="handleUploadRemove"
              :on-success="handleUploadSuccess"
              list-type="picture"
              :headers="headersObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 标签-商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑框 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <div class="addBtnBox">
              <el-button type="primary" @click="addGoods">添加商品</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 上传图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="uploadPreviewVisible"
      width="50%"
    >
      <!-- 图片 -->
      <img :src="uploadPreviewUrl" alt="" class="uploadPreviewImg" />
    </el-dialog>
  </div>
</template>

<script>
import { getCateList, getAttributes, addGoods } from "network/home.js";

import _ from 'lodash';

import Breadcrumb from "components/common/Breadcrumb";

export default {
  name: "Add",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      // 当前选项卡
      activeIndex: "0",

      // 添加商品表单
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        // 上传图片的数组
        pics: [],
        // 商品内容介绍
        goods_introduce: "",
        // 商品参数和属性
        attrs: []
      },
      // 添加商品表单规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },

      // 商品分类
      cateList: [],
      // 商品分类配置
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },

      // 动态参数列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],

      // 上传图片请求地址
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 上传请求头加authorization字段
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 上传图片预览对话框状态
      uploadPreviewVisible: false,
      // 上传图片预览对话框图片地址
      uploadPreviewUrl: "",
    };
  },
  created() {
    // 获取商品分类
    this.getCateList();
  },
  computed: {
    // 商品分类id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const { data: res } = await getCateList();
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      // 获取成功
      this.cateList = res.data;
    },
    // 商品分类改变
    handleCateChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        return;
      }
    },
    // 标签页切换前触发
    handleTabBeforeLeave(activeTab, oldActiveTab) {
      if (oldActiveTab == "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
    },
    // 标签页切换触发
    async tabClick() {
      if (this.activeIndex === "1") {
        const { data: res } = await getAttributes(this.cateId, {
          sel: "many",
        });
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数失败！");
        }
        // 获取成功
        // 处理每一项的attr_vals
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });

        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await getAttributes(this.cateId, {
          sel: "only",
        });
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性失败！");
        }
        // 获取成功
        // 处理每一项的attr_vals
        // res.data.forEach(item => {
        //   item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ');
        // })

        this.onlyTableData = res.data;
        console.log(this.onlyTableData);
      }
    },
    // 上传图片预览
    handleUploadPreview(file) {
      this.uploadPreviewUrl = file.response.data.url;
      this.uploadPreviewVisible = true;
    },
    // 上传图片移除
    handleUploadRemove(file) {
      const file_path = file.response.data.tmp_path;
      // 查找pics数组中的第i个元素
      const i = this.addForm.pics.findIndex((item) => item.pic === file_path);
      // 然后删除
      this.addForm.pics.splice(i, 1);
    },
    // 上传图片成功
    handleUploadSuccess(response) {
      const pic = { pic: response.data.tmp_path };
      this.addForm.pics.push(pic);
    },

    // 添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) {
          return this.$message.error('请填写必需的表单项！');
        }
        // 验证成功
        // 处理商品分类 数组转成字符串
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(',');
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          };
          this.addForm.attrs.push(newInfo);
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          this.addForm.attrs.push(newInfo);
        })
        form.attrs = this.addForm.attrs;

        // 发起添加商品请求
        const {data: res} = await addGoods(form);
        if(res.meta.status !== 201) {
          return this.$message.error('添加商品失败！');
        }
        // 添加成功
        this.$message.success('添加商品成功！');
        this.$router.push('/goods');

      })
    }
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 !important;
}

.uploadPreviewImg {
  width: 100%;
}

.addBtnBox {
  display: flex;
  justify-content: flex-end;
  margin: 15px 20px 0 0;
}
</style>