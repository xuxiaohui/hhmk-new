const gulp        = require('gulp');
const rollup      = require('gulp-rollup')
const uglify      = require('gulp-uglify');
const babel       = require('rollup-plugin-babel');
const fs          = require('fs');
const connect     = require('gulp-connect');
const htmlmin     = require('gulp-htmlmin');
const revCollector= require('gulp-rev-collector');
const gulpSequence= require('gulp-sequence');
const runSequence = require('gulp-run-sequence');
const sass        = require('gulp-sass');
const autoprefixer= require('gulp-autoprefixer');
const flatten     = require('gulp-flatten');
const cssmin      = require('gulp-minify-css');
const rev         = require('gulp-rev');
const rename      = require('gulp-rename');
const clean       = require('gulp-clean');
const plumber     = require('gulp-plumber');
const changed     = require('gulp-changed');

// var rollup      = require('rollup').rollup;
// var commonjs    = require('rollup-plugin-commonjs');
// var nodeResolve = require('rollup-plugin-node-resolve');

var source = 'src';
var develop = 'dev';
var dest = 'dest';

gulp.task('default', () => {
    gulp.src('src/main.js')
      .pipe(rollup({
          // any option supported by rollup can be set here, including sourceMap
          // sourceMap: true
          format: 'iife',
          plugins:[
            babel({
                exclude: 'node_modules/**/*',
                // //externalHelpers 不包含到我打包的JS里面去
                // externalHelpers: true,
                // http://babeljs.io/docs/plugins/transform-es3-property-literals/
                // 暂时好像搞不定
                // "plugins": ["transform-es3-property-literals"]
            })
          ]
      }))
      // babel 一些奇怪的转化方式，需要通过 uglify 再转换一下
      .pipe(uglify({
        mangle:false,
        preserveComments: 'all',
        compress:{
            sequences     : false,  // join consecutive statemets with the “comma operator”
            properties    : false,  // optimize property access: a["foo"] → a.foo
            // dead_code     : true,  // discard unreachable code
            // drop_debugger : true,  // discard “debugger” statements
            // unsafe        : false, // some unsafe optimizations (see below)
            // conditionals  : true,  // optimize if-s and conditional expressions
            comparisons   : false,  // optimize comparisons
            // evaluate      : true,  // evaluate constant expressions
            // booleans      : true,  // optimize boolean expressions
            // loops         : true,  // optimize loops
            unused        : true,  // drop unused variables/functions
            // hoist_funs    : true,  // hoist function declarations
            // hoist_vars    : false, // hoist variable declarations
            if_return     : false,  // optimize if-s followed by return/continue
            join_vars     : true,  // join var declarations
            // cascade       : true,  // try to cascade `right` into `left` in sequences
            // side_effects  : true,  // drop side-effect-free statements
            // warnings      : true,  // warn about potentially dangerous optimizations/code
            // global_defs   : {}     // global definitions
        },
        output: {
            beautify: true
        },
        banner:"/* eew */"
      }))
      .pipe(gulp.dest('dist'));
});

gulp.task('cleanAll',()=>{
  return gulp.src(['!'+develop+'/lib/**'])
        .pipe(plumber())
        .pipe(clean());
});

/**
 * copy 静态资源到对应的目录
 */
gulp.task("copystatic",()=>{
  return gulp.src(source + "/lib/**")
    .pipe(changed(develop))
    .pipe(gulp.dest(develop + "/lib"))
});

gulp.task("buildImg",()=>{
  return gulp.src([source + '/**/**/*.png',source + '/**/**/*.jpg',source + '/**/**/*.gif',source + '/**/**/*.svg','!'+source+'/lib/**','!'+source+'/toolcase/**'])
      .pipe(changed(develop))
      .pipe(gulp.dest(develop))
});

gulp.task("buildCss",()=>{
  return gulp.src([source + "/**/**/*.{scss,css}",'!'+source+'/lib/**','!'+source+'/toolcase/**'])
              .pipe(changed(develop))
              /*.pipe(rename({suffix: '.min'}))*/
              .pipe(sass().on('error', sass.logError))
              .pipe(autoprefixer({
                browsers: ['last 2 versions', 'Android >= 4.0'],
                cascade: false,
                remove:false
              }))
              .pipe(cssmin())
              .pipe(gulp.dest(develop))
              .pipe(connect.reload());
});

gulp.task("buildJs",()=>{
  return gulp.src([source + "/**/**/*.js",'!'+source+'/lib/**','!'+source+'/toolcase/**'])
            .pipe(changed(develop))
            .pipe(rollup({
                // any option supported by rollup can be set here, including sourceMap
                // sourceMap: true
                format: 'iife',
                plugins:[
                  babel({
                      exclude: 'node_modules/**/*',
                  })
                ]
            }))
            .pipe(uglify({
              mangle:false,
              //preserveComments: 'all',
              compress:{
                  sequences     : false,  // join consecutive statemets with the “comma operator”
                  properties    : false,  // optimize property access: a["foo"] → a.foo
                  comparisons   : true,  // optimize comparisons
                  unused        : true,  // drop unused variables/functions
                  if_return     : true,  // optimize if-s followed by return/continue
                  join_vars     : true,  // join var declarations
                  cascade       : true,  // try to cascade `right` into `left` in sequences
                  side_effects  : true,  // drop side-effect-free statements
                  warnings      : true,  // warn about potentially dangerous optimizations/code
                  // global_defs   : {}     // global definitions
              },
              output: {
                  beautify: false
              },
              banner:"/* eew */"
            }))
            .pipe(gulp.dest(develop))
            .pipe(connect.reload());
})

