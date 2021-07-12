import { renderPropArray, createDefaultContext} from '../../src/type-renderer';
import { expect } from '@oclif/test';

describe('A renderPropArray function', () => {

  it('can evaluate a "Array" of "Link" with no validations', () => {
    const field = JSON.parse(`
      {
        "id": "components",
        "name": "Components",
        "type": "Array",
        "localized": false,
        "required": true,
        "validations": [],
        "disabled": false,
        "omitted": false,
        "items": {
          "type": "Link",
          "validations": [],
          "linkType": "Entry"
        }
      }
      `);

    expect(renderPropArray(field, createDefaultContext())).to.equal('Contentful.Entry<Record<string, any>>[]');
  });

  it('can evaluate an "Array" of "Symbol"', () => {
    const field = JSON.parse(`
        {
          "id": "tags",
          "name": "Tags (optional)",
          "type": "Array",
          "localized": false,
          "required": false,
          "validations": [
          ],
          "disabled": false,
          "omitted": false,
          "items": {
            "type": "Symbol",
            "validations": [
            ]
          }
        }
        `);

    expect(renderPropArray(field, createDefaultContext())).to.equal('Contentful.EntryFields.Symbol[]');
  });

  it('can evaluate an "Array" of "Symbol" with "in" validation', () => {
    const field = JSON.parse(`
        {
          "id": "category",
          "name": "Category (optional)",
          "type": "Array",
          "localized": false,
          "required": false,
          "validations": [
          ],
          "disabled": false,
          "omitted": false,
          "items": {
            "type": "Symbol",
            "validations": [
              {
                "in": [
                  "Feature",
                  "Benefit",
                  "Tech spec",
                  "Other"
                ]
              }
            ]
          }
        }
        `);

    expect(renderPropArray(field, createDefaultContext())).to.equal('("Feature" | "Benefit" | "Tech spec" | "Other")[]');
  });

  it('can evaluate an "Array" of "Link" with "linkContentType" validation', () => {
    const field = JSON.parse(`
        {
          "id": "extraSections",
          "name": "Extra sections (optional)",
          "type": "Array",
          "localized": false,
          "required": false,
          "validations": [
          ],
          "disabled": false,
          "omitted": false,
          "items": {
            "type": "Link",
            "validations": [
              {
                "linkContentType": [
                  "componentCta",
                  "componentFaq",
                  "wrapperImage",
                  "wrapperVideo"
                ]
              }
            ],
            "linkType": "Entry"
          }
        }
        `);

    expect(renderPropArray(field, createDefaultContext())).to.equal('Contentful.Entry<TypeComponentCtaFields | TypeComponentFaqFields | TypeWrapperImageFields | TypeWrapperVideoFields>[]');
  });
});
