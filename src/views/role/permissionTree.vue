<template>
    <div class="container">
      <section class="search-wrapper">
        <el-input placeholder="输入关键字搜索" v-model="filterText"></el-input>
      </section>

      <el-scrollbar style="height: 40vh">
        <el-tree ref="menuTree"
                 class="filter-tree"
                 :data="menuTree"
                 node-key="id"
                 :props="myProps"
                 show-checkbox
                 default-expand-all
                 highlight-current
                 :filter-node-method="filterNode"
        >
        </el-tree>
      </el-scrollbar>

      <el-row>
        <el-col :span="24" class="button-form-item">
          <a @click="cancel" style="padding-right: 20px;color: #8B90A0;font-size: small">取消</a>
          <el-button v-permission="this.$permission_config.roleEdit" type="primary" size="small" @click="save">保存</el-button>
        </el-col>
      </el-row>

    </div>
</template>

<script>
  import { getMenuTree } from '@/api/system/permission'
  import { getRolePermissionList, updateRolePermission } from '@/api/system/role'

  export default {
    name: 'permissionTree',
    props: {
      roleId: {
        required: true
      }
    },
    data() {
      return {
        menuTree: [],
        myProps: {
          label: 'name',
          children: 'childNodes'
        },
        filterText: ''
      }
    },
    methods: {
      getMenuTree() {
        getMenuTree().then(response => {
          this.menuTree = response.result
        })
      },
      setRolePermissionList() {
        getRolePermissionList(this.roleId).then(response => {
          this.$refs.menuTree.setCheckedKeys(response.result)
        })
      },
      filterNode(value, data) {
        if (!value) {
          return true
        }
        return data.name.indexOf(value) !== -1
      },
      updateRolePermission() {
        const params = {}
        params.permissionList = this.$refs.menuTree.getCheckedKeys()
        updateRolePermission(this.roleId, params).then(response => {
          this.closePermissionDialog()
        })
      },
      save() {
        if (this.$refs.menuTree.getCheckedKeys().length === 0) {
          this.$message.error('请选择权限')
        } else {
          this.$message.success('保存成功')
          this.updateRolePermission()
        }
      },
      closePermissionDialog() {
        this.$emit('close-permission-tree-dialog')
      },
      cancel() {
        this.closePermissionDialog()
      }
    },
    mounted() {
      this.getMenuTree()
      this.setRolePermissionList()
    },
    watch: {
      filterText: function(val) {
        this.$refs.menuTree.filter(val)
      },
      roleId: function() {
        this.setRolePermissionList()
      }
    }
  }
</script>

<style scoped>
  .search-wrapper >>> .el-input__inner {
    height: 30px;
  }

  .search-wrapper {
    margin: -10px 10px 10px;
  }

  .container {
    margin: 0px;
    padding: 0px 20px;
  }
</style>
