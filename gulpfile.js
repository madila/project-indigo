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
    async: require('async'),
    replace: require('gulp-replace')
};

/*
 * Let the magic begin
 */

function getIndigoConfig() {
    var indigo = {};
    try {
        indigo = require('./../../indigo.json');
        $.gutil.log('Using custom config');
    } catch(err) {
        indigo = require('./indigo.json');
        $.gutil.log('Using default config');
    }
    return indigo;
}

var indigo = getIndigoConfig();

gulp.task('dev-css', function (cb) {
    $.async.series([
        function (next) {
            if(indigo.config.frontend) {
                compileSass().on('end', next);
            } else {
                next();
            }
        },
        function (next) {
            if(indigo.config.frontend) {
                postCss().on('end', next);
            } else {
                next();
            }
        },
        function (next) {
            if(indigo.config.frontend) {
                webComponents().on('end', next);
            } else {
                next();
            }
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
    return gulp.src('./src/scss/**/*.scss')
        .pipe($.plumber())
        .pipe($.sass())
        .pipe(gulp.dest('./src/css'));
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
    return gulp.src('./src/css/**/*.css')
        .pipe($.postcss(processors))
        .pipe(gulp.dest(indigo.config.dist_path+'/css'));
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
            path.dirname = indigo.config.dist_path+'/js/'
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
        .pipe(gulp.dest(indigo.config.dist_path+'/components/'));
}

/*
 * Replace Indigo Configuration on HTML
 */

function htmlReplace() {
    var frontend_head = '';
    var frontend_body = '';
    if(indigo.config.frontend) {
        frontend_head = '<link href="[dist_url]/css/core.css" rel="stylesheet"> <link rel="import" href="[dist_url]/components/polymer/polymer.html"><link rel="import" href="[dist_url]/components/icomoon-polymer/icomoon-iconset-svg.html">';
        frontend_body = '<nav is="app-sidebar" unresolved="true" data-animate="fadeIn" data-import></nav> <main is="app-container" data-animate="fadeIn" data-import><button is="app-button" data-import unresolved="true" class="pink"><iron-icon icon="icomoon:fitness_center"></iron-icon> Something</button></main>';
    }
    return gulp.src('./src/index.html')
        .pipe($.replace('[frontend_head]', frontend_head))
        .pipe($.replace('[frontend_body]', frontend_body))
        .pipe($.htmlreplace({
            "preconnect": {
                "src": indigo.config.preconnect,
                "tpl": "<link rel=preconnect href=%s crossorigin>"
            },
            "frontend_head": {
                "src": indigo.config.preconnect,
                "tpl": "<link rel=preconnect href=%s crossorigin>"
            },
            "frontend_body": {
                "src": indigo.config.preconnect,
                "tpl": "<link rel=preconnect href=%s crossorigin>"
            },
            "site_title": {
                "src": indigo.config.site_name+' - '+indigo.config.site_title,
                "tpl": "<title>%s</title>"
            },
            "settings": {
                "src": [[
                    indigo.config.site_name,
                    indigo.config.site_title,
                    indigo.config.site_url,
                    indigo.config.dist_url,
                    false,
                    false
                ]],
                "tpl": "<script type='text/javascript'>/* <![CDATA[ */var indigoConfig = { 'site_name': '%s', 'site_title': '%s', 'site_url': '%s', 'dist_url': '%s', 'router': %s, 'debug': %s };/* ]]> */</script>"
            }
        }))
        .pipe($.replace('[dist_url]', indigo.config.dist_url))
        .pipe($.replace('[site_title]', indigo.config.site_title))
        .pipe($.replace('[site_name]', indigo.config.site_name))
        .pipe(gulp.dest(indigo.config.root_path));
}