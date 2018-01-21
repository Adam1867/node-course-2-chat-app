const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    const from = 'Adam';
    const text = 'Ayyyylmao';
    const message = generateMessage( from, text );

    // expect(message.from).toBe(from);
    // expect(message.text).toBe(text);
    expect(message).toMatchObject({ from, text });
    expect(typeof message.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate the correct location object', () => {
    const from = 'Adam';
    const latitude = 5;
    const longitude = 10;
    const message = generateLocationMessage( from, latitude, longitude );

    expect(message).toMatchObject({
      from,
      url: `https://www.google.com/maps?q=${latitude},${longitude}`
    });
    expect(typeof message.createdAt).toBe('number');
  });
});
