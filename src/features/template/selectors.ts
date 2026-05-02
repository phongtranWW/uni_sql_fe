import type { RootState } from "@/app/store";

export const selectSummaryTemplate = (state: RootState) => state.template.summaryTemplate.data;
export const selectSummaryTemplateStatus = (state: RootState) => state.template.summaryTemplate.status;
export const selectSummaryTemplateError = (state: RootState) => state.template.summaryTemplate.error;

export const selectTemplate = (state: RootState) => state.template.template.data;
export const selectTemplateStatus = (state: RootState) => state.template.template.status;
export const selectTemplateError = (state: RootState) => state.template.template.error;
