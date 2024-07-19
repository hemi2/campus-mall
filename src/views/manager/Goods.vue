<template>
  <div>
    <div>
      <el-input style="width: 200px" placeholder="查询名称" v-model="name"></el-input>
      <el-button type="primary" style="margin-left: 10px" @click="load(1)">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
    </div>
    <div style="margin: 10px 0">
      <el-button type="primary" plain @click="handleAdd">新增</el-button>
      <el-button type="danger" plain @click="delBatch">批量删除</el-button>
    </div>
    <el-table :data="tableData" stripe :header-cell-style="{ backgroundColor: 'aliceblue', color: '#666' }"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="img" label="封面">
        <template v-slot="scope">
          <el-image :src="$baseUrl + '/files/' + scope.row.img" :preview-src-list="[$baseUrl + '/files/' + scope.row.img]"
            style="width: 60px;"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="商品描述">
        <template v-slot="scope">
          <el-button @click="showContent(scope.row.description)" size="mini" type="primary">显示内容</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="商品价格"></el-table-column>
      <el-table-column prop="typeName" label="分类名称"></el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template v-slot="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" plain @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 10px 0">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
        layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="信息" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false" @close="closeDialog">
      <el-form :model="form" label-width="80px" style="padding-right: 20px" :rules="rules" ref="formRef">
        <el-form-item label="封面" prop="img" ref="uploadCover">
          <el-upload class="avatar-uploader" :action="$baseUrl + '/files/upload'" :show-file-list="false"
            :headers="{ 'token': this.token }" :on-success="handleCoverSuccess" list-type="picture">
            <el-button type="primary">上传封面</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="form.price" placeholder="价格"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="typeId">
          <el-select style="width: 100%" v-model="form.typeId">
            <el-option v-for="item in types" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品描述" prop="description">
          <div id="editor"></div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="商品描述" :visible.sync="fromVisible1" width="60%">
      <el-card class="w-e-text">
        <div v-html="content"></div>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="fromVisible1 = false">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import request from "@/utils/request";
import { getToken } from '@/utils/auth'
import { getTypeList } from '@/api/type'
import E from "wangeditor"
import hljs from 'highlight.js'

export default {
  name: "goods",
  data() {
    return {
      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      name: '',     //查询名称
      total: 0,
      fromVisible: false,
      form: {},
      rules: {
        img: [{
          validator: (rule, value, callback) => {
            if (this.form.img === '' || this.form.img === undefined) {
              callback(new Error('请上传图片'));
            } else {
              callback();
            }
          },
          trigger: 'change'
        },
        ],
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { pattern: /^\d+(\.\d{1,2})?$/, message: '价格格式不正确', trigger: 'blur' },
        ],
        typeId: [{ required: true, message: '请选择分类', trigger: 'change' }],
      },
      ids: [],
      types: [],
      editor: null,
      content: '',
      fromVisible1: false,
    }
  },
  computed: {
    token() {
      return getToken()
    }
  },
  created() {
    this.load()
    this.getType()
  },
  methods: {
    delBatch() {
      if (!this.ids.length) {
        this.$message.warning('请选择数据')
        return
      }
      this.$confirm('您确认批量删除这些数据吗？', '确认删除', { type: "warning" }).then(response => {
        request.delete('/goods/delete/batch', { data: this.ids }).then(res => {
          if (res.code === '0') {   // 表示操作成功
            this.$message.success('操作成功')
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => { })
    },
    handleSelectionChange(rows) {   // 当前选中的所有的行数据
      this.ids = rows.map(v => v.id)
    },
    del(id) {
      this.$confirm('您确认删除吗？', '确认删除', { type: "warning" }).then(response => {
        request.delete('/goods/delete/' + id).then(res => {
          if (res.code === '0') {   // 表示操作成功
            this.$message.success('操作成功')
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => { })
    },
    handleEdit(row) {   // 编辑数据
      this.form = JSON.parse(JSON.stringify(row))  // 给form对象赋值  注意要深拷贝数据
      this.fromVisible = true   // 打开弹窗
      this.setRichText()
      setTimeout(() => {
        this.editor.txt.html(row.description)  // 设置富文本内容
      }, 0)
    },
    handleAdd() {   // 新增数据
      this.form = {}  // 新增数据的时候清空数据
      this.fromVisible = true   // 打开弹窗

      this.setRichText()
    },
    save() {   // 保存按钮触发的逻辑  它会触发新增或者更新
      this.$refs.formRef.validate((valid) => {
        console.log(valid);
        if (valid) {
          this.sendSaveRequest()
        }
      })
    },
    sendSaveRequest() {
      // 获取编辑框的内容
      let content = this.editor.txt.html()
      this.form.description = content

      request({
        url: this.form.id ? '/goods/update' : '/goods/add',
        method: this.form.id ? 'PUT' : 'POST',
        data: this.form
      }).then(res => {
        if (res.code === '0') {  // 表示成功保存
          this.$message.success('保存成功')
          // 重新加载数据
          this.load(1)
          this.fromVisible = false
        } else {
          this.$message.error(res.msg)  // 弹出错误的信息
        }
      })
    },
    reset() {
      this.name = ''
      this.load()
    },
    load(pageNum) {  // 分页查询
      if (pageNum) this.pageNum = pageNum
      request.get('/goods/selectByPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum)
    },
    getType() {
      getTypeList().then(res => {
        if (res.code === '0') {
          this.types = res.data
        }
      })
    },
    handleCoverSuccess(res) {
      if (res.code === '0') {
        // 清空校验
        this.$refs.uploadCover.clearValidate();
        this.form.img = res.data
        this.$message.success('上传成功')
      }
    },
    showContent(content) {
      this.content = content
      this.fromVisible1 = true
    },
    setRichText() {
      this.$nextTick(() => {
        this.editor = new E(`#editor`)
        this.editor.highlight = hljs
        this.editor.config.uploadImgServer = this.$baseUrl + '/files/editor/upload'
        this.editor.config.uploadFileName = 'file'
        this.editor.config.uploadImgHeaders = {
          token: this.token
        }
        this.editor.config.uploadImgParams = {
          type: 'img',
        }
        this.editor.config.uploadVideoServer = this.$baseUrl + '/files/editor/upload'
        this.editor.config.uploadVideoName = 'file'
        this.editor.config.uploadVideoHeaders = {
          token: this.token
        }
        this.editor.config.uploadVideoParams = {
          type: 'video',
        }
        this.editor.create()  // 创建
      })
    },
    // 在dialog销毁时调用
    closeDialog() {
      // 销毁编辑器
      this.editor.destroy()
      this.editor = null
    },
  }
}
</script>

<style scoped></style>