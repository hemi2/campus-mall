<template>
    <div>
        <div class="address">
            <slot name="title"></slot>
            <div class="list" :class="isShowAll ? 'on' : isShowMore ? 'on' : ''">
                <div class="item" :class="item.id === currentAddressId ? 'on' : ''" v-for="item in addressData"
                    :key="item.id" @click="selectAddress(item)">
                    <div class="content">
                        <div class="name">{{ item.name }}</div>
                        <div class="phone">{{ item.phone }}</div>
                        <div class="details line4">{{ item.address }}</div>
                        <div class="action" v-if="isAction">
                            <span @click="defaultAddress(item.id)">设置为默认地址</span>
                            <span @click="editAddress(item)">编辑</span>
                            <span @click="deleteAddress(item.id)">删除</span>
                        </div>
                    </div>
                </div>
                <div class="item add" @click="addAddress">
                    <div class="content">
                        <i class="el-icon-plus"></i>
                        <span>添加新地址</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="show-more" @click.prevent="isShowMore = !isShowMore" v-if="!isShowAll && addressData.length > 3">
            显示更多收货地址 <i :class="isShowMore ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </div>
        <div style="margin-top: 10px;" v-else></div>

        <el-dialog title="添加地址" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false">
            <el-form :model="form" label-width="80px" style="padding-right: 20px" :rules="rules" ref="formRef">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="form.phone" placeholder="电话"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="form.address" placeholder="地址"></el-input>
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
export default {
    props: {
        // 是否可选，默认为false，表示该字段是必需的
        isOptional: {
            type: Boolean,
            default: false
        },
        // 是否为操作字段，默认为true，表示该字段用于操作行为
        isAction: {
            type: Boolean,
            default: true
        },
        // 是否显示所有内容，默认为true，表示默认情况下显示所有内容
        isShowAll: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            addressData: [],
            currentAddressId: 0,
            fromVisible: false,
            form: {},
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '请输入地址', trigger: 'blur' },
                ]
            },
            isShowMore: false,
        }
    },
    methods: {
        async getAddressAll() {
            const addressData = await this.$request.get("address/selectAll")
            // 验证返回码
            if (addressData.code !== '0') {
                this.$message.error(addressData.msg);
                return;
            }
            // 验证返回的数据是否满足预期格式
            if (!Array.isArray(addressData.data) || addressData.data.length === 0) {
                this.$message.warning('请添加地址');
                return;
            }
            this.addressData = addressData.data;
            // 验证第一个地址是否有id属性
            const defaultAddress = await this.$request.get("user/current")
            console.log(defaultAddress);
            if (defaultAddress.data.defaultAddressId > 0) {
                this.currentAddressId = defaultAddress.data.defaultAddressId
            } else {
                this.currentAddressId = this.addressData[0].id;
            }
            this.$emit('address-change', this.currentAddressId)
        },
        selectAddress(item) {
            // 判断是否可选择，
            if (this.isOptional) {
                this.currentAddressId = item.id
                this.$emit('address-change', this.currentAddressId)
            }
        },
        addAddress() {
            this.form = {}
            this.fromVisible = true
        },
        save() {   // 保存按钮触发的逻辑  它会触发新增或者更新
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    this.sendSaveRequest()
                }
            })
        },
        sendSaveRequest() {
            this.$request({
                url: this.form.id ? '/address/update' : '/address/add',
                method: this.form.id ? 'PUT' : 'POST',
                data: this.form,
            }).then(res => {
                if (res.code === '0') {
                    this.$message.success('保存成功')
                    this.form = {}
                    this.getAddressAll()
                } else {
                    this.$message.error(res.msg)  // 弹出错误的信息
                }
            })
        },
        defaultAddress(id) {
            this.$request.post('/address/defaultAddress', { id }).then(res => {
                if (res.code === '0') {
                    this.$message.success('设置成功')
                    this.getAddressAll()
                } else {
                    this.$message.error(res.msg)  // 弹出错误的信息
                }
            })
        },
        editAddress(item) {
            this.fromVisible = true
            this.form = JSON.parse(JSON.stringify(item))
            console.log(this.form);
        },
        deleteAddress(id) {
            this.$confirm('您确认删除吗？', '确认删除', { type: "warning" }).then(response => {
                this.$request.delete('/address/delete/' + id).then(res => {
                    if (res.code === '0') {   // 表示操作成功
                        this.$message.success('操作成功')
                        this.addressData = []
                        this.getAddressAll()
                    } else {
                        this.$message.error(res.msg)  // 弹出错误的信息
                    }
                })
            }).catch((err) => { console.log(err); })
        },

    },
    mounted() {
        this.getAddressAll();
    }
}
</script>
<style scoped>
.line4 {
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
    word-break: break-all;
    -webkit-line-clamp: 4;
}

.address,
.order {
    background: #fff;
}

.address .title,
.order .title {
    font-size: 18px;
    height: 64px;
    line-height: 64px;
    padding: 0 35px;
}

.address .list {
    height: 242px;
    overflow: hidden;
    align-items: center;
    flex-wrap: wrap;
    display: flex;
    -webkit-box-sizing: border-box;
}

.address .list.on {
    height: auto !important;
}

.address .item {
    overflow: hidden;
    padding: 22px 15px;
    position: relative;
    width: 25%;
    font-size: 14px;
    -webkit-box-sizing: border-box;
}

.address .content {
    border: 1px solid #eaeaea;
    padding: 22px 27px 55px 27px;
    position: relative;

}

.address .content .action {
    position: absolute;
    bottom: 15px;
    right: 20px;
    opacity: 0;
    transition: .3s;
}

.address .content .action span {
    margin-left: 10px;
    color: #e93323;
    cursor: pointer;

}

.address .item:hover .action {
    opacity: 1;
}

.address .item.add .content {
    height: 128px;
}

.address .item.add .el-icon-plus {
    font-size: 37px;
    width: 100%;
    color: #bfbfbf;
    margin-top: 50px;
    text-align: center;
    transition: .3s;
}

.address .item .details {
    color: #999;
    margin-top: 4px;
    height: 75px;
}

.address .item.add span {
    width: 100%;
    text-align: center;
    display: inline-block;
    color: #c8c8c8;
    margin-top: 8px;
    transition: .3s;
}

.address .item.add:hover .el-icon-plus {
    color: #e93323;
}

.address .item.add:hover span {
    color: #e93323;
}


.address .item.on .content {
    border-color: #e93323;
}

.address .item .name {
    font-size: 16px;
}

.address .item .phone {
    margin-top: 9px;
}

.show-more {
    color: #816c6c;
    cursor: pointer;
    height: 46px;
    line-height: 46px;
    text-align: center;
    width: 100%;
    font-size: 14px;
}
</style>