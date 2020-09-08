<script>
export default {
  created() {
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/classListHome' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
