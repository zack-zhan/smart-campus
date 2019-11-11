<template>
  <div class="box">
    <div class="imgBox">
      <img src="@/assets/404.png" alt="">
    </div>
    <div class="line">哎呀迷路了...</div>
    <div class="text">
      <div>可能的原因：</div>
      <ul>
        <li>
          <span>•</span>
          <span>原来的页面不存在了</span>
        </li>
        <li>
          <span>•</span>
          <span>我们的服务器被外星人劫持了</span>
        </li>
      </ul>
    </div>
    <!-- <div class="btnBox">
      <a-button type="primary" class="btn">返回首页</a-button>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.box{
  width: 600px;
  margin: 0 auto;
}
.imgBox{
  width: 300px;
  height: 300px;
  margin: 0 auto;
  img{
    width: 100%;
    height: 100%;
  }
}
.line{
  font-size: 20px;
  font-weight: bold;
  padding: 20px 0;
  color: #000;
  text-align: center;
  border-bottom: 1px solid #f1f1f1;
}
.text{
  width: 300px;
  margin: 0 auto;
  padding-top: 20px;
  color: #ABADB1;
  font-size: 16px;
  ul{
    margin-left: 28px;
  }
}
// .btnBox{
//   width: 300px;
//   margin: 0 auto;
//   text-align: center;
//   padding-top: 20px;
//   .btn{
//     width: 100px;
//     height: 40px;
//   }
// }
</style>
