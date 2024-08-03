<template>
  <div>
    <Main-nav />
    <Banner />
    <BlockTitle title="热卖商品" />
    <div class="container home" style="margin-bottom: 40px">
      <GoodsList :goodsList="goodsList" @fetchMoreGoodsEnven="fetchMoreGoods" />
    </div>
  </div>
</template>

<script>
import MainNav from "@/components/MainNav";
import Banner from "@/components/Banner.vue";
import BlockTitle from "@/components/BlockTitle.vue";
import GoodsList from "@/components/GoodsList.vue";
import { getAllGoods } from "@/api/Goods";

import _ from "lodash";

export default {
  name: "HomeView",
  components: {
    MainNav,
    Banner,
    BlockTitle,
    GoodsList,
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 8,
      name: "",
      goodsList: [],
    };
  },
  methods: {
    async getGoods() {
      const res = await getAllGoods({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.name,
      });
      this.goodsList = [...this.goodsList, ...res.data.records];
    },
    fetchMoreGoods() {
      this.pageNum += 1;
      this.getGoods();
    },
  },
  mounted() {
    this.getGoods();
  },
};
</script>
<style scoped>
</style>