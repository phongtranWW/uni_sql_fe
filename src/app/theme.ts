// Theme configuration cho Ant Design với màu xanh đậm và cam
// Hỗ trợ cả Light và Dark mode

const themeConfig = {
  // ==================== LIGHT MODE ====================
  light: {
    token: {
      // Màu chính
      colorPrimary: "#0a4d68", // Xanh đậm chủ đạo
      colorSuccess: "#52c41a",
      colorWarning: "#ff8c00", // Cam chủ đạo
      colorError: "#ff4d4f",
      colorInfo: "#1890ff",

      // Màu text
      colorText: "#2c3e50",
      colorTextSecondary: "#5a6c7d",
      colorTextTertiary: "#8896a4",
      colorTextQuaternary: "#bfcbd9",

      // Màu background
      colorBgContainer: "#ffffff",
      colorBgElevated: "#ffffff",
      colorBgLayout: "#f5f7fa",
      colorBgSpotlight: "#f0f2f5",
      colorBgMask: "rgba(0, 0, 0, 0.45)",

      // Màu border
      colorBorder: "#d9e2ec",
      colorBorderSecondary: "#e8f0f7",

      // Font
      fontSize: 14,
      fontSizeHeading1: 38,
      fontSizeHeading2: 30,
      fontSizeHeading3: 24,
      fontSizeHeading4: 20,
      fontSizeHeading5: 16,
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",

      // Border radius
      borderRadius: 8,
      borderRadiusLG: 12,
      borderRadiusSM: 6,
      borderRadiusXS: 4,

      // Shadow
      boxShadow: "0 2px 8px rgba(10, 77, 104, 0.08)",
      boxShadowSecondary: "0 4px 16px rgba(10, 77, 104, 0.12)",

      // Spacing
      margin: 16,
      marginLG: 24,
      marginMD: 16,
      marginSM: 12,
      marginXS: 8,
      marginXXS: 4,

      padding: 16,
      paddingLG: 24,
      paddingMD: 16,
      paddingSM: 12,
      paddingXS: 8,
      paddingXXS: 4,

      // Line height
      lineHeight: 1.5715,
      lineHeightHeading1: 1.21,
      lineHeightHeading2: 1.27,
      lineHeightHeading3: 1.33,
      lineHeightHeading4: 1.4,
      lineHeightHeading5: 1.5,

      // Control (Input, Select, Button...)
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      controlHeightXS: 24,

      // Motion
      motionUnit: 0.1,
      motionBase: 0,
      motionEaseInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
      motionEaseOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      motionEaseIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",

      // Z-index
      zIndexBase: 0,
      zIndexPopupBase: 1000,
    },

    // Component-specific customization
    components: {
      Button: {
        colorPrimary: "#0a4d68",
        colorPrimaryHover: "#0d6386",
        colorPrimaryActive: "#083d52",
        algorithm: true,
        primaryShadow: "0 2px 0 rgba(10, 77, 104, 0.1)",
        defaultBorderColor: "#d9e2ec",
        defaultColor: "#2c3e50",
        defaultBg: "#ffffff",
        defaultHoverBg: "#f5f7fa",
        defaultHoverColor: "#0a4d68",
        defaultHoverBorderColor: "#0a4d68",
        fontWeight: 500,
        controlHeight: 36,
        controlHeightLG: 44,
        controlHeightSM: 28,
      },

      Menu: {
        // Menu chung
        itemBg: "transparent",
        itemColor: "#5a6c7d",
        itemHoverColor: "#0a4d68",
        itemHoverBg: "#f0f8fb",
        itemSelectedColor: "#0a4d68",
        itemSelectedBg: "#e8f4f8",
        itemActiveBg: "#d4eaf3",

        // SubMenu
        subMenuItemBg: "#fafbfc",
        popupBg: "#ffffff",

        // Menu trên Sider trắng (Light Sider)
        itemBorderRadius: 6,
        itemMarginInline: 8,
        itemMarginBlock: 4,
        itemPaddingInline: 16,
        itemHeight: 40,

        // Icon
        iconSize: 18,
        iconMarginInlineEnd: 12,
        collapsedIconSize: 20,
        collapsedWidth: 80,

        // Group
        groupTitleColor: "#8896a4",
        groupTitleFontSize: 12,

        // Divider
        itemBorderWidth: 0,

        // Menu tối (khi Sider tối)
        darkItemBg: "#0a4d68",
        darkItemColor: "#ffffff",
        darkItemHoverBg: "rgba(255, 255, 255, 0.1)",
        darkItemHoverColor: "#ffffff",
        darkItemSelectedBg: "#ff8c00",
        darkItemSelectedColor: "#ffffff",
        darkSubMenuItemBg: "rgba(0, 0, 0, 0.1)",
        darkPopupBg: "#083d52",
      },

      Layout: {
        // Header
        headerBg: "#fafbfc",
        headerHeight: 64,
        headerPadding: "0 24px",
        headerColor: "#2c3e50",

        // Sider
        siderBg: "#ffffff",
        lightSiderBg: "#ffffff",
        lightTriggerBg: "#f5f7fa",
        lightTriggerColor: "#0a4d68",
        triggerBg: "#f5f7fa",
        triggerColor: "#0a4d68",
        triggerHeight: 48,
        zeroTriggerWidth: 36,
        zeroTriggerHeight: 42,

        // Body/Content
        bodyBg: "#f0f2f5",

        // Footer
        footerBg: "#fafbfc",
        footerPadding: "24px 50px",

        // Collapsed Sider
        collapsedWidth: 80,
      },

      Table: {
        headerBg: "#fafbfc",
        headerColor: "#2c3e50",
        headerSortActiveBg: "#e8f4f8",
        headerSortHoverBg: "#f0f8fb",
        bodySortBg: "#fafbfc",
        rowHoverBg: "#f5f9fc",
        rowSelectedBg: "#e8f4f8",
        rowSelectedHoverBg: "#d4eaf3",
        borderColor: "#e8f0f7",
        headerBorderRadius: 8,
      },

      Card: {
        colorBgContainer: "#ffffff",
        colorBorderSecondary: "#e8f0f7",
        borderRadiusLG: 12,
        boxShadowTertiary: "0 2px 8px rgba(10, 77, 104, 0.08)",
        headerBg: "transparent",
        headerFontSize: 16,
        headerFontSizeSM: 14,
        headerHeight: 56,
        headerHeightSM: 48,
      },

      Input: {
        colorBgContainer: "#ffffff",
        colorBorder: "#d9e2ec",
        colorText: "#2c3e50",
        colorTextPlaceholder: "#8896a4",
        hoverBorderColor: "#0a4d68",
        activeBorderColor: "#0a4d68",
        activeShadow: "0 0 0 2px rgba(10, 77, 104, 0.1)",
        errorActiveShadow: "0 0 0 2px rgba(255, 77, 79, 0.1)",
        warningActiveShadow: "0 0 0 2px rgba(255, 140, 0, 0.1)",
      },

      Select: {
        colorBgContainer: "#ffffff",
        colorBorder: "#d9e2ec",
        colorText: "#2c3e50",
        colorTextPlaceholder: "#8896a4",
        optionSelectedBg: "#e8f4f8",
        optionActiveBg: "#f5f9fc",
        optionSelectedColor: "#0a4d68",
        selectorBg: "#ffffff",
      },

      Modal: {
        contentBg: "#ffffff",
        headerBg: "#ffffff",
        titleColor: "#2c3e50",
        titleFontSize: 18,
        borderRadiusLG: 12,
        boxShadow:
          "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
      },

      Tabs: {
        itemColor: "#5a6c7d",
        itemHoverColor: "#0a4d68",
        itemSelectedColor: "#0a4d68",
        itemActiveColor: "#0a4d68",
        inkBarColor: "#0a4d68",
        cardBg: "#fafbfc",
        cardHeight: 44,
      },

      Tag: {
        defaultBg: "#f5f7fa",
        defaultColor: "#2c3e50",
      },

      Alert: {
        colorInfoBg: "#e8f4f8",
        colorInfoBorder: "#91d5ff",
        colorInfoText: "#0a4d68",
        colorWarningBg: "#fff7e6",
        colorWarningBorder: "#ffd591",
        colorWarningText: "#d46b08",
      },

      Badge: {
        colorPrimary: "#ff8c00",
        textFontSize: 12,
        textFontSizeSM: 10,
        textFontWeight: "normal",
      },

      Breadcrumb: {
        itemColor: "#5a6c7d",
        lastItemColor: "#2c3e50",
        linkColor: "#5a6c7d",
        linkHoverColor: "#0a4d68",
        separatorColor: "#8896a4",
        fontSize: 14,
      },

      Notification: {
        colorBgElevated: "#ffffff",
        colorText: "#2c3e50",
        colorTextHeading: "#2c3e50",
        colorIcon: "#0a4d68",
        colorIconHover: "#0d6386",
        borderRadiusLG: 12,
        boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.08)",
      },

      Progress: {
        defaultColor: "#0a4d68",
        remainingColor: "#e8f0f7",
        circleTextColor: "#2c3e50",
        lineBorderRadius: 100,
      },

      Steps: {
        colorPrimary: "#0a4d68",
        colorText: "#5a6c7d",
        colorTextDescription: "#8896a4",
        finishIconBorderColor: "#0a4d68",
        navArrowColor: "#0a4d68",
      },

      Switch: {
        colorPrimary: "#0a4d68",
        colorPrimaryHover: "#0d6386",
        colorTextQuaternary: "#bfcbd9",
        colorTextTertiary: "#8896a4",
      },

      Radio: {
        colorPrimary: "#0a4d68",
        buttonBg: "#ffffff",
        buttonCheckedBg: "#ffffff",
        buttonColor: "#5a6c7d",
        buttonCheckedBgDisabled: "#f5f7fa",
        buttonSolidCheckedColor: "#ffffff",
      },

      Checkbox: {
        colorPrimary: "#0a4d68",
        colorPrimaryHover: "#0d6386",
        colorBorder: "#d9e2ec",
        borderRadiusSM: 4,
      },

      Pagination: {
        itemBg: "#ffffff",
        itemActiveBg: "#0a4d68",
        itemActiveColorDisabled: "#8896a4",
        itemInputBg: "#ffffff",
        itemLinkBg: "#ffffff",
        itemDisabledBgActive: "#f5f7fa",
        itemDisabledColorActive: "#8896a4",
      },

      Tooltip: {
        colorBgSpotlight: "rgba(44, 62, 80, 0.92)",
        colorTextLightSolid: "#ffffff",
        borderRadius: 6,
      },

      Popover: {
        colorBgElevated: "#ffffff",
        colorText: "#2c3e50",
        borderRadiusLG: 8,
        boxShadowSecondary: "0 6px 16px 0 rgba(0, 0, 0, 0.08)",
      },

      Dropdown: {
        colorBgElevated: "#ffffff",
        colorText: "#2c3e50",
        controlItemBgHover: "#f5f9fc",
        controlItemBgActive: "#e8f4f8",
        borderRadiusLG: 8,
        boxShadowSecondary: "0 6px 16px 0 rgba(0, 0, 0, 0.08)",
      },
    },
  },

  // ==================== DARK MODE ====================
  dark: {
    algorithm: "dark",
    token: {
      // Màu chính
      colorPrimary: "#1a7fa6", // Xanh sáng hơn cho dark mode
      colorSuccess: "#52c41a",
      colorWarning: "#ffa940", // Cam sáng hơn cho dark mode
      colorError: "#ff7875",
      colorInfo: "#40a9ff",

      // Màu text
      colorText: "#e8f0f7",
      colorTextSecondary: "#b8c5d0",
      colorTextTertiary: "#8896a4",
      colorTextQuaternary: "#5a6c7d",

      // Màu background
      colorBgContainer: "#1f1f1f",
      colorBgElevated: "#2a2a2a",
      colorBgLayout: "#141414",
      colorBgSpotlight: "#262626",
      colorBgMask: "rgba(0, 0, 0, 0.65)",

      // Màu border
      colorBorder: "#3a3a3a",
      colorBorderSecondary: "#2a2a2a",

      // Font (giống light mode)
      fontSize: 14,
      fontSizeHeading1: 38,
      fontSizeHeading2: 30,
      fontSizeHeading3: 24,
      fontSizeHeading4: 20,
      fontSizeHeading5: 16,
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",

      // Border radius
      borderRadius: 8,
      borderRadiusLG: 12,
      borderRadiusSM: 6,
      borderRadiusXS: 4,

      // Shadow
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.45)",
      boxShadowSecondary: "0 4px 16px rgba(0, 0, 0, 0.55)",

      // Spacing (giống light mode)
      margin: 16,
      marginLG: 24,
      marginMD: 16,
      marginSM: 12,
      marginXS: 8,
      marginXXS: 4,

      padding: 16,
      paddingLG: 24,
      paddingMD: 16,
      paddingSM: 12,
      paddingXS: 8,
      paddingXXS: 4,

      // Line height
      lineHeight: 1.5715,
      lineHeightHeading1: 1.21,
      lineHeightHeading2: 1.27,
      lineHeightHeading3: 1.33,
      lineHeightHeading4: 1.4,
      lineHeightHeading5: 1.5,

      // Control
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      controlHeightXS: 24,

      // Motion
      motionUnit: 0.1,
      motionBase: 0,
      motionEaseInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
      motionEaseOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      motionEaseIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",

      // Z-index
      zIndexBase: 0,
      zIndexPopupBase: 1000,
    },

    components: {
      Button: {
        colorPrimary: "#1a7fa6",
        colorPrimaryHover: "#2ba0cc",
        colorPrimaryActive: "#156785",
        primaryShadow: "0 2px 0 rgba(26, 127, 166, 0.15)",
        defaultBorderColor: "#3a3a3a",
        defaultColor: "#e8f0f7",
        defaultBg: "#1f1f1f",
        defaultHoverBg: "#2a2a2a",
        defaultHoverColor: "#1a7fa6",
        defaultHoverBorderColor: "#1a7fa6",
        fontWeight: 500,
        controlHeight: 36,
        controlHeightLG: 44,
        controlHeightSM: 28,
      },

      Menu: {
        itemBg: "transparent",
        itemColor: "#b8c5d0",
        itemHoverColor: "#1a7fa6",
        itemHoverBg: "rgba(26, 127, 166, 0.15)",
        itemSelectedColor: "#1a7fa6",
        itemSelectedBg: "rgba(26, 127, 166, 0.25)",
        itemActiveBg: "rgba(26, 127, 166, 0.35)",
        subMenuItemBg: "#1a1a1a",
        darkItemBg: "#001529",
        darkItemColor: "#b8c5d0",
        darkItemHoverBg: "#1a7fa6",
        darkItemHoverColor: "#ffffff",
        darkItemSelectedBg: "#ffa940",
        darkItemSelectedColor: "#141414",
        iconSize: 16,
        iconMarginInlineEnd: 10,
        collapsedIconSize: 16,
      },

      Layout: {
        // Header
        headerBg: "#1f1f1f",
        headerHeight: 64,
        headerPadding: "0 24px",
        headerColor: "#e8f0f7",
        headerBorderBottom: "1px solid #3a3a3a",

        // Sider
        siderBg: "#1f1f1f",
        lightSiderBg: "#1f1f1f",
        lightTriggerBg: "#2a2a2a",
        lightTriggerColor: "#1a7fa6",
        triggerBg: "#2a2a2a",
        triggerColor: "#1a7fa6",
        triggerHeight: 48,
        zeroTriggerWidth: 36,
        zeroTriggerHeight: 42,

        // Body/Content
        bodyBg: "#141414",

        // Footer
        footerBg: "#1f1f1f",
        footerPadding: "24px 50px",
        footerBorderTop: "1px solid #3a3a3a",

        // Collapsed Sider
        collapsedWidth: 80,
        siderBorderRight: "1px solid #3a3a3a",
      },

      Table: {
        headerBg: "#262626",
        headerColor: "#e8f0f7",
        headerSortActiveBg: "rgba(26, 127, 166, 0.15)",
        headerSortHoverBg: "rgba(26, 127, 166, 0.1)",
        bodySortBg: "#1a1a1a",
        rowHoverBg: "rgba(255, 255, 255, 0.03)",
        rowSelectedBg: "rgba(26, 127, 166, 0.15)",
        rowSelectedHoverBg: "rgba(26, 127, 166, 0.2)",
        borderColor: "#3a3a3a",
        headerBorderRadius: 8,
      },

      Card: {
        colorBgContainer: "#1f1f1f",
        colorBorderSecondary: "#3a3a3a",
        borderRadiusLG: 12,
        boxShadowTertiary: "0 2px 8px rgba(0, 0, 0, 0.45)",
        headerBg: "transparent",
        headerFontSize: 16,
        headerFontSizeSM: 14,
        headerHeight: 56,
        headerHeightSM: 48,
      },

      Input: {
        colorBgContainer: "#1f1f1f",
        colorBorder: "#3a3a3a",
        colorText: "#e8f0f7",
        colorTextPlaceholder: "#5a6c7d",
        hoverBorderColor: "#1a7fa6",
        activeBorderColor: "#1a7fa6",
        activeShadow: "0 0 0 2px rgba(26, 127, 166, 0.15)",
        errorActiveShadow: "0 0 0 2px rgba(255, 120, 117, 0.15)",
        warningActiveShadow: "0 0 0 2px rgba(255, 169, 64, 0.15)",
      },

      Select: {
        colorBgContainer: "#1f1f1f",
        colorBorder: "#3a3a3a",
        colorText: "#e8f0f7",
        colorTextPlaceholder: "#5a6c7d",
        optionSelectedBg: "rgba(26, 127, 166, 0.2)",
        optionActiveBg: "rgba(255, 255, 255, 0.03)",
        optionSelectedColor: "#1a7fa6",
        selectorBg: "#1f1f1f",
      },

      Modal: {
        contentBg: "#1f1f1f",
        headerBg: "#1f1f1f",
        titleColor: "#e8f0f7",
        titleFontSize: 18,
        borderRadiusLG: 12,
        boxShadow:
          "0 6px 16px 0 rgba(0, 0, 0, 0.55), 0 3px 6px -4px rgba(0, 0, 0, 0.65), 0 9px 28px 8px rgba(0, 0, 0, 0.45)",
      },

      Tabs: {
        itemColor: "#8896a4",
        itemHoverColor: "#1a7fa6",
        itemSelectedColor: "#1a7fa6",
        itemActiveColor: "#1a7fa6",
        inkBarColor: "#1a7fa6",
        cardBg: "#262626",
        cardHeight: 44,
      },

      Tag: {
        defaultBg: "#262626",
        defaultColor: "#e8f0f7",
      },

      Alert: {
        colorInfoBg: "rgba(26, 127, 166, 0.15)",
        colorInfoBorder: "#1a7fa6",
        colorInfoText: "#40a9ff",
        colorWarningBg: "rgba(255, 169, 64, 0.15)",
        colorWarningBorder: "#ffa940",
        colorWarningText: "#ffc069",
      },

      Badge: {
        colorPrimary: "#ffa940",
        textFontSize: 12,
        textFontSizeSM: 10,
        textFontWeight: "normal",
      },

      Breadcrumb: {
        itemColor: "#8896a4",
        lastItemColor: "#e8f0f7",
        linkColor: "#8896a4",
        linkHoverColor: "#1a7fa6",
        separatorColor: "#5a6c7d",
        fontSize: 14,
      },

      Notification: {
        colorBgElevated: "#1f1f1f",
        colorText: "#e8f0f7",
        colorTextHeading: "#e8f0f7",
        colorIcon: "#1a7fa6",
        colorIconHover: "#2ba0cc",
        borderRadiusLG: 12,
        boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.55)",
      },

      Progress: {
        defaultColor: "#1a7fa6",
        remainingColor: "#3a3a3a",
        circleTextColor: "#e8f0f7",
        lineBorderRadius: 100,
      },

      Steps: {
        colorPrimary: "#1a7fa6",
        colorText: "#8896a4",
        colorTextDescription: "#5a6c7d",
        finishIconBorderColor: "#1a7fa6",
        navArrowColor: "#1a7fa6",
      },

      Switch: {
        colorPrimary: "#1a7fa6",
        colorPrimaryHover: "#2ba0cc",
        colorTextQuaternary: "#5a6c7d",
        colorTextTertiary: "#8896a4",
      },

      Radio: {
        colorPrimary: "#1a7fa6",
        buttonBg: "#1f1f1f",
        buttonCheckedBg: "#1f1f1f",
        buttonColor: "#8896a4",
        buttonCheckedBgDisabled: "#262626",
        buttonSolidCheckedColor: "#141414",
      },

      Checkbox: {
        colorPrimary: "#1a7fa6",
        colorPrimaryHover: "#2ba0cc",
        colorBorder: "#3a3a3a",
        borderRadiusSM: 4,
      },

      Pagination: {
        itemBg: "#1f1f1f",
        itemActiveBg: "#1a7fa6",
        itemActiveColorDisabled: "#5a6c7d",
        itemInputBg: "#1f1f1f",
        itemLinkBg: "#1f1f1f",
        itemDisabledBgActive: "#262626",
        itemDisabledColorActive: "#5a6c7d",
      },

      Tooltip: {
        colorBgSpotlight: "rgba(31, 31, 31, 0.95)",
        colorTextLightSolid: "#e8f0f7",
        borderRadius: 6,
      },

      Popover: {
        colorBgElevated: "#1f1f1f",
        colorText: "#e8f0f7",
        borderRadiusLG: 8,
        boxShadowSecondary: "0 6px 16px 0 rgba(0, 0, 0, 0.55)",
      },

      Dropdown: {
        colorBgElevated: "#1f1f1f",
        colorText: "#e8f0f7",
        controlItemBgHover: "rgba(255, 255, 255, 0.03)",
        controlItemBgActive: "rgba(26, 127, 166, 0.15)",
        borderRadiusLG: 8,
        boxShadowSecondary: "0 6px 16px 0 rgba(0, 0, 0, 0.55)",
      },
    },
  },
};

// ==================== CÁCH SỬ DỤNG ====================
/*
import { ConfigProvider, theme } from 'antd';
import { useState } from 'react';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  return (
    <ConfigProvider
      theme={isDarkMode ? themeConfig.dark : themeConfig.light}
    >
      <YourAppContent />
      <Button onClick={() => setIsDarkMode(!isDarkMode)}>
        Toggle Theme
      </Button>
    </ConfigProvider>
  );
}
*/

export default themeConfig;
