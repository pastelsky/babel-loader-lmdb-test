const Benchmark = require("benchmark");
const webpack = require("webpack");
const options = require("./webpack.config.js");
const _ = require('lodash');

function runWebpack(useLMDBCache, cacheCompress) {
  return new Promise((resolve, reject) => {
    webpack(options(useLMDBCache, cacheCompress), (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
}

async function runBenchmark() {
  console.log('Running benchmark...');
  console.log('Warming up caches...')
  // warmup cache
  await runWebpack(true, true);
  await runWebpack(true, false);
  await runWebpack(false, true);
  await runWebpack(false, false);

  console.log('Comparing builds...')

  const suite = new Benchmark.Suite();
  suite.add("Using LMDB Cache — non compressed", {
    defer: true,
    initCount: 1,
    minSamples: 20,
    fn: async function(deferred) {
      await runWebpack(true, false);
      deferred.resolve()
    }
  })
    .add("Using LMDB Cache — compressed", {
      defer: true,
      initCount: 1,
      minSamples: 20,
      fn: async function(deferred) {
        await runWebpack(true, true);
        deferred.resolve()
      }
    })
    .add("Using regular FS cache — non-compressed", {
      defer: true,
      initCount: 1,
      minSamples: 20,
      fn: async function(deferred) {
        await runWebpack(false, false);
        deferred.resolve()
      }
    })
    .add("Using regular FS cache — compressed", {
      defer: true,
      initCount: 1,
      minSamples: 20,
      fn: async function(deferred) {
        await runWebpack(false, true);
        deferred.resolve()
      }
    })
    .on("cycle", function(event) {
      console.log(String(event.target));
      console.log('\nRun times for ', event.target.name, ':', event.target.stats.sample);
      console.log('Overall times for ', event.target.name, ':', event.target.stats.mean, ' ± ', event.target.stats.moe, 's', '\n');
    })
    .on("complete", function(event) {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    // run async
    .run({ "async": true });
}

runBenchmark()
