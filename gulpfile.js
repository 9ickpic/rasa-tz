import gulp from "gulp";
import sass from "gulp-sass";
import * as dartSass from "sass";
import pug from "gulp-pug";
import browserSync from "browser-sync";
import concat from "gulp-concat";
import terser from "gulp-terser";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import newer from "gulp-newer"; // Для копирования только новых файлов

const sassCompiler = sass(dartSass);
const browserSyncServer = browserSync.create();

// Paths
const paths = {
  src: {
    scss: "src/assets/styles/**/*.scss",
    pug: "src/**/*.pug",
    js: "src/assets/js/**/*.js",
    fonts: "src/assets/fonts/**/*.{woff,woff2,ttf,eot,svg}",
    images: "src/assets/images/**/*.{jpg,jpeg,png,gif,svg,webp}",
    copyStatic: "src/assets/components/**/*", // Другие статические файлы
  },
  dest: {
    css: "build/assets/css",
    html: "build",
    js: "build/assets/js",
    fonts: "build/assets/fonts",
    images: "build/assets/images",
    copyStatic: "build/assets/components",
  },
};

// Compile SCSS
export function styles() {
  return gulp.src(paths.src.scss)
    .pipe(sassCompiler().on("error", sassCompiler.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(concat("styles.css"))
    .pipe(gulp.dest(paths.dest.css))
    .pipe(browserSyncServer.stream());
}

// Compile Pug
export function templates() {
  return gulp.src("src/*.pug")
    .pipe(pug({
      pretty: true,
    }))
    .pipe(gulp.dest(paths.dest.html))
    .pipe(browserSyncServer.stream());
}

// Process JS
export function scripts() {
  return gulp.src(paths.src.js)
    .pipe(concat("main.js"))
    .pipe(terser())
    .pipe(gulp.dest(paths.dest.js))
    .pipe(browserSyncServer.stream());
}

// Copy fonts
export function fonts() {
  return gulp.src(paths.src.fonts)
    .pipe(newer(paths.dest.fonts))
    .pipe(gulp.dest(paths.dest.fonts))
    .pipe(browserSyncServer.stream());
}

// Copy images
export function images() {
  return gulp.src(paths.src.images)
    .pipe(newer(paths.dest.images))
    .pipe(gulp.dest(paths.dest.images))
    .pipe(browserSyncServer.stream());
}

// Copy copyStatic files
export function copyStatic() {
  return gulp.src(paths.src.copyStatic)
    .pipe(newer(paths.dest.copyStatic))
    .pipe(gulp.dest(paths.dest.copyStatic))
    .pipe(browserSyncServer.stream());
}

// Clean build directory (optional)
export function clean() {
  return import("del").then(({ deleteSync }) => {
    deleteSync(["build/**", "!build"]);
  });
}

// Watch and reload
export function watch() {
  browserSyncServer.init({
    server: {
      baseDir: "./build",
    },
  });

  gulp.watch(paths.src.scss, styles);
  gulp.watch(paths.src.pug, templates);
  gulp.watch(paths.src.js, scripts);
  gulp.watch(paths.src.fonts, fonts);
  gulp.watch(paths.src.images, images);
  gulp.watch(paths.src.copyStatic, copyStatic);
}

// Build task without watching
export const build = gulp.series(
  gulp.parallel(styles, templates, scripts, fonts, images, copyStatic),
);

// Default task with watching
export default gulp.series(
  build,
  watch,
);
