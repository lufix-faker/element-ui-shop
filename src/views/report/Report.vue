<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb>
      <template v-slot:firstItem>数据统计</template>
      <template v-slot:secondItem>数据报表</template>
    </Breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- echarts图表 -->
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import { getReportData } from "network/home.js";

import * as echarts from "echarts";
import _ from "lodash";

import Breadcrumb from "components/common/Breadcrumb.vue";

export default {
  name: "Report",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      // echarts参数
      option: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById("main"));

    // 发起请求
    const result = await this.getEchartsData();

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  },
  methods: {
    async getEchartsData() {
      const { data: res } = await getReportData();

      if (res.meta.status !== 200) {
        return this.$message.error("获取报表数据失败！");
      }
      // 获取成功
      // 合并数据
      return _.merge(res.data, this.option);
    },
  },
};
</script>

<style lang="less" scoped>
</style>