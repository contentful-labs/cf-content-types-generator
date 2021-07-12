import {renderTypeLiteral, renderTypeUnion} from '../renderer';
import {Field} from 'contentful';

export const renderPropAny = (field: Field): string => {
    if (field.validations?.length > 0) {
        const includesValidation = field.validations.find(validation => validation.in);
        if (includesValidation && includesValidation.in) {
            const mapper = (): (value: string) => string => {
                if (
                    field.type === 'Symbol' ||
                    field.type === 'Text' ||
                    field.type === 'RichText'
                ) {
                    return renderTypeLiteral;
                }
                return (value: string) => value.toString();
            };
            return renderTypeUnion(includesValidation.in.map(type => mapper()(type)));
        }
    }

    return `Contentful.EntryFields.${field.type}`;
};
