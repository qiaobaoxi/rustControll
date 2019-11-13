<template>
    <section>
        <!-- <el-button class="add" @click="addUsers">添加用户</el-button> -->
        <div class="menu">
            <span>项目名称</span> 
            <el-select v-model="menuValue" placeholder="请选择" @change="changeMenu">
                <el-option
                v-for="item in menus"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
            <span>工程名称</span> 
            <el-select v-model="twoLevelValue" placeholder="请选择" @change="changeTwoLevelMenu">
                <el-option
                v-for="item in twoLevelMenus"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
            <span>设备名称</span>
            <el-select v-model="equipmentVale" placeholder="请选择" class="equipment" @change="changeEquipment">
                <el-option
                v-for="item in equipments"
                :key="item.name"
                :label="item.name"
                :value="item.name">
                </el-option>
            </el-select>
            <el-button type="primary" class="excelBtn" @click="downToExcel">下载成excel</el-button>
        </div>
        <div id="main" style="width: 98%;height: 400px;"></div>
    </section>    
</template>
<script>
import echarts from 'echarts';
import {getAllMenuByUserId,getAllTwoLevelMenuByMenuId,getAllEquipmentByTwoLevelMenuId,getEquipmentData,downToExcel} from '../../api/api';
export default {
    data() {
        return {
            menus: [],
            menuValue: '',
            twoLevelMenus:[],
            twoLevelValue:'',
            equipments:[],
            equipmentVale:'',
            mergeData:[],
            json_data: [],
            base64:'',
            arrVal:[]
        }
    },
    mounted(){
       this.init(this.nowPage);
    },
    methods:{
        init(nowPage){
            getAllMenuByUserId({userId:sessionStorage.getItem('userId')}).then((result)=>{
                if(result.code){
                    this.menus=result.result;
                }else{
                    this.$message({
                        message: result.result.msg,
                        type: 'warning'
                    });
                }
            })
        },
        draw(id){
            let xData=[];
            let yData=[];
            let length=this.mergeData[6]*this.mergeData[7];
            for(let i=0;i<length;i++){
               xData.push(i+1)
               yData.push((this.mergeData[i+16]+this.mergeData[i+17])*256);
            }
            this.arrVal=yData;
            this.charts = echarts.init(document.getElementById(id))
               this.charts.setOption({
                 dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 0,
                        end: 100,
                        // xAxisIndex: [0, 1]
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 30,
                        end: 70,
                        // xAxisIndex: [0, 1]
                    }
                ],
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: xData
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: yData,
                    type: 'line',
                    smooth: true
                }]
               })
        },
        changeMenu(){
            this.twoLevelMenus=[];
            this.twoLevelValue='';
            this.equipments=[];
            this.equipmentVale='';
            getAllTwoLevelMenuByMenuId({menuId:this.menuValue}).then((result)=>{
                if(result.code){
                    this.twoLevelMenus=result.result;
                }else{
                    this.$message({
                        message: result.result.msg,
                        type: 'warning'
                    });
                }
            })
        },
        changeTwoLevelMenu(){
            this.equipments=[];
            this.equipmentVale='';
            getAllEquipmentByTwoLevelMenuId({twoLevelMenuId:this.twoLevelValue}).then((result)=>{
                if(result.code){
                    this.equipments=result.result;
                }else{
                    this.$message({
                        message: result.result.msg,
                        type: 'warning'
                    });
                }
            })
        },
        changeEquipment(){
            getEquipmentData({name:this.equipmentVale}).then((result)=>{
                let data=JSON.parse(result.result)
                data=data.map((item)=>{
                   item=JSON.parse(item)
                   return item;
                })
                let mergeData=[]
                for(let item of data){
                    mergeData.push(...item);
                }
                for(let i=0;i<mergeData.length;i++){
                    mergeData[i]=parseInt(mergeData[i],16)
                }
                this.mergeData=mergeData
                this.draw("main")
            })
        },
        downToExcel(){
            if(!this.equipmentVale){
                this.$message({
                    message: "请选择设备",
                    type: 'warning'
                });
            }
            downToExcel({base64:this.charts.getConnectedDataURL({
                pixelRatio: 5,　　//导出的图片分辨率比率,默认是1
                backgroundColor: '#fff',　　//图表背景色
                excludeComponents:[　　//保存图表时忽略的工具组件,默认忽略工具栏
                'toolbox'
                ],
                type:'png'　　//图片类型支持png和jpeg
                }),equipmentName:this.equipmentVale}).then((result)=>{
                    if(result.code){
                        window.location.href=result.result.http
                    }
            })
        }
    },
}
</script>
<style lang="less">
   .equipment.el-select{
       width: 300px;
   }
</style>
<style lang="less" scoped>
  section{
      .menu{
        margin: 10px 0;  
        span{
            margin: 10px;
        }
      }
      .add{
          margin: 10px;
      }
     .page{
          text-align: center;
          margin: 30px auto;
      }
      .excelBtn{
          margin-left: 10px;
      }
  }
</style>
