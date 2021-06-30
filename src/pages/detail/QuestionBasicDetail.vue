<template>
    <page-layout title="问题详情页">
      <a-card :bordered="false">
        <detail-list title="问题详情" layout="vertical" :col="2">
          <detail-list-item term="记录编号1">{{ data_dict.no}}</detail-list-item>
          <detail-list-item term="问题标题">{{ data_dict.title }}</detail-list-item>
          <detail-list-item term="提问人真实姓名">{{ data_dict.name}}</detail-list-item>
          <detail-list-item term="是否匿名发布">{{ data_dict.is_nimin}}</detail-list-item>
        </detail-list>
        <detail-list layout="vertical" :col="1">
          <detail-list-item term="问题详情">{{data_dict.detail}}</detail-list-item>
        </detail-list>
        <a-button type="danger" @click="deleteQUE()">删除该问题</a-button>
        <a-divider style="margin-bottom: 32px"/>
        <div class="title">答案列表</div>
        <a-table
            row-key="answer_id"
          :columns="ansColumns"
          :dataSource="ansData"
          :pagination="false"
        >
          <div slot="action" slot-scope="text, record">
            <a @click="delete_ans(record.answer_id)">
              <a-icon type="delete"/>
              删除
            </a>
            <router-link :to="`/answer/${record.answer_id}/${data_dict.no}`">详情</router-link>
          </div>
        </a-table>
      </a-card>
    </page-layout>
</template>

<script>
import DetailList from '../../components/tool/DetailList'
import PageLayout from '../../layouts/PageLayout'
import {GET_QUESTION_DETAIL, DELETE_ANSWER, DELETE_QUESTION} from '@/services/api'
import {METHOD, request} from "@/utils/request"

const DetailListItem = DetailList.Item

const data_dict ={
  title: '',
  no: '',
  name: '',
  is_nimin: '',
  detail: '',
}

const ansColumns = [
  {
    title: '答案编号',
    dataIndex: 'answer_id',
  },
  {
    title: '回答者姓名',
    dataIndex: 'answer_user_name',
  },
  {
    title: '是否匿名',
    dataIndex: 'answer_id_nimin',
  },
  {
    title: '是否最佳回答',
    dataIndex: 'answer_is_best',
  },
  {
    title: '答案内容',
    dataIndex: 'answer_detail',
  },
  {
    title: '操作',
    scopedSlots: {customRender: 'action'}
  }
]

const ansData = [
]

export default {
  name: 'BasicDetail',
  components: {PageLayout, DetailListItem, DetailList},
  data () {
    return {
      ansColumns,
      ansData,
      data_dict,
    }
  },methods:{
    delete_ans(key){
      var searchParams = new URLSearchParams();
      searchParams.append('answer_ids', key)
      request(DELETE_ANSWER, METHOD.GET, searchParams).then((res) => {
        if(res.data.code === 200){
          this.$message.info(res.data.msg)
          this.data_updata()
        }else{
          this.$message.info(res.data.msg)
        }
      })
    },
    deleteQUE() {
      var searchParams = new URLSearchParams();
      searchParams.append('question_ids', this.$route.params.id)
      request(DELETE_QUESTION, METHOD.GET, searchParams).then((res) => {
        if(res.data.code === 200){
          this.$message.info(res.data.msg)
          this.$closePage('/question/detail/', '/question')
          this.$refreshPage('/question')
        }else{
          this.$message.info(res.data.msg)
        }
      })
    },
    deleteRecord(key) {
      var searchParams = new URLSearchParams();
      searchParams.append('answer_ids', key)
      request(DELETE_ANSWER, METHOD.GET, searchParams).then((res) => {
        if(res.data.code === 200){
          this.$message.info('删除成功')
          this.data_updata();
        }else{
          this.$message.info(res.data.msg)
        }
      })
    },data_updata(){
      var searchParams = new URLSearchParams();
      searchParams.append('question_id', this.$route.params.id)
      request(GET_QUESTION_DETAIL, METHOD.GET, searchParams).then((res) => {
        console.log(res);
        if(res.data.code === 200){
          this.$message.info(res.data.msg)
          let res_data = res.data.data
          data_dict.no = res_data.question_id
          data_dict.title = res_data.question_title
          data_dict.name = res_data.question_user_name
          data_dict.detail = res_data.question_detail
          data_dict.is_nimin = res_data.question_is_nimin ? '是' : '否'

          this.ansData.splice(0, this.ansData.length);
          let ans_data = res.data.ans_data
          for(var i =0; i < ans_data.length; i++){
            ans_data[i].answer_id_nimin = ans_data[i].answer_id_nimin === 1 ? '是' : '否'
            ans_data[i].answer_detail = ans_data[i].answer_detail.length > 12 ? ans_data[i].answer_detail.substr(0, 12) + '...' : ans_data[i].answer_detail
            ansData.push(res.data.ans_data[i])
          }
        }else{
          this.$message.info(res.data.msg)
        }
      })
    }
  },
  beforeMount() {
    this.data_updata()
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
