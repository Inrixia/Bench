
const Benchmark = require('benchmark');
const Suite = new Benchmark.Suite;

/**
 * Runs `func` and returns high resolution time taken in milliseconds.
 * @param {{name: string, func:function, iterations?: number, BenchmarkOptions?: Benchmark.Options, logTime?: boolean, await?: boolean}} options Benchmark options
 * @param {String} options.name Name of benchmark
 * @param {Function} options.func Function to run, takes a single parameter i which is the count of iterations that have completed.
 * @param {number} options.iterations Number of iterations to run, default 1Mil
 * @param {Benchmark.Options=} options.BenchmarkOptions Options for using optional "benchmark" module, will run if present.
 * @param {boolean=} options.logTime Log the time taken to console
 * @param {boolean=} options.await Await the function while running
 * @returns {Promise<number>} Total time taken in nanoseconds
 */
const bench = async options => {
	if (options.func === undefined) throw new Error("Function to run must be specified.")

	if (options.iterations === undefined) options.iterations = 1000000
	if (options.name == undefined) options.name = options.func.toString();
	if (options.logTime === undefined) options.logTime = true

	let timeTaken = 0;
	if (options.await) for (let i=0; i <= options.iterations; i++) {
		const hrstart = process.hrtime()
		await options.func(i)
		timeTaken += process.hrtime(hrstart)[1]
	} else for (let i=0; i <= options.iterations; i++) {
		const hrstart = process.hrtime()
		options.func(i)
		timeTaken += process.hrtime(hrstart)[1]
	}
	if (options.logTime) console.log(`${options.name} - ${options.iterations} runs took: ${(timeTaken/options.iterations)/1000000}ms Avg - ${timeTaken/1000000}ms Total`)
	
	if (options.BenchmarkOptions) Suite
	.add(options.name, options.func)
	.on('cycle', event => console.log(String(event.target)))
	.run(BenchmarkOptions);

	return timeTaken
}

/**
 * Runs benchmarks in bulk
 * @param {...{name: string, func:function, iterations: number, BenchmarkOptions?: Benchmark.Options, logTime?: boolean, await?: boolean}} benchmarks
 * @returns {Promise<Array<Promise<number>>>}
 */
const bulkBench = async (...benchmarks) => {
	const result = await Promise.all(benchmarks.map(async options => {
		if (options.BenchmarkOptions) Suite.add(options.name||options.func.toString(), options.func, options.BenchmarkOptions)
		options.BenchmarkOptions = undefined
		return await bench(options)
	}))
	console.log(`Bench.js - Fastest is ${benchmarks[result.indexOf(Math.min(...result))].name}\n`)
	if (Suite.length > 0) {
		await new Promise(resolve => Suite.on('cycle', event => console.log(String(event.target)))
		.on('complete', function() { 
			console.log(`BenchmarkSuite - Fastest is ${this.filter('fastest').map('name')}`)
			resolve()
		})
		.run())
	}
	return result
}

module.exports = { bench, bulkBench }