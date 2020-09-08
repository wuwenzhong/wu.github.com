<template>
  <div class="zzs-card-wrapper">
    <el-tabs tab-position="left" v-model="scopeDialog">
      <el-tab-pane v-for="(item, index) in dialogTabs" :key="index" :label="item.title" :name="item.name">
        <div class="card-wrapper">
          <img :src="item.imgUrl" class="back-content" alt="">

          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input1" :disabled="disable" class="input"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input2" :disabled="disable" class="input-robot"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input3" :disabled="disable" class="input-number"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input1" :disabled="disable" @blur="blurText('input1')" class="input"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input2" :disabled="disable" @blur="blurText('input2')" class="input-robot"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input3" :disabled="disable" @blur="blurText('input3')" class="input-number"></el-input>

          <el-input v-model="formParams.input1" :disabled="queryParams.setType == '3' ? true : false" class="input-copy"></el-input>
          <el-input v-model="formParams.input3" :disabled="queryParams.setType == '3' ? true : false" class="input-number-copy"></el-input>

          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input4" :disabled="disable" class="input-time"></el-input>
          <el-date-picker
            v-show="queryParams.setType != '2'"
            format="yyyy 年 MM 月 dd 日 "
            class="input-time"
            v-model="choseTime.time"
            @blur="handleChangeCheck('input4')"
            :clearable="false"
            type="date"
            align="right"
            :disabled="disable"
            size="small"></el-date-picker>

          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input5" :disabled="disable" class="input-info info-name"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input6" :disabled="disable" class="input-info info-number"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input7" :disabled="disable" class="input-info info-adress"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input8" :disabled="disable" class="input-info info-bank"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input5" :disabled="disable" @blur="blurText('input5')" class="input-info info-name"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input6" :disabled="disable" @blur="blurText('input6')" class="input-info info-number"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input7" :disabled="disable" @blur="blurText('input7')" class="input-info info-adress"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input8" :disabled="disable" @blur="blurText('input8')" class="input-info info-bank"></el-input>

          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input9" :disabled="disable" class="input-list oneline"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input10" :disabled="disable" class="input-list oneline two"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input11" :disabled="disable" class="input-list oneline three"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input12" :disabled="disable" class="input-list oneline four"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input13" :disabled="disable" class="input-list oneline five"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input14" :disabled="disable" class="input-list oneline six"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input15" :disabled="disable" class="input-list oneline seven"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input9" :disabled="disable" @blur="blurText('input9')" class="input-list oneline"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input10" :disabled="disable" @blur="blurText('input10')" class="input-list oneline two"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input11" :disabled="disable" @blur="blurText('input11')" class="input-list oneline three"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input12" :disabled="disable" @blur="blurText('input12')" class="input-list oneline four"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input13" :disabled="disable" @blur="blurText('input13')" class="input-list oneline five"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input14" :disabled="disable" @blur="blurText('input14')" class="input-list oneline six"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input15" :disabled="disable" @blur="blurText('input15')" class="input-list oneline seven"></el-input>

          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input16" :disabled="disable" class="input-list twoline one"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input17" :disabled="disable" class="input-list twoline two"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input18" :disabled="disable" class="input-list twoline three"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input19" :disabled="disable" class="input-list twoline four"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input20" :disabled="disable" class="input-list twoline five"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input21" :disabled="disable" class="input-list twoline six"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input22" :disabled="disable" class="input-list twoline seven"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input16" :disabled="disable" @blur="blurText('input16')" class="input-list twoline one"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input17" :disabled="disable" @blur="blurText('input17')" class="input-list twoline two"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input18" :disabled="disable" @blur="blurText('input18')" class="input-list twoline three"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input19" :disabled="disable" @blur="blurText('input19')" class="input-list twoline four"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input20" :disabled="disable" @blur="blurText('input20')" class="input-list twoline five"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input21" :disabled="disable" @blur="blurText('input21')" class="input-list twoline six"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input22" :disabled="disable" @blur="blurText('input22')" class="input-list twoline seven"></el-input>

          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input23" :disabled="disable" class="input-list threeline one"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input24" :disabled="disable" class="input-list threeline two"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input25" :disabled="disable" class="input-list threeline three"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input26" :disabled="disable" class="input-list threeline four"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input27" :disabled="disable" class="input-list threeline five"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input28" :disabled="disable" class="input-list threeline six"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input29" :disabled="disable" class="input-list threeline seven"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input23" :disabled="disable" @blur="blurText('input23')" class="input-list threeline one"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input24" :disabled="disable" @blur="blurText('input24')" class="input-list threeline two"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input25" :disabled="disable" @blur="blurText('input25')" class="input-list threeline three"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input26" :disabled="disable" @blur="blurText('input26')" class="input-list threeline four"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input27" :disabled="disable" @blur="blurText('input27')" class="input-list threeline five"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input28" :disabled="disable" @blur="blurText('input28')" class="input-list threeline six"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input29" :disabled="disable" @blur="blurText('input29')" class="input-list threeline seven"></el-input>

          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input30" :disabled="disable" class="input-list fourline one"
            @blur="handleComputed('input30','input37','input44', 'input52', 'input59')"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input31" :disabled="disable" class="input-list fourline two"
            @blur="handleComputed('input31','input38','input45', 'input53', 'input60')"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input32" :disabled="disable" class="input-list fourline three"
            @blur="handleComputed('input32','input39','input46', 'input54', 'input61')"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input33" :disabled="disable" class="input-list fourline four"
            @blur="handleComputed('input33','input40','input47', 'input55', 'input62')"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input34" :disabled="disable" class="input-list fourline five"
            @blur="handleComputed('input34','input41','input48', 'input56', 'input63')"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input35" :disabled="disable" class="input-list fourline six"
            @blur="handleComputed('input35','input42','input49', 'input57', 'input64')"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input36" :disabled="disable" class="input-list fourline seven"
            @blur="handleComputed('input36','input43','input50', 'input58', 'input65')"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input30" :disabled="disable" @blur="blurText('input30')" class="input-list fourline one"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input31" :disabled="disable" @blur="blurText('input31')" class="input-list fourline two"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input32" :disabled="disable" @blur="blurText('input32')" class="input-list fourline three"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input33" :disabled="disable" @blur="blurText('input33')" class="input-list fourline four"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input34" :disabled="disable" @blur="blurText('input34')" class="input-list fourline five"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input35" :disabled="disable" @blur="blurText('input35')" class="input-list fourline six"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input36" :disabled="disable" @blur="blurText('input36')" class="input-list fourline seven"></el-input>

          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input37" :disabled="disable" class="input-list fiveline one"
            @blur="handleComputed('input37','input30','input44', 'input52', 'input59')"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input38" :disabled="disable" class="input-list fiveline two"
            @blur="handleComputed('input38','input31','input45', 'input53', 'input60')"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input39" :disabled="disable" class="input-list fiveline three"
            @blur="handleComputed('input39','input32','input46', 'input54', 'input61')"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input40" :disabled="disable" class="input-list fiveline four"
            @blur="handleComputed('input40','input33','input47', 'input55', 'input62')"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input41" :disabled="disable" class="input-list fiveline five"
            @blur="handleComputed('input41','input34','input48', 'input56', 'input63')"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input42" :disabled="disable" class="input-list fiveline six"
            @blur="handleComputed('input42','input35','input49', 'input57', 'input64')"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input43" :disabled="disable" class="input-list fiveline seven"
            @blur="handleComputed('input43','input36','input50', 'input58', 'input65')"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input37" :disabled="disable" @blur="blurText('input37')" class="input-list fiveline one"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input38" :disabled="disable" @blur="blurText('input38')" class="input-list fiveline two"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input39" :disabled="disable" @blur="blurText('input39')" class="input-list fiveline three"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input40" :disabled="disable" @blur="blurText('input40')" class="input-list fiveline four"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input41" :disabled="disable" @blur="blurText('input41')" class="input-list fiveline five"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input42" :disabled="disable" @blur="blurText('input42')" class="input-list fiveline six"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input43" :disabled="disable" @blur="blurText('input43')" class="input-list fiveline seven"></el-input>

          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input44" :disabled="queryParams.setType == '3' ? true : false" class="input-list sixline one"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input45" :disabled="queryParams.setType == '3' ? true : false" class="input-list sixline two"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input46" :disabled="queryParams.setType == '3' ? true : false" class="input-list sixline three"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input47" :disabled="queryParams.setType == '3' ? true : false" class="input-list sixline four"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input48" :disabled="queryParams.setType == '3' ? true : false" class="input-list sixline five"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input49" :disabled="queryParams.setType == '3' ? true : false" class="input-list sixline six"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input50" :disabled="queryParams.setType == '3' ? true : false" class="input-list sixline seven"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input51" :disabled="queryParams.setType == '3' ? true : false" class="input-list sixline eight"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input44" :disabled="disable" @blur="blurText('input44')" class="input-list sixline one"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input45" :disabled="disable" @blur="blurText('input45')" class="input-list sixline two"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input46" :disabled="disable" @blur="blurText('input46')" class="input-list sixline three"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input47" :disabled="disable" @blur="blurText('input47')" class="input-list sixline four"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input48" :disabled="disable" @blur="blurText('input48')" class="input-list sixline five"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input49" :disabled="disable" @blur="blurText('input49')" class="input-list sixline six"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input50" :disabled="disable" @blur="blurText('input50')" class="input-list sixline seven"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input51" :disabled="disable" @blur="blurText('input51')" class="input-list sixline eight"></el-input>

          <el-select v-show="queryParams.setType != '2'" @change="selectRate(formParams.input52, 'input44', 'input59')" v-model="formParams.input52" class="input-list sevenline" :disabled="disable" placeholder="">
            <el-option v-for="item in rateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-show="queryParams.setType != '2'" @change="selectRate(formParams.input53, 'input45', 'input60')" v-model="formParams.input53" class="input-list sevenline two" :disabled="disable" placeholder="">
            <el-option v-for="item in rateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-show="queryParams.setType != '2'" @change="selectRate(formParams.input54, 'input46', 'input61')" v-model="formParams.input54" class="input-list sevenline three" :disabled="disable" placeholder="">
            <el-option v-for="item in rateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-show="queryParams.setType != '2'" @change="selectRate(formParams.input55, 'input47', 'input62')" v-model="formParams.input55" class="input-list sevenline four" :disabled="disable" placeholder="">
            <el-option v-for="item in rateOptions " :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-show="queryParams.setType != '2'" @change="selectRate(formParams.input56, 'input48', 'input63')" v-model="formParams.input56" class="input-list sevenline five" :disabled="disable" placeholder="">
            <el-option v-for="item in rateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-show="queryParams.setType != '2'" @change="selectRate(formParams.input57, 'input49', 'input64')" v-model="formParams.input57" class="input-list sevenline six" :disabled="disable" placeholder="">
            <el-option v-for="item in rateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-show="queryParams.setType != '2'" @change="selectRate(formParams.input58, 'input50', 'input65')" v-model="formParams.input58" class="input-list sevenline seven" :disabled="disable" placeholder="">
            <el-option v-for="item in rateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>

          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input52" :disabled="disable" @blur="blurText('input52')" class="input-list sevenline one"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input53" :disabled="disable" @blur="blurText('input53')" class="input-list sevenline two"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input54" :disabled="disable" @blur="blurText('input54')" class="input-list sevenline three"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input55" :disabled="disable" @blur="blurText('input55')" class="input-list sevenline four"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input56" :disabled="disable" @blur="blurText('input56')" class="input-list sevenline five"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input57" :disabled="disable" @blur="blurText('input57')" class="input-list sevenline six"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input58" :disabled="disable" @blur="blurText('input58')" class="input-list sevenline seven"></el-input>

          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input59" :disabled="queryParams.setType == '3' ? true : false" class="input-list eightline one"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input60" :disabled="queryParams.setType == '3' ? true : false" class="input-list eightline two"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input61" :disabled="queryParams.setType == '3' ? true : false" class="input-list eightline three"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input62" :disabled="queryParams.setType == '3' ? true : false" class="input-list eightline four"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input63" :disabled="queryParams.setType == '3' ? true : false" class="input-list eightline five"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input64" :disabled="queryParams.setType == '3' ? true : false" class="input-list eightline six"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input65" :disabled="queryParams.setType == '3' ? true : false" class="input-list eightline seven"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input66" :disabled="queryParams.setType == '3' ? true : false" class="input-list eightline eight"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input59" :disabled="disable" @blur="blurText('input59')" class="input-list eightline one"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input60" :disabled="disable" @blur="blurText('input60')" class="input-list eightline two"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input61" :disabled="disable" @blur="blurText('input61')" class="input-list eightline three"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input62" :disabled="disable" @blur="blurText('input62')" class="input-list eightline four"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input63" :disabled="disable" @blur="blurText('input63')" class="input-list eightline five"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input64" :disabled="disable" @blur="blurText('input64')" class="input-list eightline six"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input65" :disabled="disable" @blur="blurText('input65')" class="input-list eightline seven"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input66" :disabled="disable" @blur="blurText('input66')" class="input-list eightline eight"></el-input>

          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input67" :disabled="queryParams.setType == '3' ? true : false" class="input-money cap"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input68" :disabled="queryParams.setType == '3' ? true : false" class="input-money"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input67" :disabled="disable" @blur="blurText('input67')" class="input-money cap"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input68" :disabled="disable" @blur="blurText('input68')" class="input-money"></el-input>

          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input69" :disabled="disable" class="input-info-no info-name"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input70" :disabled="disable" class="input-info-no info-number"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input71" :disabled="disable" class="input-info-no info-adress"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input72" :disabled="disable" class="input-info-no info-bank"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input69" :disabled="disable" @blur="blurText('input69')" class="input-info-no info-name"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input70" :disabled="disable" @blur="blurText('input70')" class="input-info-no info-number"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input71" :disabled="disable" @blur="blurText('input71')" class="input-info-no info-adress"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input72" :disabled="disable" @blur="blurText('input72')" class="input-info-no info-bank"></el-input>

          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input73" :disabled="disable" class="input-person"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input74" :disabled="disable" class="input-person fuhe"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input75" :disabled="disable" class="input-person kaipiao"></el-input>
          <el-input v-show="queryParams.setType != '2'" v-model="formParams.input76" :disabled="disable" class="input-person xiaoshou"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input73" :disabled="disable" @blur="blurText('input73')"  class="input-person"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input74" :disabled="disable" @blur="blurText('input74')"  class="input-person fuhe"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input75" :disabled="disable" @blur="blurText('input75')"  class="input-person kaipiao"></el-input>
          <el-input v-show="queryParams.setType == '2'" v-model="formParams.input76" :disabled="disable" @blur="blurText('input76')"  class="input-person xiaoshou"></el-input>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { screenTaxRate } from '@/api/formAbout.js'
