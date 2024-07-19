<template>
  <div class="container">
    <Main-nav />

    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 100px;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/carts' }">购物车</el-breadcrumb-item>
      <el-breadcrumb-item>{{ activeName }}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row style="margin-top: 20px;">
      <div class="orderList">
        <div class="title">订单信息</div>
        <div class="orderItem" v-for="orderItem in orderList" :key="orderItem.orderNumber">
          <div class="order-txt">
            <div>{{ orderItem.orderTime }}<span style="margin-left: 20px;">订单号: {{ orderItem.orderNumber }}</span></div>

            <div class="status">{{ orderItem.status }}</div>
          </div>
          <div class="content">
            <div class="item" v-for="goodsItem in orderItem.goodsList" :key="goodsItem.goodsId">
              <div class="pictrue">
                <img :src="$baseUrl + '/files/' + goodsItem.img" alt="">
              </div>
              <div class="info-txt">
                <div class="text line2">{{ goodsItem.name }}</div>
                <div class="num">
                  <div style="color:#e93323;">￥{{ goodsItem.price }}</div>
                  <div>x{{ goodsItem.count }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="foot">
            <p>共{{ orderItem.goodsCount }}件商品，总金额 ￥{{ orderItem.totalPrice }}</p>
            <div class="btn-wrap">
              <el-button>取消订单</el-button>
              <el-button type="danger">立即付款</el-button>
              <el-button type="danger">查看详情</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-row>
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
      tableData: [],
      activeName: "我的订单",
      goodsList: [],
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      orderList: []
    }
  },

  methods: {

  },
  async mounted() {
    await this.$request.get('/orders/getOrderList', {
      params: {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
    }).then(res => {
      if (res.code === '0') {
        let orderList = res.data
        orderList.reverse()
        // 遍历 orderList 为每个订单添加商品总数的属性
        orderList.forEach((currentValue) => {
          // 检查 goodsList 是否存在且为数组，避免 reduce 抛出错误
          if (Array.isArray(currentValue.goodsList)) {
            // 使用 reduce 计算商品总数
            currentValue["goodsCount"] = currentValue.goodsList.reduce((prev, cur) => {
              // 确保 cur.count 是数字类型，避免因为非法值导致的错误
              return prev + (Number.isFinite(cur.count) ? cur.count : 0);
            }, 0);
          } else {
            // 如果 goodsList 不存在或不是数组，将 goodsCount 设置为 0
            currentValue["goodsCount"] = 0;
          }
        });
        this.orderList = orderList
      } else {
        this.$message.error(res.msg)
      }
    })
    //遍历this.orderList

  },
  computed: {

  },
  watch: {

  },
}
</script>

<style scoped>
.orderList {
  background: #fff;
  padding: 20px;
}

.orderItem {
  margin: 10px 0;
  padding: 35px 0;
  border-top: 1px solid #ececec;
}

.orderList .order-txt {
  display: flex;
  justify-content: space-between;
}

.orderList .order-txt .status {
  color: #e93323;
}

.orderList .content {
  margin-top: 20px;
}

.orderList .content .item {
  display: flex;
  margin-bottom: 20px;
}

.orderList .content .item .pictrue {
  width: 80px;
  height: 80px;
}

.orderList .content .item .pictrue img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.orderList .content .item .info-txt {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 24px;
  position: relative;
  width: 500px;
}

.orderList .content .item .info-txt .num {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}

.orderList .foot {
  border-top: 1px dashed #e1e1e1;
  position: relative;
}

.orderList .foot p {
  text-align: right;
}

.orderList .foot .btn-wrap {
  display: flex;
  justify-content: flex-end;
}
</style>

<style></style>