<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-redirect></router-redirect>
    </transition>
  </section>
</template>

<script>
  import RouterRedirect from '@/components/RouterRedirect'

  export default {
    name: 'AppMain',
    components: {
      RouterRedirect
    },
    data() {
      return {
        isRouterAlive: true
      }
    },
    provide() {
      return {
        reload: this.reload
      }
    },
    methods: {
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function() {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>
<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  min-height: calc(100vh - 84px);
  position: relative;
  overflow: hidden;
}
</style>
