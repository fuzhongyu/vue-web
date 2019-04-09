<template>
  <div class="navbar-container">
    <el-menu class="navbar" mode="horizontal">
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      <breadcrumb></breadcrumb>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="logo">
          <span class="user-nickname">{{nickname}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <el-dropdown-item divided>
            <span @click="showPwdDialog" style="display:block;">Password</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="manualLogout" style="display:block;">LogOut</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>

    <el-dialog v-dialog-drag :visible.sync="dialogVisible.pwd" width="35%" :modal-append-to-body="false" :close-on-click-modal="false">

      <div slot="title">
        <span class="el-dialog-title-text">修改密码</span>
      </div>

      <el-form :model="pwdForm" ref="pwdForm" label-width="90px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="pwdForm.oldPassword"></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="pwdForm.newPassword"></el-input>
          <span v-show="dialogParams.lengthValidFlag" style="color: red;font-size: small">*密码长度不能小于5</span>
        </el-form-item>

        <el-form-item label="重复密码" prop="repeatNewPassword">
          <el-input type="password" v-model="pwdForm.repeatNewPassword"></el-input>
          <span v-show="dialogParams.repeatPwdValidFlag" style="color: red;font-size: small">*新密码设置不一致</span>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer button-form-item">
        <a @click="cancel" style="padding-right: 20px;color: #8B90A0;font-size: small">取消</a>
        <el-button type="primary" @click="save('pwdForm')" size="small">保 存</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import md5 from 'js-md5'
  import logo from '@/assets/images/logo.png'
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import { logout } from '@/api/system/login'
  import { getUser, getUserInfo, removeCache } from '@/utils/auth'
  import { updatePassword } from '@/api/system/user'

  export default {
    components: {
      Breadcrumb,
      Hamburger
    },
    data() {
      return {
        logo,
        dialogVisible: {
          pwd: false
        },
        dialogParams: {
          lengthValidFlag: false,
          repeatPwdValidFlag: false
        },
        pwdForm: {
          oldPassword: '',
          newPassword: '',
          repeatNewPassword: ''
        }
      }
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      nickname() {
        const nickname = getUserInfo().nickname
        if (nickname) {
          return nickname
        }
        return ''
      }
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      manualLogout() {
        logout().then(() => {
          removeCache()
          // 为了重新实例化vue-router对象 避免bug
          location.reload()
        })
      },
      showPwdDialog() {
        this.resetForm('pwdForm')
        this.dialogVisible.pwd = true
      },
      save() {
        if (!this.pwdForm.newPassword || this.pwdForm.newPassword.length < 5) {
          this.dialogParams.lengthValidFlag = true
        } else if (this.pwdForm.newPassword !== this.pwdForm.repeatNewPassword) {
          this.dialogParams.lengthValidFlag = false
          this.dialogParams.repeatPwdValidFlag = true
        } else {
          const params = {}
          params.oldPassword = md5(this.pwdForm.oldPassword)
          params.newPassword = md5(this.pwdForm.newPassword)
          updatePassword(getUser(), params).then(response => {
            this.$message.success('保存成功')
            this.dialogParams.lengthValidFlag = false
            this.dialogParams.repeatPwdValidFlag = false
            this.dialogVisible.pwd = false
          })
        }
      },
      cancel() {
        this.dialogParams.lengthValidFlag = false
        this.dialogParams.repeatPwdValidFlag = false
        this.dialogVisible.pwd = false
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 30px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .user-nickname {
        height: 40px;
        line-height: 40px;
        float: right;
        padding-left: 5px;
        font-size: small;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
