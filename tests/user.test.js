import request from 'supertest';
import mongoose from 'mongoose';
import userRoutes from '../routes/userRoutes.js';

import app from '../server.js';
import supertest from 'supertest';

import User from '../models/userModel.js';
import { expect } from '@jest/globals';

afterAll(() => mongoose.disconnect());

test('POST /api/users', async () => {
	const user = {
		name: 'Saint',
		email: 'saint@email.com',
		password: '123456',
	};

	const userExists = await User.findOne({ email: user.email });

	const res = await request(app).post('/api/users').send(user);

	if (userExists) {
		expect(res.statusCode).toBe(400);
	} else {
		expect(res.statusCode).toBe(200);
		expect(res.body.name).toBe(user.name);
		expect(res.body.email).toBe(user.email);
	}
});

test('POST /api/users/login', async () => {
	const user = {
		email: 'saint@email.com',
		password: '123456',
	};

	const res = await request(app).post('/api/users/login').send(user);

	expect(res.statusCode).toBe(200);
	expect(res.body.email).toBe(user.email);
});

test('POST /api/users/reset', async () => {
	const user = {
		email: 'saint@email.com',
	};

	const res = await request(app).post('/api/users/reset').send(user);

	expect(res.statusCode).toBe(200);
	expect(res.body).toContain('Password reset link sent');
});
