import {Field} from 'contentful';
import {inValidations} from '../cf-extract-validation';
import {renderTypeArray, renderTypeLiteral, renderTypeUnion} from '../renderer';
import {RenderContext} from './render-types';

export const renderPropArray = (field: Field, context: RenderContext): string => {
    if (!field.items) {
        throw new Error(`missing items for ${field.id}`);
    }

    if (field.items.type === 'Link') {
        return renderTypeArray(context.getFieldRenderer('Link')(field.items, context));
    }

    if (field.items.type === 'Symbol') {
        const validation = inValidations(field.items);

        if (validation?.length > 0) {
            return renderTypeArray(`(${renderTypeUnion(validation.map((val: string) => renderTypeLiteral(val)))})`);
        }
        return renderTypeArray('Contentful.EntryFields.Symbol');
    }

    throw new Error('unhandled array type "' + field.items.type + '"');
};
