import jwt from 'jsonwebtoken';

export default (userId) => jwt.sign(
	{ userId },
	'thesecret',
	{
		expiresIn: '7 days'
	},
);
