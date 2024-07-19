<template>
  <div class="container">
    <Main-nav />
    <div class="wrap-bg">
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="mainpic">
            <el-image :src="$baseUrl + '/files/' + goodsData.img"
              :preview-src-list="[$baseUrl + '/files/' + goodsData.img]">
            </el-image>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="iteminfo">
            <div class="itemHeader">
              <h1>{{ goodsData.name }}</h1>
            </div>
            <div class="price">
              <div class="money">
                <div>￥<span>{{ goodsData.price }}</span></div>
              </div>
              <div class="sales"><span class="num">84</span>销量</div>
            </div>
            <div class="type">分类：<span>{{ goodsData.typeName }}</span></div>
            <div class="count">
              <span>数量：</span>
              <el-input-number v-model="num" :min="1" :max="99" label="数量"></el-input-number>
            </div>
            <div class="btn-box">
              <el-button-group>
                <el-button type="danger" round class="buy" @click="checkout">立即购买</el-button>
                <el-button type="warning" round class="car" @click="add">加入购物车</el-button>
              </el-button-group>
            </div>
          </div>
        </el-col>
      </el-row>
      <div style="margin-top: 30px; padding: 20px;" class="goods-detail">
        <el-row>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="商品详情" name="description">
              <div class="text-content">
                <div v-html="goodsData.description"></div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="商品评价" name="comment">商品评价</el-tab-pane>
          </el-tabs>
        </el-row>
      </div>
    </div>

  </div>
</template>
  
<script>
import MainNav from "@/components/MainNav";

export default {

  components: {
    MainNav
  },
  data() {
    return {
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      num: 1,
      activeName: "description",
      goodsData: {}
    }
  },

  methods: {
    handleClick() {

    },
    add() {
      this.$request.post("carts/add", {
        "goodsId": parseInt(this.goodsId, 10),
        "count": this.num
      }).then(res => {
        if (res.code === '0') {
          this.$message.success('加入购物车成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    checkout() {
      this.$router.push({
        path: '/order',
        query: {
          goodsId: this.goodsId,
          quantity: this.num
        }
      })
    }
  },
  mounted() {
    this.$request.get("goods/selectById/" + this.goodsId).then(res => {
      this.goodsData = res.data
    })
  },
  computed: {
    goodsId() {
      return this.$route.params.id
    }
  },
  watch: {

  },
}
</script>

<style scoped>
.wrap-bg {
  background-color: white;
  margin: 100px 0;
  border-radius: 20px;
  min-height: 2000px;
}

.mainpic {
  padding: 20px;
  border-radius: 20px;
}

.iteminfo {
  display: flex;
  flex-wrap: wrap;
  padding-right: 20px;
}

.iteminfo .price .money {
  flex: 1;
  padding-left: 32px;
  display: flex;
  align-items: center;
  font-size: 22px;
}

.iteminfo .price .money span {
  font-size: 32px;
  font-weight: 700;
}

.iteminfo .price .sales {
  font-size: 14px;
  height: 100%;
  padding: 0 25px;
  position: relative;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  display: flex;
}

.iteminfo .price .sales::before {
  border-left: 1px solid hsla(0, 0%, 100%, .24);
  bottom: 12px;
  content: "";
  left: 0;
  position: absolute;
  top: 14px;
  width: 1px;
}

.iteminfo .price .sales .num {
  font-size: 21px;
}

.iteminfo .price {
  background: url("@/assets/img/pricebg.png") 50% / cover no-repeat;
  height: 74px;
  display: flex;
  align-content: center;
  color: #fff;
  font-size: 28px;
  border-radius: 10px;
}

.iteminfo .type,
.iteminfo .btn-box,
.iteminfo .price,
.iteminfo .count {
  margin-top: 25px;
  width: 100%;
}

.iteminfo .btn-box .buy {
  background: #e93323;
  transition: .3s;
}

.iteminfo .btn-box .buy:hover {
  background: #f13928;

}

.text-content {
  width: 750px;
  margin: 0 auto;
}
</style>

<style>
.el-row {
  margin-bottom: 20px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.mainpic .el-image__inner {
  object-fit: cover;
}

.goods-detail .el-tabs__item {
  font-size: 18px;
}

.goods-detail .el-tabs__active-bar {
  background: #f13928;
}

.goods-detail .el-tabs__item.is-active {
  color: #f13928;
}

.goods-detail .el-tabs__item:hover {
  color: #f13928;
}

.goods-detail .el-tabs__nav-wrap {
  padding: 0 10px;
}

.goods-detail .el-tabs__active-bar .is-top {}


.wrap-bg .mainpic .el-image__inner {
  width: 100%;
  width: 100%;
  border-radius: 20px;
}
</style>