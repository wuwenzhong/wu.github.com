<template>
    <div class="paging_box">
        <div class="paging_total" v-if="pageData.showTotal">
            共{{pageData.total}}条记录，已选中 <span> {{pageData.chooseNum}} </span>条
        </div>
        <div class="el_paging">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="Number(pageData.current)"
                :page-sizes="pageData.dataList"
                layout="prev, pager, next,sizes"
                :total="pageData.total">
            </el-pagination>
            <div class="jump_box">
                跳至
                <input type="text" v-model="jumpNum" @input="filterNum">
                页
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		name: "imPaging",
		props:['pageData'],
		data(){
			return{
				article:20,//一页数据条数
                jumpNum:'',//跳转页面
			}
		},
		watch:{
			jumpNum(){
				if (typeof this.jumpNum ==='string'){
					if (this.jumpNum.trim().length!==0){
						this.debounce(this.jumpCurrentPage,500);
					}else {}
				}
            },
		},
		methods:{
			//传递当前输入的参数给父组件
			jumpCurrentPage(){
				if(this.jumpNum > Math.ceil(this.pageData.total/this.article)){
					this.$message('请输入正确的页码');
					return;
				};
				let temp={};
				temp.changeType='input';
				temp.val=this.jumpNum;
				this.$emit("jumpPages",temp);
			},
            //延迟跳转
			debounce:function(fn,wait){
				if (this.fun!==null){
					clearTimeout(this.fun)
				}
				this.fun = setTimeout(fn,wait)
			},
            //过滤文字
			filterNum(){
		        this.jumpNum=this.jumpNum.replace(/[^\d]/g,'');
            },
            //切换显示条数
			handleSizeChange(val) {
				let temp={};
				temp.changeType='select';
				temp.val=val;
				this.article=val;
				this.$emit("jumpPages",temp);
			},
            //点击第几页
			handleCurrentChange(val) {
				let temp={};
				temp.changeType='btn';
				temp.val=val;
				this.$emit("jumpPages",temp);
			}
		},
		mounted() {

		}
	}
</script>

<style scoped lang="scss">
    .paging_box{
        display: flex;
        line-height: 32px;
        padding:20px 0;
        .paging_total{
            font-size:14px;
            color:#595959;
            span{
                color:#36CEA9;
                font-size:16px;
            }
        }
        .el_paging{
            flex:1;
            text-align: center;
            .jump_box{
                display: inline-block;
                font-size:14px;
                color:#BBBBBB;
                input{
                    width:50px;
                    height:28px;
                    background:rgba(255,255,255,1);
                    border:1px solid rgba(235,235,235,1);/*no*/
                    box-sizing: border-box;
                    padding-left:10px;
                }
            }
            /deep/.el-pagination .btn-next, /deep/.el-pagination .btn-prev{
                border:1px solid #EBEBEB;/*no*/
                padding:0;
            }
            /deep/.el-pagination{
                display: inline-block;
            }
            /deep/.el-pagination .el-select .el-input .el-input__inner{
                border:1px solid #EBEBEB;/*no*/
            }
            /deep/.el-pagination .btn-next .el-icon, /deep/.el-pagination .btn-prev .el-icon{
                font-size:14px;/*no*/
            }
            /deep/.el-pager{
                background:#f7f7f7;
            }
            /deep/.el-pager li{
                border:1px solid #EBEBEB;/*no*/
                background:#fff;
                color:#BBBBBB;
                font-size:14px;
                margin:0 6px;
                padding:0;
                border-radius: 2px;
            }
            /deep/.el-pager li.active{
                background:#36CEA9;
                color:#fff;
                border-color:#36CEA9;
            }
        }
    }
</style>
