const { bench, bulkBench } = require('./lib/bench.js')

const BenchmarkOptions = { async: false }

bulkBench({
	func: i => (i => i)(i),
	BenchmarkOptions
}, {
	func: i => i,
	BenchmarkOptions
})