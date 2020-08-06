const { bulkBench } = require('./lib/bench.js')

const iterations = 20000000
const BenchmarkOptions = { async: false }

bulkBench({
	func: i => i+""+i*2,
	iterations,
	BenchmarkOptions
}, {
	func: i => `${i}${i*2}`,
	iterations,
	BenchmarkOptions
})