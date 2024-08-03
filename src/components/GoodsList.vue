<template>
  <div>
    <el-row class="goods-list">
      <el-col
        :span="5"
        v-for="(item, index) in goods"
        :key="item.id"
        :offset="index % 4 > 0 ? 1 : 0"
        style="margin-bottom: 20px"
      >
        <router-link :to="{ name: 'detail', params: { id: item.id } }">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="$baseUrl + '/files/' + item.img" class="image" />
            <div
              style="
                padding: 14px;
                height: 100px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              "
            >
              <h4 class="ellipsis">{{ item.name }}</h4>
              <div class="price-box">
                <span class="price">价格：￥{{ item.price }}</span>
              </div>
            </div>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
    <div class="loading">{{ loadMoreInfo }}</div>
  </div>
</template>

<script>
import _ from "lodash";
import { getAllGoods, getGoodsByTypeId } from "@/api/Goods";

export default {
  props: {
    goodsList: Array,
  },
  data() {
    return {
      goods: this.goodsList,
      // 初始化防抖处理的函数
      debouncedGetGoods: null,
      loadMoreInfo: "下拉加载更多",
      //下滑触发阈值
      threshold: 500,
      //防抖函数节流时间
      throttleTime: 100,
    };
  },
  methods: {
    //判断页面是否到底部
    handleScroll() {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= documentHeight - this.threshold) {
        this.debouncedGetGoods();
      }
    },
    fetchMoreGoods() {
      this.$emit("fetchMoreGoodsEnven", this.goods);
    },
  },
  mounted() {
    // 创建防抖函数
    this.debouncedGetGoods = _.debounce(
      this.fetchMoreGoods.bind(this),
      this.throttleTime
    );
    // 监听滚动事件
    window.addEventListener("scroll", this.handleScroll, true);
  },
  destroyed() {
    // 在组件销毁前取消防抖函数，防止内存泄漏
    this.debouncedGetGoods && this.debouncedGetGoods.cancel();
    window.removeEventListener("scroll", this.handleScroll, true);
  },
  watch: {
    goodsList(newVal, oldVal) {
      this.goods = newVal;
      this.loadMoreInfo = "下拉加载更多";
      if (newVal.length === oldVal.length) {
        this.loadMoreInfo = "无更多内容";
      }
    },
  },
};
</script>

<style scoped>
.loading {
  text-align: center;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.goods-list .price {
  color: #d12423;
  width: 100%;
}

.goods-list .bottom {
  margin-top: 13px;
  line-height: 40px;
}

.goods-list .image {
  width: 100%;
  display: block;
  height: 358px;
  object-fit: cover;
}

.goods-list .ellipsis {
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 10px 0;
}
</style>