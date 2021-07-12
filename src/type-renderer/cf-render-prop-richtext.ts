import {Field} from 'contentful';
import {renderTypeUnion} from '../renderer';
import {RenderContext} from './render-types';

export const renderRichText = (field: Field, context: RenderContext): string => {
    context.imports.add({
        moduleSpecifier: '@contentful/rich-text-types',
        namespaceImport: 'CFRichTextTypes',
    });
    return renderTypeUnion(['CFRichTextTypes.Block', 'CFRichTextTypes.Inline']);
};
