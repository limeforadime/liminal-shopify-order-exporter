import Shopify from '@shopify/shopify-api';
import verifySessionActive from './verifySessionActive';
import logger from 'npmlog';

jest.mock('npmlog');
jest.mock('@shopify/shopify-api');
let next;
let ctx;
let session;

beforeAll(() => {
  logger.info.mockReturnValue(true);
  Shopify.Utils.loadCurrentSession.mockReturnValue(true);
  next = jest.fn(() => Promise.resolve());
  ctx = {
    body: { message: '' },
    req: null,
    res: null,
    throw: () => null,
  };
  session = { accessToken: 'asdfasdf', expires: '2022-11-19T11:44:10.242Z', scope: 'asdfasdf' };
});

describe('verifySessionActive tests', () => {
  it('verifySessionActive should be called with mocked values without failing', async () => {
    Shopify.Utils.loadCurrentSession.mockReturnValue(session);
    Shopify.Context.SCOPES.equals.mockReturnValue(true);
    await verifySessionActive()(ctx, next);
    expect(ctx.body.message).toMatch('');
  });

  it('When session expired, should return ctx.body message that says such', async () => {
    session = { ...session, expires: '2000-11-19T11:44:10.242Z' };
    Shopify.Utils.loadCurrentSession.mockReturnValue(session);
    Shopify.Context.SCOPES.equals.mockReturnValue(true);
    await verifySessionActive()(ctx, next);
    expect(ctx.body.message).toMatch('session not active');
  });
});
