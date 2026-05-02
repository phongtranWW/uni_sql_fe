import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialTemplateSliceState } from "./state";
import { fetchTemplate, fetchTemplates } from "./thunks";
import type { Template, TemplateSummaryPage } from "./schemas";

const templateSlice = createSlice({
  name: "template",
  initialState: initialTemplateSliceState,
  reducers: {
    clearSummaryTemplateError(state) {
      state.summaryTemplate.error = null;
    },
    clearTemplateError(state) {
      state.template.error = null;
    },
    clearTemplate(state) {
      state.template.data = null;
      state.template.status = "idle";
      state.template.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchTemplates
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.summaryTemplate.status = "loading";
        state.summaryTemplate.error = null;
      })
      .addCase(
        fetchTemplates.fulfilled,
        (state, action: PayloadAction<TemplateSummaryPage>) => {
          state.summaryTemplate.status = "succeeded";
          state.summaryTemplate.data = action.payload;
          state.summaryTemplate.error = null;
        },
      )
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.summaryTemplate.status = "failed";
        state.summaryTemplate.error = action.payload || "Failed to load templates";
      });

    // fetchTemplate
    builder
      .addCase(fetchTemplate.pending, (state) => {
        state.template.status = "loading";
        state.template.error = null;
      })
      .addCase(
        fetchTemplate.fulfilled,
        (state, action: PayloadAction<Template>) => {
          state.template.status = "succeeded";
          state.template.data = action.payload;
          state.template.error = null;
        },
      )
      .addCase(fetchTemplate.rejected, (state, action) => {
        state.template.status = "failed";
        state.template.error = action.payload || "Failed to load template";
      });
  },
});

export const {
  clearSummaryTemplateError,
  clearTemplateError,
  clearTemplate,
} = templateSlice.actions;

export default templateSlice.reducer;
