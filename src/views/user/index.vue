<template>
  <div class="container">
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="searchForm" label-width="80px" size="small">
        <el-form-item label="用户名">
          <el-input class="search" v-model="searchForm.usernameSearchInfo" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="searchForm.typeSearchInfo" placeholder="请选择" style="width: 150px">
            <el-option v-for="item in userTypeList" :key="item.val" :label="item.label" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="searchForm.statusSearchInfo" placeholder="请选择" style="width: 150px">
            <el-option v-for="item in userStatusList" :key="item.val" :label="item.label" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doFilter()"><i class="el-icon-search"></i>&nbsp;搜索</el-button>
          <el-button v-permission="this.$permission_config.userEdit" type="primary" @click="create"><i class="el-icon-plus"></i>&nbsp;新建</el-button>
          <el-button v-permission="this.$permission_config.userDel" type="danger" @click="del"><i class="el-icon-delete"></i>&nbsp;删除</el-button>
        </el-form-item>
      </el-form>
    </el-col>


    <!--列表-->
    <el-table :data="userList" stripe highlight-current-row :row-class-name="tableRowClassName" @current-change="setCurrentRow" v-loading="listLoading" element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="no" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.$index+(pageNo - 1) * pageSize + 1}} </span>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名">
        <template slot-scope="scope">
          <a @click="getInfo(scope.row.id)" style="color: #20a0ff">{{scope.row.username}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 0">普通用户</span>
          <span v-else-if="scope.row.type === 1" style="color: green">管理员</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="用户状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">正常</span>
          <span v-else-if="scope.row.status === 1" style="color: red">冻结</span>
        </template>
      </el-table-column>
    </el-table>


    <!--分页条-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>

  </div>
</template>


<style scoped>

  .toolbar {
    padding-bottom: 0px;
    text-align: left;
  }

</style>



<script>
  import global from '@/global/global'
  import { getUserPage, deleteUser } from '@/api/system/user'

  const userTypeList = [{ 'val': '', 'label': '全部' }, { 'val': 0, 'label': '普通用户' }, { 'val': 1, 'label': '管理员' }]
  const userStatusList = [{ 'val': '', 'label': '全部' }, { 'val': 0, 'label': '正常' }, { 'val': 1, 'label': '冻结' }]

  export default {
    name: 'UserList',
    data() {
      return {
        userList: [],
        listLoading: true,
        currentRow: {},
        total: 0,
        pageNo: global.pageNo,
        pageSize: global.pageSize,
        value: '',
        userTypeList: userTypeList,
        userStatusList: userStatusList,
        searchForm: {
          usernameSearchInfo: '',
          typeSearchInfo: '',
          statusSearchInfo: ''
        }
      }
    },
    mounted() {
      this.getUserList()
    },
    methods: {
      getUserList() {
        this.listLoading = true
        const params = {}
        params.username = this.searchForm.usernameSearchInfo
        params.type = this.searchForm.typeSearchInfo
        params.status = this.searchForm.statusSearchInfo
        params.pageNo = this.pageNo
        params.pageSize = this.pageSize
        getUserPage(params).then(response => {
          this.total = response.result.totalCount
          this.userList = response.result.dataList
          this.listLoading = false
        })
      },
      doFilter() {
        this.pageNo = global.pageNo
        this.getUserList()
      },
      create() {
        this.$router.push({ path: '/system/user_info' })
      },
      getInfo(id) {
        this.$router.push({ path: '/system/user_info', query: { id: id }})
      },
      del() {
        if (JSON.stringify(this.currentRow) === '{}') {
          this.$message.error('请选择要删除的行')
        } else {
          this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteUser(this.currentRow.id).then(response => {
              this.$message.success('删除成功')
              this.getUserList()
            })
          }).catch(() => {})
        }
      },
      tableRowClassName({ row, rowIndex }) {
        row.index = rowIndex
      },
      setCurrentRow(currentRow, oldCurrent) {
        this.currentRow = currentRow
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getUserList()
      },
      handleCurrentChange(val) {
        this.pageNo = val
        this.getUserList()
      },
      currentChangePage(list) {
        let from = (this.pageNo - 1) * this.pageSize
        const to = this.pageNo * this.pageSize
        this.tableList = []
        for (; from < to; from++) {
          if (list[from]) {
            this.tableList.push(list[from])
          }
        }
      }
    }
  }
</script>
