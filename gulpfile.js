var gulp = require('gulp');
var $ = {
    gutil: require('gulp-util'),
    sass: require('gulp-sass'),
    plumber: require('gulp-plumber'),
    htmlreplace: require('gulp-html-replace'),
    rename: require('gulp-rename'),
    merge: require('merge-stream'),
    uglify: require('gulp-uglify'),
    pump: require('pump'),
    postcss: require('gulp-postcss'),
    autoprefixer: require('autoprefixer'),
    cssnano: require('cssnano'),
    jshint: require('gulp-jshint'),
    inlinesource: require('gulp-inline-source'),
    htmlmin: require('gulp-htmlmin'),
    concat: require('gulp-concat'),
    babel: require('gulp-babel'),
    async: require('async')
};

/*
 * Let the magic begin
 */

var fs = require('fs');
var indigo;
try {
    indigo = fs.readFileSync('./../indigo.json');
} catch (err) {
    // Here you get the error when the file was not found,
    // but you also get any other error
    indigo = JSON.parse(fs.readFileSync('./indigo.json'));

}

gulp.task('dev-css', function (cb) {
    $.async.series([
        function (next) {
            compileSass().on('end', next);
        },
        function (next) {
            postCss().on('end', next);
        },
        function (next) {
            webComponents().on('end', next);
        }
    ], cb);
});

gulp.task('dev-js', function (cb) {
    $.async.series([
        function (next) {
            es2015Transpile().on('end', next);
        },
        function (next) {
            projectIndigo().on('end', next);
        }
    ], cb);
});

gulp.task('dev-vendors', function (cb) {
    var vendors = [];
    var filesToMove = indigo.config.js.modules;
    filesToMove.forEach(function(name) {
        vendors.push(function(next) {
            jsModules(name).on('end', next);
        });
    });
    $.async.series(vendors, cb);
});

gulp.task('dev-index', function (cb) {
    $.async.series([
        function (next) {
            htmlReplace().on('end', next);
        }
    ], cb);
});

/*
 * Sass Compiling
 */

function compileSass() {
    return gulp.src('/project-indigo/src/scss/**/*.scss')
        .pipe($.plumber())
        .pipe($.sass())
        .pipe(gulp.dest('/project-indigo/src/css'));
}

function postCss() {
    var processors = [
        $.autoprefixer({browsers: ['last 3 version']}),
        $.cssnano({
            discardComments: {
                removeAll: true
            },
            convertValues: true
        })
    ];
    return gulp.src('/project-indigo/src/css/**/*.css')
        .pipe($.postcss(processors))
        .pipe(gulp.dest(indigo.config.dist_url+'/css'));
}

/*
 * Extracting Main Javascript Files to the src/js/vendor for Minification
 */

function jsModules(name) {

        return gulp.src(name)
            .pipe($.rename(function(path) {
                path.dirname = 'src/js/'
            }))
            .pipe(gulp.dest('./'));
}

/*
 * Minification of Javascript Files to the dist/js/ for Distribution
 */

function projectIndigo() {
    return gulp.src('src/js/**/*.js')
        .pipe($.uglify())
        .pipe($.rename(function(path) {
            path.dirname = 'dist/js/'
        }))
        .pipe(gulp.dest('./'));
}

/*
 * Extracting Main Javascript of the Application the dist/js for Distribution
 */

function es2015Transpile() {
    return gulp.src('src/es2015/**/*.js')
        .pipe($.babel({
            presets: ['es2015'],
            plugins: ['transform-es2015-modules-systemjs']
        }))
        .pipe(gulp.dest('src/js/indigo/es5'));
}

/*
 * Check Javascript for errors
 */

function jsLint() {
    return gulp.src('./src/js/app/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'));
}

/*
 * Inline all scripts and styles on Web Components.
 */

function webComponents() {
    return gulp.src('./src/components/**/*.html')
        .pipe($.inlinesource())
        .pipe($.htmlmin({collapseWhitespace: true, removeComments: true, removeAttributeQuotes: true, conservativeCollapse: true, minifyJS: true}))
        .pipe(gulp.dest('./dist/components/'));
}

/*
 * Replace Indigo Configuration on HTML
 */

function htmlReplace() {
    return gulp.src('./src/index.html')
        .pipe($.htmlreplace({
            "preconnect": {
                "src" : indigo.config.preconnect,
                "tpl": "<link rel=preconnect href=%s crossorigin>"
            },
            "site_title": {
                "src": indigo.config.site_title,
                "tpl": "<title>%s</title>"
            },
            "settings": {
                "src" : [[
                    indigo.config.site_name,
                    indigo.config.site_title,
                    indigo.config.site_url,
                    indigo.config.dist_url,
                    false
                ]],
                "tpl": "<script type='text/javascript'>/* <![CDATA[ */var indigoConfig = { 'site_name': '%s', 'site_title': '%s', 'site_url': '%s', 'dist_url': '%s', 'router': '%s' };/* ]]> */</script>"
            }
        }))
        .pipe(gulp.dest('./'));
}