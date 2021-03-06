﻿using System.Web;
using System.Web.Optimization;

namespace WebGame
{
    public class BundleConfig
    {
        // 如需統合的詳細資訊，請瀏覽 https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // 使用開發版本的 Modernizr 進行開發並學習。然後，當您
            // 準備好可進行生產時，請使用 https://modernizr.com 的建置工具，只挑選您需要的測試。
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css", "~/Content/OUAT.css"));
            bundles.Add(new ScriptBundle("~/Scripts/jsGrid").Include(
          "~/Scripts/jsgrid-1.5.3/jsgrid.min.js"));
            bundles.Add(new StyleBundle("~/Scripts/jsGridCSS").Include(
                      "~/Scripts/jsgrid-1.5.3/jsgrid.min.css",
                      "~/Scripts/jsgrid-1.5.3/jsgrid-theme.min.css"));
            bundles.Add(new ScriptBundle("~/Scripts/WebJS").Include(
                "~/Scripts/WebJS/OUAT.js"));
        }
    }
}
