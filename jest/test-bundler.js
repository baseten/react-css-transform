import matchers from 'expect/build/matchers';

// toMatchObject is supposed to match arrays of objects too, but it isn't currently working.
expect.extend({
  toAllMatchObject(actualArray, objectMatcher) {
    const results = actualArray.map(item => matchers.toMatchObject(item, objectMatcher));
    const pass = results.reduce((acc, result) => acc && result.pass, true);
    const message = pass ? () => {} : results.find(res => !res.pass).message;

    return {
      message,
      pass,
    };
  },
});
