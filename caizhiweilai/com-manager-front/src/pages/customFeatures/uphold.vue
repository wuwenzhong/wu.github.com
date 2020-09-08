<template>
    <div class="uphold-wrapper">
        <div class="title">
          <el-input v-model="input" placeholder="按名称搜索企业" @input="search" suffix-icon='el-icon-search'></el-input>
          <el-button type="" size="medium" style="background: #414D65;color: #fff;" @click="addNewBusiness">新增企业</el-button>
        </div>

        <el-table :height="pagTotal > 10 ? 'calc(100% - 143px)' : 'calc(100% - 95px)'" :data="upholdArr" style="width: 100%" border>
            <el-table-column prop="resName" label="序号" width="100" align="center">
            <template slot-scope="scope">
                <span type @click="preview(scope.row)">{{allSize*(allPage - 1)+(scope.$index + 1)}}</span>
            </template>
            </el-table-column>
            <el-table-column prop="name" label="企业名称" align="center" width="300"></el-table-column>
            <el-table-column prop="taxLayerNo" label="税号" align="center" width="250"></el-table-column>
            <el-table-column prop="taxLayerType" label="纳税性质" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span type="warning" class="handle">{{scope.row.taxLayerType=='101'?'小规模纳税人':'增值税一般纳税人'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="accountingSystem" label="会计制度" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span type="warning" class="handle">{{scope.row.accountingSystem=='2017'?'企业会计准则2017版':'小企业会计准则2013版'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="resName" label="所属行业" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span type="warning" class="handle">{{scope.row.industryName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-link type="warning" @click="edit(scope.row)" class="handle"><span style="margin-right:10px;display:inline-block">编辑</span></el-link>
                    <el-link type="warning" @click.native.prevent="Delete(scope.row)" class="handle">删除</el-link>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <pagination
            :total="pagTotal"
            @pagination="monitorPagin"
            v-if="pagTotal>10"
            style="display: flex;justify-content: flex-end;"
        ></pagination>

        <!-- 企业信息 -->
        <el-dialog :title="title" :visible.sync="enterprise" :close-on-click-modal="false">
            <business v-if="enterprise" @addpt='addpt' :addData='addData'></business>
        </el-dialog>
  </div>
</template>

<script>
import { listInfo, delInfo } from '@/api/business'
// import paging from '@/components/pagination/index'
import business from './component/EnterpriseDetails'
export default {
    data() {
        return {
            input: '',
            upholdArr: [],
            pagTotal: 0,
            enterprise: false,
            title: '新增企业',
            allPage: '1',
            allSize: '10',
            addData: {}
        }
    },
    components: {
        // paging,
        business
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            listInfo({
                page: this.allPage,
                size: this.allSize,
                keyWrods: this.input
            }).then(res => {
                if (res.code == '0') {
                    this.upholdArr = res.result.data
                    this.pagTotal = parseInt(res.result.total)
                    // 回table顶部
                    this.$el.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.message
                    })
                }
            })
        },
        search(val) {
            this.input = val
            this.allPage = 1
            this.init()
        },
        monitorPagin(item) {
            this.allPage = item.page
            this.allSize = item.limit
            this.init()
        },
        addNewBusiness() {
            this.title = '新增企业'
            this.addData = {}
            this.enterprise = true
        },
        addpt() {
            this.enterprise = false
            this.init()
        },
        edit(item) {
            this.title = '编辑企业'
            this.addData = item
            this.enterprise = true
        },
        Delete(item) {
            this.$confirm('删除此企业后将不可修复，是否确认删除？', '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            }).then(() => {
                delInfo({
                    companyInfoId: item.id
                }).then(res => {
                    if (res.code == '0') {
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        })
                        this.init()
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.message
                        })
                    }
                })
            }).catch(action => {})
        }
    }
}
</script>

<style lang="scss" scoped>
	.uphold-wrapper {
		height: 100%;
		overflow: hidden;
		.title{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			margin: 20px 0;
			.el-input{
				width: 300px;
				margin-right: 20px;
			}
        }
	}
</style>