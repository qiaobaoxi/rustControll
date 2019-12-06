<template>
    <section v-loading="loading"  element-loading-text="拼命加载中">
        <!-- <el-button class="add" @click="addUsers">添加用户</el-button> -->
        <div class="menu" >
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
                v-for="(item,index) in twoLevelMenus"
                :key="item.id"
                :label="(index+1).toString().padStart(4,'0')+' '+item.name"
                :value="item.id">
                </el-option>
            </el-select>
            <span>区号</span>
            <el-select v-model="equpmentNumOfAreaValue"    placeholder="请选择" class="equipment" @change="changeEquipment">
                <el-option
                v-for="item in equipments"
                :key="item.index"
                :label="item.index+'   '+(item.isExisted==1?'有数据':'没有数据')"
                :value="item.index">
                </el-option>
            </el-select>
            <el-button type="primary" class="excelBtn" @click="downToExcel">下载成excel</el-button>
        </div>
        <div class="table" v-show="isShow">
           <div class="tableHead">
                <div class="date">
                    <span>{{year}}年</span><span>{{month}}月</span><span>{{date}}日</span><span>{{time.slice(0,2)+':'+time.slice(2)}}测</span>
                </div>
                <div class="num">
                    <span>工程号：{{engineerNum}}</span><span>区号:{{areaNum}}</span>
                </div>
                <div class="num">
                    <span>D={{diameter}}</span><span>{{passivation===1?'活化':'钝化'}}</span>
                </div>
                <div class="num">
                    <span>x={{row}}</span><span>y={{column}}</span>
                </div>
                <div class="num">
                    <span>使用天数{{howmanydays}}</span>
                </div>
           </div>
           <div class="tableBody">
                <div v-for="(item,index) in tableData" v-bind:key="index" :style="'width:'+column*80+'px'">
                   <span v-for="(it,idx) in item" v-bind:key="idx" :style="'background-color:'+it.color">{{it.value===65535?'':it.value}}</span>
                </div>
           </div>
        </div>
        <div id="main" style="width: 98%;height: 400px;" v-show="isShow"></div>
    </section>    
