<template>
  <div class="container">
    <Main-nav />

    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 100px;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/carts' }">购物车</el-breadcrumb-item>
      <el-breadcrumb-item>{{ activeName }}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row style="margin-top: 20px;">

      <Address :isOptional="true" :isAction="false" :isShowAll="false" @address-change="getCurrentAddressId">
        <template #title>
          <div class="title">收货地址</div>
        </template>
      </Address>

      <div class="order">
        <div class="title">订单信息</div>
        <div class="goods">
          <div class="list">
            <div class="item" v-for="item in goodsList" :key="item.id">
              <div class="left-text">
                <div class="pictrue">
                  <img :src="$baseUrl + '/files/' + item.img" alt="">
                </div>
                <div class="text line2">{{ item.name }}</div>
              </div>
              <div>
                <span class="price">¥{{ item.price }}</span>
                <span class="num">x{{ item.count }}</span>
                <span class="amount">{{ item.price * item.count }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="totalAmount">
          应付总额：
          <span class="money">¥{{ totalAmount }}</span>
        </div>
        <div class="submit-btn">
          <el-button type="danger" @click="checkout">提交订单</el-button>
        </div>
      </div>

    </el-row>
  </div>
</template>
  
<script>
import MainNav from "@/components/MainNav";
import Address from "@/components/Address";

export default {

  components: {
    MainNav,
    Address
  },
  data() {
    return {
      tableData: [],
      activeName: "确认订单",
      cartIds: [],
      currentAddressId: 0,
      goodsList: [],
      //商品详情页路由携带的商品id和数量
      goodsId: '',
      quantity: 0,
      orderToken: ''
    }
  },

  methods: {
    // 根据路由查询参数初始化商品ID列表
    getCartIds() {
      if (this.$route.query.cartIds) {
        // 如果是购物车参数
        this.cartIds = this.$route.query.cartIds.trim().split(",")
        this.cartIds = this.cartIds.map(item => {
          return parseInt(item, 10);
        });
      } else if (parseInt(this.$route.query.goodsId, 10) && parseInt(this.$route.query.quantity, 10)) {
        // 如果是商品详情参数
        this.goodsId = parseInt(this.$route.query.goodsId, 10)
        this.quantity = parseInt(this.$route.query.quantity, 10)
      } else {
        this.$message.error('参数错误')
        this.$router.push('/404')
      }
    },
    selectGoods() {
      if (this.cartIds.length) {
        // 根据购物车id查询商品列表
        this.$request.post('/carts/selectByIds', this.cartIds).then(res => {
          if (res.code === '0') {
            this.goodsList = res.data
          } else {
            this.$message.error(res.msg)
          }
        })
      } else if (this.goodsId && this.quantity) {
        // 根据商品id查询商品列表
        this.$request.get('/goods/selectById/' + this.goodsId).then(res => {
          if (res.code === '0') {
            console.log(res);
            const resData = {
              goodsId: res.data.id,
              name: res.data.name,
              img: res.data.img,
              price: res.data.price,
              count: this.quantity,
            }
            this.goodsList = [resData]
            console.log(this.goodsList);
          } else {
            this.$message.error(res.msg)
          }
        })
      }

    },
    checkout() {
      if (this.currentAddressId === 0) {
        this.$message.warning('请选择地址')
        return
      }
      this.$request.post('/orders/createOrder', {
        addressId: this.currentAddressId,
        goodsList: this.goodsList,
        token: this.orderToken
      }).then(res => {
        if (res.code === '0') {
          this.$message.success('下单成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getCurrentAddressId(val) {
      this.currentAddressId = val
    }
  },
  mounted() {
    // 根据路由查询参数初始化商品ID列表
    this.getCartIds()
    this.selectGoods()
    this.$request.get('/orders/getOrderToken').then(res => {
      this.orderToken = res.data
    })
  },
  computed: {
    //计算金额
    totalAmount() {
      return this.goodsList.reduce((total, item) => {
        return total + item.price * item.count
      }, 0)
    }
  },
  watch: {

  },
}
</script>

<style scoped>
.order {
  background: #fff;
}
.order .title {
  font-size: 18px;
  height: 64px;
  line-height: 64px;
  padding: 0 35px;
}
.line2,
.line4 {
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  word-break: break-all;
}

.line2 {
  -webkit-line-clamp: 2;
}

.line4 {
  -webkit-line-clamp: 4;
}


.order .goods {
  border: 1px solid #efefef;
  margin: 0 auto;
  padding: 26px 32px;
  margin: 25px;
}

.order .goods .list .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 26px;
}

.order .goods .list .item .left-text {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.order .goods .list .item .left-text .text {
  width: 342px;
  margin-left: 10px;
}


.order .pictrue {
  height: 64px;
  width: 64px;
}

.order .pictrue img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.order .goods .list .item .amount {
  display: inline-block;
  font-size: 16px;
  font-weight: 700;
  text-align: right;
  width: 130px;
  color: #e93323;
}

.order .goods .list .item .num {
  margin-left: 18px;
  font-size: 14px;
}

.totalAmount {
  background: #f4f5f5;
  height: 70px;
  line-height: 70px;
  margin: 65px 20px 0;
  padding-right: 22px;
  text-align: right;
}

.totalAmount .money {
  display: inline-block;
  font-size: 20px;
  font-weight: 700;
  margin-left: 4px;
  width: 120px;
  color: #e93323;
}

.order {
  padding-bottom: 60px;
  margin-bottom: 40px;
}

.submit-btn {
  display: flex;
  justify-content: flex-end;
  margin: 38px 20px 0 0;
}
</style>

<style>
.order .submit-btn .el-button {
  height: 46px;
  width: 180px;
}
</style>