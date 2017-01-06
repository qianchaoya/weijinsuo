'use strict';
//1.压缩html
var gulp = require("gulp");
var htmlmin = require("gulp-htmlmin");
//2.css,压缩。再转换，先合并，在压缩，最后放入dist/css中
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var cssnano = require('gulp-cssnano');
// 3.js文件 -- 合并，压缩，混淆
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
// 4.图片处理
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;



//1.处理页面html
gulp.task("html",function(){
	gulp.src("*.html")
	.pipe(htmlmin({
			collapseWhitespace: true, //压缩HTML中的空白字符
			collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input checked/>
			removeAttributeQuotes: true, //删除所有属性值的引号
			removeComments: true, //删除注释
			removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
			removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
			removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
		}))
	.pipe(gulp.dest("dist/"))
	.pipe(reload({stream: true}));
});
//2.css,压缩。再转换，先合并，在压缩，最后放入dist/css中

gulp.task("style", function() {
	gulp.src("css/*.scss")
		.pipe(sass())
		.pipe(concatCss("main.css"))
		.pipe(cssnano())
		.pipe(gulp.dest("dist/css"))
		.pipe(reload({stream: true}));
});
// 3.js文件 -- 合并，压缩，混淆
gulp.task("sheet", function() {
	gulp.src("js/*.js")
		.pipe(concat("app.js"))
		.pipe(uglify())
		.pipe(jshint())
		.pipe(gulp.dest("dist/js"))
		.pipe(reload({stream: true}));
});
// 4.图片处理
gulp.task("img", function() {
	gulp.src("img/*.*")
		.pipe(gulp.dest("dist/img"))
		.pipe(reload({stream: true}));
});
// 5.处理fonts
gulp.task("fonts", function() {
	gulp.src("fonts/*.*")
		.pipe(gulp.dest("dist/fonts"))
		.pipe(reload({stream: true}));
});
// 6.处理libs
gulp.task("lib", function() {
	gulp.src("lib/**/*.*")
		.pipe(gulp.dest("dist/lib"))
		.pipe(reload({stream: true}));
});

// 7.编译任务
gulp.task("build", ["style", "sheet", "img", "html", "fonts", "lib"]);

// 8.开启服务器
gulp.task("serve", ["build"], function() {
	browserSync.init({
        server: {
            baseDir: "dist/"
        }
    });

    gulp.watch("css/*.css", ["style"]);
    gulp.watch("js/*.js", ["sheet"]);
    gulp.watch("img/*.*", ["img"]);
    gulp.watch("*.html", ["html"]);
    gulp.watch("fonts/*.*", ["fonts"]);
    gulp.watch("lib/**/*.*", ["lib"]);
});
