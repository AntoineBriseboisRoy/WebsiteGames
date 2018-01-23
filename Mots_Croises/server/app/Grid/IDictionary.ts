// Adapted from https://www.dustinhorne.com/post/2016/06/09/implementing-a-dictionary-in-typescript

export interface IDictionary<ValueType> {

    add(key: string, value: ValueType): void;
    containsKey(key: string): boolean;
    count(): number;
    getValue(key: string): ValueType;
    getKeys(): string[];
    getValues(): ValueType[];
}
