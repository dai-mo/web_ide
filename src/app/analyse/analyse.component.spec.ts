/**
 * Created by cmathew on 20/07/16.
 */
import { FlowTemplate } from "./model/flow.model"

describe("FlowTemplate", () => {
  it("has id", () => {
    const ft: FlowTemplate = {
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
