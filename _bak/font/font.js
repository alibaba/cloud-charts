var Fontmin = require('fontmin');

// var fontmin = new Fontmin()
//   .src('./*.otf')
//   .use(Fontmin.otf2ttf())
//   .dest('./');
//
// fontmin.run(function (err, files) {
//   if (err) {
//     throw err;
//   }
//
//   console.log('转换完成');
//   splitFont();
// });

function splitFont() {
  var fontmin = new Fontmin()
    .src('./*.ttf')
    .use(Fontmin.glyph({
      text: '1234567890%$&.,-=+*/<>'
      // hinting: false         // keep ttf hint info (fpgm, prep, cvt). default = true
    }))
    // .use(Fontmin.css({
    //   fontPath: './font',         // location of font file
    //   // base64: true,           // inject base64 data:application/x-font-ttf; (gzip font with css).
    //   // default = false
    //   // glyph: true,            // generate class for each glyph. default = false
    //   // iconPrefix: 'my-icon',  // class prefix, only work when glyph is `true`. default to "icon"
    //   fontFamily: 'DIN For Widgets',   // custom fontFamily, default to filename or get from analysed ttf file
    //   // asFileName: false,      // rewrite fontFamily as filename force. default = false
    //   local: true             // boolean to add local font. default = false
    // }))
    .dest('./splitFont');

  fontmin.run(function (err, files) {
    if (err) {
      throw err;
    }

    console.log('截取完成!');
    convertFont()
  });
}

function convertFont() {
  var fontmin = new Fontmin()
    .src('./splitFont/*.ttf')
    .dest('./webFont');

  fontmin.run(function (err, files) {
    if (err) {
      throw err;
    }

    console.log('done!');
  });
}

// splitFont();
// convertFont();