const gulp = require('gulp');
const del = require('del');
// const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const less = require('gulp-less');
const browserSync = require('browser-sync').create();
const gcmq = require('gulp-group-css-media-queries');
const webp = require('gulp-webp');
const smartGrid = require('smart-grid');
const path = require('path');
const webpack = require('webpack-stream');


let isMap = process.argv.includes('--map');
let isMinify = process.argv.includes('--clean');
let isSync = process.argv.includes('--sync');

let webConfig = {
    output: {
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            }
        ]
    }
};

function clean(){
   return del('./dist/*');
}

function html(){
   return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist'))
        .pipe(gulpIf(isSync,browserSync.stream()));
}

function styles(){
    return gulp.src('./src/css/**/main.less')
        .pipe(gulpIf(isMap, sourcemaps.init()))
        // .pipe(concat('main.css'))
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gcmq())
        .pipe(gulpIf(isMinify, cleanCSS({
            level: 1
            })))
        .pipe(gulpIf(isMap, sourcemaps.write('.'))) //'.' map в отдельном файле
        .pipe(gulp.dest('./dist/css'))
        .pipe(gulpIf(isSync, browserSync.stream()));
}
function scripts(){
    return gulp.src('./src/js/**/script.js')
        .pipe(webpack(webConfig))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
}

function images(){
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./dist/img'));       
}
function imagesToWebp(){
    return gulp.src('./src/img/**/*')
        .pipe(webp())
        .pipe(gulp.dest('./dist/img'));  
}

function watch(){
    if(isSync){
            browserSync.init({
            server: {
                baseDir: "./dist/"
            }
        });
    }
    

    gulp.watch('./src/**/*.html', html);
    gulp.watch('./src/css/**/*.less', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./smartgrid.js', grid);
}

function grid(done){
    delete require.cache[path.resolve('./smartgrid.js')];
    let options = require('./smartgrid.js');
    smartGrid('./src/css', options);
    done();
}

let build = gulp.parallel(html, styles, scripts, images, imagesToWebp);
let buildWithClean = gulp.series(clean, grid, build);
let dev = gulp.series(buildWithClean, watch);

gulp.task('build', buildWithClean);
gulp.task('watch', dev);
gulp.task('grid', grid);
