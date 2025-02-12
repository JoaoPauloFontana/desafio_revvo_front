import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';

const sass = gulpSass(dartSass);
const sync = browserSync.create();

export function compileSass() {
    return gulp.src('src/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/assets/css'))
        .pipe(sync.stream());
}

export function minifyJS() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('public/assets/js'))
        .pipe(sync.stream());
}

export function optimizeImages() {
    return gulp.src('src/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('public/assets/images'));
}

export function serve() {
    sync.init({
        server: './public'
    });

    gulp.watch('src/styles/**/*.scss', compileSass);
    gulp.watch('src/scripts/**/*.js', minifyJS);
    gulp.watch('src/images/**/*', optimizeImages);
    gulp.watch('public/*.html').on('change', sync.reload);
}

export default gulp.series(
    gulp.parallel(compileSass, minifyJS, optimizeImages),
    serve
);
