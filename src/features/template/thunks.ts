import { createAppThunk } from "@/app/thunks";
import { templateService } from "./service";
import type {
  GetTemplatesQueryParams,
  Template,
  TemplateSummaryPage,
} from "./schemas";

export const fetchTemplates = createAppThunk<
  TemplateSummaryPage,
  GetTemplatesQueryParams | undefined
>("template/fetchTemplates", async (params) => {
  return await templateService.getTemplates(params);
});

export const fetchTemplate = createAppThunk<Template, string>(
  "template/fetchTemplate",
  async (id) => {
    return await templateService.getTemplate(id);
  },
);
