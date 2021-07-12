import {renderRichText, renderPropLink, renderPropArray, renderPropAny} from '.';
import {FieldRenderers} from './render-types';

export const defaultRenderers: FieldRenderers = {
    RichText: renderRichText,
    Link: renderPropLink,
    Array: renderPropArray,
    Text: renderPropAny,
    Symbol: renderPropAny,
    Object: renderPropAny,
    Date: renderPropAny,
    Number: renderPropAny,
    Integer: renderPropAny,
    Boolean: renderPropAny,
    Location: renderPropAny,
};
