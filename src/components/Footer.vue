<template>
  <footer id="footer" class="site-footer" role="contentinfo">
    <div class="wrap">
      <div class="container site-info">
        <a href="#" class="imprint"> Just a footer </a>
        <div class="Social-Media-icon-wrap">
          <div class="Social-Media blue"></div>
          <div class="Social-Media purple"></div>
          <div class="Social-Media red"></div>
        </div>
      </div>
      <!-- .site-info -->
    </div>
    <!-- .wrap -->
  </footer>
</template>

<script>
export default {};
</script>

<style scoped>
.site-footer {
  background-color: #0b2328;
  padding: 30px;
}
.site-footer a {
  color: #fff;
}
/* 图标 */
.site-info {
  display: flex;
  align-items: center;
}
.Social-Media-icon-wrap {
  display: flex;
  margin-left: auto;
}
.Social-Media {
  border-radius: 50%;
  margin: 0 4px;
  background-color: #455a5a;
  transition: 0.3s;
  padding: 2px;
  width: 25px;
  height: 25px;
}

.blue:hover {
  background-color: #33a7e0;
}
.purple:hover {
  background-color: #305097;
}
.red:hover {
  background-color: #d8481e;
}

@media screen and (max-width: 991px) {
  .site-footer {
    padding: 20px;
  }
}
</style>