const gulp = require("gulp");
const concat = require("gulp-concat");
const clean = require("gulp-clean");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const watch = require("gulp");
const { stream } = require("browser-sync");

sass.compiler = require("node-sass");
/**PATHS for centralization */
const paths = {
  src: {
    scss: "./src/scss/**/*.scss",
    js: "./src/js/*.js",
    img: "./src/img/*",
  },
  dist: {
    css: "./dist/styles.min.css",
    js: "./dist/styles.min.js",
    img: "./dist/img/",
    self: "./dist/",
  },
};

const imagemintask = () =>
  gulp
    .src(paths.src.img)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist.img))
    .pipe(browserSync.stream());
const buildJS = () =>
  gulp
    .src(paths.src.js)
    .pipe(concat("script.js"))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream());
const buildCSS = () =>
  gulp
    .src(paths.src.scss)
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    // .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(paths.dist.css))
    // .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream());

const cleanBuild = () =>
  gulp.src(paths.dist.self, { allowEmpty: true }).pipe(clean());

const dev = () => {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
};

gulp.watch(paths.src.scss, buildCSS).on("change", browserSync.reload);
gulp.watch(paths.src.js, buildJS).on("change", browserSync.reload);
gulp.watch(paths.src.img, imagemintask).on("change", browserSync.reload);

//tasks
gulp.task("cleanBuild", cleanBuild);
gulp.task("buildCSS", buildCSS);
gulp.task("buildJS", buildJS);
gulp.task("imagemintask", imagemintask);

const build = gulp.series(cleanBuild, buildCSS, buildJS, imagemintask);

gulp.task("default", gulp.series(build, dev));
