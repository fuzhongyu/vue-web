<template>
  <div class="container">
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="searchForm" label-width="80px" size="small">
        <el-form-item label="角色名">
          <el-input class="search" v-model="searchForm.nameSearchInfo" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doFilter()"><i class="el-icon-search"></i>&nbsp;搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :span="24">
      <el-form :inline="true" label-width="80px" size="small">
        <el-form-item>
          <el-button v-permission="this.$permission_config.roleEdit" @click="create"><i class="el-icon-plus"></i>&nbsp;新建</el-button>
          <el-button v-permission="this.$permission_config.roleEdit" @click="updateRole"><i class="el-icon-edit"></i>&nbsp;编辑</el-button>
          <el-button v-permission="this.$permission_config.roleEdit" @click="updateMenuPermission"><i class="el-icon-edit-outline"></i>&nbsp;菜单权限</el-button>
          <el-button v-permission="this.$permission_config.roleEdit" @click="updateDataPermission"><i class="el-icon-edit-outline"></i>&nbsp;数据权限</el-button>
          <el-button v-permission="this.$permission_config.roleDel" @click="del"><i class="el-icon-delete"></i>&nbsp;删除</el-button>
        </el-form-item>
      </el-form>
    </el-col>


    <!--列表-->
    <el-table :data="roleList" stripe highlight-current-row :row-class-name="tableRowClassName" @current-change="setCurrentRow" v-loading="listLoading" element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="no" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.$index+(pageNo - 1) * pageSize + 1}} </span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="角色名"></el-table-column>
      <el-table-column prop="description" label="角色描述"></el-table-column>
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

    <el-dialog :visible.sync="dialogVisible.info" width="40%" left :modal-append-to-body="false" :close-on-click-modal="false">
      <div slot="title">
        <span class="el-dialog-title-text">角色编辑</span>
      </div>
      <role-info :roleId="roleId" @close-info-dialog="closeInfoDialog" @reload-role-page="getRoleList"></role-info>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible.menu" width="40%" left :modal-append-to-body="false" :close-on-click-modal="false">
      <div slot="title">
        <span class="el-dialog-title-text">菜单权限编辑</span>
      </div>
      <permission-tree :roleId="currentRowId" @close-permission-tree-dialog="closePermissionTreeDialog"></permission-tree>
    </el-dialog>

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
  import { getRolePage, deleteRole } from '@/api/system/role'
  import RoleInfo from '@/views/role/info'
  import PermissionTree from '@/views/role/permissionTree'

  export default {
    name: 'RoleList',
    data() {
      return {
        roleList: [],
        roleId: '',
        listLoading: true,
        dialogVisible: {
          info: false,
          menu: false
        },
        currentRow: {},
        total: 0,
        pageNo: global.pageNo,
        pageSize: global.pageSize,
        value: '',
        searchForm: {
          nameSearchInfo: ''
        }
      }
    },
    components: {
      RoleInfo,
      PermissionTree
    },
    mounted() {
      this.getRoleList()
    },
    methods: {
      getRoleList() {
        this.listLoading = true
        const params = {}
        params.name = this.searchForm.nameSearchInfo
        params.pageNo = this.pageNo
        params.pageSize = this.pageSize
        getRolePage(params).then(response => {
          this.total = response.result.totalCount
          this.roleList = response.result.dataList
          this.listLoading = false
        })
      },
      doFilter() {
        this.pageNo = global.pageNo
        this.getRoleList()
      },
      create() {
        this.roleId = ''
        this.dialogVisible.info = true
      },
      closeInfoDialog() {
        this.dialogVisible.info = false
      },
      updateRole() {
        if (JSON.stringify(this.currentRow) === '{}') {
          this.$message.error('请选择要编辑的行')
        } else {
          this.roleId = this.currentRow.id
          this.dialogVisible.info = true
        }
      },
      updateMenuPermission() {
        if (!this.currentRow.id) {
          this.$message.error('请选择要编辑的行')
        } else {
          this.dialogVisible.menu = true
        }
      },
      closePermissionTreeDialog() {
        this.dialogVisible.menu = false
      },
      updateDataPermission() {},
      del() {
        if (!this.currentRow.id) {
          this.$message.error('请选择要删除的行')
        } else {
          this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteRole(this.currentRow.id).then(response => {
              this.$message.success('删除成功')
              this.getRoleList()
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
    },
    computed: {
      currentRowId() {
        if (this.currentRow) {
          return this.currentRow.id
        } else {
          return ''
        }
      }
    }
  }
</script>
