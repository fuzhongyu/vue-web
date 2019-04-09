<template>
  <div class="container">
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" label-width="80px" size="small">
          <el-form-item>
            <el-button v-permission="this.$permission_config.permissionEdit" @click="create"><i class="el-icon-plus"></i>&nbsp;新建</el-button>
            <el-button v-permission="this.$permission_config.permissionDel" @click="del"><i class="el-icon-delete"></i>&nbsp;删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="7">
        <section class="search-wrapper">
          <el-input placeholder="输入关键字搜索" v-model="filterText" style="width: 250px"></el-input>
        </section>

        <el-scrollbar style="height: 75vh">
          <el-tree ref="menuTree"
                   class="filter-tree"
                   :data="menuTree"
                   node-key="id"
                   :props="myProps"
                   show-checkbox
                   default-expand-all
                   highlight-current
                   :filter-node-method="filterNode"
                   @node-click="getInfo"
          >
          </el-tree>
        </el-scrollbar>
      </el-col>

      <el-col :span="16">
        <permission-info-edit :permissionId="permissionId"></permission-info-edit>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible.add" width="40%" :modal-append-to-body="false" :close-on-click-modal="false">
      <div slot="title">
        <span class="el-dialog-title-text">添加权限</span>
      </div>
        <permission-info-add :parentId="permissionParentId" @close-add-dialog="closeAddDialog" @reload-menu="reloadMenu"></permission-info-add>
    </el-dialog>

  </div>
</template>


<style scoped>

  .toolbar {
    padding-bottom: 10px;
    text-align: left;
  }

  .search-wrapper {
    margin-bottom: 10px;
  }

  .search-wrapper >>> .el-input__inner {
    height: 30px;
  }

</style>

<script>
  import { getMenuTree, deletePermission } from '@/api/system/permission'
  import PermissionInfoEdit from '@/views/permission/infoEdit'
  import PermissionInfoAdd from '@/views/permission/infoAdd'

  export default {
    name: 'UserList',
    data() {
      return {
        menuTree: [],
        permissionId: '',
        permissionParentId: '',
        dialogVisible: {
          add: false
        },
        myProps: {
          label: 'name',
          children: 'childNodes'
        },
        filterText: ''
      }
    },
    components: {
      PermissionInfoEdit,
      PermissionInfoAdd
    },
    mounted() {
      this.getMenuTree()
    },
    methods: {
      getMenuTree() {
        getMenuTree().then(response => {
          this.menuTree = response.result
        })
      },
      filterNode(value, data) {
        if (!value) {
          return true
        }
        return data.name.indexOf(value) !== -1
      },
      getInfo(obj, node, nodeGroup) {
        this.permissionId = obj.id
      },
      create() {
        this.permissionParentId = this.$refs.menuTree.getCurrentKey()
        this.dialogVisible.add = true
      },
      reloadMenu() {
        this.closeAddDialog()
        this.getMenuTree()
      },
      closeAddDialog() {
        this.dialogVisible.add = false
      },
      del() {
        const permissionIds = this.$refs.menuTree.getCheckedKeys()
        if (permissionIds.length === 0) {
          this.$message.error('请选择要删除的权限')
        } else {
          this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const parmas = {}
            parmas.idList = permissionIds
            deletePermission(parmas).then(response => {
              this.dialogVisible.del = false
              this.getMenuTree()
            })
          }).catch(() => {})
        }
      }
    },
    watch: {
      filterText: function(val) {
        this.$refs.menuTree.filter(val)
      }
    }
  }
</script>
