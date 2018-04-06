/**
 * Created by cmathew on 20/07/16.
 */
import {FlowTemplate} from "./flow.model"

describe("FlowTemplate", () => {
    it("has id", () => {
        let ft: FlowTemplate = {
            id: "12",
            name: "name",
            description: "description",
            uri: "uri",
            date: "timestamp"
        }
        expect(ft.id).toEqual("12")
        expect(ft.id).toEqual("12")
    })
})