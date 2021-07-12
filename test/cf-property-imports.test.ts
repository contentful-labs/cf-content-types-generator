import {expect} from '@oclif/test';
import {propertyImports} from '../src/cf-property-imports';
import { createDefaultContext } from '../src/type-renderer';

describe('A typeImports function', () => {
    it('returns imports for referenced Entry', () => {
        const field = JSON.parse(`
        {
          "id": "category",
          "name": "Category",
          "type": "Link",
          "localized": false,
          "required": true,
          "validations": [
            {
              "linkContentType": [
                "topicCategory"
              ]
            }
          ],
          "disabled": false,
          "omitted": false,
          "linkType": "Entry"
        }
        `);
        expect(propertyImports(field, createDefaultContext())).to.eql([{
            moduleSpecifier: './TypeTopicCategory',
            namedImports: ['TypeTopicCategoryFields'],
        }]);
    });

    it('returns empty for symbol field', () => {
        const field = JSON.parse(`
        {
          "id": "internalName",
          "name": "Internal name",
          "type": "Symbol",
          "localized": false,
          "required": false,
          "validations": [
          ],
          "disabled": false,
          "omitted": false
        }
        `);
        expect(propertyImports(field, createDefaultContext())).to.eql([]);
    });
    it('returns imports for referenced Entry without validations', () => {
        const field = JSON.parse(`
        {
          "id": "category",
          "name": "Category",
          "type": "Link",
          "localized": false,
          "required": true,
          "validations": [],
          "disabled": false,
          "omitted": false,
          "linkType": "Entry"
        }
        `);
        expect(propertyImports(field, createDefaultContext())).to.eql([{
            moduleSpecifier: './TypeCategory',
            namedImports: ['TypeCategoryFields'],
        }]);
    });
});
