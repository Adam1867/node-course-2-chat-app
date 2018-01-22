const expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    const str = 28;
    const res = isRealString( str );

    expect(res).toBeFalsy();
  });
  it('should reject string with only spaces', () => {
    const str = '   ';
    const res = isRealString( str );

    expect(res).toBeFalsy();
  });
  it('should allow string with non-space characters', () => {
    const str = '   ayyyylmao   ';
    const res = isRealString( str );

    expect(res).toBeTruthy();
  });
});
