import inStyle from './index';

describe('lib/index', () => {
  it('should throw an error if an undefined state is requested.', () => {
    expect(
      () => inStyle({ color: 'red' }, 'active')
    ).toThrow(`State 'active' is not defined.`);
  });

  it('should return default styles', () => {
    const expected = { color: '#000000' };
    const result = inStyle({ color: '#000000' });
    expect(result).toEqual(expected);
  });

  it('should return overrides for current state.', () => {
    const expected = { color: '#BBBBBB', height: '20em', width: '20em' };
    const config = {
      color: '#FFFFFF',
      width: '20em',
      _states: {
        active: { color: '#BBBBBB', height: '20em' },
      },
    };
    const result = inStyle(config, 'active');
    expect(result).toEqual(expected);
  });
});
