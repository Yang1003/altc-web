<template>
    <footer class="app-footer">
      <div class="footer-content">
        <p>Copyright©{{ currentYear }}{{ $t("dashboardIndex.copyright") }}</p>
        <ul class="footer-links">
          <li><a href="#">关于我们</a></li>
          <li><a href="#">联系我们</a></li>
          <li><a href="#">隐私政策</a></li>
          <li><a href="#">使用条款</a></li>
        </ul>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'AppFooter',
    data() {
      return {
        currentYear: new Date().getFullYear()
      }
    }
  }
  </script>
  
  <style scoped>
  .app-footer {
    padding: 20px 0;
    position: fixed;
    bottom: 0;
    width: 100%;
    color: rgb(2, 54, 97);
    text-align: center;
    font-size: 12px;
  }
  
  .footer-content p {
    margin: 0 0 10px 0;
  }
  
  .footer-links {
    list-style-type: none;
    padding: 0;
    margin: 0;
    color: rgb(2, 54, 97);
    text-align: center;
  }
  
  .footer-links li {
    display: inline;
    margin: 0 10px;
  }
  
  .footer-links a {
    color: rgb(2, 54, 97);
    text-decoration: none;
  }
  
  .footer-links a:hover {
    text-decoration: underline;
  }
  </style>
  