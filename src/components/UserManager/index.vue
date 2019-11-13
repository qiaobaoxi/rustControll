<template>
	<section>
        <!-- <div class="row"><span class="title">姓名：</span><el-input v-model="user.name" placeholder="请输入姓名"></el-input></div>
        <div class="row"><span class="title">密码：</span><el-input v-model="user.password" placeholder="请输入密码"></el-input></div>
        <div class="row"><span class="title">等级：</span>
            <el-select v-model="user.grade" placeholder="请选择">
                <el-option
                v-for="item in grades"
                :key="item.id"
                :label="item.grade"
                :value="item.id">
                </el-option>
            </el-select>
        </div>
        <div class="btns">
            <el-button>取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div> -->
        <el-form :model="user" ref="user" label-width="200px" class="ruleForm">
            <el-form-item
                label="账号："
                prop="name"
                :rules="[
                { required: true, message: '姓名不能为空'},
                ]"
            >
                <el-input type="input" placeholder="请输入姓名" class="input" v-model="user.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item
                label="密码："
                prop="password"
                :rules="[
                { required: true, message: '密码不能为空'},
                { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' },
                ]"
            >
                <el-input type="password" placeholder="请输入密码" class="input" v-model="user.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item
                label="地址："
                prop="address"
                :rules="[
                { required: true, message: '地址不能为空'},
                ]"
            >
                <el-input type="input" placeholder="请输入地址" class="input" v-model="user.address" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item
                label="等级："
                prop="grade"
                :rules="[
                { required: true, message: '请选择等级'},
                ]"
            >
                <el-select v-model="user.grade" placeholder="请选择">
                    <el-option
                    v-for="item in grades"
                    :key="item.id"
                    :label="item.grade"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button  @click="cacel('user')">取 消</el-button>
                <el-button type="primary" @click="submitForm('user')">确 定</el-button>
            </el-form-item>
        </el-form>
	</section>
</template>
<script>
import { jurisdictionList,setUserJsc,getUserById,addUserOrUpdate } from '../../api/api';
	export default {
        props:['userId'],
		data() {
			return {
                grades:[],
                jurisdictionId: '',
                user:{
                  name: '',
                  password: '',
                  grade: '',
                  address: ''
                }
			}
		},
		methods: {
            init(){
                console.log(this.user)
                this.grade=''
                jurisdictionList().then((response)=>{
                    let res=response.data
                    if(res.code){
                        this.grades=res.result
                    }
                })
                if(this.userId){
                    getUserById({userId:this.userId}).then((response)=>{
                        let res=response.data;
                        if(res.code){
                            this.user=res.result
                        }
                    })
                }    
                
            },
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addUserOrUpdate(this.user).then((res)=>{
                            if(res.code){
                                if(this.user.id>0){
                                    this.$message({
                                        message:"修改成功",
                                        type: 'success'
                                    });
                                }else{
                                    this.$message({
                                        message:"添加成功",
                                        type: 'success'
                                    });
                                }
                              this.$emit('closeSetGrade',1)
                              this.$refs[formName].resetFields();
                            }else{
                              this.$message({
                                message: res.msg,
                                type: 'warning'
                              });
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
		},
		mounted() {
            this.init();
        },
        watch:{
            userId(newDate,oldDate){
                this.init();
            }
        }
	}
</script>

<style scoped lang='less'>
    .row{
        height: 40px;
        line-height: 40px;
        .title{
            display: inline-block;
            width: 200px;
            text-align: right;
        }
    }
    .btns{
        margin-top: 10px;
        text-align: center;
    }
</style>