</template>
<script>
import echarts from 'echarts';
import {getAllMenuByCompanyId,getAllTwoLevelMenuByMenuId,getAllEquipmentByTwoLevelMenuId,getEquipmentData,downToExcel,fileExisted} from '../../api/api';
export default {
    data() {
        return {
            menus: [],
            menuValue: '',
            twoLevelMenus:[],
            twoLevelValue:'',
            equipments:[],
            mergeData:[],
            json_data: [],
            base64:'',
            arrVal:[],
            year:"",
            month:"",
            date:"",
            time:"",
            engineerNum:"",
            areaNum:"",
            diameter:"",
            passivation:"",
            row:"",
            column:'',
            tableData:[],
            isShow:false,
            equpmentNumOfArea:0,
            equpmentNumOfAreaValue:"",
            engineerNumValue:"",
            fileName:'',
            howmanydays:0,
            loading:false
        }
    },
    mounted(){
       this.init(this.nowPage);
    },
    methods:{
        init(nowPage){
            getAllMenuByCompanyId({companyId:sessionStorage.getItem('companyId')}).then((result)=>{
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
            let yData1=[];
            let yData2=[];
            this.tableData=[];
            let length=this.mergeData[6]*this.mergeData[7];
            let x=this.mergeData[8]&0x7f;
            let p=this.mergeData[9]*256+this.mergeData[10]*1;
            this.howmanydays=this.mergeData[9]*256+this.mergeData[10]*1;
            let csfinish=this.mergeData[12]&0xff;
            for(let i=0;i<length;i++){
                xData.push(i+1)
                let yValue=(this.mergeData[i*2+16]+this.mergeData[i*2+17]*256)/100;
                if(yValue*100==65535){
                  yData.push(0);
                  yData2.push(0)
                  yData1.push(yValue);
                }else{
                  yData.push(yValue);
                  yData1.push(this.getRou(yValue*100,p,csfinish,x));
                  yData2.push(this.getRou(yValue*100,p,csfinish,x));
                }
            }
            for(let j=0; j<this.mergeData[6];j++){
                let row=[];
                for(let k=0; k<this.mergeData[7];k++){
                    let color= "green";
                    let value=yData1[j*this.mergeData[7]+k]*100;
                    if(value==65535){
                      color= "#A9A9A9";
                      value=65535   
                    }else if(value>=1000){
                      color="red";
                      value=5;
                    }else if(value>=500){
                      color="orange";
                      value=4;
                    }else if(value>=300){
                      color="yellow";
                      value=3
                    }else if(value>=200){
                      color="blue";
                      value=2
                    }else{
                      value=1;  
                    }
                    row.push({value:value,color});
                }
                this.tableData.push(row);
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
                yAxis: [
                    {
                        type: 'value',
                        name: '电流密度',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '截面损失率',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                ],
                series: [{
                    data: yData,
                    type: 'line',
                    smooth: true
                },
                {
                    data: yData2,
                    yAxisIndex:1,
                    type: 'line',
                    smooth: true
                }
                ]
               })
        },
         getRou(r,p,csfinish,x)
            {
            let lt;
            lt=p;   //dates
            lt=parseInt(lt*r);    //电流密度i带100倍来计算,dates按365倍计算
            lt=parseInt(lt*csfinish); //alpha按100000倍
            lt=lt+150;
            lt=parseInt(lt/365);   //dates 365倍还原
            lt+=40;
            lt=parseInt(lt/100);   //alpha 还原1000倍,由于直径按mm除，此处要加10倍，所以用/=100
            lt=parseInt(lt/x);   //diameter
            lt=10000-lt;
            lt=parseInt(lt*lt);
            lt+=4000;
            lt=parseInt(lt/10000);
            lt=10000-lt;  //结果为 X%%
            return lt/100;
        } ,
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
            this.engineerNumValue=''
            this.equipments=[];
            this.equpmentNumOfAreaValue="";
            this.loading=true;
            for(let i=0;i<this.twoLevelMenus.length;i++){
                if(this.twoLevelMenus[i].id===this.twoLevelValue){
                    this.engineerNumValue=(i+1);
                    fileExisted({menuId:this.menuValue,engineerNum:this.engineerNumValue,twoLevelMenuId:this.twoLevelValue}).then((result)=>{
                            if(result.code){
                               this.equipments=result.result
                               this.loading=false;
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
        changeEquipment(){
            this.isShow=false;
            getEquipmentData({menuId:this.menuValue,engineerNum:this.engineerNumValue,equpmentNumOfArea:this.equpmentNumOfAreaValue}).then((result)=>{
                if(result.code){
                    this.isShow=true;
                    let data=JSON.parse(result.result.data)
                    let fileName=result.result.fileName;
                    this.fileName=fileName;
                    data=data.map((item)=>{
                    item=JSON.parse(item)
                    return item;
                    })
                    let mergeData=[]
                    console.log(fileName)
                    for(let item of data){
                        mergeData.push(...item);
                    }
                    console.log(mergeData)
                    for(let i=0;i<mergeData.length;i++){
                        mergeData[i]=parseInt(mergeData[i],16)
                    }
                    this.mergeData=mergeData
                    this.year=fileName.slice(0,4)
                    this.month=fileName.slice(4,6)
                    this.date=fileName.slice(6,8)
                    this.time=fileName.slice(8,12)
                    this.engineerNum=fileName.slice(13,17)
                    this.areaNum=fileName.slice(18,20)
                    this.row= this.mergeData[6];
                    this.column= this.mergeData[7];
                    this.diameter= this.mergeData[8];
                    this.passivation= this.mergeData[9];
                    setTimeout(()=>{
                      this.draw("main")
                    })
                }else{
                    this.$message({
                        message: result.result.msg,
                        type: 'warning'
                    });
                }
            })
        },
        downToExcel(){
             if(!this.equpmentNumOfAreaValue){
                this.$message({
                    message: "请选择设备",
                    type: 'warning'
                });
                return;
            }
            downToExcel({base64:this.charts.getConnectedDataURL({
                pixelRatio: 5,　　//导出的图片分辨率比率,默认是1
                backgroundColor: '#fff',　　//图表背景色
                excludeComponents:[　　//保存图表时忽略的工具组件,默认忽略工具栏
                'toolbox'
                ],
                type:'png'　　//图片类型支持png和jpeg
                }),equipmentName:this.fileName,menuId:this.menuValue,engineerNum:this.engineerNumValue}).then((result)=>{
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
       width: 200px;
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
       .table{
          .tableHead{
            display: flex;
            justify-content:space-between;
          }
          .tableBody{
            margin-top: 10px;
            width: 1000px;
            height: 600px;
            overflow-x:scroll;
            overflow-y:scroll;
            span{
               margin: 4px; 
               display: inline-block;
               border:1px solid black;
               text-align: center;
               line-height: 20px;
               width: 20px;
               height: 20px; 
               padding: 4px;
               vertical-align: middle;
            }
          }
      }
  }
</style>
