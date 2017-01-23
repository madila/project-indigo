var gulp = require('gulp');
var $ = {
    gutil: require('gulp-util'),
    sass: require('gulp-sass'),
    svgSprite: require('gulp-svg-sprite'),
    svg2png: require('gulp-svg2png'),
    size: require('gulp-size'),
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
    babel: require('gulp-babel')
};

/*
 * Let the magic begin
 */

gulp.task('default', ['lint', 'transpile-es2015', 'indigo']);

gulp.task('refreshCss', ['sass']);

var fs = require('fs');
var indigo = JSON.parse(fs.readFileSync('./indigo.json'));

/*
 * Sass Compiling
 */

gulp.task('sass', function () {
    var stream = gulp.src(indigo.config.scss.src_url+'**/*.scss')
        .pipe($.plumber())
        .pipe($.sass())
        .pipe(gulp.dest(indigo.config.scss.dist_url));
    return stream;
});

gulp.task('postcss', function () {
    var processors = [
        $.autoprefixer({browsers: ['last 3 version']}),
        $.cssnano({
            discardComments: {
                removeAll: true
            },
            convertValues: true
        })
    ];
    var stream = gulp.src(indigo.config.postcss.src_url+'**/*.css')
        .pipe($.postcss(processors))
        .pipe(gulp.dest(indigo.config.postcss.dist_url))
        .on('end', function() {
            gulp.start('inlinesource');
        });
    return stream;
});

/*
 * Extracting Main Javascript Files to the src/js/vendor for Minification
 */

gulp.task('js-modules', function() {
    var filesToMove = indigo.config.js.modules;
    var streams = [];
    filesToMove.forEach(function(name) {
        var stream = gulp.src(name)
            .pipe($.rename(function(path) {
                path.dirname = 'src/js/'
            }))
            .pipe(gulp.dest('./'));
        streams.push(stream);
    });
    return $.merge(streams);
});

/*
 * Minification of Javascript Files to the dist/js/ for Distribution
 */

gulp.task('indigo-uglify', function () {
    var streams = [];
    var stream = gulp.src('src/js/**/*.js')
        //.pipe($.uglify())
        .pipe($.rename(function(path) {
            path.dirname = 'dist/js/'
        }))
        .pipe(gulp.dest('./'));
    streams.push(stream);
    return $.merge(streams);

});


/*
 * Extracting Polymer Files to the dist/vendor/polymer for Distribution
 */

gulp.task('webcomponents', function() {
    var filesToMove = [
        'src/components/**/*.html'
    ];
    var streams = [];
    filesToMove.forEach(function(name) {
        var stream = gulp.src(name)
            .pipe($.rename(function(path) {
                path.dirname = 'dist/components'
            }))
            .pipe(gulp.dest('./'));
        streams.push(stream);
    });
    return $.merge(streams);
});

/*
 * Extracting Main Javascript of the Application the dist/js for Distribution
 */

gulp.task('transpile-es2015', function () {

    var streams = [];
    var stream = gulp.src('src/es2015/**/*.js')
        .pipe($.babel({
            presets: ['es2015'],
            plugins: ['transform-es2015-modules-systemjs']
        }))
        .pipe(gulp.dest('src/js/indigo/es5'));
    streams.push(stream);
    return $.merge(streams);

});

/*
 * Check Javascript for errors
 */

gulp.task('lint', function() {
    var stream = gulp.src('./src/js/app/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'));
    return stream;
});

/*
 * Inline all scripts and styles on Web Components.
 */

gulp.task('inlinesource', function () {
    return gulp.src('./src/components/**/*.html')
        .pipe($.inlinesource())
        //.pipe($.htmlmin({collapseWhitespace: true, removeComments: true, removeAttributeQuotes: true, conservativeCollapse: true, minifyJS: true}))
        .pipe(gulp.dest('./dist/components/'));
});

/*
 * Replace Indigo Configuration on HTML
 */

gulp.task('htmlreplace', function() {
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
                    indigo.config.js.dist_url,
                    indigo.config.postcss.dist_url,
                    indigo.config.js.dist_url,
                    indigo.config.webcomponents.dist_url
                ]],
                "tpl": "<script type='text/javascript'>/* <![CDATA[ */var indigo = { 'site_name': '%s', 'site_title': '%s', 'site_url': '%s', 'js_dist_url': '%s', 'css_url': '%s', 'indigo_url': '%s', 'components_url': '%s' };/* ]]> */</script>"
            }
        }))
        .pipe(gulp.dest('./dist/'));
});