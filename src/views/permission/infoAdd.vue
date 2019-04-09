<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <el-form :model="permissionForm" ref="permissionForm" label-width="80px">

          <el-form-item label="名称" prop="name">
            <el-input class="input-frame" v-model="permissionForm.name" style="width: 60%"></el-input>
          </el-form-item>

          <el-form-item label="权限" prop="permission">
            <el-input class="input-frame" v-model="permissionForm.permission" style="width: 60%"></el-input>
          </el-form-item>

          <el-form-item label="权限类型" prop="type">
            <el-radio-group v-model="permissionForm.type">
              <el-radio :label="0">菜单</el-radio>
              <el-radio :label="1">链接</el-radio>
              <el-radio :label="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="排序" prop="sort">
            <el-input class="input-frame" v-model="permissionForm.sort" style="width: 20%"></el-input>
          </el-form-item>

          <el-form-item label="备注" prop="remarks">
            <el-input v-model="permissionForm.remarks" type="textarea" :rows="3" style="width: 85%"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" class="button-form-item">
        <a @click="cancel" style="padding-right: 20px;color: #8B90A0">取消</a>
        <el-button v-permission="this.$permission_config.permissionEdit" @click="save('permissionForm')" type="primary" size="small">保存</el-button>
        <el-button @click="reset" size="small">重置</el-button>
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
  import { savePermission } from '@/api/system/permission'
  export default {
    name: 'PermissionInfoAdd',
    props: {
      parentId: {
        required: false
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
      reset() {
        this.resetForm('permissionForm')
      },
      savePermission() {
        const params = {}
        params.parentId = this.parentId
        params.name = this.permissionForm.name
        params.type = this.permissionForm.type
        params.permission = this.permissionForm.permission
        params.sort = this.permissionForm.sort
        params.remarks = this.permissionForm.remarks
        savePermission(params).then(response => {
          this.resetForm('permissionForm')
          this.$emit('reload-menu')
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
      cancel() {
        this.$message.info('取消编辑')
        this.closeInfoDialog()
      },
      closeInfoDialog() {
        this.$emit('close-add-dialog')
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      }
    }
  }
</script>


