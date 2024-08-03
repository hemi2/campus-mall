<template>
  <div class="container">
    <Main-nav />

    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="margin-top: 100px"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ activeName }}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row style="margin-top: 20px" class="type-tab">
      <el-tabs :value="String(typeId)" @tab-click="handleClick" :stretch="true">
        <el-tab-pane
          v-for="item in type"
          :key="item.id"
          :label="item.name"
          :name="String(item.id)"
        >
        </el-tab-pane>
        <GoodsList
          :goodsList="goodsList"
          @fetchMoreGoodsEnven="fetchMoreGoods"
        />
      </el-tabs>
    </el-row>
  </div>
</template>
  
<script>
import MainNav from "@/components/MainNav";
import GoodsList from "@/components/GoodsList.vue";

import { getTypeList, getTypeById } from "@/api/type";
import { getGoodsByTypeId } from "@/api/Goods";

export default {
  components: {
    MainNav,
    GoodsList,
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 8,
      goodsList: [],
      activeName: "",
      type: [],
      content: [],
      typeId: "",
    };
  },

  methods: {
    handleClick(tab) {
      this.typeId = tab.name;
      //更新面包屑
      this.activeName = tab.label;
      (this.pageNum = 1), (this.goodsList = []);
      this.getGoods();
    },
    async initData() {
      //获取所有分类
      const responseType = await getTypeList();
      this.type = responseType.data;
      // 如果路由上没有带有分类id，则对分类id默认设置一个
      this.typeId = this.routeTypeId ? this.routeTypeId : this.type[0].id;
      this.getGoods();
      //根据分类id获取分类名称用于面包屑的展示
      const activeName = await getTypeById(this.typeId);
      this.activeName = activeName.data.name;
    },

    async getGoods() {
      const res = await getGoodsByTypeId({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        typeId: this.typeId,
      });
      this.goodsList = [...this.goodsList, ...res.data.records];
    },
    fetchMoreGoods() {
      this.pageNum += 1;
      this.getGoods();
    },
  },

  created() {
    this.initData();
  },
  computed: {
    routeTypeId() {
      return this.$route.query.id;
    },
  },
};
</script>

<style scoped>
</style>

<style>
.type-tab .el-tabs__nav.is-stretch {
  padding: 5px 0;
  background: #fff;
}
</style>