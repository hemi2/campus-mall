<template>
  <div class="user-manager">
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
      <el-table-column prop="avatar" label="头像" width="70" align="center">
        <template v-slot="scope">
          <img :src="$baseUrl + '/files/' + scope.row.avatar" style="width: 50px; height: 50px; border-radius: 50%" />
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户名称" width="200" align="center"></el-table-column>
      <el-table-column prop="email" label="用户邮箱" align="center"></el-table-column>
      <el-table-column prop="role" label="用户身份" width="100" align="center"></el-table-column>

      <el-table-column prop="createdAt" label="注册时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt.split('.')[0].replace('Z', '') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template v-slot="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" plain @click="del(scope.row.userId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 10px 0">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
        layout="total, prev, pager, next" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="用户信息" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false">
      <el-form :model="form" label-width="80px" style="padding-right: 20px" :rules="formRules" ref="formRef">

        <el-form-item label="头像" prop="avatar" ref="uploadCover">
          <el-upload class="avatar-uploader" :action="$baseUrl + '/files/upload'" :show-file-list="false"
            :headers="{ 'token': this.token }" :on-success="handleCoverSuccess" list-type="picture">
            <el-button type="primary">上传头像</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="form.userName" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="form.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="用户身份" prop="role">
          <el-select style="width: 100%" v-model="form.role">
            <el-option value="user" label="普通用户"></el-option>
            <el-option value="admin" label="管理员"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import request from "@/utils/request";
import { getToken } from '@/utils/auth'

export default {
  name: "UserManager",
  data() {
    // 表单验证规则提取
    const validateAvatar = (rule, value, callback) => {
      if (!this.form.avatar) {
        callback(new Error('请上传头像'));
      } else {
        callback();
      }
    };

    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      name: '',
      total: 0,
      fromVisible: false,
      form: {},
      formRules: {
        userName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        role: [{ required: true, message: '请选择用户身份', trigger: 'blur' }],
        avatar: [{ validator: validateAvatar, trigger: 'change' }]
      },
      ids: [],
      loading: false
    }
  },
  computed: {
    token() {
      return getToken()
    }
  },
  methods: {
    async load(pageNum = this.pageNum) {
      try {
        this.loading = true
        const { data } = await request.get('/user/selectByPage', {
          params: {
            pageNum,
            pageSize: this.pageSize,
            name: this.name.trim()
          }
        })
        this.tableData = data.records
        this.total = data.total
      } catch (error) {
        this.$message.error('数据加载失败')
      } finally {
        this.loading = false
      }
    },

    async sendSaveRequest() {
      try {
        const { code, msg } = await request({
          url: this.form.userId ? '/user/update' : '/user/add',
          method: this.form.userId ? 'PUT' : 'POST',
          data: this.form
        })
        
        if (code === '0') {
          this.$message.success('保存成功')
          this.fromVisible = false
          await this.load(1)
        } else {
          this.$message.error(msg || '操作失败')
        }
      } catch (error) {
        this.$message.error('操作失败')
      }
    },

    handleCoverSuccess(res) {
      if (res.code === '0') {
        this.form.avatar = res.data
        this.$refs.uploadCover.clearValidate()
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.msg || '上传失败')
      }
    },

    delBatch() {
      if (!this.ids.length) {
        this.$message.warning('请选择数据')
        return
      }
      this.$confirm('您确认批量删除这些数据吗？', '确认删除', { type: "warning" }).then(response => {
        request.delete('/user/delete/batch', { data: this.ids }).then(res => {
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
        request.delete('/user/delete/' + id).then(res => {
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
      console.log(this.form);
    },
    handleAdd() {   // 新增数据
      this.form = {}  // 新增数据的时候清空数据
      this.fromVisible = true   // 打开弹窗
    },
    save() {   // 保存按钮触发的逻辑  它会触发新增或者更新
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.sendSaveRequest()
        }
      })
    },
    reset() {
      this.name = ''
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum)
    },
  },
  created() {
    this.load()
  }
}
</script>

<style lang="scss" scoped>
.user-manager {
  padding: 20px;
  
  .avatar-uploader {
    display: inline-block;
  }
}
</style>