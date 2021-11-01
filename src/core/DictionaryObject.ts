
namespace Vgx {

	export class DictionaryObject<TKey extends any, TValue extends any> 
		implements Iterable<KeyValuePair<TKey, TValue>>
	{
		public static fromObject(obj: DynamicObject) {
			const result = new DictionaryObject<string | symbol, any>();
			for (const k of Reflect.ownKeys(obj)) {
				result.set(k, Reflect.get(obj, k))
			}
			return result;
		}

		private _keys: TKey[]; 
		private _values: TValue[];

		constructor() {
			this._keys = [];
			this._values = [];
		}


		public get count() {
			return this._keys.length;
		}

		public get first() {
			if (this._values.length == 0) {
				return undefined;
			}
			return this._values[0];
		}

		public get last() {
			if (this._values.length == 0) {
				return undefined;
			}
			return this._values[this._values.length - 1];
		}


		public containsKey(key: TKey) {
			return this._keys.indexOf(key) >= 0;
		}

		public remove(key: TKey) {
			const index = this._keys.indexOf(key);
			if (index < 0) {
				return false;
			}
			this._keys.splice(index, 1);
			this._values.splice(index, 1);
			return true;
		}

		public get(key: TKey) {
			const index = this._keys.indexOf(key);
			if (index < 0) {
				return undefined;
			}
			return this._values[index];
		}

		public set(key: TKey, value: TValue) {
			const index = this._keys.indexOf(key);
			if (index < 0) {
				this._keys.push(key);
				this._values.push(value);
			}
			else {
				this._values[index] = value;
			}
		}

		*[Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>, any, undefined> {
			let i = 0;
			while(i != this._keys.length) {
				yield { 
					key: this._keys[i],
					value: this._values[i]	
				};
				i++;
			}
		}
	}
}