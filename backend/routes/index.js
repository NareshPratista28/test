import express from "express";
import user_routes from './user.js';

const route = express();
route.use(user_routes);

export default route
