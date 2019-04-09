<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <el-scrollbar style="height: 93vh">
        <app-main></app-main>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import { Navbar, Sidebar, AppMain } from '@/views/layout/components'

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      }
    }
  }
</script>
