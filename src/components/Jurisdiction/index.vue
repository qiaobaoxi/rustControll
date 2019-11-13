<template>
	<section>
        <el-form :model="form" ref="form" label-width="200px" class="ruleForm">
            <el-form-item
                label="等级："
                prop="grade"
                :rules="[
                { required: true, message: '等级不能为空'},
                { type: 'number', message: '等级必须为数字值'}
                ]"
            >
                <el-input type="input" placeholder="请输入内容" class="input" v-model.number="form.grade" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item
                label="描述："
                prop="describe"
                :rules="[
                { required: true, message: '描述不能为空'},
                ]"
            >
               <el-input  type="textarea"
                    :rows="2"
                    class="textarea"
                    placeholder="请输入内容"
                    v-model="form.describe"
                    auto-complete="off"
                    ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  @click="cacel('form')">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </el-form-item>
        </el-form>
	</section>
</template>
<script>
import { addJsc } from '../../api/api';
	export default {
		data() {
			return {
                form: {
                    grade: '',
                    describe: ''
                }	
			}
		},
		methods: {
            init(formName,done){
                this.$refs[formName].resetFields();
                done();
            },
            submit(){
                if(!grade){
                   return this.$message('请输入等级')
                }
                if(!describe){
                   return this.$message('请输入描述信息')
                }
               addJsc
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addJsc(this.form).then((res)=>{
                            if(res.code){
                              this.$message({
                                message:"添加成功",
                                type: 'success'
                              });
                              this.$emit('closeAdd',1)
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
            },
            cacel(formName) {
                this.$refs[formName].resetFields();
                this.$emit('closeAdd')
            }
		},
		mounted() {
			
		}
	}
</script>

<style scoped lang='less'>
    .ruleForm{
        width: 800px;
        .input{
            width: 200px;
        }
        .textarea{
            width: 400px;
        }
    }
</style>