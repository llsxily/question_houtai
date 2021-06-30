<template>
    <page-layout title="答案详情页">
      <a-card :bordered="false">
        <detail-list title="邮件详情" layout="vertical" :col="2">
          <detail-list-item term="记录编号">{{ data_dict.no}}</detail-list-item>
          <detail-list-item term="高管信箱标题">{{ data_dict.title }}</detail-list-item>
          <detail-list-item term="提问人真实姓名">{{ data_dict.name}}</detail-list-item>
          <detail-list-item term="是否匿名发布">{{ data_dict.is_nimin}}</detail-list-item>
          <detail-list-item term="高管信箱内容">{{data_dict.detail}}</detail-list-item>
        </detail-list>
        <a-button type="danger">删除该邮件</a-button>
      </a-card>
    </page-layout>
</template>

<script>
import DetailList from '../../components/tool/DetailList'
import PageLayout from '../../layouts/PageLayout'
import {GET_GAOGUAN_DETAIL} from '@/services/api'
import {METHOD, request} from "@/utils/request"

const DetailListItem = DetailList.Item

const data_dict ={
  title: '',
  no: '',
  name: '',
  is_nimin: '',
  detail: '',
}
export default {
  name: 'BasicDetail',
  components: {PageLayout, DetailListItem, DetailList},
  data () {

    return {
      data_dict,
    }
  },
  beforeMount() {
    var searchParams = new URLSearchParams();
    searchParams.append('gaoguan_id', this.$route.params.id)
    request(GET_GAOGUAN_DETAIL, METHOD.GET, searchParams).then((res) => {
      console.log(res);
      if(res.data.code === 200){
        this.$message.info(res.data.msg)
        let res_data = res.data.data
        data_dict.no = res_data.gaoguan_id
        data_dict.title = res_data.gaoguan_title
        data_dict.name = res_data.gaoguan_user_name
        data_dict.detail = res_data.gaoguan_detail
        data_dict.is_nimin = res_data.gaoguan_is_nimin ? '是' : '否'
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
