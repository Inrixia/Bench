const { bench, bulkBench } = require('./lib/bench.js')

const BenchmarkOptions = { async: false }
const iterations = 8000000

console.log(`Generating ${iterations} Keys...\n`)
let keys = []
for (let i=0; i < iterations; i++) {
	keys[i] = Math.random().toString(36).substring(7)
}
console.log(`Generated ${iterations} Keys...\n`)

let map = new Map();
let obj = {};
let nullobj = Object.create(null);

;(async () => {
	console.log("Set")
	await bulkBench({
		func: i => map.set(keys[i], i),
		iterations
	}, {
		func: i => nullobj[keys[i]] = i,
		iterations
	}, {
		func: i => obj[keys[i]] = i,
		iterations
	})
	
	console.log("Get")
	await bulkBench({
		func: i => map.get(keys[i]) !== i,
		iterations
	}, {
		func: i => nullobj[keys[i]] !== i,
		iterations
	}, {
		func: i => obj[keys[i]] !== i,
		iterations
	})
	
	console.log("Delete")
	await bulkBench({
		func: i => map.delete(keys[i]),
		iterations
	}, {
		func: i => delete nullobj[keys[i]],
		iterations
	}, {
		func: i => delete obj[keys[i]],
		iterations
	})
})();
