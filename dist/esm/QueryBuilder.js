import extractKeyValue from '@tsdotnet/key-value-pair';
import OrderedRegistry from '@tsdotnet/ordered-registry';
import type from '@tsdotnet/type';
import { parse, encode } from './query.js';

/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
class QueryBuilder extends OrderedRegistry {
    constructor(query, decodeValues = true) {
        super();
        this.importQuery(query, decodeValues);
    }
    static init(query, decodeValues = true) {
        return new QueryBuilder(query, decodeValues);
    }
    importQuery(query, decodeValues = true) {
        if (typeof query === 'string') {
            this.importFromString(query, decodeValues);
        }
        else if (type.isIterable(query)) {
            for (const entry of query) {
                extractKeyValue(entry, (key, value) => { this.import(key, value); });
            }
        }
        else {
            this.importValues(query);
        }
        return this;
    }
    importSingle(key, value) {
        if (this.has(key)) {
            const prev = this.get(key);
            if (prev instanceof Array)
                prev.push(value);
            else {
                this.set(key, [prev, value]);
            }
        }
        else
            this.set(key, value);
        return this;
    }
    import(key, value) {
        if (value instanceof Array) {
            for (const v of value)
                this.importSingle(key, v);
        }
        else {
            this.importSingle(key, value);
        }
        return this;
    }
    importValues(values) {
        for (const key of Object.keys(values)) {
            this.import(key, values[key]);
        }
        return this;
    }
    importFromString(values, deserialize = true, decodeValues = true) {
        parse(values, (key, value) => { this.importSingle(key, value); }, deserialize, decodeValues);
        return this;
    }
    encode(prefixIfNotEmpty) {
        return encode(this, prefixIfNotEmpty);
    }
    toString() {
        return this.encode();
    }
}

export { QueryBuilder as default };
//# sourceMappingURL=QueryBuilder.js.map
