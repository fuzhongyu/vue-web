
<template>
  <el-menu
    mode="vertical" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF"
  >
    <sidebar-item v-for="route in unhidden_menu_map" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'
  import { getMenu } from '@/utils/auth'

  export default {
    components: { SidebarItem },
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      },
      unhidden_menu_map() {
        return getMenu().filter(item => !item.hidden)
      }
    }
  }
</script>
