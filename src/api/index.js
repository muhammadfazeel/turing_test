import { Router } from 'express';
import repo from './routes/repo.js';
// this is the single entry point for loading all the routes
export default () => {
	const app = Router();

	repo(app);

	return app
}