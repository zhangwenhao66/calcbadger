export async function resolve(specifier, context, nextResolve) {
	try {
		return await nextResolve(specifier, context);
	} catch (err) {
		const isRelative = specifier.startsWith('.') || specifier.startsWith('/');
		if (err?.code === 'ERR_MODULE_NOT_FOUND' && isRelative && !specifier.endsWith('.ts')) {
			return nextResolve(`${specifier}.ts`, context);
		}
		throw err;
	}
}
