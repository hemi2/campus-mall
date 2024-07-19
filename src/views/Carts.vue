<template>
  <div class="container">
    <Main-nav />

    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 100px;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ activeName }}</el-breadcrumb-item>

    </el-breadcrumb>

    <el-row style="margin-top: 20px;">
      <el-table :data="tableData" @selection-change="handleSelectionChange" :row-style="{ height: '170px' }">
        <el-table-column type="selection" width="100" align="center" class-name="carts-goods-selection"></el-table-column>
        <el-table-column label="商品信息" align="center" class-name="carts-goods-info" width="400">
          <template v-slot="scope">
            <router-link :to="{ name: 'detail', params: { id: scope.row.goodsId }, }">
              <el-image :src="$baseUrl + '/files/' + scope.row.img" style="margin-right: 14px;"></el-image>
            </router-link>
            <router-link :to="{ name: 'detail', params: { id: scope.row.goodsId }, }">
              <span style="display: inline-block; vertical-align: middle;">{{ scope.row.name }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" align="center" width="215"></el-table-column>
        <el-table-column label="数量" align="center">
          <template v-slot="scope">
            <el-input-number v-model.number="scope.row.count" :min="1" :max="999"
              @change="handleCountChange(scope.row)"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="scope">
            <el-button type="danger" icon="el-icon-delete" circle @click="del(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div class="carts-footer">
      <div class="footer-text-content">
        <div class="select-num">
          <span>已选 {{ total }} 件商品</span>
          <a href="#" @click.prevent="delBatch">删除选中的商品</a>
        </div>
        <div class="total">
          合计：<span>￥{{ cartAmount }}</span>
        </div>
      </div>
      <div class="footer-btn">
        <el-button type="danger" @click="handleCheckout">去结算</el-button>
      </div>
    </div>

  </div>
</template>
  
<script>
import MainNav from "@/components/MainNav";
import { throttle } from 'lodash';

export default {

  components: {
    MainNav
  },
  data() {
    return {
      tableData: [],
      ids: [],
      pageNum: 1,
      pageSize: 10,
      goodsList: [],
      activeName: "购物车",
      total: 0,
      amount: 0,
      selectRows: []
    }
  },
  computed: {
    cartAmount() {
      // 使用 reduce 直接在计算属性中计算总金额
      return this.selectRows.reduce((total, row) => total + (row.price * row.count), 0);
    },
  },
  methods: {
    getGoods() {
      this.$request.get('/carts/selectByPage', {
        params: {
          pageNum: 1,
          pageSize: 10,
        }
      }).then(res => {
        if (res.code === '0') {
          this.tableData = res.data.records
          // 这里遍历每一行数据，计算金额
          this.tableData.forEach(item => {
            item.amount = item.price * item.count; // 计算金额
          });
        }
      })
    },
    handleCountChange(row) {
      // 重新计算当前商品的金额
      row.amount = parseFloat((row.price * row.count).toFixed(2));

      this.updateCartCountThrottled(row);
    },
    // 节流函数
    updateCartCountThrottled: throttle(function (row) {
      this.$request.put("carts/update", {
        "id": parseInt(row.id, 10),
        "count": row.count
      }).then(res => {
        if (res.code === '0') {
          console.log("数量更新成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    }, 1000),

    handleSelectionChange(rows) {   // 当前选中的所有的行数据
      this.selectRows = rows
      this.ids = rows.map(v => v.id)
      //更新所选购物车商品数量
      this.total = rows.length;
    },
    delBatch() {
      if (this.ids.length === 0) {
        this.$message.warning('请选择商品');
        return;
      }
      this.$request.delete('/carts/delete/batch', { data: this.ids }).then(res => {
        if (res.code === '0') {   // 表示操作成功
          this.$message.success('删除成功')
          this.getGoods()
        } else {
          this.$message.error(res.msg)  // 弹出错误的信息
        }
      })
    },
    handleCheckout() {
      if (this.ids.length === 0) {
        this.$message.warning('请选择商品');
        return;
      }
      this.$router.push({
        path: '/order',
        query: {
          cartIds: this.ids.join(',')
        }
      })
    },
    del(id) {
      this.$request.delete("carts/delete/" + id).then(res => {
        if (res.code === '0') {
          this.$message.success('删除成功')
          this.getGoods()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  created() {
    this.getGoods()
  },

  watch: {

  },
}
</script>

<style scoped>
.carts-footer {
  background-color: #fff;
  margin-top: 30px;
  margin-bottom: 90px;
  display: flex;
}

.footer-text-content {
  width: 100%;
}

.footer-btn {
  flex: 1;
}

.footer-btn>button {
  color: #fff;
  font-size: 18px;
  height: 82px;
  margin-left: 30px;
  width: 160px;
  border-radius: 0;
}

.footer-text-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-num {
  margin-left: 30px;
}

.select-num a {
  margin-left: 15px;
  transition: .3s;
}

.select-num a:hover {
  color: #e93323
}

.total span {
  color: #e93323;
  font-size: 22px;
  font-weight: 700;
}
</style>

<style>
.type-tab .el-tabs__nav.is-stretch {
  padding: 5px 0;
  background: #fff;
}

.type-tab .el-tabs__header {
  margin-bottom: 35px;
}

.carts-goods-info .cell {
  display: flex;
  padding-left: 30px;
}

.carts-goods-info img {
  width: 96px;
  height: 96px;
}

.carts-goods-info span {
  text-align: left;
}

.carts-goods-info .el-image {
  overflow: visible;
}

.carts-goods-selection .el-checkbox__inner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

.carts-goods-selection .el-checkbox__inner::after {
  height: 9px;
  left: 6px;
}

.carts-goods-selection .el-checkbox__input.is-checked .el-checkbox__inner,
.carts-goods-selection .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #e93323;
  border-color: #e93323
}

.carts-goods-selection .el-checkbox__inner:hover {
  border-color: #e93323
}
</style>