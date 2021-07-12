import {upperFirst} from 'lodash';
import {pipe} from 'lodash/fp';

export const moduleName = (name: string): string => {
    const removeSpace = (input: string): string => input.replace(/\s/g, '');
    const replaceDash = (input: string): string => input.replace(/-/g, '__');
    const addPrefix = (input: string): string => input.startsWith('Type') ? input : `Type${input}`;
    return pipe([replaceDash, upperFirst, addPrefix, removeSpace])(name);
};

export const moduleFieldsName = (name: string): string => {
    return moduleName(name) + 'Fields';
};
