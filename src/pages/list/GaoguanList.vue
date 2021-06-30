<template>
  <a-card>
    <div>
      <a-space class="operator">
        <a-button @click="remove" type="primary">删除</a-button>
        <a-button @click="export_excel" type="primary">导出选中</a-button>
        <a-button @click="export_excel_all()" type="primary">全部导出</a-button>
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
          <router-link :to="`/gaoguan/detail/${record.no}`">详情</router-link>
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
import {GET_ALL_GAOGUAN, DELETE_GAOGUAN} from '@/services/api'
import {METHOD, request} from "@/utils/request";

const columns = [
  {
    title: '问题编号',
    dataIndex: 'no'
  },
  {
    title: '问题标题',
    dataIndex: 'title',
  },
  {
    title: '问题详情',
    dataIndex: 'detail',
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
    title: '操作',
    scopedSlots: {customRender: 'action'}
  },
]

const dataSource = []
let current_page = 1

export default {
  name: 'GaoguanList',
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
      searchParams.append('gaoguan_ids', key)
      request(DELETE_GAOGUAN, METHOD.GET, searchParams).then((res) => {
        if(res.data.code === 200){
          this.$message.info(res.data.msg)
          this.data_updata();
        }else{
          this.$message.info(res.data.msg)
        }
      })
    },
    export_excel(){
      if(this.selectedRows.length > 0) {
        let export_string = ''
        for(let key = 0; key < this.selectedRows.length; key ++){
          export_string += this.selectedRows[key].no + '|'
        }
        var url = 'http://192.168.31.233:8080/question/export_gaoguan/?gaoguan_ids=' + export_string;
        window.open(url);
        this.selectedRows = []
      }
    },
    export_excel_all(){
      var url = 'http://192.168.31.233:8080/question/export_gaoguan/?gaoguan_ids=all';
      window.open(url);
    },
    remove() {
      if(this.selectedRows.length > 0){
        let delete_string = ''
        for(let key = 0; key < this.selectedRows.length; key ++){
          delete_string += this.selectedRows[key].no + '|'
        }
        var searchParams = new URLSearchParams();
        searchParams.append('gaoguan_ids', delete_string)
        request(DELETE_GAOGUAN, METHOD.GET, searchParams).then((res) => {
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
      // console.log(this.selectedRows.length)
      // this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
      this.selectedRows = []
    },
    data_updata(){
      this.loading = true
      var searchParams = new URLSearchParams();
      searchParams.append('page', current_page)
      request(GET_ALL_GAOGUAN, METHOD.GET, searchParams).then((res) => {
        if (res.data.code === 200) {
          let data_list = res.data.data.data
          this.reset()
          const pagination = { ...this.pagination };
          pagination.total = res.data.total_record;
          pagination.pageSize = 10;
          this.loading = false;
          this.pagination = pagination;
          for (let i = 0; i < data_list.length; i++) {
            dataSource.push({
              key: i,
              no: data_list[i]['gaoguan_id'],
              title: data_list[i]['gaoguan_title'],
              detail: data_list[i]['gaoguan_detail'].length > 12 ? data_list[i]['gaoguan_detail'].substr(0, 12) + '...' : data_list[i]['gaoguan_detail'],
              name: data_list[i]['gaoguan_user_name'],
              is_nimin: data_list[i]['gaoguan_is_nimin'] === '1' ? '是' : '否',
            })
          }
        }
      })
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    reset(){
      this.dataSource.splice(0, this.dataSource.length);
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
