import type { TemplateSummaryPage, Template } from "./schemas";

export interface TemplateSliceState {
  summaryTemplate: {
    data: TemplateSummaryPage | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
  template: {
    data: Template | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
}

export const initialTemplateSliceState: TemplateSliceState = {
  summaryTemplate: {
    data: null,
    status: "idle",
    error: null,
  },
  template: {
    data: null,
    status: "idle",
    error: null,
  },
};
