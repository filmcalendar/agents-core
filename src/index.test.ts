import program from './index';

describe('program', () => {
  it('throws an error if no action is specified', async () => {
    expect.assertions(1);

    const expected = new Error('Program action undefined not supported');
    await expect(() => program({})).rejects.toThrow(expected);
  });
});
