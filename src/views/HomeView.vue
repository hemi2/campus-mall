<template>
  <div>
    <Main-nav />
    <Banner />
    <BlockTitle title="热卖商品" />
    <div class="container home" style="margin-bottom: 40px;">
      <el-row class="goods-list">
        <el-col :span="5" v-for="(item, index) in goods" :key="item.id" :offset="index % 4 > 0 ? 1 : 0"
          style="margin-bottom: 20px;">
          <router-link :to="{ name: 'detail', params: { id: item.id }, }">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="$baseUrl + '/files/' + item.img" class="image">
              <div
                style="padding: 14px;height: 100px; display: flex;flex-direction: column; justify-content: space-between;">
                <h4 class="ellipsis">{{ item.name }}</h4>
                <div class="price-box">
                  <span class="price">价格：￥{{ item.price }}</span>
                </div>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>
    <div class="loading">{{ loadMoreInfo }}</div>
  </div>
</template>

<script>
import MainNav from "@/components/MainNav";
import Banner from '@/components/Banner.vue'
import BlockTitle from '@/components/BlockTitle.vue'
import _ from 'lodash';

export default {
  name: 'HomeView',
  components: {
    MainNav,
    Banner,
    BlockTitle
  },
  data() {
    return {
      goods: [],
      pageNum: 1,
      pageSize: 8,
      name: "",
      // 初始化防抖处理的函数
      debouncedGetGoods: null,
      loadMoreInfo: "下拉加载更多"
    };
  },
  methods: {
    getGoods() {
      this.$request.get('/goods/selectByPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name
        }
      }).then(res => {
        console.log(res);
        this.goods = res.data.records
      })
    },
    handleScroll() {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= documentHeight - 10) {
        this.debouncedGetGoods();
      }
    },

    fetchMoreGoods() {
      //当前页数
      this.pageNum += 1
      this.$request.get('/goods/selectByPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name
        }
      }).then(res => {
        //如果请求的内容为空，则表示没有更多数据了
        if (res.data.records.length === 0) {
          this.loadMoreInfo = "已没有更多数据"
        }
        //将请求的商品内容追加到goods中
        this.goods = [...this.goods, ...res.data.records];
      })
    }
  },
  mounted() {
    // 创建防抖函数
    this.debouncedGetGoods = _.debounce(this.fetchMoreGoods.bind(this), 500);
    // 监听滚动事件
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    // 在组件销毁前取消防抖函数，防止内存泄漏
    this.debouncedGetGoods && this.debouncedGetGoods.cancel();
    window.removeEventListener('scroll', this.handleScroll, true);
  },
  created() {
    this.getGoods()
  },
}
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
  color: #D12423;
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