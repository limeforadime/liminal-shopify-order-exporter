/**
 * Combine all routers here
 */

// import combineRouters from 'koa-combine-routers';
import combineRouters from 'koa-combine-routers';
import templateRoute  from'./templateRoute';

const userRoutes = combineRouters(templateRoute);

export default userRoutes;