gulp.task("buildHtml",()=>{
  var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true,//压缩页面CSS
        collapseBooleanAttributes:true,
        removeTagWhitespace:true,
        removeRedundantAttributes:true,
    };
    return gulp.src([source + '/**/**/*.html',
            '!'+source+'/lib/**',
            '!'+source+'/toolcase/**'])
          .pipe(changed(develop))
          /*.pipe(htmlmin(options))*/
          .pipe(gulp.dest(develop))
          .pipe(connect.reload());
});

gulp.task('dev',gulp.series('copystatic','buildImg','buildCss','buildJs','buildHtml'));

gulp.task('webserver', function() {
    connect.server({
        root: './dev/',
        livereload: true
    });
});

gulp.task('watch', function() {
    gulp.watch(source + "/**/**/*.{scss,css}", gulp.series('buildCss'));
    gulp.watch(source + "/**/**/*.js", gulp.series('buildJs'));
    gulp.watch(source + "/**/**/*.html", gulp.series('buildHtml'));
});

gulp.task('startserver', gulp.series(gulp.parallel('webserver','watch')));

gulp.task('cleanproAll',()=>{
  return gulp.src(dest)
        .pipe(plumber())
        .pipe(clean());
});

/**
 * copy 静态资源到对应的目录
 */
gulp.task("copyprostatic",()=>{
  return gulp.src(source + "/lib/**")
    .pipe(gulp.dest(dest + "/lib"))
});

gulp.task("buildproImg",()=>{
  return gulp.src([source + '/**/**/*.png',source + '/**/**/*.jpg',source + '/**/**/*.gif',source + '/**/**/*.svg','!'+source+'/lib/**','!'+source+'/toolcase/**'])
      .pipe(rev())
      .pipe(gulp.dest(dest))
      .pipe(rev.manifest())
      .pipe(gulp.dest(dest+"/rev/img"));
});

gulp.task("buildproCss",()=>{
  return gulp.src([dest+"/rev/**/*.json",source + "/**/**/*.{scss,css}",'!'+source+'/lib/**','!'+source+'/toolcase/**'])
              .pipe(revCollector())
              /*.pipe(rename({suffix: '.min'}))*/
              .pipe(sass().on('error', sass.logError))
              .pipe(autoprefixer({
                browsers: ['last 2 versions', 'Android >= 4.0'],
                cascade: false,
                remove:false
              }))
              .pipe(rev())
              .pipe(cssmin())
              .pipe(gulp.dest(dest))
              .pipe(rev.manifest())
              .pipe(gulp.dest(dest+"/rev/css"))
});

gulp.task("buildproJs",()=>{
  return gulp.src([source + "/**/**/*.js",'!'+source+'/lib/**','!'+source+'/toolcase/**'])
            .pipe(rollup({
                // any option supported by rollup can be set here, including sourceMap
                // sourceMap: true
                format: 'iife',
                plugins:[
                  babel({
                      exclude: 'node_modules/**/*',
                  })
                ]
            }))
            .pipe(rev())
            .pipe(uglify({
              mangle:false,
              //preserveComments: 'all',
              compress:{
                  sequences     : false,  // join consecutive statemets with the “comma operator”
                  properties    : false,  // optimize property access: a["foo"] → a.foo
                  comparisons   : true,  // optimize comparisons
                  unused        : true,  // drop unused variables/functions
                  if_return     : true,  // optimize if-s followed by return/continue
                  join_vars     : true,  // join var declarations
                  cascade       : true,  // try to cascade `right` into `left` in sequences
                  side_effects  : true,  // drop side-effect-free statements
                  warnings      : true,  // warn about potentially dangerous optimizations/code
                  // global_defs   : {}     // global definitions
              },
              output: {
                  beautify: false
              },
              banner:"/* eew */"
            }))
            .pipe(gulp.dest(dest))
            .pipe(rev.manifest())
            .pipe(gulp.dest(dest+"/rev/js"));
})

gulp.task("buildproHtml",()=>{
  var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true,//压缩页面CSS
        collapseBooleanAttributes:true,
        removeTagWhitespace:true,
        removeRedundantAttributes:true,
    };
    return gulp.src([dest+"/rev/**/*.json",
            source + '/**/**/*.html',
            '!'+source+'/lib/**',
            '!'+source+'/toolcase/**'])
          .pipe(revCollector())
          .pipe(htmlmin(options))
          .pipe(gulp.dest(dest));
});

gulp.task('pro',gulp.series('cleanproAll','copyprostatic','buildproImg','buildproCss','buildproJs','buildproHtml'));
