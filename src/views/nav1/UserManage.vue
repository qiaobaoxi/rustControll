<template>
    <section>
        <el-button class="add" @click="addUsers">添加用户</el-button>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
                prop="id"
                label="id"
                width="180">
            </el-table-column>
            <el-table-column
                prop="user"
                label="用户名"
               >
            </el-table-column>
            <el-table-column
                label="设备名"
               >
                <template slot-scope="scope">
                  <span v-for="item in scope.row.equipment" v-bind:key="item.id">{{item.name}}&nbsp</span> 
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addEquipment(scope.row)">添加设备</el-button>
                    <el-button type="text" size="small" @click="medify(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteUser(scope.row)">删除</el-button>
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
            title="添加用户"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose">
            <div class="news">
              <h1>用户名</h1> 
              <el-input v-model="user" placeholder="请输入内容"></el-input>
            </div>
            <div class="news">
              <h3>密码</h3> 
              <el-input v-model="password"  type="password" placeholder="请输入内容"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">保存</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="添加设备"
            :visible.sync="dialogVisibleEquipment"
            width="60%"
            :before-close="handleClose">
            <div class="news">
              <h1>用户名</h1>
              <span>{{user}}</span> 
            </div>
            <div class="news">
              <h3>设备名</h3> 
                <el-select v-model="equipmentsId" multiple placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleEquipment = false">取 消</el-button>
                <el-button type="primary" @click="relevanceEquipment">保存</el-button>
            </span>
        </el-dialog>    
    </section>    
</template>
<script>
import { VueEditor } from 'vue2-editor'
import md5 from 'js-md5';
import { saveUser,getAllUser,getUser,updateUser,deleteUser,addEquipment,getAllEquipment,relevanceEquipment} from '../../api/api';
export default {
    data() {
        return {
            tableData: [],
            dialogVisible: false,
            dialogVisibleEquipment: false,
            user:"",
            password:"",
            id:0,
            nowPage:1,
            total:0,
            options: [],
            equipmentsId: []    
        }
    },
    mounted(){
       this.init(this.nowPage);
    },
    methods:{
        init(nowPage){
            getAllUser({nowPage}).then((result)=>{
                if(result.code){
                this.tableData=result.result.result;
                this.total=result.result.count
                }else{
                    this.$message({
                        message: result.result.msg,
                        type: 'warning'
                    });
                }
            })
        },
        addEquipment(obj){
            this.id=obj.id
            this.user=obj.user;
            this.dialogVisibleEquipment=true;
            obj.equipment.forEach(element => {
                this.equipmentsId.push(element.equipmentId);
            });
            getAllEquipment().then((result)=>{
                if(result.code){
                this.options=result.result.result;
                }else{
                    this.$message({
                        message: result.result.msg,
                        type: 'warning'
                    });
                }
            })
        },
        relevanceEquipment(){
            relevanceEquipment({userId:this.id,equipmentsId:this.equipmentsId}).then((result)=>{
              if(result.code){
                this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.dialogVisibleEquipment=false;
                }else{
                    this.$message({
                        message: result.result.msg,
                        type: 'warning'
                    });
                }
            })
        },
        addUsers(){
            this.id=0;
            this.user="";
            this.password="";
            this.dialogVisible=true;
        },
        handleClose(){
          this.dialogVisible=false;
          this.dialogVisibleEquipment=false;
        },
        medify(obj){
            this.dialogVisible=true;
            getUser({
                id:obj.id
            }).then((res)=>{
                    if(res.code){
                        let data=res.result
                        this.id=  data.id
                        this.user=data.user
                        this.password=data.password;
                    }
            })
        },
        pageChange(page){
            this.init(page);
            this.nowPage=page;
        },
        deleteUser(obj){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteUser({
                      id:obj.id
                    }).then((res)=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        if(this.tableData.length===1&&this.nowPage>1){
                          this.nowPage--;
                        }
                        this.init(this.nowPage);
                    }).catch(()=>{
                        this.$message({
                            type: 'info',
                            message: '删除失败!'
                        });
                    })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
                });
        },
        save(){
            if(this.user===""||this.user===null){
               return this.$message({
                        message: '用户名不能为空',
                        type: 'warning'
                    });
            }
            if(this.password===""||this.password===null){
                return this.$message({
                        message: '密码不能为空',
                        type: 'warning'
                    });
            }
            if(this.password.length<8){
                return this.$message({
                        message: '密码长度不能低于8位',
                        type: 'warning'
                    });
            } 
            if(this.id>0){
                updateUser({
                    id:this.id,
                    user:this.user,
                    password:md5(this.password),
                }).then((result)=>{
                    if(result.code){
                        this.$message({
                            message: '更新成功',
                            type: 'success'
                        });
                        this.init(this.nowPage);
                        this.dialogVisible=false;
                    }else{
                        this.$message({
                            message: '更新失败',
                            type: 'warning'
                        });
                    }
                })
            }else{
                saveUser({
                    user:this.user,
                    password:md5(this.password),
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
  }
</style>
