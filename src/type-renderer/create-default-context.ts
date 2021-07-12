import {FieldType} from 'contentful';
import {defaultRenderers, FieldRenderer, RenderContext} from '.';
import {moduleFieldsName, moduleName} from '../cf-module-name';

export const createDefaultContext = (): RenderContext => {
    return {
        moduleName,
        moduleFieldsName,
        getFieldRenderer: <FType extends FieldType>(fieldType: FType) => defaultRenderers[fieldType] as FieldRenderer<FType>,
        imports: new Set(),
    };
};
