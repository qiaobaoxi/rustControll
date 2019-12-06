<template>
    <section>
        <el-button class="add" @click="addMenu">添加项目</el-button>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
                label="序号"
                type="index"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="项目名称"
               >
            </el-table-column>
            <el-table-column
                label="工程名称"
               >
               <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.twoLevelMenu" v-bind:key="item.name">
                       <em style="font-style: normal;">{{(index+1).toString().padStart(4,"0")}}</em> 
                       <span class="engineering">{{item.name}}</span>
                       <strong class="engineering">{{item.equpmentNumOfArea}}</strong>
                       <el-button type="text" size="small" @click="medifyTwoLevelMenu(item)">修改</el-button></div>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addTwoLevelMenu(scope.row)">添加工程</el-button>
                    <el-button type="text" size="small" @click="medify(scope.row)">修改</el-button>
                    <!-- <el-button type="text" size="small" @click="deleteUser(scope.row)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="page">
            <el-pagination
            background
            layout="prev, pager, next"
            @current-change="pageChange"
            :page-size="10"
            :total="total">
        </el-pagination> 
        </div>
        <el-dialog
            :title="id>0?'修改项目':'添加项目'"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose">
            <div class="news">
              <h1>项目名称</h1> 
              <el-input v-model="menu" placeholder="请输入内容"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">保存</el-button>
            </span>
        </el-dialog>
        <el-dialog
            :title="twoLevelMenuId>0?'修改工程':'添加工程'"
            :visible.sync="twoLevelMenuVisible"
            width="60%"
            :before-close="handleClose">
            <div class="news">
              <h1>工程名称</h1> 
              <el-input v-model="twoLevelMenu" placeholder="请输入内容"></el-input>
            </div>
            <div class="news">
              <h1>测区数</h1> 
              <el-input v-model="equpmentNumOfArea" placeholder="请输入内容"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="twoLevelMenuVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveTwoLevelMenu">保存</el-button>
            </span>
        </el-dialog>      
    </section>    
</template>
<script>
import { VueEditor } from 'vue2-editor'
import md5 from 'js-md5';
import { saveMenu,getAllMenuByPage,saveTwoLevelMenu,updateMenu,updateTwoLevelMenu,isMatchMenuByCompanyId} from '../../api/api';
export default {
    data() {
        return {
            tableData: [],
            dialogVisible: false,
            menu:"",
            password:"",
            id:0,
            twoLevelMenuId:0,
            nowPage:1,
            total:0,
            twoLevelMenuVisible:false,
            twoLevelMenu:"",
            equpmentNumOfArea:'',
        }
    },
    mounted(){
       this.init(this.nowPage);
    },
    methods:{
        init(nowPage){
            getAllMenuByPage({nowPage,companyId:sessionStorage.getItem('companyId')}).then((result)=>{
                if(result.code){
                    this.tableData=result.result.result;
                    this.total=result.result.count;
                }else{
                    this.$message({
                        message: result.result.msg,
                        type: 'warning'
                    });
                }
            })
            isMatchMenuByCompanyId({companyId:sessionStorage.getItem('companyId')}).then((res)=>{
                    if(res.code==1){

                    }else if(res.code==2){
                        this.jump()
                    }else{
                        this.$message({
                            type: 'fail',
                            message: res.msg
                        });  
                   }
            })
        },
        jump() {
            this.$confirm('你有项目文件没有匹配,是否匹配?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.$router.push({ path: '/equipmentManage' });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消匹配'
                });          
            });
        },
        addMenu(){
            this.id=0;
            this.menu="";
            this.password="";
            this.dialogVisible=true;
        },
        handleClose(){
          this.dialogVisible=false;
        },
        addTwoLevelMenu(row){
            this.id=row.id;
            this.twoLevelMenuId=0;
            this.twoLevelMenu="";
            this.twoLevelMenuVisible=true;
        },
        medify(obj){
            this.id=obj.id;
            this.menu=obj.name;
            this.dialogVisible=true;
        },
        medifyTwoLevelMenu(item){
            console.log(item)
            this.twoLevelMenuId=item.id;
            this.twoLevelMenu=item.name;
            this.twoLevelMenuVisible=true;
            this.equpmentNumOfArea=item.equpmentNumOfArea
        },
        pageChange(page){
            this.init(page);
            this.nowPage=page;
        },
        save(){
            if(this.menu===""||this.menu===null){
               return this.$message({
                        message: '菜单名不能为空',
                        type: 'warning'
                    });
            }
            if(this.id>0){
                updateMenu({id:this.id,name:this.menu,userId:sessionStorage.getItem('userId')}).then((result)=>{
                    if(result.code){
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.init(this.nowPage);
                            this.dialogVisible=false;
                    }else{
                            this.$message({
                                message: result.result.msg,
                                type: 'warning'
                            });
                    }
                })
            }else{
                saveMenu({
                    userId:sessionStorage.getItem('userId'),
                    companyId:sessionStorage.getItem('companyId'),
                    name:this.menu,
                }).then((result)=>{
                    if(result.code){
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.init(this.nowPage);
                            this.dialogVisible=false;
                    }else{
                            this.$message({
                                message: result.result.msg,
                                type: 'warning'
                            });
                    }
                })
            }
        },
        saveTwoLevelMenu(){
            if(this.twoLevelMenu===""||this.twoLevelMenu===null){
               return this.$message({
                        message: '工程名不能为空',
                        type: 'warning'
                    });
            }
            if(this.equpmentNumOfArea===""||this.equpmentNumOfArea===null){
                return this.$message({
                        message: '测区数不能为空',
                        type: 'warning'
                });
            }
            if(this.equpmentNumOfArea==0){
                return this.$message({
                        message: '测区数必须大于0',
                        type: 'warning'
                });
            }
            if(isNaN(this.equpmentNumOfArea)){
                return this.$message({
                        message: '测区数必须是数字',
                        type: 'warning'
                });
            }
            if(this.twoLevelMenuId>0){
                updateTwoLevelMenu({id:this.twoLevelMenuId,name:this.twoLevelMenu,equpmentNumOfArea:this.equpmentNumOfArea,userId:sessionStorage.getItem('userId')}).then((result)=>{
                    if(result.code){
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.init(this.nowPage);
                            this.twoLevelMenuVisible=false;
                    }else{
                            this.$message({
                                message: result.result.msg,
                                type: 'warning'
                            });
                    }
                })
            }else{
                saveTwoLevelMenu({menuId:this.id,name:this.twoLevelMenu,equpmentNumOfArea:this.equpmentNumOfArea,userId:sessionStorage.getItem('userId')}).then((result)=>{
                    if(result.code){
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.init(this.nowPage);
                        this.twoLevelMenuVisible=false;
                    }else{
                            this.$message({
                                message: result.result.msg,
                                type: 'warning'
                            });
                    }
                })
            }
        }
    },
    components: {
      VueEditor
    },
}
</script>
<style lang="less" scoped>
   section{
        .add{
            margin: 10px;
        }
        .page{
            text-align: center;
            margin: 30px auto;
        }
        .engineering{
            margin: 10px;
        }
        
    }
</style>