import { numberMul, numberAdd, convertCurrency, formatDate } from '@/common/js/utils.js'

export default {
  props: {
    queryParams: {
      type: Object
    },
    formParams: {
      type: Object
    },
    choseTime: {
      type: Object
    }
  },
  data() {
    return {
      dialogTabs: [
        // pic: 1353 * 708
        { title: '第一联', name: '1', imgUrl: require('./images/back-one.png') },
        { title: '第二联', name: '2', imgUrl: require('./images/back-two.png') },
        { title: '第三联', name: '3', imgUrl: require('./images/back-three.png') }
      ],
      rateOptions: [], // 增值税下拉列表
      scopeDialog: '1', // 弹窗选中
      disable: false // 弹窗二联三联不可输入
    }
  },
  created() {
    // 获取增值税列表
    screenTaxRate({ type: 1 }).then(res => {
      if (res.code === '0') {
        this.rateOptions = res.result
      } else {
        this.$message.warning(res.message)
      }
    })
  },
  watch: {
    scopeDialog(newVal) {
      if (newVal == '1') {
        this.disable = false
      } else {
        this.disable = true
      }
    }
  },
  methods: {
    // 切换一二三联
    // handleClickDialog(tab, event) {
    //   console.log(this.scopeDialog)
    //   if (this.scopeDialog == '1') {
    //     this.disable = false
    //   } else {
    //     this.disable = true
    //   }
    // },
    // 调用父组件失去焦点事件
    blurText(input, num) {
      this.$emit('blur-event', input, num)
    },
    // 选择时间
    handleChangeCheck(val) {
      if (this.choseTime.time) {
        this.formParams[val] = formatDate(this.choseTime.time)
      }
    },
    // 计算金额
    handleComputed(params1, params2, product, product1, product2) {
      const boolean = /[1-9]\d*.?|0.[1-9]\d*$/.test(this.formParams[params1])
      if (!boolean && this.formParams[params1] != undefined) {
        this.$message.warning('只能输入正数！')
        this.formParams[params1] = ''
      } else {
        var newStr1 = this.formParams[params1]
        var newStr2 = this.formParams[params2]
      }
      // 计算 单项金额
      if (newStr1 && newStr2) {
        this.formParams[product] = numberMul(newStr1, newStr2)
      } else {
        this.formParams[product] = ''
        this.formParams[product2] = ''
      }
      // 计算 合计金额
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
    }
  }
}
</script>

