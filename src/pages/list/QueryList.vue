<template>
  <a-card>
    <div>
      <a-space class="operator">
        <a-button @click="remove()" type="primary">删除</a-button>
      </a-space>
      <standard-table
          :columns="columns"
          :dataSource="dataSource"
          :selectedRows.sync="selectedRows"
          :pagination="pagination"
          @clear="onClear"
          @change="onChange"
          @selectedRowChange="onSelectChange"
      >
        <div slot="description" slot-scope="{text}">
          {{ text }}
        </div>
        <div slot="action" slot-scope="{text, record}">
          <a @click="deleteRecord(record.no)">
            <a-icon type="delete"/>
            删除
          </a>
          <router-link :to="`/question/detail/${record.no}`">详情</router-link>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle"/>
        </template>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
// import {METHOD, request} from "@/utils/request";
import {GET_ALL_QUESTION, DELETE_QUESTION} from '@/services/api'
import {METHOD, request} from "@/utils/request";
import Cookie from "js-cookie";

const columns = [
  {
    title: '问题编号',
    dataIndex: 'no'
  },
  {
    title: '问题标题',
    dataIndex: 'title',
    scopedSlots: {customRender: 'description'}
  },
  {
    title: '问题详情',
    dataIndex: 'detail',
    scopedSlots: {customRender: 'description'}
  },
  {
    title: '用户名',
    dataIndex: 'name',
  },
  {
    title: '是否匿名',
    dataIndex: 'is_nimin',
  },
  {
    title: '发布时间',
    dataIndex: 'time',
  },
  {
    title: '回答个数',
    dataIndex: 'ans_account',
  },
  {
    title: '操作',
    scopedSlots: {customRender: 'action'}
  }
]

const dataSource = []
let current_page = 1

export default {
  name: 'QueryList',
  components: {StandardTable},
  data() {
    return {
      advanced: true,
      columns: columns,
      dataSource: dataSource,
      selectedRows: [],
      loading: false,
      pagination: {},
    }
  },
  // authorize: {
  //   deleteRecord: 'delete'
  // },
  beforeMount() {
    this.data_updata()
  },
  methods: {
    deleteRecord(key) {
      var searchParams = new URLSearchParams();
      searchParams.append('question_ids', key)
      request(DELETE_QUESTION, METHOD.GET, searchParams).then((res) => {
        if(res.data.code === 200){
          this.$message.info(res.data.msg)
          this.data_updata();
        }else{
          this.$message.info(res.data.msg)
        }
      })
    },
    data_updata(){
      this.loading = true
      var searchParams = new URLSearchParams();
      searchParams.append('page', current_page)
      request(GET_ALL_QUESTION, METHOD.GET, searchParams).then((res) => {
        console.log(res.data)
        if (res.data.code === 200) {
          let data_list = res.data.data.data
          this.reset()
          const pagination = { ...this.pagination };
          pagination.total = res.data.total_record;
          pagination.pageSize = 10;
          this.loading = false;
          this.pagination = pagination;
          for (let i = 0; i < data_list.length; i++) {
            console.log(data_list[i])
            dataSource.push({
              key: i,
              no: data_list[i]['question_id'],
              title: data_list[i]['question_title'],
              detail: data_list[i]['question_detail'].length > 12 ? data_list[i]['question_detail'].substr(0, 12) + '...' : data_list[i]['question_detail'],
              name: data_list[i]['question_user_name'],
              time: data_list[i]['question_time'],
              ans_account: data_list[i]['answer_count'],
              is_nimin: data_list[i]['question_is_nimin'] === '1' ? '是' : '否',
            })
          }
        }
      })
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    reset(){
      console.log('reset')
      console.log(Cookie.get('Authorization'))
      this.dataSource.splice(0, this.dataSource.length);
      this.selectedRows = []
    },
    remove() {
      if(this.selectedRows.length > 0){
        let delete_string = ''
        for(let key = 0; key < this.selectedRows.length; key ++){
          console.log(key)
          delete_string += this.selectedRows[key].no + '|'
        }
        var searchParams = new URLSearchParams();
        searchParams.append('question_ids', delete_string)
        request(DELETE_QUESTION, METHOD.GET, searchParams).then((res) => {
          console.log(res);
          if(res.data.code === 200){
            this.$message.info(res.data.msg)
            this.data_updata();
          }else{
            this.$message.info(res.data.msg)
          }
        })
      }else {
        this.$message.info('未选中要删除的行')
      }
      this.selectedRows = []
    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },
    onChange(pag) {
      current_page = pag.current
      this.data_updata()
      // this.$message.info('表格状态改变了')
    },
    onSelectChange() {
      this.$message.info('选中行改变了')
    },
    addNew() {
      this.dataSource.unshift({
        key: this.dataSource.length,
        no: 'NO ' + this.dataSource.length,
        description: '这是一段描述',
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 4,
        updatedAt: '2018-07-26'
      })
    },
    handleMenuClick(e) {
      if (e.key === 'delete') {
        this.remove()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
