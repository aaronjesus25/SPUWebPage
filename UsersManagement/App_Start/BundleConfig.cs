using System.Web;
using System.Web.Optimization;

namespace UsersManagement
{
    public class BundleConfig
    {
        // Para obtener más información sobre las uniones, visite https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Utilice la versión de desarrollo de Modernizr para desarrollar y obtener información. De este modo, estará
            // para la producción, use la herramienta de compilación disponible en https://modernizr.com para seleccionar solo las pruebas que necesite.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            //Jquery
            bundles.Add(new ScriptBundle("~/bundles/jqueryjs").Include("~/Content/jquery2.1.3/jquery.min.js"));

            //ControlsWeb>>js
            bundles.Add(new ScriptBundle("~/bundles/controljs").Include(
                "~/Content/bootstrap3.3.5/js/bootstrap.min.js",
                "~/Content/noty2.3.7/packaged/jquery.noty.packaged.min.js",
                "~/Content/dynatable0.3.1/jquery.dynatable.js",
                "~/Content/jqueryvalidation/jquery-validate.min.js",
                "~/Content/alertify0/js/alertify.js",
                "~/Content/jalert3/jAlert-v3.min.js",
                "~/Content/jalert3/jAlert-functions.min.js",
                "~/Content/select1.7.4/js/bootstrap-select.js",
                "~/Content/datepicker2.4.5/jquery.datetimepicker.full.js",
                "~/Content/datepicker2.4.5/locale/es.js",
                "~/Content/alertifyjs1.0.8/js/alertify.js",
                "~/Content/spinner/spin.js",
                 "~/Content/bootstrap-dropdown-hover/bootstrap-dropdownhover.js"
                ));
        }
    }
}
