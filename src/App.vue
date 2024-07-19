<template>
  <div id="app">
    <router-view />
    <Footer />
  </div>
</template>
<script>
import Footer from "@/components/Footer";

export default {
  name: "APP",
  components: {
    Footer
  },
  data() {
    return {

    };
  },
};
</script>

<style>
body {
  background-color: #f4f5f5;
  padding: 0;
  margin: 0;
}

html,
body,
.app {
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  justify-content: flex-end;
}

a {
  color: inherit;
  text-decoration: none;
}

a:focus,
a:hover {
  color: inherit;
  text-decoration: none;
}

.container {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  flex: 1;
}

@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}

@media (min-width: 992px) {
  .container {
    width: 970px;
  }
}

@media (min-width: 1330px) {
  .container {
    width: 1300px;
  }
}</style>
