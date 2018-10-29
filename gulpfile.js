var gulp = require('gulp');
var concat = require('gulp-concat');
const minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var pump = require('pump');
const babel = require('gulp-babel');
const watch = require('gulp-watch');

function compile_basic(){
    console.log("compile...");
    return gulp.src([
        './src/manifest.js',
        './src/box.js',
        './src/utility.js',
        './src/scene.js',
        './src/vector.js',
        './src/entity.js',
        './src/camera.js',
        './src/diorama.js',
    ])
      .pipe(concat('diorama.js'))
      .pipe(gulp.dest('./dist/'))
      .pipe(minify())
      .pipe(gulp.dest('./dist/'));
}


gulp.task('callback', function () {
    // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
    return watch('src/**/*.js', function () {
        compile_basic();
    });
});

gulp.task('default', function() {
    compile_basic();
});


  gulp.task('compress', function (cb) {
    pump([
        gulp.src([
            './src/manifest.js',
            './src/box.js',
            './src/utility.js',
            './src/scene.js',
            './src/vector.js',
            './src/entity.js',
            './src/camera.js',
            './src/diorama.js',
        ])
        .pipe(concat('diorama_ecma_2015.js'))
        .pipe(babel({
            presets: ['@babel/env']
        })),
          uglify(),
          gulp.dest('./dist/')
      ],
      cb
    );
  });
