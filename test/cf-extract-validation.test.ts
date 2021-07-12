import { expect } from "@oclif/test";
import { linkContentTypeValidations } from "../src/cf-extract-validation";

describe('A linkContentTypeValidations function', () => {
    it('parses empty validations', () => {
        const field = { validations: [] }
        expect(linkContentTypeValidations(field)).to.eql([])
    })

    it('parses empty linked content type', () => {
        const field = { validations: [{ linkContentType: [] }] }
        expect(linkContentTypeValidations(field)).to.eql([])
    })

    it('parses single linked content type', () => {
        const field = { validations: [{ linkContentType: ["topicCategory"] }] }
        expect(linkContentTypeValidations(field)).to.eql(['topicCategory'])
    })

    it('parses multiple linked content types', () => {
        const field = { validations: [{ linkContentType: ['topicA', 'topicB'] }] }
        expect(linkContentTypeValidations(field)).to.eql(['topicA', 'topicB'])
    })
})
