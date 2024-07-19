<template>
  <div class="container">
    <Main-nav />

    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 100px;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ activeName }}</el-breadcrumb-item>

    </el-breadcrumb>

    <el-row style="margin-top: 20px;" class="type-tab">
      <el-tabs :value="String(typeId)" @tab-click="handleClick" :stretch="true">
        <el-tab-pane v-for="item in type" :key="item.id" :label="item.name" :name="String(item.id)">
          <el-row class="goods-list">
            <el-col :span="5" v-for="(item, index) in goodsList" :key="item.id" :offset="index % 4 > 0 ? 1 : 0"
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
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <div class="loading">{{ loadMoreInfo }}</div>

  </div>
</template>
  
<script>
import MainNav from "@/components/MainNav";
import { getTypeList } from '@/api/type'

export default {

  components: {
    MainNav
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 8,
      goodsList: [],
      activeName: "",
      type: [],
      content: [],
      typeId: '',
      // 初始化防抖处理的函数
      debouncedGetGoods: null,
      loadMoreInfo: "下拉加载更多"

    }
  },

  methods: {
    handleClick(tab) {
      this.pageNum = 1
      this.typeId = tab.name
      //更新分类商品信息
      this.getGoods()
      //更新面包屑
      this.activeName = tab.label
    },
    async initData() {
      //获取所有分类
      const responseType = await getTypeList()
      this.type = responseType.data
      // 如果路由上没有带有分类id，则对分类id默认设置一个
      this.typeId = this.routeTypeId ? this.routeTypeId : this.type[0].id
      //获取分类商品
      await this.getGoods()
      //根据分类id获取分类名称用于面包屑的展示
      await this.getTypeById()
    },
    getGoods() {
      this.$request.get("goods/selectByTypeId", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          typeId: this.typeId
        }
      }).then(res => {
        this.goodsList = res.data.records
      })
    },
    getTypeById() {
      this.$request.get("type/selectById/" + this.typeId).then(res => {
        console.log(res);

        this.activeName = res.data.name
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
      this.$request.get('/goods/selectByTypeId', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          typeId: this.typeId
        }
      }).then(res => {
        //如果请求的内容为空，则表示没有更多数据了
        if (res.data.records.length === 0) {
          this.loadMoreInfo = "已没有更多数据"
        }
        //将请求的商品内容追加到goods中
        this.goodsList = [...this.goodsList, ...res.data.records];
      })
    }
  },

  mounted() {
    this.initData()
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
  computed: {
    routeTypeId() {
      return this.$route.query.id
    }
  },
  watch: {

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

</style>

<style>
.type-tab .el-tabs__nav.is-stretch {
  padding: 5px 0;
  background: #fff;
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