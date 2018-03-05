async function start () {

	const moduleLoad = global.ElectronAPI
		? import('./ui/electron')
		: import('./ui/terminal');

	try {
		const {default: factory} = await moduleLoad;

		factory();
	} catch (e) {
		console.log('There was an error starting the UI:\n\n', e.stack);
		process.exit(1);
	}
}

start();
