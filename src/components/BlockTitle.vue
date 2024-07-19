<template>
  <div class="main-title">
    <div class="main-title-box">
      <span class="left-line"></span>
      <h1>{{ title }}</h1>
      <span class="right-line"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title"],
  name: "BlockTitle",
};
</script>

<style scoped>
.main-title {
  position: relative;
  margin: 40px 0;
  height: 100%;
  display: flex;
  justify-content: center;
}

.left-line,
.right-line {
  background-color: #00cec9;
  width: 50px;
  height: 4px;
  display: block;
  margin: 10px;
  border-radius: 5px;
  position: relative;
}

.left-line::before,
.right-line::before {
  content: "";
  background-color: #07292f;
  position: absolute;
  width: 20px;
  height: 4px;
  top: -15px;
  border-radius: 5px;
}

.left-line::before {
  right: 0;
}

.main-title-box {
  display: flex;
  align-items: baseline;
}

.main-title-box h1 {
  font-size: 2.57142em;
  margin: 0;
  font-weight: 600;
  text-align: center;
}

.main-title h1 {
  position: relative;
}
.main-title h1::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 6px;
  height: 8px;
  z-index: -1;
  width: 100%;
  background: #00cec9;
  opacity: 0.6;
}
</style>