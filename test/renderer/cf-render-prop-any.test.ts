import { renderPropAny } from '../../src/type-renderer';
import {expect} from '@oclif/test';

describe('A renderPropAny function', () => {
    it('can evaluate a "Symbol" type', () => {
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

        expect(renderPropAny(field)).to.equal('Contentful.EntryFields.Symbol');
    });

    it('can evaluate a "Symbol" type with "in" validation', () => {
        const field = JSON.parse(`
        {
          "id": "headerAlignment",
          "name": "Header alignment",
          "type": "Symbol",
          "localized": false,
          "required": false,
          "validations": [
            {
              "in": [
                "Left-aligned",
                "Center-aligned"
              ]
            }
          ],
          "disabled": false,
          "omitted": false
        }
        `);

        expect(renderPropAny(field)).to.equal('"Left-aligned" | "Center-aligned"');
    });

    it('can evaluate a "Symbol" type with missing validations', () => {
      const field = JSON.parse(`
      {
        "id": "internalName",
        "name": "Internal name",
        "type": "Symbol",
        "localized": false,
        "required": false,
        "disabled": false,
        "omitted": false
      }
      `);

      expect(renderPropAny(field)).to.equal('Contentful.EntryFields.Symbol');
    });

});
