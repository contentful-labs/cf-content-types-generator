import {FieldItem, FieldValidation} from 'contentful';

type WithValidations = Pick<FieldItem, 'validations'>;

const validation = (node: WithValidations, field: keyof FieldValidation): any => {
    if (node.validations && node.validations.length !== 0) {
        const linkContentValidation = node.validations.find(value => value[field]);
        if (linkContentValidation) {
            return linkContentValidation[field] || [];
        }
    }
    return [];
};

export const linkContentTypeValidations = (node: WithValidations): string[] => {
    return validation(node, 'linkContentType');
};

export const inValidations = (node: WithValidations): string[] => {
    return validation(node, 'in');
};
