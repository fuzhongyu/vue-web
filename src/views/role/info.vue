<template>
  <div class="container">
      <el-row>
        <el-col :span="24">
          <el-form :model="roleForm" ref="roleForm" :rules="rules" label-width="100px">

            <el-form-item label="角色名" prop="name">
              <el-input class="input-frame" v-model="roleForm.name"></el-input>
            </el-form-item>

            <el-form-item label="角色描述" prop="description">
              <el-input class="input-frame" v-model="roleForm.description"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" class="button-form-item">
            <a @click="cancel" style="padding-right: 20px;color: #8B90A0;font-size: small">取消</a>
            <el-button v-permission="this.$permission_config.roleEdit" type="primary" size="small" @click="save('roleForm')">保存</el-button>
        </el-col>
      </el-row>
  </div>
</template>


<style scoped>

  .container {
    padding: 0px;
    margin: 0px;
  }

  .input-frame {
    width: 70%;
  }


</style>

<script>
  import { getRoleInfo, saveRole } from '@/api/system/role'

  export default {
    name: 'RoleInfo',
    props: {
      roleId: {
        required: false
      }
    },
    data() {
      return {
        roleForm: {
          name: '',
          description: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入角色名', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      getRoleInfo(id) {
        getRoleInfo(id).then(response => {
          this.roleForm = response.result
        })
      },
      saveRole() {
        const params = {}
        if (this.roleId) {
          params.id = this.roleId
        }
        params.name = this.roleForm.name
        params.description = this.roleForm.description
        saveRole(params).then(response => {
          this.resetForm('roleForm')
          this.$message.success('保存成功')
          this.closeInfoDialog()
          this.reloadRolePage()
        })
      },
      save(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            this.saveRole()
          } else {
            return false
          }
        })
      },
      cancel() {
        this.resetForm('roleForm')
        this.$message.info('取消编辑')
        this.closeInfoDialog()
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      },
      closeInfoDialog() {
        this.$emit('close-info-dialog')
      },
      reloadRolePage() {
        this.$emit('reload-role-page')
      }
    },
    mounted() {
      if (this.roleId) {
        this.getRoleInfo(this.roleId)
      }
    },
    watch: {
      roleId: function() {
        if (this.roleId) {
          this.getRoleInfo(this.roleId)
        } else {
          this.resetForm('roleForm')
        }
      }
    }
  }
</script>


