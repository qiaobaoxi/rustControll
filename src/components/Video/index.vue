<template>
	<section>
        <el-form :model="form" ref="form" label-width="200px" class="ruleForm">
            <el-form-item
                label="视频地址："
                prop="videoLink"
                :rules="[
                { required: true, message: '地址不能为空'},
                ]"
            >
                <el-input  type="textarea"
                    :rows="2"
                    class="textarea"
                    placeholder="请输入内容"
                    v-model="form.videoLink"
                    auto-complete="off"
                    ></el-input>
            </el-form-item>
            <el-form-item
                label="等级（可多选）："
                prop="selectGrades"
                :rules="[
                { required: true, message: '等级不能为空'},
                ]"
            >
                    <el-select v-model="form.selectGrades" multiple placeholder="请选择">
                    <el-option
                        v-for="item in grades"
                        :key="item.id"
                        :label="item.grade"
                        :value="item.id">
                        </el-option>
                    </el-select>
            </el-form-item>
            <el-form-item>
                <el-button  @click="cacel('form')">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </el-form-item>
        </el-form>
	</section>
</template>
<script>
import { jurisdictionList,addVideo} from '../../api/api';
	export default {
		data() {
			return {
                grades: [],
                form: {
                    videoLink: '',
                    selectGrades:[]
                }	
            }
		},
		methods: {
            init(){
                jurisdictionList().then((response)=>{
                    let res=response.data
                    if(res.code){
                        this.grades=res.result
                    }
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addVideo(this.form).then((res)=>{
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
            this.init()
        },
        watch:{
           
        }
	}
</script>

<style scoped lang='less'>
   
</style>