import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers'

const prisma = new Prisma({
	typeDefs: 'graphql-prisma/src/generated/prisma.graphql',
	endpoint: 'http://localhost:4466',
	secret: 'testsecret',
	fragmentReplacements,
});

export { prisma as default };