<style lang="scss">
  .zzs-card-wrapper {
    .card-wrapper {
      height: 580px;
      position: relative;
      img {
        // width: 96%;
        width: 1109px;
        position: absolute;
        top: 0;
      }
      input {
        padding: 0;
        border: none;
        background: #fbfaf7;
      }
      .input {
        width: 145px;
        font-size: 22px;
        position: absolute;
        top: 44px;
        left: 210px;
        input {
          height: 30px;
        }
      }
      .input-copy {
        width: 88px;
        font-size: 14px;
        position: absolute;
        top: 58px;
        left: 935px;
        input {
          height: 14px;
        }
      }
      .input-robot {
        width: 134px;
        position: absolute;
        top: 102px;
        left: 176px;
        input {
          height: 22px;
        }
      }
      .input-number {
        width: 136px;
        font-size: 22px;
        position: absolute;
        top: 42px;
        left: 782px;
        input {
          height: 30px;
        }
      }
      .input-number-copy {
        width: 145px;
        font-size: 16px;
        position: absolute;
        top: 72px;
        left: 878px;
        input {
          height: 18px;
        }
      }
      .input-time {
        width: 136px;
        // font-size: 22px;
        position: absolute;
        top: 90px;
        left: 860px;
        input {
          height: 22px;
        }
        .el-input__prefix {
          display: none;
        }
      }
      .input-info {
        width: 380px;
        // font-size: 20x;
        position: absolute;
        top: 130px;
        left: 240px;
        input {
          height: 20px;
        }
        &.info-number {
          top: 151px;
        }
        &.info-adress {
          top: 172px;
        }
        &.info-bank {
          top: 194px;
        }
      }
      .input-list {
        width: 240px;
        position: absolute;
        top: 236px;
        left: 99px;
        input {
          height: 20px !important;
        }
        &.two {
          top: 256px;
        }
        &.three {
          top: 276px;
        }
        &.four {
          top: 296px;
        }
        &.five {
          top: 316px;
        }
        &.six {
          top: 336px;
        }
        &.seven {
          top: 356px;
        }
        &.eight {
          top: 376px;
        }
        &.twoline {
          width: 117px;
          left: 347px;
        }
        &.threeline {
          width: 52px;
          left: 469px;
        }
        &.fourline {
          width: 87px;
          left: 525px;
        }
        &.fiveline {
          width: 88px;
          left: 616px;
        }
        &.sixline {
          width: 132px;
          left: 709px;
        }
        &.sevenline {
          width: 44px;
          left: 846px;
          .el-input__suffix {
            display: none;
          }
        }
        &.eightline {
          width: 125px;
          left: 894px;
        }
      }
      .input-money {
        width: 140px;
        position: absolute;
        top: 406px;
        left: 844px;
        input {
          height: 22px;
        }
        &.cap {
          width: 364px;
          left: 375px;
        }
      }
      .input-info-no {
        width: 380px;
        font-size: 20x;
        position: absolute;
        top: 436px;
        left: 240px;
        input {
          height: 20px;
        }
        &.info-number {
          top: 456px;
        }
        &.info-adress {
          top: 476px;
        }
        &.info-bank {
          top: 496px;
        }
      }
      .input-person {
        width: 92px;
        position: absolute;
        top: 521px;
        left: 168px;
        input {
          height: 22px;
        }
        &.fuhe {
          left: 424px;
        }
        &.kaipiao {
          left: 652px;
        }
        &.xiaoshou {
          width: 155px;
          left: 860px;
        }
      }
    }
  }
</style>