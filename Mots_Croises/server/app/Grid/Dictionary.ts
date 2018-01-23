// Adapted from https://www.dustinhorne.com/post/2016/06/09/implementing-a-dictionary-in-typescript

import { IDictionary } from "./IDictionary";

export class Dictionary<ValueType> implements IDictionary<ValueType> {

    private items: { [index: string]: ValueType } = {};
    private noItems: number = 0;

    public containsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    public count(): number {
        return this.noItems;
    }

    public add(key: string, value: ValueType): void {
        if (!this.items.hasOwnProperty(key)) {
             this.noItems++;
        }

        this.items[key] = value;
    }

    public remove(key: string): ValueType {
        const val: ValueType = this.items[key];
        delete this.items[key];
        this.noItems--;

        return val;
    }

    public getValue(key: string): ValueType {
        return this.items[key];
    }

    public getKeys(): string[] {
        const keySet: string[] = [];

        for (const prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }

        return keySet;
    }

    public getValues(): ValueType[] {
        const values: ValueType[] = [];

        for (const prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }

        return values;
    }
}
