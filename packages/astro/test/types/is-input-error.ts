import { expectTypeOf } from 'expect-type';
import { isInputError, defineAction } from '../../dist/actions/runtime/virtual/server.js';
import { z } from '../../zod.mjs';
import { describe, it } from 'node:test';

const exampleAction = defineAction({
	input: z.object({
		name: z.string(),
	}),
	handler: () => {},
});

const result = await exampleAction.safe({ name: 'Alice' });

describe('isInputError', () => {
	it('isInputError narrows unknown error types', async () => {
		try {
			await exampleAction({ name: 'Alice' });
		} catch (e) {
			if (isInputError(e)) {
				expectTypeOf(e.fields).toEqualTypeOf<Record<string, string[] | undefined>>();
			}
		}
	});

	it('`isInputError` preserves `fields` object type for ActionError objects', async () => {
		if (isInputError(result.error)) {
			expectTypeOf(result.error.fields).toEqualTypeOf<{ name?: string[] }>();
		}
	});
});