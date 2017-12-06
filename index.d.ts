/// <reference types="cheerio" />
/// <reference types="node" />
import * as stream from 'stream';
export declare type Transformer = ($: CheerioStatic) => Promise<void>;
export declare function transform(...args: Transformer[]): stream.Transform;
export default transform;
