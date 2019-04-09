<template>
  <div class="menu-wrapper">
    <section v-for="unit in rootItem">
      <template v-if="!unit.hidden">
        <router-link v-if="!routerFlag(unit)" :to="resolvePath(unit.path)">
          <el-menu-item :index="resolvePath(unit.path)" :class="{'submenu-title-noDropdown':!isNest}">
            <svg-icon v-if="unit.meta&&unit.meta.icon" :icon-class="unit.meta.icon"></svg-icon>
            <span v-if="unit.meta&&unit.meta.title" slot="title">{{generateTitle(unit.meta.title)}}</span>
          </el-menu-item>
        </router-link>

        <el-submenu v-else-if="hasOneShowChildren(unit)" :index="unit.name||unit.path">
          <template slot="title">
            <svg-icon v-if="unit.meta&&unit.meta.icon" :icon-class="unit.meta.icon"></svg-icon>
            <span v-if="unit.meta&&unit.meta.title" slot="title">{{generateTitle(unit.meta.title)}}</span>
          </template>
          <sidebar-item-two :item="unit.children" :base-path="unit.path"></sidebar-item-two>
        </el-submenu>
      </template>
    </section>
  </div>
</template>

<script>
  import path from 'path'
  import { generateTitle } from '@/utils/i18n'
  import Router from '@/components/RouterRedirect/index'

  export default {
    name: 'SidebarItemTwo',
    components: { Router },
    props: {
      // route object
      item: {
        required: true
      },
      isNest: {
        type: Boolean,
        default: false
      },
      basePath: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        onlyOneChild: null
      }
    },
    methods: {
      routerFlag(menuItem) {
        if (menuItem.children) {
          return true
        }
        return false
      },
      hasOneShowChildren(menuItem) {
        if (menuItem.children && menuItem.children.filter(item => !item.hidden).length > 0) {
          return true
        }
        return false
      },
      resolvePath(...paths) {
        return path.resolve(this.basePath, ...paths)
      },
      generateTitle
    },
    computed: {
      rootItem() {
        if (this.item.path && this.item.path === '/') {
          return this.item.children
        }
        return this.item
      }
    }
  }
</script>

