import { renderProp } from '../src/renderer/cf-render-prop';
import {expect} from '@oclif/test';

describe('A renderProp function', () => {
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

        expect(renderProp(field)).to.equal('Contentful.EntryFields.Symbol');
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

        expect(renderProp(field)).to.equal('"Left-aligned" | "Center-aligned"');
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

      expect(renderProp(field)).to.equal('Contentful.EntryFields.Symbol');
    });

    it('can evaluate a "Link" type', () => {
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

        expect(renderProp(field)).to.equal('Contentful.Entry<TypeTopicCategoryFields>');
    });

    it('can evaluate a "Link" type with no validations', () => {
      const field = JSON.parse(`
      {
        "id": "components",
        "name": "Components",
        "type": "Link",
        "localized": false,
        "required": true,
        "validations": [],
        "disabled": false,
        "omitted": false,
        "linkType": "Entry"
      }
      `);

      expect(renderProp(field)).to.equal('Contentful.Entry<Record<string, any>>');
    });

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

      expect(renderProp(field)).to.equal('Contentful.Entry<Record<string, any>>[]');
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

        expect(renderProp(field)).to.equal('Contentful.EntryFields.Symbol[]');
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

        expect(renderProp(field)).to.equal('("Feature" | "Benefit" | "Tech spec" | "Other")[]');
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

        expect(renderProp(field)).to.equal('Contentful.Entry<TypeComponentCtaFields | TypeComponentFaqFields | TypeWrapperImageFields | TypeWrapperVideoFields>[]');
    });

    it('can evaluate a "RichText" type', () => {
      const field = JSON.parse(`
      {
        "id": "text",
        "name": "Text",
        "type": "RichText",
        "localized": false,
        "required": false,
        "validations": [
        ],
        "disabled": false,
        "omitted": false
      }
      `);

      expect(renderProp(field)).to.equal('Contentful.EntryFields.RichText');
  });
});
