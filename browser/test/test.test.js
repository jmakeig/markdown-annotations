import test from 'zora';

test('stuff', assert => {
  assert.ok(1 === 1);
});

test('other', assert => {
  assert.ok(true);
  assert.ok(!false);
});
