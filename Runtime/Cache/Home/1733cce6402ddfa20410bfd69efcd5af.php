<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<!--[if lt IE 7 ]><html class="ie ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]><html class="ie ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]><html class="ie ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html lang="en"> <!--<![endif]-->
<head>
    ﻿<!DOCTYPE html>

    <!-- Basic Page Needs
  ================================================== -->
	<meta charset="utf-8">
	<title>博客</title>
	<meta name="description" content="Free Responsive Html5 Css3 Templates Designed by Kimmy | zerotheme.com">
	<meta name="author" content="www.zerotheme.com">
	
    <!-- Mobile Specific Metas
  ================================================== -->
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    
    <!-- CSS
  ================================================== -->
  	<link rel="stylesheet" href="/blog/Public/Home/css/zerogrid.css">
	<link rel="stylesheet" href="/blog/Public/Home/css/style.css">
    <link rel="stylesheet" href="/blog/Public/Home/css/responsive.css">
    <link rel="stylesheet" href="/blog/Public/Home/css/index.css">
	
	<!--[if lt IE 8]>
       <div style=' clear: both; text-align:center; position: relative;'>
         <a href="http://windows.microsoft.com/en-US/internet-explorer/products/ie/home?ocid=ie6_countdown_bannercode">
           <img src="http://storage.ie6countdown.com/assets/100/images/banners/warning_bar_0000_us.jpg" border="0" height="42" width="820" alt="You are using an outdated browser. For a faster, safer browsing experience, upgrade for free today." />
        </a>
      </div>
    <![endif]-->
    <!--[if lt IE 9]>
		<script type="text/javascript" src="/blog/Public/Home/js/html5.js"></script>
		<script type="text/javascript" src="/blog/Public/Home/js/css3-mediaqueries.js"></script>

	<![endif]-->
	
	<link href='./images/favicon.ico' rel='icon' type='image/x-icon'/>

</head>
<body>
<div class="wrap-body zerogrid">
    <!--------------Header--------------->
    ﻿<script type="text/javascript" src="/blog/Public/Home/js/jquery.js"></script>
<script type="text/javascript" src="/blog/Public/Home/ckeditor/ckeditor.js"></script>
<script type="text/javascript" src="/blog/Public/Home/js/jquery.ui.js"></script>
<script type="text/javascript" src="/blog/Public/Home/js/jquery.validate.js"></script>
<script type="text/javascript" src="/blog/Public/Home/js/jquery.form.js"></script>
<script type="text/javascript" src="/blog/Public/Home/js/experience.js"></script>
<link rel="stylesheet" href="/blog/Public/Home/css/edit.css">
<link rel="stylesheet" href="/blog/Public/Home/css/jquery.ui.css">
<script type="text/javascript">
    var ThinkPHP = {
        'MODULE' : '/blog/index.php/Home',
        'IMG' : '/blog/Public/<?php echo MODULE_NAME;?>/images',
    };
</script>
<header>
    <div class="wrap-header">

        <div class="top">
            <div class="socials">
                <ul>
                    <li><a href="#" title="facebook"><img  src="/blog/Public/Home/images/socials/facebook-32x32.png"/></a></li>
                    <li><a href="#" title="google"><img  src="/blog/Public/Home/images/socials/google-32x32.png"/></a></li>
                    <li><a href="#" title="twitter"><img  src="/blog/Public/Home/images/socials/twitter-32x32.png"/></a></li>
                    <li><a href="#" title="rss"><img  src="/blog/Public/Home/images/socials/rss-32x32.png"/></a></li>
                    <li><a href="#" title="youtube"><img  src="/blog/Public/Home/images/socials/youtube-32x32.png"/></a></li>
                </ul>
            </div>
            <div id="search">
                <div class="button-search"></div>
                <input type="text" value="Search..." onfocus="if (this.value == &#39;Search...&#39;) {this.value = &#39;&#39;;}" onblur="if (this.value == &#39;&#39;) {this.value = &#39;Search...&#39;;}">
            </div>
        </div>

        <div id="logo">
            <h1>个人资料</h1>
        </div>

        <nav>
            <div class="wrap-nav">
                <div class="menu">
                    <ul>
                        <li><a href="<?php echo U('Index/index');?>">首页</a></li>
                        <li><a href="<?php echo U('Experience/index');?>">博客文章</a></li>
                        <li><a href="blog.html">相册</a></li>
                        <li><a href="<?php echo U('User/completeInfo',array('id'=>2));?>">完善个人资料</a></li>
                        <li><a href="#">联系方式</a></li>
                        <li class="right" id="logout"><a href="<?php echo U('User/logout');?>">退出</a></li>
                    </ul>
                </div>

            </div>
        </nav>

    </div>

</header>
    <div align=center>
        <div style=“width:960px; margin:0 auto; height:90px;”>
        </div>
    </div>
    <!--------------Content--------------->
    <section id="content">
        <div class="wrap-content">
            <div class="row block">
                <form id="experience">
                    <li><input type="text" value="<?php echo ($experience["id"]); ?>" id="id" style="display: none;"></li>
                    <li><input type="text" value="<?php echo ($experience["title"]); ?>" id="title" /></li>
                    <li><textarea id="TextArea1" class="ckeditor" ><?php echo ($experience["content"]); ?></textarea></li>
                </form>
                <div id="submit"><input type="submit" id="exp" /></div>
            </div>
        </div>
    </section>

    <!--------------Footer--------------->
    ﻿<footer>
    <div class="wrap-footer">
        <div class="row">
            <div class="col-1-3">
                <div class="wrap-col">
                    <div class="box">
                        <div class="heading"><h2>相册</h2></div>
                        <div class="content gallery">
                            <a href="#"><img src="/blog/Public/Home/images/img1.jpg" width="120"/></a>
                            <a href="#"><img src="/blog/Public/Home/images/img2.jpg" width="120"/></a>
                            <a href="#"><img src="/blog/Public/Home/images/img3.jpg" width="120"/></a>
                            <a href="#"><img src="/blog/Public/Home/images/img4.jpg" width="120"/></a>
                            <a href="#"><img src="/blog/Public/Home/images/img5.jpg" width="120"/></a>
                            <a href="#"><img src="/blog/Public/Home/images/img1.jpg" width="120"/></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-1-3">
                <div class="wrap-col">
                    <div class="box">
                        <div class="heading"><h2>关于</h2></div>
                        <div class="content">
                            <img src="/blog/Public/Home/images/zerotheme.jpg" style="border: 0px;"/>
                            <p>Html5 Templates created by chinaz. You can use and modify the template for both personal and commercial use. You must keep all copyright information and credit links in the template and associated files.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-1-3">
                <div class="wrap-col">
                    <div class="box">
                        <div class="heading"><h2>联系我们</h2></div>
                        <div class="content">
                            <p>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue.</p>
                            <p>Website : <a href="http://sc.chinaz.com" target="_blank">sc.chinaz.com</a></p>
                            <p>+1 (123) 444-5677 <br/> +1 (123) 444-5678</p>
                            <p>Address: 123 TemplateAccess Rd1</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="copyright">
        <p>&copy; Copyright &copy; 2014.Company name All rights reserved.<a target="_blank" href="http://www.huiyi8.com/moban/">&#x7F51;&#x9875;&#x6A21;&#x677F;</a></p>
    </div>
</footer>

</div>
</body>
</html>