<template>
  <div class="banner-wrap">
    <div class="categorys">
      <div class="head">全部商品分类</div>
      <div class="con">
        <div class="item" v-for="item in type" :key="item.id">
          <router-link :to="{ path: '/typeColumn', query: { id: item.id }, }">

            {{ item.name }}

          </router-link>

        </div>
      </div>
    </div>

    <el-carousel height="100%" direction="vertical" :autoplay="false" c>
      <el-carousel-item v-for="item in imgList" :key="item.id">
        <img :src=item.img alt="">
      </el-carousel-item>
    </el-carousel>

  </div>


  <!-- jumbotron-end -->
</template>

<script>
import { getTypeList } from '@/api/type'

export default {
  name: "Banner",
  data() {
    return {
      imgList: [
        { id: 0, img: require("@/assets/img/banner1.jpg") },
        { id: 1, img: require("@/assets/img/banner2.png") },
        { id: 2, img: require("@/assets/img/banner3.png") }
      ],
      type: []
    };
  },
  methods: {
    getType() {
      getTypeList().then(res => {
        if (res.code === '0') {
          this.type = res.data
        }
      })
    }
  },
  mounted() {
    this.getType()
  },
};
</script>

<style scoped>
.banner-wrap {
  display: flex;
}

.categorys {
  width: 250px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.head {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: #b1191a;
  color: #fff;
  padding-top: 70px;
}

.con {
  background: #c81623;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.con .item {
  padding: 14px 0;
  width: 100%;
  text-align: center;
  transition: .3s;
}

.con .item:hover {
  background: #de2f3c;
}










.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
<style>
#app .el-carousel {
  width: 100%;
}
</style>