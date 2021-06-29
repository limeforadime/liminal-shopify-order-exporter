/**
 * Combine all routers here
 */

// import combineRouters from 'koa-combine-routers';
const combineRouters = require('koa-combine-routers');

const templateRoute = require('./templateRoute');

const userRoutes = combineRouters(templateRoute);

module.exports = userRoutes;
