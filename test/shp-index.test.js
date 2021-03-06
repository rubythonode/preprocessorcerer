var test = require('tape');
var path = require('path');
var os = require('os');
var fs = require('fs');
var crypto = require('crypto');
var index = require('../preprocessors/shp-index.preprocessor');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

function tmpfile(callback) {
  var dir = path.join(os.tmpdir(), crypto.randomBytes(8).toString('hex'));

  mkdirp(dir, function(err) {
    if (err) return callback(err);
    callback(null, path.join(dir, 'sm.shp'));
  });
}

test('[shp-index] criteria: not a shapefile', function(assert) {
  var fixture = path.resolve(__dirname, 'fixtures', 'invalid.txt');
  index.criteria(fixture, { filetype: 'txt' }, function(err, process) {
    assert.ifError(err, 'no error');
    assert.notOk(process, 'do not process');
    assert.end();
  });
});

test('[shp-index] criteria: has an index', function(assert) {
  var fixture = path.resolve(__dirname, 'fixtures', 'sm.indexed.shapefile');
  index.criteria(fixture, { filetype: 'shp' }, function(err, process) {
    assert.ifError(err, 'no error');
    assert.ok(process, 'do process');
    assert.end();
  });
});

test('[shp-index] indexes (input folder output file)', function(assert) {
  var infolder = path.resolve(__dirname, 'fixtures', 'sm.shapefile');
  tmpfile(function(err, outfile) {
    index(infolder, outfile, function(err) {
      assert.ifError(err, 'no error');
      var files = fs.readdirSync(path.dirname(outfile))
        .filter(function(filename) {
          return path.extname(filename) === '.index';
        });

      fs.stat(outfile, function(err, stats) {
        assert.equal(files.length, 1, 'created index file');
        assert.equal(stats.size, 428328, 'index created using index-parts');
        rimraf(path.dirname(outfile), function(err) {
          assert.end(err);
        });
      });
    });
  });
});

test('[shp-index] indexes (input folder output folder)', function(assert) {
  var infolder = path.resolve(__dirname, 'fixtures', 'sm.shapefile');
  tmpfile(function(err, outfile) {
    index(infolder, path.dirname(outfile), function(err) {
      assert.ifError(err, 'no error');
      var files = fs.readdirSync(path.dirname(outfile))
        .filter(function(filename) {
          return path.extname(filename) === '.index';
        });

      fs.stat(outfile, function(err, stats) {
        assert.equal(files.length, 1, 'created index file');
        assert.equal(stats.size, 428328, 'index created using index-parts');
        rimraf(path.dirname(outfile), function(err) {
          assert.end(err);
        });
      });
    });
  });
});

test('[shp-index] indexes (input file output file)', function(assert) {
  var infile = path.resolve(__dirname, 'fixtures', 'sm.shapefile', 'sm.shp');
  tmpfile(function(err, outfile) {
    index(infile, outfile, function(err) {
      assert.ifError(err, 'no error');
      var files = fs.readdirSync(path.dirname(outfile))
        .filter(function(filename) {
          return path.extname(filename) === '.index';
        });

      fs.stat(outfile, function(err, stats) {
        assert.equal(files.length, 1, 'created index file');
        assert.equal(stats.size, 428328, 'index created using index-parts');
        rimraf(path.dirname(outfile), function(err) {
          assert.end(err);
        });
      });
    });
  });
});

test('[shp-index] indexes (input file output folder)', function(assert) {
  var infile = path.resolve(__dirname, 'fixtures', 'sm.shapefile', 'sm.shp');
  tmpfile(function(err, outfile) {
    index(infile, path.dirname(outfile), function(err) {
      assert.ifError(err, 'no error');
      var files = fs.readdirSync(path.dirname(outfile))
        .filter(function(filename) {
          return path.extname(filename) === '.index';
        });

      fs.stat(outfile, function(err, stats) {
        assert.equal(files.length, 1, 'created index file');
        assert.equal(stats.size, 428328, 'index created using index-parts');
        rimraf(path.dirname(outfile), function(err) {
          assert.end(err);
        });
      });
    });
  });
});

test('[shp-index] does not index (input folder output file - no index)', function(assert) {
  var infolder = path.resolve(__dirname, 'fixtures', 'nullshapes.shapefile');
  tmpfile(function(err, outfile) {
    index(infolder, outfile, function(err) {
      assert.ifError(err, 'no error');
      var files = fs.readdirSync(path.dirname(outfile))
        .filter(function(filename) {
          return path.extname(filename) === '.index';
        });

      assert.equal(files.length, 0, 'did not create index file');
      rimraf(path.dirname(outfile), function(err) {
        assert.end(err);
      });
    });
  });
});

test('[shp-index] does not index (input file output file - no index)', function(assert) {
  var infile = path.resolve(__dirname, 'fixtures', 'nullshapes.shapefile', 'regional.shp');
  tmpfile(function(err, outfile) {
    index(infile, outfile, function(err) {
      assert.ifError(err, 'no error');
      var files = fs.readdirSync(path.dirname(outfile))
        .filter(function(filename) {
          return path.extname(filename) === '.index';
        });

      assert.equal(files.length, 0, 'did not create index file');
      rimraf(path.dirname(outfile), function(err) {
        assert.end(err);
      });
    });
  });
});

test('[shp-index] does not index (input file output folder - no index)', function(assert) {
  var infile = path.resolve(__dirname, 'fixtures', 'nullshapes.shapefile', 'regional.shp');
  tmpfile(function(err, outfile) {
    index(infile, path.dirname(outfile), function(err) {
      assert.ifError(err, 'no error');
      var files = fs.readdirSync(path.dirname(outfile))
        .filter(function(filename) {
          return path.extname(filename) === '.index';
        });

      assert.equal(files.length, 0, 'did not create index file');
      rimraf(path.dirname(outfile), function(err) {
        assert.end(err);
      });
    });
  });
});

test('[shp-index] does not contain pre-existing index (input file output folder - no index)', function(assert) {
  var infile = path.resolve(__dirname, 'fixtures', 'hasindex.shapefile', 'regional.shp');
  tmpfile(function(err, outfile) {
    index(infile, path.dirname(outfile), function(err) {
      assert.ifError(err, 'no error');
      var files = fs.readdirSync(path.dirname(outfile))
        .filter(function(filename) {
          return path.extname(filename) === '.index';
        });

      assert.equal(files.length, 0, 'does not contain pre-existing index');
      rimraf(path.dirname(outfile), function(err) {
        assert.end(err);
      });
    });
  });
});
