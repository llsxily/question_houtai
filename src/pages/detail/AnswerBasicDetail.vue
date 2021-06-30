<template>
    <page-layout title="答案详情页">
      <a-card :bordered="false">
        <detail-list title="答案详情页" layout="vertical" :col="2">
          <detail-list-item term="记录编号">{{ data_dict.no}}</detail-list-item>
          <detail-list-item term="回答人真实姓名">{{ data_dict.name}}</detail-list-item>
          <detail-list-item term="是否匿名发布">{{ data_dict.is_nimin}}</detail-list-item>
          <detail-list-item term="是否最佳答案">{{data_dict.is_best}}</detail-list-item>
        </detail-list>
        <detail-list  layout="vertical" :col="1">
          <detail-list-item term="回答内容">{{ data_dict.title }}</detail-list-item>
        </detail-list>
        <a-button type="danger" @click="delete_ans()">删除该回答</a-button>
      </a-card>
    </page-layout>
</template>

<script>
import DetailList from '../../components/tool/DetailList'
import PageLayout from '../../layouts/PageLayout'
import {DELETE_ANSWER, GET_ANSWER_DETAIL} from '@/services/api'
import {METHOD, request} from "@/utils/request"

const DetailListItem = DetailList.Item

const data_dict ={
  title: '',
  no: '',
  name: '',
  is_nimin: '',
  is_best: '',
}
export default {
  name: 'BasicDetail',
  components: {PageLayout, DetailListItem, DetailList},
  data () {
    return {
      data_dict,
    }
  },
  methods:{
    delete_ans(){
      var searchParams = new URLSearchParams();
      searchParams.append('answer_ids', this.$route.params.id)
      request(DELETE_ANSWER, METHOD.GET, searchParams).then((res) => {
        if(res.data.code === 200){
          this.$message.info(res.data.msg)
          this.$closePage('/answer/' + this.$route.params.id, '/question/detail/' + this.$route.params.parent_id)
          this.$refreshPage('/question/detail/' + this.$route.params.parent_id)
        }else{
          this.$message.info(res.data.msg)
        }
      })
    }
  },
  beforeMount() {
    var searchParams = new URLSearchParams();
    searchParams.append('answer_id', this.$route.params.id)
    request(GET_ANSWER_DETAIL, METHOD.GET, searchParams).then((res) => {
      console.log(res);
      if(res.data.code === 200){
        this.$message.info(res.data.msg)
        let res_data = res.data.data
        data_dict.no = res_data.answer_id
        data_dict.title = res_data.answer_detail
        data_dict.name = res_data.answer_user_name
        data_dict.is_best = res_data.answer_is_best
        data_dict.is_nimin = res_data.answer_id_nimin ? '是' : '否'
      }else{
        this.$message.info(res.data.msg)
      }
    })
  }
}
</script>

<style lang="less" scoped>
  .title {
    color: @title-color;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
</style>
