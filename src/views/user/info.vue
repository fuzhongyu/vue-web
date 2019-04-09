<template>
  <div class="container">

    <div class="go-back">
      <a @click="goBack()" style="color: #20a0ff">&lt;&lt;返回</a>
    </div>

    <div class="info-wrapper">
      <el-row>
        <el-col :span="24" style="margin-bottom: 15px">
          <header class="form-header">基本信息</header>
        </el-col>
      </el-row>

      <div class="form">
        <el-row>
          <el-col :span="24">
            <el-form :model="userForm" ref="userForm" :rules="rules" label-width="100px">

              <el-form-item label="用户名" prop="username">
                <el-input class="input-frame" v-model="userForm.username" :disabled="disabled"></el-input>
              </el-form-item>

              <el-form-item label="昵称">
                <el-input class="input-frame" v-model="userForm.nickname"></el-input>
              </el-form-item>

              <el-form-item label="密码" prop="password">
                <el-input type="password" class="input-frame" v-model="userForm.password"></el-input>
                <span v-show="pwdValidFlag" style="color: red;font-size: small">*密码长度不能小于5</span>
              </el-form-item>

              <el-form-item label="用户类型">
                <el-radio-group v-model="userForm.type">
                  <el-radio :label="0">普通用户</el-radio>
                  <el-radio :label="1">管理员</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="用户状态">
                <el-radio-group v-model="userForm.status">
                  <el-radio :label="0">正常</el-radio>
                  <el-radio :label="1">冻结</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="用户角色">
                <el-select v-model="userForm.roleList" multiple filterable default-first-option placeholder="请选择角色" style="width: 50%">
                  <el-option v-for="item in roleListSelect" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="备注">
                <el-input v-model="userForm.remarks" type="textarea" :rows="3" style="width: 85%"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button v-permission="this.$permission_config.userEdit" type="primary" @click="save('userForm')">保存</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-form-item>

            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>


<style scoped>


  .go-back {
    margin-bottom: 20px;
  }

  .info-wrapper{
    margin-top: 40px;
    width: 75%;
    position: relative;
    left: 10%;
    right: 15%;
  }

  .form {
    padding: 20px 10px;
    line-height: 40px;
    border: 1px solid #eaeefb;
  }


  .form-header {
    font-size: large;
    color: #8B90A0;
    text-align: center;
  }

  .input-frame {
    width: 300px;
  }


</style>

<script>
  import md5 from 'js-md5'
  import { getUserInfo, addUser, updateUser } from '@/api/system/user'
  import { getRoleList } from '@/api/system/role'
  import { validateName } from '@/utils/validate'

  export default {
    name: 'UserInfo',
    data() {
      const validName = (rule, value, callback) => {
        if (!validateName(value)) {
          callback(new Error(''))
        } else {
          callback()
        }
      }
      return {
        disabled: false,
        pwdValidFlag: false,
        userForm: {
          id: '',
          username: '',
          nickname: '',
          password: '',
          type: '',
          status: 0,
          roleList: [],
          remarks: ''
        },
        roleListSelect: [],
        rules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { validator: validName, message: '用户名不规范', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      getUserInfo(id) {
        getUserInfo(id).then(response => {
          this.userForm = response.result
        })
      },
      getRoleList() {
        getRoleList().then(response => {
          this.roleListSelect = response.result
        })
      },
      saveUser() {
        const params = {}
        params.nickname = this.userForm.nickname
        if (this.userForm.password) {
          params.password = md5(this.userForm.password)
        }
        params.type = this.userForm.type
        params.status = this.userForm.status
        params.roleList = this.userForm.roleList
        params.remarks = this.userForm.remarks
        if (this.userForm.id) {
          updateUser(this.userForm.id, params).then(response => {
            this.$message.success('保存成功')
            this.$router.push({ path: '/system/user' })
          })
        } else {
          params.username = this.userForm.username
          addUser(params).then(response => {
            this.$message.success('保存成功')
            this.$router.push({ path: '/system/user' })
          })
        }
      },
      save(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            // 密码长度不能小于5,新增用户的时候密码必须要填
            if ((this.userForm.password && this.userForm.password.length < 5) || ((!this.userForm.id) && (!this.userForm.password))) {
              this.pwdValidFlag = true
              return false
            }
            this.pwdValidFlag = false
            this.saveUser()
          } else {
            return false
          }
        })
      },
      cancel() {
        this.pwdValidFlag = false
        this.goBack()
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      },
      goBack() {
        this.$router.go(-1)
      }
    },
    mounted() {
      this.getRoleList()
      this.userForm.id = this.$route.query.id
      if (this.userForm.id) {
        this.disabled = true
        this.getUserInfo(this.userForm.id)
      }
    }
  }
</script>


