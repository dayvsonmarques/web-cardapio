import { resolveDistanceResult } from '@/lib/googleMaps';

const googleOkPayload = {
  status: 'OK',
  rows: [
    {
      elements: [
        {
          status: 'OK',
          distance: { text: '12,3 km', value: 12300 },
          duration: { text: '25 min', value: 1500 },
        },
      ],
    },
  ],
};

const requestDeniedPayload = {
  status: 'REQUEST_DENIED',
  error_message: 'You must enable Billing on the Google Cloud Project',
  rows: [],
};

const fakeFetch = (payload: unknown, ok = true, status = 200) =>
  jest.fn().mockResolvedValue({
    ok,
    status,
    json: async () => payload,
  }) as unknown as typeof fetch;

describe('resolveDistanceResult', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the real distance when Google responds OK', async () => {
    const result = await resolveDistanceResult('52070290', '01310100', {
      apiKey: 'AIza-real-key',
      fetchImpl: fakeFetch(googleOkPayload),
    });

    expect(result).toEqual({
      distanceKm: 12.3,
      distanceText: '12,3 km',
      durationText: '25 min',
      durationMinutes: 25,
    });
  });

  it('falls back to a simulated distance when Google returns REQUEST_DENIED', async () => {
    const result = await resolveDistanceResult('52070290', '01310100', {
      apiKey: 'AIza-real-key',
      fetchImpl: fakeFetch(requestDeniedPayload),
    });

    expect(typeof result.distanceKm).toBe('number');
    expect(result.distanceKm).toBeGreaterThan(0);
    expect(result.distanceText).toBe(`${result.distanceKm} km`);
  });

  it('falls back to a simulated distance when the network request throws', async () => {
    const result = await resolveDistanceResult('52070290', '01310100', {
      apiKey: 'AIza-real-key',
      fetchImpl: jest.fn().mockRejectedValue(new Error('network down')) as unknown as typeof fetch,
    });

    expect(result.distanceKm).toBeGreaterThan(0);
  });

  it('falls back to a simulated distance when Google responds with non-OK HTTP', async () => {
    const result = await resolveDistanceResult('52070290', '01310100', {
      apiKey: 'AIza-real-key',
      fetchImpl: fakeFetch({}, false, 403),
    });

    expect(result.distanceKm).toBeGreaterThan(0);
  });

  it('uses the simulated distance without calling fetch when no API key is set', async () => {
    const fetchImpl = fakeFetch(googleOkPayload);

    const result = await resolveDistanceResult('52070290', '01310100', {
      apiKey: '',
      fetchImpl,
    });

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(result.distanceKm).toBeGreaterThan(0);
  });

  it('treats the placeholder key as "not configured"', async () => {
    const fetchImpl = fakeFetch(googleOkPayload);

    await resolveDistanceResult('52070290', '01310100', {
      apiKey: 'your_api_key_here',
      fetchImpl,
    });

    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
