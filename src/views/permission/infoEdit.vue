<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <el-form :model="permissionForm" ref="permissionForm" label-width="80px">

          <el-form-item label="名称" prop="name">
            <el-input class="input-frame" v-model="permissionForm.name" style="width: 40%"></el-input>
          </el-form-item>

          <el-form-item label="权限">
            <el-input class="input-frame" v-model="permissionForm.permission" style="width: 40%"></el-input>
          </el-form-item>

          <el-form-item label="权限类型">
            <el-radio-group v-model="permissionForm.type">
              <el-radio :label="0">菜单用户</el-radio>
              <el-radio :label="1">链接</el-radio>
              <el-radio :label="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="排序">
            <el-input class="input-frame" v-model="permissionForm.sort" style="width: 40%"></el-input>
          </el-form-item>

          <el-form-item label="备注">
            <el-input v-model="permissionForm.remarks" type="textarea" :rows="3" style="width: 85%"></el-input>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" style="padding-left: 50px">
        <el-button v-permission="this.$permission_config.permissionEdit" type="primary" @click="save('permissionForm')">保存</el-button>
      </el-col>
    </el-row>

  </div>
</template>


<style scoped>

  .container {
    padding: 0px;
    margin: 0px;
  }

</style>

<script>
  import { getPermissionInfo, savePermission } from '@/api/system/permission'
  export default {
    name: 'PermissionInfoEdit',
    props: {
      permissionId: {
        required: true
      }
    },
    data() {
      return {
        permissionForm: {
          name: '',
          type: '',
          permission: '',
          sort: 10,
          remarks: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入权限名', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      getPermissionInfo(id) {
        getPermissionInfo(id).then(response => {
          this.permissionForm = response.result
        })
      },
      save(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            this.savePermission()
          } else {
            return false
          }
        })
      },
      savePermission() {
        const params = {}
        params.id = this.permissionId
        params.name = this.permissionForm.name
        params.type = this.permissionForm.type
        params.permission = this.permissionForm.permission
        params.sort = this.permissionForm.sort
        params.remarks = this.permissionForm.remarks
        savePermission(params).then(response => {
          this.$message.success('保存成功')
          this.$emit('reload-menu')
        })
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      }
    },
    watch: {
      permissionId: function() {
        this.getPermissionInfo(this.permissionId)
      }
    }
  }
</script>


