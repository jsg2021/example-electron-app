import path from 'path';
import url from 'url';

export const USER = process.env.HOME;

export const dirname = path.resolve(path.dirname(url.parse(import.meta.url).pathname));
