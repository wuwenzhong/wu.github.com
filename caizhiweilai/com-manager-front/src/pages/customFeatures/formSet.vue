<template>
  <div class="form-set-wrapper">
    <!-- <el-tabs v-model="queryParams.formTypeCode" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in tableTabs" :key="index" :label="item.name" :name="item.code"> -->
        <el-col class="btn-box">
          <el-button v-for='(item,index) in tableTabs' :key='index' :type="courseIndex == index ? 'primary' : ''" size="medium" @click='courseType(index)'>{{item.name}}</el-button>
        </el-col>
        <el-col :span="4" class="fr mb20 mt5">
          <el-input
            v-model="queryParams.keyWrods"
            suffix-icon="el-icon-search"
            placeholder="请输入表单名称"
          ></el-input>
        </el-col>
        <el-table :height="total > 10 ? 'calc(100% - 143px)' : 'calc(100% - 101px)'" :data="tableData" border style="width: 100%">
          <el-table-column prop="resName" label="序号" width="100" align="center">
            <template slot-scope="scope">
              <span>{{queryParams.size*(queryParams.page - 1)+(scope.$index + 1)}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="formTypeCodeName" label="表单类型" width=""></el-table-column>
          <el-table-column align="center" label="表单名称" width="">
            <template slot-scope="scope">
              <el-link size="small" @click="handleGetInfo(scope.row)">{{ scope.row.name }}</el-link>
            </template>
          </el-table-column>
          <el-table-column align="center" label="表单状态" width="">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">可使用</span>
              <span style="color: #F56C6C" v-else>开发中</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="权重状态" width="">
            <template slot-scope="scope">
              <span style="color: #67C23A" v-if="scope.row.weightReady === 1">已设置</span>
              <span style="color: #F56C6C" v-else>未设置</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="modifyTime" label="权重最后修改时间" width="" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-link type="warning" style="padding-right:5px;" @click="handleGetInfo(scope.row)" size="small">预览</el-link>
              <el-link type="warning" @click="handleGetInfo(scope.row, 1)" size="small">设置公共权重</el-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination
          :total="total"
          :hidden="total <= 10"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.size"
          :pageSizes="[10,25,50,100]"
          @pagination="getList()"
        />
      <!-- </el-tab-pane>
    </el-tabs> -->

    <!-- 增值税弹窗 -->
    <el-dialog :title="isEdit ? '设置公共权重' : '增值税专用发票'" :visible.sync="dialogZzPreview" custom-class="preview-dialog" :close-on-click-modal="false">
      <div class="zzs-card-wrapper">
        <el-tabs tab-position="left" v-model="scopeDialog" @tab-click="handleClickDialog()">
          <el-tab-pane v-for="(item, index) in dialogTabs" :key="index" :label="item.title" :name="item.name">
              <div class="card-wrapper">
                <img :src="item.imgUrl" class="back-content" alt="">

                <el-input v-model="formParams.input1" :disabled="disable" @blur="blurText('input1')" class="input"></el-input>
                <el-input v-model="formParams.input2" :disabled="disable" @blur="blurText('input2')" class="input-robot"></el-input>
                <el-input v-model="formParams.input3" :disabled="disable" @blur="blurText('input3')" class="input-number"></el-input>
                <el-input v-model="formParams.input1" disabled class="input-copy"></el-input>
                <el-input v-model="formParams.input3" disabled class="input-number-copy"></el-input>

                <el-input v-model="formParams.input4" :disabled="disable" @blur="blurText('input4')" class="input-time"></el-input>

                <el-input v-model="formParams.input5" :disabled="disable" @blur="blurText('input5')" class="input-info info-name"></el-input>
                <el-input v-model="formParams.input6" :disabled="disable" @blur="blurText('input6')" class="input-info info-number"></el-input>
                <el-input v-model="formParams.input7" :disabled="disable" @blur="blurText('input7')" class="input-info info-adress"></el-input>
                <el-input v-model="formParams.input8" :disabled="disable" @blur="blurText('input8')" class="input-info info-bank"></el-input>

                <el-input v-model="formParams.input9" :disabled="disable" @blur="blurText('input9')" class="input-list oneline"></el-input>
                <el-input v-model="formParams.input10" :disabled="disable" @blur="blurText('input10')" class="input-list oneline two"></el-input>
                <el-input v-model="formParams.input11" :disabled="disable" @blur="blurText('input11')" class="input-list oneline three"></el-input>
                <el-input v-model="formParams.input12" :disabled="disable" @blur="blurText('input12')" class="input-list oneline four"></el-input>
                <el-input v-model="formParams.input13" :disabled="disable" @blur="blurText('input13')" class="input-list oneline five"></el-input>
                <el-input v-model="formParams.input14" :disabled="disable" @blur="blurText('input14')" class="input-list oneline six"></el-input>
                <el-input v-model="formParams.input15" :disabled="disable" @blur="blurText('input15')" class="input-list oneline seven"></el-input>

                <el-input v-model="formParams.input16" :disabled="disable" @blur="blurText('input16')" class="input-list twoline one"></el-input>
                <el-input v-model="formParams.input17" :disabled="disable" @blur="blurText('input17')" class="input-list twoline two"></el-input>
                <el-input v-model="formParams.input18" :disabled="disable" @blur="blurText('input18')" class="input-list twoline three"></el-input>
                <el-input v-model="formParams.input19" :disabled="disable" @blur="blurText('input19')" class="input-list twoline four"></el-input>
                <el-input v-model="formParams.input20" :disabled="disable" @blur="blurText('input20')" class="input-list twoline five"></el-input>
                <el-input v-model="formParams.input21" :disabled="disable" @blur="blurText('input21')" class="input-list twoline six"></el-input>
                <el-input v-model="formParams.input22" :disabled="disable" @blur="blurText('input22')" class="input-list twoline seven"></el-input>

                <el-input v-model="formParams.input23" :disabled="disable" @blur="blurText('input23')" class="input-list threeline one"></el-input>
                <el-input v-model="formParams.input24" :disabled="disable" @blur="blurText('input24')" class="input-list threeline two"></el-input>
                <el-input v-model="formParams.input25" :disabled="disable" @blur="blurText('input25')" class="input-list threeline three"></el-input>
                <el-input v-model="formParams.input26" :disabled="disable" @blur="blurText('input26')" class="input-list threeline four"></el-input>
                <el-input v-model="formParams.input27" :disabled="disable" @blur="blurText('input27')" class="input-list threeline five"></el-input>
                <el-input v-model="formParams.input28" :disabled="disable" @blur="blurText('input28')" class="input-list threeline six"></el-input>
                <el-input v-model="formParams.input29" :disabled="disable" @blur="blurText('input29')" class="input-list threeline seven"></el-input>

                <el-input v-model="formParams.input30" :disabled="disable" @blur="blurText('input30')" class="input-list fourline one"></el-input>
                <el-input v-model="formParams.input31" :disabled="disable" @blur="blurText('input31')" class="input-list fourline two"></el-input>
                <el-input v-model="formParams.input32" :disabled="disable" @blur="blurText('input32')" class="input-list fourline three"></el-input>
                <el-input v-model="formParams.input33" :disabled="disable" @blur="blurText('input33')" class="input-list fourline four"></el-input>
                <el-input v-model="formParams.input34" :disabled="disable" @blur="blurText('input34')" class="input-list fourline five"></el-input>
                <el-input v-model="formParams.input35" :disabled="disable" @blur="blurText('input35')" class="input-list fourline six"></el-input>
                <el-input v-model="formParams.input36" :disabled="disable" @blur="blurText('input36')" class="input-list fourline seven"></el-input>

                <el-input v-model="formParams.input37" :disabled="disable" @blur="blurText('input37')" class="input-list fiveline one"></el-input>
                <el-input v-model="formParams.input38" :disabled="disable" @blur="blurText('input38')" class="input-list fiveline two"></el-input>
                <el-input v-model="formParams.input39" :disabled="disable" @blur="blurText('input39')" class="input-list fiveline three"></el-input>
                <el-input v-model="formParams.input40" :disabled="disable" @blur="blurText('input40')" class="input-list fiveline four"></el-input>
                <el-input v-model="formParams.input41" :disabled="disable" @blur="blurText('input41')" class="input-list fiveline five"></el-input>
                <el-input v-model="formParams.input42" :disabled="disable" @blur="blurText('input42')" class="input-list fiveline six"></el-input>
                <el-input v-model="formParams.input43" :disabled="disable" @blur="blurText('input43')" class="input-list fiveline seven"></el-input>

                <el-input v-model="formParams.input44" :disabled="disable" @blur="blurText('input44')" class="input-list sixline one"></el-input>
                <el-input v-model="formParams.input45" :disabled="disable" @blur="blurText('input45')" class="input-list sixline two"></el-input>
                <el-input v-model="formParams.input46" :disabled="disable" @blur="blurText('input46')" class="input-list sixline three"></el-input>
                <el-input v-model="formParams.input47" :disabled="disable" @blur="blurText('input47')" class="input-list sixline four"></el-input>
                <el-input v-model="formParams.input48" :disabled="disable" @blur="blurText('input48')" class="input-list sixline five"></el-input>
                <el-input v-model="formParams.input49" :disabled="disable" @blur="blurText('input49')" class="input-list sixline six"></el-input>
                <el-input v-model="formParams.input50" :disabled="disable" @blur="blurText('input50')" class="input-list sixline seven"></el-input>
                <el-input v-model="formParams.input51" :disabled="disable" @blur="blurText('input51')" class="input-list sixline eight"></el-input>

                <el-input v-model="formParams.input52" :disabled="disable" @blur="blurText('input52')" class="input-list sevenline one"></el-input>
                <el-input v-model="formParams.input53" :disabled="disable" @blur="blurText('input53')" class="input-list sevenline two"></el-input>
                <el-input v-model="formParams.input54" :disabled="disable" @blur="blurText('input54')" class="input-list sevenline three"></el-input>
                <el-input v-model="formParams.input55" :disabled="disable" @blur="blurText('input55')" class="input-list sevenline four"></el-input>
                <el-input v-model="formParams.input56" :disabled="disable" @blur="blurText('input56')" class="input-list sevenline five"></el-input>
                <el-input v-model="formParams.input57" :disabled="disable" @blur="blurText('input57')" class="input-list sevenline six"></el-input>
                <el-input v-model="formParams.input58" :disabled="disable" @blur="blurText('input58')" class="input-list sevenline seven"></el-input>

                <el-input v-model="formParams.input59" :disabled="disable" @blur="blurText('input59')" class="input-list eightline one"></el-input>
                <el-input v-model="formParams.input60" :disabled="disable" @blur="blurText('input60')" class="input-list eightline two"></el-input>
                <el-input v-model="formParams.input61" :disabled="disable" @blur="blurText('input61')" class="input-list eightline three"></el-input>
                <el-input v-model="formParams.input62" :disabled="disable" @blur="blurText('input62')" class="input-list eightline four"></el-input>
                <el-input v-model="formParams.input63" :disabled="disable" @blur="blurText('input63')" class="input-list eightline five"></el-input>
                <el-input v-model="formParams.input64" :disabled="disable" @blur="blurText('input64')" class="input-list eightline six"></el-input>
                <el-input v-model="formParams.input65" :disabled="disable" @blur="blurText('input65')" class="input-list eightline seven"></el-input>
                <el-input v-model="formParams.input66" :disabled="disable" @blur="blurText('input66')" class="input-list eightline eight"></el-input>

                <el-input v-model="formParams.input67" :disabled="disable" @blur="blurText('input67')" class="input-money cap"></el-input>
                <el-input v-model="formParams.input68" :disabled="disable" @blur="blurText('input68')" class="input-money"></el-input>

                <el-input v-model="formParams.input69" :disabled="disable" @blur="blurText('input69')" class="input-info-no info-name"></el-input>
                <el-input v-model="formParams.input70" :disabled="disable" @blur="blurText('input70')" class="input-info-no info-number"></el-input>
                <el-input v-model="formParams.input71" :disabled="disable" @blur="blurText('input71')" class="input-info-no info-adress"></el-input>
                <el-input v-model="formParams.input72" :disabled="disable" @blur="blurText('input72')" class="input-info-no info-bank"></el-input>

                <el-input v-model="formParams.input73" :disabled="disable" @blur="blurText('input73')" class="input-person"></el-input>
                <el-input v-model="formParams.input74" :disabled="disable" @blur="blurText('input74')" class="input-person fuhe"></el-input>
                <el-input v-model="formParams.input75" :disabled="disable" @blur="blurText('input75')" class="input-person kaipiao"></el-input>
                <el-input v-model="formParams.input76" :disabled="disable" @blur="blurText('input76')" class="input-person xiaoshou"></el-input>
              </div>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="dialogZzPreview = false">关 闭</el-button>
          <el-button type="primary" size="medium" @click="handleConserve('1', 76)" v-show="isEdit">保 存</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 记账凭证弹窗  -->
    <el-dialog :title="isEdit ? '设置公共权重' : '记账凭证'" :visible.sync="dialogJzPreview" custom-class="preview-dialog" @close="closeDialog()" :close-on-click-modal="false">
      <div class="jz-card-wrapper">
        <img src="./component/formAbout/images/back-four.png" class="back-image" alt="">

        <el-input v-model="formParams.input1" :disabled="disable" @blur="blurText('input1')" class="input"></el-input>
        <el-input v-model="formParams.input2" :disabled="disable" @blur="blurText('input2')" class="input input-year"></el-input>
        <el-input v-model="formParams.input3" :disabled="disable" @blur="blurText('input3')" class="input input-month"></el-input>
        <el-input v-model="formParams.input4" :disabled="disable" @blur="blurText('input4')" class="input input-day"></el-input>

        <div v-for="(item, index) in tablesInput" :key="index">
          <el-input v-for="(item1, index1) in item.children" :key="index1" v-model="formParams['input'+item1.sort]" :disabled="disable" @blur="blurText('input'+item1.sort, item1.maxNum)" class="input-list-jz" :class="['line'+index,'child'+index1]"></el-input>
        </div>

        <el-input v-model="formParams.input5" :disabled="disable" @blur="blurText('input5')" class="input-person"></el-input>
        <el-input v-model="formParams.input6" :disabled="disable" @blur="blurText('input6')" class="input-person jizhang"></el-input>
        <el-input v-model="formParams.input7" :disabled="disable" @blur="blurText('input7')" class="input-person chuna"></el-input>
        <el-input v-model="formParams.input8" :disabled="disable" @blur="blurText('input8')" class="input-person fuhe"></el-input>
        <el-input v-model="formParams.input9" :disabled="disable" @blur="blurText('input9')" class="input-person zhidan"></el-input>

      </div>

      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogJzPreview = false">关 闭</el-button>
        <el-button type="primary" size="medium" @click="handleConserve('2', 181)" v-show="isEdit">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 资产负债表弹窗 -->
    <el-dialog :title="isEdit ? '设置公共权重' : '资产负债表'" :visible.sync="dialogFzPreview" custom-class="preview-dialog" @close="closeDialog()" :close-on-click-modal="false">
      <div class="fz-card-wrapper">
        <img src="./component/formAbout/images/back-five.png" class="back-image" alt="">

        <el-input v-model="formParams.input121" @blur="blurText('input121')" class="input-time"></el-input>
        <el-input v-model="formParams.input122" @blur="blurText('input122')" class="input-company"></el-input>

        <div v-for="(item, index) in tablesInput2" :key="index">
          <el-input v-for="(item1, index1) in item.children" :key="index1" v-model="formParams['input'+item1.sort]" :disabled="disable" @blur="blurText('input'+item1.sort)" class="input-list-jz" :class="['line'+index,'child'+index1]"></el-input>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFzPreview = false">关 闭</el-button>
        <el-button type="primary" size="medium" @click="handleConserve('3', 122)" v-show="isEdit">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 利润表 -->
    <el-dialog :title="isEdit ? '设置公共权重' : '利润表'" :visible.sync="dialogLrPreview" custom-class="preview-dialog" @close="closeDialog()" :close-on-click-modal="false">
      <div class="lr-card-wrapper">
        <img src="./component/formAbout/images/back-six.png" class="back-image" alt="">

        <el-input v-model="formParams.input55" @blur="blurText('input55')" class="input-time"></el-input>
        <el-input v-model="formParams.input56" @blur="blurText('input56')" class="input-company"></el-input>

        <div v-for="(item, index) in tablesInputLr" :key="index">
          <el-input v-for="(item1, index1) in item.children" :key="index1" v-model="formParams['input'+item1.sort]" :disabled="disable" @blur="blurText('input'+item1.sort)" class="input-list-lr" :class="['line'+index,'child'+index1]"></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogLrPreview = false">关 闭</el-button>
        <el-button type="primary" size="medium" @click="handleConserve('5', 56)" v-show="isEdit">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 现金流量表弹窗 -->
    <el-dialog :title="isEdit ? '设置公共权重' : '现金流量表'" :visible.sync="dialogXjPreview" custom-class="preview-dialog" @close="closeDialog()" :close-on-click-modal="false">
      <div class="xj-card-wrapper">
        <img src="./component/formAbout/images/back-seven.png" class="back-image" alt="">
        <div  iv v-for="(item, index) in xjllbItem" :key="index">
          <el-input v-for="(item1, index1) in item.children" :key="index1" v-model="formParams['input'+item1.sort]" :disabled="disable" @blur="blurText('input'+item1.sort)" class="input-list-jz" :class="['line'+index,'child'+index1]"></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogXjPreview = false">关 闭</el-button>
        <el-button type="primary" size="medium" @click="handleConserve('4', 82)" v-show="isEdit">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { screenFormType, screenFormList, screenTaxRate, screenGetWeight, screenSaveWeight } from '@/api/formAbout.js'
import { _vueDebounce, numberMul, numberAdd, convertCurrency } from '@/common/js/utils.js'

export default {
  data() {
    return {
      tableTabs: [], // 分类列表
      courseIndex: 0, // 选择tab下标
      dialogTabs: [
        // pic: 1353 * 708
        { title: '第一联', name: '1', imgUrl: require('./component/formAbout/images/back-one.png') },
        { title: '第二联', name: '2', imgUrl: require('./component/formAbout/images/back-two.png') },
        { title: '第三联', name: '3', imgUrl: require('./component/formAbout/images/back-three.png') }
      ],
      rateOptions: [], // 增值税下拉列表
      // 请求参数
      queryParams: {
        page: 1,
        size: 10,
        keyWrods: '',
        formTypeCode: 'QB' // 表单分类编码
      },
      scopeDialog: '1', // 弹窗选中
      disable: false, // 弹窗二联三联不可输入
      isEdit: true, // 是否是编辑
      total: 0, // 列表总数
      tableData: [], // 列表数据
      dialogZzPreview: false, // 增值税预览弹窗
      formParams: {}, // json串
      formParamsAll: {}, // 设置权重参数
      dialogJzPreview: false, // 记账预览弹窗
      tablesInput: [
        { children: [{ sort: 10 }, { sort: 11 }, { sort: 12 }, { sort: 13 }, { sort: 14 }, { sort: 15 }] },
        { children: [{ sort: 16 }, { sort: 17 }, { sort: 18 }, { sort: 19 }, { sort: 20 }, { sort: 21 }] },
        { children: [{ sort: 22 }, { sort: 23 }, { sort: 24 }, { sort: 25 }, { sort: 26 }, { sort: 27 }] },
        { children: [{ sort: 28, maxNum: 10 }, { sort: 29, maxNum: 10 }, { sort: 30, maxNum: 10 }, { sort: 31, maxNum: 10 }, { sort: 32, maxNum: 10 }, { sort: 33 }, { sort: 34, maxNum: 10 }] },
        { children: [{ sort: 35, maxNum: 10 }, { sort: 36, maxNum: 10 }, { sort: 37, maxNum: 10 }, { sort: 38, maxNum: 10 }, { sort: 39, maxNum: 10 }, { sort: 40, maxNum: 10 }, { sort: 41, maxNum: 10 }] },
        { children: [{ sort: 42, maxNum: 10 }, { sort: 43, maxNum: 10 }, { sort: 44, maxNum: 10 }, { sort: 45, maxNum: 10 }, { sort: 46, maxNum: 10 }, { sort: 47, maxNum: 10 }, { sort: 48, maxNum: 10 }] },
        { children: [{ sort: 49, maxNum: 10 }, { sort: 50, maxNum: 10 }, { sort: 51, maxNum: 10 }, { sort: 52, maxNum: 10 }, { sort: 53, maxNum: 10 }, { sort: 54, maxNum: 10 }, { sort: 55, maxNum: 10 }] },
        { children: [{ sort: 56, maxNum: 10 }, { sort: 57, maxNum: 10 }, { sort: 58, maxNum: 10 }, { sort: 59, maxNum: 10 }, { sort: 60, maxNum: 10 }, { sort: 61, maxNum: 10 }, { sort: 62, maxNum: 10 }] },
        { children: [{ sort: 63, maxNum: 10 }, { sort: 64, maxNum: 10 }, { sort: 65, maxNum: 10 }, { sort: 66, maxNum: 10 }, { sort: 67, maxNum: 10 }, { sort: 68, maxNum: 10 }, { sort: 69, maxNum: 10 }] },
        { children: [{ sort: 70, maxNum: 10 }, { sort: 71, maxNum: 10 }, { sort: 72, maxNum: 10 }, { sort: 73, maxNum: 10 }, { sort: 74, maxNum: 10 }, { sort: 75, maxNum: 10 }, { sort: 76, maxNum: 10 }] },
        { children: [{ sort: 77, maxNum: 10 }, { sort: 78, maxNum: 10 }, { sort: 79, maxNum: 10 }, { sort: 80, maxNum: 10 }, { sort: 81, maxNum: 10 }, { sort: 82, maxNum: 10 }, { sort: 83, maxNum: 10 }] },
        { children: [{ sort: 84, maxNum: 10 }, { sort: 85, maxNum: 10 }, { sort: 86, maxNum: 10 }, { sort: 87, maxNum: 10 }, { sort: 88, maxNum: 10 }, { sort: 89, maxNum: 10 }, { sort: 90, maxNum: 10 }] },
        { children: [{ sort: 91, maxNum: 10 }, { sort: 92, maxNum: 10 }, { sort: 93, maxNum: 10 }, { sort: 94, maxNum: 10 }, { sort: 95, maxNum: 10 }, { sort: 96, maxNum: 10 }, { sort: 97, maxNum: 10 }] },
        { children: [{ sort: 98, maxNum: 10 }, { sort: 99, maxNum: 10 }, { sort: 100, maxNum: 10 }, { sort: 102, maxNum: 10 }, { sort: 102, maxNum: 10 }, { sort: 103, maxNum: 10 }, { sort: 104, maxNum: 10 }] },
        { children: [{ sort: 105, maxNum: 10 }, { sort: 106, maxNum: 10 }, { sort: 107, maxNum: 10 }, { sort: 108, maxNum: 10 }, { sort: 109, maxNum: 10 }, { sort: 110, maxNum: 10 }, { sort: 111, maxNum: 10 }] },
        { children: [{ sort: 112, maxNum: 10 }, { sort: 113, maxNum: 10 }, { sort: 114, maxNum: 10 }, { sort: 115, maxNum: 10 }, { sort: 116, maxNum: 10 }, { sort: 117, maxNum: 10 }, { sort: 118, maxNum: 10 }] },
        { children: [{ sort: 119, maxNum: 10 }, { sort: 120, maxNum: 10 }, { sort: 121, maxNum: 10 }, { sort: 122, maxNum: 10 }, { sort: 123, maxNum: 10 }, { sort: 124, maxNum: 10 }, { sort: 125, maxNum: 10 }] },
        { children: [{ sort: 126, maxNum: 10 }, { sort: 127, maxNum: 10 }, { sort: 128, maxNum: 10 }, { sort: 129, maxNum: 10 }, { sort: 130, maxNum: 10 }, { sort: 131, maxNum: 10 }, { sort: 132, maxNum: 10 }] },
        { children: [{ sort: 133, maxNum: 10 }, { sort: 134, maxNum: 10 }, { sort: 135, maxNum: 10 }, { sort: 136, maxNum: 10 }, { sort: 137, maxNum: 10 }, { sort: 138, maxNum: 10 }, { sort: 139, maxNum: 10 }] },
        { children: [{ sort: 140, maxNum: 10 }, { sort: 141, maxNum: 10 }, { sort: 142, maxNum: 10 }, { sort: 143, maxNum: 10 }, { sort: 144, maxNum: 10 }, { sort: 145, maxNum: 10 }, { sort: 146, maxNum: 10 }] },
        { children: [{ sort: 147, maxNum: 10 }, { sort: 148, maxNum: 10 }, { sort: 149, maxNum: 10 }, { sort: 150, maxNum: 10 }, { sort: 151, maxNum: 10 }, { sort: 152, maxNum: 10 }, { sort: 153, maxNum: 10 }] },
        { children: [{ sort: 154, maxNum: 10 }, { sort: 155, maxNum: 10 }, { sort: 156, maxNum: 10 }, { sort: 157, maxNum: 10 }, { sort: 158, maxNum: 10 }, { sort: 159, maxNum: 10 }, { sort: 160, maxNum: 10 }] },
        { children: [{ sort: 161, maxNum: 10 }, { sort: 162, maxNum: 10 }, { sort: 163, maxNum: 10 }, { sort: 164, maxNum: 10 }, { sort: 165, maxNum: 10 }, { sort: 166, maxNum: 10 }, { sort: 167, maxNum: 10 }] },
        { children: [{ sort: 168, maxNum: 10 }, { sort: 169, maxNum: 10 }, { sort: 170, maxNum: 10 }, { sort: 171, maxNum: 10 }, { sort: 172, maxNum: 10 }, { sort: 173, maxNum: 10 }, { sort: 174, maxNum: 10 }] },
        { children: [{ sort: 175, maxNum: 10 }, { sort: 176, maxNum: 10 }, { sort: 177, maxNum: 10 }, { sort: 178, maxNum: 10 }, { sort: 179, maxNum: 10 }, { sort: 180, maxNum: 10 }, { sort: 181, maxNum: 10 }] },
        { children: [{ sort: 182 }, { sort: 183 }, { sort: 184 }, { sort: 185 }, { sort: 186 }, { sort: 187 }, { sort: 188 }] }
      ],
      dialogFzPreview: false, // 资产负债表弹窗
      tablesInput2: [{
        children: [
          {}, { sort: 2 }, { sort: 3 }, { sort: 4 }, { sort: 5 }, { sort: 6 },
          { sort: 7 }, { sort: 8 }, { sort: 9 }, { sort: 10 }, { sort: 11, disable: true }, {},
          { sort: 12 }, { sort: 13 }, { sort: 14 }, { sort: 15 }, { sort: 16 }, { sort: 17 },
          { sort: 18 }, { sort: 19 }, { sort: 20 }, { sort: 21 }, { sort: 22 }, { sort: 23 },
          { sort: 24 }, { sort: 25, disable: true }, {}, {}, {}, {}, {}, {}, {}, { sort: 26, disable: true }
        ]
      }, {
        children: [
          {}, { sort: 28 }, { sort: 29 }, { sort: 30 }, { sort: 31 }, { sort: 32 },
          { sort: 33 }, { sort: 34 }, { sort: 35 }, { sort: 36 }, { sort: 37, disable: true }, {},
          { sort: 38 }, { sort: 39 }, { sort: 40 }, { sort: 41 }, { sort: 42 }, { sort: 43 },
          { sort: 44 }, { sort: 45 }, { sort: 46 }, { sort: 47 }, { sort: 48 }, { sort: 49 },
          { sort: 50 }, { sort: 51, disable: true }, {}, {}, {}, {}, {}, {}, {}, { sort: 52, disable: true }
        ]
      }, {
        children: [
          {}, { sort: 54 }, { sort: 55 }, { sort: 56 }, { sort: 57 }, { sort: 58 },
          { sort: 59 }, { sort: 60 }, { sort: 61 }, { sort: 62 }, { sort: 63 }, { sort: 64, disable: true },
          { sort: 65 }, { sort: 66 }, { sort: 67 }, { sort: 68 }, { sort: 69 }, { sort: 70 },
          { sort: 71 }, { sort: 72 }, { sort: 73, disable: true }, { sort: 74, disable: true }, { sort: 75 }, { sort: 76 },
          { sort: 77 }, { sort: 78 }, { sort: 79 }, { sort: 80 }, { sort: 81 }, { sort: 82 },
          { sort: 83 }, { sort: 84 }, { sort: 85, disable: true }, { sort: 86, disable: true }
        ]
      }, {
        children: [
          {}, { sort: 88 }, { sort: 89 }, { sort: 90 }, { sort: 91 }, { sort: 92 },
          { sort: 93 }, { sort: 94 }, { sort: 95 }, { sort: 96 }, { sort: 97 }, { sort: 98, disable: true },
          { sort: 99 }, { sort: 100 }, { sort: 101 }, { sort: 102 }, { sort: 103 }, { sort: 104 },
          { sort: 105 }, { sort: 106 }, { sort: 107, disable: true }, { sort: 108, disable: true }, { sort: 109 }, { sort: 110 },
          { sort: 111 }, { sort: 112 }, { sort: 113 }, { sort: 114 }, { sort: 115 }, { sort: 116 },
          { sort: 117 }, { sort: 118 }, { sort: 119, disable: true }, { sort: 120, disable: true }
        ]
      }],
      dialogLrPreview: false, // 利润表弹框
      tablesInputLr: [
        {
          children: [
            { sort: 1 }, { sort: 2 }, { sort: 3 }, { sort: 4 }, { sort: 5 }, { sort: 6 },
            { sort: 7 }, { sort: 8 }, { sort: 9 }, { sort: 10 }, { sort: 11 }, { sort: 12 },
            { sort: 13 }, { sort: 14 }, { sort: 15 }, { sort: 16, disable: true }, { sort: 17 },
            { sort: 18 }, { sort: 19, disable: true }, { sort: 20 }, { sort: 21, disable: true },
            { sort: 22 }, { sort: 23 }, { sort: 24 }, { sort: 25 }, { sort: 26 }, { sort: 27 }
          ]
        },
        {
          children: [
            { sort: 28 }, { sort: 29 }, { sort: 30 }, { sort: 31 }, { sort: 32 }, { sort: 33 },
            { sort: 34 }, { sort: 35 }, { sort: 36 }, { sort: 37 }, { sort: 38 }, { sort: 39 },
            { sort: 40 }, { sort: 41 }, { sort: 42 }, { sort: 43, disable: true }, { sort: 44 },
            { sort: 45 }, { sort: 46, disable: true }, { sort: 47 }, { sort: 48, disable: true },
            { sort: 49 }, { sort: 50 }, { sort: 51 }, { sort: 52 }, { sort: 53 }, { sort: 54 }
          ]
        }
      ],
      dialogXjPreview: false, // 现金流量表弹窗
      xjllbItem: [{
        children: [
          {}, { sort: 1 }, { sort: 2 }, { sort: 3 }, { sort: 4, disable: true }, { sort: 5 }, { sort: 6 },
          { sort: 7 }, { sort: 8 }, { sort: 9, disable: true }, { sort: 10, disable: true }, { sort: 11 },
          { sort: 12 }, { sort: 13 }, { sort: 14 }, { sort: 15 }, { sort: 16, disable: true }, { sort: 17 },
          { sort: 18 }, { sort: 19 }, { sort: 20 }, { sort: 21, disable: true }, { sort: 22, disable: true }, { sort: 23 },
          { sort: 24 }, { sort: 25 }, { sort: 26 }, { sort: 27 }, { sort: 28, disable: true }, { sort: 29 }, { sort: 30 },
          { sort: 31 }, { sort: 32 }, { sort: 33, disable: true }, { sort: 34, disable: true }, { sort: 35 }, { sort: 36 }, { sort: 37, disable: true }, { sort: 38, disable: true }, { sort: 39 }, { sort: 40, disable: true }
        ]
      },
      {
        children: [
          {}, { sort: 41 }, { sort: 42 }, { sort: 43 }, { sort: 44, disable: true }, { sort: 45 }, { sort: 46 },
          { sort: 47 }, { sort: 48 }, { sort: 49, disable: true }, { sort: 50, disable: true }, { sort: 51 },
          { sort: 52 }, { sort: 53 }, { sort: 54 }, { sort: 55 }, { sort: 56, disable: true }, { sort: 57 },
          { sort: 58 }, { sort: 59 }, { sort: 60 }, { sort: 61, disable: true }, { sort: 62, disable: true }, { sort: 63 },
          { sort: 64 }, { sort: 65 }, { sort: 66 }, { sort: 67 }, { sort: 68, disable: true }, { sort: 69 }, { sort: 70 },
          { sort: 71 }, { sort: 72 }, { sort: 73, disable: true }, { sort: 74, disable: true }, { sort: 75 }, { sort: 76 }, { sort: 77, disable: true }, { sort: 78, disable: true }, { sort: 79 }, { sort: 80, disable: true }
        ]
      }
    ]
    }
  },
  created() {
    // 查询表单分类
    screenFormType().then(res => {
      if (res.code === '0') {
        res.result.unshift({ name: '全部', code: 'QB' })
        this.tableTabs = res.result
      } else {
        this.$message.warning(res.message)
      }
    })

    // 获取列表
    this.getList()
  },
  watch: {
    'queryParams.keyWrods': {
      handler(newVal, oldVal) {
        this.getSearchList()
      },
      deep: true
    },
    isEdit(newVal) {
      if (newVal == 1) {
        this.disable = false
      } else {
        this.disable = true
      }
    }
  },
  methods: {
    // 切换选项卡
    // handleClick(tab, event) {
    //   this.getList()
    // },
    courseType(index) {
      this.queryParams.page = 1
      this.courseIndex = index
      this.queryParams.formTypeCode = this.tableTabs[index].code
      this.getList()
    },
    // 切换一二三联
    handleClickDialog(tab, event) {
      if (this.scopeDialog == '1' && this.isEdit) {
        this.disable = false
      } else {
        this.disable = true
      }
    },
    // 获取table数据
    getList() {
      screenFormList(this.queryParams).then(res => {
        if (res.code === '0') {
          this.tableData = res.result.data
          this.total = Number(res.result.total)
          // 回table顶部
          this.$el.getElementsByClassName('el-table__body-wrapper')[0].scrollTop = 0
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 键盘抬起搜索
    getSearchList: _vueDebounce('getList', 500),
    // 预览
    handleGetInfo(row, flag) {
      // console.log(row.code)
      if (row.code == 'CZBDJZPZ') {
        // 记账凭证
        this.dialogJzPreview = true
      } else if (row.code == 'CZBDZZSZYFP') {
        // 切换到第一联 打开弹窗
        this.scopeDialog = '1'
        this.dialogZzPreview = true
      } else if (row.code == 'CZBDZCFZB') {
        // 资产负债表
        this.dialogFzPreview = true
      } else if (row.code == 'CZBDLRB') {
        // 利润表
        this.dialogLrPreview = true
      } else if (row.code == 'CZBDXJLLB') {
        // 资产负债表
        this.dialogXjPreview = true
      } else {
        this.$message.warning('此表单正在开发中！')
        return false
      }

      if (flag) {
        this.isEdit = true
        this.disable = false // 可输入

        this.formParamsAll = {
          formInfoCode: row.code,
          courseId: 0,
          outlineId: 0,
          taskId: 0
        }
        screenGetWeight(this.formParamsAll).then(res => {
          if (res.code === '0') {
            this.formParams = JSON.parse(res.result.weightValue)
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.formParams = {}
        this.isEdit = false
      }
    },
    // 计算金额
    handleComputed(params1, params2, product, product1, product2) {
      const newStr1 = this.formParams[params1]
      const newStr2 = this.formParams[params2]
      if (newStr1 && newStr2) {
        this.formParams[product] = numberMul(newStr1, newStr2)
      } else {
        this.formParams[product] = ''
        this.formParams[product2] = ''
      }
      // 计算 金额
      let totalNum = 0
      for (let i = 44; i <= 50; i++) {
        if (this.formParams['input' + i] != undefined) {
          totalNum = numberAdd(totalNum, this.formParams['input' + i])
        }
      }
      this.formParams.input51 = totalNum
      // 未选择税率时 不计算税额
      if (this.formParams[product1] != undefined) {
        this.selectRate(this.formParams[product1], product, product2)
      }
      this.$forceUpdate()
    },
    // 选择费率 计算税额 合计
    selectRate(value, params1, product) {
      if (this.formParams[params1] != undefined) {
        this.formParams[product] = numberMul(this.formParams[params1], value)
      }

      // 计算 税额 及 价税合计
      let totalNum = 0
      for (let i = 59; i <= 65; i++) {
        if (this.formParams['input' + i] !== undefined) {
          totalNum = numberAdd(totalNum, this.formParams['input' + i])
        }
      }
      this.formParams.input66 = totalNum
      if (this.formParams.input51) {
        const money = numberAdd(this.formParams.input51, this.formParams.input66)
        this.formParams.input68 = '￥' + money
        this.formParams.input67 = convertCurrency(money)
      }
      this.$forceUpdate()
    },
    // 输入正整数
    blurText(input, num = 100) {
      const boolean = new RegExp('^[0-9][0-9]*$').test(this.formParams[input])
      if (!boolean && this.formParams[input] != '' && this.formParams[input] != undefined) {
        this.$message.warning('请输入0或正整数！')
        this.formParams[input] = ''
      } else if (Number(this.formParams[input]) > num) {
        this.$message.warning('单个数据不能超过' + num)
        if (num > 10) {
          this.formParams[input] = 100
        } else {
          this.formParams[input] = 1
        }
      }
    },
    // 保存
    /**
     * @param {*} type 表单类别
     * @param {*} number 表单输入框数量
     */
    handleConserve(type, number) {
      let totalNum = 0
      for (let i = 1; i <= number; i++) {
        if (this.formParams['input' + i] != undefined) {
          totalNum = numberAdd(totalNum, this.formParams['input' + i])
        }
      }
      if (100 % totalNum != '0') {
        this.$message.warning('权重值之和必须是100的整除数！')
      } else {
        this.formParamsAll.weightValue = JSON.stringify(this.formParams)
        screenSaveWeight(this.formParamsAll).then(res => {
          if (res.code === '0') {
            if (type == '1') {
              // 增值税发票
              this.dialogZzPreview = false
            } else if (type == '2') {
              // 记账凭证
              this.dialogJzPreview = false
            } else if (type == '3') {
              // 资产负债表
              this.dialogFzPreview = false
            } else if (type == '4') {
              this.dialogXjPreview = false
            } else if (type == '5') {
              this.dialogLrPreview = false
            }
            this.$message.success(res.message)
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    },
    // 关闭弹窗
    closeDialog() {
      this.formParams = {}
    }
  }
}
</script>

<style lang="scss">
.form-set-wrapper {
  height: 100%;
  overflow: hidden;
  padding: 15px 0;
  .btn-box {
    .el-button--primary {
      background: #414D65;
      border-color: #414D65;
    }
  }
  .el-table{
    // th {
    //   background:#E5EAF4;
    // }
    .el-button--mini {
      margin-top: 2px;
      margin-bottom: 2px;
    }
  }
  // .pagination-container {
  //   padding: 10px 0;
  // }
  .el-input.is-disabled {
    .el-input__inner {
      color: #606266;
      background: #fff;
      border-color: #fff;
    }
  }
  .dialog-footer {
    text-align: center;
  }
  .preview-dialog{
    width: 1205px;
    .el-dialog__body {
      height: 600px;
      overflow: auto;
      padding: 10px;
      .lr-card-wrapper{
        .input-list-lr{
          input{
            background-color: transparent;
          }
        }
      }
    }
  }
}
</style>
