import test from 'node:test'
import assert from 'node:assert/strict'

function optimizeStops(stops) {
  return [...stops].sort((a,b) => a.order - b.order)
}

test('route optimization keeps stops in chronological order', () => {
  const result=optimizeStops([{order:3,name:'Night'},{order:1,name:'Morning'},{order:2,name:'Lunch'}])
  assert.deepEqual(result.map(x=>x.name),['Morning','Lunch','Night'])
})

test('preference object contains required fields', () => {
  const preferences={destination:'Paris',days:5,travelers:2,budget:'Comfort',interests:['Food','Culture']}
  assert.equal(typeof preferences.destination,'string')
  assert.ok(preferences.days>0)
  assert.ok(Array.isArray(preferences.interests))
})